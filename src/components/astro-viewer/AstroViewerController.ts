import { AstroState } from "../../global-types"
import { AstroLibAdapter } from "./astro-lib-wrapper/AstroLibAdapter"
import { AstroLibController } from "./astro-lib-wrapper/AstroLibController"

export class AstroViewerController {

    private canvasEl: HTMLCanvasElement | null = null
    private gl: WebGL2RenderingContext | null = null;
    private astroState: AstroState = {
        centralRADeg: 0,
        centralDecDeg: 0,
        fov: 0,
        equatorialGridVisible: false,
        healpixGridVisible: false,
        insideSphere: false,
        mouseRADeg: undefined,
        mouseDecDeg: undefined
    }

    init(canvasEl: HTMLCanvasElement, astroState: AstroState) {
        this.canvasEl = canvasEl
        const gl = canvasEl.getContext('webgl2', { alpha: false });
        if (!gl) throw new Error('WebGL2 not available');
        this.gl = gl;

        this.astroState = astroState

        this.initAstroViewer()
        this.resize(); // initial size
    }

    initAstroViewer(){
        if (!this.canvasEl) return;
        const astroLibAPI = new AstroLibAdapter(this.canvasEl);
        const astroLibController = new AstroLibController(astroLibAPI);
        astroLibController.mount();
    }

    resize() {
        if (!this.canvasEl || !this.gl) return;
        const rect = this.canvasEl.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const w = Math.floor(rect.width * dpr);
        const h = Math.floor(rect.height * dpr);

        if (this.canvasEl.width !== w || this.canvasEl.height !== h) {
            this.canvasEl.width = w;
            this.canvasEl.height = h;
            this.gl.viewport(0, 0, w, h);
        }
        // this.initAstroViewer()
    }
}