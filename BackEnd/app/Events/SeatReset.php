<?php

namespace App\Events;

use App\Models\Seats;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SeatReset implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $seatId; // ID cuối cách
    public function __construct(array $seatId)
    {
        $this->seatId = $seatId;
    }

    public function broadcastOn():Channel
    {
        return new Channel('seats');
    }

    public function broadcastWith():array
    {
        return [
            'seat' => $this->seatId,
            'message' => 'Seat has been reset'
        ];
    }
    //     public $seatId; // ID của ghế

    //     public function __construct(Seats $seat)
    //     {
    //         // Lưu ID của ghế
    //         $this->seatId = $seat->id;

    //         // Ghi log khi sự kiện được tạo
    //         Log::info('SeatReset event triggered for seat with ID: ' . $this->seatId);
    //     }

    //     public function broadcastOn(): Channel
    //     {
    //         // Ghi log về việc phát sự kiện
    //         Log::info('Broadcasting seat reset event for seat with ID: ' . $this->seatId);

    //         // Phát trên kênh 'seats'
    //         return new Channel('seats');
    //     }

    //     public function broadcastWith(): array
    //     {
    //         // Trả về thông tin của ghế được phát qua event
    //         return [
    //             'seat' => $this->seatId,
    //             'message' => 'Seat has been reset'
    //         ];
    //     }
}
