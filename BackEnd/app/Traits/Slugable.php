<?php
namespace App\Traits;

use Illuminate\Support\Str;

trait Slugable
{
    /**
     * Tạo slug cho một trường cụ thể và kiểm tra tính duy nhất.
     *
     * @param  string  $field  Tên trường cần tạo slug
     * @param  string  $slugField  Tên trường lưu slug trong cơ sở dữ liệu
     * @return string
     */
    public static function createSlug($field, $slugField = 'slug')
    {
        // Tạo slug từ trường field
        $slug = Str::slug(self::{$field});

        // Kiểm tra sự tồn tại của slug trong cơ sở dữ liệu
        if (self::where($slugField, $slug)->exists()) {
            // Nếu đã tồn tại, thêm hậu tố vào slug
            $slug = $slug . '-' . uniqid();
        }

        return $slug;
    }
}
