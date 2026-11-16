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

## Writing

Show a command with its expected output as a `console` block. Lines starting with `$ ` are commands; the rest is output. `[copy]` copies only the commands.

````md
```console title="slash@server: ~"
$ grep "Failed pass" /var/log/auth.log
Nov 16 03:12:44 server sshd[18422]: Failed password for root from 203.0.113.42 port 50122 ssh2
```
````

For interactive tools, add the tool's prompt. Those lines then count as commands too:

````md
```console prompt="(parted)"
(parted) print
```
````

Use documentation IP ranges in example output (`192.0.2.x`, `198.51.100.x`, `203.0.113.x`), never real addresses.

## Astro

```sh
cd astro
npm install
npm start        # dev server
npm run build    # -> dist
```

After a change to the markdown config (`astro.config.mjs`), restart with `npm start -- --force`. Astro caches rendered markdown and does not see config changes.

## Deploy

Google Cloud Build (`cloudbuild.yaml`) builds `astro/` and deploys to Firebase Hosting (`backslash-project`) on every push to `master`. Manual deploy: `cd astro && npm run deploy`.
