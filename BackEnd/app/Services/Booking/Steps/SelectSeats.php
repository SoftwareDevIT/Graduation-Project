<?php

namespace App\Services\Booking\Steps;

use App\Jobs\ResetSeats;
use App\Models\Seats;
use App\Services\Booking\Handlers\AbstractBookingStep;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Session;
use App\Http\Requests\SeatRequet;

class SelectSeats extends AbstractBookingStep
{
    // protected function process(Request $request): ?array
    // {
    //     // Lấy seat_ids từ request
    //     $seatIds = $request->input('seatIds');

    //     // Kiểm tra seatIds có phải là mảng không và không phải null
    //     if (!is_array($seatIds)) {
    //         return ['errors' => ['Invalid seat IDs.']];
    //     }

    //     if (count($seatIds) > 10) {
    //         return ['errors' => ['You cannot reserve more than 10 seats at a time.']];
    //     }
    //     // Tìm các ghế dựa trên seatIds
    //     $seats = $this->findSeats($seatIds);

    //     // Nếu không có ghế nào được tìm thấy
    //     if ($seats->isEmpty()) {
    //         return ['errors' => ['No seats found.']];
    //     }

    //     $response = [];
    //     foreach ($seats as $seat) {
    //         if (!$seat) {
    //             $response[] = $this->seatNotFoundResponse();
    //             continue;
    //         }

    //         if ($seat->reserved_until && now()->lessThanOrEqualTo($seat->reserved_until)) {
    //             return  $response[] = ['errors' => ['Seat ID ' . $seat->id . ' is already reserved.']];
    //             // continue;
    //         } else {
    //             $this->handleReservationStatus($seat);
    //             $this->reserveSeat($seat);
    //             $this->dispatchResetSeatsJob($seat);
    //             $this->storeSeatInSession($seat);
    //             $response[] = $this->successfulReservationResponse($seat);
    //         }
    //     }

    //     return ['seat' =>  $response];
    // }

    // private function findSeats(array $seatIds): Collection
    // {
    //     return Seats::whereIn('id', $seatIds)->get();
    // }

    // private function seatNotFoundResponse(): array
    // {
    //     return [
    //         'status' => false,
    //         'message' => 'Seat not found.'
    //     ];
    // }

    // private function handleReservationStatus(Seats $seat): void
    // {
    //     if ($seat->reserved_until <= now()) {
    //         $seat->reserved_until = null;
    //         $seat->status = 'Show';
    //         $seat->save();
    //     }
    // }

    // private function reserveSeat(Seats $seat): void
    // {
    //     $seat->reserved_until = now()->addMinutes(2);
    //     $seat->status = 'Hidden';
    //     $seat->save();
    // }

    // private function dispatchResetSeatsJob(Seats $seat): void
    // {
    //     $job = new ResetSeats($seat); // Tạo job mới
    //     $jobId = Queue::later(now()->addMinutes(1), $job);
    //     Log::info('Job ID: ' . $jobId);
    // }

    // private function storeSeatInSession(Seats $seat): void
    // {
    //     $reservedSeats = Session::get('reserved_seats', []);
    //     $reservedSeats[$seat->id] = $seat;
    //     Session::put('reserved_seats', $reservedSeats);
    // }

    // private function successfulReservationResponse(Seats $seat): array
    // {
    //     return [
    //         'status' => true,
    //         'data' => $seat,
    //         'message' => 'Seat ' . $seat->id . ' reserved successfully.'
    //     ];
    // }


    // protected function process(Request $request): ?array
    // {
    //     $seatId = $request->route('seatIds');
    //     $seat = Seats::find($seatId);

    //     Log::info($seatId);
    //     if (!$seat) {
    //         return $this->seatNotFoundResponse();
    //     }
    //     if ($seat->reserved_until && now()->lessThanOrEqualTo($seat->reserved_until)) {
    //         return ['errors' => ['Seat is already reserved.']];
    //     }
    //     $seat->reserved_until = now()->addMinutes(2);
    //     $seat->status = 'Hidden';
    //     $seat->save();
    //     Session::put('reserved_seats.' . $seatId, $seat);
    //     $this->handleReservationStatus($seat);
    //     $this->reserveSeat($seat);
    //     $this->dispatchResetSeatsJob($seat);
    //     $this->storeSeatInSession($seat);
    //     return ['seat' => $seat];
    // }
    // private function findSeat($seatId): ?Seats
    // {
    //     return Seats::find($seatId);
    // }
    // private function seatNotFoundResponse(): array
    // {
    //     return [
    //         'status' => false,
    //         'message' => 'Seat not found.'
    //     ];
    // }
    // private function handleReservationStatus(Seats $seat): void
    // {
    //     if ($seat->reserved_until <= now()) {
    //         $seat->reserved_until = null;
    //         $seat->status = 'Show';
    //         $seat->save();
    //     }
    // }
    // private function reserveSeat(Seats $seat): void
    // {
    //     $seat->reserved_until = now()->addMinutes(2);
    //     $seat->status = 'Hidden';
    //     $seat->save();
    // }
    // private function dispatchResetSeatsJob(Seats $seat): void
    // {
    //     $job = new ResetSeats($seat); // Tạo job mới
    //     $jobId = Queue::later(now()->addMinutes(1), $job);
    //     Log::info('Job ID: ' . $jobId);
    // }
    // private function storeSeatInSession(Seats $seat): void
    // {
    //     Session::put('reserved_seat', $seat);
    // }
    // private function successfulReservationResponse(Seats $seat): array
    // {
    //     return [
    //         'status' => true,
    //         'data' => $seat,
    //         'message' => 'Seat reserved successfully.'
    //     ];
    // }
    protected function process(Request $request): ?array
    {
        $seats = $request->input('seats');
        if (!$seats) {
            return ['errors' => ['seats' => 'Seat Not Found']];
        }
        if (is_array($seats) && count($seats) > 10) {
            return ['errors' => ['seats' => 'You can only select up to 10 seats']];
        }
        if (is_array($seats)) {
            foreach ($seats as $seatData) {
                $seat = Seats::where('seat_name', $seatData['seat_name'])
                    ->where('seat_row', $seatData['seat_row'])
                    ->where('seat_column', $seatData['seat_column'])
                    ->where('room_id', $seatData['room_id'])
                    ->first();
                if ($seat) {
                    $seatDataList[] = $seat->toArray();
                    return ['errors' => ['seat' => 'Seat already exists.']];
                } else {
                    $seatCreate = Seats::create($seatData);
                    if ($seatCreate) {
                        $seatCreate->reserveForUser();
                        $seatDataList[] = $seatCreate->toArray();

                        // Sau khi xử lý tất cả ghế, dispatch job cho tất cả các ghế
                        $this->dispatchResetSeatsJob($seatCreate);
                        // $this->storeSeatInSession($seatCreate); // Truyền toàn bộ mảng ghế
                    } else {
                        // Xử lý khi việc tạo ghế thất bại
                        return ['errors' => ['seat' => 'Failed to create seat.']];
                    }
                }
            }
        } else {
            return [];
        }
        return ['seats_data' => $seatDataList ?? []];
    }
    private function dispatchResetSeatsJob(Seats $seat): void
    {
        Queue::later(now()->addMinutes(5), new ResetSeats($seat));
    }
    private function storeSeatInSession(Seats $seat): void
    {
        $reservedSeats = Session::get('reserved_seats', []);
        $reservedSeats[$seat->id] = $seat;
        Session::put('reserved_seats', $reservedSeats);
    }
}
