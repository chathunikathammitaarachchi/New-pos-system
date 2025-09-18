<?php
namespace App\Http\Controllers;

use App\Models\UnitCnv;
use Illuminate\Http\Request;

class UnitCnvController extends Controller
{
    /**
     * Display all UnitCnv records.
     * Returns JSON for API calls, View for browser visits
     */
    public function index(Request $request)
    {
        $units = UnitCnv::all();
        
        // Check if request expects JSON (from React/API calls)
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json($units);
        }
        
        // For browser visits, return the React app view
    }

    /**
     * API-only endpoint for React app
     */
    public function apiIndex()
    {
        $units = UnitCnv::all();
        return response()->json($units);
    }

    /**
     * Store a newly created UnitCnv record.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'Unit' => 'required|string|max:5',
            'ConvRate' => 'required|numeric',
            'finAct' => 'boolean',
            'Status' => 'nullable|string|max:2',
            'fBase' => 'boolean',
            'Des' => 'nullable|string|max:60'
        ]);

        $unit = UnitCnv::create($validated);
        return response()->json($unit, 201);
    }

    /**
     * Show a specific UnitCnv record.
     */
    public function show(UnitCnv $unitCnv)
    {
        return response()->json($unitCnv);
    }

    /**
     * Update a specific UnitCnv record.
     */
    public function update(Request $request, UnitCnv $unitCnv)
    {
        $validated = $request->validate([
            'Unit' => 'sometimes|required|string|max:5',
            'ConvRate' => 'sometimes|required|numeric',
            'finAct' => 'sometimes|boolean',
            'Status' => 'nullable|string|max:2',
            'fBase' => 'sometimes|boolean',
            'Des' => 'nullable|string|max:60'
        ]);

        $unitCnv->update($validated);
        return response()->json($unitCnv);
    }

    /**
     * Delete a specific UnitCnv record.
     */
    public function destroy(UnitCnv $unitCnv)
    {
        $unitCnv->delete();
        return response()->json(null, 204);
    }


     public function getUnitsForDropdown()
{
    try {
        $units = UnitCnv::select('UnitKy as id', 'Unit as name', 'Des as description')
            ->where('finAct', 1) // Only active units
            ->get();
        
        return response()->json($units);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to fetch units'], 500);
    }
}

    /**
     * API-only endpoint for React app
     */
    // public function apiIndex()
    // {
    //     try {
    //         $units = UnitCnv::all();
    //         return response()->json($units);
    //     } catch (\Exception $e) {
    //         return response()->json(['error' => 'Failed to fetch units'], 500);
    //     }
    // }

}