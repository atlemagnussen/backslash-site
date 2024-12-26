import {LitElement, html, css, PropertyValues} from "lit"
import {customElement, property} from "lit/decorators.js"
import "./svg.js"
import { mSpinner } from "./engine.js"

@customElement('merkaba-spinner')
export class MerkabaSpinner extends LitElement {
    _isrunning = false
    _canvas: HTMLCanvasElement | null = null
    _popup: HTMLDivElement | null = null
    interval = 500
    spinner: mSpinner | undefined

    @property({attribute: true})
    width = "200"

    @property({attribute: true})
    height = "200"

    static styles = css`
        :host {
            background: transparent;
            position: relative;
            display: block;
		    box-sizing: border-box;
            touch-action: none;
            height: 100%;
            width: 100%;
            border: 1px solid black;
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
        div#svg {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top:0;
            left:0;
            right:0;
            bottom:0;
            z-index: 1000;
            --digilean-image-height: 13rem;
            --digilean-image-width: 13rem;
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

    async initCanvas() {
        const section = this.shadowRoot?.querySelector("section")!
        this._canvas = this.renderRoot.querySelector("#c") as HTMLCanvasElement
        if (this._canvas) {
            const w = this.clientWidth // or offsetWidth
            const h = this.clientHeight
            this.spinner = new mSpinner(section, this._canvas)
            await this.spinner.start(w, h)
            console.log("initialized")
            this.initialized = true
            const divEl = this.renderRoot.querySelector("div#svg") as HTMLDivElement
            divEl.style.display = "none"
        }
    }
    initialized = false
    protected firstUpdated(_changedProperties: PropertyValues): void {
        setTimeout(() => {
            this.initCanvas()    
        }, 1000);
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
            ${this.initialized ? html`` : html`
                <div id="svg" >
                    <merkaba-svg></merkaba-svg>
                </div>
            `}
        `
    }
}
