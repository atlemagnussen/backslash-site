// One delegated handler for every [copy] button (buttons are built in astro.config.mjs).
// Terminal blocks copy only the commands, without the prompt ("$", or a custom one) and without output.
function textToCopy(block: Element) {
    const commands = [...block.querySelectorAll<HTMLElement>(".terminal .line.command")]
    if (commands.length)
        return commands.map(l => [...l.children].filter(c => !c.classList.contains("term-prompt")).map(c => c.textContent).join("").trim()).join("\n")
    return (block.querySelector("pre code") as HTMLElement | null)?.innerText.replace(/\n$/, "") ?? ""
}

document.addEventListener("click", async e => {
    const button = (e.target as Element).closest<HTMLButtonElement>(".code-copy")
    const block = button?.closest(".code")
    if (!button || !block) return
    let label = "[copied]"
    try {
        await navigator.clipboard.writeText(textToCopy(block))
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
