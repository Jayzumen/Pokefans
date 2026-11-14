# Pokéfans: Improvement Plan & Style Guide 2.0

> Audit date: 2026-11-14 · Stack at time of audit: Next.js 15.4.10 (App Router), React 19.1, Tailwind CSS 4, shadcn/ui, Firebase 11, PokeAPI.
>
> This document has four parts:
> 1. **Critical fixes**: bugs and security issues to fix before anything else.
> 2. **Performance plan**: how to make every page fast.
> 3. **Security plan**: how to make auth and data access safe.
> 4. **Style Guide 2.0**: a full design system and a page-by-page redesign.
>
> Each item has a priority: **P0** = broken or unsafe, fix now · **P1** = high impact · **P2** = polish.

---

## 0. TL;DR

- The hero background is **broken**. `.gradient-bg` wraps OKLCH variables in `hsl()`, which makes the value invalid. The white hero text then sits on a plain background.
- **Login is unsafe and unreliable.** The client downloads the *entire* `Users` collection. An `async` `forEach` causes a race condition. Errors are swallowed, so a wrong password still shows "Welcome back".
- **Team data is keyed by username, not by user ID (uid).** If Firestore rules don't check this, any signed-in user can overwrite anyone's team.
- **The data fetching is a waterfall of hundreds of requests.** The home page makes 12 requests one after another. The Pokédex page makes 18 sequential requests plus a 10,500-item list. Generation, type and move pages fetch every Pokémon one by one, often 100 to 700 requests per page.
- **Only half of the site has been redesigned.** Home, Pokédex and Login use the new shadcn look. Moves, Abilities, Types, Generations, Pokémon detail and Teams still use the old style: underlined `h1`s, `bg-slate-700`, hard-coded `text-white` and `text-black`, and doubled top padding.
- The client bundle is heavier than it needs to be: Firebase loads on every page, there are 2 chart libraries, 2 toast libraries and 2 icon libraries, and image optimization is turned off.

---

## 1. Critical fixes (P0)

| # | Issue | Where | Fix |
|---|-------|-------|-----|
| 1.1 | `hsl(var(--primary))` used on OKLCH tokens, so the gradient is invalid and the hero renders without a background | `src/app/globals.css` `.gradient-bg` | Use `var(--primary)` directly, or better, the new hero spec in §4.8 |
| 1.2 | The utility classes `bg-grid-white/[0.02] bg-grid-16` don't exist in Tailwind 4, so they render nothing | `HeroSection.tsx` | Remove them, or define a `bg-grid` utility (see §4.6) |
| 1.3 | `Math.floor(Math.random() * 1008)` can return `0`, which makes the API return a 404 and crashes on `data.species` | `app/page.tsx`, `moves/page.tsx`, `abilities/page.tsx` | Use `1 + Math.floor(Math.random() * MAX)`, set MAX to 1025, and check `res.ok` |
| 1.4 | No `res.ok` checks and no `notFound()`, so a bad ID or a PokeAPI hiccup produces a 500 page | All server fetchers | Add a central `pokeapi()` helper (§2.1) and call `notFound()` on 404 |
| 1.5 | `abilities/Loading.tsx` and `abilities/[id]/Loading.tsx` use an uppercase L. Next only recognizes `loading.tsx`, so on Linux (Vercel) these files are ignored | `src/app/abilities/**` | Rename them to `loading.tsx` |
| 1.6 | `params` is read synchronously. In Next 15+ it is a `Promise` | All `[id]`, `[gen]`, `[name]` pages | `({ params }: { params: Promise<{ id: string }> })` → `const { id } = await params` |
| 1.7 | Login: `querySnapshot.forEach(async …)` returns before sign-in finishes, so `foundUsername` is still `false` and a **sign-up** also runs | `LoginForm.tsx` | Split the flow into separate Sign in and Sign up actions (§3.2) |
| 1.8 | `signInUser` and `signUpUser` catch errors and `console.log` them, so the UI shows success after a failure | `lib/auth.ts` | Re-throw errors and map Firebase error codes to friendly messages |
| 1.9 | Legacy pages add `pt-32` on top of the layout's `pt-16`, leaving about 192px of empty space | moves, abilities, types, pokemon, teams, generations | Remove the per-page top padding and use the shared `<PageShell>` (§4.7) |
| 1.10 | `GenerationLayout` hard-codes `text-white` and `RandomPokemon`/Teams hard-code `text-black`, so text disappears in one of the two themes | several | Use semantic tokens only (`text-foreground` etc.) |
| 1.11 | `Navbar` registers a new `onAuthStateChanged` listener on every route change and never unsubscribes | `Navbar.tsx` + `lib/auth.ts` | Keep a single `AuthProvider` with one subscription that cleans up |
| 1.12 | The heart button on `PokemonCard` does nothing | `PokemonCard.tsx` | Connect it to "Add to team", or remove it |

