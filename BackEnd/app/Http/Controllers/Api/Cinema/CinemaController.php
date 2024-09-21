<?php

namespace App\Http\Controllers\Api\Cinema;

use App\Http\Controllers\Controller;
use App\Http\Requests\Store\StoreCinemaRequest;
use App\Http\Requests\Update\UpdateCinemaRequest;
use App\Models\Movie;
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
        return $this->success($cinemas);
    }
    public function show($id)
    {
        try {
            $cinema = $this->cinemaService->get($id);

            if (!$cinema) {
                return response()->json(['error' => 'Cinema not found'], 404);
            }

            return $this->success($cinema);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }


    public function store(StoreCinemaRequest $request)
    {
        $cinema = $this->cinemaService->store($request->validated());
        return $this->success($cinema);
    }

    public function update(UpdateCinemaRequest $request, $id)
    {
        try {
            $cinema = $this->cinemaService->update($id, $request->validated());
            return $this->success($cinema);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function destroy($id)
    {
        try {
            return $this->success($this->cinemaService->delete($id));
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }


    public function filterMovie($id){
        try {
            $movies = Movie::where('cinema_id', $id)->with('showtimes')->get();
            return response()->json([
                'status' => 'success',
                'message' => 'Danh sách phim theo rạp phim',
                'data' => $movies
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'fail',
                'data' => $th->getMessage()
            ]);
        }

    }
}
