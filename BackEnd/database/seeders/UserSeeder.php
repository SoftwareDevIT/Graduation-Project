<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'user_name' => 'Admin',
                'password' => password_hash('admin', PASSWORD_DEFAULT),
                'fullname' => 'Admin',
                'role_id' =>  DB::table('role')->where('role_type', 'Admin')->value('role_id'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_name' => 'Admin',
                'password' => password_hash('312312312', PASSWORD_DEFAULT),
                'fullname' => 'Admin',
                'role_id' =>  DB::table('role')->where('role_type', 'User')->value('role_id'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_name' => 'ghjkgjgj',
                'password' => password_hash('frgergerg', PASSWORD_DEFAULT),
                'fullname' => 'Admin',
                'role_id' =>  DB::table('role')->where('role_type', 'User')->value('role_id'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_name' => 'Admjtyjtyjtyjin',
                'password' => password_hash('123', PASSWORD_DEFAULT),
                'fullname' => 'Admin',
                'role_id' =>  DB::table('role')->where('role_type', 'User')->value('role_id'),
                'created_at' => now(),
                'updated_at' => now(),
            ],

        ]);
    }
}
