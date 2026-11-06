---
name: add-content
description: Adds a book, game, app, story or edition to the site. Use when the developer asks to add, create or publish a book, game, app, story or edition, or says to add content to the site.
---

# Add content

Adds one content item to the site, with valid frontmatter and resized images, then checks it.

## Field reference

The Content section of `docs/guidelines/architecture.md` is the only field reference. Read it before asking for anything. Use its table for the chosen type to find each field, its type and whether it is required. Do not guess or invent fields: the build rejects unknown ones.

## Steps

1. Ask which type to add. The supported types are:

   - `app`
   - `book`
   - `edition`
   - `game`
   - `story`

   For any other type, refuse. Say that only `app`, `book`, `edition`, `game` and `story` are supported, create nothing, and stop.

2. Ask for each required field of that type, and for any optional field the developer wants. Ask for the image paths and, for a story, the story text.
   If a required field is missing from the request, ask the developer for it. Never invent a placeholder value.

3. Choose the slug: the title in lowercase, words joined by hyphens, with apostrophes and other punctuation removed. An edition's folder is `edition-NN`, where `NN` is the number padded to two digits. If the folder exists, stop and report it.

4. Create `src/content/<type folder>/<slug>/index.md`, where the type folder is `apps`, `books`, `editions`, `games` or `stories`. The file is YAML frontmatter between `---` lines, then the Markdown body. A story's body is its text. Quote values that contain a colon or a quote. Write dates as `YYYY-MM-DD`.

5. Copy each image in with the resize script, and name the file in the frontmatter. Give the file a plain name, such as `cover.png`, `icon.png` or `screenshot-1.png`. Keep the source's extension. The script stores the image at most 1600 pixels on its long side.

   ```bash
   node scripts/resize-image.js <source image> src/content/<type folder>/<slug>/<file name>
   ```

6. A story belongs to the edition whose number equals its edition field. If that edition does not exist, add it first, as an `edition` entry with its own cover.
   A story has no image of its own. Its cover is its edition's cover, so an image given with a story goes on the edition.
   A story's date is its edition's date. Give the story an order that is the next number after the highest one in its edition, starting at 1 for a new edition.

7. Names: write an author's name as the developer gives it. Do not change one name to another. The site uses "Sara Rogers" on books and stories, "Marshall Bowles" on his, and "Sara Lufrano" on the What Size Will They Be? app. If the developer gives a different spelling of a name already on the site, ask which to use.

8. Run the checks. Fix the file and run them again until both pass.

   ```bash
   npm run lint
   ```

   ```bash
   npm test
   ```

9. Report the new page's URL:

   - `app`: `/apps/<slug>`
   - `book`: `/books/<slug>`
   - `edition`: `/stories#edition-NN`, since an edition has no page of its own
   - `game`: `/games/<slug>`
   - `story`: `/stories/<slug>`
