<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Fetch all cinema IDs from the cinema table
        $cinemaIds = DB::table('cinema')->pluck('id');

        // Iterate through each cinema and create rooms for them
        foreach ($cinemaIds as $cinemaId) {
            // Generate 5 rooms for each cinema
            for ($i = 1; $i <= 5; $i++) {
                // Số ghế đôi cố định là 5 ghế đôi (tương đương 10 ghế đơn)
                $quantityDoubleSeats = 5;
                $totalSeats = $quantityDoubleSeats * 2; // Tổng số ghế ban đầu là 10 ghế đơn từ ghế đôi

                // Số ghế đơn còn lại sẽ là tổng số ghế - số ghế đôi
                $remainingSeats = 120; // Tổng số ghế mà chúng ta muốn phòng chiếu có, giả sử là 100 ghế (bao gồm ghế đôi + ghế VIP + ghế đơn)
                $totalSeats = $remainingSeats - $totalSeats; // Trừ đi số ghế đôi đã có từ tổng số ghế

                // Tính số ghế VIP chiếm từ 50% đến 60% tổng số ghế đơn còn lại (sau khi trừ ghế đôi)
                $percentageVip = rand(50, 60); // Tỷ lệ % của ghế VIP
                $quantityVipSeats = (int)($totalSeats * $percentageVip / 100); // Tính số ghế VIP

                // Số ghế đơn còn lại sẽ là tổng số ghế đơn còn lại sau khi trừ ghế VIP
                $quantitySingleSeats = $totalSeats - $quantityVipSeats;

                // Insert room data
                DB::table('room')->insert([
                    'room_name' => 'P' . $i, // P1, P2, P3, ...
                    'volume' => rand(50, 120), // Random room volume
                    'cinema_id' => $cinemaId,
                    'quantity_double_seats' => $quantityDoubleSeats, // 5 ghế đôi
                    'quantity_vip_seats' => $quantityVipSeats, // Số ghế VIP tính theo tỷ lệ
                    'status' => '1', // Active status
                ]);
            }
        }
    }
}