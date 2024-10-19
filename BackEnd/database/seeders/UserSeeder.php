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
                'email' => 'admin@gmail.com',
                'phone' => '0123456789',
                // 'role_id' => 1,
                'address' => 'Ha Noi',
                'fullname' => 'Admin',
                'email_verified_at'=> now(),
            ],
            [
                'user_name' => 'manager',
                'sex'=>'Male',
                'password' => Hash::make('password'),
                'email' => 'manager@gmail.com',
                'phone' => '0123456789',
                // 'role_id' => 1,
                'address' => 'Ha Noi',
                'fullname' => 'manager',
                'email_verified_at'=> now(),
            ],
            [
                'user_name' => 'staff',
                'sex'=>'Male',
                'password' => Hash::make('password'),
                'email' => 'staff@gmail.com',
                'phone' => '0123456789',
                // 'role_id' => 1,
                'address' => 'Ha Noi',
                'fullname' => 'staff',
                'email_verified_at'=> now(),
            ],
            [
                'user_name' => 'user',
                'sex'=>'Male',
                'password' => Hash::make('password'),
                'email' => 'user@gmail.com',
                'phone' => '0123456789',
                // 'role_id' => 1,
                'address' => 'Ha Noi',
                'fullname' => 'User',
                'email_verified_at'=> now(),
            ]

        ]);
    }
}
