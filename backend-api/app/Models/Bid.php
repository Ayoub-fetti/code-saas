<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bid extends Model
{
    use HasFactory;

    protected $fillable = [
        'mission_id', 'driver_id', 'proposed_price', 'message', 'status',
    ];

    public function mission()
    {
        return $this->belongsTo(Mission::class);
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }
}
