import {LitElement, html, css, PropertyValues} from "lit"
import {customElement} from "lit/decorators.js"

import { dSpinner } from "./main"

@customElement('digilean-3d-spinner')
export class DigiLean3dSpinner extends LitElement {
    _isrunning = false
    _canvas: HTMLCanvasElement | null = null
    _popup: HTMLDivElement | null = null
    interval = 500
    spinner: dSpinner | undefined

    constructor() {
        super()
    }
    static styles = css`
        :host {
            background: var(--vp-c-bg, #fff);
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
            background-color: black;
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
            this.spinner = new dSpinner(section, this._canvas, w, h)
            this.spinner.start()
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
                <canvas id="c" width="100" height="100"></canvas>
            </section>

            <div id="popup">
                <span>Hello</span>
            </div>
        `
    }
}
