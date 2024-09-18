<?php

namespace App\Http\Controllers\Api\Cinema;

use App\Http\Controllers\Controller;
use App\Http\Requests\Store\StoreRoomRequest;
use App\Http\Requests\Update\UpdateRoomRequest;
use App\Services\Cinema\RoomService;
use Exception;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    protected $roomService;

    public function __construct(RoomService $roomService)
    {
        $this->roomService = $roomService;
    }

    public function index()
    {
        $room = $this->roomService->index();
        return $this->success($room);
    }

    // public function showtimeByMovieName($movie_name)
    // {
    //     try {
    //         $showtimes = $this->roomService->getShowtimesByMovieName($movie_name);

    //         if ($showtimes->isEmpty()) {
    //             return $this->notFound();
    //         }
    //         return $this->success($showtimes);
    //     } catch (ModelNotFoundException $e) {
    //         return $e->getMessage();
    //     } catch (Exception $e) {
    //         return $e->getMessage();
    //     }
    // }


    public function store(StoreRoomRequest $request)
    {
        $room = $this->roomService->store($request->validated());
        return $this->success($room);
    }

    public function update(UpdateRoomRequest $request, $id)
    {
        try {
            $room = $this->roomService->update($id, $request->validated());
            return $this->success($room);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function destroy($id)
    {
        try {
            return $this->success($this->roomService->delete($id));
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function show($id)
    {
        try {
            $room = $this->roomService->get($id);

            if (!$room) {
                return $this->notFound();
            }

            return $this->success($room);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

}
