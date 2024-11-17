<?php

namespace Database\Seeders;

use Carbon\Carbon;
use GuzzleHttp\Client;
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
        $client = new Client();
        $response = $client->get('https://rapchieuphim.com/api/v1/actors');
        $data = json_decode($response->getBody()->getContents(), true);
        $data = array_slice($data, 0, 100);
        foreach ($data as $item) {
            DB::table('actor')->insert([
                'actor_name' => $item['name'],
                'photo' => $item['photo'],
                'slug' => $item['slug'],
                'descripcion' => $item['description'],
                'country' => $item['country'],
                'link_wiki' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

    }
}