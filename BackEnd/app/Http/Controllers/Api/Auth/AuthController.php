<?php

namespace App\Http\Controllers\Api\Auth;

use App\Mail\VerifyAccount;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\Store\StoreUserRequest;
use App\Http\Requests\Update\UpdateUserRequest;
use App\Models\User;
use App\Services\Auth\LoginService;
use App\Services\UserRegistrationService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    protected $userRegistrationService;
    protected $loginService;

    public function __construct(UserRegistrationService $userRegistrationService, LoginService $loginService, )
    {
        $this->userRegistrationService = $userRegistrationService;
        $this->loginService = $loginService;
    }

    public function index()
    {
        $user = $this->loginService->index();
        return response()->json($user);
    }
    public function show($id)
    {
        try {
            $user = $this->userRegistrationService->register($request->validated());
            Mail::to($user->email)->queue(new VerifyAccount($user));
            return $this->success($user, 'success');
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
            $user = $this->loginService->get($id);

            if (!$user) {
                return response()->json(['error' => 'user not found'], 404);
            }

            return $this->success($user);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function list()
    {
        $data = User::with('favoriteMovies')->get();
        return $this->success($data);
    }

    public function update(UpdateUserRequest $request, $id)
    {
        try {
            $filesToUpload = ['avatar', 'cover'];
            $userData = $request->validated();

            foreach ($filesToUpload as $fileKey) {
                if ($request->hasFile($fileKey)) {
                    $userData[$fileKey] = $this->uploadImage($request->file($fileKey));
                }
            }

            // Update the user using the login service
            $user = $this->loginService->update($id, $userData);

            // Success response
            return $this->success($user);
        } catch (ModelNotFoundException $e) {
            return $this->error($e->getMessage());
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function register(RegisterRequest $request)
    {
        try {
            $user = $this->userRegistrationService->register($request->validated());
            Mail::to($user->email)->queue(new VerifyAccount($user));
            return $this->success('Tạo tài khoảng thành công!', 'success', 200);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
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
        } catch (Exception $e) {
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
                return $this->error('Người dùng không được xác thực hoặc thiếu mã thông báo.');
            }
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }







}
