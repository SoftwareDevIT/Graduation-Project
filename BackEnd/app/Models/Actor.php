<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Actor extends Model
{
    use HasFactory;
    protected $table = 'actor';
    protected $fillable = [
        'actor_name',
        'slug',
        'descripcion',
        'photo',
        'country',
        'link_wiki',
        'status',
    ];

    public function movies()
    {
        return $this->belongsToMany(Movie::class, 'actor_in_movies', 'actor_id', 'movie_id')

            ->withTimestamps();
    }

    public function actorInMovies()
    {
        return $this->hasMany(ActorInMovie::class);
    }
}