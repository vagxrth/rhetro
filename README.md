# Project Name
Rhetro: AI Podcast Application


## Introduction
A cutting-edge AI podcast application that simplifies content creation. It converts text into high-quality speech and generates eye-catching thumbnails using advanced AI models. Perfect for both seasoned podcasters and beginners, Rhetro streamlines the production process, letting you focus on delivering engaging content.


## Tech Stack
- Next.js 14 (App Router)
- TailwindCSS
- Shadcn UI
- Google TTS
- Gemini
- Clerk
- Convex
- Sentry
- Databuddy (analytics)


## Features
- Convert your written content into high-quality, natural-sounding speech, making podcast production faster and more efficient.
- Generate visually appealing and professional-looking thumbnails for your podcast with the help of advanced AI models, ensuring your podcast stands out.


## Video


https://github.com/vagxrth/rhetro/assets/83217083/6589899b-a85f-4fc4-be19-c2f559473f05


## Architecture

Rhetro is split between a Next.js frontend and a Convex backend-as-a-service. There is no custom server — all server-side logic runs as Convex functions (queries, mutations, actions, HTTP routes).

```
Browser ──► Next.js (App Router)                   ──► Convex (DB + Storage + Actions) ──► Google APIs (TTS / Gemini)
                  │                                          ▲
                  │                                          │
                  └── Clerk (auth + hosted UI) ──► svix webhook ──► Convex /clerk
```

**Frontend** — [`app/`](app)
- Route groups: `(auth)` for `/signin`, `/signup`; `(root)` for the authenticated shell (`create`, `discover`, `podcasts`, `profile`).
- [`middleware.ts`](middleware.ts) protects every non-public route via Clerk.
- Root layout wires up [`ConvexClerkProvider`](providers/ConvexClerkProvider.tsx) (Convex client authenticated with Clerk JWTs), `AudioProvider`, and Databuddy analytics.

**Backend** — [`convex/`](convex)
- [`schema.ts`](convex/schema.ts) — `podcasts` (with search indexes on author, title, description) and `users` tables.
- [`podcasts.ts`](convex/podcasts.ts), [`users.ts`](convex/users.ts) — CRUD, search, view counting, top-creator queries.
- [`files.ts`](convex/files.ts) — issues pre-signed upload URLs for Convex Storage (audio + thumbnail blobs).
- [`googleTTS.ts`](convex/googleTTS.ts) — Convex action calling Google Cloud TTS for MP3 synthesis.
- [`gemini.ts`](convex/gemini.ts) — Convex action calling Gemini `gemini-3-pro-image-preview` for thumbnails.
- [`http.ts`](convex/http.ts) — `POST /clerk` HTTP route that verifies svix signatures and mirrors Clerk `user.created/updated/deleted` events into the `users` table.
- [`auth.config.ts`](convex/auth.config.ts) — trusts the Clerk JWT issuer so `ctx.auth.getUserIdentity()` works inside queries/mutations.

**Observability** — Sentry is wired through [`next.config.mjs`](next.config.mjs) (`withSentryConfig`) plus `sentry.{client,server,edge}.config.ts` and [`instrumentation.ts`](instrumentation.ts).


## Deployment

| Component       | Hosted on                          |
| --------------- | ---------------------------------- |
| Next.js app     | Vercel                             |
| Convex backend  | Convex Cloud                       |
| Auth            | Clerk (hosted)                     |
| File storage    | Convex Storage                     |
| AI inference    | Google Generative Language API     |
| Error tracking  | Sentry                             |
| Analytics       | Databuddy                          |

Pushing to `main` deploys the Next.js app to Vercel. The Convex backend is deployed separately with `npx convex deploy` (typically wired into the same CI step).


## Local Development

Two processes need to run side-by-side: the Next.js dev server and the Convex dev server.

```bash
npm install
npx convex dev   # in one terminal — pushes convex/ to your dev deployment, regenerates _generated/
npm run dev      # in another terminal — starts Next.js on http://localhost:3000
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable                          | Source                                                                 |
| --------------------------------- | ---------------------------------------------------------------------- |
| `CONVEX_DEPLOYMENT`               | Set automatically by `npx convex dev` (CLI-only, used to push code)    |
| `NEXT_PUBLIC_CONVEX_URL`          | Convex deployment URL — used by the browser to open the WebSocket      |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`| Clerk dashboard                                                       |
| `CLERK_SECRET_KEY`                | Clerk dashboard                                                        |
| `CLERK_WEBHOOK_SECRET`            | Clerk webhook endpoint pointing at `<convex-url>/clerk`                |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL`   | `/signin`                                                              |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL`   | `/signup`                                                              |

Convex actions also need `GOOGLE_GENERATIVE_AI_API_KEY` — set this in the **Convex dashboard** (Environment Variables), not in `.env.local`, since the actions execute on the Convex backend, not in Next.js.
