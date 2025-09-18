<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ControllerMaster;
use App\Models\CodeMaster;
use App\Models\UnitCnv;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    
    public function run(): void
    {
        $this->call(ItemMasterSeeder::class);

        // Create ControllerMaster records
        ControllerMaster::create([
            'concode' => 'CTRL001',
            'conkey' => 'KEY001',
            'conname' => 'Main Controller'
        ]);

        ControllerMaster::create([
            'concode' => 'CTRL002',
            'conkey' => 'KEY002',
            'conname' => 'Secondary Controller'
        ]);

        // Create CodeMaster records
        CodeMaster::create([
            'conkey' => 'KEY001',
            'concode' => 'CTRL001',
            'cdcode' => 'CD001',
            'cdname' => 'First Code'
        ]);

        CodeMaster::create([
            'conkey' => 'KEY002',
            'concode' => 'CTRL002',
            'cdcode' => 'CD002',
            'cdname' => 'Second Code'
        ]);

        // Create admin user if it doesn't exist
        if (!User::where('email', 'admin@rms.com')->exists()) {
            User::create([
                'name' => 'RMS Admin',
                'email' => 'admin@rms.com',
                'password' => bcrypt('password123'),
            ]);
        }



        $this->call([
        AccMasSeeder::class,
        UnitCnvSeeder::class,


        

        
    ]);

     
    }

    
}