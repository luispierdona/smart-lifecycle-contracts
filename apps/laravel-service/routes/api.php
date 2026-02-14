<?php

use Illuminate\Support\Facades\Route;
use App\Models\Material;
use App\Http\Controllers\WasteRegistrationController;
use App\Http\Controllers\ContractController;

// Check if the API is working
Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});

// Get all materials
Route::get('/materials', function() {
    return response()->json(Material::all());
});

Route::get('/registrations', [WasteRegistrationController::class, 'index']);
Route::post('/registrations', [WasteRegistrationController::class, 'store']);
