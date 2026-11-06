# Architecture

How the site is built. It is a static site: every page is made at build time and served as plain files.

## Stack

- **SvelteKit 3.1 and Svelte 5**, built with Vite.
- **`@sveltejs/adapter-static`** writes the site to `build/`. Unknown paths get `404.html`.
- **Config is in `vite.config.ts`.** SvelteKit 3 has no `svelte.config.js`. The adapter and `@sveltejs/enhanced-img` are set up there.
- **No `$lib` alias.** Imports are relative.
- **Content parsing:** `yaml` reads frontmatter, `marked` renders Markdown, and `zod` 4 checks each file.
- **Images:** `@sveltejs/enhanced-img` makes sized, optimized versions at build time.
- **Tests:** Vitest, Playwright, axe and Lighthouse CI. See `testing.md`.

## Project layout

- `.github/workflows/`: the CI and deploy workflows
- `docs/guidelines/`: these guidelines
- `scripts/`: `compare-live.ts`, `lighthouse.js`, `make-brand.js` and `preview.js`
- `src/content/<type>/<slug>/index.md`: the content, one folder per entry
- `src/lib/components/`: shared components, including `SeoHead.svelte`
- `src/lib/content/`: the content loaders, the schemas and the redirect table
- `src/params.ts`: the `slug` param matcher
- `src/routes/`: pages
- `static/`: files copied as they are, such as `robots.txt` and the brand icons
- `tests/e2e/`: browser tests
- `tests/unit/`: unit tests

## Content

Each entry is a folder named for its slug, holding an `index.md` and any images it uses. The folder name is lowercase words joined by hyphens. The file is YAML frontmatter between `---` lines, then a Markdown body.

`src/lib/content/schemas.ts` defines one Zod schema per type, and each type has one loader in `src/lib/content/`. A schema rejects unknown fields. A bad file fails the build with an error naming the file and the field.

Every page load is a `+page.server.ts` file, so the parsers stay out of the client bundle.

Dates are written `YYYY-MM-DD`. A store link is an object with the fields `store` (one of `amazon`, `apple`, `google-play`, `kindle`, `smashwords`), `label` and `url`, all required.

### apps

An app has every game field, plus the ones below. Its `subtitle` becomes optional.

| Field           | Type                                   | Required |
| --------------- | -------------------------------------- | -------- |
| `author`        | string                                 | yes      |
| `date`          | date                                   | yes      |
| `image`         | image file name                        | yes      |
| `privacyPolicy` | site path                              | yes      |
| `screenshots`   | list of image file names, at least one | yes      |
| `storeLinks`    | list of store links, at least one      | yes      |
| `subtitle`      | string                                 | no       |
| `synopsis`      | string                                 | yes      |
| `title`         | string                                 | yes      |

### books

| Field        | Type                              | Required |
| ------------ | --------------------------------- | -------- |
| `author`     | string                            | yes      |
| `authorBio`  | string                            | yes      |
| `cover`      | image file name                   | yes      |
| `date`       | date                              | yes      |
| `storeLinks` | list of store links, at least one | yes      |
| `subtitle`   | string                            | yes      |
| `synopsis`   | string                            | yes      |
| `title`      | string                            | yes      |

### editions

| Field    | Type                  | Required |
| -------- | --------------------- | -------- |
| `cover`  | image file name       | yes      |
| `date`   | date                  | yes      |
| `number` | positive whole number | yes      |

### games

| Field           | Type                              | Required |
| --------------- | --------------------------------- | -------- |
| `date`          | date                              | yes      |
| `image`         | image file name                   | yes      |
| `privacyPolicy` | site path such as `/legal/my-app` | yes      |
| `storeLinks`    | list of store links, at least one | yes      |
| `subtitle`      | string                            | yes      |
| `synopsis`      | string                            | yes      |
| `title`         | string                            | yes      |

### legal

| Field     | Type   | Required |
| --------- | ------ | -------- |
| `app`     | string | yes      |
| `title`   | string | yes      |
| `updated` | date   | yes      |

### pages

| Field         | Type   | Required |
| ------------- | ------ | -------- |
| `description` | string | yes      |
| `title`       | string | yes      |

### stories

A story belongs to the edition whose `number` equals its `edition`. A story with no `order` sorts after those with one, by title.

| Field      | Type                  | Required |
| ---------- | --------------------- | -------- |
| `author`   | string                | yes      |
| `date`     | date                  | yes      |
| `edition`  | positive whole number | yes      |
| `order`    | positive whole number | no       |
| `synopsis` | string                | yes      |
| `title`    | string                | yes      |

## URLs and redirects

- `/`: the home page
- `/about`: the about page
- `/apps` and `/apps/<slug>`: apps
- `/books` and `/books/<slug>`: books
- `/games` and `/games/<slug>`: games
- `/legal` and `/legal/<slug>`: legal pages
- `/stories` and `/stories/<slug>`: stories, grouped by edition
- `/sitemap.xml`: made by the `src/routes/sitemap.xml/+server.ts` route
- `/robots.txt`: the file `static/robots.txt`

The books and games routes use the `[slug=slug]` param matcher from `src/params.ts`, so a title-style path such as `/books/Mixed Martial Hearts` does not match them.

Old URLs redirect. `src/lib/content/redirects.ts` maps each old path to its URL. The `src/routes/[...path]` route prerenders a redirect page for each entry. The table does not list the pages that kept their URL.

`SeoHead.svelte` sets the title, description and share tags on each page. `npm run brand` regenerates the icons and the default share image in `static/` from `src/lib/assets/evil-glasses.svg`.

## Build and deploy

Build the site into `build/`:

```bash
npm run build
```

Serve `build/` the way GitHub Pages does:

```bash
npm run preview
```

`.github/workflows/ci.yml` runs on every pull request and on pushes to `main`. It installs dependencies, then runs `npm run lint`, `npx prettier --check .`, `npm test` and `npm run lighthouse`.

`.github/workflows/deploy.yml` runs on pushes to `main`, and by hand. It always builds the site. It deploys to GitHub Pages only when the repository variable `PAGES_DEPLOY` is `true`.
