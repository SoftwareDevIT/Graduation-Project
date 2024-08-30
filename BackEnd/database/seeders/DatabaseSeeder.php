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
        $this->call([RoleSeeder::class]);
        $this->call([LocationSeeder::class]);
        $this->call([CinemaSeeder::class]);
        $this->call([PayMethodSeeder::class]);
        $this->call([UserSeeder::class]);
        $this->call([MovieCategorySeeder::class]);
        $this->call([NewsCategorySeeder::class]);
        $this->call([ActorSeeder::class]);
        $this->call([ComboSeeder::class]);
        $this->call([DirectorSeeder::class]);
        $this->call([MovieSeeder::class]);
        $this->call([News::class]);
    }
}
