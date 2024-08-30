<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;
    protected $table = 'room';
    protected $fillable = [
        'room_id',
        'room_name',
        'cinema_id',
        'status',
        'created_at',
        'updated_at',
    ];
}
