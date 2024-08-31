<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterRequest;
use App\Mail\VerifyAccount;
use App\Models\User;
use App\Services\UserRegistrationService;
use App\Traits\ResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

// use Illuminate\Support\Facades\Request;

class AuthController extends Controller
{
    use ResponseTrait;

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


        // try {
        //     // $request->validate([
        //     //     'user_name' => 'required|string|max:255',  
        //     //     'email' => 'required|string|email|max:255|unique:users',  
        //     //     'password' => 'required|string|min:8|confirmed',  
        //     // ]);
        //     // $data = $request->validated();
        //     // $data = $request->all();
        //     var_dump(123);
        //     // $user = $this->userRegistrationService->register($request->validated());
        //     // Mail::to($user->email)->queue(new VerifyAccount($user));
        //     return $this->success();
        // } catch (\Throwable $th) {
        //     Log::error($th->getMessage());
        //     return $this->error($th->getMessage());
        // }
    }

    public function list()
    {
        $data = User::all();
        return $this->success($data);
    }
}
