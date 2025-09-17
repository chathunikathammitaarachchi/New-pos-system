<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    protected $table = 'addresses';
    protected $primaryKey = 'adrKy';

    protected $fillable = [
        'adrCd',
        'ctPerson',
        'adrNm',
        'fstNm',
        'fstNm1',
        'midNm',
        'lstNm',
        'idNo',
        'title',
        'address',
        'town',
        'city',
        'country',
        'tp1',
        'tp2',
        'tp3',
        'fax',
        'email',
        'webSite',
        'accKy',
        'adrTyp1Ky',
        'flnAct',
        'status'
    ];

    protected $casts = [
        'flnAct' => 'boolean'
    ];

    /**
     * Get the account that owns the address
     */
    public function account()
    {
        return $this->belongsTo(AccMas::class, 'accKy', 'accKy');
    }



    
}