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
const metaAttr = (ctx, name) => ctx.options.meta?.__raw?.match(new RegExp(`${name}="([^"]*)"`))?.[1]

/** "$ ls" or, with prompt="(parted)", "(parted) print" -> { prompt, command }. Anything else is output. */
function splitCommand(line, extraPrompt) {
    for (const prompt of [extraPrompt, "$"]) {
        if (prompt && line.startsWith(prompt + " ")) return { prompt, command: line.slice(prompt.length + 1) }
    }
}

// Wraps each highlighted block, at build time (no layout shift on load):
//   <div class="code"><div class="code-bar">sh [copy]</div><pre>…</pre></div>
// ```console blocks become a terminal. Lines starting with "$ " are commands (class "command"),
// the rest is output. Fence attributes:
//   title="slash@server: ~"   title bar text (default "terminal")
//   prompt="(parted)"         an extra prompt for interactive tools, besides "$"
// The prompt gets class "term-prompt"; [copy] copies commands without prompts. Click handling: src/scripts/copy-code.ts
const codeBlocks = {
    name: "code-blocks",
    // The console grammar barely colors the command itself; re-highlight command lines with the full sh grammar.
    tokens(lines) {
        if (!TERMINAL_LANGS.has(this.options.lang)) return
        const source = this.source.split("\n")
        const extraPrompt = metaAttr(this, "prompt")
        return lines.map((tokens, i) => {
            const split = splitCommand(source[i] ?? "", extraPrompt)
            if (!split) return tokens
            const sh = this.codeToTokens(split.command, { lang: "sh", theme: this.options.theme }).tokens[0] ?? []
            return [{ ...tokens[0], content: split.prompt }, { ...tokens[0], content: " " }, ...sh]
        })
    },
    line(node, line) {
        if (TERMINAL_LANGS.has(this.options.lang) && splitCommand(this.source.split("\n")[line - 1] ?? "", metaAttr(this, "prompt")))
            this.addClassToHast(node, "command")
    },
    span(node, line, col) {
        if (col === 0 && TERMINAL_LANGS.has(this.options.lang) && splitCommand(this.source.split("\n")[line - 1] ?? "", metaAttr(this, "prompt")))
            this.addClassToHast(node, "term-prompt")
    },
    root(root) {
        const lang = this.options.lang
        const button = el("button", ["code-copy"], [text("[copy]")], { type: "button", ariaLabel: "Copy code" })
        let wrapper
        if (TERMINAL_LANGS.has(lang)) {
            const title = metaAttr(this, "title") ?? "terminal"
            // output-only blocks have nothing worth copying
            const extraPrompt = metaAttr(this, "prompt")
            const hasCommand = this.source.split("\n").some(l => splitCommand(l, extraPrompt))
            wrapper = el("div", ["code", "terminal"], [el("div", ["code-bar"], [el("span", ["code-title"], [text(title)]), ...(hasCommand ? [button] : [])])])
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
