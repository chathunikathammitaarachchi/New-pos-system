<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ItemMasterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('itemmaster')->truncate(); // Optional: clears table before seeding

        for ($i = 1; $i <= 20; $i++) {
            DB::table('itemmaster')->insert([
                'fInAct'        => fake()->boolean(10), // 10% chance of being inactive
                'Status'        => fake()->randomElement(['Available', 'Out of Stock', 'Discontinued']),
                'CKey'          => fake()->numberBetween(1, 10),
                'ItemCode'      => 'ITEM' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'BarCode'       => 'BCODE' . str_pad($i, 6, '0', STR_PAD_LEFT),
                'ItmNm'         => fake()->words(2, true),
                'EnglishName'   => fake()->words(2, true),
                 'cdname' => null,
                'ItmRefKy'      => fake()->numberBetween(1, 5),
                'UnitKy'        => fake()->numberBetween(1, 5),
                'CosPri'        => fake()->randomFloat(2, 50, 500),
                'NCostPrice'    => fake()->randomFloat(2, 60, 550),
                'ExtraPrice'    => fake()->randomFloat(2, 5, 50),
                'WholePrice'    => fake()->randomFloat(2, 100, 600),
                'ReOrdlLvl'     => fake()->numberBetween(10, 50),
                'ScallItem'     => fake()->boolean(),
                'SupKey'        => fake()->numberBetween(1, 10),

                // Retail Discount Tiers
                'RtQty1'        => 5,
                'RtDis1'        => 5.00,
                'RtQty2'        => 10,
                'RtDis2'        => 10.00,
                'RtQty3'        => 20,
                'RtDis3'        => 15.00,
                'RtQty4'        => 50,
                'RtDis4'        => 20.00,

                // Wholesale Discount Tiers
                'WSQty1'        => 50,
                'WSDis1'        => 5.00,
                'WSQty2'        => 100,
                'WSDis2'        => 10.00,
                'WSQty3'        => 200,
                'WSDis3'        => 15.00,
                'WSQty4'        => 500,
                'WSDis4'        => 20.00,

                'DiscountQty'       => fake()->numberBetween(1, 10),
                'QuntityDiscount'   => fake()->randomFloat(2, 1, 5),
                'CCPrice'           => fake()->randomFloat(2, 10, 100),
                'SlsPri'            => fake()->randomFloat(2, 70, 700),
                'MaxOrdQty'         => fake()->numberBetween(50, 200),
                'ExpiryDate'        => fake()->dateTimeBetween('now', '+1 year'),
                'ItmCd'             => strtoupper(Str::random(8)),
                'Qty2'              => fake()->numberBetween(1, 10),
                'WithDates'         => fake()->boolean(),
                'ProductionDate'    => fake()->dateTimeBetween('-1 year', 'now'),
                'BatchNo'           => 'BATCH' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'VATItem'           => fake()->boolean(),
                'DoProcess'         => fake()->boolean(),
                'DoRound'           => fake()->boolean(),
                'ProcessRatio'      => fake()->randomFloat(2, 0.1, 1.0),
                'OrderNo'           => $i,
                'created_at'        => Carbon::now(),
                'updated_at'        => Carbon::now(),
            ]);
        }
    }
}
