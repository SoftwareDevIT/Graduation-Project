<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ComboSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('combos')->insert([
            [
                'combo_name' => 'Meo meo big size',

                'price' => 200000,
                'volume' => 999,
            ],
            [
                'combo_name' => 'Meo meo mini size',

                'price' => 24234,
                'volume' => 234234,
            ],
            [
                'combo_name' => 'Meo meo premium',

                'price' => 234,
                'volume' => 34,
            ],


        ]);
    }
}
