<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Auth\AccountVerificationController;
use App\Http\Controllers\Api\Cinema\LocationController;
use App\Http\Controllers\Api\Cinema\CinemaController;

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


Route::get('location', [LocationController::class, 'index']);
Route::post('location', [LocationController::class, 'store']);
Route::put('location/{id}', [LocationController::class, 'update']);
Route::delete('location/{id}', [LocationController::class, 'destroy']);

Route::get('cinema', [CinemaController::class, 'index']);
Route::get('cinema/{id}', [CinemaController::class, 'show']);
Route::post('cinema', [CinemaController::class, 'store']);
Route::put('cinema/{id}', [CinemaController::class, 'update']);
Route::delete('cinema/{id}', [CinemaController::class, 'destroy']);