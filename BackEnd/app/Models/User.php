<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;

class User extends Model
{
    use HasFactory,Notifiable;
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
        'created_at',
        'updated_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ]; 


    public function roles(){
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





// namespace App\Models;

// // use Illuminate\Contracts\Auth\MustVerifyEmail;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Foundation\Auth\User as Authenticatable;
// use Illuminate\Notifications\Notifiable;
// use Laravel\Sanctum\HasApiTokens;

// class User extends Authenticatable
// {
//     use HasApiTokens, HasFactory, Notifiable;

//     /**
//      * The attributes that are mass assignable.
//      *
//      * @var array<int, string>
//      */
//     protected $fillable = [
//         'name',
//         'email',
//         'password',
//     ];

    
// }
