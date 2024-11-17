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
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Session;

class BookingController extends Controller
{
    protected TicketBookingService $ticketBookingService;

    public function __construct(TicketBookingService $ticketBookingService)
    {
        $this->ticketBookingService = $ticketBookingService;
    }

    // public function slectMovieAndSeats(Request $request)
    // {
    //     try {
    //         $selectMovieAndSeat = $this->ticketBookingService->selectMovieSeats($request);
    //         return $selectMovieAndSeat;
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'status' => false,
    //             'message' => $e->getMessage()
    //         ]);
    //     }
    // }

    // public function selectCombos(Request $request)
    // {
    //     try {
    //         $selectCombos = $this->ticketBookingService->selectCombos($request);
    //         return $selectCombos;
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'status' => false,
    //             'message' => $e->getMessage()
    //         ]);
    //     }
    // }


    public function bookTicket(TicketBookingRequest $request)
    {
        try {
            $data = $this->ticketBookingService->bookingTicket($request);

            if ($data instanceof JsonResponse) {
                return $data;  // Trả về URL thanh toán hoặc lỗi nếu có
            }
            if (session()->get('booking')) {
                $paymentURL = $this->ticketBookingService->processPayment($request);
                return response()->json([
                    'status' => true,
                    'message' => 'Đặt vé thành công',
                    'Url' => $paymentURL
                ]);
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
        if ($data['vnp_ResponseCode'] == "00") {
            $booking = Booking::where('id', $data['vnp_TxnRef'])->first();
            $booking->status = 'Pain';
            $booking->save();
            Mail::to($booking->user->email)->queue(new InvoiceMail($booking));
            // event(new InvoiceSendMail($booking));
            session()->flush();
            return redirect('http://localhost:5173/movieticket');
            // return $this->success($booking, 'success');
        }
    }

    public function selectSeats(Request $request)
    {
        $seats = $request->input('seats');
        $existingSeats = [];
        $seatDataList = [];
        if (is_array($seats) && count($seats) > 10) {
            return response()->json(['status' => false, 'message' => 'You can only select up to 10 seats.'], 400);
        }

        if (!$seats) {
            return response()->json(['status' => false, 'message' => 'Please select at least one seat.'], 400);
        }
        if (is_array($seats)) {
            foreach ($seats as $seatData) {
                // Kiểm tra xem ghế đã tồn tại
                $seat = Seats::where('seat_name', $seatData['seat_name'])
                    ->where('seat_row', $seatData['seat_row'])
                    ->where('seat_column', $seatData['seat_column'])
                    ->where('room_id', $seatData['room_id'])
                    ->first();

                if ($seat) {
                    // Lưu ghế đã tồn tại vào danh sách lỗi
                    $existingSeats[] = $seat->toArray();
                } else {
                    // Tạo ghế mới
                    $seatCreate = Seats::create($seatData);

                    if ($seatCreate) {
                        $seatDataList[] = $seatCreate;
                        $seatCreate->reserveForUser();
                    } else {
                        return response()->json(['status' => false, 'message' => 'Failed to create seat.'], 500);
                    }
                }
            }

            // Nếu có ghế đã tồn tại, trả về danh sách các ghế đó
            if (!empty($existingSeats)) {
                return response()->json(['status' => false, 'message' => 'Some seats already exist.', 'data' => $existingSeats], 400);
            }

            // Nếu tạo ghế thành công, dispatch job cho tất cả ghế đã tạo
            if (!empty($seatDataList)) {
                $this->dispatchResetSeatsJob($seatDataList);
                // Lưu thông tin ghế vào session
                Session::put('seats', $seatDataList);
                Log::info('Seats Session: ' . json_encode(session('seats')));
            }

            return response()->json([
                'status' => true,
                'message' => 'Selected seats successfully.',
                'data' => $seatDataList
            ]);
        }
    }
    public  function dispatchResetSeatsJob(array $seatIds): void
    {
        // Dispatch một job với toàn bộ các ID ghế đã được tạo
        ResetSeats::dispatch($seatIds)->delay(now()->addMinutes(5));
    }
}