<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/reset-password/{token}', function () {
    return redirect('http://localhost:5173' . request()->getRequestUri());
})->name('password.reset');