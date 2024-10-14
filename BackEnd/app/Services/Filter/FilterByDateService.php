<?php

namespace App\Services\Filter;

use App\Models\Cinema;
use App\Models\Movie;
use App\Models\MovieInCinema;
use App\Models\Showtime;
use Carbon\Carbon;

class FilterByDateService
{
    public function filterByDate(string $date, $cinemaId = null)
    {
        $query = MovieInCinema::where('cinema_id', $cinemaId)
            ->with(['showtimes' => function ($query) use ($date) {
                // $query->where('status', 'Show');
                $query->where('showtime_date', $date);
        }])->with('movie');
        return $query->get();
    }

    public function filterByDateOrMovie(string $date, $movieid, $locationId) {
        $query = MovieInCinema::where('movie_id', $movieid)
        ->whereHas('cinema', function ($query) use ($locationId) {
            $query->where('location_id', $locationId);
        })
        ->with(['showtimes' => function ($query) use ($date) {
            $query->where('showtime_date', $date);
        }])->with('cinema');
        return $query->get();
    }
}
