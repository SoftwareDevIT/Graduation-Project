<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MovieCategory extends Model
{
    use HasFactory;
    protected $table = 'movie_category';
    protected $fillable = [
        'movie_category_id',
        'category_name',
        'descripcion',
        'status',
        'created_at',
        'updated_at',
    ];
}
