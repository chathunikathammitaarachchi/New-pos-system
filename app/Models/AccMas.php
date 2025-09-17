<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccMas extends Model
{
    use HasFactory;

    protected $table = 'acc_mas';
    protected $primaryKey = 'accKy';

    protected $fillable = [
        'accCd',
        'accNm',
        'accTyp',
        'curBal',
        'crLmt',
        'fVATRegistered',
        'vatNo',
        'ariaKy',
        'bnkAccNo',
        'bnkAccNm',
        'entDtm',
        'flnAct',
        'status'
    ];

    protected $casts = [
        'curBal' => 'decimal:2',
        'crLmt' => 'decimal:2',
        'fVATRegistered' => 'boolean',
        'entDtm' => 'datetime',
        'flnAct' => 'boolean'
    ];

    /**
     * Get the addresses for the account
     */
    public function addresses()
    {
        return $this->hasMany(Address::class, 'accKy', 'accKy');
    }

    /**
     * Get the transactions for the account
     */
    public function transactions()
    {
        return $this->hasMany(AccTrn::class, 'accKy', 'accKy');
    }


    // In AccMas model
public function address()
{
    return $this->hasOne(Address::class, 'accKy', 'accKy');
}
}