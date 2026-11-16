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

// Wrap each highlighted block: <div class="code"><div class="code-bar">sh <button>[copy]</button></div><pre>…</pre></div>
// Built at build time, so the button causes no layout shift. Click handling: src/scripts/copy-code.ts
const copyButton = {
    name: "copy-button",
    root(root) {
        const lang = this.options.lang
        const label = lang && lang !== "plaintext" && lang !== "text" ? [{ type: "element", tagName: "span", properties: { className: ["code-lang"] }, children: [{ type: "text", value: lang }] }] : []
        const button = { type: "element", tagName: "button", properties: { type: "button", className: ["code-copy"], ariaLabel: "Copy code" }, children: [{ type: "text", value: "[copy]" }] }
        root.children = [{
            type: "element", tagName: "div", properties: { className: ["code"] },
            children: [{ type: "element", tagName: "div", properties: { className: ["code-bar"] }, children: [...label, button] }, ...root.children],
        }]
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
        shikiConfig: { theme: "css-variables", transformers: [copyButton] },
    },
})
