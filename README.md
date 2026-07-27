# Bot Demo · Chat & Feedback

Internal Phase 1 tool: a chat UI where testers talk to a **mocked** bot and leave
per-reply thumbs up/down feedback (with an optional comment). Everything is
stored centrally in Postgres so multiple testers can use the same shared link.

This is Phase 1 only — there is no real bot logic and no automatic
knowledge-base pipeline. See [Swapping in the real bot (Phase 2)](#swapping-in-the-real-bot-phase-2).

## Stack

- **Frontend:** React + Vite + Tailwind CSS (`client/`)
- **Backend:** Node.js + Express (`src/`), serves the API and the built frontend from a single process
- **Database:** PostgreSQL via Prisma (`prisma/schema.prisma`)
- **Deploy target:** Railway (one project: this app + a Postgres plugin)

## Project layout

```
prisma/                 Prisma schema + migrations
src/
  index.js              Express entrypoint (API + serves client/dist)
  routes/                chat.js, feedback.js, stats.js
  lib/
    botReply.js          <-- the ONE file to replace in Phase 2
    matchQuestion.js      keyword-overlap matcher used by botReply.js
    prisma.js             Prisma client singleton
  sample-qa.json         <-- edit this to change the mock bot's answers
client/                  React app (Vite)
  src/
    App.jsx, components/, api.js
```

## Local dev setup

Requires Node.js 18+ and a reachable Postgres instance.

1. Install dependencies:
   ```bash
   npm install
   npm install --prefix client
   ```
2. Copy the env file and point it at your Postgres:
   ```bash
   cp .env.example .env
   ```
   Edit `DATABASE_URL` in `.env` if your local Postgres isn't
   `postgres:postgres@localhost:5432`.
3. Apply the database schema:
   ```bash
   npx prisma migrate deploy
   ```
   (If you ever change `prisma/schema.prisma` yourself, use
   `npx prisma migrate dev --name <change>` instead, so a new migration file
   is generated and committed.)
4. Run the backend and frontend in two terminals:
   ```bash
   npm run dev:server   # Express on http://localhost:3000
   npm run dev:client   # Vite dev server on http://localhost:5173 (proxies /api to :3000)
   ```
5. Open http://localhost:5173.

> **Note on this repo's initial migration:** `prisma/migrations/20260727120000_init`
> was authored by hand (mirroring `prisma/schema.prisma` exactly) because the
> environment this repo was generated in didn't have Node.js installed to run
> `prisma migrate dev`. It's still a normal, valid Prisma migration — nothing
> extra to do — but if you'd rather have Prisma generate it fresh, delete that
> migration folder and run `npx prisma migrate dev --name init` once against
> an empty database.

## Editing the mock bot's answers (`src/sample-qa.json`)

The mocked bot matches incoming messages against `src/sample-qa.json` using a
simple keyword-overlap check (see `src/lib/matchQuestion.js`) — no code
changes needed to update its answers.

```json
[
  { "question": "What are your shipping times?", "answer": "Standard shipping takes 3-5 business days." },
  { "question": "Do you offer refunds?", "answer": "Yes, within 30 days of purchase with proof of purchase." }
]
```

- Add, remove, or edit entries freely — it's a flat JSON array of `{ question, answer }` pairs.
- Matches are prefixed with `(sample answer for testing)` so testers know it's a placeholder.
- If nothing matches closely enough, the bot replies:
  *"No sample answer configured yet for this question — real bot logic comes in Phase 2."*
- Changes take effect on the next message — just restart the server (no rebuild needed, since it's read from disk at request time).

## Swapping in the real bot (Phase 2)

All mock logic lives in **`src/lib/botReply.js`**, behind one function:

```js
async function getBotReply(conversationId, userMessage) { ... }
```

To go live in Phase 2, replace the body of this function (e.g. call your real
bot/LLM API instead of matching `sample-qa.json`) and keep the same signature
and return type (a string). Nothing in `src/routes/chat.js`, the API contract,
or the frontend needs to change.

## Deploying to Railway

1. **Create a Railway project** and push this repo to it (via GitHub or `railway up` from the CLI).
2. **Add a Postgres plugin** to the same project (Railway dashboard → *New* → *Database* → *Add PostgreSQL*).
3. **Add this repo as a service** in the same project, and set its environment variables:
   - `DATABASE_URL` → reference the Postgres plugin's connection string, e.g. `${{Postgres.DATABASE_URL}}`
   - Leave `PORT` unset — Railway injects its own and the app reads `process.env.PORT`.
4. **Build & start commands** (Railway auto-detects Node via Nixpacks and uses the `package.json` scripts, so these are already wired up):
   - Build command: `npm run build` (installs + builds the client, runs `prisma generate`)
   - Start command: `npm start` (runs `prisma migrate deploy` to apply any committed migrations, then starts the server)
5. **Deploy.** Railway will give you a public URL like `https://your-app.up.railway.app` — **that URL is the shareable link for testers.** No other hosting is needed; the same Express process serves the API and the built frontend.

## Iframe embed (optional, for later)

If you ever want to surface this inside another site:

```html
<iframe src="https://YOUR-RAILWAY-URL" width="100%" height="800" style="border:none;"></iframe>
```

## Out of scope for Phase 1

Real bot/LLM logic, automatic knowledge-base updates from feedback, user
authentication, HubSpot integration, and analytics dashboards beyond the
simple footer counters.
