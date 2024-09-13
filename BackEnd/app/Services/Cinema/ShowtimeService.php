<?php

namespace App\Services\Cinema;

use App\Models\Showtime;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Class LocationService.
 */
class ShowtimeService
{

    public function index(): Collection
    {

        return Showtime::all();
    }


    public function store(array $data): Showtime
    {
        return Showtime::create($data);
    }

    public function update(int $id, array $data): Showtime
    {
        $showtime = Showtime::findOrFail($id);
        $showtime->update($data);

        return $showtime;
    }


    public function delete(int $id): ?bool
    {
        $showtime = Showtime::findOrFail($id);
        return $showtime->delete();
    }

    public function get(int $id): Showtime
    {
        $showtime = Showtime::findOrFail($id);
        return $showtime;
    }
}
