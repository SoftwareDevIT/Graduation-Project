<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use GuzzleHttp\Client;

class MovieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // DB::table('movies')->insert([
        //     [
        //         'movie_name' => 'Trấn thành',
        //         'poster' => 'https://cdn.moveek.com/storage/media/cache/short/6672a665bf15f621375171.jpg',
        //         'duration' => '',
        //         'release_date' => now(),
        //         'age_limit' => '1',
        //         'description' => '',
        //         'trailer' => '',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'movie_name' => 'Làm Giàu Với Ma',
        //         'poster' => 'https://cdn.moveek.com/storage/media/cache/short/66b1a047a14ac186965830.jpg',
        //         'duration' => '',
        //         'release_date' => now(),
        //         'age_limit' => '1',
        //         'description' => '',
        //         'trailer' => '',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'movie_name' => 'Hai Muối',
        //         'poster' => 'https://cdn.moveek.com/storage/media/cache/short/66c2c56176eb2629893638.jpg',
        //         'duration' => '',
        //         'release_date' => now(),
        //         'age_limit' => '1',
        //         'description' => '',
        //         'trailer' => '',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'movie_name' => 'Cám',
        //         'poster' => 'https://cdn.moveek.com/storage/media/cache/short/66e7ddfc73b0d564220537.jpg',
        //         'duration' => '122',
        //         'release_date' => now(),
        //         'age_limit' => '18',
        //         'description' => '',
        //         'trailer' => '',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'movie_name' => 'Đố Anh Còng Được tôi',
        //         'poster' => 'https://cdn.moveek.com/storage/media/cache/short/66e140bff0068188200976.jpg',
        //         'duration' => '118',
        //         'release_date' => now(),
        //         'age_limit' => '18',
        //         'description' => '',
        //         'trailer' => '',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'movie_name' => 'Minh Hôn',
        //         'poster' => 'https://cdn.moveek.com/storage/media/cache/short/66e668c12aa05005198863.jpg',
        //         'duration' => '92',
        //         'release_date' => now(),
        //         'age_limit' => '18',
        //         'description' => '',
        //         'trailer' => '',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'movie_name' => 'Transformers Một',
        //         'poster' => 'https://cdn.moveek.com/storage/media/cache/short/663458008cfa2269960147.jpg',
        //         'duration' => '120',
        //         'release_date' => now(),
        //         'age_limit' => '13',
        //         'description' => '',
        //         'trailer' => '',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'movie_name' => 'Cậu Bé Cá Heo',
        //         'poster' => 'https://cdn.moveek.com/storage/media/cache/short/66e667a965631887716128.png',
        //         'duration' => '85',
        //         'release_date' => now(),
        //         'age_limit' => '1',
        //         'description' => '',
        //         'trailer' => '',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'movie_name' => 'Kết Nối Tử Thần',
        //         'poster' => 'https://cdn.moveek.com/storage/media/cache/short/66ed5eadb1e5c292802354.jpg',
        //         'duration' => '89',
        //         'release_date' => now(),
        //         'age_limit' => '16',
        //         'description' => '',
        //         'trailer' => '',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'movie_name' => 'Nơi Tình Yêu Kết Thúc',
        //         'poster' => 'https://cdn.moveek.com/storage/media/cache/short/66ed5e0215766604667464.jpg',
        //         'duration' => '130',
        //         'release_date' => now(),
        //         'age_limit' => '16',
        //         'description' => '',
        //         'trailer' => '',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ]
        // ]);
        $client = new Client();
        $response = $client->get('https://rapchieuphim.com/api/v1/movies');
        $data = json_decode($response->getBody()->getContents(), true);
        $data = array_slice($data, 0, 100);
        foreach ($data as $item) {
            DB::table('movies')->insert([
                'movie_name' => $item['name'],
                'poster' => 'https://rapchieuphim.com' . $item['poster'],
                'duration' => $item['duration'],
                'release_date' => now(),
                'age_limit' => '16',
                'description' => $item['description'],
                'trailer' => $item['name'],
                'created_at' => now(),
                'updated_at' => now(),

                // Thêm các cột khác theo dữ liệu từ API
            ]);
        }
    }
}
