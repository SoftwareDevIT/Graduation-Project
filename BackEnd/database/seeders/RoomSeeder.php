<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('room')->insert([
            [
                'room_name' => 'Tin điện ảnh',
                'cinema_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'room_name' => 'Đánh giá phim',
                'cinema_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'room_name' => 'TV Series',
                'cinema_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ]

        ]);
    }
}
