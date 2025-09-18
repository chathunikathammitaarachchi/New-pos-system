<?php

// Migration file: database/migrations/xxxx_xx_xx_create_itemmaster_table.php
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
        Schema::create('itemmaster', function (Blueprint $table) {
            $table->id('ItmKy'); // item key
            $table->boolean('fInAct')->default(false); // is a active item
            $table->string('Status', 50)->nullable();
            $table->unsignedBigInteger('CKey')->nullable();
            $table->string('ItemCode', 50)->unique(); // item code
            $table->string('BarCode', 100)->unique()->nullable();
            $table->string('ItmNm', 100); 
            $table->string('EnglishName', 100)->nullable();
            
            // Category foreign key
            $table->string('cdname')->nullable();
            
            $table->unsignedBigInteger('ItmRefKy')->nullable(); 
            $table->unsignedBigInteger('UnitKy')->nullable(); 
            $table->decimal('CosPri', 10, 2)->nullable(); 
            $table->decimal('NCostPrice', 10, 2)->nullable(); 
            $table->decimal('ExtraPrice', 10, 2)->nullable();
            $table->decimal('WholePrice', 10, 2)->nullable(); 
            $table->integer('ReOrdlLvl')->nullable(); 
            $table->boolean('ScallItem')->default(false);
            
            // Supplier foreign key - connect to accKy where accTyp = 'Supplier'
            $table->unsignedBigInteger('SupKey')->nullable(); 
            
            // Retail Discount Tiers
            $table->integer('RtQty1')->nullable();
            $table->decimal('RtDis1', 5, 2)->nullable();
            $table->integer('RtQty2')->nullable();
            $table->decimal('RtDis2', 5, 2)->nullable();
            $table->integer('RtQty3')->nullable();
            $table->decimal('RtDis3', 5, 2)->nullable();
            $table->integer('RtQty4')->nullable();
            $table->decimal('RtDis4', 5, 2)->nullable();
            
            // Wholesale Discount Tiers
            $table->integer('WSQty1')->nullable();
            $table->decimal('WSDis1', 5, 2)->nullable();
            $table->integer('WSQty2')->nullable();
            $table->decimal('WSDis2', 5, 2)->nullable();
            $table->integer('WSQty3')->nullable();
            $table->decimal('WSDis3', 5, 2)->nullable();
            $table->integer('WSQty4')->nullable();
            $table->decimal('WSDis4', 5, 2)->nullable();
            
            // Additional Fields
            $table->integer('DiscountQty')->nullable();
            $table->decimal('QuntityDiscount', 5, 2)->nullable();
            $table->decimal('CCPrice', 10, 2)->nullable();
            $table->decimal('SlsPri', 10, 2)->nullable(); 
            $table->integer('MaxOrdQty')->nullable();
            $table->date('ExpiryDate')->nullable();
            $table->string('ItmCd', 50)->nullable();
            $table->integer('Qty2')->nullable();
            $table->boolean('WithDates')->default(false);
            $table->date('ProductionDate')->nullable();
            $table->string('BatchNo', 50)->nullable();
            $table->boolean('VATItem')->default(false);
            $table->boolean('DoProcess')->default(false);
            $table->boolean('DoRound')->default(false);
            $table->decimal('ProcessRatio', 8, 2)->nullable();
            $table->integer('OrderNo')->nullable();
            
            $table->timestamps();
            
            // Foreign key constraints
            $table->foreign('cdname')->references('cdname')->on('code_master')->onDelete('cascade');
            $table->foreign('SupKey')->references('accKy')->on('acc_mas')->onDelete('cascade');
            
            // Indexes for better performance
            $table->index('ItemCode');
            $table->index('BarCode');
            $table->index('ItmNm');
            $table->index('fInAct');
            $table->index(['ItemCode', 'fInAct']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('itemmaster');
    }
};