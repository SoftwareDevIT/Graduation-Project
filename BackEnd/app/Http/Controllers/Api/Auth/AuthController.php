<?php

namespace App\Http\Controllers\Api\Auth;

use App\Mail\VerifyAccount;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use App\Services\UserRegistrationService;

class AuthController extends Controller
{
    protected $userRegistrationService;

    public function __construct(UserRegistrationService $userRegistrationService)
    {
        $this->userRegistrationService = $userRegistrationService;
    }

    public function register(RegisterRequest $request)
    {
        try {
            $user =  $this->userRegistrationService->register($request->validated());
            Mail::to($user->email)->queue(new VerifyAccount($user));
            return $this->success( $user,'success');
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
