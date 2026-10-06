# Labs Hub on Vercel: database and AI

## What is here
- index.html   the Hub (single file)
- raise.html   the public intake form at /raise
- config.js    Supabase settings (edit this one file)
- api/ai.js    Vercel function that calls Gemini with a server-side key
- supabase.sql tables and policies, run once in Supabase
- vercel.json  clean URLs

## Step 1: deploy (10 minutes)
1. Put these files in a GitHub repository (labs-hub). Vercel → Add New → Project → import it. Framework: Other. Deploy.
2. Open the URL. The Hub runs in local mode until config.js is filled in.

## Step 2: database with Supabase (20 minutes)
1. supabase.com → New project. Region: Sydney (AU). Save the database password.
2. SQL editor → paste supabase.sql → Run.
3. Authentication → Providers → Azure: enable, paste the Entra app's Client ID and Secret, and register the redirect URL Supabase shows in Entra.
   (Email magic links also work out of the box if you want to start without Entra.)
4. Project Settings → API: copy the Project URL and the anon public key into config.js. Commit. Vercel redeploys.
5. Open the Hub: you are asked to sign in. The first signed-in user's data becomes the shared copy; everyone then sees the same Hub and changes appear live.
6. /raise now writes to the requests table; new requests are pulled into the Hub the next time a signed-in user opens it, and leads are notified.

## Step 3: AI with Gemini (10 minutes)
1. aistudio.google.com → Get API key (free tier). If a key has ever been pasted in a chat or email, create a new one and delete the old one.
2. Vercel → Project → Settings → Environment Variables → GEMINI_API_KEY = the key (all environments). Optional: GEMINI_MODEL = gemini-flash-latest. Redeploy.
3. The assistant now answers in natural language about the projects and tasks, and turns pasted notes into suggested tasks. Without the key it falls back to the built-in rules.

## Notes
- Hobby plan is for non-commercial use; move to Pro when the team uses it for real.
- Client transcripts sent to the assistant go to Google. For a client that needs AU-only processing, point api/ai.js at Azure OpenAI (Australia East) or Anthropic instead; the Hub does not change.
- To reset the shared data, delete the row in the hub table.
