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
        $location = Cinema::findOrFail($id);
        $location->update($data);

        return $location;
    }


    public function delete(int $id): ?bool
    {
        $location = Cinema::findOrFail($id);
        return $location->delete();
    }
}
