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
}
