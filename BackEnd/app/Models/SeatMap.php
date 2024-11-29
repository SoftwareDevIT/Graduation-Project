<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeatMap extends Model
{
    use HasFactory;
    protected $table = 'seat_map';
    protected $primaryKey = 'id';
    protected $fillable = [
        'seat_layout_id',
        'row',
        'columns',
        'type',
    ];
}
