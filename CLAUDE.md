# Stitchmark — Claude Project Memory

## Project Overview

Personal crochet portfolio site for a single creator, with a roadmap toward e-commerce and a community platform. Currently building Phase 1 (MVP).

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 (uses `@import "tailwindcss"` syntax — NOT `@tailwind` directives) |
| Backend / DB / Storage | Supabase (`@supabase/supabase-js` + `@supabase/ssr`) |
| Icons | lucide-react |
| Gallery layout | react-masonry-css |
| Deployment | Vercel |

## Directory Structure

```
src/
  app/
    layout.tsx                        ← Root layout (Inter font, global styles)
    page.tsx                          ← Landing / hero page (/)
    globals.css                       ← Tailwind v4 @import + @theme tokens + masonry CSS
    explore/                          ← Gallery browse page (/explore)
    project/[id]/page.tsx             ← Project detail page
    admin/
      page.tsx                        ← Hidden admin panel (/admin), no auth in MVP
      actions.ts                      ← Server Actions: file uploads + DB insert
    api/projects/[id]/
      pattern-url/route.ts            ← Route Handler: returns signed URL for pattern download

  components/
    nav/                              ← TopNav component
    ui/                               ← Badge, Button, Spinner
    gallery/                          ← GalleryGrid, ProjectCard, TagFilter
    project/                          ← PatternDownload (client component)
    admin/                            ← ProjectForm, ImageUploadField, PatternUploadField

  lib/
    supabase/
      client.ts                       ← createBrowserClient (client components)
      server.ts                       ← createServerClient with cookies (server components)
    types.ts                          ← Project, ProjectWithUrls, ActionResult interfaces
    utils.ts                          ← getImageUrl, withImageUrls, formatDate, parseTags, extractAllTags
```

## Design Tokens (globals.css)

```css
--color-cream:    #ffffff
--color-surface:  #f1f0ed   ← page backgrounds
--color-sage:     #8fa68e
--color-clay:     #c4785a
--color-charcoal: #2d2d2d
--font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif
```

Design style: minimal, clean, elegant, feminine creator-portfolio aesthetic. Calm, uncluttered UI.

## Database Schema

```sql
create table public.projects (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  description  text,
  image_path   text not null,     -- "images/[uuid].[ext]"
  pattern_path text,              -- "patterns/[uuid].[ext]" (nullable)
  tags         text[] not null default '{}',
  created_at   timestamptz not null default now()
);
```

Tags stored as `text[]` with GIN index — no normalized tags table for MVP.

## Supabase Storage Buckets

| Bucket | Public | Purpose |
|---|---|---|
| `project-images` | Yes | Project photos, served via CDN URL |
| `project-patterns` | No | PDF patterns, served via 60s signed URLs |

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL        ← public, safe for client
NEXT_PUBLIC_SUPABASE_ANON_KEY   ← public, safe for client
SUPABASE_SERVICE_ROLE_KEY       ← NEVER prefix with NEXT_PUBLIC_, server-only
```

## Key Conventions

- **Server vs client Supabase clients:** Use `lib/supabase/server.ts` for all server components and Route Handlers. Use `lib/supabase/client.ts` only in client components. The service role key is only ever used inline in `admin/actions.ts` and route handlers — never in a shared importable module.
- **Server Actions (`'use server'`):** All file uploads and DB mutations go through `src/app/admin/actions.ts`. Call `revalidatePath('/')` after mutations so the gallery updates instantly.
- **Pattern downloads:** Always served via signed URLs from the Route Handler (`api/projects/[id]/pattern-url/route.ts`). Never expose the pattern bucket directly. The `PatternDownload` client component fetches the signed URL on click, then triggers download via `window.location.href`.
- **Images:** Use `next/image` with the Supabase CDN URL (public bucket). The `next.config.ts` remotePatterns whitelist must include `*.supabase.co`.
- **Masonry layout:** `react-masonry-css` requires companion CSS in `globals.css`. Cards have no fixed height — natural image aspect ratio drives layout.
- **Tag filtering:** Done client-side in `GalleryClient.tsx` with `useMemo`. Tags are stored as `text[]` in Postgres.
- **Admin:** Hidden `/admin` route, no authentication for MVP. Authentication is a Phase 2 concern.
- **TypeScript:** Strict mode. No `any`. Shared interfaces live in `src/lib/types.ts`.
- **Import alias:** `@/*` maps to `src/*`.

## Routing

| Route | Purpose |
|---|---|
| `/` | Hero / landing page |
| `/explore` | Gallery browse with tag filtering |
| `/project/[id]` | Project detail with pattern download |
| `/admin` | Create/manage projects (no auth, MVP) |
| `/api/projects/[id]/pattern-url` | Returns signed download URL |

## Phase Roadmap

- **Phase 1 (current):** Personal portfolio — gallery, project CRUD, tag filtering, pattern downloads
- **Phase 2:** Creator commerce — Stripe checkout, paid pattern downloads, inventory, creator auth
- **Phase 3:** Community platform — public accounts, creator profiles, follows, likes, saves, discovery feed
