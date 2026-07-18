<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bid;
use App\Models\Mission;
use Illuminate\Http\Request;

use App\Notifications\MissionStatusChanged;
use Illuminate\Support\Facades\Notification;

class BidController extends Controller
{
    /**
     * Le chauffeur soumet une offre: soit il accepte le prix affiché,
     * soit il négocie avec un prix + message.
     */
    public function store(Request $request, Mission $mission)
    {
        $user = $request->user();

        if ($user->role !== 'driver' || ! $user->driver) {
            return response()->json(['message' => 'Réservé aux chauffeurs'], 403);
        }

        if ($mission->status !== 'available') {
            return response()->json(['message' => 'Cette mission n\'est plus disponible'], 422);
        }

        $validated = $request->validate([
            'proposed_price' => 'required|numeric|min:0',
            'message' => 'nullable|string|max:1000',
        ]);

        $bid = Bid::updateOrCreate(
            [
                'mission_id' => $mission->id,
                'driver_id' => $user->driver->id,
            ],
            [
                'proposed_price' => $validated['proposed_price'],
                'message' => $validated['message'] ?? null,
                'status' => 'pending',
            ]
        );

        $mission->update(['status' => 'applied']);

        // Notifier l'entreprise qu'une candidature a été reçue
        $mission->company->user->notify(new MissionStatusChanged($mission, 'Une nouvelle candidature a été reçue pour votre mission ' . $mission->title));

        return response()->json($bid->load('driver.user'), 201);
    }

    /**
     * L'entreprise accepte une offre: la mission est attribuée au chauffeur,
     * les autres offres sont automatiquement rejetées.
     */
    public function accept(Request $request, Bid $bid)
    {
        $mission = $bid->mission;
        $user = $request->user();

        if ($mission->company_id !== $user->company?->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $bid->update(['status' => 'accepted']);

        $mission->update([
            'driver_id' => $bid->driver_id,
            'price' => $bid->proposed_price,
            'status' => 'in_progress',
        ]);

        // Notifier le chauffeur
        $bid->driver->user->notify(new MissionStatusChanged($mission, 'Félicitations ! Votre candidature a été acceptée pour la mission ' . $mission->title));

        Bid::where('mission_id', $mission->id)
            ->where('id', '!=', $bid->id)
            ->update(['status' => 'rejected']);

        return response()->json($mission->load(['driver.user', 'bids']));
    }

    public function reject(Request $request, Bid $bid)
    {
        $user = $request->user();

        if ($bid->mission->company_id !== $user->company?->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $bid->update(['status' => 'rejected']);

        // Notifier le chauffeur
        $bid->driver->user->notify(new MissionStatusChanged($bid->mission, 'Désolé, votre candidature pour la mission ' . $bid->mission->title . ' a été rejetée.'));

        return response()->json($bid);
    }
}
