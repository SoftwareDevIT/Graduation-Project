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
    }
    public function selectMovieSeats(Request $request)
    {
        $result = $this->selectMovieStep->handle($request);
        if ($result instanceof JsonResponse) {
            return $result;
        }
        //Xử lý đặt ghế
        $result = $this->selectSeatsStep->handle($request);
        session()->put('seatss', $result);
        Log::info('Seats result: ' . json_encode($result));
        if ($result instanceof JsonResponse) {
            return $result;
        }
        return null;
    }


    public function selectCombos(Request $request)
    {
        $result = $this->selectCombosStep->handle($request);
        if ($result instanceof JsonResponse) {
            return $result;
        }
        return null;
    }

    public function bookTicket(TicketBookingRequest $request)
    {
        Log::info('Booking request: ' . json_encode($request->all()));
        $bookTicket = $this->bookings($request);
        if ($bookTicket) {
            $this->bookTicketSaveSession($request, $bookTicket,);
        }
        return response()->json(['message' => 'Đặt vé thành công', 'booking' => $bookTicket]);
    }


    public function bookTicketSaveSession(Request $request, $booking)
    {
        session(['booking' => $booking->id]);
        Log::info('Booking: ' . session('booking'));
        if (session()->has('combos')) {
            Log::info('Combos: ' . json_encode(session('combos')));
            foreach (session('combos') as $combo) {
                $booking->combos()->attach($combo->id, ['quantity' => $combo->quantity ?? 1]);
            }
        }
        if (session()->has('seats')) {
            Log::info('Seats: ' . json_encode(session('seats')));
            $booking->seats()->sync(collect(session('seats'))->pluck('id'));
            $seatIds = collect(session('seats'))->pluck('id')->toArray(); // Lấy danh sách các ID từ session
            Seats::updateSeatsStatus($seatIds, 'booked');
        }
    }

    public function bookings(TicketBookingRequest $request)
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
        if ($request->pay_method_id == 1) {
            $urlPayment =   $this->processPaymentStep->process($request);
            return $urlPayment;
        } else {
            Booking::where('id', session('booking'))->delete();
            return response()->json(['message' => 'Phương thức thanh toán chưa hoàn thiện . Vui lòng chọn lại !']);
        }
    }
}
