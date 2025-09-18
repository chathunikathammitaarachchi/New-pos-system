<?php
// File: database/migrations/2024_01_01_000001_create_acc_mas_table.php

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
        Schema::create('acc_mas', function (Blueprint $table) {
            $table->id('accKy');
            $table->string('accCd', 20)->unique();
            $table->string('accNm', 60);
$table->string('accTyp', 10);
            $table->decimal('curBal', 15, 2)->default(0.00);
            $table->decimal('crLmt', 15, 2)->default(0.00);
            $table->boolean('fVATRegistered')->default(false);
            $table->string('vatNo', 50)->nullable();
            $table->integer('ariaKy')->nullable();
            $table->string('bnkAccNo', 20)->nullable();
            $table->string('bnkAccNm', 60)->nullable();
            $table->dateTime('entDtm');
            $table->boolean('flnAct')->default(true);
            $table->string('status', 50)->default('Active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('acc_mas');
    }
};
