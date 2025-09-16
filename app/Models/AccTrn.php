<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccTrn extends Model
{
    use HasFactory;

    protected $table = 'acc_trn';
    protected $primaryKey = 'accTrnKy';
    public $timestamps = true;

    protected $fillable = [
        'trnKy',
        'accKy',
        'trnDt',
        'trnNo',
        'amt',
        'voucherNo',
        'payTrmKy',
        'chqueNo',
        'bankNm',
        'brachNm',
        'rBDt',
        'fChqDet',
        'fRetuen',
        'rtnDt',
        'des',
        'accTrnTyp1Ky',
        'accTrnTyp2Ky',
        'accTrnTyp3Ky',
        'flnAct',
        'status',
    ];

    // Relationships
    public function account()
    {
        return $this->belongsTo(AccMas::class, 'accKy');
    }
}
