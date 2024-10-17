<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MovieCategory extends Model
{
    use HasFactory;
    protected $table = 'movie_category';
    protected $fillable = [
        'id',
        'category_name',
        'descripcion',
        'status',
    ];

    public function movies()
    {
        return $this->belongsToMany(Movie::class, 'actor_in_movies', 'movie_category_id', 'movie_id')
            ->withPivot('actor_id', 'director_id')
            ->withTimestamps();
    }

    public function actorInMovies()
    {
        return $this->hasMany(ActorInMovie::class);
    }
}
