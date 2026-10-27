# Emapta AI Labs · Delivery

The engagement platform: intake → kickoff → pre-discovery → discovery → findings → options → build → results, with stakeholders, sessions, data requests, email drafts, weekly updates and leadership views.

## Files
| File | What it is | Edit it to… |
|---|---|---|
| `index.html` | the page shell | rarely |
| `app.js` | all the application logic and the seed data | change screens, phases, task templates, email wording, seed engagements |
| `assets/styles.css` | the design | change colours, spacing, layout |
| `assets/logo.png` | the logo | |
| `config.js` | Supabase settings | connect the shared database |
| `sync.js` | sign-in and shared data (only runs when config.js is filled) | rarely |
| `api/ai.js` | Gemini call (server-side key) | switch AI provider |
| `api/remind.js` | weekday reminders by email and Teams | change what the reminder contains |
| `supabase.sql` | database tables and policies | run once in Supabase |
| `vercel.json` | clean URLs, cron schedule | change the reminder time |
| `REMINDERS.md` | how to set up the Power Automate flow | |

## Where things live in app.js
- `PHASES` — the eight phases, each with its gate question, task template (`[title, owner, days from kickoff, priority]`) and the emails it uses
- `STAKE_ROLES` — the stakeholder map roles
- `seed()` — the engagements that load on a fresh install (replace with your own, or leave empty once the database is live)
- `draft(kind, e, p)` — the email templates, in the house style
- `home()`, `engsList()`, `engPage()` and the `t*` tab functions — the screens
- `updatesPage()` — the weekly update view and deck download
- `leadership()`, `downloadReport()` — the leadership view and report

## Run locally
Open `index.html` in a browser. No build step.

## Deploy
Push to GitHub → Vercel → Import → Framework "Other" → Deploy. Then follow `REMINDERS.md` and the Supabase steps below.

## Shared database (Supabase)
1. supabase.com → New project (Sydney) → SQL editor → run `supabase.sql`.
2. Project Settings → API → copy Project URL and anon key into `config.js`. Commit.
3. Authentication → Providers: Email magic links work immediately; add Azure when the Entra app is ready.
4. Sign in once; the seed becomes the shared copy. Team emails are set on the Team page.

## AI
Vercel → Settings → Environment Variables → `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`). Redeploy.

## Bumping the seed
`KEY` in `app.js` names the local-storage slot. Change it (for example `labs-delivery-v4`) to force every browser to reload the seed. Not needed once the shared database is live.
