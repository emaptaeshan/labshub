// Labs Hub configuration. Safe to publish: the Supabase anon key is a public key; row-level security protects the data.
// Leave supabaseUrl empty to run in local mode (data stays in this browser).
window.LABS_CONFIG = {
  supabaseUrl: "",            // Supabase → Project Settings → API → Project URL, e.g. "https://abcdxyz.supabase.co"
  supabaseAnonKey: "",        // Supabase → Project Settings → API → anon public key
  aiEndpoint: "/api/ai",      // the Vercel function; the Gemini key lives in Vercel env vars, not here
  allowedEmailDomain: "emapta.com"
};
