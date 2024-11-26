<?php

namespace App\Http\Controllers\Api\Revenue;

use App\Http\Controllers\Controller;
use App\Services\Revenue\DashboardAdminService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class DashboardAdminController extends Controller
{
    protected $dashboardAdminService;

    public function __construct(DashboardAdminService $dashboardAdminService)
    {
        $this->dashboardAdminService = $dashboardAdminService;
    }
    public function dashboardAdmin()
    {
        $dashboardAdmin = $this->dashboardAdminService->dashboardAdmin();
        return  $this->success($dashboardAdmin, 'Danh thu', 200);
    }
}
