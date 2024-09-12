<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            LocationSeeder::class,
            CinemaSeeder::class,
            PayMethodSeeder::class,
            UserSeeder::class,
            MovieCategorySeeder::class,
            NewsCategorySeeder::class,
            ActorSeeder::class,
            ComboSeeder::class,
            DirectorSeeder::class,
            MovieSeeder::class,
            News::class,
            RoomSeeder::class,
            ShowtimeSeeder::class,
        ]);
    }
}
