<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeatMap extends Model
{
    use HasFactory;

    protected $table = 'seat_map';

    protected $fillable = [
        'seat_layout_id',
        'row',
        'column',
        'type',
    ];

    // Link back to the SeatLayout
    public function seatLayout()
    {
        return $this->belongsTo(SeatLayout::class);
    }
}
