<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mission extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id', 'driver_id', 'title', 'start_address', 'end_address',
        'start_city', 'end_city', 'goods_type', 'truck_type', 'max_weight',
        'required_license', 'distance_km', 'price', 'status',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }

    public function bids()
    {
        return $this->hasMany(Bid::class);
    }

    /**
     * Calcule le prix automatiquement: distance_km x tarif du type de camion.
     */
    public static function calculatePrice(float $distanceKm, string $truckType): float
    {
        $tarifs = [
            'leger' => (float) env('TARIF_KM_LEGER', 6),
            'moyen' => (float) env('TARIF_KM_MOYEN', 9),
            'lourd' => (float) env('TARIF_KM_LOURD', 13),
        ];

        $tarif = $tarifs[$truckType] ?? $tarifs['leger'];

        return round($distanceKm * $tarif, 2);
    }
}
