<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use function GuzzleHttp\default_ca_bundle;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id('id');
            $table->string('user_name')->nullable();
            $table->enum('sex', ['male', 'female', 'undisclosed'])->default('undisclosed');
            $table->string('password');
            $table->string('email')->nullable();
            $table->string('avatar')->nullable();
            $table->string('cover')->nullable();
            $table->string('description')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('fullname')->nullable();
            $table->string('google_id')->nullable();
            $table->double('coin')->nullable();
            $table->boolean('status')->default(true);
            // $table->unsignedBigInteger('role_id');
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamps();
            // $table->foreign('role_id')->references('id')->on('role');
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
