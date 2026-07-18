<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckTrialPeriod
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->role === 'company') {
            $company = $user->company;

            if ($company && $company->trial_ends_at && $company->trial_ends_at->isPast()) {
                return response()->json(['message' => 'Votre période d\'essai a expiré.'], 403);
            }
        }

        return $next($request);
    }
}