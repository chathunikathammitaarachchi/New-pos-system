<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('unit_cnv', function (Blueprint $table) {
            $table->integer('UnitKy')->primary();
            $table->string('Unit', 5);
            $table->float('ConvRate');
            $table->boolean('finAct')->default(true);
            $table->string('Status', 2)->nullable();
            $table->boolean('fBase')->default(false);
            $table->string('Des', 60)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('unit_cnv');
    }
};
