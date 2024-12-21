import { defineConfig } from "vitepress"
import { generateSidebar } from "vitepress-sidebar"


// https://vitepress.dev/reference/site-config
export default () => {
    return defineConfig({
        head: [
            ["link", { rel: "icon", type: "image/svg+xml", href: "/images/favicon.svg" }]
        ],
        title: "Backslash",
        description: "Backslash site",
        themeConfig: {
            logo: "/images/favicon.svg",
            nav: [
                { text: "Home", link: "/" },
                { text: "Posts", link: "/posts"}
            ],
            search: {
                provider: "local"
            },
            sidebar: generateSidebar({
                capitalizeFirst: true,
                scanStartPath: "docs",
                excludePattern: ["drafts"]
            }),
            socialLinks: [
                { icon: "github", link: "https://github.com/atlemagnussen" }
            ]
        },
        cleanUrls: true,
        vue: {
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => tag.includes("-")
                }
            }
        },
        ignoreDeadLinks: true
    })
}
