<?php

use App\Http\Controllers\Api\Booking\BookingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\News\NewController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Filter\FilterByDate;
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

// Authenticated routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        $user = $request->user()->load('favoriteMovies');
        return response()->json($user);
    });

    Route::post('favorites', [FavoriteController::class, 'store']); // Add favorite movie
    Route::delete('favorites/{movie_id}', [FavoriteController::class, 'destroy']); // Remove favorite movie
    Route::post('ratings', [RatingController::class, 'store']); // Rate movie

    Route::post('/vnpay-return', [BookingController::class, 'vnPayReturn']);
    Route::post('/book-ticket', [BookingController::class, 'bookTicket']); // Book ticket
});

// Public authentication routes
Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']); // Register user
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('/lists', [AuthController::class, 'list']); // List user accounts
});


// Account verification routes
Route::get('/verify-account/{userId}', [AccountVerificationController::class, 'verify'])->name('verify'); // Verify account from email

// Password reset routes
Route::post('password/send-otp', [ForgotPasswordController::class, 'sendOtp']); // Send OTP to email
Route::post('password/verify-otp', [ForgotPasswordController::class, 'verifyOtp']); // Verify OTP
Route::post('password/reset', [ForgotPasswordController::class, 'resetPassword']); // Reset password

// CRUD API resources
Route::middleware(['auth:sanctum'])->group(function () {
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
});


// Movie-specific routes
Route::get('/movie/search/{movie_name}', [MovieController::class, 'search']); // Search for movies by name
Route::get('showtimes/movie/{movie_name}', [ShowtimeController::class, 'showtimeByMovieName']); // Showtimes by movie name

// Additional cinema routes
Route::get('cenima/{id}', [CinemaController::class, 'filterMovie']); // Filter movies by cinema
Route::get('/filterByDate', [FilterByDate::class, 'filterByDate']); // Filter movies by date
