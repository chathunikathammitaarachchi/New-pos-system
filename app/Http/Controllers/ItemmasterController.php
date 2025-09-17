<?php

namespace App\Http\Controllers;

use App\Models\Itemmaster;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Tighten\Ziggy\Ziggy;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ItemmasterController extends Controller
{
    public function index()
{
    $items = Itemmaster::paginate(10);
    
    return Inertia::render('Itemmaster/Index', [
        'items' => $items,
        'ziggy' => array_merge((new Ziggy)->toArray(), ['location' => url()->current()]),
    ]);
}

    

    // Show the create form
    public function create()
    {
        return Inertia::render('Itemmaster/Create');
    }

    // Store new item
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fInAct' => 'nullable|boolean',
            'Status' => 'nullable|string|max:50',
            'CKey' => 'nullable|integer',
            'ItmKy' => 'nullable|integer',
            'ItemCode' => 'required|string|max:50|unique:itemmaster,ItemCode',
            'BarCode' => 'nullable|string|max:100|unique:itemmaster,BarCode',
            'ItmNm' => 'required|string|max:100',
            'EnglishName' => 'nullable|string|max:100',
            'cdname' => 'nullable|string',
            'ItmRefKy' => 'nullable|integer',
            'UnitKy' => 'nullable|integer',
            'CosPri' => 'nullable|numeric',
            'NCostPrice' => 'nullable|numeric',
            'ExtraPrice' => 'nullable|numeric',
            'WholePrice' => 'nullable|numeric',
            'ReOrdlLvl' => 'nullable|integer',
            'ScallItem' => 'nullable|boolean',
            'SupKey' => 'nullable|integer',
            'RtQty1' => 'nullable|integer',
            'RtDis1' => 'nullable|numeric',
            'RtQty2' => 'nullable|integer',
            'RtDis2' => 'nullable|numeric',
            'RtQty3' => 'nullable|integer',
            'RtDis3' => 'nullable|numeric',
            'RtQty4' => 'nullable|integer',
            'RtDis4' => 'nullable|numeric',
            'WSQty1' => 'nullable|integer',
            'WSDis1' => 'nullable|numeric',
            'WSQty2' => 'nullable|integer',
            'WSDis2' => 'nullable|numeric',
            'WSQty3' => 'nullable|integer',
            'WSDis3' => 'nullable|numeric',
            'WSQty4' => 'nullable|integer',
            'WSDis4' => 'nullable|numeric',
            'DiscountQty' => 'nullable|integer',
            'QuntityDiscount' => 'nullable|numeric',
            'CCPrice' => 'nullable|numeric',
            'SlsPri' => 'nullable|numeric',
            'MaxOrdQty' => 'nullable|integer',
            'ExpiryDate' => 'nullable|date',
            'ItmCd' => 'nullable|string|max:50',
            'Qty2' => 'nullable|integer',
            'WithDates' => 'nullable|boolean',
            'ProductionDate' => 'nullable|date',
            'BatchNo' => 'nullable|string|max:50',
            'VATItem' => 'nullable|boolean',
            'DoProcess' => 'nullable|boolean',
            'DoRound' => 'nullable|boolean',
            'ProcessRatio' => 'nullable|numeric',
            'OrderNo' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        try {
            // Get the next available ItmKy
            $maxItmKy = Itemmaster::max('ItmKy');
            $data = $validator->validated();
            $data['ItmKy'] = $maxItmKy ? $maxItmKy + 1 : 1;

            Itemmaster::create($data);
            return redirect()->route('itemmaster.index')->with('success', 'අයිතමය සාර්ථකව නිර්මාණය කරන ලදී.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => 'අයිතමය නිර්මාණය කිරීමේදී දෝෂයක්: ' . $e->getMessage()])
                ->withInput();
        }
    }

    // Show the edit form
    public function edit($id)
    {
        $item = Itemmaster::findOrFail($id);
        return Inertia::render('Itemmaster/Edit', [
            'item' => $item,
        ]);
    }

    // Search for an item by ItemCode or ItemName
   public function search(Request $request)
{
    $request->validate([
        'search_term' => 'required|string'
    ]);

    $item = Itemmaster::where('ItemCode', $request->search_term)
        ->orWhere('ItmNm', 'like', '%' . $request->search_term . '%')
        ->first();

    if (!$item) {
        return response()->json([
            'success' => false,
            'message' => 'අයිතමය හමු නොවීය'
        ], 404);
    }

    return response()->json([
        'success' => true,
        'item' => $item
    ]);
}

    // Update an existing item
    public function update(Request $request, $id)
    {
        $item = Itemmaster::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'fInAct' => 'nullable|boolean',
            'Status' => 'nullable|string|max:50',
            'CKey' => 'nullable|integer',
            'ItemCode' => 'required|string|max:50|unique:itemmaster,ItemCode,' . $item->ItmKy . ',ItmKy',
            'BarCode' => 'nullable|string|max:100|unique:itemmaster,BarCode,' . $item->ItmKy . ',ItmKy',
            'ItmNm' => 'required|string|max:100',
            'EnglishName' => 'nullable|string|max:100',
            'cdname' => 'nullable|string',
            'ItmRefKy' => 'nullable|integer',
            'UnitKy' => 'nullable|integer',
            'CosPri' => 'nullable|numeric',
            'NCostPrice' => 'nullable|numeric',
            'ExtraPrice' => 'nullable|numeric',
            'WholePrice' => 'nullable|numeric',
            'ReOrdlLvl' => 'nullable|integer',
            'ScallItem' => 'nullable|boolean',
            'SupKey' => 'nullable|integer',
            'RtQty1' => 'nullable|integer',
            'RtDis1' => 'nullable|numeric',
            'RtQty2' => 'nullable|integer',
            'RtDis2' => 'nullable|numeric',
            'RtQty3' => 'nullable|integer',
            'RtDis3' => 'nullable|numeric',
            'RtQty4' => 'nullable|integer',
            'RtDis4' => 'nullable|numeric',
            'WSQty1' => 'nullable|integer',
            'WSDis1' => 'nullable|numeric',
            'WSQty2' => 'nullable|integer',
            'WSDis2' => 'nullable|numeric',
            'WSQty3' => 'nullable|integer',
            'WSDis3' => 'nullable|numeric',
            'WSQty4' => 'nullable|integer',
            'WSDis4' => 'nullable|numeric',
            'DiscountQty' => 'nullable|integer',
            'QuntityDiscount' => 'nullable|numeric',
            'CCPrice' => 'nullable|numeric',
            'SlsPri' => 'nullable|numeric',
            'MaxOrdQty' => 'nullable|integer',
            'ExpiryDate' => 'nullable|date',
            'ItmCd' => 'nullable|string|max:50',
            'Qty2' => 'nullable|integer',
            'WithDates' => 'nullable|boolean',
            'ProductionDate' => 'nullable|date',
            'BatchNo' => 'nullable|string|max:50',
            'VATItem' => 'nullable|boolean',
            'DoProcess' => 'nullable|boolean',
            'DoRound' => 'nullable|boolean',
            'ProcessRatio' => 'nullable|numeric',
            'OrderNo' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        try {
            $item->update($validator->validated());
            return redirect()->route('itemmaster.index')->with('success', 'අයිතමය සාර්ථකව යාවත්කාලීන කරන ලදී.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => 'අයිතමය යාවත්කාලීන කිරීමේදී දෝෂයක්: ' . $e->getMessage()])
                ->withInput();
        }
    }

    // Delete an item
    public function destroy($id)
    {
        try {
            $item = Itemmaster::findOrFail($id);
            $item->delete();
            return redirect()->route('itemmaster.index')->with('success', 'අයිතමය සාර්ථකව මකා දමන ලදී.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'අයිතමය මැකීමේදී දෝෂයක්: ' . $e->getMessage()]);
        }
    }

    // Get item details for dropdowns
    public function getItemDetails($itemCode)
    {
        $item = Itemmaster::where('ItemCode', $itemCode)->first();
        
        if (!$item) {
            return response()->json(['error' => 'Item not found'], 404);
        }
        
        return response()->json($item);
    }

    // Get all item codes for dropdown
    public function getItemCodes()
    {
        $itemCodes = Itemmaster::select('ItmKy', 'ItemCode', 'ItmNm', 'BarCode')->get();
        return response()->json($itemCodes);
    }

    // Get all item names for dropdown
    public function getItemNames()
    {
        $itemNames = Itemmaster::select('ItmKy', 'ItmNm', 'ItemCode')->get();
        return response()->json($itemNames);
    }



// Get suppliers for dropdown (filtered by supplier type)
public function getSuppliers()
{
    $suppliers = DB::table('acc_mas')
        ->where('accTyp', 'Supplier')
        ->select('accKy as id', 'accNm as name')
        ->get();
    
    return response()->json($suppliers);
}
}