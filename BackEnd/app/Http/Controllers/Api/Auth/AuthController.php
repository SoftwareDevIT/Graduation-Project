<?php

namespace App\Http\Controllers\Api\Auth;

use App\Mail\VerifyAccount;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use App\Services\Auth\LoginService;
use App\Services\UserRegistrationService;

class AuthController extends Controller
{
    protected $userRegistrationService;
    protected $loginService;

    public function __construct(UserRegistrationService $userRegistrationService, LoginService $loginService, )
    {
        $this->userRegistrationService = $userRegistrationService;
        $this->loginService = $loginService;
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


    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        try {
            $token = $this->loginService->login($request->only('email', 'password'));

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
