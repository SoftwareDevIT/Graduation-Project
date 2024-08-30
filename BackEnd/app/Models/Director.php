<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Director extends Model
{
    use HasFactory;
    protected $table = 'director';
    protected $fillable = [
        'director_id',
        'director_name',
        'descripcion',
        'photo',
        'country',
        'link_wiki',
        'created_at',
        'updated_at',
    ];
}
