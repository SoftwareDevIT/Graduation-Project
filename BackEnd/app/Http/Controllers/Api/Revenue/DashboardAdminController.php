<?php

namespace App\Http\Controllers\Api\Revenue;

use App\Http\Controllers\Controller;
use App\Services\Revenue\DashboardAdminService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class DashboardAdminController extends Controller
{
    protected $dashboardAdminService;

    public function __construct(DashboardAdminService $dashboardAdminService)
    {
        $this->dashboardAdminService = $dashboardAdminService;
    }
    public function totalRevenue($status)
    {
        $totalRevenue = $this->dashboardAdminService->totalRevenue($status);
        return $this->success($totalRevenue);
    }

    public function totalRevenueByCinema(Request $request, $cinema_id)
    {
        $year = $request->input('year');
        $month = $request->input('month');
        $day = $request->input('day');

        $totalRevenue = $this->dashboardAdminService->totalRevenueByCinema($cinema_id, $year, $month, $day);
        return $this->success($totalRevenue);
    }

    public function totalRevenueByCinemaBetweenDates(Request $request, $cinema_id)
    {
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');
        $year = $request->input('year');
        $month = $request->input('month');
        $day = $request->input('day');

        $totalRevenue = $this->dashboardAdminService->totalRevenueByCinemaBetweenDates($cinema_id, $startDate, $endDate, $year, $month, $day);
        return $this->success($totalRevenue);
    }

    public function totalRevenueBetweenDates(Request $request)
    {
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');
        $year = $request->input('year');
        $month = $request->input('month');
        $day = $request->input('day');

        $totalRevenue = $this->dashboardAdminService->totalRevenueBetweenDates($startDate, $endDate, $year, $month, $day);
        return $this->success($totalRevenue);
    }

    // Phương thức success để trả về phản hồi

}
