<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckDriverProfile
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $driver = $request->user()->driver;

        if (!$driver) {
            return response()->json(['message' => 'Profil chauffeur introuvable.'], 403);
        }

        // Vérification 100% : CIN, Permis, Photo camion doivent être présents
        $isComplete = !empty($driver->cin) && !empty($driver->license_no) &&
                     !empty($driver->cin_photo) && !empty($driver->license_photo) && !empty($driver->truck_photo);

        if (!$isComplete || !$driver->is_verified) {
            return response()->json(['message' => 'Votre profil doit être 100% complet et vérifié par l\'admin pour postuler.'], 403);
        }

        return $next($request);
    }
}
