<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Mail\VerifyAccount;
use App\Models\User;
use App\Services\UserService;
use App\Services\UserRegistrationService;
use App\Traits\ResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    use ResponseTrait;

    protected $userService;
    protected $userRegistrationService;

    public function __construct(UserService $userService, UserRegistrationService $userRegistrationService)
    {
        $this->userService = $userService;
        $this->userRegistrationService = $userRegistrationService;
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

    public function register(RegisterRequest $request)
    {
        try {
            $user = $this->userRegistrationService->register($request->validated());
            Mail::to($user->email)->queue(new VerifyAccount($user));
            return $this->success($user, 'success');
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    public function list()
    {
        $data = User::all();
        return $this->success($data);
    }
}
