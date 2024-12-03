<?php

namespace App\Services\BookingStaff\Steps;

use App\Models\Combo;
use App\Models\User;
use App\Services\Booking\Handlers\AbstractBookingStep;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class SelectUser extends AbstractBookingStep
{

    protected function process(Request $request): ?JsonResponse
    {

        $email = $request->input('email');
        if ($email) {
            $user = User::where('email', $email)->first();

            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'User not found.'
                ]);
            }
        }else{
            $user = User::where('id', Auth::user()->id)->first();
        }
        
        Session::put('userbooking', $user);
        Log::info('User: ' . json_encode(session('userbooking')));
        return null;
    }
}
