// One delegated handler for every [copy] button (buttons are built in astro.config.mjs).
document.addEventListener("click", async e => {
    const button = (e.target as Element).closest<HTMLButtonElement>(".code-copy")
    if (!button) return
    const code = button.closest(".code")?.querySelector("pre code") as HTMLElement | null
    if (!code) return
    let label = "[copied]"
    try {
        await navigator.clipboard.writeText(code.innerText.replace(/\n$/, ""))
    } catch {
        label = "[failed]"
    }
    button.textContent = label
    button.classList.add("done")
    clearTimeout(Number(button.dataset.timer))
    button.dataset.timer = String(setTimeout(() => {
        button.textContent = "[copy]"
        button.classList.remove("done")
    }, 1500))
})
