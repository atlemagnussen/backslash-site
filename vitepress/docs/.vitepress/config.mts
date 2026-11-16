import { defineConfig } from "vitepress"
import { generateSidebar } from "vitepress-sidebar"


// https://vitepress.dev/reference/site-config
export default () => {
    return defineConfig({
        lastUpdated: true,
        sitemap: {
            hostname: "https://blog.logout.work"
        },
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
                excludePattern: ["drafts"],
                useTitleFromFileHeading: true,
                collapseDepth: 2
            }),
            socialLinks: [
            ],
            footer: {
                message: `Personal blog. <a href="privacy-policy">Privacy Policy</a>`,
            }
        },
        cleanUrls: true,
        vite: {
            // content lives in ../../content and is symlinked into docs/.
            // Keep symlinked paths so markdown resolves deps from vitepress/node_modules.
            resolve: { preserveSymlinks: true }
        },
        vue: {
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => tag.includes("-")
                }
            }
        },
        ignoreDeadLinks: true,
    })
}
