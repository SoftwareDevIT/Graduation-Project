<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;
    protected $table = 'comment';
    protected $fillable = [
        'comment_id',
        'user_id',
        'movie_id',
        'content',
        'status',
        'created_at',
        'updated_at',
    ];
}
