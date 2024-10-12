<?php

namespace App\Http\Controllers\Api\Booking;

use App\Events\InvoiceCreated;
use App\Events\InvoiceSendMail;
use App\Http\Controllers\Controller;
use App\Http\Requests\Booking\TicketBookingRequest;
use App\Jobs\ResetSeats;
use App\Mail\InvoiceMail;
use App\Models\Booking;
use App\Models\Seats;
use App\Models\TemporaryBooking;
use App\Services\Booking\TicketBookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class BookingController extends Controller
{
    protected TicketBookingService $ticketBookingService;

    public function __construct(TicketBookingService $ticketBookingService)
    {
        $this->ticketBookingService = $ticketBookingService;
    }

    public function slectMovieAndSeats(Request $request)
    {
        try {
            $selectMovieAndSeat = $this->ticketBookingService->selectMovieSeats($request);
            return $selectMovieAndSeat;
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function selectCombos(Request $request)
    {
        try {
            $selectCombos = $this->ticketBookingService->selectCombos($request);
            return $selectCombos;
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }


    public function bookTicket(TicketBookingRequest $request)
    {
        try {
            $this->ticketBookingService->bookTicket($request);
            // if ($bookTickets) {
            //     session()->put('booking', $bookTickets);
            //     Log::info('Booking: ' . json_encode(session('booking')));
            // }
            if (session()->has('booking')) {
                $urlPayment = $this->ticketBookingService->processPayment($request);
                return $this->success($urlPayment, 'Đặt vé thành công', );
            }
            return $this->error('Đặt vé thất bại', 500);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function vnpayReturn(Request $request)
    {
        $data = $request->only(['vnp_TxnRef', 'vnp_ResponseCode']);
        if($data['vnp_ResponseCode'] == "00")
        {
            $booking = Booking::where('id', $data['vnp_TxnRef'])->first();
            event(new InvoiceSendMail($booking));
            session()->flush();
            return redirect('http://localhost:5173/');
        }
    }

}
