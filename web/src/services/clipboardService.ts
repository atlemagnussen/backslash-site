let permissionAllowed = false;

async function isClipboardWriteAllowed() {
    if (!navigator.clipboard)
        return false;

    // @ts-ignore
    const result = await navigator.permissions.query({name: "clipboard-write"})
    // @ts-ignore
    if (result.state == "granted" || result.state == "prompt")
        permissionAllowed = true
    return false
}

isClipboardWriteAllowed()

export function writeToClipBoard(text: string) {
    if (!permissionAllowed)
        return
    
    text = text.trim()
    navigator.clipboard.writeText(text).then(() => {
        console.log("copied to clipboard")
    }, (er) => {
        console.log("error copying", er)
    })
}