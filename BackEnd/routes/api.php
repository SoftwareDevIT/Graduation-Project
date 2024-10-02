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
// Các tuyến xác thực công khai
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout']);
Route::post('register', [AuthController::class, 'register']);                                       // Đăng ký người dùng
Route::post('password/send-otp', [ForgotPasswordController::class, 'sendOtp']);                     // Gửi OTP đến email
Route::post('password/verify-otp', [ForgotPasswordController::class, 'verifyOtp']);                 // Xác minh OTP
Route::post('password/reset', [ForgotPasswordController::class, 'forgotPassword']);                 // Đặt lại mật khẩu
Route::get('/verify-account/{userId}', [AccountVerificationController::class, 'verify'])->name('verify');

// Các tuyến công khai để xem tài nguyên
Route::apiResource('location', LocationController::class)->only(['index', 'show']);
Route::apiResource('cinema', CinemaController::class)->only(['index', 'show']);
Route::apiResource('news_category', NewCategoryController::class)->only(['index', 'show']);         // Liệt kê các danh mục tin tức
Route::apiResource('news', NewController::class)->only(['index', 'show']);                          // List news
Route::apiResource('actor', ActorController::class)->only(['index', 'show']);                       // Liệt kê các diễn viên
Route::apiResource('director', DirectorController::class)->only(['index', 'show']);                 // Danh sách giám đốc
Route::apiResource('movie-category', MovieCategoryController::class)->only(['index', 'show']);      // Liệt kê các thể loại phim
Route::apiResource('movies', MovieController::class)->only(['index', 'show']);                      // Liệt kê phim

// Các tuyến có thể truy cập được cho người dùng được xác thực
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        // $user = $request->user()->load('favoriteMovies');
        $user = $request->user()->load('favoriteMovies');
        return response()->json($user);
    });
    Route::post('favorites/{movie_id}', [FavoriteController::class, 'store']);                 // Thêm phim yêu thích
    Route::delete('favorites/{movie_id}', [FavoriteController::class, 'destroy']);             // Xóa phim yêu thích
    Route::post('ratings', [RatingController::class, 'store']);                                // Phim đánh giá
    Route::post('/book-ticket', [BookingController::class, 'bookTicket']);                      // vé vé
});
Route::get('/vnpay-return', [BookingController::class, 'vnPayReturn']);

// Các route quản trị và quản lý
// Route::middleware(['auth:sanctum', 'role:admin|manager'])->group(function () {
    Route::apiResource('location', LocationController::class)->except(['index', 'show']);
    Route::apiResource('cinema', CinemaController::class)->except(['index', 'show']);
    Route::apiResource('room', RoomController::class);
    Route::apiResource('showtimes', ShowtimeController::class);
    Route::apiResource('news_category', NewCategoryController::class)->except(['index', 'show']);
    Route::apiResource('news', NewController::class)->except(['index', 'show']);
    Route::apiResource('actor', ActorController::class)->except(['index', 'show']);
    Route::apiResource('director', DirectorController::class)->except(['index', 'show']);
    Route::apiResource('movie-category', MovieCategoryController::class)->except(['index', 'show']);
    Route::apiResource('movies', MovieController::class)->except(['index', 'show']);
    Route::apiResource('method', PayMethodController::class);
    Route::apiResource('combo', ComboController::class);
// });


// });
    Route::get('showtimes/movie/{movie_name}', [ShowtimeController::class, 'showtimeByMovieName']);
    Route::post('/resetPassword', [ResetPasswordController::class, 'resetPassword']);

// });

// Movie-specific routes
Route::get('/movie/search/{movie_name}', [MovieController::class, 'search']);                       // Search for movies by name

// Các tuyến đường dành riêng cho phim
Route::get('/movie/search/{movie_name}', [MovieController::class, 'search']);                       // Tìm kiếm phim theo tên

Route::get('showtimes/movie/{movie_name}', [ShowtimeController::class, 'showtimeByMovieName']);     // Showtimes by movie name
Route::get('/filterByDate', [FilterByDateController::class, 'filterByDate']);                       // Phim lọc theo ngày
Route::get('filterMovie/{id}', [CinemaController::class, 'filterMovie']);                                // Phim lọc của điện ảnh
Route::get('/movie/{category}', [MovieController::class, 'movieByCategory']);                       // Lọc Phim theo thể loại
Route::get('/new/{category}', [NewController::class, 'newByCategory']);                             // Lọc chuyên đề theo thể loại