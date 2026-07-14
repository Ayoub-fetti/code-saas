<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Driver;
use App\Models\Mission;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // --- 1 Admin ---
        $admin = User::create([
            'name' => 'Admin Fret',
            'email' => 'admin@fret.local',
            'phone' => '0600000000',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 'active',
        ]);

        // --- 2 Entreprises ---
        $companyUser1 = User::create([
            'name' => 'Responsable Logistique 1',
            'email' => 'entreprise1@fret.local',
            'phone' => '0611111111',
            'password' => Hash::make('password'),
            'role' => 'company',
            'status' => 'active',
        ]);
        $company1 = Company::create([
            'user_id' => $companyUser1->id,
            'company_name' => 'Atlas Cargo SARL',
            'ice' => '001234567000012',
        ]);

        $companyUser2 = User::create([
            'name' => 'Responsable Logistique 2',
            'email' => 'entreprise2@fret.local',
            'phone' => '0622222222',
            'password' => Hash::make('password'),
            'role' => 'company',
            'status' => 'active',
        ]);
        $company2 = Company::create([
            'user_id' => $companyUser2->id,
            'company_name' => 'Maroc Transit SA',
            'ice' => '001234567000034',
        ]);

        // --- 2 Chauffeurs ---
        $driverUser1 = User::create([
            'name' => 'Youssef Alaoui',
            'email' => 'chauffeur1@fret.local',
            'phone' => '0633333333',
            'password' => Hash::make('password'),
            'role' => 'driver',
            'status' => 'active',
            'phone_verified_at' => now(),
        ]);
        $driver1 = Driver::create([
            'user_id' => $driverUser1->id,
            'license_no' => 'PL-2024-001',
            'license_type' => 'C',
            'cin' => 'BE123456',
            'truck_type' => 'moyen',
            'city' => 'Casablanca',
            'is_verified' => true,
        ]);

        $driverUser2 = User::create([
            'name' => 'Karim Bennani',
            'email' => 'chauffeur2@fret.local',
            'phone' => '0644444444',
            'password' => Hash::make('password'),
            'role' => 'driver',
            'status' => 'active',
            'phone_verified_at' => now(),
        ]);
        $driver2 = Driver::create([
            'user_id' => $driverUser2->id,
            'license_no' => 'PL-2024-002',
            'license_type' => 'EC',
            'cin' => 'BK654321',
            'truck_type' => 'lourd',
            'city' => 'Rabat',
            'is_verified' => false, // en attente de validation admin
        ]);

        // --- 3 Missions ---
        Mission::create([
            'company_id' => $company1->id,
            'title' => 'Transport de marchandises Casablanca -> Marrakech',
            'start_address' => 'Zone Industrielle Ain Sebaa, Casablanca',
            'end_address' => 'Zone Industrielle Sidi Ghanem, Marrakech',
            'start_city' => 'Casablanca',
            'end_city' => 'Marrakech',
            'goods_type' => 'Matériaux de construction',
            'truck_type' => 'moyen',
            'max_weight' => 8.5,
            'required_license' => 'C',
            'distance_km' => 240,
            'price' => Mission::calculatePrice(240, 'moyen'),
            'status' => 'available',
        ]);

        Mission::create([
            'company_id' => $company1->id,
            'title' => 'Livraison de produits agroalimentaires Rabat -> Fès',
            'start_address' => 'Technopolis, Rabat',
            'end_address' => 'Zone Industrielle Dokkarat, Fès',
            'start_city' => 'Rabat',
            'end_city' => 'Fès',
            'goods_type' => 'Produits alimentaires réfrigérés',
            'truck_type' => 'leger',
            'max_weight' => 3.0,
            'required_license' => 'B',
            'distance_km' => 200,
            'price' => Mission::calculatePrice(200, 'leger'),
            'status' => 'available',
        ]);

        Mission::create([
            'company_id' => $company2->id,
            'driver_id' => $driver1->id,
            'title' => 'Transport de conteneurs Tanger Med -> Casablanca',
            'start_address' => 'Port Tanger Med',
            'end_address' => 'Zone Industrielle Ain Sebaa, Casablanca',
            'start_city' => 'Tanger',
            'end_city' => 'Casablanca',
            'goods_type' => 'Conteneur import/export',
            'truck_type' => 'lourd',
            'max_weight' => 22.0,
            'required_license' => 'EC',
            'distance_km' => 340,
            'price' => Mission::calculatePrice(340, 'lourd'),
            'status' => 'in_progress',
        ]);
    }
}
