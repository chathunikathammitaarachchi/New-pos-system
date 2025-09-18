<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\ItemmasterController;
use App\Http\Controllers\CodeMasterController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\UnitCnvController ;

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

    // Itemmaster API routes - Fixed and organized
    Route::get('/items', [ItemmasterController::class, 'getItemNames']);
    Route::get('/item-codes-with-category', [ItemmasterController::class, 'getItemCodesWithCategory']);
    Route::get('/item-details/{itemCode}', [ItemmasterController::class, 'getItemDetails']);
    
    // Categories and other dropdowns
    Route::get('/cd-codes', [CodeMasterController::class, 'getCdCodes']);
    Route::get('/categories', [ItemmasterController::class, 'getCategories']);
    Route::get('/suppliers', [ItemmasterController::class, 'getSuppliers']);
    
    // Units API endpoint
    Route::get('/units', [UnitCnvController::class, 'getUnitsForDropdown']);
    
    // Unit conversion API routes
    Route::get('/unit-cnv', [UnitCnvController::class, 'apiIndex']);
    Route::post('/unit-cnv', [UnitCnvController::class, 'store']);
    Route::get('/unit-cnv/{unitCnv}', [UnitCnvController::class, 'show']);
    Route::put('/unit-cnv/{unitCnv}', [UnitCnvController::class, 'update']);
    Route::delete('/unit-cnv/{unitCnv}', [UnitCnvController::class, 'destroy']);
});

// Additional routes for compatibility
Route::get('/units-dropdown', [UnitCnvController::class, 'getUnitsForDropdown']);
Route::get('/categories', [ItemmasterController::class, 'getCategories']);
Route::get('/units', [UnitCnvController::class, 'apiIndex']);

// Customer and Supplier form routes
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

Route::get('/unit-cnv', [UnitCnvController::class, 'index'])->name('unit-cnv.index');

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';