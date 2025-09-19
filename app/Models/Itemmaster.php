<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Itemmaster extends Model
{
    use HasFactory;

    protected $table = 'itemmaster';

    protected $primaryKey = 'ItmKy';
    public $incrementing = true;

    protected $fillable = [
        'fInAct',
        'Status',
        'CKey',
        'ItemCode',
        'BarCode',
        'ItmNm',
        'EnglishName',
        'catkey',
        'ItmRefKy',
        'UnitKy',
        'CosPri',
        'NCostPrice',
        'ExtraPrice',
        'WholePrice',
        'ReOrdlLvl',
        'ScallItem',
        'SupKey',
        'RtQty1',
        'RtDis1',
        'RtQty2',
        'RtDis2',
        'RtQty3',
        'RtDis3',
        'RtQty4',
        'RtDis4',
        'WSQty1',
        'WSDis1',
        'WSQty2',
        'WSDis2',
        'WSQty3',
        'WSDis3',
        'WSQty4',
        'WSDis4',
        'DiscountQty',
        'QuntityDiscount',
        'CCPrice',
        'SlsPri',
        'MaxOrdQty',
        'ExpiryDate',
        'ItmCd',
        'Qty2',
        'WithDates',
        'ProductionDate',
        'BatchNo',
        'VATItem',
        'DoProcess',
        'DoRound',
        'ProcessRatio',
        'OrderNo',
    ];

    protected $casts = [
        'fInAct' => 'boolean',
        'ScallItem' => 'boolean',
        'WithDates' => 'boolean',
        'VATItem' => 'boolean',
        'DoProcess' => 'boolean',
        'DoRound' => 'boolean',
        'CosPri' => 'decimal:2',
        'NCostPrice' => 'decimal:2',
        'ExtraPrice' => 'decimal:2',
        'WholePrice' => 'decimal:2',
        'RtDis1' => 'decimal:2',
        'RtDis2' => 'decimal:2',
        'RtDis3' => 'decimal:2',
        'RtDis4' => 'decimal:2',
        'WSDis1' => 'decimal:2',
        'WSDis2' => 'decimal:2',
        'WSDis3' => 'decimal:2',
        'WSDis4' => 'decimal:2',
        'QuntityDiscount' => 'decimal:2',
        'CCPrice' => 'decimal:2',
        'SlsPri' => 'decimal:2',
        'ProcessRatio' => 'decimal:2',
        'ExpiryDate' => 'date',
        'ProductionDate' => 'date',
    ];

     public function controllerMaster()
    {
        return $this->belongsTo(ControllerMaster::class, 'controller_master_id'); // adjust FK if needed
    }


    // In App\Models\Itemmaster.php
public function unit()
{
    return $this->belongsTo(UnitCnv::class, 'UnitKy', 'UnitKy');
}
}