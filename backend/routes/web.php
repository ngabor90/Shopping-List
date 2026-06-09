<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/reset-password/{token}', function () {
    return redirect(config('app.frontend_url') . request()->getRequestUri());
})->name('password.reset');
