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
        Schema::create('room', function (Blueprint $table) {
            $table->id('id');
            $table->unsignedBigInteger('cinema_id');
            $table->string('room_name');
            $table->integer('volume')->nullable();
            $table->integer('quantity_double_seats')->nullable();
            $table->integer('quantity_vip_seats')->nullable();
            $table->boolean('status')->default(true);
            $table->timestamps();
            $table->foreign('cinema_id')->references('id')->on('cinema');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('room');
    }
};
