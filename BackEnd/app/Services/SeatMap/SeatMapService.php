<?php

namespace App\Services\SeatMap;

use App\Models\SeatMap;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class SeatMapService
{
    public function getAll(): Collection
    {
        return SeatMap::all();
    }

    public function getById(int $id): SeatMap
    {
        return SeatMap::findOrFail($id);
    }

    public function create(array $data): SeatMap
    {
        // $data['seat_structure'] = json_encode($data['seat_structure'] ?? []);
        return SeatMap::create($data);
    }

    public function update(int $id, array $data): SeatMap
    {
        $seatMap = SeatMap::findOrFail($id);
        // if (isset($data['seat_structure'])) {
        //     $data['seat_structure'] = json_encode($data['seat_structure']);
        // }
        $seatMap->update($data);
        return $seatMap;
    }

    public function delete(int $id): bool
    {
        $seatMap = SeatMap::findOrFail($id);
        return $seatMap->delete();
    }
}
