<?php

namespace App\Services\Booking\Steps;

use App\Services\Booking\Handlers\AbstractBookingStep;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProcessPayment 
{
    public function process(Request $request): ?string
    {
        error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
        date_default_timezone_set('Asia/Ho_Chi_Minh');

        // URL trang thanh toán VNPAY
        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = "http://localhost:8000/api/vnpay-return"; // URL trả về sau thanh toán
        Log::info('VNPAY Return URL: ' . $vnp_Returnurl);

        // Mã và chuỗi bí mật của VNPAY
        $vnp_TmnCode = "AB5KXHTL"; // Mã website tại VNPAY
        $vnp_HashSecret = "UPJTP6WYL5P1DRCDK7M003GD8MNNP0SI"; // Chuỗi bí mật

        // Lấy dữ liệu từ request
        $bookingId = $request->input('boking_id'); // Booking ID từ bước trước
        Log::info('Booking ID: ' . $bookingId);
        if (!$bookingId) {
            return null; // Trả về null nếu không có Booking ID
        }

        // Tạo các thông tin cần thiết cho giao dịch
        $vnp_TxnRef = $bookingId; // Mã tham chiếu giao dịch
        $vnp_OrderInfo = "Thanh toán VNPAY cho booking ID " . $bookingId;
        $vnp_OrderType = 'Moveek';
        $vnp_Amount = $request->input('amount') * 100; // Số tiền thanh toán (đơn vị VND)
        $vnp_Locale = "VN"; // Ngôn ngữ hiển thị
        $vnp_IpAddr = $_SERVER['REMOTE_ADDR']; // Địa chỉ IP của người dùng

        // Cập nhật thời gian hết hạn giao dịch
        $vnp_ExpireDate = date('YmdHis', strtotime('+15 minutes')); // Định dạng yyyyMMddHHmmss

        // Dữ liệu gửi lên VNPAY
        $inputData = array(
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef,
        );

        // Thêm mã ngân hàng và mã hóa đơn nếu có
        if (isset($vnp_BankCode) && $vnp_BankCode != "") {
            $inputData['vnp_BankCode'] = $vnp_BankCode;
        }
        if (isset($vnp_Bill_State) && $vnp_Bill_State != "") {
            $inputData['vnp_Bill_State'] = $vnp_Bill_State;
        }

        // Sắp xếp dữ liệu theo thứ tự chữ cái
        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        // Tạo chuỗi mã bảo mật
        $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
        $vnp_Url = $vnp_Url . "?" . $query . 'vnp_SecureHash=' . $vnpSecureHash;

        // Trả về URL thanh toán
        return $vnp_Url;
    }
}
