<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DriverController extends Controller
{
    /**
     * Upload des documents du chauffeur (CIN, Permis, Photo camion) depuis l'appareil photo.
     */
    public function uploadDocuments(Request $request)
    {
        $user = $request->user();
        $driver = $user->driver;

        if (! $driver) {
            return response()->json(['message' => 'Profil chauffeur introuvable'], 404);
        }

        $validated = $request->validate([
            'license_no' => 'sometimes|string',
            'license_type' => 'sometimes|in:B,C,EC',
            'cin' => 'sometimes|string',
            'truck_type' => 'sometimes|in:leger,moyen,lourd',
            'city' => 'sometimes|string',
            'cin_photo' => 'sometimes|image|max:5120',
            'license_photo' => 'sometimes|image|max:5120',
            'truck_photo' => 'sometimes|image|max:5120',
        ]);

        foreach (['cin_photo', 'license_photo', 'truck_photo'] as $field) {
            if ($request->hasFile($field)) {
                $validated[$field] = $request->file($field)->store('drivers/'.$driver->id, 'public');
            }
        }

        // Toute modification de documents remet le dossier en attente de validation admin.
        $validated['is_verified'] = false;

        $driver->update($validated);

        return response()->json($driver->fresh());
    }

    public function show(Driver $driver)
    {
        return response()->json($driver->load('user'));
    }

    public function toggleAvailability(Request $request)
    {
        $driver = $request->user()->driver;

        if (!$driver) {
            return response()->json(['message' => 'Profil chauffeur introuvable'], 404);
        }

        $driver->is_available = !$driver->is_available;
        $driver->save();

        return response()->json([
            'message' => 'Statut de disponibilité mis à jour',
            'is_available' => $driver->is_available
        ]);
    }

    public function profile(Request $request)
    {
        return response()->json($request->user()->driver);
    }
}
