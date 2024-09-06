<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CinemaSeeder extends Seeder
{
    public function run()
    {

        DB::table('cinema')->insert([
            [
                'cinema_name' => 'Meta Circle - Hoàng Mai',
                'phone' => '0123456789',
                'location_id' => DB::table('location')->where('location_name', 'Hà Nội')->value('id'),
                'cinema_address' => '123 Đường ABC, Quận Hoàng Mai, Hà Nội',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'cinema_name' => 'Meta Circle - Hà Đông',
                'phone' => '0123456789',
                'location_id' => DB::table('location')->where('location_name', 'Hà Nội')->value('id'),
                'cinema_address' => '123 Đường ABC, Quận Hà Đông, Hà Nội',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'cinema_name' => 'Meta Circle - Đống Đa',
                'phone' => '0123456789',
                'location_id' => DB::table('location')->where('location_name', 'Hà Nội')->value('id'),
                'cinema_address' => '123 Đường ABC, Quận Đống Đa, Hà Nội',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'cinema_name' => 'Meta Circle - TP Hai Bà Trưng',
                'phone' => '0123456789',
                'location_id' => DB::table('location')->where('location_name', 'TP Hồ Chí Minh')->value('id'),
                'cinema_address' => '123 Đường ABC, Quận TP Hai Bà Trưng, TP Hồ Chí Minh',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'cinema_name' => 'Meta Circle - Bến Thành',
                'phone' => '0123456789',
                'location_id' => DB::table('location')->where('location_name', 'TP Hồ Chí Minh')->value('id'),
                'cinema_address' => '123 Đường ABC, Quận Bến Thành, TP Hồ Chí Minh',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'cinema_name' => 'Meta Circle - Vincom Đà Nẵng',
                'phone' => '0123456789',
                'location_id' => DB::table('location')->where('location_name', 'Đà Nẵng')->value('id'),
                'cinema_address' => '123 Đường ABC, Quận Vincom, Đà Nẵng',
                'created_at' => now(),
                'updated_at' => now(),
            ],

        ]);
    }
}
