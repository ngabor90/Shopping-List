<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'quantity', 'note', 'packed', 'user_id', 'order'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
