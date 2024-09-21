<?php

namespace App\Http\Controllers\Api\Filter;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use App\Models\Showtime;
use App\Services\Filter\FilterByDateService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class FilterByDate extends Controller
{
    protected $filterByDateService;
    public function __construct(FilterByDateService $filterByDateService){
        $this->filterByDateService = $filterByDateService;
    }
    public function filterByDate(Request $request)
    {
        $date = $request->input('showtime_date');
        if (empty($date) || $date == '0') {
            $date = Carbon::today()->toDateString();
        }
        $movies = $this->filterByDateService->filterByDate($date);
        return response()->json($movies);
    }
}
