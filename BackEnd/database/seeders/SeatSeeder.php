<?php

namespace Database\Seeders;

use App\Models\CategorySeat;
use App\Models\Room;
use App\Models\Seats;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SeatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $categories = CategorySeat::all();
        $rooms = Room::all();

        foreach ($rooms as $room) {
            foreach ($categories as $category) {
                // Giả sử mỗi phòng có 50 ghế cho mỗi loại ghế
                for ($i = 1; $i <= 50; $i++) {
                    Seats::firstOrCreate(
                        [
                            'number_seat' => 'S' . $i . '-' . $room->id . '-' . $category->id,
                            'category_seat_id' => $category->id,
                            'room_id' => $room->id,
                            'showtime_id' => 1,
                        ],
                        ['price' => $this->getPriceByCategory($category->name)]
                    );
                }
            }
        }
    }

    private function getPriceByCategory($categoryName)
    {
        // Định nghĩa giá dựa trên loại ghế
        $prices = [
            'Standard' => 60.0,
            'VIP' => 85.0,
            'Sweetbox' => 75.0,
            // Thêm các loại giá khác nếu cần
        ];

        return $prices[$categoryName] ?? 60.0; // Giá mặc định là 60 nếu không tìm thấy
    }
}
