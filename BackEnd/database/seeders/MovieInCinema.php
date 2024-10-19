<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MovieInCinema extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('movie_in_cinemas')->insert([
            [
                'movie_id' => 1,
                'cinema_id' => 1,
            ],
            [
                'movie_id' => 2,
                'cinema_id' => 1,
            ],
            [
                'movie_id' => 3,
                'cinema_id' => 2,
            ],
            [
                'movie_id' => 4,
                'cinema_id' => 2,
            ],
            [
                'movie_id' => 5,
                'cinema_id' => 1,
            ],

        ]);
    }
}
