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
        Schema::create('cinema', function (Blueprint $table) {
            $table->id('cinema_id');
            $table->string('cinema_name');
            $table->string('phone')->nullable();
            $table->unsignedBigInteger('location_id');
            $table->string('cinema_address')->nullable();
            $table->enum('status', ['Show', 'Hidden'])->default('Show');
            $table->timestamps();
            $table->foreign('location_id')->references('location_id')->on('location');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cinema');
    }
};
