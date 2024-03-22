import "router-slot"
import "./views/home"

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
            path: "**",
            redirectTo: "home"
        }
    ])
})