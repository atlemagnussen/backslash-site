import { LitElement, PropertyValues, css, html } from "lit"
import { customElement } from "lit/decorators.js"
import { WebGpuLogic } from "./webGpuLogic"

@customElement('web-gpu')
export class WebGpuTest extends LitElement {
    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            font-size: 1rem;
            height: 600px;
            width: 500px;
        }
        header {
            flex: 100px 0 0;
        }
        section {
            flex: 500px 0 0;
        }
        canvas {
            background: black;
        }
    `
    engine: WebGpuLogic | undefined
    async initializeCanvas() {
        const canvas = this.renderRoot.querySelector("canvas")
        if (canvas) {
            this.engine = new WebGpuLogic(canvas)
            await this.engine.initialize()
        }
    }
    render() {
        return html`
            <header>
                <h1>Web GPU</h1>
            </header>
            <section>
                <canvas width="500" height="500">
                </canvas>
            </section>
        `
    }
    protected firstUpdated(_changedProperties: PropertyValues): void {
        
    }
}