---

## 2. Performance plan

### 2.1 Data layer: one typed, cached fetcher (P0)

Create `src/lib/pokeapi.ts`:

```ts
import "server-only";
import { notFound } from "next/navigation";

const BASE = "https://pokeapi.co/api/v2";
const DAY = 60 * 60 * 24;

export async function pokeapi<T>(path: string, revalidate = DAY * 7): Promise<T> {
  const res = await fetch(`${BASE}/${path}`, { next: { revalidate, tags: ["pokeapi"] } });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`PokeAPI ${res.status} for ${path}`);
  return res.json() as Promise<T>;
}

/** Run async jobs with a concurrency cap: polite to PokeAPI and still fast. */
export async function mapLimit<T, R>(items: T[], limit: number, fn: (t: T) => Promise<R>) {
  const out: R[] = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) { const idx = i++; out[idx] = await fn(items[idx]); }
    }),
  );
  return out;
}
```

- PokeAPI data almost never changes, so cache it for **days, not 30 seconds**. The current setting is `revalidate: 30`, and most fetches have no cache setting at all.
- Replace every `for (…) await fetch()` loop with `Promise.all` or `mapLimit`. The home page drops from 12 sequential round-trips to 2 parallel batches.

### 2.2 Stop fetching full Pokémon objects for lists (P0, biggest win)

Generation, type and move pages currently fetch `/pokemon/{id}` for **every** list item; a type page means about 100 to 400 requests. Lists only need the **ID, name, types and sprite**:

- The **sprite URL can be built from the ID**: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png`.
- The **ID can be read from the resource URL** (`…/pokemon/25/` → `25`).
- For types, use **one** GraphQL query against PokeAPI's GraphQL endpoint (`https://beta.pokeapi.co/graphql/v1beta`), or generate a static `pokemon-index.json` at build time with a script: `{ id, name, types[], gen }[]`, about 60 KB gzipped for all 1,025 Pokémon. **Recommended:** the build-time index. It is fast, works offline and runs zero requests per page.

With the index in place:
- **Generations:** filter the index, so the page needs 0 network requests.
- **Pokédex search:** filter the index instantly on the client. Today, a search for "a" fires about 2,000 requests.
- **Type → Pokémon:** filter the index.
- **Move → learners:** use the names from `learned_by_pokemon` and look up the index.

### 2.3 Rendering strategy (P1)

- Prerender all detail pages, or use ISR with `dynamicParams = true`. `generateStaticParams` currently fetches `limit=1`, which is pointless. Either generate the top N pages (Gen 1 to 9 starters, popular Pokémon) or return `[]` and rely on ISR.
- Make "random featured Pokémon" a deterministic **Pokémon of the day** (seeded by date). The page stays static and cacheable, and the featured set changes daily.
- Once on Next 16, turn on **`cacheComponents` / `"use cache"`**. Then the shell can be static while the auth avatar is the only dynamic part.
- Add `loading.tsx` **skeletons** that match the final layout (no pokéball spinner on a blank page) so layout shift stays at 0.

### 2.4 Images (P1)

- Remove `images.unoptimized: true`. Set `formats: ["image/avif", "image/webp"]` and give every grid image an accurate `sizes` (e.g. `sizes="(min-width:1024px) 20vw, 45vw"`).
- Lock `remotePatterns` to `pathname: "/PokeAPI/sprites/**"`.
- Use `priority` / `fetchPriority="high"` **only** on the LCP image (detail hero artwork, first featured card).
- Inline the 18 type SVGs as a React icon component (or an SVG sprite) instead of loading 18 separate `<Image>` files.

### 2.5 JavaScript bundle (P1)

