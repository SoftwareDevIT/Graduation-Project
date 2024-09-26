<?php
namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class PasswordResetService
{
    /**
     * Đặt lại mật khẩu cho người dùng
     *
     * @param string $email
     * @param string $password
     * @return void
     * @throws \Exception
     */
    public function resetPassword($data)
    {
        $user = User::where('password', Hash::make($data['password']));
    }
}
