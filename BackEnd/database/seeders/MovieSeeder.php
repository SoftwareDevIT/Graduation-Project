<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MovieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('movies')->insert([
            [
                'movie_name' => 'Trấn thành',
                'movie_category_id' => '1',
                'cinema_id' => '1',
                'director_id' => '1',
                'actor_id' => '1',
                'poster' => 'https://cdn.moveek.com/storage/media/cache/short/6672a665bf15f621375171.jpg',
                'duraion' => '',
                'release_date' => now(),
                'age_limit' => '1',
                'descripton' => '',
                'trailer' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'movie_name' => 'Làm Giàu Với Ma',
                'movie_category_id' => '3',
                'cinema_id' => '1',
                'director_id' => '2',
                'actor_id' => '1',
                'poster' => 'https://cdn.moveek.com/storage/media/cache/short/66b1a047a14ac186965830.jpg',
                'duraion' => '',
                'release_date' => now(),
                'age_limit' => '1',
                'descripton' => '',
                'trailer' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'movie_name' => 'Hai Muối',
                'movie_category_id' => '5',
                'cinema_id' => '1',
                'director_id' => '3',
                'actor_id' => '2',
                'poster' => 'https://cdn.moveek.com/storage/media/cache/short/66c2c56176eb2629893638.jpg',
                'duraion' => '',
                'release_date' => now(),
                'age_limit' => '1',
                'descripton' => '',
                'trailer' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
