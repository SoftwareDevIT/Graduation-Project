<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $table = 'room';

    protected $fillable = [
        'room_name',
        'cinema_id',
        'seat_layout_id',
        'status',
    ];

    // Define relation to SeatLayout
    public function seatLayout()
    {
        return $this->belongsTo(SeatLayout::class);
    }

    // Define relation to Showtimes
    public function showtimes()
    {
        return $this->hasMany(Showtime::class);
    }

    // Relation to Cinema
    public function cinema()
    {
        return $this->belongsTo(Cinema::class);
    }

    public function cinema()
    {
        return $this->belongsTo(Cinema::class);
    }
}
