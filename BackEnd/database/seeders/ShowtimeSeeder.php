<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShowtimeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('showtimes')->insert([
            [
                'movie_id' => 1,
                'room_id' => 1, // Giả sử đây là ID của phòng chiếu
                'showtime_date' => now()->addDays(1)->toDateString(), // Ngày chiếu
                'showtime_start' => now(), // Thời gian bắt đầu
                'showtime_end' => now(), // Thời gian kết thúc
                'status' => 'Show', // Hoặc 'Hidden' tùy thuộc vào trạng thái
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'movie_id' => 1,
                'room_id' => 2, // Giả sử đây là ID của phòng chiếu khác
                'showtime_date' => now()->addDays(1)->toDateString(), // Ngày chiếu
                'showtime_start' => now()->addDays(1), // Thời gian bắt đầu
                'showtime_end' => now()->addDays(1), // Thời gian kết thúc
                'status' => 'Show', // Hoặc 'Hidden' tùy thuộc vào trạng thái
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}