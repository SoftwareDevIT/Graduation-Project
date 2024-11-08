<?php

namespace Database\Seeders;

use GuzzleHttp\Client;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'user_name' => 'admin',
                'sex' => 'Male',
                'password' => Hash::make('password'),
                'email' => 'admin@gmail.com',
                'phone' => '0123456789',
                'address' => 'Ha Noi',
                'fullname' => 'Admin',
                'email_verified_at' => now(),
            ]
        ]);

        $client = new Client();
        $response = $client->get('https://rapchieuphim.com/api/v1/users');
        $data = json_decode($response->getBody()->getContents(), true);

        foreach ($data as $item) {
            DB::table('users')->insert([
                'user_name' => $item['name'],
                'avatar' => $item['avatar'],
                'sex' => $item['sex'],
                'password' => Hash::make('password'),
                'phone' => $item['phone'],
                'address' => 'Ha Noi',
                'fullname' => $item['fullname'],
                'email_verified_at' => now(),
            ]);
        }

    }
}
