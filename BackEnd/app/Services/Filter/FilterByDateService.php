<?php

namespace App\Services\Filter;

use App\Models\MovieInCinema;


class FilterByDateService
{
    public function filterByDate(string $date, $cinemaId = null)
    {
        $query = MovieInCinema::where('cinema_id', $cinemaId)
            ->whereHas('showtimes', function ($query) use ($date) {
                $query->where('showtime_date', $date);
            })->with(['showtimes' => function ($query) use ($date) {
                $query->where('showtime_date', $date);
            }])->with(['movie.actor' => function ($query) {
                $query->select('actor.id', 'actor.actor_name');
            }])->with(['movie.director' => function ($query) {
                $query->select('director.id', 'director.director_name');
            }])->with(['movie.movie_category' => function ($query) {
                $query->select('movie_category.id', 'movie_category.category_name');
            }]);

        $movies = $query->get();

        foreach ($movies as $movie) {
            $this->hidePivot($movie->movie->actor);
            $this->hidePivot([$movie->movie->director]); 
            $this->hidePivot($movie->movie->movie_category);
        }
        return $movies;
    }

    public function filterByDateOrMovie(string $date, $movieid, $locationId)
    {
        $query = MovieInCinema::where('movie_id', $movieid)
            ->whereHas('cinema', function ($query) use ($locationId) {
                $query->where('location_id', $locationId);
            })->whereHas('showtimes', function ($query) use ($date) {
                $query->where('showtime_date', $date);
            })
            ->with(['showtimes' => function ($query) use ($date) {
                $query->where('showtime_date', $date);
            }])->with('cinema');
        return $query->get();
    }

    function hidePivot($items)
    {
        foreach ($items as $item) {
            $item->makeHidden(['pivot']);
        }
    }
}
