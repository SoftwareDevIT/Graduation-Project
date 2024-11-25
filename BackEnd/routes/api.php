<?php

use App\Http\Controllers\Api\Booking\BookingController;
use App\Http\Controllers\Api\Google\GoongMapController;
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
use App\Http\Controllers\Api\Filter\FilterMovieByNewController;
use App\Http\Controllers\Api\Google\GoogleController;
use App\Http\Controllers\Api\Movie\RatingController;
use App\Http\Controllers\Api\Order\OrderController;
use App\Http\Controllers\Api\Revenue\RevenueController;
use App\Http\Controllers\Api\Role\RoleController;
use App\Http\Controllers\Api\Seat\SeatController;

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
// Google Sign In
Route::post('/get-google-sign-in-url', [GoogleController::class, 'getGoogleSignInUrl']); // lấy url login google
Route::get('/callback', [GoogleController::class, 'loginCallback']);  // login google
Route::get('/autocomplete', [GoongMapController::class, 'autocomplete']);
Route::post('logout', [AuthController::class, 'logout']);
Route::post('register', [AuthController::class, 'register']); // Đăng ký người dùng
Route::middleware(['api', 'session'])->group(function () {
    Route::post('password/send-otp', [ForgotPasswordController::class, 'sendOtp']); // Gửi OTP đến email
    Route::post('password/verify-otp', [ForgotPasswordController::class, 'verifyOtp']); // Xác minh OTP
    Route::post('password/reset', [ForgotPasswordController::class, 'forgotPassword']); // Đặt lại mật khẩu
});


Route::post('password/send-otp', [ForgotPasswordController::class, 'sendOtp']);                     // Gửi OTP đến email
Route::post('password/verify-otp', [ForgotPasswordController::class, 'verifyOtp']);                 // Xác minh OTP
Route::post('password/reset', [ForgotPasswordController::class, 'forgotPassword']);                 // Đặt lại mật khẩu
Route::get('/verify-account/{userId}', [AccountVerificationController::class, 'verify'])->name('verify');

// Các tuyến công khai để xem tài nguyên
Route::apiResource('location', LocationController::class)->only(['index', 'show']);
Route::apiResource('cinema', CinemaController::class)->only(['index', 'show']);
Route::apiResource('news', NewController::class)->only(['index', 'show']); // List news
Route::apiResource('actor', ActorController::class)->only(['index', 'show']); // Liệt kê các diễn viên
Route::apiResource('director', DirectorController::class)->only(['index', 'show']); // Danh sách giám đốc
Route::apiResource('movie-category', MovieCategoryController::class)->only(['index', 'show']); // Liệt kê các thể loại phim
Route::apiResource('movies', MovieController::class)->only(['index', 'show']); // Liệt kê phim
Route::apiResource('combo', ComboController::class)->only(['index', 'show']);;
Route::apiResource('seat', SeatController::class)->only(['index', 'show']);;
Route::apiResource('method', PayMethodController::class)->only(['index', 'show']);                        // List news
Route::apiResource('room', RoomController::class)->only(['index', 'show']);
Route::apiResource('showtimes', ShowtimeController::class)->only(['index', 'show']);
Route::apiResource('news_category', NewCategoryController::class)->only(['index', 'show']);
Route::get('/cinema/{id}/room', [RoomController::class, 'getRoomByCinema']);  // get room by cinema


// Các tuyến có thể truy cập được cho người dùng được xác thực
Route::middleware(['auth:sanctum', 'web'])->group(function () {
    Route::post('favorites/{movie_id}', [FavoriteController::class, 'store']);                 // Thêm phim yêu thích
    Route::delete('favorites/{movie_id}', [FavoriteController::class, 'destroy']);             // Xóa phim yêu thích
    Route::post('ratings', [RatingController::class, 'store']);                                // Phim đánh giá
    Route::post('selectSeats', [BookingController::class, 'selectSeats']);
    Route::post('/book-ticket', [BookingController::class, 'bookTicket']);
    // Route::get('/vnpay-return', [BookingController::class, 'vnPayReturn']);
    Route::middleware(['auth:sanctum', 'web'])->group(function () {
        Route::post('favorites/{movie}', [FavoriteController::class, 'store']);            // Thêm phim yêu thích
        Route::delete('favorites/{movie}', [FavoriteController::class, 'destroy']);             // Xóa phim yêu thích
        Route::apiResource('user', AuthController::class);
        Route::get('/user', function (Request $request) {
            $user = $request->user()->load('favoriteMovies');
            return response()->json($user);
        });
    });
});
Route::get('/vnpay-return', [BookingController::class, 'vnPayReturn']);


