<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use GuzzleHttp\Client;

class DirectorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $client = new Client();
        $response = $client->get('https://rapchieuphim.com/api/v1/directors');
        $data = json_decode($response->getBody()->getContents(), true);
        $data = array_slice($data, 0, 100);
        foreach ($data as $item) {
            DB::table('director')->insert([
                'director_name' => $item['name'],
                'slug' => $item['slug'],
                'photo' => $item['photo'],
                'descripcion' => $item['description'],
                'country' => $item['country'],
                'link_wiki' => 'https://vi.wikipedia.org/wiki/'.$item['name'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

    }
}