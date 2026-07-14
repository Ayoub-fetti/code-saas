# Fret Marketplace — Monorepo

Plateforme de mise en relation entre **entreprises** ayant du fret à transporter et **chauffeurs** indépendants, avec panneau d'administration pour la validation des dossiers.

## Structure du projet

```
├── package.json          # Racine avec npm workspaces
├── backend-api/           # API Laravel 11 (Sanctum, MySQL)
├── frontend-client/        # Portail web React (Entreprises + Admin)
└── mobile-pwa/             # Application PWA React (Chauffeurs)
```

## Prérequis

- PHP >= 8.2, Composer
- Node.js >= 18, npm
- MySQL (ou tout autre driver Laravel supporté)

## Installation

### 1. Cloner / dézipper le projet, puis installer les dépendances JS (workspaces)

```bash
npm install
```

Cette commande installe automatiquement les dépendances de `frontend-client` et `mobile-pwa` (grâce aux npm workspaces).

### 2. Installer le backend Laravel

```bash
cd backend-api
composer install
cp .env.example .env
php artisan key:generate
```

Configurer la base de données dans `backend-api/.env` (DB_DATABASE, DB_USERNAME, DB_PASSWORD), puis :

```bash
php artisan migrate --seed
php artisan storage:link
```

Le seeder crée automatiquement :
- **1 admin** : `admin@fret.local` / `password`
- **2 entreprises** : `entreprise1@fret.local` / `entreprise2@fret.local` (mdp: `password`)
- **2 chauffeurs** : `chauffeur1@fret.local` / `chauffeur2@fret.local` (mdp: `password`)
- **3 missions** de test avec prix calculés automatiquement

### 3. Configurer les URLs d'API des frontends (optionnel)

Par défaut les deux apps React pointent vers `http://localhost:8000/api`. Pour changer, créer un fichier `.env` dans `frontend-client/` et `mobile-pwa/` :

```
VITE_API_URL=http://localhost:8000/api
```

## Lancer le projet en local (les 3 apps en même temps)

Depuis la racine du monorepo :

```bash
npm run dev
```

Cette commande démarre simultanément :
- **API Laravel** → http://localhost:8000
- **Portail Entreprises/Admin (React)** → http://localhost:5173
- **PWA Chauffeurs (React)** → http://localhost:5174

Vous pouvez aussi lancer chaque app séparément :

```bash
npm run dev:api      # Laravel uniquement
npm run dev:client   # Portail entreprises/admin uniquement
npm run dev:mobile   # PWA chauffeurs uniquement
```

## Comptes de test

| Rôle       | Email                     | Mot de passe |
|------------|---------------------------|---------------|
| Admin      | admin@fret.local          | password      |
| Entreprise | entreprise1@fret.local    | password      |
| Chauffeur  | Connexion par OTP (téléphone `0633333333`, code affiché en debug côté API) |

## Fonctionnalités principales

**Portail Entreprises** : publication de missions avec calcul automatique du prix (distance × tarif du type de camion), suivi des offres reçues, acceptation/refus des chauffeurs.

**Panneau Admin** : KPIs de la plateforme (utilisateurs, missions, revenus), validation en un clic des dossiers chauffeurs (CIN, permis, camion).

**App PWA Chauffeurs** : connexion par OTP (simulation WhatsApp), upload des documents via l'appareil photo, recherche de missions filtrable par ville, soumission d'offre (accepter le prix ou négocier), historique des candidatures. Installable sur smartphone (icône sur l'écran d'accueil) grâce à `vite-plugin-pwa`.

## Support multilingue (Français / Arabe)

Les deux applications front (`frontend-client` et `mobile-pwa`) sont entièrement bilingues **Français / Arabe**, avec bascule RTL automatique pour l'arabe (`dir="rtl"` appliqué au `<html>`).

- Un sélecteur de langue (FR / العربية) est visible sur chaque écran.
- Les traductions sont centralisées dans `src/i18n/translations.js` de chaque app — facile à étendre ou à ajouter une 3ᵉ langue.
- La langue choisie est mémorisée dans le `localStorage` du navigateur.

## Notes de production

- Remplacer la simulation OTP (`AuthController::sendOtp`) par une intégration réelle WhatsApp Business API / Twilio.
- Les icônes PWA dans `mobile-pwa/public/icons/` sont des placeholders à remplacer par votre logo.
- Penser à configurer `FRONTEND_URLS` et `SANCTUM_STATEFUL_DOMAINS` dans `.env` pour la production (domaines réels au lieu de localhost).
