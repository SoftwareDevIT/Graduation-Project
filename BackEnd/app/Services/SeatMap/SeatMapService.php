<?php

namespace App\Services\SeatMap;

use App\Models\SeatMap;
use App\Models\SeatLayout;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Traits\AuthorizesInService;

/**
 * Class SeatMapService.
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

    /**
     * Retrieve the seat map for a given layout and adjust for couple seats.
     */
    public function get(int $id): Collection
    {
        // Fetch all seat maps for the given seat layout
        $combo = SeatMap::where('seat_layout_id', $id)->get();

        // Adjust for couple seats: Make them span two columns
        $adjustedSeats = $this->adjustForCoupleSeats($combo);

        return $adjustedSeats;
    }

    /**
     * Adjust the seat map data so that couple seats span two columns.
     */
    private function adjustForCoupleSeats(Collection $seatMaps): Collection
    {
        // Create an array to store the adjusted seat map
        $adjustedSeats = collect();

        foreach ($seatMaps as $seat) {
            // Check if this seat is a couple seat and needs to span two columns
            if ($seat->is_double) {
                // Find the next column and merge them
                $nextColumn = $seat->column + 1;

                // Mark both columns as occupied by a couple seat
                $adjustedSeats->push([
                    'seat_layout_id' => $seat->seat_layout_id,
                    'row' => $seat->row,
                    'column' => $seat->column,
                    'is_double' => true, // Mark as couple seat
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Skip next column for couple seat, it will be handled by this one
                $seatMaps->where('row', $seat->row)->where('column', $nextColumn)->first()->is_double = true;
            } else {
                // Regular seat, no change
                $adjustedSeats->push($seat);
            }
        }

        return $adjustedSeats;
    }
}
