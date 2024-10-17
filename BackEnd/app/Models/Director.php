<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Director extends Model
{
    use HasFactory;
    protected $table = 'director';
    protected $fillable = [
        'id',
        'director_name',
        'descripcion',
        'photo',
        'country',
        'link_wiki',
    ];

    public function movies()
    {
        return $this->belongsToMany(Movie::class, 'actor_in_movies', 'director_id', 'movie_id')
            ->withPivot('actor_id', 'movie_category_id')
            ->withTimestamps();
    }

    public function actorInMovies()
    {
        return $this->hasMany(ActorInMovie::class);
    }
}
