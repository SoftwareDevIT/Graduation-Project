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
                'actor_name' => 'Vin Diesel',
                'descripcion' => null,
                'photo' => 'https://rapchieuphim.com/photos/actor/avatar/1498198742-vin-diesel.jpg',
                'country' => 'Thành phố New York',
                'link_wiki' => null
            ],
            [
                'actor_name' => 'Dwayne Johnson',
                'descripcion' => null,
                'photo' => 'https://rapchieuphim.com/photos/actor/avatar/1498198745-dwayne-johnson.jpg',
                'country' => 'Hayward, California',
                'link_wiki' => null
            ],
            [
                'actor_name' => 'Jason Statham',
                'descripcion' => null,
                'photo' => 'https://rapchieuphim.com/photos/actor/avatar/1498198741-jason-statham.jpg',
                'country' => 'Shirebrook, Derbyshire',
                'link_wiki' => null
            ],
            [
                'actor_name' => 'Kaity Nguyễn',
                'descripcion' => 'Nổi tiếng với vai trò một beauty blogger triệu view, quay về Việt Nam một thời gian ngắn và lập tức nhận được vai chính trong bộ phim điện ảnh đầu tay, cô gái 18 tuổi Kaity Nguyễn đang có những bước đi khá thuận lợi trong những ngày đầu theo nghiệp diễn.',
                'photo' => 'https://rapchieuphim.com/photos/actor/avatar/1498198762-kaity-nguyen.jpg',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'actor_name' => 'Will',
                'descripcion' => null,
                'photo' => 'https://rapchieuphim.com/photos/actor/avatar/1498198744-will.jpg',
                'country' => 'Toronto, Ontario',
                'link_wiki' => null
            ],
            [
                'actor_name' => 'Châu Bùi',
                'descripcion' => '',
                'photo' => 'https://rapchieuphim.com/images/avatar.png',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'actor_name' => 'Kathy Uyên',
                'descripcion' => null,
                'photo' => '',
                'country' => '',
                'link_wiki' => null
            ],
            [
                'actor_name' => 'Quang Minh',
                'descripcion' => '',
                'photo' => 'https://rapchieuphim.com/images/avatar.png',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'actor_name' => 'Huy Khánh',
                'descripcion' => '',
                'photo' => 'https://rapchieuphim.com/photos/actor/avatar/1498198758-huy-khanh.jpg',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'actor_name' => 'Don Nguyễn',
                'descripcion' => '',
                'photo' => 'https://rapchieuphim.com/images/avatar.png',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'actor_name' => 'Kudo Shinichi',
                'descripcion' => '',
                'photo' => 'https://rapchieuphim.com/images/avatar.png',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'actor_name' => 'Edogawa Conan',
                'descripcion' => '',
                'photo' => 'https://rapchieuphim.com/images/avatar.png',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'actor_name' => 'Mori Ran',
                'descripcion' => '',
                'photo' => 'https://rapchieuphim.com/images/avatar.png',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'actor_name' => 'Sherry',
                'descripcion' => null,
                'photo' => 'https://rapchieuphim.com/photos/actor/avatar/1498198746-sherry.jpg',
                'country' => 'Wendell, Idaho',
                'link_wiki' => null
            ],
            [
                'actor_name' => 'Mori Kogoro',
                'descripcion' => '',
                'photo' => 'https://rapchieuphim.com/images/avatar.png',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'actor_name' => 'Anne Hathaway',
                'descripcion' => null,
                'photo' => 'https://rapchieuphim.com/photos/actor/avatar/1498198742-anne-hathaway.jpg',
                'country' => '',
                'link_wiki' => null
            ],
            [
                'actor_name' => 'Jason Sudeikis',
                'descripcion' => '',
                'photo' => 'https://rapchieuphim.com/photos/actor/avatar/1498198759-jason-sudeikis.jpg',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'actor_name' => 'Austin Stowell',
                'descripcion' => null,
                'photo' => 'https://rapchieuphim.com/photos/actor/avatar/1498198740-austin-stowell.jpg',
                'country' => 'U.S',
                'link_wiki' => null
            ],
            [
                'actor_name' => 'Alec Baldwin',
                'descripcion' => null,
                'photo' => 'https://rapchieuphim.com/photos/actor/avatar/1498198743-alec-baldwin.jpg',
                'country' => '',
                'link_wiki' => null
            ],
            [
                'actor_name' => 'Lisa Kudrow',
                'descripcion' => null,
                'photo' => 'https://rapchieuphim.com/photos/actor/avatar/1498198739-lisa-kudrow.jpg',
                'country' => 'Los Angeles',
                'link_wiki' => null
            ],
            [
                'actor_name' => 'Steve Buscemi',
                'descripcion' => null,
                'photo' => 'https://rapchieuphim.com/photos/actor/avatar/1498198743-steve-buscemi.jpg',
                'country' => 'New York',
                'link_wiki' => null
            ],
            [
                'actor_name' => 'Sam Neill',
                'descripcion' => null,
                'photo' => 'https://rapchieuphim.com/photos/actor/avatar/1498198741-sam-neill.jpg',
                'country' => 'Omagh',
                'link_wiki' => null
            ],
            [
                'actor_name' => 'Dominique Tipper',
                'descripcion' => '',
                'photo' => 'https://rapchieuphim.com/images/avatar.png',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'actor_name' => 'Tom Payne',
                'descripcion' => null,
                'photo' => 'https://rapchieuphim.com/photos/actor/avatar/1498198745-tom-payne.jpg',
                'country' => 'England',
                'link_wiki' => null
            ],
            [
                'actor_name' => 'Jonathan Rhys Meyers',
                'descripcion' => null,
                'photo' => 'https://rapchieuphim.com/photos/actor/avatar/1498198743-jonathan-rhys-meyers.jpg',
                'country' => 'Ireland',
                'link_wiki' => null
            ],
            [
                'actor_name' => 'Michael Biehn',
                'descripcion' => null,
                'photo' => 'https://rapchieuphim.com/photos/actor/avatar/1498198740-michael-biehn.jpg',
                'country' => 'Alabama',
                'link_wiki' => null
            ],
            [
                'actor_name' => 'Cam Gigandet',
                'descripcion' => null,
                'photo' => 'https://rapchieuphim.com/photos/actor/avatar/1498198740-cam-gigandet.jpg',
                'country' => 'Tacoma, Washington',
                'link_wiki' => null
            ],
            [
                'actor_name' => 'Chris Pratt',
                'descripcion' => null,
                'photo' => 'https://rapchieuphim.com/photos/actor/avatar/1498198744-chris-pratt.jpg',
                'country' => 'Virginia, Minnesota',
                'link_wiki' => null
            ],
            [
                'actor_name' => 'Zoe Saldana',
                'descripcion' => null,
                'photo' => 'https://rapchieuphim.com/photos/actor/avatar/1498198739-zoe-saldana.jpg',
                'country' => 'Passaic, New Jersey',
                'link_wiki' => null
            ],
            [
                'actor_name' => 'Bradley Cooper',
                'descripcion' => null,
                'photo' => 'https://rapchieuphim.com/photos/actor/avatar/1498198739-bradley-cooper.jpg',
                'country' => 'U.S.',
                'link_wiki' => null
            ]
        ];
        

        foreach ($actors as &$actor) {
            $actor['created_at'] = Carbon::now();
            $actor['updated_at'] = Carbon::now();
        }

        DB::table('actor')->insert($actors);

    }
}
