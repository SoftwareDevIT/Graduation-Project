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
        Schema::create('room', function (Blueprint $table) {
            $table->id('id');
            $table->string('room_name');
            $table->integer('volume')->nullable();
            $table->unsignedBigInteger('cinema_id');
            $table->boolean('status')->default(true);
            $table->timestamps();
            $table->foreign('cinema_id')->references('id')->on('cinema');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('room');
    }
};
