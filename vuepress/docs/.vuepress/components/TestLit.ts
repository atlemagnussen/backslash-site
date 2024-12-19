import {LitElement, html, css} from "lit"
import {customElement} from "lit/decorators.js"


@customElement('test-lit')
export class TestLit extends LitElement {
    static styles = css`
        :host {
            background: green;
	    }
    `

    render() {
        return html`
            <p>Lit element</p>        
        `
    }
}