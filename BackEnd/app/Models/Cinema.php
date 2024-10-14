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
        'location_id',
        'cinema_address',
        'status',
    ];
    public function location(){
        return $this->belongsTo(Location::class);
    }
    public function movies()
    {
        return $this->hasMany(Movie::class);
    }
    // public function showtimes() {
    //     return $this->hasMany(Showtime::class);
    // }

    public function movieincinemas(){
        return $this->hasMany(MovieInCinema::class);
    }
}
