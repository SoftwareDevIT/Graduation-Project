<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class UserService
{
    public function login(array $credentials)
    {
        if (!Auth::attempt($credentials)) {
            throw new \Exception('Unauthorized', 401);
        }

        $user = Auth::user();

        if (!$user) {
            throw new \Exception('User not authenticated', 401);
        }

        if (!($user instanceof \App\Models\User)) {
            throw new \Exception('Authenticated user is not an instance of User', 500);
        }

        return $user->createToken('authToken')->plainTextToken;
    }
}
