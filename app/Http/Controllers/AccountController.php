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



/**
 * Get all suppliers for dropdown
 */
public function getSuppliers()
{
    try {
        $suppliers = AccMas::where('accTyp', 'Supplier')
            ->where('flnAct', true)
            ->select('accKy as id', 'accNm as name')
            ->orderBy('accNm')
            ->get();
        
        return response()->json($suppliers);
    } catch (\Exception $e) {
        Log::error('Error fetching suppliers: ' . $e->getMessage());
        return response()->json(['error' => 'Unable to fetch suppliers'], 500);
    }
}

/**
 * Get supplier details by ID
 */
public function getSupplierDetails($id)
{
    try {
        $supplier = AccMas::with('address')
            ->where('accKy', $id)
            ->where('accTyp', 'Supplier')
            ->first();

        if (!$supplier) {
            return response()->json(['error' => 'Supplier not found'], 404);
        }

        // Merge supplier and address data
        $supplierData = $supplier->toArray();
        if ($supplier->address) {
            $supplierData = array_merge($supplierData, $supplier->address->toArray());
        }

        return response()->json($supplierData);
    } catch (\Exception $e) {
        Log::error('Error fetching supplier details: ' . $e->getMessage());
        return response()->json(['error' => 'Unable to fetch supplier details'], 500);
    }
}

/**
 * Search suppliers
 */
public function searchSupplier(Request $request)
{
    $request->validate([
        'search_term' => 'required|string'
    ]);

    try {
        $supplier = AccMas::with('address')
            ->where('accTyp', 'Supplier')
            ->where(function($query) use ($request) {
                $query->where('accCd', $request->search_term)
                      ->orWhere('accNm', 'like', '%' . $request->search_term . '%');
            })
            ->first();

        if (!$supplier) {
            return response()->json([
                'success' => false,
                'message' => 'සැපයුම්කරු හමු නොවීය'
            ], 404);
        }

        // Merge supplier and address data
        $supplierData = $supplier->toArray();
        if ($supplier->address) {
            $supplierData = array_merge($supplierData, $supplier->address->toArray());
        }

        return response()->json([
            'success' => true,
            'supplier' => $supplierData
        ]);
    } catch (\Exception $e) {
        Log::error('Error searching supplier: ' . $e->getMessage());
        return response()->json(['error' => 'Search failed'], 500);
    }
}

/**
 * Update supplier
 */
public function updateSupplier(Request $request, $id)
{
    $validated = $request->validate([
        'accCd' => 'required|string|max:20|unique:acc_mas,accCd,' . $id . ',accKy',
        'accNm' => 'required|string|max:60',
        'address' => 'required|string|max:255',
        'tp1' => 'nullable|digits:10',
        'fax' => 'nullable|numeric|digits_between:6,14',
        'email' => 'nullable|email|max:60',
        'idNo' => 'nullable|numeric|digits_between:6,20',
        'crLmt' => 'nullable|numeric|min:0',
        'vatNo' => 'nullable|numeric|digits_between:6,50',
        'fVATRegistered' => 'nullable|boolean',
    ]);

    try {
        $supplier = AccMas::findOrFail($id);
        
        // Update supplier record
        $supplier->update([
            'accCd' => $validated['accCd'],
            'accNm' => $validated['accNm'],
            'crLmt' => $validated['crLmt'] ?? 0.00,
            'fVATRegistered' => $validated['fVATRegistered'] ?? false,
            'vatNo' => $validated['vatNo'] ?? null,
        ]);

        // Update or create address record
        Address::updateOrCreate(
            ['accKy' => $supplier->accKy],
            [
                'address' => $validated['address'],
                'tp1' => $validated['tp1'] ?? null,
                'fax' => $validated['fax'] ?? null,
                'email' => $validated['email'] ?? null,
                'idNo' => $validated['idNo'] ?? null,
                'flnAct' => true,
                'status' => 'Active',
            ]
        );

        return redirect()->back()->with('success', 'සැපයුම්කරු සාර්ථකව යාවත්කාලීන කරන ලදී!');

    } catch (\Exception $e) {
        Log::error('Supplier update failed: ' . $e->getMessage());
        return redirect()->back()->with('error', 'සැපයුම්කරු යාවත්කාලීන කිරීමේදී දෝෂයක් සිදුවිය.');
    }
}
}