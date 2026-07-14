<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mission;
use Illuminate\Http\Request;

class MissionController extends Controller
{
    /**
     * Liste des missions disponibles, avec filtre optionnel par ville de départ.
     */
    public function index(Request $request)
    {
        $query = Mission::with(['company', 'driver.user', 'bids']);

        if ($request->filled('city')) {
            $query->where(function ($q) use ($request) {
                $q->where('start_city', 'like', '%'.$request->city.'%')
                  ->orWhere('end_city', 'like', '%'.$request->city.'%');
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        } else {
            $query->where('status', 'available');
        }

        if ($request->filled('truck_type')) {
            $query->where('truck_type', $request->truck_type);
        }

        return response()->json($query->latest()->get());
    }

    /**
     * Simulation du calcul de prix (utilisé côté front avant soumission).
     */
    public function calculatePrice(Request $request)
    {
        $request->validate([
            'distance_km' => 'required|numeric|min:0',
            'truck_type' => 'required|in:leger,moyen,lourd',
        ]);

        $price = Mission::calculatePrice($request->distance_km, $request->truck_type);

        return response()->json(['price' => $price]);
    }

    /**
     * Création d'une mission par une entreprise (le prix est calculé automatiquement).
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'company' || ! $user->company) {
            return response()->json(['message' => 'Réservé aux entreprises'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'start_address' => 'required|string',
            'end_address' => 'required|string',
            'start_city' => 'nullable|string',
            'end_city' => 'nullable|string',
            'goods_type' => 'required|string',
            'truck_type' => 'required|in:leger,moyen,lourd',
            'max_weight' => 'required|numeric|min:0',
            'required_license' => 'required|in:B,C,EC',
            'distance_km' => 'required|numeric|min:0',
        ]);

        $validated['company_id'] = $user->company->id;
        $validated['price'] = Mission::calculatePrice($validated['distance_km'], $validated['truck_type']);
        $validated['status'] = 'available';

        $mission = Mission::create($validated);

        return response()->json($mission->load('company'), 201);
    }

    public function show(Mission $mission)
    {
        return response()->json($mission->load(['company', 'driver.user', 'bids.driver.user']));
    }

    /**
     * Missions publiées par l'entreprise connectée.
     */
    public function myMissions(Request $request)
    {
        $user = $request->user();

        $missions = Mission::with(['bids.driver.user', 'driver.user'])
            ->where('company_id', $user->company->id)
            ->latest()
            ->get();

        return response()->json($missions);
    }

    /**
     * Missions attribuées / candidatées par le chauffeur connecté.
     */
    public function myApplications(Request $request)
    {
        $driver = $request->user()->driver;

        $missions = Mission::with(['company', 'bids' => function ($q) use ($driver) {
            $q->where('driver_id', $driver->id);
        }])
            ->whereHas('bids', function ($q) use ($driver) {
                $q->where('driver_id', $driver->id);
            })
            ->orWhere('driver_id', $driver->id)
            ->latest()
            ->get();

        return response()->json($missions);
    }

    public function update(Request $request, Mission $mission)
    {
        $user = $request->user();

        if ($mission->company_id !== $user->company?->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $validated = $request->validate([
            'status' => 'sometimes|in:available,applied,in_progress,completed',
        ]);

        $mission->update($validated);

        return response()->json($mission);
    }
}
