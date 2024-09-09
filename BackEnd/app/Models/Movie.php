<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
    use HasFactory;
    protected $table = 'movie';
    protected $fillable = [
        'movie_category_id',
        'actor_id',
        'director_id',
        'movie_name',
        'poster',
        'duraion',
        'release_date',
        'age_limit',
        'descripton',
        'trailer',
        'status',
    ];
}
