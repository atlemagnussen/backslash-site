# backslash design

Living record of design decisions. Implementation: `astro/`. Early prototype (with the tweak panel): `design/prototype.html`.

Status per item: **locked** (decided), **open** (candidates narrowed, not decided), **rejected**.

## Direction

- Personal blog with technical notes. An about page and links come later.
- Terminal feel, but simple. No typewriter text, endless blinking or fake window chrome.
- Dark theme first.

## Layout

| Item | Status | Decision |
|---|---|---|
| Desktop navigation | locked | Sidebar on the left. Posts as a collapsible tree, grouped by category. `/` focuses a filter. |
| Mobile navigation | locked | Sticky top bar with a `[ ls ]` button that opens the tree. Breakpoint 900px. |
| Page header | locked | Prompt path above the title: `atle@backslash:~/posts/<category>/<slug>$`. It mirrors the URL. |
| Body width | locked | Max 74ch. |
| Active post marker | locked | Reverse video: accent background, page color text. |

## Colors

| Item | Status | Decision |
|---|---|---|
| Palettes | locked | Four palettes: ash (default), gruvbox, amber, tokyo. Visitors pick one with `theme` in the sidebar footer. Saved in `localStorage`. |
| Code highlighting | locked | Shiki `css-variables` theme. Token colors come from the palette. |
| Code copy | locked | `[copy]` button and language label in the top-right corner of each code block. Shows `[copied]` for 1.5s. Built at build time (Shiki transformer), one delegated click handler. |
| Terminal blocks | locked | ` ```console ` fences render as a terminal: title bar (`title="…"` in the fence, default `terminal`), no window dots. `$ ` lines are commands, highlighted with the full `sh` grammar. Other lines are output: dimmed. Long lines wrap with a hanging indent. `[copy]` copies only the commands. |
| Images | open | Replace screenshots of terminal output with terminal blocks. Keep local image files only for real photos. |
| Background | locked | Near-black, never pure `#000`. |
| Accent | locked | One accent color per palette, plus one muted color for metadata. |

## Typography

| Item | Status | Decision |
|---|---|---|
| Font family | locked | Geist Mono, self-hosted (`@fontsource-variable/geist-mono`). No requests to Google. |
| Font size | open | One base size on `html` (18px desktop, 16px mobile). All other sizes are `rem`. Tune during testing. |
| Mono everywhere | locked | Mono for UI, headings, body and code. |
| Heading markers | locked | `##` / `###` prefixes in accent / muted color. |

## Brick background

Running-bond pattern (every second row shifted half a brick). Generated at build time as a static SVG pattern. No runtime JS.

| Item | Status | Decision |
|---|---|---|
| Style | locked | Shaded bricks, 3px mortar gap. |
| Style: mortar lines only, lines + shade | rejected | |
| Size | locked | Medium: brick 56 × 22 px. |
| Jitter | locked | 0.55 (55%). Random shade per brick. |
| Strength | locked | Opacity 0.22 (55% of the 0–0.4 slider range). |
| Fade (desktop) | locked | Both edges: clear from 38% to 70% of the viewport width, behind the content. |
| Fade (mobile) | open | Top only, gone at 35% height. Not reviewed yet. |
| Fade: none | rejected | The bricks always fade. |

## Motion

Motion only on arrival or action, never looping in the reading area. All motion is off under `prefers-reduced-motion`. CSS only, in the motion section at the end of `global.css`.

| Item | Status | Decision |
|---|---|---|
| Page transitions | open | Native cross-document view transitions. Sidebar and bricks stay; content fades out 90ms, fades in with a 6px rise over 160ms. Browsers without support navigate normally. |
| Ember bricks | open | 48 bricks on a separate layer glow in the accent color and cool down, 6–15s cycles, random phase. Values in `EMBER` (`astro/src/lib/bricks.ts`). |
| Command output | open | Home `ls` lines print one by one, 25ms apart. |
| Prompt cursor | open | Blinks 4 times on load, then stays solid. |
| Typewriter text, scroll reveals, glitch effects | rejected | They loop or delay reading. |

## Stack

| Item | Status | Decision |
|---|---|---|
| Generator | locked | Astro 7, in `astro/`. Reads `content/` as-is. URLs are the same as the VitePress site. |
| Deploy | open | `cloudbuild.yaml` still builds `vitepress/`. Switch after review. |
| Full-text search | open | VitePress had local search. Astro has only the sidebar filter (titles and slugs). Candidate: Pagefind. |
