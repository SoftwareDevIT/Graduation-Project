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
            $table->id('id');
            $table->unsignedBigInteger('movie_id');
            $table->unsignedBigInteger('room_id');
            $table->date('showtime_date');
            $table->time('showtime_start');
            $table->time('showtime_end');
            $table->boolean('status')->default(true);
            $table->timestamps();
            $table->foreign('movie_id')->references('id')->on('movies');
            $table->foreign('room_id')->references('id')->on('room');
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
