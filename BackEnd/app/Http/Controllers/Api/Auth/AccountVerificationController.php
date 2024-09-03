<?php

namespace App\Http\Controllers\Api\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\AccountVerificationService;
use Illuminate\Http\JsonResponse;

class AccountVerificationController extends Controller
{
    protected $verificationService;

    /**
     * Create a new controller instance.
     *
     * @param AccountVerificationService $verificationService
     */
    public function __construct(AccountVerificationService $verificationService)
    {
        $this->verificationService = $verificationService;
    }

    /**
     * Xác thực tài khoản người dùng.
     *
     * @param Request $request
     * @param int $userId
     * @return JsonResponse
     */
    public function verify($userId)
    {
        $isVerified = $this->verificationService->verifyAccount($userId);

        if ($isVerified) {
            return $this->success($isVerified, 'Account verified successfully.');
        }
        return $this->error('Invalid verification link.');

    }
}
