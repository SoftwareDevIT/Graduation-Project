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
        Schema::create('movie_category', function (Blueprint $table) {
            $table->id('movie_category_id');
            $table->string('category_name');
            $table->string('descripcion');
            $table->enum('status', ['Show', 'Hidden'])->default('Show');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movie_category');
    }
};
