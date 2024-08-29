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
        Schema::create('movie', function (Blueprint $table) {
            $table->id('movie_id');
            $table->unsignedBigInteger('movie_category_id');
            $table->unsignedBigInteger('actor_id');
            $table->unsignedBigInteger('director_id');
            $table->string('name');
            $table->string('poster');
            $table->string('duraion');
            $table->date('release_date');
            $table->integer('age_limit');
            $table->string('descripton');
            $table->string('trailer');
            $table->timestamps();
            $table->foreign('movie_category_id')->references('movie_category_id')->on('movie_category');
            $table->foreign('actor_id')->references('actor_id')->on('actor');
            $table->foreign('director_id')->references('director_id')->on('director');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movie');
    }
};
