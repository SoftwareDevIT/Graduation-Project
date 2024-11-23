<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Director extends Model
{
    use HasFactory;
    protected $table = 'director';
    protected $fillable = [
        'director_name',
        'slug',
        'photo',
        'descripcion',
        'country',
        'status',
        'link_wiki',
    ];

    public function movies()
    {
        return $this->belongsToMany(Movie::class, 'director_in_movie', 'director_id', 'movie_id')

            ->withTimestamps();
    }

    public function directorInMovie()
    {
        return $this->hasMany(DirectorInMovie::class);
    }
}