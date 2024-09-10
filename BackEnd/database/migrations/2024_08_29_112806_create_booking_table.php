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
        Schema::create('booking', function (Blueprint $table) {
            $table->id('id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('showtime_id');
            $table->unsignedBigInteger('seat_id');
            $table->unsignedBigInteger('pay_method_id');
            $table->unsignedBigInteger('combo_id');
            $table->double('amount');
            $table->enum('seat_status', ['hold', 'no'])->default('hold');
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('seat_id')->references('id')->on('seats');
            $table->foreign('pay_method_id')->references('id')->on('pay_method');
            $table->foreign('combo_id')->references('id')->on('combos');
            $table->foreign('showtime_id')->references('id')->on('showtimes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking');
    }
};
