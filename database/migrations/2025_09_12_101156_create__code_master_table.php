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
  // code_master migration
Schema::create('code_master', function (Blueprint $table) {
    $table->id(); 
    $table->string('conkey');
    $table->string('concode');
  $table->string('cdcode')->unique();
      $table->string('cdname')->unique();
    $table->timestamps();
});


    }
public function down(): void
{
    Schema::dropIfExists('code_master'); // Correct table name here!
}

};
