// Vim-style keys. Ignored while typing in a field or with a modifier held. "/" is handled in Sidebar.astro.
const help = document.getElementById("keys-help") as HTMLDialogElement | null
let lastG = 0

document.addEventListener("keydown", e => {
    const t = e.target as HTMLElement
    if (e.ctrlKey || e.metaKey || e.altKey || t.closest("input, textarea, select, [contenteditable]")) return
    if (help?.open) {
        if (e.key === "q") help.close()
        return
    }
    const go = (rel: string) => document.querySelector<HTMLAnchorElement>(`a[rel="${rel}"]`)?.click()
    switch (e.key) {
        case "j": scrollBy({ top: 80 }); break
        case "k": scrollBy({ top: -80 }); break
        case "n": go("next"); break
        case "p": go("prev"); break
        case "G": scrollTo({ top: document.documentElement.scrollHeight }); break
        case "g":
            if (Date.now() - lastG < 500) { scrollTo({ top: 0 }); lastG = 0 } else lastG = Date.now()
            return
        case "?": help?.showModal(); break
        default: return
    }
    e.preventDefault()
})

document.querySelectorAll("[data-keys-help]").forEach(b => b.addEventListener("click", () => help?.showModal()))
