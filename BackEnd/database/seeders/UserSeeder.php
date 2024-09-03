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
<<<<<<< HEAD
                'password' => password_hash('admin', PASSWORD_DEFAULT),
=======
                'sex'=>'Male',
                'password' => Hash::make('password'),
                'email' => 'y5sZb@example.com',
                'phone' => '0123456789',
                'role_id' => 1,
                'address' => 'Ha Noi',
>>>>>>> a3bcd75edc7a511d9d104a2773a51e29a35a3a95
                'fullname' => 'Admin',
            ],
            [
<<<<<<< HEAD
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

=======
                'user_name' => 'admin11',
                'sex'=>'Male',
                'password' => Hash::make('password'),
                'email' => 'kien189204@gmail.com',
                'phone' => '0123456789',
                'role_id' => 1,
                'address' => 'Ha Noi',
                'fullname' => 'Admin',
            ]
>>>>>>> a3bcd75edc7a511d9d104a2773a51e29a35a3a95
        ]);
    }
}
