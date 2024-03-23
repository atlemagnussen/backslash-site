import treeconfig from "./treeconfig.js";
import showdown  from "showdown";
const converter = new showdown.Converter();
import Prism from "prismjs";

class BlogService
{
    async get(id) {
        const temp = document.createElement("div");
        temp.innerHTML = await this.getHtml(id);
        const codeElements = temp.querySelectorAll("code");
        if (codeElements && NodeList.prototype.isPrototypeOf(codeElements) && codeElements.length > 0) {
            codeElements.forEach((co) => {
                Prism.highlightElement(co);
            });
        }
        return temp.innerHTML;
    }
    async getHtml(id) {
        const config = await treeconfig.get();
        const rootUrl = config.rootUrl;
        var md = await fetch(`${rootUrl}${id}.md`).then((r) => r.text());
        return converter.makeHtml(md);
    }
    async getArticleMetaData(id) {
        const node = await treeconfig.findNode(id);
        if (node) {
            return node;
        }
        return null;
    }
    async getToc(inputHtml) {
        const temp = document.createElement("div");

        try {
            temp.innerHTML = inputHtml;
            const menuConfig = this.parse(temp, 1, 3);
            const menuHtml = this.generateMenu(menuConfig);
            return menuHtml;
        } catch (err) {
            temp.innerHTML = JSON.stringify(err);
        }
    }
    generateMenu(conf) {
        let html = "<ul class='toc-list'>";

        for (let i = 0; i < conf.length; i++) {
            const c = conf[i];

            html += `<li><a class="${c.tag}" href="#${c.id}">${c.text}</a></li>`;
        }
        html += "</ul>";
        return html;
    }

    parse(artdom, hi, lo) {
        const htags = [];

        for (const el of artdom.children) {
            if (el.tagName.startsWith("H") && el.tagName.length === 2) {
                const num = parseInt(el.tagName.charAt(1), 10);

                if (!isNaN(num) && num >= hi && num <= lo) {
                    const id = el.getAttribute("id");

                    if (id) {
                        htags.push(
                            {
                                id,
                                "tag": el.tagName,
                                "text": el.innerText
                            });
                    }
                }
            }
        }

        return htags;
    }
}

export default new BlogService();