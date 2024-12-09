<?php

namespace App\Services\Revenue;

use App\Models\Booking;
use App\Models\Movie;
use App\Models\Showtime;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Facades\Log;


class DashboardAdminService
{

    public function filterofbooking(?string $status, ?int $idCinema, ?string $startDate, ?string $endDate, ?string $month, ?string $year, ?string $day)
    {
        $query = Booking::query()->with('showtime.movie');

        // Lọc theo trạng thái
        if (!is_null($status)) {
            $query->where('status', $status);
        }

        // Lọc theo ID rạp, nếu không có thì lấy tất cả rạp
        if (!is_null($idCinema)) {
            $query->whereHas('showtime.room.cinema', function ($subQuery) use ($idCinema) {
                $subQuery->where('id', $idCinema);
            });
        }

        // Lọc theo khoảng thời gian
        if (!is_null($startDate) && !is_null($endDate)) {
            try {

                $start = Carbon::parse($startDate)->startOfDay();
                $end = Carbon::parse($endDate)->endOfDay();
                if ($start->lessThanOrEqualTo($end)) {
                    $query->whereBetween('created_at', [$start, $end]);
                } else {
                    Log::error('Ngày bắt đầu lớn hơn ngày kết thúc');
                }
            } catch (Exception $e) {
                Log::error('Lỗi: ' . $e->getMessage());
            }
        }

        // Lọc theo tháng
        if (!is_null($month)) {
            try {
                $carbonDate = Carbon::createFromFormat('Y-m', $month);
                $query->whereYear('created_at', $carbonDate->year)
                    ->whereMonth('created_at', $carbonDate->month);
            } catch (Exception $e) {
                Log::error('Lỗi định dạng: ' . $e->getMessage());
                return collect([]);
            }
        }

        // Lọc theo năm
        if (!is_null($year)) {
            $query->whereYear('created_at', $year);
        }

        // Lọc theo ngày
        if (!is_null($day)) {
            try {
                $formattedDate = Carbon::createFromFormat('Y-m-d', $day);
                $query->whereDate('created_at', $formattedDate);
            } catch (Exception $e) {
                Log::error('Lỗi định dạng: ' . $e->getMessage());
            }
        }

        $result = $query->get();

        $movies = Booking::select('showtimes.movie_id', DB::raw('SUM(booking.amount) as total_amount'), DB::raw('COUNT(*) as booking_count'))
            ->join('showtimes', 'booking.showtime_id', '=', 'showtimes.id')
            ->where(function ($query) use ($status, $idCinema, $startDate, $endDate, $month, $year, $day) {
                if (!is_null($status)) {
                    $query->where('booking.status', $status);
                }
                if (!is_null($idCinema)) {
                    $query->whereHas('showtime.room.cinema', function ($subQuery) use ($idCinema) {
                        $subQuery->where('id', $idCinema);
                    });
                }
                if (!is_null($startDate) && !is_null($endDate)) {
                    $start = Carbon::parse($startDate)->startOfDay();
                    $end = Carbon::parse($endDate)->endOfDay();
                    $query->whereBetween('booking.created_at', [$start, $end]);
                }
                if (!is_null($month)) {
                    try {
                        $carbonDate = Carbon::createFromFormat('Y-m', $month);
                        $query->whereYear('booking.created_at', $carbonDate->year)
                            ->whereMonth('booking.created_at', $carbonDate->month);
                    } catch (Exception $e) {
                        Log::error('Lỗi định dạng: ' . $e->getMessage());
                    }
                }
                if (!is_null($year)) {
                    $query->whereYear('booking.created_at', $year);
                }
                if (!is_null($day)) {
                    try {
                        $formattedDate = Carbon::createFromFormat('Y-m-d', $day);
                        $query->whereDate('booking.created_at', $formattedDate);
                    } catch (Exception $e) {
                        Log::error('Lỗi định dạng: ' . $e->getMessage());
                    }
                }
            })
            ->groupBy('showtimes.movie_id')
            ->get();


        $mappedResult = $result->map(function ($item) {
            return [
                'booking_id' => $item->id,
                'user_name' => $item->user->user_name ?? 'N/A',
                'payMethod' => $item->payMethod->pay_method_name ?? 'N/A',
                'amount' => $item->amount,
                'status' => $item->status,
                'showtime_date' => $item->showtime->showtime_date ?? 'N/A',
                'room_name' => $item->showtime->room->room_name ?? 'N/A',
                'movie_name' => $item->showtime->movie->movie_name ?? 'N/A',
                'created_at' => $item->created_at
            ];
        });

        $movieData = $movies->map(function ($item) {

            $movie = Movie::find($item->movie_id);

            return [
                'movie_name' => $movie->movie_name ?? 'N/A',
                'total_amount' => $item->total_amount,
                'booking_count' => $item->booking_count,
            ];
        });

        return [
            'filtered_data' => $mappedResult,
            'data_movie' => $movieData
        ];
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


    public function revenuebooking($status, ?int $idCinema)
    {
        $query = Booking::query()->with('showtime.movie');

        if (!is_null($idCinema)) {
            $query->whereHas('showtime.room.cinema', function ($subQuery) use ($idCinema) {
                $subQuery->where('id', $idCinema);
            });
        }
        if (!is_null($status)) {
            if (is_array($status)) {
                $query->whereIn('status', $status);
            } else {
                $query->where('status', $status);
            }
        }
        return $query->get();
    }

    public function movierevenue($booking)
    {
        $movieRevenue = [];

        foreach ($booking as $book) {
            $movieId = $book->showtime->movie->id ?? null;
            $totalPrice = $book->amount ?? 0;
            $movieName = $book->showtime->movie->movie_name ?? 'Unknown';
            $movieImage = $book->showtime->movie->thumbnail ?? null;

            if ($movieId) {
                if (!isset($movieRevenue[$movieId])) {
                    $movieRevenue[$movieId] = [
                        'movie_id' => $movieId,
                        'movie_name' => $movieName,
                        'movie_image' => $movieImage,
                        'total_revenue' => 0,
                        'showtime_count' => 0,
                    ];
                }

                $movieRevenue[$movieId]['total_revenue'] += $totalPrice;
                $movieRevenue[$movieId]['showtime_count'] += 1;
            }
        }

        return array_values($movieRevenue);
    }

    public function dayrevenue($booking, $day)
    {
        $selectedDate = Carbon::createFromFormat('Y-m-d', $day);
        $previousDate = $selectedDate->copy()->subDay();

        $revenueToday = 0;
        $revenueYesterday = 0;

        foreach ($booking as $book) {
            $bookingDate = Carbon::parse($book->created_at);

            if ($bookingDate->isSameDay($selectedDate)) {
                $revenueToday += $book->amount;
            }

            if ($bookingDate->isSameDay($previousDate)) {
                $revenueYesterday += $book->amount;
            }
        }

        $percentageChange = $revenueYesterday > 0
            ? (($revenueToday - $revenueYesterday) / $revenueYesterday) * 100
            : ($revenueToday > 0 ? 100 : 0);

        return [
            'current_revenue' => $revenueToday, // ngày được chọn
            'previous_revenue' => $revenueYesterday, // ngàyngày trước ngày được chọn 
            'percentage_change' => round($percentageChange, 2), // tỉ lệ tăng giảm
        ];
    }

    public function monthrevenue($booking, $month)
    {
        $selectedMonth = Carbon::createFromFormat('Y-m', $month);
        $previousMonth = $selectedMonth->copy()->subMonth();
        $revenueThisMonth = 0;
        $revenueLastMonth = 0;

        foreach ($booking as $book) {
            $bookingDate = Carbon::parse($book->created_at);

            if ($bookingDate->month == $selectedMonth->month && $bookingDate->year == $selectedMonth->year) {
                $revenueThisMonth += $book->amount;
            }
            if ($bookingDate->month == $previousMonth->month && $bookingDate->year == $previousMonth->year) {
                $revenueLastMonth += $book->amount;
            }
        }

        $percentageChange = $revenueLastMonth > 0
            ? (($revenueThisMonth - $revenueLastMonth) / $revenueLastMonth) * 100
            : ($revenueThisMonth > 0 ? 100 : 0);

        return [
            'current_revenue' => $revenueThisMonth, // Tháng được chọn
            'previous_revenue' => $revenueLastMonth, // Tháng trước đó
            'percentage_change' => round($percentageChange, 2), // tỉ lệ tăng giảm
        ];
    }

    public function yearrevenue($booking, $year)
    {
        $selectedYear = Carbon::create($year, 1, 1); // Năm được chọn
        $previousYear = $selectedYear->copy()->subYear(); // Năm trước đó

        $revenueThisYear = 0;
        $revenueLastYear = 0;

        foreach ($booking as $book) {
            $bookingDate = Carbon::parse($book->created_at);

            if ($bookingDate->year == $selectedYear->year) {
                $revenueThisYear += $book->amount;
            }

            if ($bookingDate->year == $previousYear->year) {
                $revenueLastYear += $book->amount;
            }
        }

        $percentageChange = $revenueLastYear > 0
            ? (($revenueThisYear - $revenueLastYear) / $revenueLastYear) * 100
            : ($revenueThisYear > 0 ? 100 : 0);

        return [
            'current_revenue' => $revenueThisYear, // Năm được chọn
            'previous_revenue' => $revenueLastYear, // Năm trước đó
            'percentage_change' => round($percentageChange, 2), // tỉ lệ tăng giảm
        ];
    }

    public function monthlyRevenue($idCinema, $status = null, $year = null)
    {
        // Create the initial query
        $query = Booking::query()->with('showtime.movie');

        // Apply cinema filter if provided
        if (!is_null($idCinema)) {
            $query->whereHas('showtime.room.cinema', function ($subQuery) use ($idCinema) {
                $subQuery->where('id', $idCinema);
            });
        }

        // Apply status filter if provided
        if (!is_null($status)) {
            if (is_array($status)) {
                $query->whereIn('status', $status);
            } else {
                $query->where('status', $status);
            }
        }

        // Apply year filter if provided
        if (!is_null($year)) {
            $query->whereYear('created_at', $year);
        }

        // Initialize an empty array for the revenue data
        $monthlyRevenue = [];

        // Loop through each month (1 to 12)
        for ($month = 1; $month <= 12; $month++) {
            $mo = Carbon::createFromDate($year, $month, 1);
            $monthlyBookings = $query->whereMonth('created_at', $mo->month)
                ->whereYear('created_at', $mo->year)
                ->get();
            
            $totalRevenue = $monthlyBookings->sum('amount');
            $monthlyRevenue[$month] = $totalRevenue;
        }

        return $monthlyRevenue;
    }


    public function revenueByDateRange($booking, $startDate = null, $endDate = null)
    {

        if (is_null($startDate) || is_null($endDate)) {
            $endDate = now();
            $startDate = now()->subDays(15);
        }
        
        $dailyRevenue = [];
        
        $dateRange = Carbon::parse($startDate)->toPeriod(Carbon::parse($endDate));
        
        foreach ($dateRange as $date) {
            $revenueForDay = $booking
                ->whereDate('created_at', $date->format('Y-m-d'))
                ->sum('amount');
        
            $dailyRevenue[$date->format('Y-m-d')] = $revenueForDay;
        }
        
        return $dailyRevenue;
    }
}
