<?php

namespace App\Services\Revenue;

use App\Models\Booking;
use App\Models\Showtime;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Log;


class DashboardAdminService
{

    public function dashboardAdmin()
    {

        $query = Booking::query();

        // Tải các mối quan hệ cần thiết
        $bookings = $query->with('showtime.movieInCinema.movie')->get();

        // Khởi tạo mảng kết quả
        $result = [
            'Pending' => [],
            'Pain' => [],
            'Confirmed' => []
        ];

        // Nhóm dữ liệu theo trạng thái
        foreach ($bookings as $booking) {
            $status = $booking->status; // Trạng thái của booking

            // Kiểm tra xem trạng thái có trong mảng kết quả không
            if (isset($result[$status])) {
                // Đếm số lượng vé cho từng booking trong trạng thái này
                $quantity_ticket = Booking::where('status', $status)->count();

                // Thêm thông tin vào mảng kết quả
                $result[$status][] = [
                    'amount' => $booking->amount,
                 
                    'quantity_ticket' => $quantity_ticket // Số lượng booking cho trạng thái hiện tại
                ];
            }
        }

        return $result; // Trả về kết quả đã nhóm theo trạng thái

    }
}
