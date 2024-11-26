<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Traits\Slugable;

class Showtime extends Model
{
    use HasFactory, Slugable;

    protected $table = 'showtimes';
    // protected $primaryKey = 'id';
    protected $fillable = [
        'movie_in_cinema_id',
        'room_id',
        'showtime_date',
        'showtime_start',
        'showtime_end',
        'price',
        'status',
    ];

    public function moviecinema()
    {
        return $this->belongsTo(MovieInCinema::class, 'movie_in_cinema_id');
    }

    /**
     * Quan hệ: Movie từ MovieInCinema
     */
    public function movie()
    {
        return $this->moviecinema()->with('movie');
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

    protected static function booted()
    {
        static::creating(function ($showtime) {
            // Lấy duration từ movie liên kết qua movie_in_cinema
            if ($showtime->movieInCinema && $showtime->movieInCinema->movie && $showtime->showtime_start) {
                $duration = $showtime->movieInCinema->movie->duration;
                $showtime->showtime_end = self::calculateShowtimesEnd($showtime->showtime_start, $duration);
            }
        });

        static::updating(function ($showtime) {
            // Cập nhật showtime_end khi showtime_start thay đổi
            if ($showtime->isDirty('showtime_start') && $showtime->movieInCinema && $showtime->movieInCinema->movie) {
                $duration = $showtime->movieInCinema->movie->duration;
                $showtime->showtime_end = self::calculateShowtimesEnd($showtime->showtime_start, $duration);
            }
        });
    }
    public function cinema()
    {
        return $this->belongsTo(Cinema::class);
    }



    public static function calculateShowtimesEnd($showtimeStart, $duration)
    {
        return date('H:i:s', strtotime($showtimeStart) + ($duration * 60));
    }
}
