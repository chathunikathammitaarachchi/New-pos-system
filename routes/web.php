<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\ItemmasterController;
use App\Http\Controllers\CodeMasterController;
use App\Http\Controllers\AccountController;
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
Route::get('/api/suppliers/{type?}', [ItemmasterController::class, 'getSuppliers']);
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


// Your existing page routes
Route::get('/customer-form', function () {
    return Inertia::render('CustomerForm');
});

Route::get('/supplier-form', function () {
    return Inertia::render('SupplierForm');
});

// Add form submission routes
Route::post('/customers', [AccountController::class, 'storeCustomer']);
Route::post('/suppliers', [AccountController::class, 'storeSupplier']);




// API routes for supplier management
Route::get('/api/suppliers', [AccountController::class, 'getSuppliers']);
Route::get('/api/supplier-details/{id}', [AccountController::class, 'getSupplierDetails']);
Route::get('/api/supplier-search', [AccountController::class, 'searchSupplier']);

// Web routes for supplier management
Route::get('/supplier', [AccountController::class, 'showSupplierForm']);
Route::post('/supplier', [AccountController::class, 'storeSupplier']);
Route::put('/supplier/{id}', [AccountController::class, 'updateSupplier']);
require __DIR__.'/auth.php';
require __DIR__.'/settings.php';