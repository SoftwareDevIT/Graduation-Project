<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class News extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('news')->insert([
            [
                'title' => 'Tin Hot 1',
                'news_category_id' => '1',
                'user_id' => '1',
                'content' => 'Diễn viên A đã zzz',
                'thumnail' => 'https://cdn.moveek.com/storage/media/cache/short/66c2c56176eb2629893638.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Tin Hot 1',
                'news_category_id' => '1',
                'user_id' => '1',
                'content' => 'Diễn viên A đã zzz',
                'thumnail' => 'https://cdn.moveek.com/storage/media/cache/short/66c2c56176eb2629893638.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Tin Hot 1',
                'news_category_id' => '1',
                'user_id' => '1',
                'content' => 'Diễn viên A đã zzz',
                'thumnail' => 'https://cdn.moveek.com/storage/media/cache/short/66c2c56176eb2629893638.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
