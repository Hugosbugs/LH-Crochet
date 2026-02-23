# Product Requirements Document — LH Crochet

---

## 1. Context

**Product Name:** LH Crochet

**Product Type:** Personal portfolio website + visual project gallery (with a roadmap toward e-commerce).

**Problem Being Solved:**

Crochet projects are currently scattered across social platforms (primarily Instagram), where older work becomes buried, there is no structured inventory system, and the creator has limited control over presentation and organization.

**Solution:**

A centralized web application that gives the creator a permanent, organized gallery of projects with a clean browsing experience — and a foundation for future monetization.

**Users:**

- **Primary:** The site owner (creator managing and curating projects)
- **Secondary:** Visitors browsing crochet work and potential future customers

---

## 2. Objective

Deliver a functional MVP that allows the creator to create project entries, upload images and pattern files, assign tags, and automatically display projects in a visual gallery.

**Out of Scope (MVP):**

- Payments or checkout
- E-commerce product listings
- User accounts or authentication
- Comments or social interaction
- Complex admin dashboards
- Multi-user support

**Definition of Done:**

- Projects can be created and stored in the database
- Images and pattern files upload successfully
- Projects appear automatically in the gallery
- Users can filter and browse by tag
- Clicking a project opens a detailed view
- The site is deployable and accessible online

---

## 3. Core Features

### Project Creation

Each project entry includes:

- Project Name *(required)*
- Image Upload *(required)*
- Pattern File Upload *(stored internally, not as external links)*
- Tags / Categories
- Description *(optional)*
- Date Created *(auto-generated)*

### Project Organization

- Tag-based categorization
- Filterable gallery views
- Default sort: newest first

### Gallery View

- Visual grid / masonry layout (Pinterest-style)
- Filter by tags
- Clean, scannable browsing experience

### Project Detail View

On clicking a project card, users see:

- Large project image
- Project name
- Tags / categories
- Description (if provided)
- Downloadable pattern file

### File Handling

- Images and pattern files stored within the system (Supabase Storage)
- Pattern files directly uploadable — no external links
- Visitors can download pattern files from the detail view

---

## 4. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript |
| Styling | Tailwind CSS |
| Backend / DB / Storage | Supabase |
| Deployment | Vercel (or equivalent) |

> If a better option exists for the use case, the developer may recommend alternatives while maintaining similar simplicity and scalability.

---

## 5. UX/UI Behavior

**Design Style:** Minimal, clean, elegant, modern creator-portfolio feminine aesthetic.

**Primary Layout:** Pinterest-style masonry or grid gallery — focused on visual scanning.

**User Flows:**

1. Visitor lands on gallery → sees a grid of project images → filters by tag (optional) → clicks a card → views project detail + downloads pattern
2. Creator opens app → creates a new project entry → uploads image + pattern file → assigns tags → project appears in gallery automatically

**UX Goals:**

- Fast visual scanning
- Effortless navigation
- Calm, uncluttered interface
- No unnecessary UI friction

> Inspiration reference link to be provided separately.

---

## 6. Output Requirements

**Deliverable:** A deployed, publicly accessible web application.

**Acceptance Criteria:**

- [ ] Project creation form saves data to Supabase database
- [ ] Image uploads store correctly in Supabase Storage and render in gallery
- [ ] Pattern file uploads store correctly and are downloadable from detail view
- [ ] Gallery displays all projects in a responsive grid, sorted newest first
- [ ] Tag filter correctly narrows displayed projects
- [ ] Project detail view renders all fields correctly
- [ ] Site is live and accessible via a public URL

**Post-MVP Vision:**

E-commerce functionality, product purchasing, inventory tracking, customer accounts, admin tools, and a pattern marketplace.

---
