<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Actor extends Model
{
    use HasFactory;
    protected $table = 'actor';
    protected $fillable = [
        'actor_id',
        'actor_name',
        'descripcion',
        'photo',
        'country',
        'link_wiki',
        'created_at',
        'updated_at',
    ];
}