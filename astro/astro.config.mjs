import { defineConfig } from "astro/config"
import sitemap from "@astrojs/sitemap"
import { satteri } from "@astrojs/markdown-satteri"
import { defineMdastPlugin } from "satteri"

// :::tip ... ::: -> <div class="callout tip">
const callouts = defineMdastPlugin({
    name: "callouts",
    containerDirective(node, ctx) {
        ctx.setProperty(node, "data", { hName: "div", hProperties: { className: ["callout", node.name] } })
    },
})

const el = (tagName, className, children = [], props = {}) => ({ type: "element", tagName, properties: { className, ...props }, children })
const text = value => ({ type: "text", value })
const TERMINAL_LANGS = new Set(["console", "shellsession"])

// Wraps each highlighted block, at build time (no layout shift on load):
//   <div class="code"><div class="code-bar">sh [copy]</div><pre>…</pre></div>
// ```console blocks become a terminal: lines starting with "$ " are commands (class "command"),
// the rest is output. Optional title: ```console title="slash@server: ~"
// Click handling: src/scripts/copy-code.ts
const codeBlocks = {
    name: "code-blocks",
    line(node, line) {
        if (TERMINAL_LANGS.has(this.options.lang) && /^\$ /.test(this.source.split("\n")[line - 1] ?? ""))
            this.addClassToHast(node, "command")
    },
    root(root) {
        const lang = this.options.lang
        const button = el("button", ["code-copy"], [text("[copy]")], { type: "button", ariaLabel: "Copy code" })
        let wrapper
        if (TERMINAL_LANGS.has(lang)) {
            const title = this.options.meta?.__raw?.match(/title="([^"]*)"/)?.[1] ?? "terminal"
            wrapper = el("div", ["code", "terminal"], [el("div", ["code-bar"], [el("span", ["code-title"], [text(title)]), button])])
        } else {
            const label = lang && lang !== "plaintext" && lang !== "text" ? [el("span", ["code-lang"], [text(lang)])] : []
            wrapper = el("div", ["code"], [el("div", ["code-bar"], [...label, button])])
        }
        wrapper.children.push(...root.children)
        root.children = [wrapper]
    },
}

export default defineConfig({
    site: "https://blog.logout.work",
    // /posts/linux/foo.html, served as /posts/linux/foo by Firebase cleanUrls (same URLs as VitePress)
    build: { format: "file" },
    trailingSlash: "never",
    integrations: [sitemap()],
    markdown: {
        // ::: tip blocks (used in content written for VitePress)
        processor: satteri({ features: { directive: true }, mdastPlugins: [callouts] }),
        shikiConfig: { theme: "css-variables", transformers: [codeBlocks] },
    },
})
