import loader from './posts.data.js'
import { DefaultTheme } from "vitepress"

// potentially group by something like this
// {
//     text: 'Posts',
//     items: [
//         { text: "Arch Linux Bluetooth", link: "/posts/arch-linux-bluetooth.md" },
//     ]
// },

export async function getPostsSidebar() {
    const posts = await loader.load()
    
    console.log("Got posts", posts)

    const blogSidebarItems: DefaultTheme.SidebarItem[] = posts.map(p => {
        return {
            text: p.title,
            link: p.url
        }
    })
    return blogSidebarItems
}
