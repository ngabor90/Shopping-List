<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ItemController;

Route::apiResource('items', ItemController::class);

Route::get('test', function () {
    return ['message' => 'API működik!'];
});
