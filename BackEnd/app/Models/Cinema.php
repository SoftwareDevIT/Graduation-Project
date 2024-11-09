<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cinema extends Model
{
    use HasFactory;
    protected $table = 'cinema';
    protected $primaryKey = 'id';
    protected $fillable = [
        'cinema_name',
        'phone',
        'image',
        'location_id',
        'cinema_address',
        'status',
    ];
    public function location(){
        return $this->belongsTo(Location::class);
    }
    public function movies()
    {
        return $this->belongsToMany(Movie::class, 'movie_in_cinemas', 'cinema_id', 'movie_id')

            ->withTimestamps();
    }
    // public function showtimes() {
    //     return $this->hasMany(Showtime::class);
    // }

    public function movieincinemas(){
        return $this->hasMany(MovieInCinema::class);
    }
}
