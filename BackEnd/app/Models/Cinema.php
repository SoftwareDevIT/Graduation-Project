<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cinema extends Model
{
    use HasFactory;
    protected $table = 'cinema';
    protected $fillable = [
        'cinema_id',
        'cinema_name',
        'phone',
        'location_id',
        'cinema_address',
        'status',
        'created_at',
        'updated_at',
    ];
}
