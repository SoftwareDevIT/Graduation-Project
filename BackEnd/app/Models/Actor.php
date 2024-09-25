<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Actor extends Model
{
    use HasFactory;
    protected $table = 'actor';
    protected $fillable = [
        'id',
        'actor_name',
        'descripcion',
        'photo',
        'country',
        'link_wiki',
    ];
    
    public function movies()
    {
        return $this->hasMany(Movie::class);
    }
}
