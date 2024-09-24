<?php

namespace Database\Seeders;

use Carbon\Carbon;
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
        $actors = [
            [
                'actor_name' => 'Ninh Dương Lan Ngọc',
                'descripcion' => 'Ninh Dương Lan Ngọc là một nữ diễn viên nổi tiếng của Việt Nam.',
                'photo' => 'https://i.imgur.com/WfTbnQB.jpeg',
                'country' => 'Việt Nam',
                'link_wiki' => 'https://vi.wikipedia.org/wiki/Ninh_D%C6%B0%C6%A1ng_Lan_Ng%E1%BB%8Dc',
            ],
            [
                'actor_name' => 'Nhã Phương',
                'descripcion' => 'Nhã Phương là một nữ diễn viên nổi tiếng của Việt Nam.',
                'photo' => 'https://i.imgur.com/WfTbnQB.jpeg',
                'country' => 'Việt Nam',
                'link_wiki' => 'https://vi.wikipedia.org/wiki/Nh%C3%A3_Ph%C6%B0%C6%A1ng',
            ],
            [
                'actor_name' => 'Jennifer Lawrence',
                'descripcion' => 'Jennifer Lawrence là một nữ diễn viên nổi tiếng của Mỹ.',
                'photo' => 'https://i.imgur.com/WfTbnQB.jpeg',
                'country' => 'Mỹ',
                'link_wiki' => 'https://en.wikipedia.org/wiki/Jennifer_Lawrence',
            ],
            [
                'actor_name' => 'Emma Watson',
                'descripcion' => 'Emma Watson là một nữ diễn viên nổi tiếng của Anh.',
                'photo' => 'https://i.imgur.com/WfTbnQB.jpeg',
                'country' => 'Anh',
                'link_wiki' => 'https://en.wikipedia.org/wiki/Emma_Watson',
            ],
            [
                'actor_name' => 'Nhã Phương',
                'descripcion' => 'Nhã Phương là một nữ diễn viên nổi tiếng của Việt Nam.',
                'photo' => 'https://i.imgur.com/WfTbnQB.jpeg',
                'country' => 'Việt Nam',
                'link_wiki' => 'https://vi.wikipedia.org/wiki/Nh%C3%A3_Ph%C6%B0%C6%A1ng',
            ],
            [
                'actor_name' => 'Minh Hằng',
                'descripcion' => 'Minh Hằng là một nữ diễn viên và ca sĩ nổi tiếng của Việt Nam.',
                'photo' => 'https://i.imgur.com/WfTbnQB.jpeg',
                'country' => 'Việt Nam',
                'link_wiki' => 'https://vi.wikipedia.org/wiki/Minh_H%E1%BA%B1ng',
            ],
            [
                'actor_name' => 'Tăng Thanh Hà',
                'descripcion' => 'Tăng Thanh Hà là một nữ diễn viên nổi tiếng của Việt Nam.',
                'photo' => 'https://i.imgur.com/WfTbnQB.jpeg',
                'country' => 'Việt Nam',
                'link_wiki' => 'https://vi.wikipedia.org/wiki/T%C4%83ng_Thanh_H%C3%A0',
            ],
            [
                'actor_name' => 'Kiều Minh Tuấn',
                'descripcion' => 'Kiều Minh Tuấn là một nam diễn viên nổi tiếng của Việt Nam.',
                'photo' => 'https://i.imgur.com/WfTbnQB.jpeg',
                'country' => 'Việt Nam',
                'link_wiki' => 'https://vi.wikipedia.org/wiki/Ki%E1%BB%81u_Minh_Tu%E1%BA%A5n',
            ],
            [
                'actor_name' => 'Cao Minh Đạt',
                'descripcion' => 'Cao Minh Đạt là một nam diễn viên nổi tiếng của Việt Nam.',
                'photo' => 'https://i.imgur.com/WfTbnQB.jpeg',
                'country' => 'Việt Nam',
                'link_wiki' => 'https://vi.wikipedia.org/wiki/Cao_Minh_%C4%90%E1%BA%A1t',
            ],
            [
                'actor_name' => 'Huỳnh Đông',
                'descripcion' => 'Huỳnh Đông là một nam diễn viên nổi tiếng của Việt Nam.',
                'photo' => 'https://i.imgur.com/WfTbnQB.jpeg',
                'country' => 'Việt Nam',
                'link_wiki' => 'https://vi.wikipedia.org/wiki/Hu%E1%BB%B3nh_%C4%90%C3%B4ng',
            ],
            [
                'actor_name' => 'Khả Ngân',
                'descripcion' => 'Khả Ngân là một nữ diễn viên nổi tiếng của Việt Nam.',
                'photo' => 'https://i.imgur.com/WfTbnQB.jpeg',
                'country' => 'Việt Nam',
                'link_wiki' => 'https://vi.wikipedia.org/wiki/Kh%E1%BA%A3_Ng%C3%A2n',
            ],
            [
                'actor_name' => 'Jun Vũ',
                'descripcion' => 'Jun Vũ là một nữ diễn viên nổi tiếng của Việt Nam.',
                'photo' => 'https://i.imgur.com/WfTbnQB.jpeg',
                'country' => 'Việt Nam',
                'link_wiki' => 'https://vi.wikipedia.org/wiki/Jun_V%C5%A9',
            ],
            [
                'actor_name' => 'Hồng Đăng',
                'descripcion' => 'Hồng Đăng là một nam diễn viên nổi tiếng của Việt Nam.',
                'photo' => 'https://i.imgur.com/WfTbnQB.jpeg',
                'country' => 'Việt Nam',
                'link_wiki' => 'https://vi.wikipedia.org/wiki/H%E1%BB%93ng_%C4%90%C4%83ng',
            ],
            [
                'actor_name' => 'Ngô Thanh Vân',
                'descripcion' => 'Ngô Thanh Vân là một nữ diễn viên, ca sĩ và nhà sản xuất phim nổi tiếng của Việt Nam.',
                'photo' => 'https://i.imgur.com/WfTbnQB.jpeg',
                'country' => 'Việt Nam',
                'link_wiki' => 'https://vi.wikipedia.org/wiki/Ng%C3%B4_Thanh_V%C3%A2n',
            ],


        ];

        foreach ($actors as &$actor) {
            $actor['created_at'] = Carbon::now();
            $actor['updated_at'] = Carbon::now();
        }

        DB::table('actor')->insert($actors);

    }
}
