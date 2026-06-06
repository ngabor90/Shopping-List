<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/reset-password/{token}', function () {
    return redirect(env('FRONTEND_URL') . request()->getRequestUri());
})->name('password.reset');