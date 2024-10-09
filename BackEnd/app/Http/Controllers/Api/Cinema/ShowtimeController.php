<?php

namespace App\Http\Controllers\Api\Cinema;

use App\Http\Controllers\Controller;
use App\Http\Requests\Store\StoreShowtimeRequest;
use App\Http\Requests\Update\UpdateShowtimeRequest;
use App\Models\Cinema;
use App\Models\Movie;
use App\Models\Room;
use App\Services\Cinema\ShowtimeService;
// use Dotenv\Validator;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;


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
    public function create()
    {
        $movies = Movie::all();  // Fetch all movies
        $rooms = Room::all();    // Fetch all rooms
        $cinemas = Cinema::all();

        return view('showtimes.create', compact('movies', 'rooms', 'cinemas'));
    }



    public function store(StoreShowtimeRequest $request)
    {
        // Retrieve the validated data from the request
        $showtimeData = $request->validated();

        // Check if the incoming data is an array of arrays (multiple showtimes)
        if ($this->isMultiDimensionalArray($showtimeData)) {
            $createdShowtimes = [];

            foreach ($showtimeData as $singleShowtimeData) {
                // Store each showtime in the database and add to the result array
                $createdShowtimes[] = $this->showtimeService->store($singleShowtimeData);
            }

            return $this->success($createdShowtimes, 'Multiple showtimes created successfully.');
        } else {
            // Handle a single showtime
            $createdShowtime = $this->showtimeService->store($showtimeData);
            return $this->success($createdShowtime, 'Single showtime created successfully.');
        }
    }

    /**
     * Helper function to determine if an array is multi-dimensional (i.e., multiple showtimes).
     */
    private function isMultiDimensionalArray($array)
    {
        return isset($array[0]) && is_array($array[0]);
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
