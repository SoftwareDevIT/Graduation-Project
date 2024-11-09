<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use GuzzleHttp\Client;

class CinemaSeeder extends Seeder
{
    public function run()
    {

        $client = new Client();
        $response = $client->get('https://rapchieuphim.com/api/v1/cinemas');
        $data = json_decode($response->getBody()->getContents(), true);
        // $data = array_slice($data, 0, 10);
        foreach ($data as $item) {
            $locationId = DB::table('location')->where('location_name', $item['city'])->value('id');
            $locationId = $locationId ?? 24;
            DB::table('cinema')->insert([
                'cinema_name' => $item['name'],
                'image' => 'https://rapchieuphim.com' . $item['image'],
                'phone' => $item['phone'],
                'location_id' => $locationId,
                'cinema_address' => $item['address'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
