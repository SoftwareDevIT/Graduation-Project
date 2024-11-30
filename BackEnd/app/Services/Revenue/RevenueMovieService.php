<?php

namespace App\Services\Revenue;

use App\Models\Booking;
use App\Models\Showtime;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Log;


class RevenueMovieService
{

    private function calculateRevenue(?string $status, ?int $idMovie, ?string $startDate, ?string $endDate)
    {
        $query = Booking::query();

        // Lọc theo trạng thái
        if (!is_null($status)) {
            $query->where('status', $status);
        }

        // Lọc theo cinema_id nếu có
        if (!is_null($idMovie)) {
            $query->whereHas('showtime.movieInCinema.movie', function ($subQuery) use ($idMovie) {
                $subQuery->where('id', $idMovie);
            });
        }

        // Lọc theo khoảng thời gian
        if (!is_null($startDate) && !is_null($endDate)) {
            try {
                $start = Carbon::parse($startDate)->startOfDay();
                $end = Carbon::parse($endDate)->endOfDay();
                $query->whereBetween('created_at', [$start, $end]);
            } catch (Exception $e) {
                Log::error('Error parsing dates: ' . $e->getMessage());
                return 0;
            }
        }

        // Tính tổng doanh thu
        // return $query->with('showtime.movieInCinema.movie') 
        // ->get()
        // ->map(function ($booking) {
        //     return [
        //         'movie_name' => $booking->showtime->movieInCinema->movie->movie_name, 
        //         'amount' => $booking->amount,
                
        //         // 'price_ticket' => $booking->showtime->ticket_price, 
        //         // 'price_combo' => $booking->combo_price
        //     ];
        // });;

        return $query->sum('amount');
    }


    public function totalRevenueMovie(string $status)
    {
        return $this->calculateRevenue($status, null, null, null);
    }


    public function totalRevenueByMovie(int $idMovie)
    {
        return $this->calculateRevenue('Confirmed', $idMovie, null, null);
       
    }


    public function totalRevenueByMovieBetweenDates(int $idMovie, string $startDate, string $endDate)
    {
        return $this->calculateRevenue('Confirmed', $idMovie, $startDate, $endDate);
    }


    public function totalRevenueMovieBetweenDates(string $startDate, string $endDate)
    {
        return $this->calculateRevenue('Confirmed', null, $startDate, $endDate);
    }
}
