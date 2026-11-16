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

export default defineConfig({
    site: "https://blog.logout.work",
    // /posts/linux/foo.html, served as /posts/linux/foo by Firebase cleanUrls (same URLs as VitePress)
    build: { format: "file" },
    trailingSlash: "never",
    integrations: [sitemap()],
    markdown: {
        // ::: tip blocks (used in content written for VitePress)
        processor: satteri({ features: { directive: true }, mdastPlugins: [callouts] }),
        shikiConfig: { theme: "css-variables" },
    },
})
