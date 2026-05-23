# TODO — Connect Profile & Settings to MySQL (dashboard DB)

## Step 1: Backend schema/models updates
- [x] Update `backend/app/models/models.py` (expanded `User`; replaced `Setting` with per-user JSON fields)

## Step 2: Backend schemas updates
- [x] Update `backend/app/schemas/schemas.py` (new `ProfileUpdate`, `UserProfile`, `UserSettings`, etc.)

## Step 3: Backend routers updates
- [x] Replace `backend/app/routers/profile.py` (PUT /profile/me; POST /profile/change-password)
- [x] Replace `backend/app/routers/settings.py` (GET/PUT /settings/ per-user)

## Step 4: Frontend auth + API updates
- [x] Replace `src/services/api.js` to use backend URL and auto-attach JWT
- [x] Replace `src/context/AuthContext.jsx` to use JWT and load `/profile/me`
- [x] Update `src/pages/Login.jsx` to call real backend auth (login + register)

## Step 5: Frontend profile/settings updates
- [x] Replace `src/pages/Profile.jsx` to call backend for save + password change
- [x] Replace `src/pages/Settings.jsx` to call backend for toggles + account info

## Step 6: Protected routes
- [x] Replace `src/routes/AppRoutes.jsx` to guard pages behind auth
- [x] Update `src/App.jsx` to show Login while unauthenticated

## Step 7: DB migrations (required)
- [x] User ran the ALTER TABLE SQL in MySQL (dashboard DB)

## Step 8: Verification
- [x] Start backend (uvicorn) and confirm endpoints work
- [x] Register new user (if needed)
- [x] Login and verify:
  - [x] Profile fields persist after refresh
  - [x] Password update works
  - [x] Settings toggles persist after refresh
  - [x] Protected routes redirect to /login after logout
- [x] Run `npm run build` for frontend

