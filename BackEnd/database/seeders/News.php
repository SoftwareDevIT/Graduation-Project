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
     
            $thumbnail = $item['thumbnail'];

            // Kiểm tra nếu thumbnail là đường dẫn tương đối
            if (strpos($thumbnail, 'http') === false) {
                $thumbnail = 'https://rapchieuphim.com' . $thumbnail;
            }

            // Kiểm tra xem ảnh có tồn tại hay không
            try {
                $response = $client->head($thumbnail);
                if ($response->getStatusCode() !== 200) {
                    // Nếu ảnh không tồn tại, thay thế bằng ảnh mặc định
                    $thumbnail = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1718&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
                }
            } catch (\Exception $e) {
                // Nếu có lỗi khi kiểm tra, thay thế bằng ảnh mặc định
                $thumbnail = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1718&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
            }
            DB::table('news')->insert([
                'user_id' => '1',
                'movie_id' => $movieIds->random(), // Chọn ngẫu nhiên 1 movie_id từ danh sách
                'title' => $item['name'],
                'content' => $item['content'],
                'banner' =>   $thumbnail,
                'thumnail' =>   $thumbnail,
                'news_category_id' => '3',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
