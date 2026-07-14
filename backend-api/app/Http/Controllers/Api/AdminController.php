<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Driver;
use App\Models\Mission;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    private function ensureAdmin(Request $request)
    {
        abort_unless($request->user()->isAdmin(), 403, 'Accès réservé aux administrateurs');
    }

    /**
     * Liste des chauffeurs en attente de validation (dossier complet: CIN/Permis/Camion).
     */
    public function pendingDrivers(Request $request)
    {
        $this->ensureAdmin($request);

        $drivers = Driver::with('user')
            ->where('is_verified', false)
            ->latest()
            ->get();

        return response()->json($drivers);
    }

    public function allDrivers(Request $request)
    {
        $this->ensureAdmin($request);

        return response()->json(Driver::with('user')->latest()->get());
    }

    /**
     * Validation en un clic du dossier d'un chauffeur.
     */
    public function verifyDriver(Request $request, Driver $driver)
    {
        $this->ensureAdmin($request);

        $driver->update(['is_verified' => true]);

        return response()->json($driver->fresh('user'));
    }

    public function rejectDriver(Request $request, Driver $driver)
    {
        $this->ensureAdmin($request);

        $driver->update(['is_verified' => false]);
        $driver->user->update(['status' => 'suspended']);

        return response()->json($driver->fresh('user'));
    }

    public function suspendUser(Request $request, User $user)
    {
        $this->ensureAdmin($request);

        $user->update(['status' => $user->status === 'active' ? 'suspended' : 'active']);

        return response()->json($user);
    }

    /**
     * KPIs globaux de la plateforme pour le dashboard admin.
     */
    public function stats(Request $request)
    {
        $this->ensureAdmin($request);

        return response()->json([
            'total_users' => User::count(),
            'total_companies' => Company::count(),
            'total_drivers' => Driver::count(),
            'verified_drivers' => Driver::where('is_verified', true)->count(),
            'pending_drivers' => Driver::where('is_verified', false)->count(),
            'total_missions' => Mission::count(),
            'missions_available' => Mission::where('status', 'available')->count(),
            'missions_in_progress' => Mission::where('status', 'in_progress')->count(),
            'missions_completed' => Mission::where('status', 'completed')->count(),
            'total_revenue' => (float) Mission::where('status', 'completed')->sum('price'),
        ]);
    }
}
