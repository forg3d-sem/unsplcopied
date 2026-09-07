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
| Icons | `lucide-react` |
| Search form | `react-hook-form` |
| Linting | ESLint (`eslint-config-next`) |

Deliberately **not** included: state management libraries, CSS frameworks, data-fetching/caching libraries (React Query, SWR), UI component libraries, masonry libraries. See [ADR-0001](#adr-0001-minimal-dependency-footprint).

---

## Getting started

```bash
npm install
```

Create a `.env.local` file with an Unsplash API access key ([apply here](https://unsplash.com/developers)):

```
UNSPLASH_ACCESS_KEY=your_access_key_here
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
  layout.tsx, error.tsx, not-found.tsx, loading.tsx

components/
  Frame/                     Shared max-width container
  Header/                    Site header
  SearchInput/                Search form (client component)
  UserData/                  Reusable photographer avatar + name
  MasonryDisplayComponents/  Everything the feed pages compose:
    MasonryGrid/, PhotoCard/, Pagination/, ViewToggle/, Skeleton/, Empty/
  PhotoPageComponents/       Everything the photo detail page composes:
    PhotoDisplay/, PhotoAbout/, Tags/, Skeleton/

lib/unsplash/                Typed API access layer
  client.ts                  unsplash-js client instance
  getPhotos.ts / searchPhotos.ts / getPhotoById.ts
  handleFetchResponse.ts     Centralized error → Next.js error-boundary mapping
  types.ts                   Types derived from fetch function return values

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

The **only** client component in the app is `SearchInput`, because its input-clearing button needs live input state. Pagination, the column-count toggle, and the entire photo grid are plain Server Components — navigation is done via `<Link>` with rewritten `searchParams`, not `onClick` handlers or client-side routing state.

**Consequences:** Zero hydration cost for the feed, search results, and photo pages. Every page is fully readable with JavaScript disabled. The cost is that any future interactive feature (e.g. optimistic save/unsave for collections, see ADR-0008) will need to introduce client components deliberately at that boundary, not before.

---

### ADR-0003: Native CSS masonry layout
**Status:** Accepted

**Context:** A true "shortest-column-next" masonry (the kind Unsplash itself uses) requires either knowing image dimensions ahead of layout and packing them with JavaScript, or a library like `react-photo-album` that does this client-side.

**Decision:** The masonry grid is built with the CSS `columns` property (`components/MasonryDisplayComponents/MasonryGrid`), driven by a `--columns` CSS custom property that the column-count toggle changes via URL state. No JavaScript computes the layout.

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
**Status:** Proposed

**Context:** `handleFetchResponse` currently trusts the shape of successful API responses; if Unsplash changes a field, the failure would surface downstream as a runtime error in a component rather than at the fetch boundary.

**Decision (proposed):** Introduce Zod schemas for the photo/detail response shapes, validated with `safeParse` and a `console.error` fallback (rather than a hard throw) so a schema mismatch degrades gracefully instead of crashing the page.

**Status note:** Not yet implemented. Prioritized behind core feature completeness.

---

### ADR-0010: Authentication and saved collections (bonus scope)
**Status:** Proposed

**Context:** The assignment lists user registration and saving photos to a profile collection as optional bonus features.

**Decision (proposed):** Add these within the same Next.js app rather than a separate service:
- **Auth.js** with the Credentials provider for registration/login
- **bcryptjs** for password hashing
- **PostgreSQL via Supabase** as the persistence layer
- Server Actions (with `useOptimistic` for the save/unsave interaction) so the save button is the only new client-interactive surface this introduces, consistent with ADR-0002's server-first default

**Status note:** Not started. This ADR will be updated to "Accepted" with implementation notes once the feature lands, or marked "Rejected" with a reason if time runs out before it's built.

---

## Known limitations

- **Masonry ordering:** see ADR-0003 — items fill column-first rather than shortest-column-next, so visual order down the page is column-major, not a strict top-to-bottom reading order.

## License / attribution

Photos are served live from the Unsplash API and remain the property of their respective photographers, under Unsplash's license terms. This repository contains no photo assets of its own. This project is a non-commercial coding exercise.