// Các route quản trị và quản lý
Route::middleware(['auth:sanctum', 'role:admin|manager'])->group(function () {
    Route::apiResource('location', LocationController::class)->except(['index', 'show']);
    Route::apiResource('cinema', CinemaController::class)->except(['index', 'show']);
    Route::apiResource('room', RoomController::class)->except(['index', 'show']);
    Route::apiResource('showtimes', ShowtimeController::class)->except(['index', 'show']);
    Route::apiResource('actor', ActorController::class)->except(['index', 'show']);
    Route::apiResource('director', DirectorController::class)->except(['index', 'show']);
    Route::apiResource('movie-category', MovieCategoryController::class)->except(['index', 'show']);
    Route::apiResource('movies', MovieController::class)->except(['index', 'show']);
    Route::apiResource('method', PayMethodController::class)->except(['index', 'show']);
    Route::apiResource('combo', ComboController::class)->except(['index', 'show']);
    Route::apiResource('seat', SeatController::class)->except(['index', 'show']);
    Route::post('add-movie-in-cinema/{cinema_id}', [CinemaController::class, 'synCinemaHasMovie']);
    Route::get('show-movie-in-cinema/{cinema_id}', [CinemaController::class, 'showCinemaHasMovie']);
    Route::delete('cinema/{cinema_id}/movie/{movie_id}', [CinemaController::class, 'destroyCinemaHasMovie']);
    Route::apiResource('news_category', NewCategoryController::class)->except(['index', 'show']);
    Route::apiResource('news', NewController::class)->except(['index', 'show']);
    Route::get('/all-user', [AuthController::class, 'allUser']);


    // phan quyen
    Route::resource('roles', RoleController::class); // add roles and show
    Route::post('/roles/{role}/permissions', [RoleController::class, 'syncPermissions'])->name('roles.permissions.sync'); // chia chuc nang cho quyen
    Route::post('/roles/{user}/users', [RoleController::class, 'syncRoles'])->name('users.roles.sync'); // cap quyen cho user
    Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy'); // delete role
    Route::delete('/delete-user/{id}', [RoleController::class, 'destroy'])->name('roles.destroyUser'); // delete role

    // Thống kê doanh thu theo rạp vào ngày
    Route::get('total-revenue-by-date/{start_date}/{end_date}', [RevenueController::class, 'totalRevenueBetweenDates']);
    Route::get('total-revenue/{status}', [RevenueController::class, 'totalRevenue']);
    Route::get('total-revenue-cinema/{cinema_id}', [RevenueController::class, 'totalRevenueByCinema']);
    Route::get('total-revenue-cinema-by-date/{cinema_id}/{start_date}/{end_date}', [RevenueController::class, 'totalRevenueByCinemaBetweenDates']);
});


// });

Route::post('/resetPassword', [ResetPasswordController::class, 'resetPassword'])->middleware('auth:sanctum');

// });



// Các tuyến đường dành riêng cho phim
Route::get('/movie/search/{movie_name}', [MovieController::class, 'search']);                       // Tìm kiếm phim theo tên

Route::get('showtimes/movie/{movie_name}', [ShowtimeController::class, 'showtimeByMovieName']);     // Showtimes by movie name
Route::get('/filterByDate', [FilterByDateController::class, 'filterByDate']);                       // Phim lọc theo ngày
Route::get('filterMovie/{id}', [CinemaController::class, 'filterMovie']);                            // Phim lọc của điện ảnh
Route::get('/movie/{category}', [MovieController::class, 'movieByCategory']);                       // Lọc Phim theo thể loại
Route::get('/new/{category}', [NewController::class, 'newByCategory']);                             // Lọc chuyên đề theo thể loại

Route::get('/fillMovies/upcoming', [MovieController::class, 'getUpcomingMovies']);                       // Lọc Phim sắp chiếu
Route::get('/filterByDateByMovie', [FilterByDateController::class, 'filterByDateByMovie']);         // lọc rạp theo phim và ngày và khu vực
Route::get('cinema-by-location/{id}', [CinemaController::class, 'showCinemaByLocation']);
Route::get('filterMovieByNew', [FilterMovieByNewController::class, 'filterMovieByNew']);



// Route::group(['middleware' => ['auth:sanctum']], function () {
//     // Route::post('/slectMovieAndSeats', [BookingController::class, 'slectMovieAndSeats']);
//     // Route::post('/selectCombo', [BookingController::class, 'selectCombos']);
//     Route::post('selectSeats', [BookingController::class, 'selectSeats']);
//     Route::post('/book-ticket', [BookingController::class, 'bookTicket']);
// });
Route::get('filterNewByActor/{actor}', [ActorController::class, 'filterNewByActor']);                // Lọc bài viết liên quan tới diễn viễn
Route::get('filterNewByDictor/{director}', [DirectorController::class, 'filterNewByDictor']);        // Lọc bài viết liên quan tới đạo diễn
Route::get('filterNewByMovie/{movie}', [MovieController::class, 'filterNewByMovie']);                // Lọc bài viết liên quan tới phim
Route::get('ratings/{movie}', [RatingController::class, 'show']);                                   // Xem dánh giá phim
Route::get('rating', [RatingController::class, 'index']);                                           // Xem all dánh giá
Route::get('filterMoviePopular', [MovieController::class, 'moviePopular']);                // Lọc bài viết liên quan tới phim

Route::apiResource('order', OrderController::class);
// Route::group(['middleware' => ['auth:sanctum']], function () {
//     Route::post('/slectMovieAndSeats', [BookingController::class, 'slectMovieAndSeats']);
//     Route::post('/selectCombo', [BookingController::class, 'selectCombos']);
//     Route::post('selectSeats', [BookingController::class, 'selectSeats']);
//     // Route::post('/book-ticket', [BookingController::class, 'bookTicket']);
// });
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/slectMovieAndSeats', [BookingController::class, 'slectMovieAndSeats']);
    Route::post('/selectCombo', [BookingController::class, 'selectCombos']);
    Route::post('selectSeats', [BookingController::class, 'selectSeats']);
    Route::post('/book-ticket', [BookingController::class, 'bookTicket']);
    Route::post('/historyOrder', [OrderController::class, 'order']);
    Route::post('/historyOrder/{id}', [OrderController::class, 'orderDetail']);
    Route::get('session', [BookingController::class, 'getSession']);
});
