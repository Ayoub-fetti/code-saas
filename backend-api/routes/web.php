<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\User;

Route::get('/', function () {
    return response()->json(['message' => 'Fret Marketplace API - voir /api']);
});

Route::get('/email/verify/{id}/{hash}', function (Request $request, $id, $hash) {
    $user = User::findOrFail($id);

    // Vérifier si le hash correspond bien à l'email actuel de l'utilisateur
    if (! hash_equals(sha1($user->getEmailForVerification()), (string) $hash)) {
        return response()->json(['message' => 'Lien de vérification invalide.'], 403);
    }

    // Vérifier si le compte est déjà vérifié
    if ($user->hasVerifiedEmail()) {
        return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/company');
    }

    // Valider l'email
    $user->markEmailAsVerified();

    // Rediriger vers le dashboard
    return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/company');
})->name('verification.verify');
