<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Auth\AccountVerificationController;
use App\Http\Controllers\Api\Cinema\LocationController;
use App\Http\Controllers\Api\Cinema\CinemaController;
use App\Http\Controllers\Api\Movie\ActorController;
use App\Http\Controllers\Api\Movie\DirectorController;
use App\Http\Controllers\Api\Movie\MovieCategoryController;
use App\Http\Controllers\Api\Combo\ComboController;
use App\Http\Controllers\Api\PayMethod\PayMethodController;
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
Route::post('logout', [AuthController::class, 'logout']);
Route::get('/user', [AuthController::class, 'list']);

Route::post('register', [AuthController::class, 'register']);
Route::post('register', [AuthController::class, 'register']);
Route::get('/list', [AuthController::class, 'list']);
Route::get('/verify-account/{userId}', [AccountVerificationController::class, 'verify'])->name('verify');


Route::apiResource('location', LocationController::class);

Route::apiResource('cinema', CinemaController::class);

Route::apiResource('actor', ActorController::class);
Route::apiResource('director', DirectorController::class);
Route::apiResource('movie-category', MovieCategoryController::class);

Route::apiResource('method', PayMethodController::class);

Route::apiResource('combo', ComboController::class);