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
            }])
            ->with('movie');
        return $query->get();
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
}
