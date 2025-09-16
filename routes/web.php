<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ItemmasterController;
use App\Http\Controllers\CodeMasterController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('itemmaster', ItemmasterController::class)->except(['show']);
    
    // Code Master web routes
    Route::get('/code-master', function () {
        return Inertia::render('CodeMaster/Index');
    })->name('code-master.index');
});

// Itemmaster search route (outside auth for now - adjust as needed)
Route::get('/itemmaster/search', [ItemmasterController::class, 'search']);

// API Routes - Consolidated and properly structured
Route::prefix('api')->middleware('api')->group(function () {
    // Code Master API routes
    Route::prefix('code-master')->group(function () {
        Route::get('/', [CodeMasterController::class, 'index']);
        Route::post('/', [CodeMasterController::class, 'store']);
        Route::get('/cd-codes', [CodeMasterController::class, 'getCdCodes']);
        Route::get('/categories', [CodeMasterController::class, 'getCategories']);
    });
    
    // Itemmaster API routes
    Route::get('/items', [ItemmasterController::class, 'getItemNames']);
    Route::get('/item-codes', [ItemmasterController::class, 'getItemCodes']);
    Route::get('/item-details/{itemCode}', [ItemmasterController::class, 'getItemDetails']);
    Route::get('/categories', [ItemmasterController::class, 'getCategories']);
    Route::get('/suppliers', [ItemmasterController::class, 'getSuppliers']);
    Route::get('/units', [ItemmasterController::class, 'getUnits']);
});

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';