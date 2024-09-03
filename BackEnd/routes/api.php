<?php

use App\Http\Controllers\AccountVerificationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LocationApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', [UserController::class, 'index']);
    Route::get('location', [LocationApiController::class, 'index']);
    Route::post('location', [LocationApiController::class, 'store']);
    Route::put('location/{id}', [LocationApiController::class, 'update']);
    Route::delete('location/{id}', [LocationApiController::class, 'destroy']);
});

Route::post('register',[AuthController::class,'register']);
Route::get('/list', [AuthController::class, 'list']);
Route::get('/verify-account/{userId}', [AccountVerificationController::class, 'verify'])->name('verify');

