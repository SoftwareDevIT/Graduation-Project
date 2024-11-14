<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShowtimeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Lấy tất cả các bản ghi từ bảng movie_in_cinemas
        $movieInCinemas = DB::table('movie_in_cinemas')->get();

        foreach ($movieInCinemas as $movieInCinema) {
            // Lấy room_id từ bảng rooms theo cinema_id
            $roomId = DB::table('room')
                ->where('cinema_id', $movieInCinema->cinema_id)
                ->first();  // Giả sử mỗi cinema có một room duy nhất

            if ($roomId) {
                // Chèn dữ liệu vào bảng showtimes
                DB::table('showtimes')->insert([
                    [
                        'room_id' => $roomId->id, // Lấy room_id từ bảng rooms
                        'movie_in_cinema_id' => $movieInCinema->id, // movie_in_cinema_id
                        'showtime_date' => now()->addDays(1)->toDateString(), // Ngày chiếu
                        'showtime_start' => now()->addDays(1), // Thời gian bắt đầu
                        'showtime_end' => now()->addDays(1)->addHours(2), // Thời gian kết thúc (2 giờ sau)
                        'price' => 45000,
                        'status' => '1', // Trạng thái
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                    [
                        'room_id' => $roomId->id,
                        'movie_in_cinema_id' => $movieInCinema->id,
                        'showtime_date' => now()->addDays(2)->toDateString(), // Ngày chiếu
                        'showtime_start' => now()->addDays(2), // Thời gian bắt đầu
                        'showtime_end' => now()->addDays(2)->addHours(2), // Thời gian kết thúc
                        'price' => 45000,
                        'status' => '1',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                ]);
            }
        }
    }
}