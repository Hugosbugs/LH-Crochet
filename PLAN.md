# LH Crochet — MVP Build Plan

## Context

The creator currently has crochet projects scattered across Instagram with no central home. This builds a personal portfolio gallery website from scratch: a clean, visual grid of crochet projects with tag filtering, detail views, and pattern file downloads.

**Stack:**
- Framework: Next.js (App Router) + TypeScript
- Styling: Tailwind CSS v4
- Backend/Storage: Supabase (new project, full setup from scratch)
- Admin: Hidden `/admin` route, no auth for MVP
- Deployment: Vercel

---

## Phase 0: Prerequisites (manual, one-time)

- [ ] Create a new Supabase project at [supabase.com](https://supabase.com) → note project URL + API keys
- [ ] Ensure Node.js 20+ is installed (`node -v`)
- [ ] Have a Vercel account ready
- [ ] Have a GitHub repo ready for deployment

---

## Phase 1: Project Scaffolding

Scaffold directly in the existing working directory (in-place):

```bash
npx create-next-app@latest . \
  --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

Install additional dependencies:

```bash
npm install @supabase/supabase-js @supabase/ssr react-masonry-css lucide-react
```

### Final Directory Structure

```
src/
  app/
    layout.tsx                    ← root layout (font, header, global styles)
    page.tsx                      ← Gallery page (/)
    GalleryClient.tsx             ← Client component (owns tag filter state)
    globals.css                   ← Tailwind v4 @import + @theme tokens + masonry CSS
    project/[id]/page.tsx         ← Project detail page
    admin/
      page.tsx                    ← Hidden admin page (/admin)
      actions.ts                  ← Server Action: upload files + insert DB row
    api/projects/[id]/
      pattern-url/route.ts        ← Route Handler: returns signed URL for pattern download

  components/
    ui/
      Badge.tsx                   ← Tag pill (button when clickable, span otherwise)
      Button.tsx                  ← Reusable button (variant: primary | secondary | ghost)
      Spinner.tsx                 ← SVG spinner for upload loading state
    gallery/
      GalleryGrid.tsx             ← react-masonry-css wrapper
      ProjectCard.tsx             ← Card: image + name + tags, wrapped in Link
      TagFilter.tsx               ← Horizontal scrollable tag filter bar
    project/
      PatternDownload.tsx         ← Client component: fetches signed URL on click → triggers download
    admin/
      ProjectForm.tsx             ← Main admin form (client component, calls Server Action)
      ImageUploadField.tsx        ← File input + preview with URL.createObjectURL()
      PatternUploadField.tsx      ← File input + filename display

  lib/
    supabase/
      client.ts                   ← createBrowserClient (for client components)
      server.ts                   ← createServerClient with cookies (for server components)
    types.ts                      ← Project, ProjectWithUrls, ActionResult interfaces
    utils.ts                      ← getImageUrl, withImageUrls, formatDate, parseTags, extractAllTags
```

---

## Phase 2: Supabase Setup

### Database Schema

Run this in the Supabase Dashboard → SQL Editor:

```sql
create extension if not exists "pgcrypto";

create table public.projects (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  description  text,
  image_path   text not null,        -- e.g. "images/[uuid].[ext]"
  pattern_path text,                 -- e.g. "patterns/[uuid].[ext]" (nullable)
  tags         text[] not null default '{}',
  created_at   timestamptz not null default now()
);

create index projects_tags_idx on public.projects using gin(tags);
create index projects_created_at_idx on public.projects(created_at desc);

alter table public.projects enable row level security;

create policy "Public can read projects" on public.projects
  for select to anon using (true);

create policy "Service role can write projects" on public.projects
  for all to service_role using (true) with check (true);
```

> **Why `text[]` for tags?** No join needed, GIN-indexed for fast filtering, and client-side filtering is sufficient for MVP gallery size. A normalized tags table is a post-MVP concern.

### Storage Buckets

Create two buckets in Supabase Dashboard → Storage:

| Bucket | Public | Allowed MIME types | Size limit |
|---|---|---|---|
| `project-images` | **Yes** | `image/*` | 10 MB |
| `project-patterns` | **No** | `application/pdf` | 25 MB |

> Images are public so `next/image` can render them via CDN URL directly. Patterns are private — served via 60-second signed URLs, keeping the service key server-only and enabling future pay-gating.

Then add storage RLS policies in the SQL Editor:

```sql
create policy "Public image reads" on storage.objects
  for select to anon using (bucket_id = 'project-images');

create policy "Service role storage writes" on storage.objects
  for all to service_role using (true) with check (true);
```

---

## Phase 3: Environment & Config

### `.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # NEVER prefix with NEXT_PUBLIC_
```

### `next.config.ts`

Whitelist Supabase Storage domain for `next/image`:

```ts
images: {
  remotePatterns: [{
    protocol: 'https',
    hostname: '*.supabase.co',
    pathname: '/storage/v1/object/public/**',
  }]
}
```

---

## Phase 4: Build Order (bottom-up)

Build smallest/most reusable pieces first, pages last.

### Step 1 — `src/lib/types.ts`

```ts
export interface Project {
  id: string
  name: string
  description: string | null
  image_path: string
  pattern_path: string | null
  tags: string[]
  created_at: string
}
export interface ProjectWithUrls extends Project { image_url: string }
export interface ActionResult { success: boolean; error?: string; projectId?: string }
```

### Step 2 — `src/lib/utils.ts`

| Function | Purpose |
|---|---|
| `getImageUrl(path)` | Constructs public CDN URL from env var + path |
| `withImageUrls(projects[])` | Attaches resolved `image_url` to each project |
| `formatDate(iso)` | `"March 2024"` |
| `parseTags(str)` | Splits by comma, trims, lowercases, filters empty |
| `extractAllTags(projects[])` | Unique sorted tag array across all projects |

### Step 3 — Supabase Clients

- `src/lib/supabase/client.ts` → `createBrowserClient` with anon key
- `src/lib/supabase/server.ts` → `createServerClient` with Next.js `cookies()`

### Step 4 — UI Primitives

- **`Badge.tsx`** — renders as `<button>` when `onClick` is provided (tag filter), `<span>` otherwise
- **`Button.tsx`** — `variant` prop: `primary | secondary | ghost`
- **`Spinner.tsx`** — SVG spinner for upload in-progress state

### Step 5 — `src/app/globals.css`

```css
@import "tailwindcss";

@theme {
  --color-cream:    #faf7f2;
  --color-sage:     #8fa68e;
  --color-clay:     #c4785a;
  --color-charcoal: #2d2d2d;
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
}

/* Required by react-masonry-css */
.masonry-grid { display: flex; margin-left: -16px; width: auto; }
.masonry-grid-column { padding-left: 16px; background-clip: padding-box; }
.masonry-grid-column > div { margin-bottom: 16px; }
```

### Step 6 — Gallery Components

- **`ProjectCard.tsx`** — `next/image` + name + Badge tags, wrapped in `<Link href="/project/[id]">`. No fixed height — natural aspect ratio drives the masonry layout.
- **`TagFilter.tsx`** — Horizontal scrollable badge row. "All" is always first. Calls `onSelect(tag | null)`.
- **`GalleryGrid.tsx`** — `react-masonry-css` with responsive columns:

```ts
breakpointCols={{ default: 3, 1024: 3, 768: 2, 640: 1 }}
```

### Step 7 — Admin Components

- **`ImageUploadField.tsx`** — `accept="image/*"`, preview via `URL.createObjectURL()`
- **`PatternUploadField.tsx`** — `accept=".pdf"`, shows filename on selection
- **`ProjectForm.tsx`** — Client component; holds all form state; calls `createProject(formData)` Server Action on submit; shows success/error feedback

### Step 8 — Server Action: `src/app/admin/actions.ts`

```
'use server'

1. Validate: name required, image required
2. Upload image → project-images bucket → store path
3. If pattern provided → upload to project-patterns bucket → store path
4. Insert row into projects table
5. revalidatePath('/') → gallery updates immediately without rebuild
6. Return { success: true, projectId } or { success: false, error }
```

> Uses `createClient(url, SUPABASE_SERVICE_ROLE_KEY)` inline (not a shared module) to prevent accidental import into client components.

### Step 9 — Pattern Download Route Handler

**`src/app/api/projects/[id]/pattern-url/route.ts`**

```
GET:
1. Fetch project.pattern_path from DB (service role client)
2. createSignedUrl(pattern_path, 60 seconds expiry)
3. Return JSON { url: signedUrl }
```

**`PatternDownload.tsx`** (client component) — on button click, calls this route, then triggers download via `window.location.href = signedUrl`.

### Step 10 — Pages

| File | Type | Responsibility |
|---|---|---|
| `src/app/layout.tsx` | Server | Inter font, simple site header |
| `src/app/page.tsx` | Server | Fetch all projects (newest first), pass to GalleryClient |
| `src/app/GalleryClient.tsx` | Client | Owns `selectedTag` state, filters with `useMemo`, renders TagFilter + GalleryGrid |
| `src/app/project/[id]/page.tsx` | Server | Fetch single project, render image + name + date + tags + description + PatternDownload; calls `notFound()` if missing |
| `src/app/admin/page.tsx` | Server | Renders ProjectForm in centered `max-w-2xl` container |

---

## Phase 5: Deployment

- [ ] Push to GitHub
- [ ] Import repo at [vercel.com/new](https://vercel.com/new) → Next.js auto-detected
- [ ] Add all 3 environment variables in Vercel project settings
- [ ] Deploy → site is live at `.vercel.app` URL

---

## Verification Checklist

- [ ] `/admin` → create a project with image + pattern + tags → submit succeeds
- [ ] `/` → new project appears in gallery, sorted newest first
- [ ] Click a tag badge → gallery filters correctly; "All" resets filter
- [ ] Click a project card → detail page loads with all correct data
- [ ] Pattern download button → file downloads correctly
- [ ] Gallery is responsive: 1 col mobile, 2 col tablet, 3 col desktop
- [ ] No console errors (image domains, env vars, etc.)
- [ ] Deployed Vercel URL → all of the above works in production

---

## Critical Files Reference

| File | Why it matters |
|---|---|
| `src/app/admin/actions.ts` | Core business logic: validation, uploads, DB insert, cache revalidation |
| `src/lib/types.ts` | TypeScript interfaces depended on by every component — must be correct first |
| `src/lib/supabase/server.ts` | All server-side data fetching goes through this |
| `src/app/api/projects/[id]/pattern-url/route.ts` | Keeps service role key server-side; enables secure pattern downloads |
| `src/components/gallery/GalleryGrid.tsx` | Requires companion CSS in `globals.css` to render correctly |
