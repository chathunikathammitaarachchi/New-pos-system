<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AccMas;
use App\Models\Address;
use Illuminate\Support\Str;

class AccMasSeeder extends Seeder
{
    public function run(): void
    {
        $types = ['Customer', 'Supplier'];

        foreach ($types as $type) {
            for ($i = 1; $i <= 5; $i++) {
                $accCd = strtoupper($type[0]) . str_pad($i, 4, '0', STR_PAD_LEFT);
                $accNm = $type . ' ' . $i;

                $acc = AccMas::create([
                    'accCd' => $accCd,
                    'accNm' => $accNm,
                    'accTyp' => $type,
                    'curBal' => 0.00,
                    'crLmt' => rand(1000, 10000),
                    'fVATRegistered' => rand(0, 1),
                    'vatNo' => 'VAT' . rand(10000, 99999),
                    'entDtm' => now(),
                    'flnAct' => true,
                    'status' => 'Active',
                ]);

                Address::create([
                    'accKy' => $acc->accKy,
                    'adrNm' => 'Address for ' . $accNm,
                    'tp1' => '077' . rand(1000000, 9999999),
                    'fax' => '011' . rand(1000000, 9999999),
                    'email' => strtolower($type) . $i . '@example.com',
                    'idNo' => strtoupper(Str::random(10)),
                    'flnAct' => true,
                    'status' => 'Active',
                ]);
            }
        }
    }
}
