<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seats extends Model
{
    use HasFactory;
    protected $table = 'seats';
    protected $fillable = [
        'number_seat',
        'price',
        'taken',
        'showtime_id',
        'category_seat_id',
    ];

    public function categorySeat()
    {
        return $this->belongsTo(CategorySeat::class, 'category_seat_id');
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}
