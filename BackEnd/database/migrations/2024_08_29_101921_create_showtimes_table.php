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
        Schema::create('showtimes', function (Blueprint $table) {
            $table->id('showtime_id');
            $table->unsignedBigInteger('movie_id');
            $table->unsignedBigInteger('room_id');
            $table->date('showtime_date');
            $table->date('showtime_start');
            $table->date('showtime_end');
            $table->enum('status', ['Show', 'Hidden'])->default('Show');
            $table->timestamps();
            $table->foreign('movie_id')->references('movie_id')->on('movie');
            $table->foreign('room_id')->references('room_id')->on('room');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('showtimes');
    }
};
