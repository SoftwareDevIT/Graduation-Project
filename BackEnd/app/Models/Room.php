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
        'volume',
        'cinema_id',
        'quantity_double_seats',
        'quantity_vip_seats',
        'quantity_basic_seats',
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
}
