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

            // Category 2: Unit Types
            ['conkey' => 'UNT', 'concode' => 'UNT001', 'catkey' => 'UNT001', 'cname' => 'Kilogram'],
            ['conkey' => 'UNT', 'concode' => 'UNT002', 'catkey' => 'UNT002', 'cname' => 'Gram'],
            ['conkey' => 'UNT', 'concode' => 'UNT003', 'catkey' => 'UNT003', 'cname' => 'Liter'],
            ['conkey' => 'UNT', 'concode' => 'UNT004', 'catkey' => 'UNT004', 'cname' => 'Piece'],
            ['conkey' => 'UNT', 'concode' => 'UNT005', 'catkey' => 'UNT005', 'cname' => 'Pack'],

            // Category 3: Item Status
            ['conkey' => 'STS', 'concode' => 'STS001', 'catkey' => 'STS001', 'cname' => 'Active'],
            ['conkey' => 'STS', 'concode' => 'STS002', 'catkey' => 'STS002', 'cname' => 'Inactive'],
            ['conkey' => 'STS', 'concode' => 'STS003', 'catkey' => 'STS003', 'cname' => 'Discontinued'],
            ['conkey' => 'STS', 'concode' => 'STS004', 'catkey' => 'STS004', 'cname' => 'Out of Stock'],

            // Category 4: Payment Methods
            ['conkey' => 'PAY', 'concode' => 'PAY001', 'catkey' => 'PAY001', 'cname' => 'Cash'],
            ['conkey' => 'PAY', 'concode' => 'PAY002', 'catkey' => 'PAY002', 'cname' => 'Credit Card'],
            ['conkey' => 'PAY', 'concode' => 'PAY003', 'catkey' => 'PAY003', 'cname' => 'Debit Card'],
            ['conkey' => 'PAY', 'concode' => 'PAY004', 'catkey' => 'PAY004', 'cname' => 'Mobile Payment'],

            // Category 5: Customer Types
            ['conkey' => 'CUST', 'concode' => 'CUST001', 'catkey' => 'CUST001', 'cname' => 'Retail'],
            ['conkey' => 'CUST', 'concode' => 'CUST002', 'catkey' => 'CUST002', 'cname' => 'Wholesale'],
            ['conkey' => 'CUST', 'concode' => 'CUST003', 'catkey' => 'CUST003', 'cname' => 'Corporate'],
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