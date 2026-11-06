# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Source for [evilglasses.com](https://evilglasses.com): a static SvelteKit and Svelte site of books, games, apps and short stories. Content is Markdown with YAML frontmatter in `src/content/`, checked by Zod schemas at build time. The Node version is pinned in `.nvmrc`.

## Guidelines

Read these before changing the matching area, and do not repeat them here:

- `docs/guidelines/architecture.md`: the stack, the layout and the field reference for each content type
- `docs/guidelines/commit-conventions.md`: commit and pull request names
- `docs/guidelines/documentation-style.md`: how docs are written
- `docs/guidelines/task-style.md`: how tasks are written
- `docs/guidelines/testing.md`: the test layers and how to run them

## Skills

To add a book, game, app, story or edition, use the `add-content` skill in `.claude/skills/add-content/`. Do not write content files by hand.

## Commands

Start the dev server:

```bash
npm run dev
```

Build the static site:

```bash
npm run build
```

The README lists every script.

## Checks

These are the commands `.sdlc/config.toml` runs.

- Format:

  ```bash
  npx prettier --check .
  ```

- Lint:

  ```bash
  npm run lint
  ```

- Test:

  ```bash
  npm test
  ```

## Deploying

The deploy workflow publishes to GitHub Pages only when the repository variable `PAGES_DEPLOY` is `true`. Until cutover, the live site is served from the legacy publishing branch. Do not push to it.

## Conventions

Prettier formats the code: tabs, single quotes, no trailing commas. Run it on the files you change, never with a directory write.
