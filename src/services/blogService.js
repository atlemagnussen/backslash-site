import treeconfig from "./treeconfig.js";
import showdown  from "showdown";
const converter = new showdown.Converter();
import Prism from 'prismjs';

class BlogService
{
    async get(id) {
        const temp = document.createElement("div");
        const config = await treeconfig.get();
        const rootUrl = config.rootUrl;
        const text = await fetch(`${rootUrl}${id}.md`).then((r) => r.text());
        temp.innerHTML = converter.makeHtml(text);
        const codeElements = temp.querySelectorAll("code");
        if (codeElements && NodeList.prototype.isPrototypeOf(codeElements) && codeElements.length > 0) {
            codeElements.forEach((co) => {
                Prism.highlightElement(co);
            });
        }
        return temp.innerHTML;
    }
    async getArticleDescription(id) {
        const node = await treeconfig.findNode(id);
        if (node) {
            return node.desc;
        }
        return null;
    }
}

export default new BlogService();