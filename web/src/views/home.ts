import { LitElement, css, html } from "lit"
import { customElement } from "lit/decorators.js"
@customElement('home-view')
export class HomeView extends LitElement {
    static styles = css`
        :host {
            display: block;
            padding: 1rem;
        }
        a {
            color: white;
        }
    `
    
    render() {
        return html`
            <article>
                <header>
                    <h1>Welcome</h1>
                </header>

                <section>
                    <!-- <web-gpu></web-gpu> -->
                     <digilean-3d-spinner width="300" height="300"></digilean-3d-spinner>
                </section>
            </article>
        `
    }
}
