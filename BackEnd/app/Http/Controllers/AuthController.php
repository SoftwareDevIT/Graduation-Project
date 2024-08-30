<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->all();
        $data['role_id'] = $data['role_id'] ?? 1;
        $user = User::create($data);

        return $this->success($user, 'User created successfully', 201);
    }

    public function getUser()
    {
        $getUsers = User::all();
        return $this->success(UserResource::collection($getUsers), 'User get successfully', 200);
    }
}
