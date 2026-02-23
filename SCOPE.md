# L&H Crochet — Product Scope

## Vision

A platform for crochet creators — starting as a personal portfolio with a path to becoming a community-driven space where crochet enthusiasts discover, share, and connect around their craft.

---

## Phase 1: MVP — Personal Portfolio Site

**Goal:** Give the creator a single, owned home for their crochet work. Replace scattered Instagram posts with a clean, browsable gallery they fully control.

### Core Features

**Gallery**
- Masonry/grid layout of all projects, newest first
- Filter projects by tag/category
- Responsive across mobile, tablet, desktop

**Project Entries**
- Create, edit, delete projects (CRUD)
- Each project: name, image, tags, description, optional pattern file
- Dates auto-generated

**Project Detail View**
- Full image display
- Project metadata (name, date, tags, description)
- Downloadable pattern file (if uploaded)
- CTA to purchase / inquire (link or contact prompt — not a full checkout)

**Admin Panel**
- Hidden `/admin` route (no login for MVP)
- Form to add new projects
- Ability to edit or delete existing entries

### What's Explicitly Out of Scope for MVP
- User accounts or authentication
- Payment processing or checkout
- Social features (likes, comments, follows)
- Multi-user support
- Public profile pages

### Stack
- **Frontend:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Backend / DB / Storage:** Supabase
- **Deployment:** Vercel

---

## Phase 2: Creator Commerce

**Goal:** Let the creator monetize their work directly from the portfolio — selling finished items and pattern files without leaving the platform.

### New Features

**Purchase Flow**
- "Buy Now" CTA on project detail pages links to a real checkout
- Integration with a payment provider (Stripe or equivalent)
- Sold/available status on listings

**Pattern Marketplace**
- Pattern files available for purchase (paid download)
- Free vs. paid pattern distinction
- Secure, gated download after purchase

**Order Management (Admin)**
- View incoming orders
- Mark items as sold/shipped
- Basic inventory tracking (available quantity)

**Creator Auth**
- Secure login for the site owner to access the admin panel
- Session-based auth (no public accounts yet)

---

## Phase 3: Multi-User Platform — Pinterest for Crochet Enthusiasts

**Goal:** Open the platform to other creators and crochet lovers. Shift from a single creator's portfolio to a community where people discover, save, and share crochet work.

### New Features

**User Accounts**
- Public registration for visitors and creators
- Profile pages: bio, avatar, links, project portfolio
- Role distinction: viewer vs. creator

**Creator Profiles**
- Each creator gets their own gallery/portfolio page
- Projects attributed to their profile
- Follows — users can follow creators

**Social Interaction**
- Likes on projects
- Saves / bookmarked collections ("boards")
- Comments on projects
- Share to external platforms

**Discovery & Feed**
- Personalized feed based on follows and saved tags
- Explore/trending page
- Tag-based discovery across all creators

**Platform Admin**
- Moderation tools for flagging/removing content
- Creator verification or approval flow (optional)
- Analytics dashboard (views, engagement, downloads)

---

## Scaling Considerations

| Concern | MVP Approach | Multi-User Approach |
|---|---|---|
| Auth | None (hidden route) | Supabase Auth (email/OAuth) |
| Storage | Single shared bucket | Per-user scoped paths + RLS policies |
| Database | Single `projects` table | Users, profiles, follows, likes, saves tables |
| Admin | One hardcoded `/admin` page | Role-based access control |
| Payments | CTA link (external) | Integrated Stripe checkout + webhooks |
| Content moderation | N/A | Report system + admin review queue |
| Performance | Static ISR pages | Paginated feeds, caching, CDN optimization |

---

## Summary Roadmap

```
Phase 1 — MVP (now)
  Personal portfolio
  CRUD projects
  Tag filtering + gallery
  CTA to purchase
  Pattern file downloads

Phase 2 — Commerce
  Real checkout + payments
  Paid pattern downloads
  Inventory management
  Creator auth

Phase 3 — Community Platform
  Public user accounts
  Creator profiles + follows
  Likes, saves, comments
  Discovery feed
  Platform moderation
```
