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
        Schema::create('website_settings', function (Blueprint $table) {
            $table->id();
            $table->string('site_name')->default('Poly Cinemas');
            $table->string('tagline')->nullable(); // Khẩu hiệu
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('working_hours')->nullable(); // Thời gian làm việc
            $table->string('business_license')->nullable(); // Giấy phép kinh doanh
            $table->string('facebook_link')->default('https://facebook.com/');
            $table->string('youtube_link')->default('https://youtube.com/');
            $table->string('instagram_link')->default('https://instagram.com/');
            $table->string('copyright')->default('Bản quyền © 2024 Poly Cinemas');
            $table->text('privacy_policy')->nullable(); // Chính sách bảo mật
            $table->string('logo')->nullable();
            $table->string('privacy_image')->nullable();
            $table->string('terms_image')->nullable();
            $table->string('about_image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('website_settings');
    }
};
