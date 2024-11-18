<?php

namespace App\Services\Cinema;

use App\Models\Cinema;
use App\Models\Location;
use App\Models\MovieInCinema;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Class LocationService.
 */
class CinemaService
{

    public function index(): Collection
    {

        // return Cinema::all();
        return Cinema::with('Location')
            ->get();
    }


    public function store(array $data): Cinema
    {
        return Cinema::create($data);
    }
    public function storeMovie(array $data): MovieInCinema
    {
        return MovieInCinema::create($data);
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
    // public function get(int $id): Cinema
    // {
    //     $cinema = Cinema::findOrFail($id);
    //     return $cinema;
    // }

    public function get($identifier): Cinema
    {
        $Cinema = Cinema::query()
            ->when(is_numeric($identifier), function ($query) use ($identifier) {
                return $query->where('id', $identifier);
            }, function ($query) use ($identifier) {
                return $query->where('slug', $identifier);
            })
            ->firstOrFail();

        return $Cinema;
    }
    public function showCinemaByLocation(int $location_id)
    {
        $location = Location::where('id', $location_id)->first();
        if (!$location) {
            throw new ModelNotFoundException('Cinema not found');
        }
        return $location->cinema;
    }
}