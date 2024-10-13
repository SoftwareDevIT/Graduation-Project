<?php

namespace App\Services\Filter;

use App\Models\Cinema;
use App\Models\Movie;
use App\Models\Showtime;
use Carbon\Carbon;

class FilterByDateService
{
    public function filterByDate(string $date, $cinemaId = null)
    {
        $filteredShowtimes = function ($query) use ($date) {
            $query->where('showtime_date', $date)
                ->where('status', 'Show');
        };

        $query = Movie::whereHas('showtimes', $filteredShowtimes)
            ->with(['showtimes' => $filteredShowtimes]);

        if ($cinemaId) {
            $query->where('cinema_id', $cinemaId);
        }

        return $query->get();
    }

    public function filterByDateOrMovie(string $date, $moviename, $locationId) {
        $query = Cinema::where('location_id', $locationId)
            ->whereHas('movies', function ($query) use ($date, $moviename) {
                $query->where('movie_name', $moviename);
                $query->where('status', 'Show');
                $query->whereHas('showtimes', function ($query) use ($date) { 
                    $query->where('status', 'Show');
                    $query->where('showtime_date', $date); 
                });
            })
            ->with(['movies.showtimes' => function ($query) use ($date) {
                $query->where('status', 'Show');
                $query->where('showtime_date', $date);
            }])
            ->get();
        return $query;
    }
}
