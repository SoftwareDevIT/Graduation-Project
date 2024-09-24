<?php

namespace App\Services\Filter;

use App\Models\Movie;
use App\Models\Showtime;
use Carbon\Carbon;

class FilterByDateService
{
    public function filterByDate(string $date, $cinemaId = null)
{
    $filteredShowtimes = function($query) use ($date) {
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
}
