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
        Schema::create('seat_map', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('seat_layout_id');
            $table->string('label');
            $table->string('row');
            $table->integer('column');
            $table->enum('type', ['Regular', 'VIP', 'Couple'])->default('Regular');
            $table->boolean('is_double')->default(false);
            $table->timestamps();
            $table->foreign('seat_layout_id')->references('id')->on('seat_layouts')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seat_map');
    }
};
