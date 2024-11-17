<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ShowtimeSeeder extends Seeder
{
    public function run(): void
    {
        // Lấy danh sách tất cả bản ghi movie_in_cinemas
        $movieInCinemaRecords = DB::table('movie_in_cinemas')->get();

        // Thời gian chiếu và giá vé
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

        // Ngày chiếu
        $showtimeDate = now()->addDays(1)->toDateString();

        // Batch insert để tối ưu hiệu suất
        $batchSize = 1000;
        $showtimeData = [];

        foreach ($movieInCinemaRecords as $movieInCinema) {
            // Lấy danh sách phòng thuộc rạp của phim
            $rooms = DB::table('room')
                ->where('cinema_id', $movieInCinema->cinema_id)
                ->pluck('id');

            if ($rooms->isEmpty()) {
                continue; // Bỏ qua nếu không có phòng
            }

            // Lấy tất cả khóa (thời gian chiếu) của showtimes
            $showtimesKeys = array_keys($showtimes);

            // Đảm bảo rằng số lượng phòng không vượt quá số lượng thời gian chiếu
            if (count($rooms) > count($showtimesKeys)) {
                $showtimesKeys = array_merge($showtimesKeys, array_slice($showtimesKeys, 0, count($rooms) - count($showtimesKeys)));
            }

            // Lặp qua từng phòng và gán mỗi phòng một thời gian chiếu ngẫu nhiên
            foreach ($rooms as $key => $roomId) {
                $start = $showtimesKeys[$key]; // Lấy thời gian chiếu tương ứng với phòng
                $price = $showtimes[$start];   // Lấy giá vé tương ứng với thời gian chiếu

                // Tính thời gian kết thúc là thời gian bắt đầu cộng 2 giờ
                $end = Carbon::createFromFormat('H:i:s', $start)->addHours(2)->format('H:i:s');

                // Thêm bản ghi vào showtimeData
                $showtimeData[] = [
                    'room_id' => $roomId,
                    'movie_in_cinema_id' => $movieInCinema->id,
                    'showtime_date' => $showtimeDate,
                    'showtime_start' => $start,
                    'showtime_end' => $end,
                    'price' => $price,
                    'status' => '1',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                // Chèn dữ liệu theo lô
                if (count($showtimeData) >= $batchSize) {
                    DB::table('showtimes')->insert($showtimeData);
                    $showtimeData = [];
                }
            }
        }

        // Chèn phần còn lại nếu có
        if (!empty($showtimeData)) {
            DB::table('showtimes')->insert($showtimeData);
        }
    }
}