| Remove / replace | Why | Saves (approx., minified + gzipped) |
|---|---|---|
| Firebase in `Navbar` on every page | Firestore and Auth are pulled into the root layout's client bundle | ~100 KB on every route. Lazy-load them with `import()` inside an `AuthProvider`, or move auth to a server session cookie |
| `chart.js` + `react-chartjs-2` | A radar chart is a poor fit for 6 stats. Use CSS stat bars (§4.10) | ~70 KB |
| `recharts` + `ui/chart.tsx` | Never used | — |
| `react-toastify` | Keep **sonner**, which is already installed and themed | ~15 KB + CSS |
| `react-icons` | Keep **lucide-react** only, and make the small brand icons inline SVG | tree-shake noise |
| Unused shadcn components (`sidebar`, `menubar`, `chart`, `hover-card`, `tabs`, `toggle`, `accordion` if unused) | Dead code | — |
| `encoding`, `@types/*` and `typescript` in `dependencies` | Move to `devDependencies` or remove | install size |

- **Fonts:** Poppins currently ships **7 static weights**. Switch to a single **variable** font file (§4.3).
- Remove `container`, `space-x-*` and other leftover patterns. Use `gap-*` with flex or grid.
- Keep **one lockfile**: delete either `package-lock.json` or `pnpm-lock.yaml`.

### 2.6 Performance budgets (enforce in CI)

| Metric | Target |
|---|---|
| LCP (4G, mid-range phone) | < 1.8 s |
| INP | < 150 ms |
| CLS | < 0.02 |
| First-load JS per route | < 120 KB gzipped |
| Server requests to PokeAPI per page render (uncached) | ≤ 5 |

Run Lighthouse CI or `@next/bundle-analyzer` on each PR.

---

## 3. Security plan

### 3.1 Firestore data model and rules (P0)

The current model is `Users/{uid}` plus `Teams/{username}/pokemonTeam/{pokemonName}`. Teams are keyed by a **username the client chooses**, and the login page reads the whole `Users` collection. This exposes every user and allows team overwrites unless the security rules are strict.

**New model:**

```
users/{uid}              { username, createdAt }        // private profile
usernames/{usernameLower} { uid }                        // uniqueness index
teams/{uid}              { username, updatedAt, members: [ {id, name}, … ≤6 ] }  // one doc, public read
```

Store only the `id` and `name` of each team member. Look up types, stats and sprites from the static index (§2.2). This removes stored data that clients could tamper with.

