# Unsplcopied

A small photo-gallery application built as a technical test assignment, replicating the core browsing experience of [Unsplash](https://unsplash.com) — masonry feed, search, tag browsing, and individual photo pages — on top of the public Unsplash API.

> **This project is a coding exercise and is not affiliated with or endorsed by Unsplash.** It is not intended for commercial use, deployment at scale, or any purpose beyond demonstrating implementation approach. All photo content, photographer attribution, and API access are governed by [Unsplash's API guidelines](https://unsplash.com/documentation) and the license each photo is published under.

Live demo: [unsplcopied.vercel.app](https://unsplcopied.vercel.app)

---

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, Server Components) |
| Language | TypeScript (strict mode) |
| Styling | SCSS Modules |
| API client | `unsplash-js` v8 |
| Auth | Auth.js v5 (`next-auth@5.0.0-beta.32`), Credentials provider, JWT session strategy |
| Database | PostgreSQL via Supabase, accessed with the raw `pg` driver (no ORM) |
| Password hashing | `bcryptjs` (10 salt rounds) |
| Validation | Zod (auth input only — see ADR-0009) |
| Icons | `lucide-react` |
| Search form | `react-hook-form` |
| Linting | ESLint (`eslint-config-next`) |

Deliberately **not** included: state management libraries, CSS frameworks, data-fetching/caching libraries (React Query, SWR), UI component libraries, masonry libraries, an ORM (Prisma or similar — see ADR-0010). See [ADR-0001](#adr-0001-minimal-dependency-footprint).

---

## Getting started

```bash
npm install
```

Create a `.env.local` file with an Unsplash API access key ([apply here](https://unsplash.com/developers)) and the database/auth secrets:

```
UNSPLASH_ACCESS_KEY=your_access_key_here
DATABASE_URL=your_supabase_postgres_connection_string
AUTH_SECRET=your_auth_secret
```

Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
app/                        Route segments (App Router)
  page.tsx                  Home feed
  search/                   Search results
  photo/[id]/                Individual photo page
  profile/                  Saved photos (protected — page-level auth guard)
  login/, register/          Auth forms
  layout.tsx, error.tsx, not-found.tsx, loading.tsx

actions/                    Server Action controller layer (hard boundary — see ADR-0011)
  auth.ts                    registerUser, isUniqueViolation
  collection.ts               toggleSave, removePhoto, getCollectionPhotos
  user.ts                     getUserData

components/
  Frame/                     Shared max-width container
  Header/                    Site header
  SearchInput/                Search form (client component)
  UserData/                  Reusable photographer avatar + name
  MasonryDisplayComponents/  Everything the feed pages compose:
    MasonryGrid/, PhotoCard/, Pagination/, ViewToggle/, Skeleton/, Empty/, CollectionToggle/
  PhotoPageComponents/       Everything the photo detail page composes:
    PhotoDisplay/, PhotoAbout/, Tags/, Skeleton/
  ProfileCollection/         Saved-photos list with optimistic removal

lib/unsplash/                Typed API access layer
  client.ts                  unsplash-js client instance
  getPhotos.ts / searchPhotos.ts / getPhotoById.ts
  handleFetchResponse.ts     Centralized error → Next.js error-boundary mapping
  types.ts                   Types derived from fetch function return values

lib/db/                     Raw `pg` data-access layer
  db.ts                      Shared Pool instance
  collection.ts               Insert/remove/select queries for saved photos

lib/zod/                    Zod schemas
  authSchema.ts               registrationSchema, credentialsSchema

next-auth.d.ts              Module augmentation — adds `id` to Session/User/JWT

utility/                     Cross-cutting types and env access
styles/                      Global SCSS: reset, design tokens, shared animations
```

### Component organization

Components are grouped by **which page/feature consumes them**, not by abstraction level (this is *not* strict Atomic Design — there's no `atoms/molecules/organisms` hierarchy). `MasonryDisplayComponents` and `PhotoPageComponents` each bundle the pieces specific to one route, while a small set of genuinely cross-cutting pieces (`Frame`, `Header`, `UserData`) live at the top level and are reused across routes — e.g. `UserData` (avatar + name) appears identically in both the feed's `PhotoCard` and the photo detail page.

The goal is reuse where reuse is real, without forcing every component into an artificial atom/molecule tier it doesn't need.

---

## Architecture decisions

### ADR-0001: Minimal dependency footprint
**Status:** Accepted

**Context:** It's easy to reach for a library for every sub-problem (masonry layout, form state, data fetching/caching, animation) in a project like this.

**Decision:** Default to native Next.js and browser platform features. Every added dependency had to justify itself against "can this be done with what's already here." As a result, there is no client-side data-fetching library, no CSS framework, no UI kit, and no masonry library — layout, caching, and navigation state are handled with CSS, native `fetch()`, and URL search params respectively.

**Consequences:** Smaller bundle, fewer upgrade/security surfaces, and every piece of behavior is inspectable without reading a third-party library's internals. The trade-off is writing slightly more plumbing by hand (e.g. the masonry grid, see ADR-0003) instead of importing a solved version.

---

### ADR-0002: Server-first architecture
**Status:** Accepted

**Context:** Most of this app's content (photos, search results, photo details) is public, cacheable, and doesn't need client-side interactivity to render.

**Decision:** Every route is a Server Component by default. Data fetching happens in the route itself via `async` page components calling the `lib/unsplash` functions directly — no client-side fetching, no loading spinners driven by `useEffect`. `next: { revalidate }` is passed on every fetch call, so responses are cached and revalidated by Next.js's built-in data cache rather than a client-side cache library.

The **only** client components in the public part of the app are `SearchInput` (its input-clearing button needs live input state) and `CollectionToggle` (the save/unsave button, see ADR-0012), introduced deliberately at that boundary once the bonus save feature required it. Pagination, the column-count toggle, and the photo grid itself remain plain Server Components — navigation is done via `<Link>` with rewritten `searchParams`, not `onClick` handlers or client-side routing state.

**Consequences:** Zero hydration cost for the feed, search results, and photo pages beyond the two deliberate client islands above. Every page is fully readable with JavaScript disabled except for saving/unsaving a photo.

---

### ADR-0003: Native CSS masonry layout
**Status:** Accepted

**Context:** A true "shortest-column-next" masonry (the kind Unsplash itself uses) requires either knowing image dimensions ahead of layout and packing them with JavaScript, or a library like `react-photo-album` that does this client-side.

**Decision:** The masonry grid is built with the CSS `columns` property (`components/MasonryDisplayComponents/MasonryGrid`), driven by a `--columns` CSS custom property that the column-count toggle changes via URL state. No JavaScript computes the layout. `react-photo-album` was evaluated and dropped specifically because it would have forced the whole feed into a Client Component just to use `ResizeObserver`.

**Consequences:** The feed renders with zero client-side JavaScript and no layout-shift-inducing measurement pass. The known trade-off: CSS `columns` fills column-first (top-to-bottom, then wraps to the next column) rather than placing each new item in the currently-shortest column. Visually this means item order down the page isn't guaranteed to match strict "reading order" the way a JS-packed masonry would. This was a conscious choice — the zero-JS, zero-dependency property was weighted higher than pixel-perfect packing order for this project's scope.

---

### ADR-0004: URL as the single source of truth
**Status:** Accepted

**Context:** State like current page, search query, and column count needs to persist across navigation and ideally be shareable.

**Decision:** `page`, `query`, and `columns` are all read directly from `searchParams` in the route component — there is no client-side state (`useState`, context, or a state library) mirroring them. Every control that changes one of these (`Pagination`, `ViewToggle`, `SearchInput`) constructs a new URL and navigates to it via `<Link>` or `router.push`.

**Consequences:** Any view — a specific search query, on page 3, in 5-column mode — is a plain URL that can be copied, bookmarked, refreshed, or sent to someone else and reproduces exactly what the sender was looking at. It also means there's no state synchronization bug class to worry about (URL and UI can't drift apart, because the UI is a pure function of the URL).

---

### ADR-0005: `unsplash-js` as the API client
**Status:** Accepted

**Context:** Consuming the Unsplash API needs to be type-safe and needs to play well with Next.js's fetch-based caching (`next: { revalidate }`), which only works if the underlying HTTP call is the native `fetch()`.

**Decision:** Use the official `unsplash-js` v8 package. As of v8, `createApi()` no longer returns a hand-rolled wrapper — it returns an [`openapi-fetch`](https://openapi-ts.dev/openapi-fetch/) client generated from Unsplash's own OpenAPI schema, built on native `fetch()`. This gives fully typed requests and responses (`unsplash.GET('/photos/{assetSlug}', { params: {...} })`) without needing to pull in Unsplash's OpenAPI spec and wire up `openapi-fetch` manually.

**Consequences:** Type safety at the API boundary comes "for free" from the official package, `next: { revalidate }` works as expected since it's plain `fetch()` under the hood, and there's one fewer dependency (no separate `openapi-typescript` codegen step) than doing this by hand. All response typing elsewhere in the app (`Photo`, `DetailedPhoto`, `Tag`) is derived from these functions' return types rather than hand-written, so the types can't drift from what the client actually returns.

---

### ADR-0006: Centralized fetch error handling
**Status:** Accepted

**Context:** Every route needs to distinguish "not found" from "rate limited" from "something else broke," and Next.js's `notFound()` needs to be called *before* any subsequent `throw`, due to how it uses thrown-error digests internally to trigger the `not-found.tsx` boundary.

**Decision:** `lib/unsplash/handleFetchResponse.ts` is the single place this branching happens: HTTP 404 → `notFound()`, HTTP 403 → a rate-limit error, anything else → the API's own error message. It is not abstracted further into page-level wrappers, since doing so was found to interfere with Next.js's routing/interception mechanics — it stays as a plain function called at the point of use.

**Consequences:** Every route gets consistent 404/error behavior without repeating the branching logic, and each route segment (`app/photo/[id]`, `app/search`) has its own `error.tsx`/`not-found.tsx`/`loading.tsx` so failures are scoped and don't take down unrelated parts of the app.

---

### ADR-0007: Responsive, containerized layout
**Status:** Accepted

**Context:** The app needs to work from small phones up to wide desktop viewports, matching Unsplash's own layout behavior at each size.

**Decision:** All page content is wrapped in a shared `Frame` component that caps content width and centers it, rather than letting the layout stretch edge-to-edge on large screens. Breakpoints are set at 767px (mobile) and 1119px (tablet/desktop threshold) — below 1119px, layout controls collapse to a bottom-anchored pagination bar and the column toggle hides (since there's only room for one sensible column count); below 767px, the masonry collapses to a single column and horizontal padding is introduced for touch-sized margins.

**Consequences:** A single, consistent breakpoint scheme is reused across every component rather than each component inventing its own — `Frame`, `Header`, `PhotoMasonry`, `PhotoCard`, and the global page controls all key off the same two thresholds.

---

### ADR-0008: UI direction — Unsplash-referenced
**Status:** Accepted

**Context:** The assignment is explicitly to replicate Unsplash's browsing experience.

**Decision:** Visual design (typography scale, spacing, hover overlays on photo cards, the search bar treatment, the minimal chrome around photos) intentionally mirrors Unsplash's own site rather than introducing an original design language. This is a deliberate choice given the assignment's goal — not a claim of original design work.

---

### ADR-0009: Zod validation at the API boundary
**Status:** Rejected

**Context:** Zod is already a dependency (`zod ^4.5.4`) and already validates **auth input** (`lib/zod/authSchema.ts` → `registrationSchema`, `credentialsSchema`). `handleFetchResponse.ts`, however, still trusts the shape of a successful Unsplash response without runtime validation.

**Decision:** Explicitly not extending Zod to the Unsplash response boundary. Given the fixed time budget for this assignment, the marginal robustness (catching an Unsplash API schema change at the fetch boundary instead of further downstream) isn't worth the schema-writing and maintenance cost here — TypeScript's compile-time typing from `unsplash-js` is judged sufficient for this project's scope.

**Consequences:** If Unsplash changes a response shape, the failure surfaces as a runtime error somewhere downstream (a component reading an unexpected `undefined`) rather than a clean, typed validation error at the fetch boundary. Acceptable given the API is stable and this isn't a production service with uncontrolled uptime requirements.

---

### ADR-0010: Authentication and saved collections (bonus scope)
**Status:** Accepted — implemented

**Context:** The assignment lists user registration and saving photos to a profile collection as optional bonus features.

**Decision (as built):**
- **Auth.js v5** (`next-auth@5.0.0-beta.32`), Credentials provider, **JWT session strategy**, no database adapter.
- **No middleware.** The only protected route (`/profile`) guards itself with a page-level `const session = await auth(); if (!session?.user.id) redirect('/login')` call, rather than a global `middleware.ts`.
- **`pg` raw driver** (`lib/db/db.ts`, a single shared `Pool`), not Prisma or another ORM.
- **bcryptjs** for hashing, `10` salt rounds.
- Duplicate email is caught by a Postgres `UNIQUE` constraint on `users.email` and detected in the action layer via Postgres error code `23505` (`actions/auth.ts::isUniqueViolation`), rather than a pre-check query — avoids a TOCTOU race between check and insert.
- **`next-auth.d.ts`** module augmentation adds `id` to `Session["user"]`, threaded through `authorize()` → `jwt` callback (`token.id = user.id`) → `session` callback (`session.user.id = token.id`).

**Consequences:** The JWT-staleness trade-off known to this strategy still applies in principle — a mutated user field wouldn't refresh in the token without a re-login or explicit `trigger: 'update'` handling in the `jwt` callback, which isn't implemented. In practice this currently has no visible effect since only `id`/`email`/`name` are stored in the token and none of those are user-editable yet.

---

### ADR-0011: Actions layer as a hard boundary
**Status:** Accepted — implemented

**Context:** With a real database and auth in the picture, pages and client components need a consistent, safe way to reach server-side data — without every route reimplementing session checks, error handling, and query calls inline.

**Decision:** All data access is routed through a top-level `actions/` directory (`actions/auth.ts`, `actions/collection.ts`, `actions/user.ts`) that sits between routes/components and `lib/db/*`. Every action:
1. Re-checks `auth()` itself (session is never trusted to have been checked upstream),
2. Returns a consistent `{ success: true; data } | { success: false; error }` shape,
3. Catches and logs the underlying error, translating it into a user-safe message.

Pages and client components never import from `lib/db/*` directly — only from `actions/*`.

**Consequences:**
- (+) One place to see every server-side entry point and its auth requirement.
- (+) Consistent error handling — no route forgets to catch a DB error.
- (+) `lib/db/*` stays a pure data-access layer with no auth or error-shaping logic mixed in, so it's independently testable.
- (–) One extra layer of indirection/boilerplate per operation (e.g. `removePhoto` in `actions/collection.ts` is a thin wrapper over `removeFromCollection` in `lib/db/collection.ts`), accepted as the cost of the boundary being genuinely unconditional rather than "usually" respected.

---

### ADR-0012: Save-button state design
**Status:** Accepted — implemented, and resolved differently in two places on purpose

**Context:** Should the save/unsave action return the full updated collection, or just the affected record? The profile page and the feed/detail pages have genuinely different needs, so each is given the shape it actually needs rather than forcing one shared contract.

**Decision:**
- **`/profile` (`ProfileCollection.tsx`):** owns the *whole list*. Uses React 19 `useOptimistic(initialPhotos, optimisticRemove)` with a local reducer that filters the array client-side. The corresponding action, `removePhoto(id)`, returns only `{ success, error }` — **no data** — because the client already knows the resulting state and doesn't need it echoed back.
- **Feed cards / photo detail (`CollectionToggle.tsx`):** owns *one boolean* — is this specific photo saved or not. Local `useState(initialValue)` + `useTransition`, toggled optimistically and rolled back on failure. The corresponding action, `toggleSave(isSaved, imageData)`, returns `SimplifiedPhoto | null` — just the one affected record (or `null` on removal) — never the full collection.

**Consequences:**
- (+) Each component fetches/returns exactly the shape it consumes; no over-fetching the full collection just to flip one card's icon.
- (+) `CollectionToggle` is reusable across the feed *and* the photo detail page because its contract (`Photo | DetailedPhoto` in, one boolean out) doesn't care which list, if any, the caller is rendering.
- (–) Two different local-state patterns (`useOptimistic` over an array vs. `useState` over a boolean) exist for what is conceptually "the same" save interaction, so a future reader has to understand both. Justified here because the two components genuinely have different data-ownership shapes, not just cosmetic differences.

---

### ADR-0013: Denormalized photo snapshot on save
**Status:** Accepted — implemented

**Context:** When a user saves a photo, the app needs to render it later on `/profile` — including the masonry layout, which needs `width`/`height` upfront (per ADR-0003).

**Decision:** The `images` table stores a **snapshot** of the photo's Unsplash data at save time — `url`, `width`, `height`, `description`, `author_name`, `author_avatar` — keyed by `unsplash_id`, rather than storing only `unsplash_id` and re-fetching each field from the Unsplash API on every `/profile` load.

**Consequences:**
- (+) `/profile` renders entirely from Postgres — no Unsplash API calls (and no Unsplash rate-limit exposure) just to show a user's own saved list.
- (+) Masonry layout works immediately since `width`/`height` are already columns on the row, consistent with ADR-0003's CSS-columns approach.
- (–) The snapshot can drift from the live Unsplash record — if a photographer renames their profile, edits the description, or the photo is deleted upstream, `/profile` keeps showing the stale snapshot indefinitely. No refresh/reconciliation mechanism exists yet (see Known limitations).

---

### ADR-0014: Two independently-maintained validation layers on auth forms
**Status:** Accepted — implemented, flagged for awareness rather than as a clear win

**Context:** `RegisterForm`/`LoginForm` use `react-hook-form`'s own validation rules (`required`, `pattern`, `minLength`) for instant client-side feedback. Separately, `registerUser` (the server action) validates the same input again with a Zod schema (`registrationSchema`), which is the actual source of truth, and maps any Zod `fieldErrors` back onto the same form fields via `setError`.

**Decision:** Keep both layers, rather than deriving the client-side rules from the Zod schema (e.g. via `@hookform/resolvers/zod`).

**Consequences:**
- (+) No extra resolver dependency; `react-hook-form`'s native rules are enough for instant UX feedback.
- (+) Server-side Zod validation is authoritative regardless of what the client sends, so this is not a security gap — just a maintenance one.
- (–) The two rule sets can drift (e.g. password minimum length would need to be updated in two places). If auth validation grows more complex, revisit `@hookform/resolvers/zod` to share one schema.

---

### ADR-0015: Download tracking and attribution
**Status:** Rejected — out of scope

**Context:** Unsplash's API guidelines require, for apps that let users trigger a download, (a) a call to `GET /photos/:id/download` to register the tracked download event, and (b) attribution links (photographer + Unsplash, with `utm_source`) on download. `PhotoAbout.tsx` currently only *displays* the `downloads` count Unsplash's normal photo response already includes — it never calls the download-tracking endpoint.

**Decision:** No download feature is being built in this project, so the tracking/attribution requirement that's conditional on having one doesn't apply. Explicitly out of scope rather than deferred.

**Consequences:** The app stays fully compliant with Unsplash's API guidelines simply by not offering the feature the guideline is about — displaying the existing `downloads` count is read-only use of already-public data and isn't itself an attribution-triggering action.

---

### ADR-0016: Automated testing
**Status:** Rejected — out of scope

**Context:** The original plan included Vitest (units), Playwright (e2e on critical flows), and a GitHub Actions CI workflow. None were built.

**Decision:** Not building a test suite or CI pipeline for this assignment, given the fixed time budget — time is better spent on the core browsing/auth/collections feature set and documenting the architectural reasoning (this ADR log) than on test scaffolding for a project that won't be maintained past the review.

**Consequences:** No automated regression safety net; correctness relies on manual verification and the reviewer's own read-through.

---

## Known limitations

- **Masonry ordering (ADR-0003):** items fill column-first rather than shortest-column-next, so visual order down the page is column-major, not a strict top-to-bottom reading order.
- **No API-response validation (ADR-0009):** Zod was consciously not extended past auth input to the Unsplash response boundary; a schema change on Unsplash's side would surface as a downstream runtime error rather than a clean validation error.
- **No download tracking or attribution flow (ADR-0015):** the app does not implement the download-triggering endpoint or attribution links, since no download feature was built.
- **No automated tests or CI (ADR-0016):** correctness relies on manual verification only.
- **Saved-photo snapshots can go stale (ADR-0013):** `/profile` renders from a denormalized snapshot taken at save time, with no reconciliation against the live Unsplash record.
- **JWT session staleness (ADR-0010):** custom session fields would need explicit `trigger: 'update'` handling to refresh without a re-login; not currently needed since nothing stored in the token is user-editable yet.

All of the above were considered and consciously left out or accepted as trade-offs given this project's fixed time budget — they're scoping decisions, not oversights.

## License / attribution

Photos are served live from the Unsplash API and remain the property of their respective photographers, under Unsplash's license terms. This repository contains no photo assets of its own. This project is a non-commercial coding exercise.
