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
        Schema::create('seats', function (Blueprint $table) {
            $table->id('id');
            $table->string('seat_name');
            $table->enum('status', ['Reserved Until', 'Booked'])->default('Reserved Until');
            $table->unsignedBigInteger('showtime_id');
            $table->unsignedBigInteger('room_id');
            $table->string('seat_column');
            $table->timestamp('reserved_until')->nullable();
            $table->enum('seat_type', ['Standard', 'Couple', 'VIP'])->default('Standard');
            $table->string('seat_row');
            $table->foreign('showtime_id')->references('id')->on('showtimes');
            $table->foreign('room_id')->references('id')->on('room');
            $table->timestamps();
            // $table->foreign('room_id')->references('id')->on('room');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seats');
    }
};