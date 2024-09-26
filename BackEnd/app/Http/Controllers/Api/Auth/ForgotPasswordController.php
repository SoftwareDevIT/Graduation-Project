<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Services\Auth\ForgotPasswordService;
use App\Services\Auth\OtpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class ForgotPasswordController extends Controller
{
    protected $otpService;
    protected $forgotpasswordService;

    public function __construct(OtpService $otpService, ForgotPasswordService $forgotpasswordService)
    {
        $this->otpService = $otpService;
        $this->forgotpasswordService = $forgotpasswordService;
    }

    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        try {
            $email = $request->input('email');
            Session::put('reset_password_email', $email); // Lưu email vào session
            $message = $this->otpService->sendOtp($email);
            return $this->success($message, 'success', 200);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage(), 'error', 400);
        }
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'otp' => 'required|size:6',
        ]);

        try {
            $otp = $request->input('otp');
            $message = $this->otpService->verifyOtp($otp);
            return $this->success($message, 'success', 200);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage(), 'error', 400);
        }
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'password' => 'required|min:8|confirmed',
        ]);

        try {
            // Kiểm tra xem OTP đã được xác thực chưa
            if (!$this->otpService->canResetPassword()) {
                return $this->error('OTP chưa được xác thực.', 'error', 400);
            }

            // Lấy email từ session
            $email = Session::get('reset_password_email');
            $password = $request->input('password');

            // Gọi service để đặt lại mật khẩu
            $this->forgotpasswordService->ForgotPassword($email, $password);

            // Xóa trạng thái xác thực OTP và email
            $this->otpService->clearOtpVerification();

            return $this->success('Mật khẩu đã được đặt lại thành công!', 'success', 200);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage(), 'error', 400);
        }
    }
}