**`firestore.rules`** (commit it to the repo):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /usernames/{name} {
      allow read: if true;
      allow create: if request.auth != null
        && request.resource.data.uid == request.auth.uid
        && name.matches('^[a-z0-9_]{3,20}$');
      allow update, delete: if false;
    }
    match /teams/{uid} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == uid
        && request.resource.data.members.size() <= 6
        && request.resource.data.keys().hasOnly(['username','updatedAt','members']);
    }
    match /{document=**} { allow read, write: if false; }
  }
}
```

### 3.2 Auth flow (P0)

- Use **separate** Sign in (email + password) and Sign up (username + email + password) tabs. Never use "look up the username, then decide".
- On sign-up, claim the username **in a transaction** (`usernames/{lower}`) before the profile is written.
- Map Firebase error codes to generic messages. Sign-in errors should not reveal whether an email exists.
- Turn on **Firebase App Check** (reCAPTCHA Enterprise) and email enumeration protection in the Firebase console.
- Enforce a minimum password length of 8 characters (Firebase password policy) and add a "show password" toggle.
- Add a password-reset link (`sendPasswordResetEmail`).
- Sign-out should not call `window.location.reload()`. Use `router.refresh()` together with the auth context.

### 3.3 HTTP hardening (P1)

Add these to `next.config.ts`:

```ts
const csp = [
  "default-src 'self'",
  "img-src 'self' data: https://raw.githubusercontent.com",
  "script-src 'self' 'unsafe-inline' https://apis.google.com https://www.gstatic.com",
  "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com",
  "frame-src https://*.firebaseapp.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "Content-Security-Policy", value: csp },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    }];
  },
};
```

Next, replace `'unsafe-inline'` with nonce-based CSP through middleware.

### 3.4 Input validation (P1)

- Validate route params before using them in a fetch URL or a Firestore path, e.g. `/^[a-z0-9-]{1,40}$/` for Pokémon, moves, abilities and types, and `/^[1-9]$/` for generations. Call `notFound()` when validation fails.
- Trim, lowercase and length-limit search input.
- Never render user-provided text with `dangerouslySetInnerHTML` (the codebase is clean today; keep it that way).

### 3.5 Supply chain (P1)

- Enable Dependabot or Renovate, and run `npm audit --omit=dev` in CI.
- Keep Next and React on patched versions. The RSC CVE fix in PR #1 shows why this matters.
- Upgrade to **Next 16** and replace `next lint` (deprecated) with `eslint .`.
- Validate env vars at boot with `zod`, and fail the build if Firebase config is missing.

---

## 4. Style Guide 2.0: "Field Guide"

### 4.1 Design concept

> **A calm, editorial Pokédex where the Pokémon provide the color.**

The current UI uses many competing effects: orange `primary`, gradient text, glass cards, floating icons, `border-2` everywhere and type colors at full saturation. Studios like Linear, Vercel and Apple use **restraint**: neutral surfaces, one strong accent and generous whitespace. Type color then becomes the *content*.

**Principles**
1. **Neutral canvas, colorful subjects.** The UI chrome is grayscale. Saturated color appears only through Pokémon types and artwork.
2. **Typography carries the hierarchy.** Use large confident display type, a tight mono for data, and no underlined headings.
3. **Depth through light, not borders.** Use hairline borders, soft layered shadows and an inner highlight. No `border-2`.
4. **Motion has meaning.** Shared-element transitions from card to detail page, springy micro-interactions, and full respect for `prefers-reduced-motion`.
5. **Data looks like an instrument.** Stats, numbers and type matchups should read like a precise spec sheet.

### 4.2 Color tokens (OKLCH)

Replace the `:root` and `.dark` blocks in `globals.css`:

```css
:root {
  --radius: 1rem;

  /* Neutrals: slightly cool, never pure black/white */
  --background: oklch(0.985 0.002 260);
  --foreground: oklch(0.18 0.01 260);
  --card: oklch(1 0 0);
  --card-foreground: var(--foreground);
  --popover: oklch(1 0 0);
  --popover-foreground: var(--foreground);
  --muted: oklch(0.955 0.004 260);
  --muted-foreground: oklch(0.50 0.012 260);
  --secondary: oklch(0.955 0.004 260);
  --secondary-foreground: var(--foreground);
  --accent: oklch(0.94 0.006 260);
  --accent-foreground: var(--foreground);
  --border: oklch(0.91 0.004 260);
  --input: oklch(0.91 0.004 260);

  /* Brand: a single "Pokéball red", used sparingly */
  --primary: oklch(0.60 0.21 25);
  --primary-foreground: oklch(0.99 0 0);
  --ring: oklch(0.60 0.21 25 / 0.45);
  --destructive: oklch(0.58 0.22 27);
  --success: oklch(0.66 0.16 150);
  --warning: oklch(0.80 0.15 80);

  /* Elevation */
  --shadow-xs: 0 1px 2px oklch(0.2 0.02 260 / 0.06);
  --shadow-sm: 0 1px 2px oklch(0.2 0.02 260 / 0.06), 0 2px 6px oklch(0.2 0.02 260 / 0.05);
  --shadow-md: 0 2px 4px oklch(0.2 0.02 260 / 0.05), 0 8px 24px -4px oklch(0.2 0.02 260 / 0.10);
  --shadow-lg: 0 4px 8px oklch(0.2 0.02 260 / 0.05), 0 24px 48px -12px oklch(0.2 0.02 260 / 0.18);
  --highlight: inset 0 1px 0 oklch(1 0 0 / 0.6);
}

.dark {
  --background: oklch(0.145 0.006 260);
  --foreground: oklch(0.96 0.003 260);
  --card: oklch(0.185 0.007 260);
  --popover: oklch(0.2 0.008 260);
  --muted: oklch(0.22 0.008 260);
  --muted-foreground: oklch(0.68 0.01 260);
  --secondary: oklch(0.22 0.008 260);
  --accent: oklch(0.25 0.01 260);
  --border: oklch(1 0 0 / 0.08);
  --input: oklch(1 0 0 / 0.12);
  --primary: oklch(0.68 0.19 25);
  --ring: oklch(0.68 0.19 25 / 0.5);
  --shadow-md: 0 0 0 1px oklch(1 0 0 / 0.04), 0 8px 24px -4px oklch(0 0 0 / 0.5);
  --shadow-lg: 0 0 0 1px oklch(1 0 0 / 0.05), 0 24px 48px -12px oklch(0 0 0 / 0.6);
  --highlight: inset 0 1px 0 oklch(1 0 0 / 0.06);
}
```

Delete the unused `--sidebar-*` tokens, and the `--chart-*` tokens once the stat bars replace the radar chart.

### 4.3 Type colors: a perceptually balanced system

The current hex values vary a lot in lightness. Poison `#6B21A8` is very dark and ice `#22D3EE` is very bright, so no single text color is readable on all of them. Rebuild them in OKLCH with the **same lightness and chroma**, varying only the hue. Each type gets 3 tones:

