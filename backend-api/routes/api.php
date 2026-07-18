<?php

use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BidController;
use App\Http\Controllers\Api\DriverController;
use App\Http\Controllers\Api\MissionController;
use Illuminate\Support\Facades\Route;

// --- Authentification ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/otp/send', [AuthController::class, 'sendOtp']);
Route::post('/otp/verify', [AuthController::class, 'verifyOtp']);

// --- Missions publiques (calcul de prix simulé) ---
Route::post('/missions/calculate-price', [MissionController::class, 'calculatePrice']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // --- Missions ---
    Route::get('/missions', [MissionController::class, 'index']);
    Route::post('/missions', [MissionController::class, 'store']);
    Route::get('/missions/mine', [MissionController::class, 'myMissions']);
    Route::get('/missions/applications', [MissionController::class, 'myApplications']);
    Route::get('/missions/{mission}', [MissionController::class, 'show']);
    Route::patch('/missions/{mission}', [MissionController::class, 'update']);
    Route::delete('/missions/{mission}', [MissionController::class, 'destroy']);

    // --- Offres (bids) ---
    Route::middleware('driver.profile')->post('/missions/{mission}/bids', [BidController::class, 'store']);
    Route::post('/bids/{bid}/accept', [BidController::class, 'accept']);
    Route::post('/bids/{bid}/reject', [BidController::class, 'reject']);

    // --- Notifications ---
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);

    // --- Admin ---
    Route::prefix('admin')->group(function () {
        Route::get('/drivers/pending', [AdminController::class, 'pendingDrivers']);
        Route::get('/drivers', [AdminController::class, 'allDrivers']);
        Route::post('/drivers/{driver}/verify', [AdminController::class, 'verifyDriver']);
        Route::post('/drivers/{driver}/reject', [AdminController::class, 'rejectDriver']);
        Route::post('/users/{user}/suspend', [AdminController::class, 'suspendUser']);
        Route::get('/stats', [AdminController::class, 'stats']);
    });
});
