# Backslash-site

Source for my blog.

## Layout

```
content/          # site-agnostic markdown — the actual blog
  posts/<topic>/  # published posts (frontmatter: title, date, description, tag...)
  drafts/         # unpublished, not built
  pages/          # standalone pages (privacy policy)
astro/            # new site generator (design: design/DESIGN.md)
vitepress/        # current site generator, still deployed
  docs/posts            -> ../../content/posts (symlink)
  docs/privacy-policy.md -> ../../content/pages/privacy-policy.md (symlink)
```

Content is kept out of any generator's folder so different site systems can be tried against the same markdown.

## Astro

```sh
cd astro
npm install
npm start        # dev server
npm run build    # -> dist
```

If a markdown config change does not show up, delete `astro/node_modules/.astro` (content cache).

## VitePress

```sh
cd vitepress
npm install
npm start        # dev server
npm run build    # -> docs/.vitepress/dist
```

## Deploy

Google Cloud Build (`cloudbuild.yaml`) builds `vitepress/` and deploys to Firebase Hosting (`backslash-project`).
