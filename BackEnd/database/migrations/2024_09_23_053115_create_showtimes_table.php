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
            $table->unsignedBigInteger('movie_in_cinema_id');
            // $table->unsignedBigInteger('movie_id');
            // $table->unsignedBigInteger('cinema_id');
            $table->date('showtime_date');
            $table->time('showtime_start');
            $table->time('showtime_end');
            $table->boolean('status')->default(true);
            $table->timestamps();
            $table->foreign('movie_in_cinema_id')->references('id')->on('movie_in_cinema');
            // $table->foreign('movie_id')->references('id')->on('movies');
            // $table->foreign('cinema_id')->references('id')->on('cinema');
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
