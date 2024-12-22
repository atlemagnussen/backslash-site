import {LitElement, html, css, PropertyValues} from "lit"
import {customElement, property} from "lit/decorators.js"

import { dSpinner } from "./engine.js"

@customElement('digilean-3d-spinner')
export class DigiLean3dSpinner extends LitElement {
    _isrunning = false
    _canvas: HTMLCanvasElement | null = null
    _popup: HTMLDivElement | null = null
    interval = 500
    spinner: dSpinner | undefined

    @property({attribute: true})
    width = "200"

    @property({attribute: true})
    height = "200"

    static styles = css`
        :host {
            background: transparent;
            display: block;
		    box-sizing: border-box;
            touch-action: none;
            height: 100%;
            width: 100%;
	    }

        main {
            background: var(--av-main-background);
        }
        section {
            z-index: 10;
        }
        canvas {
            display: block;
            background-color: transparent;
            width: 100%;
            height: 100%;
        }
        #popup {
            z-index: 100;
            display: none;
            position: absolute;
            background: var(--gl-controls-background);
            padding: 0.1rem;
            border-radius: 4px;
            color: white;
        }
    `
    
    disconnectedCallback() {
        super.disconnectedCallback()
        window.removeEventListener("resize", () => this.resizeCanvas())
        stop()
    }
    connectedCallback() {
        super.connectedCallback()
        window.addEventListener("resize", () => this.resizeCanvas())
    }

    updated() {
        this._popup = this.renderRoot.querySelector("#popup") as HTMLDivElement
    }

    protected firstUpdated(_changedProperties: PropertyValues): void {
        const section = this.shadowRoot?.querySelector("section")!
        this._canvas = this.renderRoot.querySelector("#c") as HTMLCanvasElement
        if (this._canvas) {
            const w = this.clientWidth // or offsetWidth
            const h = this.clientHeight
            this.spinner = new dSpinner(section, this._canvas)
            this.spinner.start(w, h)
        }
    }
    resizeCanvas() {
        return true
    }
    render() {
        return html`
            <header>
            
            </header>
            
            <section>
                <canvas id="c" width="${this.width}" height="${this.width}"></canvas>
            </section>

            <div id="popup">
                <span>Hello</span>
            </div>
        `
    }
}
