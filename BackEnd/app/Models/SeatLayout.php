<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeatLayout extends Model
{
    use HasFactory;
    protected $table = 'seat_layouts';
    protected $primaryKey = 'id';
    protected $fillable = [
        'name',
        'rows',
        'columns',
        'status',
    ];

    public function seatMap()
    {
        return $this->hasMany(SeatMap::class);
    }
}
