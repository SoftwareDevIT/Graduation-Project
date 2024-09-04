<?php

namespace App\Http\Controllers\Api\Cinema;

use App\Http\Controllers\Controller;
use App\Http\Requests\Store\Cinema\StoreCinemaRequest;
use App\Http\Requests\Update\Cinema\UpdateCinemaRequest;
use Illuminate\Http\Request;
use App\Services\Cinema\CinemaService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CinemaController extends Controller
{
    protected $cinemaService;

    public function __construct(CinemaService $cinemaService)
    {
        $this->cinemaService = $cinemaService;
    }

    public function index()
    {
        $cinemas = $this->cinemaService->index();
        return response()->json($cinemas);
    }

    public function store(StoreCinemaRequest $request)
    {
        $cinema = $this->cinemaService->store($request->validated());
        return response()->json($cinema, 201);
    }

    public function update(UpdateCinemaRequest $request, $id)
    {
        try {
            $cinema = $this->cinemaService->update($id, $request->validated());
            return response()->json($cinema);
        } catch (Exception $e) {
            return response()->json(['error' => 'Cinema not found'], 404); 
        }
    }

    public function destroy($id)
    {
        try {
            $this->cinemaService->delete($id);
            return response()->json(null, 204);
        } catch (Exception $e) {
            return response()->json(['error' => 'Cinema not found'], 404); 
        }
    }
}
