<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsCategory extends Model
{
    use HasFactory;
    protected $table = 'news_category';
    protected $fillable = [
        'news_category_id',
        'news_category_name',
        'descriptions',
        'status',
        'created_at',
        'updated_at',
    ];
}