| Token | Use |
|---|---|
| `--type-{t}` | Solid color for chips, stat-bar fill and accents (L 0.68, C 0.15) |
| `--type-{t}-soft` | Tinted surfaces and card backgrounds (`color-mix(in oklch, var(--type-{t}) 14%, var(--card))`) |
| `--type-{t}-ink` | Text on soft surfaces (L 0.42 light / 0.85 dark) |

```css
:root {
  --type-normal:   oklch(0.68 0.03 90);
  --type-fire:     oklch(0.68 0.19 40);
  --type-water:    oklch(0.66 0.15 250);
  --type-grass:    oklch(0.70 0.17 140);
  --type-electric: oklch(0.82 0.17 95);
  --type-ice:      oklch(0.80 0.10 210);
  --type-fighting: oklch(0.58 0.18 30);
  --type-poison:   oklch(0.60 0.17 320);
  --type-ground:   oklch(0.70 0.11 75);
  --type-flying:   oklch(0.72 0.10 280);
  --type-psychic:  oklch(0.68 0.20 355);
  --type-bug:      oklch(0.70 0.16 125);
  --type-rock:     oklch(0.64 0.08 80);
  --type-ghost:    oklch(0.52 0.12 295);
  --type-dragon:   oklch(0.56 0.20 280);
  --type-dark:     oklch(0.45 0.03 40);
  --type-steel:    oklch(0.70 0.03 230);
  --type-fairy:    oklch(0.78 0.11 350);
}
```

In components, set a single variable on the wrapper and let everything inside read from it:

```tsx
<article style={{ "--t": `var(--type-${primaryType})`, "--t2": `var(--type-${secondaryType ?? primaryType})` } as React.CSSProperties}>
```

```css
.type-surface { background: linear-gradient(140deg,
  color-mix(in oklch, var(--t) 18%, var(--card)) 0%,
  color-mix(in oklch, var(--t2) 10%, var(--card)) 100%); }
```

This removes every `color + "15"` hex-string concatenation and every `PokemonTypes.filter(...)[0]` in render. Replace `PokemonTypes` with a `Record<TypeName, …>` map so each lookup is O(1).

### 4.4 Typography

| Role | Font | Notes |
|---|---|---|
| Display / UI | **Geist Sans** (variable) via `next/font` or the `geist` package | Modern neo-grotesk, one file covering all weights |
| Data / numbers | **Geist Mono** | Dex numbers, stats, base-stat totals, damage multipliers |

Remove Poppins. Load fonts with `variable: "--font-sans"` and map them in `@theme`.

**Scale** (fluid, with `clamp`):

| Token | Size | Weight | Tracking | Use |
|---|---|---|---|---|
| `display-xl` | `clamp(3rem, 6vw + 1rem, 6rem)` | 650 | -0.045em | Hero |
| `display` | `clamp(2.25rem, 3vw + 1rem, 3.75rem)` | 650 | -0.035em | Page titles, Pokémon name |
| `h2` | `clamp(1.5rem, 1.2vw + 1rem, 2rem)` | 600 | -0.02em | Section titles |
| `h3` | 1.125rem | 600 | -0.01em | Card titles |
| `body` | 1rem / 1.6 | 400 | 0 | Text |
| `small` | 0.875rem | 450 | 0 | Meta |
| `eyebrow` | 0.75rem | 550 | 0.08em, uppercase | Section labels ("FEATURED", "BASE STATS") |
| `mono` | 0.875rem | 500 | 0, `tabular-nums` | Numbers |

Rules:
- **No underlined headings, ever.** Underline is only for inline links.
- **No gradient text**, except at most one word in the hero.
- Use `text-wrap: balance` on headings and `text-wrap: pretty` on paragraphs.
- Pokémon names use `capitalize` and the display font. Dex numbers use mono and muted color: `#0025`.

### 4.5 Spacing, radius and layout

