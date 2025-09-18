<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UnitCnv extends Model
{
    use HasFactory;

    protected $table = 'unit_cnv';
    protected $primaryKey = 'UnitKy';
    public $incrementing = true;
    public $timestamps = true;

    protected $fillable = [
        'Unit',
        'ConvRate',
        'finAct',
        'Status',
        'fBase',
        'Des'
    ];

    protected $casts = [
        'finAct' => 'boolean',
        'fBase' => 'boolean',
        'ConvRate' => 'float'
    ];
}