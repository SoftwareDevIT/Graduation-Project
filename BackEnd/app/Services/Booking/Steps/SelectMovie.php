<?php

namespace App\Services\Booking\Steps;

use App\Models\Movie;
use App\Services\Booking\Handlers\AbstractBookingStep;
use Illuminate\Support\Facades\Session;
use Illuminate\Http\Request;

class SelectMovie extends AbstractBookingStep
{
    /**
     * Xử lý yêu cầu chọn phim.
     *
     * @param Request $request
     * @return ?array
     */
    protected function process(Request $request): ?array
    {
        // $error= [];
        $cinemaId = $request->input('cinemaId');
        $showtimeId = $request->input('showtimeId');

        if (!$cinemaId || !$showtimeId) {
            return ['errors' => ['Both cinema ID and showtime ID are required.']];
        }

        $movies = Movie::where('id', $cinemaId)
            ->with(['showtimes' => function ($query) use ($showtimeId) {
                $query->where('id', $showtimeId);
            }])
            ->get();

        if ($movies->isEmpty() || $movies->first()->showtimes->isEmpty()) {
            return ['errors' => ['No movies found for the given cinema and showtime.']];
        }

        Session::put('reserved_showtime', compact('showtimeId', 'movies'));

        // return ['movies' => $movies];
        return ['movies' => $movies];
    }

}
