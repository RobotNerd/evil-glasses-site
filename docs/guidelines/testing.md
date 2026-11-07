# Testing

How the site is tested, and how tests are written. `plan`, `groom` and `work` read this file, and `task-style.md` builds on it.

## Test layers

- **Unit:** Vitest tests in `tests/unit/`. They check the content loaders and schemas, the redirect table, the scripts and the workflows, without a browser.
- **End to end:** Playwright tests in `tests/e2e/`, run against the built site served by `scripts/preview.js`. They run in two projects, `desktop` and `phone`. The crawl visits every page in the sitemap and checks each for console errors, failed requests, one `h1`, and WCAG 2.2 AA problems with axe.
- **Screenshots:** Playwright tests in `tests/visual/` compare pages with committed snapshots. See Screenshot tests.
- **Lighthouse:** `npm run lighthouse` scores three pages. Each of the four categories must score 95 or more.
- **Live comparison:** `npm run compare:live` compares the rebuilt pages with the live site. Differences must be listed in `scripts/compare-live-allowed.json`. It applies only until the rebuilt site replaces the live one.
- **Static checks:** `npm run lint` runs ESLint and the Svelte type check. `npx prettier --check .` checks formatting.

## Screenshot tests

The tests in `tests/visual/` compare the landing page, `/books`, a book page and a story page with committed snapshots, in light and dark, at phone and desktop size.

They run in CI as their own job, on every pull request and on pushes to `main`. On failure CI uploads `test-results/` as an artifact. `npm test` does not run them.

Locally they need Docker. The command builds the site, serves it and runs the tests inside the official Playwright container image (linux/amd64, pinned to the installed Playwright version), so the built images, fonts and browser are the same locally and in CI.

Run the screenshot tests:

```bash
npm run test:visual
```

After an approved change to the look, rewrite the snapshots:

```bash
npm run test:visual:update
```

Review the changed images in the diff and commit them with the change that caused them. Do not update snapshots to make a failing test pass.

## Running tests

Run the unit and end-to-end tests. This builds the site first:

```bash
npm test
```

Run only the unit tests:

```bash
npx vitest run
```

Run one unit test file:

```bash
npx vitest run tests/unit/redirects.test.ts
```

Run only the end-to-end tests, after a build:

```bash
npx playwright test
```

Run the Lighthouse check:

```bash
npm run lighthouse
```

Run the static checks:

```bash
npm run lint
```

```bash
npx prettier --check .
```

## Writing tests

Every test is written as Given, When, Then, with numbered steps. The format is the one in `task-style.md`. Each test names the criterion it covers.

```markdown
#### Blockers first → batch starts (criterion: second)

- **Given:** two to-do tasks, B blocked by A, ordered A then B
- **When:** a batch is built from that range
- **Then:** it exits 0, and the batch lists A, then B

1. Set up the fake tracker with A and B.
2. Run the batch builder with the range — expected: exit 0, and the batch lists A, then B.
```

Write the code for each kind of test as follows.

- **Unit:** add `tests/unit/<name>.test.ts`. Import from `src/` with relative paths. Give the test the input, call the function, and assert on the result or the error message.
- **End to end:** add `tests/e2e/<name>.spec.ts`. Load a page with `page.goto`, then assert on what a visitor sees. Use `checkPage` from `tests/e2e/checks.ts` when the page should also be free of errors and accessibility problems.
- **Agent-run check:** a throwaway script in `.sdlc/local/throwaway-tests/` that the agent runs and reports. It is not committed.

## Manual tests

A manual test is a last resort. Use one only for what no automated test or agent-run check can observe.

A manual test opens its section with a **Why manual:** line, which says what it checks and why it can't be automated. Its steps are written out in full: every command, prompt and value to paste, with the expected result of each step. Commands and values stand in their own code blocks, as `documentation-style.md` requires.

```markdown
**Why manual:** the result is how the page looks on a real phone, which no script can judge.

#### Cover image → reads well on a phone (criterion: first)

- **Given:** the site is served from the default branch
- **When:** the developer opens the book page on a phone
- **Then:** the cover is sharp and the title is readable

1. Open the page on the phone — expected: the cover fills the width without a sideways scroll.
2. Read the title — expected: no text is cut off.
```
