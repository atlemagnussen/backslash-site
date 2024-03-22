import "router-slot"
import "./views/home"
import "./views/about"

customElements.whenDefined("router-slot").then(() => {
    const routerSlot = document.querySelector("router-slot")
    if (!routerSlot)
        return
    routerSlot.add([
        {
            path: "home",
            component: document.createElement("home-view")
        },{
            path: "about",
            component: document.createElement("about-view")
        },
        {
            path: "**",
            redirectTo: "home"
        }
    ])
})