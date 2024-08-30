<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Combo extends Model
{
    use HasFactory;
    protected $table = 'combos';
    protected $fillable = [
        'combo_id',
        'combo_name',
        'images',
        'price',
        'status',
        'created_at',
        'updated_at',
    ];
}
