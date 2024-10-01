<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable,HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    use HasFactory,Notifiable;
    protected $table = 'users';
    protected $fillable = [
        'id',
        'user_name',
        'sex',
        'password',
        'email',
        'avatar',
        'cover',
        'description',
        'phone',
        'address',
        'fullname',
        'coin',
        'role_id',
        'status',
        'rating'
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


    // public function roles(){
    //     return $this->hasMany(Role::class, 'role_id', 'role_id');
    // }

    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Hash::make($value);
    }
    public function setRoleIdAttribute($value)
    {
        $this->attributes['role_id'] = (int) $value;
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function favoriteMovies()
    {
        return $this->hasManyThrough(Movie::class, Favorite::class, 'user_id', 'id', 'id', 'movie_id');
    }
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }
}
