import { getTree, findNode } from "./treeConfig"
import showdown  from "showdown"
const converter = new showdown.Converter()
import Prism from "prismjs"

export async function getBlog(id: string) {
    const temp = document.createElement("div")
    temp.innerHTML = await getHtml(id)
    const codeElements = temp.querySelectorAll("code")
    if (codeElements && NodeList.prototype.isPrototypeOf(codeElements) && codeElements.length > 0) {
        codeElements.forEach((co) => {
            Prism.highlightElement(co)
        })
    }
    return temp.innerHTML
}

async function getHtml(id: string) {
    const config = await getTree()
    if (!config)
        throw new Error("error loading config")

    const rootUrl = config.rootUrl
    var md = await fetch(`${rootUrl}${id}.md`).then((r) => r.text())
    return converter.makeHtml(md)
}

async function getArticleMetaData(id: string) {
    const node = await findNode(id)
    if (node) {
        return node
    }
    return null
}

async function getToc(inputHtml: string) {
    const temp = document.createElement("div")

    try {
        temp.innerHTML = inputHtml
        const menuConfig = parse(temp, 1, 3)
        const menuHtml = generateMenu(menuConfig)
        return menuHtml
    } catch (err) {
        temp.innerHTML = JSON.stringify(err)
    }
}

function generateMenu(conf: HeaderTag[]) {
    let html = "<ul class='toc-list'>"

    for (let i = 0; i < conf.length; i++) {
        const c = conf[i]

        html += `<li><a class="${c.tag}" href="#${c.id}">${c.text}</a></li>`
    }
    html += "</ul>"
    return html
}

interface HeaderTag {
    id: string
    tag: string
    text: string
}

function parse(artdom: HTMLDivElement, hi: number, lo: number) {
    const htags: HeaderTag[] = []

    for (const el of artdom.children) {
        if (el.tagName.startsWith("H") && el.tagName.length === 2) {
            const num = parseInt(el.tagName.charAt(1), 10)

            if (!isNaN(num) && num >= hi && num <= lo) {
                const id = el.getAttribute("id")

                if (id) {
                    htags.push(
                        {
                            id,
                            "tag": el.tagName,
                            "text": (el as HTMLElement).innerText
                        })
                }
            }
        }
    }

    return htags
}