- Use a **4 px base grid**. Section padding is `py-24 md:py-32`, and card padding is `p-5`/`p-6`.
- Radius tokens: `--radius-sm 0.5rem` (chips, inputs), `--radius-md 0.75rem` (buttons), `--radius-lg 1rem` (cards), `--radius-xl 1.5rem` (feature panels, hero tiles), `full` (avatars, type chips).
- Max content width is `max-w-7xl` (1280 px), with a `px-5 md:px-8` gutter. Remove Tailwind `container` in favor of the `<PageShell>` component.
- Use **CSS grid with `auto-fill`** for card grids: `grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-4 md:gap-5`.
- Use **container queries** (`@container`) so cards adapt to their column width, not just the viewport.

### 4.6 Elevation and surfaces

| Level | Recipe | Used for |
|---|---|---|
| 0 Flat | `bg-background` | Page |
| 1 Card | `bg-card border border-border/60 shadow-[var(--shadow-sm),var(--highlight)]` | Cards and panels |
| 2 Raised | `shadow-[var(--shadow-md),var(--highlight)]` | Hovered card, popovers |
| 3 Overlay | `shadow-[var(--shadow-lg)]` + `backdrop-blur-xl bg-background/70` | Nav, command palette, sheets |

- Use **one** glass surface (the nav) and nothing else. Glass on every card looks dated and costs paint time.
- Add a subtle **noise/grain overlay** (2–3% opacity SVG, about 1 KB, inlined) on hero and type surfaces to give gradients a printed, tactile feel.
- An optional **dot grid** background for the hero: `background-image: radial-gradient(oklch(0.5 0 0 / 0.12) 1px, transparent 1px); background-size: 24px 24px; mask-image: radial-gradient(ellipse at center, black 40%, transparent 75%);`

### 4.7 Motion

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances, hovers |
| `--ease-spring` | `linear(0, 0.38 9%, 0.86 22%, 1.03 33%, 1.05 40%, 1 55%, 1)` | Buttons, chips, "added to team" |
| `--dur-fast` | 150 ms | Color, opacity |
| `--dur-base` | 240 ms | Transform |
| `--dur-slow` | 420 ms | Page and section reveals |

- **View Transitions:** turn on `experimental.viewTransition` (Next 15.2+) and give each card artwork `view-transition-name: pokemon-{id}`. Clicking a card then *morphs* the artwork into the detail hero. This is the most visible improvement in the redesign.
- **Scroll reveals:** use CSS `animation-timeline: view()` with a fade-up of 12 px. No JS library is needed.
- **Hover on cards:** `translateY(-2px)`, shadow level 1 → 2, artwork `scale(1.04)`. Drop the current `-8px` lift with `scale(1.02)`, which feels jumpy.
- Remove the infinite `floating-animation`. It is decorative motion with no meaning.
- Wrap all motion in `@media (prefers-reduced-motion: no-preference)`.

### 4.8 Components

**Navigation (`<SiteNav>`)**
- A floating **pill bar**, centered, `top-3`, `max-w-5xl`, `rounded-full`, glass level 3, `h-14`.
- Left: the logo (a custom Pokéball glyph plus the "Pokéfans" wordmark in 600 weight; drop the `Zap` icon). Center: plain links (Pokédex · Generations · Moves · Abilities · Types · Teams) with an animated active indicator, a pill sliding under the current route. Right: a `⌘K` search trigger, the theme toggle and the avatar.
- Mobile: a bottom sheet with large touch targets (≥ 44 px).
- Remove the mega-menu with its repeated "Explore X and discover amazing Pokémon" text.

**Command palette (`⌘K`)**: *new*
- A global search across Pokémon, moves, abilities and types, built on the static index (§2.2). It shows a sprite thumbnail, mono dex number and type chips, with fuzzy matching (e.g. `fuse.js`, or a hand-rolled subsequence score). This replaces the separate search forms on each page.

**Type chip (`<TypeChip type="fire" size="sm|md" />`)**
- `rounded-full px-2.5 h-6 text-xs font-medium` with the inline type icon (14 px), `bg: --type-soft`, `color: --type-ink`, `ring-1 ring-inset` of `--type` at 30%.
- Always a `<Link>` to `/types/{type}`, with a visible focus ring.

