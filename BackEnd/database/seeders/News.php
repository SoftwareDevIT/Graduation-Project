<?php

namespace Database\Seeders;

use GuzzleHttp\Client;
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
        // DB::table('news')->insert([
        //     [
        //         'title' => 'Đố Anh Còng Được Tôi - Mãn nhãn với những pha hành động cực gắt của Hwang Jung Min và Jung Hae In',
        //         'news_category_id' => '3',
        //         'user_id' => '1',
        //         'thumnail' => 'https://cdn.moveek.com/storage/media/cache/small/66e29ae31292b081798064.jpg',
        //         'banner' => 'https://imgur.com/sYXo4WT',
        //         'content' => 'Bậc thầy phim hành động Hwang Jung Min trở lại, bắt tay với “Con Trai Bạn Mẹ” Jung Hae In truy bắt tội phạm trong phim mới.
        //         Đố Anh Còng Được Tôi (I, The Executioner) được biết đến là phần 2 của huyền thoại Veteran với 13 triệu vé bán ra vào năm 2015. Tiếp bước phần 1 sau 9 năm, phim được kỳ vọng sẽ làm nên chuyện với sự trở lại của bậc thầy phim hành động Hwang Jung Min và sự góp mặt của mỹ nam ăn khách nhất nhì Hàn Quốc - Jung Hae In. Tuy nhiên, phần 2 sẽ là câu chuyện tách rời hoàn toàn so với phần 1, chỉ giữ lại những nhân vật chủ chốt để cùng tạo nên một phần phim mới mẻ.',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],

        // ]);

        $client = new Client();
        $response = $client->get('https://rapchieuphim.com/api/v1/posts');
        $data = json_decode($response->getBody()->getContents(), true);
        $data = array_slice($data, 0, 10);
        foreach ($data as $item) {
            DB::table('news')->insert([
                'user_id' => '1',
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
