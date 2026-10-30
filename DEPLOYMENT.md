# Deployment checklist

## GitHub

The source of truth is the `main` branch of `surya1729-prog/PGTests`. Keep `.env` local; only `.env.example` belongs in Git.

## Supabase

1. Open the SQL Editor for project `lbvbxjwsruhxczybgakr`.
2. Run `supabase/migrations/001_initial_schema.sql` once.
3. Run `supabase/migrations/002_storage_and_auth.sql` once.
4. Create an account through the app, then promote it to admin from a trusted SQL session:

```sql
update public.profiles
set role = 'admin'
where email = 'your-admin-email@example.com';
```

The second migration creates the private `papers` bucket, restricts files to PDFs up to 50 MB, creates the auth profile trigger, and applies student/admin Storage policies.

## Vercel

Import the GitHub repository and deploy the `main` branch. The repository already contains `vercel.json`, which runs `npm run build:web`, serves `dist`, and provides SPA fallback routing.

Add these Vercel environment variables for Preview and Production:

```text
EXPO_PUBLIC_SUPABASE_URL=https://lbvbxjwsruhxczybgakr.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<the anon public key from Supabase API settings>
```

After saving variables, redeploy the latest commit. The Vercel project dashboard URL is not the public app URL; use the deployment's **Visit** URL.

## Android via Capacitor

```powershell
npm install
npm run cap:apk
```

The debug APK is written to `android/app/build/outputs/apk/debug/app-debug.apk`. Java/JDK and Android SDK must be installed first.