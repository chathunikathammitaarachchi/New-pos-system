<?php
// File: database/migrations/2024_01_01_000002_create_addresses_table.php

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
        Schema::create('addresses', function (Blueprint $table) {
            $table->id('adrKy');
            $table->string('adrCd', 15)->nullable();
            $table->string('ctPerson', 100)->nullable();
            $table->string('adrNm', 60)->nullable();
            $table->string('fstNm', 60)->nullable();
            $table->string('fstNm1', 60)->nullable();
            $table->string('midNm', 60)->nullable();
            $table->string('lstNm', 60)->nullable();
            $table->string('idNo', 20)->nullable();
            $table->string('title', 30)->nullable();
            $table->string('address', 250)->nullable();
            $table->string('town', 60)->nullable();
            $table->string('city', 60)->nullable();
            $table->string('country', 60)->nullable();
            $table->string('tp1', 30)->nullable();
            $table->string('tp2', 30)->nullable();
            $table->string('tp3', 30)->nullable();
            $table->string('fax', 14)->nullable();
            $table->string('email', 60)->nullable();
            $table->string('webSite', 60)->nullable();
            $table->unsignedBigInteger('accKy'); // FK to acc_mas
            $table->integer('adrTyp1Ky')->nullable();
            $table->boolean('flnAct')->default(true);
            $table->string('status', 50)->default('Active');
            $table->timestamps();

            // Foreign Key
            $table->foreign('accKy')->references('accKy')->on('acc_mas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};