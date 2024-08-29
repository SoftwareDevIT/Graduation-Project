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
        Schema::create('users', function (Blueprint $table) {
            $table->id('user_id'); 
            $table->string('user_name');
            $table->string('sex');
            $table->string('password');
            $table->string('mail');
            $table->string('avatar')->nullable();
            $table->string('phone');
            $table->string('address');
            $table->string('fullname');
            $table->double('coin');
            $table->unsignedBigInteger('role_id'); // Unsigned big integer for foreign key
            $table->timestamps(); // Automatically creates 'created_at' and 'updated_at'

            // Foreign key constraint
            $table->foreign('role_id')->references('role_id')->on('role');
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
