<?php

namespace App\Http\Controllers\Api\Cinema;

use App\Http\Controllers\Controller;
use App\Http\Requests\Store\StoreShowtimeRequest;
use App\Http\Requests\Update\UpdateShowtimeRequest;
use App\Models\Movie;
use App\Services\Cinema\ShowtimeService;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ShowtimeController extends Controller
{
    protected $showtimeService;

    public function __construct(ShowtimeService $showtimeService)
    {
        $this->showtimeService = $showtimeService;
    }

    public function index()
    {
        $showtimes = $this->showtimeService->index();
        return $this->success($showtimes);
    }

    public function showtimeByMovieName($movie_name)
    {
        try {
            $showtimes = $this->showtimeService->getShowtimesByMovieName($movie_name);

            if ($showtimes->isEmpty()) {
                return $this->notFound();
            }
            return $this->success($showtimes);
        } catch (ModelNotFoundException $e) {
            return $e->getMessage();
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }


    public function store(StoreShowtimeRequest $request)
    {
        $showtime = $this->showtimeService->store($request->validated());
        return $this->success($showtime);
    }

    public function update(UpdateShowtimeRequest $request, $id)
    {
        try {
            $showtime = $this->showtimeService->update($id, $request->validated());
            return $this->success($showtime);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function destroy($id)
    {
        try {
            return $this->success($this->showtimeService->delete($id));
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function show($id)
    {
        try {
            $showtime = $this->showtimeService->get($id);

            if (!$showtime) {
                return $this->notFound();
            }

            return $this->success($showtime);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
}
