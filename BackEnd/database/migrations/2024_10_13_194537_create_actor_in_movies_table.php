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
        Schema::create('actor_in_movies', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('movie_id');
            $table->unsignedBigInteger('movie_category_id');
            $table->unsignedBigInteger('actor_id');
            $table->unsignedBigInteger('director_id');
            $table->foreign('movie_id')->references('id')->on('movies');
            $table->foreign('actor_id')->references('id')->on('actor');
            $table->foreign('director_id')->references('id')->on('director');
            $table->foreign('movie_category_id')->references('id')->on('movie_category');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('actor_in_movie');
    }
};
