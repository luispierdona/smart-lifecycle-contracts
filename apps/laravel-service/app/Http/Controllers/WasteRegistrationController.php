<?php

namespace App\Http\Controllers;

use App\Models\Material;
use App\Models\WasteRegistration;
use App\Models\Contract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class WasteRegistrationController extends Controller
{
    public function index() {
        return response()->json(WasteRegistration::with(['material', 'contract'])->get());
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'material_id' => 'required|exists:materials,id',
            'weight' => 'required|numeric|min:0.1',
        ]);

        return DB::transaction(function () use ($validated) {
            $material = Material::findOrFail($validated['material_id']);

            // Business logic
            $co2 = $validated['weight'] * $material->co2_factor;
            $tax = $validated['weight'] * $material->tax_rate;
            $status = ($validated['weight'] > 100) ? 'CONTRACTED' : 'PROCESSED';

            $registration = WasteRegistration::create([
                'material_id' => $material->id,
                'weight' => $validated['weight'],
                'calculated_co2' => $co2,
                'calculated_tax' => $tax,
                'status' => $status
            ]);

            if ($status === 'CONTRACTED') {
                Contract::create([
                    'registration_id' => $registration->id,
                    'contract_number' => 'CNT-' . strtoupper(Str::random(10)),
                    'terms' => "Standard recycling agreement for " . $material->name,
                    'expiry_date' => now()->addDays(30),
                ]);
            }

            return response()->json($registration->load(['material', 'contract']), 201);
        });
    }
}