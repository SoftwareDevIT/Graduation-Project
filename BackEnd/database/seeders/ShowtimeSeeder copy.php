<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShowtimeSeeder extends Seeder
{
    public function run(): void
    {
        $movieInCinemaRecords = DB::table('movie_in_cinemas')->get(); // Lấy toàn bộ các bản ghi
        $showtimes = [
            '09:00:00' => 45000,
            '10:00:00' => 46000,
            '11:00:00' => 47000,
            '12:00:00' => 48000,
            '13:00:00' => 49000,
            '14:00:00' => 50000,
            '15:00:00' => 51000,
            '16:00:00' => 52000,
            '17:00:00' => 53000,
            '18:00:00' => 54000,
            '19:00:00' => 55000,
            '20:00:00' => 56000,
            '21:00:00' => 57000,
            '22:00:00' => 58000,
            '23:00:00' => 59000,
        ];
        $showtimeDate = now()->addDays(1)->toDateString();
        $batchSize = 1000; // Kích thước lô
        $showtimeData = [];

        foreach ($movieInCinemaRecords as $movieInCinema) {
            // Lấy room_id từ bảng rooms theo cinema_id
            $room = DB::table('rooms')
                ->where('cinema_id', $movieInCinema->cinema_id)
                ->inRandomOrder() // Chọn ngẫu nhiên một phòng nếu có nhiều
                ->first();

            if ($room) {
                foreach ($showtimes as $start => $price) {
                    $showtimeData[] = [
                        'room_id' => $room->id,
                        'movie_in_cinema_id' => $movieInCinema->id,
                        'showtime_date' => $showtimeDate,
                        'showtime_start' => $start,
                        'price' => $price,
                        'status' => '1',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];

                    // Thực hiện chèn dữ liệu theo lô
                    if (count($showtimeData) >= $batchSize) {
                        DB::table('showtimes')->insert($showtimeData);
                        $showtimeData = [];
                    }
                }
            }
        }

        // Chèn phần dữ liệu còn lại nếu có
        if (!empty($showtimeData)) {
            DB::table('showtimes')->insert($showtimeData);
        }
    }
}