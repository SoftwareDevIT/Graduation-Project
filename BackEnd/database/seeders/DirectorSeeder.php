<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DirectorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('director')->insert([
            [
                'director_name' => 'Trấn thành',
                'descripcion' => '',
                'photo' => '',
                'country' => '',
                'link_wiki' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'director_name' => 'Kim Myung-jin',
                'descripcion' => '',
                'photo' => '',
                'country' => '',
                'link_wiki' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'director_name' => 'Han Jun-hee',
                'descripcion' => '',
                'photo' => '',
                'country' => '',
                'link_wiki' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
