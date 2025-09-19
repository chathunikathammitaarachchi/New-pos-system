<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('code_master', function (Blueprint $table) {
            $table->id();
            $table->string('conkey');
            $table->string('concode');
            $table->string('catkey')->unique();
            $table->string('cname')->unique();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('code_master');
    }
};