<?php

namespace App\Http\Controllers\Api\Filter;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use App\Models\Showtime;
use App\Services\Filter\FilterByDateService;
use Carbon\Carbon;
use Illuminate\Http\Request;

use function Laravel\Prompts\error;

class FilterByDateController extends Controller
{
    protected $filterByDateService;
    public function __construct(FilterByDateService $filterByDateService)
    {
        $this->filterByDateService = $filterByDateService;
    }
    public function filterByDate(Request $request)
    {
        $date = $request->input('showtime_date');
        $cinemaId = $request->input('cinema_id');

        if (empty($date) || $date == '0') {
            $date = Carbon::today()->toDateString();
        }

        $movies = $this->filterByDateService->filterByDate($date, $cinemaId);

        if ($movies->isEmpty()) {
            return $this->error('Không có phim của ngày hôm nay');
        }

        return $this->success($movies);
    }

    public function filterByDateByMovie(Request $request)
    {
        $locationId = $request->input('location_id');
        $date = $request->input('showtime_date');
        $movieid = $request->input('movie_id');
        if (empty($date) || $date == '0') {
            $date = Carbon::today()->toDateString();
        }
        if (empty($date) || empty($movieid)) {
            return $this->error('Vui lòng cung cấp Ngày và ID phim');
        }
        $movies = $this->filterByDateService->filterByDateOrMovie($date,$movieid,$locationId);
        return $this->success($movies);
    }
}
