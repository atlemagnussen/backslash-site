# Backslash-site

Source for my blog.

## Layout

```
content/          # site-agnostic markdown — the actual blog
  posts/<topic>/  # published posts (frontmatter: title, date, description, tag...)
  drafts/         # unpublished, not built
  pages/          # standalone pages (privacy policy)
vitepress/        # current site generator
  docs/posts            -> ../../content/posts (symlink)
  docs/privacy-policy.md -> ../../content/pages/privacy-policy.md (symlink)
```

Content is kept out of any generator's folder so different site systems can be tried against the same markdown.

## VitePress

```sh
cd vitepress
npm install
npm start        # dev server
npm run build    # -> docs/.vitepress/dist
```

## Deploy

Google Cloud Build (`cloudbuild.yaml`) builds `vitepress/` and deploys to Firebase Hosting (`backslash-project`).
