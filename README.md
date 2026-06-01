# photography

A Next.js (App Router) + Sanity prototype. Early scaffold — one page with a main cover component for now; we'll iterate.

## Stack

- Next.js 16 / React 19 (App Router, TypeScript)
- Sanity v5 (project `dt64fsks`, dataset `production`), Studio mounted at `/studio`
- SCSS (`sass`) — co-located component styles, partials under `app/styles`
- Swiper for the cover slideshow

## Getting started

```bash
npm install
npm run dev
```

- Site: http://localhost:3000
- Sanity Studio: http://localhost:3000/studio

Add a few **Imagini copertă** (cover images), a title and subtitle in the Studio
("Setări website" singleton), then reload the home page.

## Structure

- `app/page.tsx` — home page, renders `CoverSection`
- `app/components/components-server/cover-section.tsx` — server component, fetches cover data
- `app/components/swiper/swiper-cover.tsx` — client Swiper slideshow
- `sanity/` — client + GROQ queries
- `schemaTypes/` — Sanity schema (`general-info` singleton)

## Env

`.env.local` holds `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`.
The dataset is public, so reads need no token.
