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
        $directors = [
            [
                'director_name' => 'F. Gary Gray',
                'descripcion' => null,
                'photo' => 'http://rapchieuphim.com/images/avatar.png',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'director_name' => 'Lê Thanh Sơn, Charlie Nguyễn',
                'descripcion' => null,
                'photo' => 'http://rapchieuphim.com/images/avatar.png',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'director_name' => 'Yamamoto Yaseuichiro',
                'descripcion' => null,
                'photo' => 'http://rapchieuphim.com/images/avatar.png',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'director_name' => 'Nacho Vigalondo',
                'descripcion' => null,
                'photo' => 'http://rapchieuphim.com/images/avatar.png',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'director_name' => 'Tom McGrath',
                'descripcion' => null,
                'photo' => 'https://rapchieuphim.com/photos/director/avatar/1498195853-tom-mcgrath.jpg',
                'country' => 'Lynnwood, Washington',
                'link_wiki' => null
            ],
            [
                'director_name' => 'Andrew Goth',
                'descripcion' => null,
                'photo' => 'http://rapchieuphim.com/images/avatar.png',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'director_name' => 'Obin Olson, Amariah Olson',
                'descripcion' => null,
                'photo' => 'http://rapchieuphim.com/images/avatar.png',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'director_name' => 'James Gunn',
                'descripcion' => null,
                'photo' => 'https://rapchieuphim.com/photos/director/avatar/1498193581-james-gunn.jpg',
                'country' => 'St. Louis, Missouri',
                'link_wiki' => null
            ],
            [
                'director_name' => 'Gerard Barrett',
                'descripcion' => null,
                'photo' => 'http://rapchieuphim.com/images/avatar.png',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'director_name' => 'Kelly Asbury',
                'descripcion' => null,
                'photo' => 'http://rapchieuphim.com/images/avatar.png',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'director_name' => 'Ayush Banker, Justin LaReau',
                'descripcion' => null,
                'photo' => 'http://rapchieuphim.com/images/avatar.png',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'director_name' => 'Huỳnh Tuấn Anh',
                'descripcion' => null,
                'photo' => 'http://rapchieuphim.com/images/avatar.png',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'director_name' => 'Park Kwang-hyun',
                'descripcion' => null,
                'photo' => 'https://rapchieuphim.com/photos/director/avatar/1498699036-park-kwang-hyun.jpg',
                'country' => 'South Korea',
                'link_wiki' => null
            ],
            [
                'director_name' => 'Jordan Peele',
                'descripcion' => null,
                'photo' => 'https://rapchieuphim.com/photos/director/avatar/1498197589-jordan-peele.jpg',
                'country' => 'U.S.',
                'link_wiki' => null
            ],
            [
                'director_name' => 'Jordan Vogt-Roberts',
                'descripcion' => null,
                'photo' => 'https://rapchieuphim.com/photos/director/avatar/1498197576-jordan-vogt-roberts.jpg',
                'country' => 'United States',
                'link_wiki' => null
            ],
            [
                'director_name' => 'Lương Đình Dũng',
                'descripcion' => null,
                'photo' => 'http://rapchieuphim.com/images/avatar.png',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'director_name' => 'Bill Condon',
                'descripcion' => null,
                'photo' => 'http://rapchieuphim.com/images/avatar.png',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'director_name' => 'Nguyễn Quang Dũng',
                'descripcion' => null,
                'photo' => 'http://rapchieuphim.com/images/avatar.png',
                'country' => '',
                'link_wiki' => null
            ],
            [
                'director_name' => 'Cho Ui-seok',
                'descripcion' => null,
                'photo' => 'http://rapchieuphim.com/images/avatar.png',
                'country' => 'South Korea',
                'link_wiki' => null
            ],
            [
                'director_name' => 'F. Javier Gutiérrez',
                'descripcion' => null,
                'photo' => 'http://rapchieuphim.com/images/avatar.png',
                'country' => '',
                'link_wiki' => null
            ],
            [
                'director_name' => 'Zach Braff',
                'descripcion' => null,
                'photo' => 'https://rapchieuphim.com/photos/director/avatar/1498197606-zach-braff.jpg',
                'country' => 'South Orange, New Jersey',
                'link_wiki' => null
            ],
            [
                'director_name' => 'Damien Chazelle',
                'descripcion' => null,
                'photo' => 'http://rapchieuphim.com/images/avatar.png',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'director_name' => 'M. Night Shyamalan',
                'descripcion' => null,
                'photo' => 'http://rapchieuphim.com/images/avatar.png',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'director_name' => 'Scott Derrickson',
                'descripcion' => null,
                'photo' => 'http://rapchieuphim.com/images/avatar.png',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'director_name' => 'Eric D. Howell',
                'descripcion' => null,
                'photo' => 'http://rapchieuphim.com/images/avatar.png',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'director_name' => 'Nicholas Stoller, Doug Sweetland',
                'descripcion' => null,
                'photo' => 'http://rapchieuphim.com/images/avatar.png',
                'country' => 'State College, Pennsylvania',
                'link_wiki' => null
            ],
            [
                'director_name' => 'Eric Summer, Éric Warin',
                'descripcion' => null,
                'photo' => 'http://rapchieuphim.com/images/avatar.png',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'director_name' => 'Luís Quílez',
                'descripcion' => null,
                'photo' => 'http://rapchieuphim.com/images/avatar.png',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'director_name' => 'Oleg Malovichko',
                'descripcion' => null,
                'photo' => 'http://rapchieuphim.com/images/avatar.png',
                'country' => null,
                'link_wiki' => null
            ],
            [
                'director_name' => 'Baran bo Odar',
                'descripcion' => null,
                'photo' => 'http://rapchieuphim.com/images/avatar.png',
                'country' => null,
                'link_wiki' => null
            ]
        ];
        

        foreach ($directors as &$direct) {
            $direct['created_at'] = Carbon::now();
            $direct['updated_at'] = Carbon::now();
        }

        DB::table('director')->insert($directors);

    }
}
