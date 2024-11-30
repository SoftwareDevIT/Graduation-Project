<?php

namespace App\Services\Revenue;

use App\Models\Booking;
use App\Models\Showtime;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Log;


class DashboardAdminService
{

    // public function dashboardAdmin()
    // {

    //     $query = Booking::query();

    //     // Tải các mối quan hệ cần thiết
    //     $bookings = $query->with('showtime.movieInCinema.movie')->get();

    //     // Khởi tạo mảng kết quả
    //     $result = [
    //         'Pending' => [],
    //         'Pain' => [],
    //         'Confirmed' => []
    //     ];

    //     // Nhóm dữ liệu theo trạng thái
    //     foreach ($bookings as $booking) {
    //         $status = $booking->status; // Trạng thái của booking

    //         // Kiểm tra xem trạng thái có trong mảng kết quả không
    //         if (isset($result[$status])) {
    //             // Đếm số lượng vé cho từng booking trong trạng thái này
    //             $quantity_ticket = Booking::where('status', $status)->count();

    //             // Thêm thông tin vào mảng kết quả
    //             $result[$status][] = [
    //                 'amount' => $booking->amount,

    //                 'quantity_ticket' => $quantity_ticket // Số lượng booking cho trạng thái hiện tại
    //             ];
    //         }
    //     }

    //     return $result; // Trả về kết quả đã nhóm theo trạng thái

    // }

    private function dashboardAdmin(?string $status, ?int $idCinema, ?string $startDate, ?string $endDate, ?int $year = null, ?int $month = null, ?int $day = null)
    {
        $query = Booking::query();

        // Lọc theo trạng thái
        if (!is_null($status)) {
            $query->where('status', $status);
        }

        // Lọc theo cinema_id nếu có
        if (!is_null($idCinema)) {
            $query->whereHas('showtime.movieInCinema.cinema', function ($subQuery) use ($idCinema) {
                $subQuery->where('id', $idCinema);
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

        // Lọc theo năm, tháng và ngày nếu có
        if (!is_null($year)) {
            $query->whereYear('created_at', $year);
        }

        if (!is_null($month)) {
            $query->whereMonth('created_at', $month);
        }

        if (!is_null($day)) {
            $query->whereDay('created_at', $day);
        }

        $bookings = $query->with('user')->get();

        $totalRevenue = $query->sum('amount');

        return response()->json([
            'totalRevenue' => $totalRevenue,
            'bookings' => $bookings,
        ]);
    }

    public function totalRevenue(string $status, ?int $year = null, ?int $month = null, ?int $day = null)
    {
        return $this->dashboardAdmin($status, null, null, null, $year, $month, $day);
    }

    public function totalRevenueByCinema(int $idCinema, ?int $year = null, ?int $month = null, ?int $day = null)
    {
        return $this->dashboardAdmin(null, $idCinema, null, null, $year, $month, $day);
    }

    public function totalRevenueByCinemaBetweenDates(int $idCinema, string $startDate, string $endDate, ?int $year = null, ?int $month = null, ?int $day = null)
    {
        return $this->dashboardAdmin('Confirmed', $idCinema, $startDate, $endDate, $year, $month, $day);
    }

    public function totalRevenueBetweenDates(string $startDate, string $endDate, ?int $year = null, ?int $month = null, ?int $day = null)
    {
        return $this->dashboardAdmin('Confirmed', null, $startDate, $endDate, $year, $month, $day);
    }
}
