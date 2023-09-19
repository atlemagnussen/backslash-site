let permissionAllowed = false;

const isClipboardWriteAllowed = async () => {
    if (!navigator.clipboard)
        return false;

    // @ts-ignore
    const result = await navigator.permissions.query({name: "clipboard-write"})
    // @ts-ignore
    if (result.state == "granted" || result.state == "prompt")
        permissionAllowed = true;
};

isClipboardWriteAllowed();

export const writeToClipBoard = (text) => {
    if (!permissionAllowed)
        return;
    

    if (text.startsWith("$ ")) {
        text = text.substring(2);
    }
    text = text.trim();
    navigator.clipboard.writeText(text).then(() => {
        console.log("copied to clipboard");
    }, (er) => {
        console.log("error copying", er);
    });
};