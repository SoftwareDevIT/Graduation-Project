<?php

namespace App\Events;

use App\Models\Seats;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SeatReset implements ShouldBroadcast
{
    public $validSeatIds;
    public $userId;
    public function __construct(array $validSeatIds)
    {
        // Truyền mảng seat IDs
        $this->userId = auth()->user()->id;
        $this->validSeatIds = $validSeatIds;
    }

    public function broadcastOn()
    {
        // Kênh broadcast
        return new PrivateChannel('seats'.$this->userId);
    }

    public function broadcastWith(): array
    {
        // Trả về mảng seatIds và thông báo, chỉ một lần
        // Kênh được format là 'seats-{userId}' e.g. 'seats-1'
        Log::info("broadcastWith");
        return [
            'userId'=> $this->userId,
            'seats' => $this->validSeatIds, 
            'message' => 'Seats have been reset',
        ];
    }
}


