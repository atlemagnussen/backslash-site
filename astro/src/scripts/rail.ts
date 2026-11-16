// Rail behavior: mark the current section in the outline, and draw the ASCII reading progress bar.
const WIDTH = 20

function update() {
    const links = [...document.querySelectorAll<HTMLAnchorElement>(".outline a")]
    // current section: the last heading above 30% of the viewport
    let current: HTMLAnchorElement | undefined
    for (const a of links) {
        const h = document.getElementById(a.dataset.slug!)
        if (h && h.getBoundingClientRect().top < innerHeight * 0.3) current = a
    }
    for (const a of links) {
        a.classList.toggle("current", a === current)
        a.querySelector(".mark")!.textContent = a === current ? "▸" : " "
    }

    const max = document.documentElement.scrollHeight - innerHeight
    const ratio = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 1
    const filled = Math.round(ratio * WIDTH)
    const bar = filled >= WIDTH ? "=".repeat(WIDTH) : "=".repeat(filled) + (filled > 0 ? ">" : " ") + " ".repeat(WIDTH - filled - 1)
    const el = document.querySelector(".progress")
    if (el) {
        el.querySelector(".bar")!.textContent = `[${bar}]`
        el.querySelector(".pct")!.textContent = `${Math.round(ratio * 100)}%`
    }
}

let queued = false
addEventListener("scroll", () => {
    if (queued) return
    queued = true
    requestAnimationFrame(() => { queued = false; update() })
}, { passive: true })
addEventListener("resize", update)
update()
