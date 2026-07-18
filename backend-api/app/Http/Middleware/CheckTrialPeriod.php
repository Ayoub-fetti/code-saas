<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckTrialPeriod
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->role === 'company') {
            $company = $user->company;
            // Essai de 30 jours (à configurer ultérieurement en base)
            if ($company && $company->created_at->addDays(30)->isPast()) {
                return response()->json([
                    'message' => 'Votre période d\'essai a expiré.',
                    'code' => 'TRIAL_EXPIRED'
                ], 403);
            }
        }

        return $next($request);
    }
}
