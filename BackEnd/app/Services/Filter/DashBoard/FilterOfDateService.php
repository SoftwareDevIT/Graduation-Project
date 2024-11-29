<?php

namespace App\Services\Filter\DashBoard;

use App\Models\Booking;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Log;

class FilterOfDateService
{
    public function filtercalculateRevenue(?string $status, ?int $idCinema, ?string $startDate, ?string $endDate, ?string $month, ?string $year, ?string $day)
    {
        $query = Booking::query()->with('showtime');

        if (!is_null($status)) {
            $query->where('status', $status);
        }

        if (!is_null($idCinema)) {
            $query->whereHas('showtime.movieInCinema.cinema', function ($subQuery) use ($idCinema) {
                $subQuery->where('id', $idCinema);
            });
        }

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

        if (!is_null($month)) {
            $carbonDate = Carbon::createFromFormat('Y-m', $month);
            $query->whereYear('created_at', $carbonDate->year)
                ->whereMonth('created_at', $carbonDate->month);
        }

        if (!is_null($year)) {
            $query->whereYear('created_at', $year);
        }

        if (!is_null($day)) {
            $query->whereDate('created_at', $day);
        }

        $result = $query->get();
        $mappedResult = $result->map(function ($item) {
            return [
                'booking_id' => $item->id,
                'user_name' => $item->user->user_name,
                'payMethod' => $item->payMethod->pay_method_name,
                'amount' => $item->amount,
                'movie_name' => $item->showtime->moviecinema->movie->movie_name,
                'status' => $item->status,
                'showtime_date' => $item->showtime->showtime_date,
                'room_name' => $item->showtime->room->room_name,
                'cinema_name' => $item->showtime->moviecinema->cinema->cinema_name,
                'created_at' => $item->created_at
            ];
        });

        return $mappedResult;
    }

    public function totaldashboard($data)
    {
    $totalAmount = $data->sum('amount');
    $bookingCount = $data->count();

    return [
        'total_amount' => $totalAmount,
        'booking_count' => $bookingCount
    ];
    }
}
