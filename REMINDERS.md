# Daily reminders: email and Teams

Every weekday at 08:30 IST (03:00 UTC, set in vercel.json) Vercel calls /api/remind. It reads the shared Hub from
Supabase, builds one message per person (overdue, due today, approvals, waiting on others, later this week) and posts
each to a Power Automate flow. The flow sends it as an Outlook email and as a Teams chat from the Workflows bot.
People with nothing due get nothing.

## 1. The flow (10 minutes, standard licence, no premium)
1. Teams → Apps → Workflows → Create → "When a Teams webhook request is received". Who can trigger: Anyone. Copy the URL.
2. Add action: Office 365 Outlook → Send an email (V2)
   - To: @{triggerBody()?['to']}
   - Subject: @{triggerBody()?['subject']}
   - Body: @{triggerBody()?['html']}   (switch the body to code view)
3. Add action: Microsoft Teams → Post card in a chat or channel
   - Post as: Flow bot · Post in: Chat with Flow bot
   - Recipient: @{triggerBody()?['to']}
   - Adaptive Card: @{triggerBody()?['attachments'][0]['content']}
4. Save.

## 2. Vercel environment variables
REMIND_FLOW_URL = the flow URL · SUPABASE_URL · SUPABASE_SERVICE_ROLE_KEY (Supabase → Settings → API → service_role; server only, never in config.js) ·
CRON_SECRET = any long random string (Vercel sends it automatically to cron calls) · HUB_URL = your Hub address. Redeploy.

## 3. Test
- Preview without sending: https://YOUR-HUB/api/remind?preview=1&key=YOUR_CRON_SECRET
- Send now: Vercel → Settings → Cron Jobs → /api/remind → Run.
- Each person needs an email on Work → People in the Hub.
