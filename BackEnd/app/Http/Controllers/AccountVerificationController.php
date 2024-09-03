<?php

namespace App\Http\Controllers;

use App\Services\AccountVerificationService;
use App\Traits\ResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AccountVerificationController extends Controller
{
    use ResponseTrait;

    protected $verificationService;

    public function __construct(AccountVerificationService $verificationService)
    {
        $this->verificationService = $verificationService;
    }

    public function verify($userId)
    {
        $isVerified = $this->verificationService->verifyAccount($userId);

        if ($isVerified) {
            return $this->success($isVerified, 'Account verified successfully.');
        }
        return $this->error('Invalid verification link.');
    }
}
