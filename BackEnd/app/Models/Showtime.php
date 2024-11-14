<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Showtime extends Model
{
    use HasFactory;

    protected $table = 'showtimes';
    // protected $primaryKey = 'id';
    protected $fillable = [
        'movie_in_cinema_id',
        'room_id',
        // 'cinema_id',
        'showtime_date',
        'showtime_start',
        'showtime_end',
        'status',
        'price',
    ];

    public function movie()
    {
        return $this->belongsTo(Movie::class);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
    public function seats()
    {
        return $this->hasMany(Seats::class, 'showtime_id');
    }
    // public function cinema()
    // {
    //     return $this->belongsTo(Cinema::class);
    // }

    public function movieincinemas()
    {
        return $this->hasMany(MovieInCinema::class);
    }
    public function movieInCinema()
    {
        return $this->belongsTo(MovieInCinema::class);
    }

}