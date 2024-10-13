<?php

namespace App\Services\Booking\Steps;

use App\Models\Movie;
use App\Services\Booking\Handlers\AbstractBookingStep;
use Illuminate\Support\Facades\Session;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SelectMovie extends AbstractBookingStep
{
    /**
     * Xử lý yêu cầu chọn phim.
     *
     * @param Request $request
     * @return ?array
     */
    protected function process(Request $request): ?JsonResponse
    {
        // $error= [];

        $cinemaId = $request->input('cinemaId');
        $showtimeId = $request->input('showtimeId');

        if (!$cinemaId || !$showtimeId) {
            return response()->json([
                'status' => false,
                'message' => 'Cinema or Showtime not found.'
            ]);
        }

        $movies = Movie::where('id', $cinemaId)
            ->with(['showtimes' => function ($query) use ($showtimeId) {
                $query->where('id', $showtimeId);
            }])
            ->get();

        if ($movies->isEmpty() || $movies->first()->showtimes->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Cinema or Showtime not found.'
            ]);
        }

        Session::put('reserved_showtime', compact('showtimeId', 'movies'));

        // return ['movies' => $movies];
        // return response()->json([
        //     'status' => true,
        //     'message' => 'Success',
        //     'data' => $movies
        // ]);
        return null;
    }
}
