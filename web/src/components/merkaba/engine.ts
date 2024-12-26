import * as B from "@babylonjs/core"
import "@babylonjs/loaders/glTF"


// https://www.youtube.com/watch?v=b7-VKQeQiV4 

export class mSpinner {
    ownerEl: HTMLElement
    canvas: HTMLCanvasElement
    engine: B.WebGPUEngine | undefined
    scene: B.Scene | undefined

    constructor(ownerEl: HTMLElement, canv: HTMLCanvasElement) {
        this.ownerEl = ownerEl
        this.canvas = canv
    }

    async start(width: number, height: number) {
        this.engine = new B.WebGPUEngine(this.canvas)
        await this.engine.initAsync()
        
        this.engine.setSize(width, height)
        this.scene = new B.Scene(this.engine)
        
        this.scene.clearColor = new B.Color4(0,0,0,0.000001);

        
        const result = await B.SceneLoader.ImportMeshAsync(null, "/assets/", "star_tetrahedron_merkaba.glb", this.scene, (e) => {
            console.log(e)
        })
        
        const scale = 0.1
        const meshRoot = result.meshes[0] as B.Mesh
        const childMeshes = meshRoot.getChildMeshes()
        const mergedMesh = B.Mesh.MergeMeshes(childMeshes as B.Mesh[], true, true, undefined, false, true)
        if (!mergedMesh)
            return
        mergedMesh.scaling = new B.Vector3(scale, scale, scale)
        mergedMesh.position.x = 1


        const gl = new B.GlowLayer("glow", this.scene);
        gl.intensity = 0.5

        const cameraAngle = new B.Vector3(1, 0, 0) //B.Vector3.Zero()
        const camera = new B.ArcRotateCamera("Camera", 1, 10, 20, cameraAngle, this.scene)
        camera.attachControl(this.canvas, false)

        
        // const light4 = new B.HemisphericLight("light2", new B.Vector3(0.1, 0, 0), this.scene)
        // light4.intensity = 1

        //this.createAnimation(mergedMesh)
        this.engine.runRenderLoop(() => {
            if (this.scene) {
                this.scene.render()
           }
        })
        return true
    }
    createAnimation(mesh: B.Nullable<B.Mesh>) {
        if (!mesh)
            return
        
        const fps = 60

        // spinner
        const keyFramesSpin = [
            { frame: 0, value: 0 },
            { frame: 360, value: -2*Math.PI}
        ]
        const rotateAnim = new B.Animation("rotateAnim", "rotation.y", fps, B.Animation.ANIMATIONTYPE_FLOAT, B.Animation.ANIMATIONLOOPMODE_CYCLE)
        rotateAnim.setKeys(keyFramesSpin)
        mesh.animations.push(rotateAnim)

        // turn to right side
        const keyFramesTurn = [
            { frame: 0, value: 0 },
            { frame: 360, value: 2*Math.PI }
        ]
        const rotationTurn = new B.Animation("turnAnim", "rotation.x", fps, B.Animation.ANIMATIONTYPE_FLOAT, B.Animation.ANIMATIONLOOPMODE_CYCLE)
        rotationTurn.setKeys(keyFramesTurn)
        mesh.animations.push(rotationTurn)

        // tip
        const keyFramesTip = [
            { frame: 0, value: 0 },
            { frame: 20, value: -0.3 },
        ]
        const rotationTip = new B.Animation("tipAnim", "rotation.z", fps, B.Animation.ANIMATIONTYPE_FLOAT, B.Animation.ANIMATIONLOOPMODE_CONSTANT)
        rotationTip.setKeys(keyFramesTip)

        if (this.scene) {
            // this.scene.beginAnimation(mesh, 0, 180, true)
            this.scene.beginDirectAnimation(mesh, [rotationTurn], 0, 360, true)
        }
    }
    stop() {
        this.engine!.stopRenderLoop()
    }
    
    resize(width: number, height: number) {
        this.canvas.height = width
        this.canvas.width = height
        this.engine!.resize()
    }
}