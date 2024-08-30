<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;
    protected $table = 'booking';
    protected $fillable = [
        'booking_id',
        'user_id',
        'showtime_id',
        'seat_id',
        'pay_method_id',
        'combo_id',
        'amount',
        'seat_status',
        'created_at',
        'updated_at',
    ];
}
