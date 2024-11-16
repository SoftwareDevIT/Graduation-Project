<?php

namespace Database\Seeders;

use GuzzleHttp\Client;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class News extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $client = new Client();
        $response = $client->get('https://rapchieuphim.com/api/v1/posts');
        $data = json_decode($response->getBody()->getContents(), true);
        $data = array_slice($data, 0, 10);

        // Lấy danh sách movie_id từ bảng movies
        $movieIds = DB::table('movies')->pluck('id');

        foreach ($data as $item) {
            DB::table('news')->insert([
                'user_id' => '1',
                'movie_id' => $movieIds->random(), // Chọn ngẫu nhiên 1 movie_id từ danh sách
                'title' => $item['name'],
                'content' => $item['content'],
                'banner' => 'https://rapchieuphim.com' . $item['thumbnail'],
                'thumnail' => 'https://rapchieuphim.com' . $item['thumbnail'],
                'news_category_id' => '3',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}