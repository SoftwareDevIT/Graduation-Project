<?php

namespace App\Services\Booking\Steps;

use App\Services\Booking\Handlers\AbstractBookingStep;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProcessPayment extends AbstractBookingStep
{
    public function process(Request $request): ?array
    {
        error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
        date_default_timezone_set('Asia/Ho_Chi_Minh');

        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = "http://localhost:8000/api/vnpay-return";
        Log::info('VNPAY Return URL: ' . $vnp_Returnurl);
        $vnp_TmnCode = "AB5KXHTL"; // Mã website tại VNPAY
        $vnp_HashSecret = "UPJTP6WYL5P1DRCDK7M003GD8MNNP0SI"; // Chuỗi bí mật

        $bookingId = $request->input('boking_id'); // Booking ID từ bước trước
        Log::info('Booking ID: ' . $bookingId);
        if (!$bookingId) {
            return ['errors' => 'Booking ID not found.'];
        }

        $vnp_TxnRef = $bookingId;
        $vnp_OrderInfo = "Thanh toán VNPAY cho booking ID " . $bookingId;
        $vnp_OrderType = 'Moveek';
        $vnp_Amount = $request->input('amount'); // Đơn vị VND
        $vnp_Locale = "VN";
        // $vnp_BankCode = "NCB";
        $vnp_IpAddr = $_SERVER['REMOTE_ADDR'];

        // Cập nhật định dạng expire date
        $vnp_ExpireDate = date('YmdHis', strtotime('+15 minutes')); // Định dạng yyyyMMddHHmmss



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

        if (isset($vnp_BankCode) && $vnp_BankCode != "") {
            $inputData['vnp_BankCode'] = $vnp_BankCode;
        }
        if (isset($vnp_Bill_State) && $vnp_Bill_State != "") {
            $inputData['vnp_Bill_State'] = $vnp_Bill_State;
        }

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

        $vnp_Url = $vnp_Url . "?" . $query;
        if (isset($vnp_HashSecret)) {
            $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }

        
        $returnData = array(
            'code' => '00',
            'message' => 'success',
            'data' => $vnp_Url
        );

        return response()->json($returnData);
    }
}

