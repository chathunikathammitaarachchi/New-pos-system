<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // controller_master migration
 public function up(): void {
        Schema::create('controller_master', function (Blueprint $table) {
            $table->id(); 
            $table->string('concode');
            $table->string('conkey');
            $table->string('conname');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('controller_master');
    }

};
