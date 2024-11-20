<?php

namespace Database\Seeders;

use GuzzleHttp\Client;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
        $data = array_slice($data, 0, 100);

        // Lấy danh sách movie_id từ bảng movies
        $movieIds = DB::table('movies')->pluck('id');
        $news_category = DB::table('news_category')->pluck('id');

        foreach ($data as $item) {

            $thumbnail = $item['thumbnail'];

            // Kiểm tra nếu thumbnail là đường dẫn tương đối
            if (strpos($thumbnail, 'http') === false) {
                $thumbnail = 'https://rapchieuphim.com' . $thumbnail;
            }

            // Kiểm tra xem ảnh có tồn tại hay không
            try {
                $response = $client->head($thumbnail);
                if ($response->getStatusCode() !== 200) {
                    Log::warning("Poster not found for movie: {$item['name']}, skipping.");
                    continue;
                }
            } catch (\Exception $e) {
                Log::warning("Error checking poster for movie: {$item['name']}, skipping. Error: {$e->getMessage()}");
                continue;
            }
            DB::table('news')->insert([
                'user_id' => '1',
                'movie_id' => $movieIds->random(), // Chọn ngẫu nhiên 1 movie_id từ danh sách
                'title' => $item['name'],
                'slug' => $item['slug'],
                'content' => $item['content'],
                'banner' =>   $thumbnail,
                'thumnail' =>   $thumbnail,
                'views' =>   rand(20, 50),
                'news_category_id' => $news_category->random(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}