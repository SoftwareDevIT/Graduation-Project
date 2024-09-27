<?php

namespace App\Http\Controllers\Api\Booking;

use App\Events\InvoiceCreated;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Seats;
use App\Models\TemporaryBooking;
use App\Services\Booking\TicketBookingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BookingController extends Controller
{
    protected TicketBookingService $ticketBookingService;

    public function __construct(TicketBookingService $ticketBookingService)
    {
        $this->ticketBookingService = $ticketBookingService;
    }

    public function bookTicket(Request $request)
    {
        $result = $this->ticketBookingService->bookTicket($request);
        if (isset($result['errors'])) {
            return response()->json($result, 400); // Trả về lỗi với status 400
        }

        // Nếu tất cả các bước thành công, trả về phản hồi thành công
        return response()->json([
            'status' => true,
            'message' => 'Booking completed successfully!',
            'data' => $result
        ]);
    }

    public function vnPayReturn(Request $request)
    {
        Log::info($request->all());
        $data = $request->only(['vnp_TxnRef', 'vnp_ResponseCode']);
        $temporaryBooking = TemporaryBooking::latest()->first();
        $reservedSeats = $temporaryBooking->reserved_seats;
        // dd($reservedSeats);
        if (is_string($reservedSeats)) {
            $reservedSeats = json_decode($reservedSeats, true);
        }
        // Kiểm tra mã phản hồi từ VNPAY
        if ($data['vnp_ResponseCode'] == "00") {
            $booking = Booking::where('id', $data['vnp_TxnRef'])->first();
            Log::info('Booking ID: ' . $booking);
            // $booking->combos()->sync($combos->pluck('id'));
            $booking->seats()->sync(collect($reservedSeats)->pluck('id'));
            Seats::updateSeatsStatus(collect($reservedSeats)->pluck('id')->toArray(), 'booked');

            // Thanh toán thành công, thực hiện sự kiện và listener
            event(new InvoiceCreated($booking));
            $temporaryBooking->delete();

            return response()->json([
                'status' => true,
                'message' => 'Payment successful',
                'data' => $booking
            ]);
        }
    }
}
