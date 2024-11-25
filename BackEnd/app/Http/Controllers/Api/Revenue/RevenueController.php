<?php

namespace App\Http\Controllers\Api\Revenue;

use App\Http\Controllers\Controller;
use App\Services\Revenue\RevenueService;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class RevenueController extends Controller
{
    protected $revenueService;

    public function __construct(RevenueService $revenueService)
    {
        $this->revenueService = $revenueService;
    }
    public function totalRevenue($status)
    {
        $totalRevenue = $this->revenueService->totalRevenue($status);
        return response()->json($totalRevenue);
    }
    public function totalRevenueByCinema($cinema_id)
    {
        $totalRevenue = $this->revenueService->totalRevenueByCinema($cinema_id);
        return response()->json($totalRevenue);
    }
    public function totalRevenueByCinemaBetweenDates($cinema_id, $startDate, $endDate)
    {
        $totalRevenue = $this->revenueService->totalRevenueByCinemaBetweenDates($cinema_id, $startDate, $endDate);
        return response()->json($totalRevenue);
    }
    public function totalRevenueBetweenDates($startDate, $endDate)
    {
        $totalRevenue = $this->revenueService->totalRevenueBetweenDates($startDate, $endDate);
        return response()->json($totalRevenue);
    }
}
