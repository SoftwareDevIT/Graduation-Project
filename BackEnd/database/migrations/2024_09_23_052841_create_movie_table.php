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
            $table->id('id');
            $table->unsignedBigInteger('movie_category_id');
            $table->unsignedBigInteger('cinema_id');
            $table->unsignedBigInteger('actor_id');
            $table->unsignedBigInteger('director_id');
            $table->string('movie_name');
            $table->string('poster')->nullable();
            $table->string('duration')->nullable();
            $table->date('release_date')->nullable();
            $table->integer('age_limit')->nullable();
            $table->string('descripton')->nullable();
            $table->string('trailer')->nullable();
            $table->float('rating')->nullable();
            $table->enum('status', ['Show', 'Hidden'])->default('Show');
            $table->timestamps();
            $table->foreign('movie_category_id')->references('id')->on('movie_category');
            $table->foreign('actor_id')->references('id')->on('actor');
            $table->foreign('cinema_id')->references('id')->on('cinema');
            $table->foreign('director_id')->references('id')->on('director');
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
