# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Source for [evilglasses.com](https://evilglasses.com): a SvelteKit 1 / Svelte 4 static site (books, games, short stories, legal pages) styled with Tailwind + Skeleton UI (`rocket` theme). Icons come from Font Awesome loaded via CDN in `src/routes/+layout.svelte`.

## Commands

```bash
npm run dev       # dev server (add `-- --open` to open a browser)
npm run build     # static build into build/
npm run preview   # serve the production build
npm run check     # svelte-kit sync + svelte-check (type checking)
npm run lint      # prettier --check + eslint
npm run format    # prettier --write
npm run deploy    # build, then push build/ to the gh-pages branch via gh-pages
```

There is no test suite. There is no ESLint config file in the repo, so the eslint half of `npm run lint` may fail; `npm run check` is the reliable verification step.

## Architecture

- **Fully prerendered static site.** `src/routes/+layout.ts` sets `prerender = true` and `@sveltejs/adapter-static` emits to `build/`. Deployed to GitHub Pages; `static/CNAME` (custom domain) and `static/.nojekyll` must stay in `static/` so they land in the build output.
- **Data-driven content.** Books, games and short-story editions live as typed objects in `src/lib/data/*-meta.ts` (types in `src/lib/util/`). List pages iterate these objects and render `CardItem`; dynamic detail routes look up entries by route param:
  - `books/[title]` → `Books[title]` (key is the human-readable title, e.g. `'Mixed Martial Hearts'`)
  - `games/[title]` → `Games[title]`
  - `short-stories/[date]/[edition]` → `Stories[parseInt(edition)]`
  Each entry's `route` field must match these URL shapes, since prerendering discovers pages by crawling those links.
- **Short-story assets by convention.** Edition cover/PDF are `static/short-stories/{date}-edition-{NN}.{png,pdf}`. Each story's full text is a hand-written static page at `src/routes/short-stories/read/{date}/{Title}/+page.svelte`; the edition page links there using the story title with apostrophes stripped, so the directory name must match that.
- **Shared UI** in `src/lib/` (`SiteNav`, `CardItem`, `DetailHeader`, `PurchaseLinks`); the app shell (AppBar, drawer nav, light switch, Floating UI popup store) is in `+layout.svelte`.
- **Base path:** `svelte.config.js` sets `paths.base` to `/evil-glasses-site` in production, but no code uses `$app/paths` — links and image paths are root-absolute while the site is served from the custom domain root. These are inconsistent; verify with `npm run build && npm run preview` before changing either.

## Conventions

Prettier: tabs, single quotes, no trailing commas, 100-column width, with the Svelte and Tailwind class-sorting plugins. Some `.ts` data files currently use 2-space indentation; run `npm run format` on files you touch.
