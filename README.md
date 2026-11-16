# Backslash-site

Source for my blog.

## Layout

```
content/          # site-agnostic markdown — the actual blog
  posts/<topic>/  # published posts (frontmatter: title, date, description, tag...)
  drafts/         # unpublished, not built
  pages/          # standalone pages (privacy policy)
astro/            # site generator, reads ../content
design/           # DESIGN.md (decisions) and the early prototype
```

Content is kept out of the generator's folder, so the generator can be swapped without touching the markdown.

## Astro

```sh
cd astro
npm install
npm start        # dev server
npm run build    # -> dist
```

If a markdown config change does not show up, delete `astro/node_modules/.astro` (content cache).

## Deploy

Google Cloud Build (`cloudbuild.yaml`) builds `astro/` and deploys to Firebase Hosting (`backslash-project`) on every push to `master`. Manual deploy: `cd astro && npm run deploy`.
