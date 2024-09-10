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
            return $this->success($token);
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }
    public function logout(Request $request)
    {
        try {
            $user = $request->user();
            if ($user) {
                $user->tokens()->delete(); 
                return $this->success([], 'Logged out successfully.');
            } else {
                return $this->error('User is not authenticated or token is missing.');
            }
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
    }



}
