<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeatMap extends Model
{
    protected $table = "seat_map";
    protected $fillable = [
        'name',
        'description',
        'matrix_row',
        'matrix_column',
        'seat_structure',
    ];

    protected $casts = [
        'seat_structure' => 'array', // Tự động cast JSON thành array khi truy cập
    ];
}
