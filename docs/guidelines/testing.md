# Testing

How the site is tested, and how tests are written. `plan`, `groom` and `work` read this file, and `task-style.md` builds on it.

## Test layers

- **Unit:** Vitest tests in `tests/unit/`. They check the content loaders and schemas, the redirect table and the scripts, without a browser.
- **End to end:** Playwright tests in `tests/e2e/`, run against the built site served by `scripts/preview.js`. They run in two projects, `desktop` and `phone`, except `redirects.spec.ts`, which runs in `desktop` only. The crawl is tagged `@full`, so only the full suite runs it. The crawl visits every page in the sitemap and checks each for console errors, failed requests, one `h1`, and WCAG 2.2 AA problems with axe.
- **Lighthouse:** `npm run lighthouse` scores three pages. Each of the four categories must score 95 or more.
- **Static checks:** `npm run lint` runs ESLint and the Svelte type check. `npx prettier --check .` checks formatting.

## What not to test

Do not write automated tests for details that the design keeps changing:

- Colors
- Layout and placement
- Screenshots and snapshots
- Shadows
- Sizes in pixels
- Text of docs
- Timings

While building, check these with a throwaway agent-run check. Leave the final judgment to user acceptance testing (UAT), where the developer checks them by eye.

## Running tests

Run the fast tier, which a task runs. It builds the site, then runs the unit tests and the `desktop` end-to-end tests, without the crawl:

```bash
npm test
```

Run one area of the fast tier. Arguments after `--` reach Playwright:

```bash
npm test -- tests/e2e/menu.spec.ts
```

Run the full suite, which CI runs. It builds the site, then runs the unit tests, the end-to-end tests in both projects including the crawl, and Lighthouse:

```bash
npm run test:all
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
