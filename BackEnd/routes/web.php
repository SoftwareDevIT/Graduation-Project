<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Cinema\ShowtimeController;
use App\Http\Controllers\Client\LoginController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Client\RoleController;
use App\Http\Controllers\Client\UserController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

 Route::get('/', function () {
     return view('welcome');
 });

Route::get('/test', function () {
    return view('test');
});
use App\Http\Controllers\RegisterController;

Route::get('register', function () {
    return view('test');

})->name('register.form');

Route::post('register', [RegisterController::class, 'register'])->name('register.submit');



// Check if user is logged in?
//Route::get('/', function () {
//    // return view('');
//    // If the user is successfully logged in, return here ...
//})->middleware('checkLogin');
//

Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
Route::get('/home', function () {
    return view('home');
})->middleware('auth');
// Route::middleware(['auth', 'role:admin|manager'])->group(function () {
    // Resource route for roles, except for 'show'
    Route::resource('roles', RoleController::class)->except(['show']);

    // Specific route for syncing permissions
    Route::post('/roles/{role}/permissions', [RoleController::class, 'syncPermissions'])->name('roles.permissions.sync');

    // Specific route for deleting roles
    Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');

    // User management routes
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users/{user}/roles', [UserController::class, 'syncRoles'])->name('users.roles.sync');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
// });
Route::get('/showtimes/create', [ShowtimeController::class, 'create'])->name('showtimes.create');
Route::post('/showtimes', [ShowtimeController::class, 'store'])->name('showtimes.store');






