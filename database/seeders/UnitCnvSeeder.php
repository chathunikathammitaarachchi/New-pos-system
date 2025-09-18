<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\UnitCnv;

class UnitCnvSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        UnitCnv::create([
            'UnitKy' => 1,
            'Unit' => 'PCS',
            'ConvRate' => 1.0,
            'finAct' => true,
            'Status' => 'A',
            'fBase' => true,
            'Des' => 'Piece unit'
        ]);

        UnitCnv::create([
            'UnitKy' => 2,
            'Unit' => 'BOX',
            'ConvRate' => 12.0,
            'finAct' => true,
            'Status' => 'A',
            'fBase' => false,
            'Des' => 'Box of 12 pieces'
        ]);

    }
}