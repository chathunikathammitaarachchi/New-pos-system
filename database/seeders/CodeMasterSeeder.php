<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CodeMasterSeeder extends Seeder
{
    public function run(): void
    {
DB::table('code_master')->delete();

        $codes = [
            // Category 1: Food Items
            ['conkey' => 'CAT', 'concode' => 'CAT001', 'catkey' => 'CAT001', 'cname' => 'Rice & Grains'],
            ['conkey' => 'CAT', 'concode' => 'CAT002', 'catkey' => 'CAT002', 'cname' => 'Flour & Baking'],
            ['conkey' => 'CAT', 'concode' => 'CAT003', 'catkey' => 'CAT003', 'cname' => 'Sugar & Sweeteners'],
            ['conkey' => 'CAT', 'concode' => 'CAT004', 'catkey' => 'CAT004', 'cname' => 'Dairy Products'],
            ['conkey' => 'CAT', 'concode' => 'CAT005', 'catkey' => 'CAT005', 'cname' => 'Beverages'],

   
        ];

        // Add timestamps
        foreach ($codes as &$code) {
            $code['created_at'] = now();
            $code['updated_at'] = now();
        }

        DB::table('code_master')->insert($codes);
        $this->command->info('Code Master table seeded successfully with ' . count($codes) . ' records.');
    }
}