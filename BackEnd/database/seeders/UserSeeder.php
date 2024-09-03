<?php

namespace Database\Seeders;

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
                'sex'=>'Male',
                'password' => Hash::make('password'),
                'email' => 'y5sZb@example.com',
                'phone' => '0123456789',
                'role_id' => 1,
                'address' => 'Ha Noi',
                'fullname' => 'Admin',
            ],
            [
                'user_name' => 'admin11',
                'sex'=>'Male',
                'password' => Hash::make('password'),
                'email' => 'kien189204@gmail.com',
                'phone' => '0123456789',
                'role_id' => 1,
                'address' => 'Ha Noi',
                'fullname' => 'Admin',
            ]
        ]);
    }
}
