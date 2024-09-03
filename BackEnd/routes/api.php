<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Auth\AccountVerificationController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('login', [AuthController::class, 'login']);
Route::get('/user', [AuthController::class, 'list']);

Route::post('register', [AuthController::class, 'register']);
Route::post('register', [AuthController::class, 'register']);
Route::get('/list', [AuthController::class, 'list']);
Route::get('/verify-account/{userId}', [AccountVerificationController::class, 'verify'])->name('verify');
