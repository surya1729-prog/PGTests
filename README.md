# MedArchive

Native React Native application for organizing medical postgraduate previous-year papers. The current client is built with Expo and TypeScript and is designed to use Supabase for authentication, metadata, favourites, and PDF storage.

## Architecture

- `App.tsx`: responsive student browsing shell and navigation state
- `lib/supabase.ts`: environment-gated Supabase client
- `supabase/migrations`: PostgreSQL schema, indexes, and RLS policies
- Expo: Android and iOS packaging from the same React Native codebase

The next feature slices should split the current shell into `screens/`, `components/`, and `services/` as authentication, paper queries, PDF viewing, and the admin workflow are connected.

## Local setup

1. Copy `.env.example` to `.env` and set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
2. Create a Supabase project and run `supabase/migrations/001_initial_schema.sql` in the SQL editor.
3. Configure a private `papers` storage bucket and add storage policies that mirror the admin/public database policies.
4. Install dependencies with `npm install`.
5. Start Expo with `npm start`.

Never place a Supabase service-role key in the app. Promote an account to admin by updating its `profiles.role` from a trusted SQL session.

## Android commands

```bash
npx expo install
npx expo start
npx expo run:android
```

For a production Android build, install EAS CLI, run `eas build:configure`, then `eas build --platform android --profile production`. Android Studio is optional for local native builds and debugging; Expo Go is sufficient for the first development pass.

## Supabase data model

The migration creates `profiles`, `exams`, `exam_years`, `papers`, and `favorites`, with unique constraints, search indexes, public read policies for published content, and admin-only mutation policies. No paper metadata or download URL is invented by the client when Supabase is not configured.
