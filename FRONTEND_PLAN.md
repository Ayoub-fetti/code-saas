# Frontend Adaptation Plan

## 1. Routing Integration (`frontend-client/src/App.jsx`)
- Add public routes: `/`, `/about`, `/contact`.
- Update registration routes: `/register-company`, `/register-driver`.
- Add protected routes with state-based redirect: `/waiting-verification`, `/payment-required`.

## 2. Component Integration
- **Notification Bell:** Create `frontend-client/src/components/NotificationBell.jsx` (fetch notifications from `/api/notifications`, display dropdown/modal).
- **Payment Page:** Create `frontend-client/src/Pages/company/PaymentRequired.jsx`.
- **Waiting Verification:** Connect the existing `WaitingVerification.jsx` in the flow.

## 3. Auth & Guard Logic
- **`AuthProvider` / `ProtectedRoute`:**
  - Update to check `user.email_verified_at` (redirect to `/waiting-verification` if null).
  - Update to check subscription status (redirect to `/payment-required` if trial expired).

## 4. API Integration
- Update `src/api/axios.js` interceptors if needed to handle `403 TRIAL_EXPIRED`.
- Add helper methods in `AuthContext` to trigger state refresh (e.g., check verified status).
