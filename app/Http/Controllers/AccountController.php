<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\AccMas;
use App\Models\Address;

class AccountController extends Controller
{
    /**
     * Store a new customer
     */
    public function storeCustomer(Request $request)
    {
        return $this->storeAccount($request, 'Customer');
    }

    /**
     * Store a new supplier
     */
    public function storeSupplier(Request $request)
    {
        return $this->storeAccount($request, 'Supplier');
    }

    /**
     * Private method to handle both customer and supplier registration
     */
      private function storeAccount(Request $request, $type)
    {
        // Validate incoming request data
        $validated = $request->validate([
            'accCd' => 'required|string|max:20|unique:acc_mas,accCd',
            'accNm' => 'required|string|max:60',
            'adrNm' => 'required|string|max:255',
            'tp1' => 'nullable|string|max:30',
            'fax' => 'nullable|string|max:14',
            'email' => 'nullable|email|max:60',
            'idNo' => 'nullable|string|max:20',
            'crLmt' => 'nullable|numeric|min:0',
            'vatNo' => 'nullable|string|max:50',
            'fVATRegistered' => 'nullable|boolean',
        ]);

        try {
            // Create account master record
            $acc = AccMas::create([
                'accCd' => $validated['accCd'],
                'accNm' => $validated['accNm'],
                'accTyp' => $type,
                'curBal' => 0.00,
                'crLmt' => $validated['crLmt'] ?? 0.00,
                'fVATRegistered' => $validated['fVATRegistered'] ?? false,
                'vatNo' => $validated['vatNo'] ?? null,
                'entDtm' => now(),
                'flnAct' => true,
                'status' => 'Active',
            ]);

            // Create corresponding address record
            Address::create([
                'accKy' => $acc->accKy,
                'adrNm' => $validated['adrNm'],
                'tp1' => $validated['tp1'] ?? null,
                'fax' => $validated['fax'] ?? null,
                'email' => $validated['email'] ?? null,
                'idNo' => $validated['idNo'] ?? null,
                'flnAct' => true,
                'status' => 'Active',
            ]);

            return response()->json([
                'success' => true,
                'message' => "$type registered successfully!",
                'data' => [
                    'accKy' => $acc->accKy,
                    'accCd' => $acc->accCd,
                    'accNm' => $acc->accNm
                ]
            ], 201);

        } catch (\Exception $e) {
            // Log the actual error for debugging
            Log::error('Account registration failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Server error occurred while saving account. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}