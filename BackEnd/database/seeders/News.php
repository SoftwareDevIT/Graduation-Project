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
                'title' => 'Đố Anh Còng Được Tôi - Mãn nhãn với những pha hành động cực gắt của Hwang Jung Min và Jung Hae In',
                'news_category_id' => '3',
                'user_id' => '1',
                'content' => 'Bậc thầy phim hành động Hwang Jung Min trở lại, bắt tay với “Con Trai Bạn Mẹ” Jung Hae In truy bắt tội phạm trong phim mới.
                Đố Anh Còng Được Tôi (I, The Executioner) được biết đến là phần 2 của huyền thoại Veteran với 13 triệu vé bán ra vào năm 2015. Tiếp bước phần 1 sau 9 năm, phim được kỳ vọng sẽ làm nên chuyện với sự trở lại của bậc thầy phim hành động Hwang Jung Min và sự góp mặt của mỹ nam ăn khách nhất nhì Hàn Quốc - Jung Hae In. Tuy nhiên, phần 2 sẽ là câu chuyện tách rời hoàn toàn so với phần 1, chỉ giữ lại những nhân vật chủ chốt để cùng tạo nên một phần phim mới mẻ.',
                'thumnail' => 'https://cdn.moveek.com/storage/media/cache/small/66e29ae31292b081798064.jpg',
                'banner' => 'https://imgur.com/sYXo4WT',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Phim Cám (2024) - Hé lộ mối quan hệ gây chú ý giữa Bờm và Cám',
                'news_category_id' => '2',
                'user_id' => '1',
                'content' => 'Kể từ khi phim điện ảnh Cám công bố poster và trailer chính thức, chi tiết gây chú ý nhất là mối quan hệ “trên tình bạn" của Bờm và Cám được hé mở.
                Bộ phim kinh dị Cám đã tạo ra nhiều sự chú ý kể từ khi công bố poster và trailer chính thức. Điều đáng nói là sự xuất hiện của nhân vật Chàng Bờm, và mối quan hệ mập mờ với Cám (do Lâm Thanh Mỹ thủ vai). Đây là một sự kết hợp độc đáo và mới lạ giữa hai nhân vật nổi tiếng trong văn hóa dân gian Việt Nam, nhưng lần này, họ được đặt trong một bối cảnh đầy ma mị và đen tối.',
                'thumnail' => 'https://cdn.moveek.com/storage/media/cache/small/66e01879b9d7a480091150.png',
                'banner' => 'https://cdn.moveek.com/storage/media/cache/large/66ea6a5c65e5f666484610.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Joker 1 trở lại rạp chiếu phim vào tháng 9 2024',
                'news_category_id' => '2',
                'user_id' => '1',
                'content' => 'Phần phim đầu tiên của JOKER trở lại rạp trước thềm phần 2 Joker: Folie À Deux Điên Có Đôi ra mắt.
                Sức hút của bom tấn Hollywood đáng chú ý nhất dịp cuối năm nay Joker: Folie À Deux Điên Có Đôi đang trở nên bùng nổ hơn bao giờ hết sau màn ra mắt thành công rực rỡ tại Liên hoan phim Venice vào ngày 4/9 vừa qua. Để chào đón tác phẩm cực kỳ hứa hẹn này, phần phim đầu tiên Joker sẽ chính thức trở lại rạp Việt với định dạng 2D cùng số suất chiếu giới hạn kể từ ngày 13/9. ',
                'thumnail' => 'https://cdn.moveek.com/storage/media/cache/small/66defad3c15ad167836450.jpeg',
                'banner' => 'https://imgur.com/nd75o3d',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Review Chàng Nữ Phi Công - Vô tri mà giải trí phết!',
                'news_category_id' => '3',
                'user_id' => '1',
                'content' => 'Chàng Nữ Phi Công tỏa sáng mạnh mẽ nhất là ở khiếu hài hước tự nhiên của phim.
                Chàng Nữ Phi Công hình thành trên một ý tưởng không tưởng, đem đến một màn chọc cười vừa giải trí vừa vô tri không kém. Đây là một câu chuyện không có nhiều điểm nhấn ngoài những tràng cười nó mang lại. ',
                'thumnail' => 'https://cdn.moveek.com/storage/media/cache/small/66cea8dc6de24938175451.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
