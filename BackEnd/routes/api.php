<?php

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Traits;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Auth\AccountVerificationController;
use App\Http\Controllers\Api\Auth\ForgotPasswordController;
use App\Http\Controllers\Api\Cinema\LocationController;
use App\Http\Controllers\Api\Cinema\CinemaController;
use App\Http\Controllers\Api\Cinema\RoomController;
use App\Http\Controllers\Api\Cinema\ShowtimeController;
use App\Http\Controllers\Api\Movie\ActorController;
use App\Http\Controllers\Api\Movie\DirectorController;
use App\Http\Controllers\Api\Movie\MovieCategoryController;
use App\Http\Controllers\Api\News\NewCategoryController;
use App\Http\Controllers\Api\News\NewController;
use App\Http\Controllers\Api\Combo\ComboController;
use App\Http\Controllers\Api\Movie\MovieController;
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


// Route::middleware('auth:sanctum')->get('user', function (Request $request) {
//     return $request->user();
// });

Route::middleware('auth:sanctum')->get('user', function (Request $request) {
    return $request->user();
});

// Auth routes
Route::post('login', [AuthController::class, 'login'])->name('login');
Route::post('register', [AuthController::class, 'register']);// chức năng post của đăng ký
Route::get('/verify-account/{userId}', [AccountVerificationController::class, 'verify'])->name('verify');// route để người dùng xác thực từ gmail
Route::post('password/send-otp', [ForgotPasswordController::class, 'sendOtp']);// nhập email để gửi email mã otp
Route::post('password/verify-otp', [ForgotPasswordController::class, 'verifyOtp']);// nhập mã otp để xác thực
Route::post('password/reset', [ForgotPasswordController::class, 'resetPassword']);// thay đổi mật khẩu


Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('list', [AuthController::class, 'list']);// danh sách tài khoản user
    Route::apiResource('location', LocationController::class);
    Route::apiResource('user', AuthController::class);
    Route::apiResource('cinema', CinemaController::class);
    Route::apiResource('room', RoomController::class);
    Route::apiResource('showtimes', ShowtimeController::class);
    Route::get('showtimes/movie/{movie_name}', [ShowtimeController::class, 'showtimeByMovieName']);

    Route::resource('news_category', NewCategoryController::class);
    Route::resource('news', NewController::class);

    Route::apiResource('actor', ActorController::class);
    Route::apiResource('director', DirectorController::class);
    Route::apiResource('movie-category', MovieCategoryController::class);
    Route::apiResource('movies', MovieController::class);
    Route::apiResource('method', PayMethodController::class);
    Route::apiResource('combo', ComboController::class);
});

