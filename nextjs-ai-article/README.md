# Next.js AI Article Generator

## What you get
- Next.js app with a simple, attractive UI (Tailwind).
- API route at `/api/generate` that calls OpenAI (server-side).
- Safe pattern: put your API key in `.env.local` (do NOT hardcode).

## Setup and run
1. Extract the zip.
2. In project root run:
   ```
   npm install
   ```
3. Create `.env.local` with:
   ```
   OPENAI_API_KEY=sk-...
   ```
4. Start dev server:
   ```
   npm run dev
   ```
5. Open http://localhost:3000

## Notes
- Do **not** share your API key publicly.
- If your key was exposed, revoke/regenerate it from OpenAI dashboard.
