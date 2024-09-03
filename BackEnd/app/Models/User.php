<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, HasFactory;

    use HasFactory, Notifiable;
    protected $table = 'users';
    protected $fillable = [
        'user_id',
        'user_name',
        'sex',
        'password',
        'email',
        'avatar',
        'phone',
        'address',
        'fullname',
        'coin',
        'role_id',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];


    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];


    public function roles()
    {
        return $this->hasMany(Role::class, 'role_id', 'role_id');
    }

    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Hash::make($value);
    }
    public function setRoleIdAttribute($value)
    {
        $this->attributes['role_id'] = (int) $value;
    }
}
