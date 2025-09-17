<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\AccMas;
use App\Models\Address;
use Inertia\Inertia;

class AccountController extends Controller
{
    /**
     * Show customer form
     */
    public function showCustomerForm()
    {
        return Inertia::render('CustomerForm');
    }

    /**
     * Show supplier form
     */
    public function showSupplierForm()
    {
        return Inertia::render('SupplierForm');
    }

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
        'address' => 'required|regex:/^[a-zA-Z\s\.,\-]+$/|max:255', // Only letters, spaces, commas etc
        'tp1' => 'nullable|digits:10', // Only 10 digit numbers
        'fax' => 'nullable|numeric|digits_between:6,14',
        'email' => 'nullable|email|max:60',
        'idNo' => 'nullable|numeric|digits_between:6,20',
        'crLmt' => 'nullable|numeric|min:0',
        'vatNo' => 'nullable|numeric|digits_between:6,50',
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

        // Create address record
        Address::create([
            'accKy' => $acc->accKy,
            'address' => $validated['address'],
            'tp1' => $validated['tp1'] ?? null,
            'fax' => $validated['fax'] ?? null,
            'email' => $validated['email'] ?? null,
            'idNo' => $validated['idNo'] ?? null,
            'flnAct' => true,
            'status' => 'Active',
        ]);

        return redirect()->back()->with('success', "$type registered successfully!");

    } catch (\Exception $e) {
        Log::error('Account registration failed: ' . $e->getMessage());
        return redirect()->back()->with('error', 'Server error occurred while saving account. Please try again.');
    }
}

}