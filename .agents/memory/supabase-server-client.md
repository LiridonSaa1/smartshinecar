---
name: Supabase client in server
description: How to safely use @supabase/supabase-js in the Node.js API server
---

## Rule
Never call `createClient()` at module initialization time on the server. Use a lazy getter.

**Why:** `createClient` throws `supabaseUrl is required` if the env var is empty. This crashes the server on startup even if storage is never used.

**How to apply:**
```ts
// lib/supabase.ts
let _client: SupabaseClient | null = null;
export function getSupabaseClient(): SupabaseClient | null {
  if (_client) return _client;
  const url = process.env.VITE_SUPABASE_URL || "";
  const key = process.env.VITE_SUPABASE_ANON_KEY || "";
  if (!url || !key) return null;
  _client = createClient(url, key);
  return _client;
}
```

## Note on env var names
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (with the VITE_ prefix) ARE available to Node.js server processes in Replit. The VITE_ prefix only additionally exposes them to the browser in Vite builds.

## Supabase Storage bucket setup
For image uploads to work, the `uploads` bucket must exist in Supabase Storage with public access. The anon key cannot create buckets (requires service role). Options:
1. Add `SUPABASE_SERVICE_ROLE_KEY` as a secret → use it in getSupabaseClient for storage operations
2. User manually creates `uploads` bucket in Supabase dashboard (Storage → New bucket → public: true)
   Then add RLS policy: allow all users to INSERT into `uploads` bucket
