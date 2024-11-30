<?php

namespace App\Services\Revenue;

use App\Models\Booking;
use App\Models\Showtime;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Log;


class DashboardAdminService
{

    public function filterofbooking(?string $status, ?int $idCinema, ?string $startDate, ?string $endDate, ?string $month, ?string $year, ?string $day)
    {
        $query = Booking::query()->with('showtime');

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
                // Chuyển đổi `start_date` và `end_date` thành Carbon instance
                $start = Carbon::parse($startDate)->startOfDay();
                $end = Carbon::parse($endDate)->endOfDay();
        
                // Kiểm tra nếu ngày bắt đầu <= ngày kết thúc
                if ($start->lessThanOrEqualTo($end)) {
                    $query->whereBetween('created_at', [$start, $end]);
                } else {
                    Log::error('Start date is greater than end date');
                }
            } catch (Exception $e) {
                Log::error('Error parsing dates: ' . $e->getMessage());
            }
        }

        // Lọc theo tháng
        if (!is_null($month)) {
            try {
                $carbonDate = Carbon::createFromFormat('Y-m', $month);
                $query->whereYear('created_at', $carbonDate->year)
                    ->whereMonth('created_at', $carbonDate->month);
            } catch (Exception $e) {
                Log::error('Error parsing month: ' . $e->getMessage());
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
                // Định dạng đầy đủ cho ngày nếu thiếu `year` hoặc `month`
                if (!is_null($year) && !is_null($month)) {
                    $formattedDate = Carbon::createFromFormat('Y-m-d', "{$year}-{$month}-{$day}");
                    $query->whereDate('created_at', $formattedDate);
                } else {
                    Log::error('Year or month is missing for day filter');
                }
            } catch (Exception $e) {
                Log::error('Invalid day format: ' . $e->getMessage());
            }
        }

        // Lấy kết quả và ánh xạ dữ liệu trả về
        $result = $query->get();
        $mappedResult = $result->map(function ($item) {
            return [
                'booking_id' => $item->id,
                'user_name' => $item->user->user_name ?? 'N/A',
                'payMethod' => $item->payMethod->pay_method_name ?? 'N/A',
                'amount' => $item->amount,
                'status' => $item->status,
                'showtime_date' => $item->showtime->showtime_date ?? 'N/A',
                'room_name' => $item->showtime->room->room_name ?? 'N/A',
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
