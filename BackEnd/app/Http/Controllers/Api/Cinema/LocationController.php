<?php

namespace App\Http\Controllers\Api\Cinema;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Cinema\LocationService;
use App\Http\Requests\Store\Cinema\StoreLocationRequest;
use App\Http\Requests\update\Cinema\UpdateLocationRequest;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class LocationController extends Controller
{

    protected $locationService;

    public function __construct(LocationService $locationService)
    {
        $this->locationService = $locationService;
    }

    public function index()
    {
        $locations = $this->locationService->index();

        return response()->json($locations);
    }

    public function store(StoreLocationRequest $request)
    {
        $location = $this->locationService->store($request->validated());
        return response()->json($location, 201);

    }

    public function update(UpdateLocationRequest $request, $id)
    {
        try {
            $location = $this->locationService->update($id, $request->validated());
            return response()->json($location);
        } catch (Exception $e) {
            return response()->json(['error' => 'Location not found'], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $this->locationService->delete($id);
            return response()->json(null, 204);
        } catch (Exception $e) {
            return response()->json(['error' => 'Location not found'], 404);
        }
    }
}
