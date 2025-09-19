<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user first
        if (!User::where('email', 'admin@rms.com')->exists()) {
            User::create([
                'name' => 'RMS Admin',
                'email' => 'admin@rms.com',
                'password' => bcrypt('password123'),
            ]);
        }

        // Run seeders in correct order
        $this->call([
            ControllerMasterSeeder::class, // Should come first
            CodeMasterSeeder::class,        // Needs controller master
            AccMasSeeder::class,           // Suppliers needed for items
            UnitCnvSeeder::class,          // Units needed for items
            ItemMasterSeeder::class,       // Needs codes, suppliers, and units
        ]);
    }
}