<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NewsCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('news_category')->insert([
            [
                'news_category_name' => 'Tin điện ảnh',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'news_category_name' => 'Đánh giá phim',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'news_category_name' => 'TV Series',
                'created_at' => now(),
                'updated_at' => now(),
            ]

        ]);
    }
}
