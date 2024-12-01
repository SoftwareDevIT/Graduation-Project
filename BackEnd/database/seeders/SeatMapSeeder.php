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
                $rowLetter = chr(64 + $row); // Convert numeric row to alphabetical (e.g., 1 -> 'A', 2 -> 'B')

                // Logic phân loại loại ghế
                $seatType = '';

                // Ghế thường ở đầu, ghế VIP ở giữa, ghế đôi ở cuối
                if ($row <= $layout->row_regular_seat) {
                    $seatType = 'Regular';
                } elseif ($row <= $layout->row_regular_seat + $layout->row_vip_seat) {
                    $seatType = 'VIP';
                } else {
                    $seatType = 'Couple';
                }

                // Tạo ghế đôi chiếm 2 ô
                for ($column = 1; $column <= $layout->columns; $column++) {
                    // Nếu là ghế đôi, tạo 2 cột liên tiếp
                    if ($seatType == 'Couple' && $column % 2 == 1 && $column + 1 <= $layout->columns) {
                        $seatMaps[] = [
                            'seat_layout_id' => $layout->id,
                            'label' => $rowLetter.$column,
                            'row' => $rowLetter,
                            'column' => $column,
                            'seat_type' => $seatType,
                            'is_double' => true,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];

                        // Tạo cột kế tiếp cho ghế đôi
                        $seatMaps[] = [
                            'seat_layout_id' => $layout->id,
                            'label' => $rowLetter.$column,
                            'row' => $rowLetter,
                            'column' => $column + 1,
                            'type' => $seatType,
                            'is_double' => true,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];

                        // Bỏ qua cột tiếp theo để tránh trùng
                        $column++;
                    } else {
                        $seatMaps[] = [
                            'seat_layout_id' => $layout->id,
                            'label' => $rowLetter.$column,
                            'row' => $rowLetter,
                            'column' => $column,
                            'type' => $seatType,
                            'is_double' => false,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                }
            }
        }

        // Batch insert for performance
        DB::table('seat_map')->insert($seatMaps);
    }
}
