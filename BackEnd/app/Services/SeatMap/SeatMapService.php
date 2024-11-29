<?php

namespace App\Services\SeatMap;

use App\Models\SeatMap;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Traits\AuthorizesInService;

/**
 * Class LocationService.
 */
class SeatMapService
{
    use AuthorizesInService;
    public function index(): Collection
    {

        return SeatMap::all();
    }


    public function store(array $data): SeatMap
    {
        // $this->authorizeInService('create', Combo::class);
        return SeatMap::create($data);
    }

    public function update(int $id, array $data): SeatMap
    {

        $combo = SeatMap::findOrFail($id);
        $combo->update($data);
        return $combo;
    }


    public function delete(int $id): ?bool
    {

        $combo = SeatMap::findOrFail($id);
        return $combo->delete();
    }
    public function get(int $id): Collection
    {
        $combo = SeatMap::where('seat_layout_id', $id)->get();
        return $combo;
    }
}
