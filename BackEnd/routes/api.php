<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Auth\AccountVerificationController;
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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', [AuthController::class, 'list']);
});

Route::post('login', [AuthController::class, 'login']);

Route::post('logout', [AuthController::class, 'logout']);
Route::get('/user', [AuthController::class, 'list']);

Route::post('register', [AuthController::class, 'register']);// chức năng post của đăng ký
Route::get('/list', [AuthController::class, 'list']);// danh sách tài khoản user
Route::get('/verify-account/{userId}', [AccountVerificationController::class, 'verify'])->name('verify');// route để người dùng xác thực từ gmail


Route::apiResource('location', LocationController::class);

Route::apiResource('cinema', CinemaController::class);



Route::resource('news_category', NewCategoryController::class);// crud của danh mục tin tức
Route::resource('news', NewController::class);// crud của tin tức


Route::apiResource('actor', ActorController::class);// crud của tác giả
Route::apiResource('director', DirectorController::class);// crud của diễn viên
Route::apiResource('movie-category', MovieCategoryController::class);// crud của danh mục phim
Route::apiResource('movies', MovieController::class);
Route::apiResource('method', PayMethodController::class);

Route::apiResource('combo', ComboController::class);
Route::apiResource('showtimes', ShowtimeController::class);
Route::get('showtimes/movie/{movie_name}', [ShowtimeController::class, 'showtimeByMovieName']);
Route::apiResource('room', RoomController::class);


