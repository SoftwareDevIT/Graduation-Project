<?php

namespace App\Http\Controllers\Api\Revenue;

use App\Http\Controllers\Controller;
use App\Services\Revenue\RevenueMovieService;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class RevenueMovieController extends Controller
{
    protected $revenueMovieService;

    public function __construct(RevenueMovieService $revenueMovieService)
    {
        $this->revenueMovieService = $revenueMovieService;
    }
    public function totalRevenueMovie($status)
    {
        $totalRevenueMovie = $this->revenueMovieService->totalRevenueMovie($status);
        return $this->success($totalRevenueMovie);
    }
    public function totalRevenueByMovie($movie_id)
    {
        $totalRevenueByMovie = $this->revenueMovieService->totalRevenueByMovie($movie_id);
        return $this->success($totalRevenueByMovie);
    }
    public function totalRevenueByMovieBetweenDates($movie_id, $startDate, $endDate)
    {
        $totalRevenueByMovieBetweenDates = $this->revenueMovieService->totalRevenueByMovieBetweenDates($movie_id, $startDate, $endDate);
        return $this->success($totalRevenueByMovieBetweenDates);
    }
    public function totalRevenueMovieBetweenDates($startDate, $endDate)
    {
        $totalRevenueMovieBetweenDates = $this->revenueMovieService->totalRevenueMovieBetweenDates($startDate, $endDate);
        return $this->success($totalRevenueMovieBetweenDates);
    }
}
