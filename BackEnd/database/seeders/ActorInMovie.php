<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ActorInMovie extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('actor_in_movie')->insert([
            [
                'movie_id' => 1,
                'actor_id' => 1,
            ],
            [
                'movie_id' => 1,
                'actor_id' => 2,
            ],
            [
                'movie_id' => 2,
                'actor_id' => 3,
            ],
            [
                'movie_id' => 3,
                'actor_id' => 4,
            ],
            [
                'movie_id' => 4,
                'actor_id' => 5,
            ]
        ]);
    }
}
