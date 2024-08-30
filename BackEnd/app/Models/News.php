<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory;
    protected $table = 'news';
    protected $fillable = [
        'news_id',
        'title',
        'news_category_id',
        'thumnail',
        'content',
        'status',
        'user_id',
        'created_at',
        'updated_at',
    ];
}
