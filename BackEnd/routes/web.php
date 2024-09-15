<?php

use App\Http\Controllers\AuthController;
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
})->name('register.form');

Route::post('register', [RegisterController::class, 'register'])->name('register.submit');