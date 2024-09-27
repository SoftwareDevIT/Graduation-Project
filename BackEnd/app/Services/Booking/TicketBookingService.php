<?php

namespace App\Services\Booking;

use App\Models\Booking;
use App\Models\Seats;
use App\Models\TemporaryBooking;
use App\Services\Booking\Steps\SelectMovie;
use App\Services\Booking\Steps\SelectSeats;
use App\Services\Booking\Steps\SelectCombos;
use App\Services\Booking\Steps\ProcessPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TicketBookingService
{
    protected SelectMovie $selectMovieStep;
    protected SelectSeats $selectSeatsStep;
    protected SelectCombos $selectCombosStep;
    protected ProcessPayment $processPaymentStep;

    public function __construct()
    {
        $this->selectMovieStep = new SelectMovie();
        $this->selectSeatsStep = new SelectSeats();
        $this->selectCombosStep = new SelectCombos();
        $this->processPaymentStep = new ProcessPayment();

        // Kết nối các bước
        $this->selectMovieStep->setNext($this->selectSeatsStep)
            ->setNext($this->selectCombosStep)
        ;
    }

    public function bookTicket($request)
    {
        $result = $this->selectMovieStep->handle($request);

        if (isset($result['errors'])) {
            return $result;
        }

        $data = $this->prepareBookingData($result);
        Log::info('Data for prepareBookingData:');
        // Gọi phương thức bookings với dữ liệu đã chuẩn bị
        $booking = $this->bookings(data: $data);
        Log::info('Data for bookings:');
        if (!$booking) {
            return [
                'status' => false,
                'message' => 'Booking failed!',
            ];
        }
        // Khi đã có booking, gọi hàm thanh toán
        $paymentRequest = new Request(array_merge($request->all(), ['boking_id' => $booking->id, 'amount' => $data['totalAmount']]));

        // Gọi hàm thanh toán VNPAY
        $paymentResult = $this->processPaymentStep->handle($paymentRequest);

        return [
            'status' => true,
            'message' => 'Booking completed successfully!',
            'data' => $paymentResult,
        ];
    }

    private function prepareBookingData(array $result)
    {
        // Tạo temporary booking
        $temporaryBooking = TemporaryBooking::create([
            'user_id' => 1,
            'reserved_showtime' => $result['movies'],
            'reserved_seats' => $result['seats_data'],
            'combos' => is_array($result['combos']) ? json_encode($result['combos']) : $result['combos']->toArray(),
        ]);

        return [
            'temporaryBooking' => $temporaryBooking,
            'reservedShowtime' => $result['movies'],
            'reservedSeats' => $result['seats_data'],
            'combos' => is_array($result['combos']) ? $result['combos'] : $result['combos']->toArray(),
            'totalAmount' => $this->calculateTotalAmount($result['seats_data'], is_array($result['combos']) ? $result['combos'] : $result['combos']->toArray()),
        ];
    }


    public function calculateTotalAmount(array $reservedSeats, array $combos): float
    {
        // Tính tổng giá cho các ghế đã chọn
        $totalSeatPrice = collect($reservedSeats)->sum('price');

        // Tính tổng giá cho các combo đã chọn dựa trên số lượng
        $totalComboPrice = collect($combos)->sum(function ($combo) {
            return $combo['price'] * ($combo['quantity'] ?? 1); // Giá combo nhân với số lượng
        });

        // Trả về tổng của giá ghế và giá combo
        return $totalSeatPrice + $totalComboPrice;
    }


    public function bookings($data)
    {
        $temporaryBooking = $data['temporaryBooking'];
        $reservedShowtime = $data['reservedShowtime'];
        $reservedSeats = $data['reservedSeats'];
        $combos = $data['combos'];
        $totalAmount = $data['totalAmount'];

        try {
            $booking = DB::transaction(function () use ($temporaryBooking, $reservedShowtime, $reservedSeats, $combos, $totalAmount) {
                // Tạo booking
                $booking = Booking::create([
                    'user_id' => $temporaryBooking->user_id,
                    'showtime_id' => $reservedShowtime[0]['showtimes'][0]['id'] ?? null,
                    'pay_method_id' => 1, // Sử dụng phương thức thanh toán mặc định
                    'amount' => $totalAmount,
                ]);

                foreach ($combos as $combo) {
                    $booking->combos()->attach($combo->id, ['quantity' => $combo->quantity ?? 1]);
                }
                $booking->seats()->sync(collect($reservedSeats)->pluck('id'));
                return $booking;
            });

            
            return $booking; // Trả về booking đã tạo
        } catch (\Exception $e) {
            Log::error('Error during booking creation: ' . $e->getMessage());
            return null;
        }
    }
}
