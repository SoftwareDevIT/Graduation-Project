<?php

use App\Http\Controllers\Api\Booking\BookingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\News\NewController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Filter\FilterByDateController;
use App\Http\Controllers\Api\Cinema\RoomController;
use App\Http\Controllers\Api\Combo\ComboController;
use App\Http\Controllers\Api\Movie\ActorController;
use App\Http\Controllers\Api\Movie\MovieController;
use App\Http\Controllers\Api\Cinema\CinemaController;
use App\Http\Controllers\Api\Movie\DirectorController;
use App\Http\Controllers\Api\Movie\FavoriteController;
use App\Http\Controllers\Api\Cinema\LocationController;
use App\Http\Controllers\Api\Cinema\ShowtimeController;
use App\Http\Controllers\Api\News\NewCategoryController;
use App\Http\Controllers\Api\Auth\ForgotPasswordController;
use App\Http\Controllers\Api\Movie\MovieCategoryController;
use App\Http\Controllers\Api\PayMethod\PayMethodController;
use App\Http\Controllers\Api\Auth\AccountVerificationController;
use App\Http\Controllers\Api\Auth\ResetPasswordController;
use App\Http\Controllers\Api\Movie\RatingController;

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

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
// Authenticated routes
// Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        $user = $request->user()->load('favoriteMovies');
        return response()->json($user);
    });

    Route::post('favorites', [FavoriteController::class, 'store']); // Add favorite movie
    Route::delete('favorites/{movie_id}', [FavoriteController::class, 'destroy']); // Remove favorite movie
    Route::post('ratings', [RatingController::class, 'store']); // Rate movie

    Route::post('/vnpay-return', [BookingController::class, 'vnPayReturn']);
    Route::post('/book-ticket', [BookingController::class, 'bookTicket']); // Book ticket
// });

// Public authentication routes
Route::post('login', [AuthController::class, 'login']);

Route::post('logout', [AuthController::class, 'logout']);
// Route::get('/user', [AuthController::class, 'list']);

Route::post('register', [AuthController::class, 'register']); // chức năng post của đăng ký
Route::get('/lists', [AuthController::class, 'list']); // danh sách tài khoản user
Route::get('/verify-account/{userId}', [AccountVerificationController::class, 'verify'])->name('verify'); // route để người dùng xác thực từ gmail
Route::post('password/send-otp', [ForgotPasswordController::class, 'sendOtp']); // nhập email để gửi email mã otp
Route::post('password/verify-otp', [ForgotPasswordController::class, 'verifyOtp']); // nhập mã otp để xác thực
Route::post('password/reset', [ForgotPasswordController::class, 'forgotPassword']); // thay đổi mật khẩu



Route::apiResource('location', LocationController::class);

Route::apiResource('cinema', CinemaController::class);



Route::apiResource('news_category', NewCategoryController::class); // crud của danh mục tin tức
Route::apiResource('news', NewController::class); // crud của tin tức


Route::apiResource('actor', ActorController::class);                        // crud của tác giả
Route::apiResource('director', DirectorController::class);                  // crud của diễn viên
Route::apiResource('movie-category', MovieCategoryController::class);       // crud của danh mục phim
Route::apiResource('movies', MovieController::class);                       // crud của phim
Route::apiResource('method', PayMethodController::class);
Route::get('/movie/search/{movie_name}', [MovieController::class, 'search']);    // Chức năng tìm kiếm theo tên phim

Route::apiResource('combo', ComboController::class);
Route::apiResource('showtimes', ShowtimeController::class);
Route::get('showtimes/movie/{movie_name}', [ShowtimeController::class, 'showtimeByMovieName']);
Route::apiResource('room', RoomController::class);

Route::post('register', [AuthController::class, 'register']); // Register user
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
   
});
Route::get('/lists', [AuthController::class, 'list']); // List user accounts

// Account verification routes
Route::get('/verify-account/{userId}', [AccountVerificationController::class, 'verify'])->name('verify'); // Verify account from email

// Password reset routes
Route::post('password/send-otp', [ForgotPasswordController::class, 'sendOtp']); // Send OTP to email
Route::post('password/verify-otp', [ForgotPasswordController::class, 'verifyOtp']); // Verify OTP
Route::post('password/reset', [ForgotPasswordController::class, 'forgotPassword']); // Reset password

// CRUD API resources
// Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('location', LocationController::class);
    Route::apiResource('cinema', CinemaController::class);
    Route::apiResource('room', RoomController::class);
    Route::apiResource('showtimes', ShowtimeController::class);
    Route::apiResource('news_category', NewCategoryController::class);
    Route::apiResource('news', NewController::class);
    Route::apiResource('actor', ActorController::class);
    Route::apiResource('director', DirectorController::class);
    Route::apiResource('movie-category', MovieCategoryController::class);
    Route::apiResource('movies', MovieController::class);
    Route::apiResource('method', PayMethodController::class);
    Route::apiResource('combo', ComboController::class);

// });
=======
    Route::get('showtimes/movie/{movie_name}', [ShowtimeController::class, 'showtimeByMovieName']);
    Route::post('/resetPassword', [ResetPasswordController::class, 'resetPassword']);
});


// Movie-specific routes
Route::get('/movie/search/{movie_name}', [MovieController::class, 'search']); // Search for movies by name
Route::get('showtimes/movie/{movie_name}', [ShowtimeController::class, 'showtimeByMovieName']); // Showtimes by movie name

// Additional cinema routes
Route::get('cenima/{id}', [CinemaController::class, 'filterMovie']); // Filter movies by cinema
Route::get('/filterByDate', [FilterByDateController::class, 'filterByDate']); // Filter movies by date