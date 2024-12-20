import * as B from "@babylonjs/core"

export class dSpinner {
    ownerEl: HTMLElement
    canvas: HTMLCanvasElement
    engine: B.WebGPUEngine
    scene: B.Scene

    constructor(ownerEl: HTMLElement, canv: HTMLCanvasElement) {
        this.ownerEl = ownerEl
        this.canvas = canv
        this.engine = new B.WebGPUEngine(this.canvas)
    }

    async start(width: number, height: number) {
        await this.engine.initAsync()
        
        this.engine.setSize(width, height)
        this.scene = new B.Scene(this.engine)
        
        //this.scene.clearColor = new B.Color4(0.090196, 0.090196, 0.090196, 1)
        //this.scene.clearColor = B.Color4.FromHexString("#1b1b1f")
        this.scene.clearColor = new B.Color4(0,0,0,0.000001);

        const myMaterial = new B.StandardMaterial("std", this.scene)
        myMaterial.diffuseColor = new B.Color3(1, 1, 1);
        myMaterial.specularColor = new B.Color3(1, 0, 0.87);
        myMaterial.ambientColor = new B.Color3(1, 0, 1);
        const result = await B.SceneLoader.ImportMeshAsync("", "/3d/", "digilean-svg-selected.babylon", this.scene, () => {
            //console.log(e)
        })
        //console.log(result)
        const mesh = result.meshes[0] as B.Mesh
        const scale = 1.5
        mesh.rotation.x = 1
        mesh.position.y = 0
        mesh.scaling = new B.Vector3(scale, scale, scale)
        const pbr = new B.PBRMetallicRoughnessMaterial("pbr", this.scene)
        pbr.baseColor = new B.Color3(0, 0.5, 1);
        pbr.metallic = 1.0
        pbr.roughness = 0.3
        mesh.material = pbr

        const camera = new B.ArcRotateCamera("Camera", 1, 1, 4, B.Vector3.Zero(), this.scene)
        camera.attachControl(this.canvas, false)

        const light = new B.HemisphericLight("light1", new B.Vector3(0, 1, 0), this.scene)
        light.intensity = 1

        const light2 = new B.HemisphericLight("light2", new B.Vector3(0, 1, 0.1), this.scene)
        light2.intensity = 1
        const light3 = new B.HemisphericLight("light2", new B.Vector3(0.5, 1, 0.4), this.scene)
        light3.intensity = 1
        const light4 = new B.HemisphericLight("light2", new B.Vector3(0.1, 0, 0), this.scene)
        light4.intensity = 1

        this.engine.runRenderLoop(() => {
            this.scene.render()
            mesh.rotation.x += 0.01
            mesh.rotation.y += 0.01
        })
    }
    stop() {
        this.engine.stopRenderLoop()
    }
    resize(width: number, height: number) {
        this.canvas.height = width
        this.canvas.width = height
        this.engine.resize()
    }
}