<?php

namespace App\Http\Controllers\Api\Filter\DashBoard;

use App\Http\Controllers\Controller;
use App\Services\Filter\DashBoard\FilterOfDateService;
use Illuminate\Http\Request;

class FilterOfDateController extends Controller
{
    protected $filterofdateService;

    public function __construct(FilterOfDateService $filterofdateService)
    {
        $this->filterofdateService = $filterofdateService;
    }

    public function filterRevenue(Request $request)
    {
        $status = $request->query('status');
        $cinema_id = $request->query('cinema_id');
        $start_date = $request->query('start_date');
        $end_date = $request->query('end_date');
        $month = $request->query('month');
        $year = $request->query('year');
        $day = $request->query('day');

        $filterRevenue = $this->filterofdateService->filtercalculateRevenue(
            $status, $cinema_id, $start_date, $end_date, $month, $year, $day
        );
        $total = $this->filterofdateService->totaldashboard($filterRevenue);

        return response()->json(['status' => true, 'message' => 'Success','total' => $total,'data'=> $filterRevenue ], 200);
    }
}
