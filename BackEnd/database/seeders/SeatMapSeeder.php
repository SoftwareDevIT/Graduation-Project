<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SeatMapSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $seatLayouts = DB::table('seat_layouts')->get(); // Fetch all layouts
        $seatMaps = [];

        foreach ($seatLayouts as $layout) {
            for ($row = 1; $row <= $layout->rows; $row++) {
                // Convert numeric row to alphabetical (e.g., 1 -> 'A', 2 -> 'B')
                $rowLetter = chr(64 + $row);

                for ($column = 1; $column <= $layout->columns; $column++) {
                    $seatMaps[] = [
                        'seat_layout_id' => $layout->id,
                        'row' => $rowLetter,
                        'column' => $column,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }

        // Batch insert for performance
        DB::table('seat_map')->insert($seatMaps);
    }
}
