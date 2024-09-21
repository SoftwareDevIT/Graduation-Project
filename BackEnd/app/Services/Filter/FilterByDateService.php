<?php
namespace App\Services\Filter;

use App\Models\Movie;
use App\Models\Showtime;
use Carbon\Carbon;

class FilterByDateService
{
    public function filterByDate(string $data)
    {
        
        $filteredShowtimes = function($query) use ($data) {
            $query->where('showtime_date', $data)
                  ->where('status', 'Show');
        };
        return Movie::whereHas('showtimes', $filteredShowtimes)
                       ->with(['showtimes' => $filteredShowtimes])
                       ->get();

        
    }
}