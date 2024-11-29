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

    public function seats()
    {
        return $this->hasMany(Seats::class);
    }

    public function showtimes()
    {
        return $this->hasMany(Showtime::class);
    }
    public function layout()
    {
        return $this->belongsTo(SeatLayout::class);
    }
}