**Pokémon card (`<PokemonCard>`)**
```
┌──────────────────────────────┐
│ #0006                    ♡   │  mono, muted · heart = add to team
│                              │
│        [ artwork 70% ]       │  type-surface background, grain
│                              │
│ Charizard                    │  h3
│ (fire) (flying)        534   │  chips · BST in mono
└──────────────────────────────┘
```
- The whole card is one link (an `<a>` covering the card), with the heart as a separate button above it (`relative z-10`).
- The artwork sits on the type surface and slightly overflows the top edge on hover (a parallax effect).
- No "View Details" button. The card itself is the affordance.
- Skeleton: the same box sizes, with a shimmer done by `background-position` animation.

**Stat bars (`<StatBar>`)**: replaces the radar chart
```
HP        ████████████░░░░░░░░   78
Attack    ██████████████░░░░░░   84
…
Total                           534
```
- Label in `small` muted, value in mono `tabular-nums`, bar `h-2 rounded-full` filled with `--t`. Width is `value / 255` and animates in with `--ease-out`.
- Pure CSS, accessible (`<meter>` or `role="meter"` with `aria-valuenow`), and saves about 70 KB of JS.

**Buttons**
- Variants: `primary` (brand red, used once per view), `secondary` (neutral filled), `ghost` and `outline` (hairline).
- Height `h-10` (default), `h-12` (hero CTA). `rounded-full` for CTAs and `rounded-md` in forms.
- Press state: `active:scale-[0.97]` with `--ease-spring`.

**Inputs**
- `h-11 rounded-md bg-muted/60 border-transparent`, which becomes `bg-background border-border ring-4 ring-ring/15` on focus.
- Leading icon inside the field and a trailing `⌘K` hint on search.

**Toasts:** use **sonner** only, `position="bottom-center"`, theme-synced and `richColors={false}` (neutral, with an icon for status).

**Empty, error and 404 states:** add a custom `not-found.tsx` and `error.tsx` with a silhouette illustration ("Who's that Pokémon?"), a one-line explanation and a primary action.

### 4.9 Page-by-page redesign

**Home**
1. **Hero:** neutral background, dot grid fading out, and one large Pokémon-of-the-day artwork on the right, which sits on a soft radial glow of its type color. Headline (display-xl, 2 lines): *"Every Pokémon. / One beautiful field guide."* Sub line in muted text. CTAs: primary "Open Pokédex" and ghost "Build a team". Under the CTAs, a large **search input** that opens ⌘K.
2. **Stats strip:** `1,025 Pokémon · 919 moves · 307 abilities · 18 types` in mono, computed from the index (not hard-coded "1000+").
3. **Bento grid** replacing QuickLinks: 6 tiles of different sizes (Pokédex 2×2 with an artwork collage, Types tile with all 18 chips, Generations tile with roman numerals, Moves, Abilities, Teams). Each tile is a link with a hover lift.
4. **Featured:** a horizontal scroll-snap row of 8 cards (from the daily seed), with arrow buttons on desktop.
5. **Footer:** a quiet, 3-column footer with a "Data from PokeAPI" credit and the GitHub link.

**Pokédex**
- A sticky filter bar under the nav with search, **type multi-select chips**, a generation segmented control and sort (No. / Name / BST).
- A virtualized or paginated grid of all 1,025 Pokémon from the index, with filter state in the URL (`?type=fire&gen=1`) so views are shareable.

**Pokémon detail**
- **Hero:** a split layout. Left: dex number, name (display), genus ("Flame Pokémon"), type chips and the add-to-team button. Right: large artwork on the type surface with the shared-element transition, plus a shiny toggle and a form switcher (varieties) as a segmented control.
- **Tabs** (sticky): Overview · Stats · Evolution · Moves · Matchups.
  - Overview: flavor text, height/weight/abilities in a spec-sheet grid of mono values.
  - Stats: `<StatBar>` list plus BST.
  - Evolution: horizontal chain of mini cards with the trigger in between ("Lv. 36", "Fire Stone").
  - Matchups: a weakness/resistance grid (×4, ×2, ×½, ×¼, ×0) built from type chips.
- **Prev/next** navigation (`#0005 ← → #0007`) and keyboard arrows.
- Replace the full-page type gradient and the `bg-slate-700` panel with neutral surfaces. Keep type color for the hero panel only.

**Generations**
- A segmented control I–IX (sticky) with the region name ("Kanto", "Johto", …) and a short line about each. Use the same grid component as the Pokédex.

