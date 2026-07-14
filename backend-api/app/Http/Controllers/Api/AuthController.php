<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Driver;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Inscription entreprise ou admin (email + mot de passe).
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|unique:users,phone',
            'password' => 'required|string|min:6',
            'role' => 'required|in:company,driver',
            'company_name' => 'required_if:role,company|string|nullable',
            'ice' => 'required_if:role,company|string|nullable',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'status' => 'active',
        ]);

        if ($request->role === 'company') {
            Company::create([
                'user_id' => $user->id,
                'company_name' => $request->company_name,
                'ice' => $request->ice,
            ]);
        } elseif ($request->role === 'driver') {
            Driver::create([
                'user_id' => $user->id,
                'license_no' => $request->license_no ?? 'N/A',
                'cin' => $request->cin ?? 'N/A',
                'truck_type' => $request->truck_type ?? 'leger',
                'city' => $request->city,
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user->load(['company', 'driver']),
            'token' => $token,
        ], 201);
    }

    /**
     * Connexion classique par email/mot de passe (Admin / Entreprises).
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }

        if ($user->status === 'suspended') {
            return response()->json(['message' => 'Compte suspendu'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user->load(['company', 'driver']),
            'token' => $token,
        ]);
    }

    /**
     * Étape 1 - Envoi d'un code OTP simulé par téléphone (pour les chauffeurs, style WhatsApp).
     */
    public function sendOtp(Request $request)
    {
        $request->validate(['phone' => 'required|string']);

        $otp = random_int(100000, 999999);
        Cache::put('otp_'.$request->phone, $otp, now()->addMinutes(5));

        // En production: brancher ici l'API WhatsApp Business / Twilio.
        return response()->json([
            'message' => 'Code OTP envoyé par WhatsApp',
            'debug_otp' => $otp, // exposé uniquement en local pour faciliter les tests
        ]);
    }

    /**
     * Étape 2 - Vérification du code OTP et connexion/création automatique du compte chauffeur.
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'otp' => 'required|string',
        ]);

        $cachedOtp = Cache::get('otp_'.$request->phone);

        if (! $cachedOtp || (string) $cachedOtp !== (string) $request->otp) {
            return response()->json(['message' => 'Code OTP invalide ou expiré'], 422);
        }

        Cache::forget('otp_'.$request->phone);

        $user = User::firstOrCreate(
            ['phone' => $request->phone],
            [
                'name' => 'Chauffeur '.substr($request->phone, -4),
                'email' => 'driver_'.uniqid().'@fret.local',
                'password' => Hash::make(uniqid()),
                'role' => 'driver',
                'status' => 'active',
                'phone_verified_at' => now(),
            ]
        );

        if (! $user->driver) {
            Driver::create([
                'user_id' => $user->id,
                'license_no' => '',
                'cin' => '',
                'truck_type' => 'leger',
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user->load('driver'),
            'token' => $token,
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user()->load(['company', 'driver']));
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté']);
    }
}
