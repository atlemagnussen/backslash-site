import { defineConfig } from "vitepress"

// https://vitepress.dev/reference/site-config
export default defineConfig({
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
            {
                text: 'Posts',
                items: [
                    { text: "Arch Linux Bluetooth", link: "/posts/arch-linux-bluetooth.md" },
                ]
            }
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
