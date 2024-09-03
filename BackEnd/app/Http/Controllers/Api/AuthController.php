<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            if (auth()->user() === null || !auth()->user()->id) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy người dùng.'
                ], 404);
            }
            $token = $request->user()->createToken('auth')->plainTextToken;
            return response()->json([
                'status' => true,
                'token' => $token,
                'message' => 'Đăng nhập thành công',
            ]);
        }
    }

    public function register(RegisterRequest $request)
    {

        $request['role_id'] = $request['role_id'] ?? 1;
        $user = User::create($request->all());
        return response()->json([
            'status' => true,
            'token' => $user,
            'message' => 'Đăng ký thành công',
        ]);
    }
}
