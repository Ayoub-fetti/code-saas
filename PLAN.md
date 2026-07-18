# Plan: Implementation of Marketplace Features

## Phase 1: Authentication & Notification System
- **Mail Setup:** Ensure `MAIL_` config in `.env` is correct. Implement `MustVerifyEmail` trait in `User` model for Company users.
- **Verification Flow (Company):**
  - Registration controller: `event(new Registered($user))` to trigger email notification.
  - Custom redirect after registration to `/waiting-verification`.
  - Email verification link handler: redirect to `HOME` after successful verification.
- **Verification Flow (Driver):**
  - Registration controller: save phone number, generate OTP, send via SMS, redirect to `/verify-otp`.
  - OTP Verification controller: check code, mark user verified, redirect to PWA dashboard.

## Phase 2: Security & Business Rules
- **Profile Completion (Driver):** Create a middleware `CheckDriverProfile` that checks if `CIN`, `license`, and `truck_photo` exist in `Driver` profile.
- **Availability Toggle:** 
  - Migration: `ALTER TABLE drivers ADD COLUMN is_available BOOLEAN DEFAULT true;`
  - Controller: Add endpoint `/api/driver/availability/toggle` to switch status.
- **Policy Enforcement:** Create `BidPolicy` to enforce that driver can only bid if `is_verified` is true and profile is 100% complete.

## Phase 3: Mission Management & Candidate View
- **CRUD Operations:** Implement `update` and `destroy` in `MissionController`.
- **Candidate View:** Add `candidate_profile` endpoint to return driver details and document validation status. Create React modal in the company portal.

## Phase 4: Monetization & Trial Period
- **Trial Period Management:**
  - `CheckTrialPeriod` middleware: verify `created_at` of `Company` vs current date.
  - If expired, return 403.
  - React: Redirect to `/payment-required`.
- **Admin Configuration:** Add settings model/table to store `trial_days`.

## Phase 5: Notifications
- **Backend:** Use standard `Illuminate\Notifications\DatabaseNotification`.
- **API:** Add `/api/notifications` (GET, PATCH {id}/mark-as-read).
- **Frontend:** React `NotificationPanel` component (polling every 30s or on page load).
- **Email Bridge:** Implement `toMail()` and `toDatabase()` in notification classes.

## Phase 6: Public Pages
- Create `About`, `Contact` components.
- Add routes in React Router.
- Enhance `HomePage` with specific registration links.
