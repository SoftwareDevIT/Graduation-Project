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
  
    public function dashboardAdmin(Request $request)
    {
        $status = $request->query('status');
        $cinema_id = $request->query('cinema_id');
        $start_date = $request->query('start_date');
        $end_date = $request->query('end_date');
        $month = $request->query('month');
        $year = $request->query('year');
        $day = $request->query('day');

        // Gọi hàm lọc từ service
        $filterRevenue = $this->dashboardAdminService->filterofbooking(
            $status,
            $cinema_id,
            $start_date,
            $end_date,
            $month,
            $year,
            $day
        );
        // Tính tổng doanh thu và số lượng booking
        $total = $this->dashboardAdminService->totaldashboard($filterRevenue);

        return response()->json([
            'status' => true,
            'message' => 'Success',
            'chart' => $total,
            'data' => $filterRevenue
        ], 200);
    }

   

}
