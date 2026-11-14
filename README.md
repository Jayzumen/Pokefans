# Pokéfans

A fast, modern field guide to every Pokémon: stats, types, matchups, evolutions, moves per game, abilities, and community teams.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19.3 · TypeScript 6 · Tailwind CSS 4 · Radix UI · Firebase 13 (Auth + Firestore) · data from [PokeAPI](https://pokeapi.co/).

## Features

- **Pokédex** with instant search by name or number, plus filters for type, generation and sort order. Filters are kept in the URL, so views can be shared.
- **Pokémon pages** with base stats, type matchups, evolution chain (including branches), forms, and a **moves explorer**: pick a generation and game to see that game's learnset, by level-up, TM, egg or tutor.
- **Command palette:** press <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd> or <kbd>/</kbd> to jump to any Pokémon, type, move, ability or page.
- **Types:** 18 type pages and an interactive 18×18 type chart.
- **Moves and abilities** with details and the Pokémon that learn or have them.
- **Teams:** sign in, add up to six Pokémon, and browse other trainers' teams.
- **Light and dark themes**, view transitions, and full keyboard support.

## Getting started

Requirements: Node.js 20.9+ (24 recommended) and pnpm 10.

```bash
pnpm install
cp .env.example .env   # then fill in your Firebase web app config
pnpm dev               # http://localhost:3000
```

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_FIREBASE_*` | Firebase web app config (Project settings → Your apps). Without it, browsing works but sign-in and teams don't. |
| `NEXT_PUBLIC_SITE_URL` | Public URL, used in the sitemap, canonical URLs and link previews. |

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Start the dev server |
| `pnpm build` / `pnpm start` | Production build / serve it |
| `pnpm typecheck` | TypeScript check |
| `pnpm lint` | ESLint |
| `pnpm test` | Unit and component tests (Vitest + Testing Library) |
| `pnpm test:watch` / `pnpm test:coverage` | Tests in watch mode / with a coverage report |
| `pnpm test:e2e` | End-to-end and accessibility tests (Playwright + axe) against a production build |
| `pnpm index:build` | Regenerate the static data in `src/data/` from PokeAPI |

## Tests

- **Unit tests** (`src/**/*.test.ts`) cover the data layer and logic: PokeAPI fetching and input validation, the static data files, type matchups, learnsets, auth (username rules, rollback on failure, error messages) and teams (6-member limit). Firebase is mocked.
- **Component tests** (`src/**/*.test.tsx`) cover the Pokédex filters, moves explorer, command palette, add-to-team button, type chart and shared components.
- **End-to-end tests** (`e2e/`) run in Chromium on desktop and a phone viewport: every route renders, 404s, security headers, sitemap/robots/OG images, key user flows, and an axe accessibility scan of every page in light and dark mode.

Run `pnpm exec playwright install chromium` once before the first `pnpm test:e2e`.

## Static data

Most pages never call PokeAPI at request time. `pnpm index:build` (`scripts/build-pokemon-index.mjs`) writes:

| File | Contents |
|---|---|
| `pokemon-index.json` | All 1,025 default Pokémon: id, name, types, generation |
| `type-chart.json` | Damage multipliers between the 18 types |
| `names.json` | Every move and ability name (search, sitemap) |
| `version-groups.json` | Every game with its generation, release order and label |
| `moves.json` | Type, category, power, accuracy and PP for every move |

Re-run it when a new game or generation is released, and commit the result. Detail pages that do need live data (one Pokémon, move, ability or type) go through `src/lib/pokeapi.ts`, which caches responses for a week and returns a 404 page for unknown names.

## Firebase

Data model and access rules live in [`firestore.rules`](firestore.rules):

- `users/{uid}`: private profile (username)
- `usernames/{name}`: makes usernames unique
- `teams/{uid}`: public team, at most six members, writable only by its owner

Deploy the rules after changing them:

```bash
firebase use <your-project-id>
firebase deploy --only firestore:rules
```

Older accounts (`Users/` + `Teams/{username}`) are migrated automatically on first sign-in.

## Project structure

```
src/
  app/            routes (App Router), sitemap, robots, manifest, OG images
  components/     UI; ui/ holds the Radix-based primitives
  data/           generated static data (see above)
  lib/            data access (pokeapi, teams, auth), helpers, design helpers
scripts/          data generation
```

## Security

- Strict security headers and a Content Security Policy are set in `next.config.ts`.
- Route parameters are validated before they are used in a request or a database path.
- CI runs typecheck, lint, unit tests, build, `pnpm audit` and the end-to-end suite on every push; Dependabot keeps dependencies current.

Pokémon and its names are trademarks of Nintendo, Game Freak and Creatures. This is a non-commercial fan project.
