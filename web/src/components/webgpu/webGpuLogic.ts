
export class WebGpuLogic {
    /**
     *
     */
    canvas: HTMLCanvasElement
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
    }

    async initialize() {
        const adapter = window.navigator.gpu?.requestAdapter() as GPUAdapter
    }
}