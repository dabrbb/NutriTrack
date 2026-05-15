<?php

use App\Http\Controllers\Api\FoodLogController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Models\Product;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);

    Route::get('/food-logs/totals', [FoodLogController::class, 'getTotals']);
    Route::apiResource('/food-logs', FoodLogController::class);

    Route::post('/logout', [AuthController::class, 'logout']);
});