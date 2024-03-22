import { LitElement, html } from "lit"
import { customElement } from "lit/decorators.js"

@customElement('blog-menu')
export class BlogMenu extends LitElement {

    render() {
        return html`
            <span>menu</span>
        `
    }
}
