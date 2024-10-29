<?php

namespace App\Services\Booking;

use App\Http\Requests\Booking\TicketBookingRequest;
use App\Models\Booking;
use App\Models\Seats;
use App\Services\Booking\Steps\SelectMovie;
use App\Services\Booking\Steps\SelectSeats;
use App\Services\Booking\Steps\SelectCombos;
use App\Services\Booking\Steps\ProcessPayment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $this->selectMovieStep->setNext($this->selectSeatsStep)
            ->setNext($this->selectCombosStep);
    }
    public function bookingTicket(Request $req)
    {
        $result = $this->selectMovieStep->handle($req);
        if ($result instanceof JsonResponse) {
            return $result;
        }
        $booking = $this->bookTicket($req);
        return $result;
    }
    // public function selectMovieSeats(Request $request)
    // {
    //     $result = $this->selectMovieStep->handle($request);
    //     if ($result instanceof JsonResponse) {
    //         return $result;
    //     }
    //     //Xử lý đặt ghế
    //     $result = $this->selectSeatsStep->handle($request);
    //     session()->put('seatss', $result);
    //     Log::info('Seats result: ' . json_encode($result));
    //     if ($result instanceof JsonResponse) {
    //         return $result;
    //     }
    //     return null;
    // }


    // public function selectCombos(Request $request)
    // {
    //     $result = $this->selectCombosStep->handle($request);
    //     if ($result instanceof JsonResponse) {
    //         return $result;
    //     }
    //     return null;
    // }
    public function ticketBooking() {}
    public function bookTicket(Request $request)
    {
        Log::info('Booking request: ' . json_encode($request->all()));
        $bookTicket = $this->bookings($request);
        session(['booking' => $bookTicket->id]);  // Lưu thông tin booking vào session
        Log::info('Booking: ' . session('booking'));
        if ($bookTicket) {
            $this->bookTicketSaveSession($request, $bookTicket,);
        }
        return response()->json(['message' => 'Đặt vé thành công', 'booking' => $bookTicket]);
    }


    public function bookTicketSaveSession(Request $request, $booking)
    {
        // Kiểm tra xem session có chứa combos không
        if (session()->has('combos') && session('combos')) {
            foreach (session('combos') as $combo) {
                $booking->combos()->attach($combo->id, ['quantity' => $combo->quantity ?? 1]);
            }
        } else {
            Log::warning('No combos found in session.');
        }

        // Kiểm tra xem session có chứa seats không
        if (session()->has('seats') && session('seats')) {
            $booking->seats()->sync(collect(session('seats'))->pluck('id'));
            $seatIds = collect(session('seats'))->pluck('id')->toArray();
            Seats::updateSeatsStatus($seatIds, 'booked');
        } else {
            Log::warning('No seats found in session.');
        }
    }



    public function bookings(Request $request)
    {
        try {
            $booking = Booking::create($request->validated() + ['user_id' => Auth::user()->id]);
            return $booking;
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
        }
    }

    public function processPayment(Request $request)
    {
        Log::info('Combos in session: ' . json_encode(session('combos')));
        Log::info('Seats in session: ' . json_encode(session('seats')));
        if ($request->pay_method_id == 1) {
            $urlPayment = $this->processPaymentStep->vnpay($request);  // Gọi phương thức VNPAY
            return response()->json(['url' => $urlPayment]);
        } elseif ($request->pay_method_id == 2) {
            $urlPayment = $this->processPaymentStep->momo($request);  // Gọi phương thức MOMO
            return response()->json(['url' => $urlPayment]);
        } else {
            // Xóa booking nếu phương thức thanh toán không hợp lệ
            Booking::where('id', session('booking'))->delete();
            return response()->json(['message' => 'Phương thức thanh toán chưa hoàn thiện. Vui lòng chọn lại!'], 400);
        }
    }
}
