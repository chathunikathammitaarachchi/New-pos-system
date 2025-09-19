<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ControllerMasterSeeder extends Seeder
{
    public function run(): void
    {
        // Check if table exists before truncating
        if (DB::getSchemaBuilder()->hasTable('controller_master')) {
            DB::table('controller_master')->truncate();
        }

        $controllers = [
            [
                'concode' => 'CTRL001',
                'conkey' => 'CAT',
                'conname' => 'Category Controller',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'concode' => 'CTRL002',
                'conkey' => 'UNT',
                'conname' => 'Unit Controller',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'concode' => 'CTRL003',
                'conkey' => 'STS',
                'conname' => 'Status Controller',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'concode' => 'CTRL004',
                'conkey' => 'PAY',
                'conname' => 'Payment Controller',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'concode' => 'CTRL005',
                'conkey' => 'CUST',
                'conname' => 'Customer Controller',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'concode' => 'CTRL006',
                'conkey' => 'SUP',
                'conname' => 'Supplier Controller',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'concode' => 'CTRL007',
                'conkey' => 'ITM',
                'conname' => 'Item Controller',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'concode' => 'CTRL008',
                'conkey' => 'USR',
                'conname' => 'User Controller',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'concode' => 'CTRL009',
                'conkey' => 'ORD',
                'conname' => 'Order Controller',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'concode' => 'CTRL010',
                'conkey' => 'INV',
                'conname' => 'Inventory Controller',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        // Insert data
        DB::table('controller_master')->insert($controllers);

        $this->command->info('Controller Master table seeded successfully with ' . count($controllers) . ' records.');
    }
}