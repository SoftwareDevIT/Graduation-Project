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
        Schema::create('news', function (Blueprint $table) {
            $table->id('id');
            $table->string('title')->nullable();
            $table->unsignedBigInteger('news_category_id');
            $table->string('thumnail')->nullable();
            $table->string('thumnail_url')->nullable();
            $table->string('content')->nullable();
            $table->enum('status', ['Show', 'Hidden'])->default('Show');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();
            $table->foreign('news_category_id')->references('id')->on('news_category');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news');
    }
};
