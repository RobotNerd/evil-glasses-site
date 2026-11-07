# Evil Glasses site

The code for [evilglasses.com](https://evilglasses.com): a static site of books, games, apps and short stories. It is built with SvelteKit and Svelte, and every page is made at build time. How it is built is in `docs/guidelines/architecture.md`.

## Setup

The Node version is pinned in `.nvmrc`. With nvm, switch to it:

```bash
nvm use
```

Install the dependencies:

```bash
npm ci
```

Start the dev server:

```bash
npm run dev
```

## Commands

Run a script by name with npm's `run` command, for example the build:

```bash
npm run build
```

The scripts:

| Script         | What it does                                                                                                     |
| -------------- | ---------------------------------------------------------------------------------------------------------------- |
| `brand`        | Makes the favicon, touch icon and default share image                                                            |
| `build`        | Builds the static site into `build/`                                                                             |
| `check`        | Syncs SvelteKit and runs the Svelte type check                                                                   |
| `fonts`        | x                                                                                                                |
| `compare:live` | Compares the built pages with the live site                                                                      |
| `dev`          | Starts the dev server                                                                                            |
| `format`       | Formats every file with Prettier                                                                                 |
| `lighthouse`   | Scores three pages with Lighthouse                                                                               |
| `lint`         | Runs ESLint, then the type check                                                                                 |
| `preview`      | Serves the built site                                                                                            |
| `test`         | Fast tier for a task: builds, then runs the unit tests and the desktop end-to-end tests without the crawl        |
| `test:all`     | Full suite that CI runs: builds, then runs the unit tests, the end-to-end tests in both projects, and Lighthouse |

Check formatting without changing files:

```bash
npx prettier --check .
```

How tests are written and run is in `docs/guidelines/testing.md`.

## Adding content

Content lives in `src/content/<type>/<slug>/index.md`. The `add-content` skill in `.claude/skills/add-content/` adds an app, book, edition, game or story: it asks for each field, resizes the images and runs the checks. Ask Claude Code to add the item, and the skill starts.

The fields for each type are in the Content section of `docs/guidelines/architecture.md`.

## Deploying

A workflow in `.github/workflows/deploy.yml` builds the site on each push to `main` and can publish it to GitHub Pages. The publish job runs only when the repository variable `PAGES_DEPLOY` is `true`. The build job runs either way.

Until the site is cut over, the live site is still served from the legacy publishing branch, and that workflow does not replace it.

## Privacy policy

The privacy policy was generated using the [App Privacy Policy Generator](https://app-privacy-policy-generator.firebaseapp.com/).
