import { defineConfig } from "vitepress"
import { getPostsSidebar } from "./theme/posts.sidebar"


// https://vitepress.dev/reference/site-config
export default async () => {
    const postsSidebar = await getPostsSidebar()    
    
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
            sidebar: [
                ...postsSidebar
            ],
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
        }
    })
}
