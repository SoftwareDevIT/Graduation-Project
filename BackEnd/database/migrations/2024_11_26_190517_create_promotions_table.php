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
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->integer('discount_percentage')->unsigned(); // % giảm giá
            $table->integer('max_discount')->unsigned()->nullable(); // Giảm tối đa
            $table->integer('min_purchase')->unsigned()->nullable(); // Mua tối thiểu
            $table->dateTime('valid_from');
            $table->dateTime('valid_to');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
