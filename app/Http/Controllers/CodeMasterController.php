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
                        'catkey' => $item->catkey,
                        'cname' => $item->cname,
                        'created_at' => $item->created_at,
                        'updated_at' => $item->updated_at,
                        'controller' => $item->conname ? [
                            'id' => null,
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

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'concode' => 'required|exists:controller_master,concode',
                'cname' => 'required|string|max:255|unique:code_master,cname'
            ]);

            $controller = ControllerMaster::where('concode', $validated['concode'])->first();

            if (!$controller) {
                return response()->json([
                    'success' => false,
                    'error' => 'Invalid controller code selected'
                ], 422);
            }

            // Generate a unique catkey
            $catkey = $this->generateUniqueCode($validated['concode'], $validated['cname']);

            $code = CodeMaster::create([
                'conkey' => $controller->conkey,
                'concode' => $controller->concode,
                'catkey' => $catkey,
                'cname' => $validated['cname']
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

    public function getCatKeys()
    {
        try {
            $catkeys = CodeMaster::select('catkey', 'cname')
                ->orderBy('cname')
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $catkeys
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch catkeys',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getCategories()
    {
        try {
            $categories = CodeMaster::where('concode', 'ITM_CAT')
                ->select('id', 'cname as name')
                ->orderBy('cname')
                ->get();
            
            return response()->json($categories);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch categories',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getUnits()
    {
        try {
            $units = CodeMaster::where('concode', 'UNIT')
                ->select('id', 'cname as name')
                ->orderBy('cname')
                ->get();
            
            return response()->json($units);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch units',
                'message' => $e->getMessage()
            ], 500);
        }
    }



    public function getCdCodes()
{
    // Example: Return codes where concode = 'SOME_VALUE'
    $codes = DB::table('code_master')
        ->select('catkey as id', 'cname as name', 'concode')
        ->orderBy('cname')
        ->get();

    return response()->json($codes);
}


    private function generateUniqueCode($concode, $cname)
    {
        $prefix = strtoupper(substr($concode, 0, 3));
        $namePrefix = strtoupper(substr(str_replace([' ', '-', '_'], '', $cname), 0, 3));
        
        do {
            $randomSuffix = str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);
            $catkey = $prefix . '_' . $namePrefix . '_' . $randomSuffix;
        } while (CodeMaster::where('catkey', $catkey)->exists());

        return $catkey;
    }

   

  
}