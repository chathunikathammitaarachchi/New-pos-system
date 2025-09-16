<?php
// File: database/migrations/2024_01_01_000003_create_acc_trn_table.php

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
        Schema::create('acc_trn', function (Blueprint $table) {
            $table->id('accTrnKy');
            $table->integer('trnKy')->nullable();
            $table->unsignedBigInteger('accKy'); // FK to acc_mas
            $table->dateTime('trnDt')->nullable();
            $table->string('trnNo', 50)->nullable();
            $table->decimal('amt', 15, 2)->default(0.00);
            $table->string('voucherNo', 25)->nullable();
            $table->string('payTrmKy', 10)->nullable();
            $table->string('chqueNo', 25)->nullable();
            $table->string('bankNm', 35)->nullable();
            $table->string('brachNm', 50)->nullable(); // Note: kept original spelling 'brach'
            $table->dateTime('rBDt')->nullable();
            $table->boolean('fChqDet')->default(false);
            $table->boolean('fRetuen')->default(false); // Note: kept original spelling 'fRetuen'
            $table->dateTime('rtnDt')->nullable();
            $table->string('des', 200)->nullable();
            $table->integer('accTrnTyp1Ky')->nullable();
            $table->integer('accTrnTyp2Ky')->nullable();
            $table->integer('accTrnTyp3Ky')->nullable();
            $table->boolean('flnAct')->default(true);
            $table->string('status', 2)->nullable();
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
        Schema::dropIfExists('acc_trn');
    }
};