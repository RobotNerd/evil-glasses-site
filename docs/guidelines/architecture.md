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
- `scripts/`: `compare-live.ts`, `lighthouse.js`, `make-brand.js`, `make-fonts.js` and `preview.js`
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

| Field           | Type                                       | Required |
| --------------- | ------------------------------------------ | -------- |
| `author`        | string                                     | yes      |
| `date`          | date                                       | yes      |
| `image`         | image file name                            | yes      |
| `privacyPolicy` | site path                                  | yes      |
| `screenshots`   | list of image file names, at least one     | yes      |
| `storeLinks`    | list of store links, at least one          | yes      |
| `subtitle`      | string                                     | no       |
| `synopsis`      | string                                     | yes      |
| `summary`       | string, one sentence, up to 200 characters | yes      |
| `title`         | string                                     | yes      |

### books

| Field        | Type                                       | Required |
| ------------ | ------------------------------------------ | -------- |
| `author`     | string                                     | yes      |
| `authorBio`  | string                                     | yes      |
| `cover`      | image file name                            | yes      |
| `date`       | date                                       | yes      |
| `storeLinks` | list of store links, at least one          | yes      |
| `subtitle`   | string                                     | yes      |
| `synopsis`   | string                                     | yes      |
| `summary`    | string, one sentence, up to 200 characters | yes      |
| `title`      | string                                     | yes      |

### editions

| Field    | Type                  | Required |
| -------- | --------------------- | -------- |
| `cover`  | image file name       | yes      |
| `date`   | date                  | yes      |
| `number` | positive whole number | yes      |

### games

| Field           | Type                                       | Required |
| --------------- | ------------------------------------------ | -------- |
| `date`          | date                                       | yes      |
| `image`         | image file name                            | yes      |
| `privacyPolicy` | site path such as `/legal/my-app`          | yes      |
| `storeLinks`    | list of store links, at least one          | yes      |
| `subtitle`      | string                                     | yes      |
| `synopsis`      | string                                     | yes      |
| `summary`       | string, one sentence, up to 200 characters | yes      |
| `title`         | string                                     | yes      |

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

| Field      | Type                                       | Required |
| ---------- | ------------------------------------------ | -------- |
| `author`   | string                                     | yes      |
| `date`     | date                                       | yes      |
| `edition`  | positive whole number                      | yes      |
| `order`    | positive whole number                      | no       |
| `synopsis` | string                                     | yes      |
| `summary`  | string, one sentence, up to 200 characters | yes      |
| `title`    | string                                     | yes      |

## Presentation

The global stylesheet is `src/lib/styles.css`. It is inlined into each page at build time, and the preview server gzips text, as GitHub Pages does.

### Tokens

Tokens are custom properties on `:root`. The dark values come from `prefers-color-scheme: dark`; a token not listed below has one value for both.

Colors, light and dark:

- `--accent`: links and highlights
- `--banner`: the landing page banner, a sky blue in light mode and a muted blue in dark mode
- `--bar`: the background of the top bar
- `--ink`: text
- `--line`: borders
- `--muted`: secondary text
- `--paper`: the page background
- `--paper-2`: raised surfaces

Colors that are the same in both modes:

- `--lens`: the logo lens fill

Older color names, aliases of the colors above:

- `--color-accent`
- `--color-bg`
- `--color-border`
- `--color-muted`
- `--color-surface`
- `--color-text`

Fonts, spacing and layout:

- `--content-width`: the page column width
- `--fade-duration`: the length of the landing page fade, 300 ms; `FADE_MS` in `src/lib/slideshow.ts` must match it
- `--font-body`: the system font stack
- `--font-display`: Big Shoulders Display, with a sized fallback
- `--font-serif`: Literata, with a sized fallback
- `--radius`: the corner radius of images
- `--space-1` to `--space-5`: the spacing scale, from 0.25rem to 3rem
- `--vt-duration`: the length of the current view transition

### Fonts

- **Big Shoulders Display** at weight 800 sets `h1`, `h2`, `h3` and the titles in the cover grids, in capitals.
- **Literata** (regular, weights 400 to 700, and italic) sets the story text and the slide summary.

Both are served from `src/lib/assets/fonts/` as `woff2` files, with `font-display: swap`. Each has a local fallback face sized to match it, so the swap moves the layout less. The layout preloads the display font. Body text uses the system font stack.

### Components

- **`Logo`** draws the glasses as inline SVG. `width` sets its size, `label` gives it an accessible name (without it the logo is hidden from assistive tech), and `glint` plays a light streak across the lenses once.
- **`SiteMenu`** is a sticky top bar on every page except `/`. At 768 px and wider the section links (Home, Books, Stories, Games and Apps) are centered and there is no menu control. Below that the site name shows and a hamburger button at the top right opens a menu of those links plus About and Legal. The hamburger needs JavaScript, so it appears once the page hydrates. The back arrow at the left uses the browser history after an in-site navigation, and otherwise links to the parent page: the list for a page under a section, and `/` for any other.
- **`SiteFooter`** shows the About and Legal links and the copyright on every page. The landing page renders it in its own layout.
- **`Slideshow`** cycles the landing page through its slides. It shows the newest slide before JavaScript runs, then shuffles the slides and fades between them. Each slide shows for `SLIDE_MS` (5 s), including a fade of `FADE_MS`. It starts paused when the visitor prefers reduced motion, pauses on hover and focus, and has a Pause and Play icon button on the image's bottom right corner once the page hydrates. With a pointer that hovers, the button shows only while the pointer is on the slideshow.
- **`Slide`** is one slide: the image, the title linking to the item, the date and, at 768 px and wider, the `summary`.

### View transitions

The layout starts a view transition on each in-site navigation, unless the visitor prefers reduced motion or the browser lacks support. `data-vt` on the root element picks the kind:

- `fade`: between `/` and a section list, an opacity fade of `--fade-duration` (300 ms) both ways with no movement
- `cover`: between a books, games or apps list and one of its pages, 250 ms, where the cover moves into place
- no value: every other navigation, 180 ms

The only `view-transition-name` the site sets is `cover-<slug>`, on the cover or icon of a book, game or app, on both its list and its page. `<slug>` is the entry's slug. The page itself uses the default `root` name.

## URLs and redirects

- `/`: the landing page: a full-width blue banner with the logo, then, at the content width and at the top, a link to each of the four sections, and the slideshow with one slide per book, story, game and app, newest first. `listSlides` in `src/lib/content/landing.ts` builds the slides. A story's slide shows its edition's cover, and an app's shows its first screenshot. On a phone held sideways (a coarse pointer, landscape, and a height of 30 rem or less) the links move into the banner, in a row to the right of the logo at the left, and the slide shows its image at the left with the name, date and summary to its right, all on one screen. Computers at any size and phones held upright keep the layout above.
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

`.github/workflows/ci.yml` runs on every pull request and on pushes to `main`. It installs dependencies, then runs `npm run lint`, `npx prettier --check .` and `npm run test:all`, in one job.

`.github/workflows/deploy.yml` runs on pushes to `main`, and by hand. It always builds the site. It deploys to GitHub Pages only when the repository variable `PAGES_DEPLOY` is `true`.
