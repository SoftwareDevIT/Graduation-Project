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
                'user_name' => 'admin',
                'password' => password_hash('admin', PASSWORD_DEFAULT),
                'fullname' => 'Admin',
                'role_id' =>  DB::table('role')->where('role_type', 'Admin')->value('role_id'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_name' => 'Meohh',
                'password' => password_hash('12312231231231', PASSWORD_DEFAULT),
                'fullname' => 'Admin',
                'role_id' =>  DB::table('role')->where('role_type', 'User')->value('role_id'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_name' => 'Giku89',
               'password' => password_hash('123123123', PASSWORD_DEFAULT),
                'fullname' => 'Admin',
                'role_id' =>  DB::table('role')->where('role_type', 'User')->value('role_id'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_name' => 'meomeo24',
               'password' => password_hash('', PASSWORD_DEFAULT),
                'fullname' => 'Admin',
                'role_id' =>  DB::table('role')->where('role_type', 'User')->value('role_id'),
                'created_at' => now(),
                'updated_at' => now(),
            ],

        ]);
    }
}
