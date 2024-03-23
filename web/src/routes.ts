import "router-slot"
import "./views/home"
import "./views/about"
import "./views/blogs"
import { BlogView } from "./views/blogs"

customElements.whenDefined("router-slot").then(() => {
    const routerSlot = document.querySelector("router-slot")
    if (!routerSlot)
        return
    routerSlot.add([
        {
            path: "home",
            component: document.createElement("home-view")
        },
        {
            path: "about",
            component: document.createElement("about-view")
        },
        {
            path: "blogmenu",
            component: document.createElement("blog-menu")
        },
        {
            path: "blog/:blogId",
            component: BlogView,
            ///@ts-ignore
            setup: (component: BlogView, info: any) => {
                component.blogId = info.match.params.blogId
            }
        },
        {
            path: "**",
            redirectTo: "home"
        }
    ])
})