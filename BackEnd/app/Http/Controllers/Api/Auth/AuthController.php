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
        $data = User::all();
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
    // Validate the request input
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    try {
        // Retrieve the user by email
        $user = User::where('email', $request->email)->first();

        // Check if the user exists
        if (!$user) {
            return response()->json(['message' => 'Tài khoản không tồn tại.'], 404);
        }

        // Check if the email is verified
        if ($user->email_verified_at === null) {
            return response()->json(['message' => 'Tài khoản chưa được kích hoạt, vui lòng kiểm tra email để kích hoạt.'], 403);
        }

        // Attempt to log in the user
        if (!password_verify($request->password, $user->password)) {
            return response()->json(['message' => 'Mật khẩu không chính xác.'], 401);
        }

        // Generate the token if login is successful
        $token = $this->loginService->login($request->only('email', 'password'));
        return response()->json(['token' => $token], 200);

    } catch (Exception $e) {
        return response()->json(['message' => 'Đã xảy ra lỗi: ' . $e->getMessage()], 500);
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
