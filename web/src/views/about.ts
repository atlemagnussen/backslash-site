import { LitElement, css, html } from "lit"
import { customElement } from "lit/decorators.js"

@customElement('about-view')
export class AboutView extends LitElement {
    static styles = css`
        :host {
            display: block;
            padding: 1rem;
        }
    `
    
    render() {
        return html`
            <article>
                <header>
                    <h1>Me</h1>
                </header>

                <section>
                    <h2>Welcome</h2>
                </section>
            </article>
        `
    }
}
