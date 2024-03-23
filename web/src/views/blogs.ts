import { LitElement, css, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import {unsafeHTML} from "lit/directives/unsafe-html.js"
import { getBlog } from "@app/services/blogService"
import {Task} from "@lit/task"
import { writeToClipBoard } from "@app/services/clipboardService"


@customElement('blog-view')
export class BlogView extends LitElement {
    static styles = css`
        :host {
            overflow: hidden;
            height: 100%;
            display: flex;
            flex-direction: column;
            padding: 1rem;
            overflow-y: auto;
        }
        article {
            padding: 1rem;
        }
        a {
            color: var(--cyan);
        }
        h1 {
            color: var(--h1-color);
            font-size: 2em;
        }
        h2 {
            color: var(--h2-color);
        }
        h3 {
            color: var(--h3-color);
        }
        pre code {
            cursor: pointer;
            border: 2px solid transparent;
            border-radius: 3px;
            padding: 0.1rem;
        }

        pre code:hover {
            border-color: var(--magenta-dark);
        }

        pre code.flash {
            animation: glowing 500ms 1;
        }

        @keyframes glowing {
            0% {
            box-shadow: 0 0 3px #2ba805;
            }
            50% {
            box-shadow: 0 0 10px #49e819;
            }
            100% {
            box-shadow: 0 0 3px #2ba805;
            }
        }
    `
    
    connectedCallback(): void {
        super.connectedCallback()
        this.renderRoot.addEventListener("click", (e) => {
            const target = e.target as HTMLElement
            if (target.tagName === "CODE") {
                e.preventDefault()
                const text = target.innerText
                const parent = target.parentNode as HTMLElement
                if (parent.tagName == "PRE") {
                    target.classList.add("flash")
                    setTimeout(() => {
                        target.classList.remove("flash")
                    }, 1000);
                    console.log("code", target.outerHTML)
                    writeToClipBoard(text);
                }
            }
        });
    }
    
    @property({attribute: true})
    blogId = ""

    private _blogTask = new Task(this, {
        task: async ([blogid]: string[]) => {
            const blog = await getBlog(blogid)
            return blog
        },
        args: () => [this.blogId]
    })
    render() {

        if (!this.blogId)
            return html`<h1>No blog</h1>`

        return this._blogTask.render({
            pending: () => html`<p>Loading product...</p>`,
            complete: (blog) => html`
                ${unsafeHTML(blog)}
                `,
            error: (e: any) => html`<p>Error: ${e}</p>`
        })
    }
}
