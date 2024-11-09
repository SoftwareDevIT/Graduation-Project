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
            DB::table('room')->insert([
                [
                    'room_name' => 'P1',
                    'volume' => 100,
                    'cinema_id' => $cinemaId,
                    'status' => '1',
                ],
                [
                    'room_name' => 'P2',
                    'volume' => 100,
                    'cinema_id' => $cinemaId,
                    'status' => '1',
                ],
                [
                    'room_name' => 'P3',
                    'volume' => 100,
                    'cinema_id' => $cinemaId,
                    'status' => '1',
                ],
                [
                    'room_name' => 'P4',
                    'volume' => 100,
                    'cinema_id' => $cinemaId,
                    'status' => '1',
                ],
                [
                    'room_name' => 'P5',
                    'volume' => 100,
                    'cinema_id' => $cinemaId,
                    'status' => '1',
                ],
            ]);
        }
    }
}
