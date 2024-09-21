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
        $director = [
            [
                'director_name' => 'Victor Vũ',
                'descripcion' => 'Known for Tôi thấy hoa vàng trên cỏ xanh, Scandal',
                'photo' => 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Victor_Vu.jpg',
                'country' => 'Vietnam',
                'link_wiki' => 'https://vi.wikipedia.org/wiki/Victor_Vũ',
            ],
            [
                'director_name' => 'Nguyễn Quang Dũng',
                'descripcion' => 'Known for Mỹ Nhân Kế, Tháng năm rực rỡ',
                'photo' => 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Nguyen_Quang_Dung.jpg',
                'country' => 'Vietnam',
                'link_wiki' => 'https://vi.wikipedia.org/wiki/Nguyễn_Quang_Dũng',
            ],
            [
                'director_name' => 'Charlie Nguyễn',
                'descripcion' => 'Known for Để Mai Tính, Tèo Em',
                'photo' => 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Charlie_Nguyen.jpg',
                'country' => 'Vietnam',
                'link_wiki' => 'https://vi.wikipedia.org/wiki/Charlie_Nguyễn',
            ],
            [
                'director_name' => 'Trần Anh Hùng',
                'descripcion' => 'Known for Mùi Đu Đủ Xanh, Xích lô',
                'photo' => 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Tran_Anh_Hung.jpg',
                'country' => 'Vietnam',
                'link_wiki' => 'https://vi.wikipedia.org/wiki/Trần_Anh_Hùng',
            ],
            [
                'director_name' => 'Lê Văn Kiệt',
                'descripcion' => 'Known for Hai Phượng, The Princess',
                'photo' => 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Le_Van_Kiet.jpg',
                'country' => 'Vietnam',
                'link_wiki' => 'https://vi.wikipedia.org/wiki/Lê_Văn_Kiệt',
            ],
            [
                'director_name' => 'Vũ Ngọc Đãng',
                'descripcion' => 'Known for Bỗng Dưng Muốn Khóc, Hotboy Nổi Loạn',
                'photo' => 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Vu_Ngoc_Dang.jpg',
                'country' => 'Vietnam',
                'link_wiki' => 'https://vi.wikipedia.org/wiki/Vũ_Ngọc_Đãng',
            ],
            [
                'director_name' => 'Ngô Thanh Vân',
                'descripcion' => 'Known for Tấm Cám: Chuyện chưa kể, Hai Phượng',
                'photo' => 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Ngô_Thanh_Vân.jpg',
                'country' => 'Vietnam',
                'link_wiki' => 'https://vi.wikipedia.org/wiki/Ngô_Thanh_Vân',
            ],
            [
                'director_name' => 'Đặng Nhật Minh',
                'descripcion' => 'Known for Bao giờ cho đến tháng Mười, Mùa ổi',
                'photo' => 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Đặng_Nhật_Minh.jpg',
                'country' => 'Vietnam',
                'link_wiki' => 'https://vi.wikipedia.org/wiki/Đặng_Nhật_Minh',
            ],
            [
                'director_name' => 'Phan Đăng Di',
                'descripcion' => 'Known for Bi, đừng sợ!, Cha và con và...',
                'photo' => 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Phan_Đăng_Di.jpg',
                'country' => 'Vietnam',
                'link_wiki' => 'https://vi.wikipedia.org/wiki/Phan_Đăng_Di',
            ],
            [
                'director_name' => 'Nguyễn Hoàng Điệp',
                'descripcion' => 'Known for Đập cánh giữa không trung, Cánh đồng bất tận',
                'photo' => 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Nguyễn_Hoàng_Điệp.jpg',
                'country' => 'Vietnam',
                'link_wiki' => 'https://vi.wikipedia.org/wiki/Nguyễn_Hoàng_Điệp',
            ],
        ];

        foreach ($director as &$direct) {
            $direct['created_at'] = Carbon::now();
            $direct['updated_at'] = Carbon::now();
        }

        DB::table('director')->insert($director);

    }
}
