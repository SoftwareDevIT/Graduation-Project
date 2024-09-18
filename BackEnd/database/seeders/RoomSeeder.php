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
    public function run()
    {
        $cinemaCount = 6;
        $roomsPerCinema = 1;
        $seatsPerRow = 15;

        for ($cinemaId = 1; $cinemaId <= $cinemaCount; $cinemaId++) {
            $rooms = [];
            for ($roomNumber = 1; $roomNumber <= $roomsPerCinema; $roomNumber++) {
                $roomName = 'Phòng ' . $roomNumber;
                $rooms[] = [
                    'room_name' => $roomName,
                    'cinema_id' => $cinemaId,
                    'volume' => 15,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            DB::table('room')->insert($rooms);

            $roomIds = DB::table('room')->where('cinema_id', $cinemaId)->pluck('id');

            foreach ($roomIds as $roomId) {
                $seats = [];
                $numberOfRows = ceil(20 * $seatsPerRow / $seatsPerRow);

                for ($rowIndex = 0; $rowIndex < $numberOfRows; $rowIndex++) {
                    $row = chr(65 + $rowIndex);
                    for ($seatNumber = 1; $seatNumber <= $seatsPerRow; $seatNumber++) {
                        $seats[] = [
                            'room_id' => $roomId,
                            'row' => $row,
                            'number' => $seatNumber,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                }

                DB::table('seats')->insert($seats);
            }
        }
    }
}
