<?php

namespace App\Services\Cinema;

use App\Models\Movie;
use App\Models\MovieInCinema;
use App\Models\Showtime;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Traits\AuthorizesInService;
use Carbon\Carbon;

/**
 * Class LocationService.
 */
class ShowtimeService
{
    use AuthorizesInService;
    public function index()
    {

        return Showtime::with(['movie', 'room.cinema'])->orderByDesc('created_at')->paginate(5);
    }



    public function store(array $data): Showtime
    {

        return Showtime::create($data);
    }

    public function update(int $id, array $data): Showtime
    {

        $showtime = Showtime::findOrFail($id);
        $showtime->update($data);

        return $showtime;
    }


    public function delete(int $id): ?bool
    {

        $showtime = Showtime::findOrFail($id);
        return $showtime->delete();
    }

    public function get(int $id)
    {
        $showtime = Showtime::with(['movie', 'room.cinema', 'room.seatMap']) // Include SeatMap to show seat data
            ->findOrFail($id);

        // If needed, format the seats
        $seats = $showtime->room->seatMap->groupBy('row');

        // Append formatted seats to the showtime data for easier rendering
        $showtimeData = $showtime->toArray();
        return $showtimeData;
    }





    public function getShowtimesByMovieName(string $movie_name)
    {
        // Tìm kiếm phim dựa trên tên phim
        $movie = Movie::where('movie_name', 'like', '%' . $movie_name . '%')->first();

        if (!$movie) {
            throw new ModelNotFoundException('Movie not found');
        }
        return $movie->showtimes;
    }

    public function generateShowtimes(array $data): array
    {
        $openingTime = Carbon::createFromFormat('H:i', $data['opening_time']);
        $closingTime = Carbon::createFromFormat('H:i', $data['closing_time']);
        $duration = $data['duration'];
        $price = $data['price'];

        $showtimes = [];
        while ($openingTime->addMinutes($duration)->lte($closingTime)) {
            $startTime = $openingTime->copy()->subMinutes($duration)->format('H:i:s');
            $endTime = $openingTime->format('H:i:s');

            $showtimes[] = Showtime::create([
                'room_id' => $data['room_id'],
                'movie_id' => $data['movie_id'],
                'showtime_date' => $data['date'],
                'showtime_start' => $startTime,
                'showtime_end' => $endTime,
                'price' => $price,
                'status' => '1',
            ]);
        }

        return $showtimes;
    }
}
