<?php

use App\Http\Controllers\Api\FoodLogController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Models\Product;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    Route::put('/products/{id}', [ProductController::class, 'update']);

    Route::get('/food-logs/totals', [FoodLogController::class, 'getTotals']);
    Route::get('/food-logs/history', [FoodLogController::class, 'history']);
    Route::get('/food-logs', [FoodLogController::class, 'index']);
    Route::post('/food-logs', [FoodLogController::class, 'store']);
    Route::delete('/food-logs/{id}', [FoodLogController::class, 'destroy']);
    Route::get('/food-logs/history-with-meals', [FoodLogController::class, 'historyWithMeals']);

    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar']);

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'changePassword']);

    Route::post('/logout', [AuthController::class, 'logout']);
});
