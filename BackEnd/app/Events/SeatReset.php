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
    public $validSeatIds;

    public function __construct(array $validSeatIds)
    {
        // Truyền mảng seat IDs
        $this->validSeatIds = $validSeatIds;
    }

    public function broadcastOn()
    {
        // Kênh broadcast
        return new Channel('seats');
    }

    public function broadcastWith(): array
    {
        // Trả về mảng seatIds và thông báo, chỉ một lần
        return [
            'seats' => $this->validSeatIds,  // Trả về mảng các seat ID
            'message' => 'Seats have been reset'
        ];
    }
}


