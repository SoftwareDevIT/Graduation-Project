<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ActorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('actor')->insert([
            [
                'actor_name' => 'Trấn thành',
                'descripcion' => '',
                'photo' => '',
                'country' => '',
                'link_wiki' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'actor_name' => 'Kim Myung-jin',
                'descripcion' => '',
                'photo' => '',
                'country' => '',
                'link_wiki' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'actor_name' => 'Han Jun-hee',
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