**Types**
- An 18-tile grid. Each tile shows the type surface, icon, name and Pokémon count.
- Detail page: a hero with the type color as the accent, a **damage relation matrix** (attacking / defending), then the Pokémon grid.
- Bonus: an interactive **type chart** of 18×18 cells with row/column highlight on hover.

**Moves / Abilities**
- A data-table layout (sortable columns: name, type, category icon, power, accuracy, PP), with search through ⌘K or an inline filter. Make it look like an instrument panel, not a card wall.
- Detail page: a spec-sheet header followed by a grid of "learned by" Pokémon.

**Teams**
- A team card shows 6 slots (empty slots as dashed outlines), a type-coverage summary (e.g. "Weak to: Ground ×3") and the combined BST.
- My Team: drag to reorder, remove on hover, and a coverage analysis panel.

**Login**
- A centered 400 px card on a neutral background with a soft brand glow behind it. Tabs: Sign in / Create account. Add a password-visibility toggle, inline field errors and a "Forgot password?" link.

### 4.10 Accessibility checklist (WCAG 2.2 AA)

- Text contrast ≥ 4.5:1 and UI contrast ≥ 3:1. The OKLCH type `-ink` tokens are built for this. Verify them with a contrast checker.
- Every icon-only button has an `aria-label` (e.g. the theme toggle and the heart). The current `aria-label="save to firestore btn"` should be "Add Charizard to team" with `aria-pressed`.
- `focus-visible:ring-4 ring-ring/30` on every interactive element, never `outline-none` without a replacement.
- Type information is never conveyed by color alone: chips always include the text label.
- Add a skip link ("Skip to content"), one `<h1>` per page, and landmarks (`header`, `nav`, `main`, `footer`).
- Use `alt` text like "Charizard official artwork" instead of just `alt={name}`.
- Respect `prefers-reduced-motion` and `prefers-contrast`.

### 4.11 SEO and metadata

- `generateMetadata` per page (e.g. "Charizard (#0006): Stats, Evolutions & Moves | Pokéfans").
- Dynamic **OG images** with `next/og` (`opengraph-image.tsx`): artwork on the type surface, the name and the dex number.
- `app/sitemap.ts` from the index, plus `robots.ts`, a `manifest.ts` (installable PWA) and `themeColor` per color scheme.
- JSON-LD is optional.

---

## 5. Code quality

- Introduce a **typed index** module: `getPokemonIndex()`, `TypeName` union, `TYPE_META: Record<TypeName, { label, icon }>`.
- Replace the duplicated card markups (`PokemonCard`, `FeaturedPokemon`, `RandomPokemon`, `TeamDisplay`, `TeamsDisplay`) with **one** `PokemonCard` that has variants.
- Delete `RandomPokemon.tsx` (unused legacy) and the duplicate `SearchForm`s once ⌘K and the filter bar exist.
- Add `src/components/layout/PageShell.tsx` (title, eyebrow, description, actions slot) so every page header looks the same.
- Strict typing: remove `any` (e.g. `genus: any`, `error: any`), and use `unknown` with narrowing.
- Use stable keys (`pokemon.id`, never `index`).
- Prettier and ESLint already exist. Add `eslint-plugin-jsx-a11y`, and `tsc --noEmit` in CI.
- Tests: Playwright smoke tests for each route, plus `@axe-core/playwright` for accessibility. Add unit tests for the type-effectiveness calculator.
- Update the README (it still says Next.js v13), and add setup and Firebase rules deploy instructions.

---

## 6. Suggested roadmap

| Phase | Scope | Result |
|---|---|---|
| **1. Stabilize** (1–2 days) | All §1 P0 fixes, `pokeapi()` helper, async `params`, Firestore rules, separate sign-in and sign-up | No crashes, safe data |
| **2. Data layer** (1–2 days) | Build-time Pokémon index, remove the N+1 fetches, enable image optimization, drop unused libs | Pages load in well under 2 s, bundle about 40% smaller |
| **3. Design foundation** (2–3 days) | New tokens, fonts, type color system, `PageShell`, `TypeChip`, `PokemonCard`, `StatBar`, nav, sonner | Consistent look across all pages |
| **4. Signature experiences** (3–5 days) | ⌘K palette, view transitions, bento home, detail tabs, Pokédex filters, type chart | The redesign from §4 |
| **5. Polish & ship** (1–2 days) | A11y audit, OG images, sitemap, security headers and CSP, Lighthouse CI, README | Production-ready |
