<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Driver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class DriverAuthController extends Controller
{
    public function sendOtp(Request $request)
    {
        $request->validate(['phone_number' => 'required|string']);

        // Simuler la génération d'OTP
        $otp = rand(100000, 999999);

        // Dans une vraie prod, appeler API Twilio/WhatsApp
        Log::info("OTP pour {$request->phone_number} : {$otp}");

        // Stocker l'otp dans le cache ou une table temporaire
        cache()->put("otp_{$request->phone_number}", $otp, now()->addMinutes(5));

        return response()->json(['message' => 'OTP envoyé par WhatsApp (simulé)']);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'phone_number' => 'required|string',
            'otp' => 'required|string',
        ]);

        $cachedOtp = cache()->get("otp_{$request->phone_number}");

        if (!$cachedOtp || $cachedOtp != $request->otp) {
            return response()->json(['message' => 'OTP invalide ou expiré'], 401);
        }

        // Trouver ou créer l'utilisateur
        $user = User::firstOrCreate(
            ['phone' => $request->phone_number],
            ['name' => 'Conducteur', 'role' => 'driver', 'password' => Hash::make(uniqid())]
        );

        $driver = Driver::firstOrCreate(['user_id' => $user->id], ['phone_number' => $request->phone_number]);

        $token = $user->createToken('driver-token')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user]);
    }
}
