<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\UserService;
use Illuminate\Http\Request;
use App\Http\Requests\RegisterRequest;
use App\Mail\VerifyAccount;
use App\Models\User;
use App\Services\UserRegistrationService;
use App\Traits\ResponseTrait;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        try {
            $token = $this->userService->login($request->only('email', 'password'));

            return response()->json([
                'status_code' => 200,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status_code' => 401,
                'message' => $e->getMessage(),
            ], 401);
        }
    }
}

