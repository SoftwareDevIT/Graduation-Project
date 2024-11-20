<?php

namespace Database\Seeders;

use GuzzleHttp\Client;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $client = new Client();
        $response = $client->get('https://rapchieuphim.com/api/v1/cinemas');
        $data = json_decode($response->getBody()->getContents(), true);

        foreach ($data as $item) {
            if (!is_null($item['city'])) {
                $existingLocation = DB::table('location')->where('location_name', $item['city'])->first();
                if (!$existingLocation) {
                    DB::table('location')->insert([
                        'location_name' => $item['city'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}