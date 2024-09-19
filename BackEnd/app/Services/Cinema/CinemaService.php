<?php

namespace App\Services\Cinema;

use App\Models\Cinema;
use App\Models\Location;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Class LocationService.
 */
class CinemaService
{

    public function index(): Collection
    {

        return Cinema::all();
    }


    public function store(array $data): Cinema
    {
        return Cinema::create($data);
    }

    public function update(int $id, array $data): Cinema
    {
        $cinema = Cinema::findOrFail($id);
        $cinema->update($data);

        return $cinema;
    }


    public function delete(int $id): ?bool
    {
        $cinema = Cinema::findOrFail($id);
        return $cinema->delete();
    }
    public function get(int $id): Cinema
    {
        $cinema = Cinema::findOrFail($id);
        return $cinema;
    }

    public function getCinemaByLocation(int $id)
    {
        $location = Location::where('id', $id)->first();

        if (!$location) {
            throw new ModelNotFoundException('location not found');
        }
        return $location->cinema;
    }
}
