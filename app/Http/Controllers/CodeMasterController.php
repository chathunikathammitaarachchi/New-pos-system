<?php

namespace App\Http\Controllers;

use App\Models\CodeMaster;
use App\Models\ControllerMaster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CodeMasterController extends Controller
{
   
   public function index()
    {
        try {
            $controllerMaster = ControllerMaster::select('id', 'concode', 'conkey', 'conname')
                ->orderBy('conname')
                ->get();
            
            // Use join instead of relationship
            $codeMaster = CodeMaster::select('code_master.*', 'controller_master.conname as conname')
                ->leftJoin('controller_master', 'code_master.concode', '=', 'controller_master.concode')
                ->orderBy('code_master.created_at', 'desc')
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'conkey' => $item->conkey,
                        'concode' => $item->concode,
                        'cdcode' => $item->cdcode,
                        'cdname' => $item->cdname,
                        'created_at' => $item->created_at,
                        'updated_at' => $item->updated_at,
                        'controller' => $item->conname ? [
                            'id' => null, // You might need to adjust this
                            'concode' => $item->concode,
                            'conname' => $item->conname
                        ] : null
                    ];
                });

            return response()->json([
                'success' => true,
                'controller_master' => $controllerMaster,
                'code_master' => $codeMaster
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch data',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    /**
     * Store a new code master entry
     */
   public function store(Request $request)
{
    try {
        $validated = $request->validate([
            'concode' => 'required|exists:controller_master,concode',
            'cdname' => 'required|string|max:255|unique:code_master,cdname'
        ]);

        $controller = ControllerMaster::where('concode', $validated['concode'])->first();

        if (!$controller) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid controller code selected'
            ], 422);
        }

        // Generate a unique cdcode
        $cdcode = $this->generateUniqueCode($validated['concode'], $validated['cdname']);

        $code = CodeMaster::create([
            'conkey' => $controller->conkey,
            'concode' => $controller->concode,
            'cdcode' => $cdcode,
            'cdname' => $validated['cdname']
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Code master entry created successfully',
            'data' => $code
        ], 201);

    } catch (ValidationException $e) {
        return response()->json([
            'success' => false,
            'error' => 'Validation failed',
            'errors' => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => 'Failed to create code master entry',
            'message' => $e->getMessage()
        ], 500);
    }
}
    /**
     * Get all CD codes
     */
    public function getCdCodes()
    {
        try {
            $cdCodes = CodeMaster::select('cdcode', 'cdname')
                ->orderBy('cdname')
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $cdCodes
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch CD codes',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get categories (where concode is 'ITM_CAT')
     */
   public function getCategories()
    {
        try {
            $categories = CodeMaster::where('concode', 'ITM_CAT')
                ->select('id', 'cdname as name')
                ->orderBy('cdname')
                ->get();
            
            return response()->json($categories);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch categories',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get units (where concode is 'UNIT' or whatever your unit code is)
     */
    public function getUnits()
    {
        try {
            $units = CodeMaster::where('concode', 'UNIT') // Change 'UNIT' to your actual unit code
                ->select('id', 'cdname as name')
                ->orderBy('cdname')
                ->get();
            
            return response()->json($units);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch units',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    /**
     * Generate unique code
     */
    private function generateUniqueCode($concode, $cdname)
    {
        $prefix = strtoupper(substr($concode, 0, 3));
        $namePrefix = strtoupper(substr(str_replace([' ', '-', '_'], '', $cdname), 0, 3));
        
        do {
            $randomSuffix = str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);
            $cdcode = $prefix . '_' . $namePrefix . '_' . $randomSuffix;
        } while (CodeMaster::where('cdcode', $cdcode)->exists());

        return $cdcode;
    }


    /**
 * Get item codes (where concode is for items)
 */
/**
 * Get item codes for dropdown
 */
public function getItemCodes()
{
    try {
        $itemCodes = CodeMaster::where('concode', 'ITM_CD') // Adjust this to your actual concode for items
            ->select('id', 'cdcode as code', 'cdname as name')
            ->orderBy('cdname')
            ->get();
        
        return response()->json($itemCodes);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Failed to fetch item codes',
            'message' => $e->getMessage()
        ], 500);
    }
}

public function getItemCodesWithCategory()
{
    $itemCodes = DB::table('itemmaster as im')
        ->leftJoin('code_master as cm', 'im.CKey', '=', 'cm.conkey')
        ->select(
            'im.ItmKy',
            'im.ItemCode',
            'im.ItmNm',
            'cm.cdname as CategoryName'
        )
        ->orderBy('im.ItmNm')
        ->get();

    return response()->json($itemCodes);
}

}