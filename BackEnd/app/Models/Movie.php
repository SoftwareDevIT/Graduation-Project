<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
    use HasFactory;
    protected $table = 'movies';
    protected $fillable = [
        'movie_name',
        'poster',
        'duration',
        'release_date',
        'age_limit',
        'description',
        'trailer',
        'status',
        'rating'
    ];

    // public function category()
    // {
    //     return $this->belongsTo(MovieCategory::class, 'movie_category_id');
    // }

    public function actor()
    {
        return $this->belongsToMany(Actor::class, 'actor_in_movies', 'movie_id', 'actor_id')
            ->withPivot('director_id', 'movie_category_id')
            ->withTimestamps();
    }


    public function director()
    {
        return $this->belongsToMany(Director::class, 'actor_in_movies', 'movie_id', 'director_id')
            ->withPivot('actor_id', 'movie_category_id')
            ->withTimestamps();
    }

    public function category()
    {
        return $this->belongsToMany(MovieCategory::class, 'actor_in_movies', 'movie_id', 'movie_category_id')
            ->withPivot('actor_id', 'director_id')
            ->withTimestamps();
    }

    // public function showtimes()
    // {
    //     return $this->hasMany(Showtime::class);
    // }
    public function cinema()
    {
        return $this->belongsTo(Cinema::class);
    }


    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    public function movieInCinemas()
    {
        return $this->hasMany(MovieInCinema::class);
    }

    public function actorInMovies()
    {
        return $this->hasMany(ActorInMovie::class);
    }

    public function news()
    {
        return $this->hasMany(News::class);
    }
}
