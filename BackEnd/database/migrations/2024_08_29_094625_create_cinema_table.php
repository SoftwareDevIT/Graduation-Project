<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cinema', function (Blueprint $table) {
            $table->id('id');
            $table->string('cinema_name');
            $table->string('image')->nullable();
            $table->string('phone')->nullable();
            $table->unsignedBigInteger('location_id')->nullable();
            $table->string('cinema_address')->nullable();
            $table->boolean('status')->default(true);
            $table->timestamps();
            $table->foreign('location_id')->references('id')->on('location');
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
