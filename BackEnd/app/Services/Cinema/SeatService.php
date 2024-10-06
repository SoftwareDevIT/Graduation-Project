<?php

namespace App\Services\Cinema;

use App\Models\Seats;
use App\Models\Showtime;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Class LocationService.
 */
class SeatService
{

    public function index(): Collection
    {

        return Seats::all();
    }





    // public function store(array $data): Seats
    // {
    //     return Seats::create($data);
    // }

    // public function update(int $id, array $data): Seats
    // {
    //     $seat = Seats::findOrFail($id);
    //     $seat->update($data);

    //     return $seat;
    // }


    // public function delete(int $id): ?bool
    // {
    //     $seat = Seats::findOrFail($id);
    //     return $seat->delete();
    // }
    public function get(int $showtime_id)
    {
        $showtime = Showtime::with('seats')->find($showtime_id);
        if (!$showtime) {
            abort(404, 'Showtime not found');
        }
        return $showtime->seats;
    }



}
