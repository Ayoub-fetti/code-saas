<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'key',
        'value',
    ];

    // Cast the value to appropriate type if needed
    protected $casts = [
        'value' => 'string',
    ];
}