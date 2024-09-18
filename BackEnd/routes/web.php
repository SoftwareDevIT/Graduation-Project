<?php

use App\Http\Controllers\Api\Auth\AuthController;
use Illuminate\Support\Facades\Route;

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

// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/test', function () {
    return view('test');
});
use App\Http\Controllers\RegisterController;

Route::get('register', function () {
    return view('test');
})->name('register.form'); anhdung

Route::post('register', [RegisterController::class, 'register'])->name('register.submit');



// Check if user is logged in?
Route::get('/', function () {
    // return view('');
 // If the user is successfully logged in, return here ...
})->middleware('checkLogin');

