<?php

namespace Database\Seeders;

use Carbon\Carbon;
use GuzzleHttp\Client;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SeatMapSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('seat_map')->insert([
            [
                'name' => 'Layout 12x12',
                'rows' => 12,
                'columns' => 12,
                'status' => 'Bản nháp',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [

                'name' => 'Layout 13x13',
                'rows' => 13,
                'columns' => 13,
                'status' => 'Bản nháp',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [

                'name' => 'Layout 14x14',
                'rows' => 14,
                'columns' => 14,
                'status' => 'Bản nháp',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Layout 15x15',
                'rows' => 15,
                'columns' => 15,
                'status' => 'Bản nháp',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
