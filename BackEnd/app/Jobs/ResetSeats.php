<?php

namespace App\Jobs;

use App\Models\Seats;
use App\Models\Booking;
use App\Models\TemporaryBooking;
use App\Events\SeatReset;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Carbon\Carbon;

class ResetSeats implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $seat;

    /**
     * Nhận vào đối tượng ghế cần reset.
     */
    public function __construct(Seats $seat)
    {
        $this->seat = $seat;
    }

    /**
     * Thực hiện Job.
     */
    public function handle(): void
    {
        Log::info('ResetSeat job is running for seat ID: ' . $this->seat->id);

        // Tìm ghế mới nhất từ cơ sở dữ liệu
        $seat = Seats::find($this->seat['id']);
        Log::info('Seat found with ID: ' . $seat->id);
        if (!$seat) {
            Log::error('Seat not found with ID: ' . $this->seat->id);
            return;
        }

        if ($seat->status == 'Reserved Until' && $seat->reserved_until < now()) {
            Log::info('Seat reserved time expired for seat ID: ' . $seat->id);

            // Tìm booking liên quan đến ghế này
            $booking = Booking::whereHas('seats', function ($query) use ($seat) {
                $query->where('seats.id', $seat->id);
            })->first();

            if (!$booking) {
                Log::info('No booking found for seat ID: ' . $seat->id);
                return;
            }
            if ($booking) {
                // Xóa các ghế liên quan khỏi bảng booking_seats
                $booking->seats()->detach($seat->id);

                // Xóa các combo liên quan khỏi bảng booking_combos
                $booking->combos()->detach();

                // Nếu không còn ghế nào trong booking, xóa booking
                if ($booking->seats()->count() == 0) {
                    Log::info('Deleting booking ID: ' . $booking->id . ' because it has no seats left.');
                    $booking->delete();
                }
            }
            $seatId = [$seat->id];  // Nếu có nhiều ghế, bạn cần gom chúng vào mảng.
            // Phát sự kiện chỉ một lần cho tất cả các ghế
            broadcast(new SeatReset($seatId));
            Log::info('SeatReset event broadcasted for seats: ' . implode(',', $seatId));

            // Xóa ghế
            $temporaryBooking = TemporaryBooking::latest()->first();
            if ($temporaryBooking) {
                Log::info('Deleting temporary booking for seat ID: ' . $seat->id);
                $temporaryBooking->delete();
            }
            $seat->delete();

            // Xóa dữ liệu tạm nếu có

            // Phát sự kiện sau khi ghế đã được xóa

        } elseif ($seat->status == 'Booked') {
            $seat->reserved_until = null;
            $seat->save();
            Log::info('Seat is still reserved or booked, no action taken for seat ID: ' . $seat->id);
        }
    }
}
