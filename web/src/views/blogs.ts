import { LitElement, css, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import {unsafeHTML} from "lit/directives/unsafe-html.js"
import { getBlog } from "@app/services/blogService"
import {Task} from "@lit/task"

import { queryParentRouterSlot } from "router-slot";


@customElement('blog-view')
export class BlogView extends LitElement {
    static styles = css`
        :host {
            overflow: hidden;
            height: 100%;
            display: flex;
            flex-direction: column;
            padding: 1rem;
        }
        article {
            padding: 1rem;
        }
        a {
            color: var(--cyan);
        }
    `
    
    connectedCallback(): void {
        super.connectedCallback()
        console.log("blog connected")
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
