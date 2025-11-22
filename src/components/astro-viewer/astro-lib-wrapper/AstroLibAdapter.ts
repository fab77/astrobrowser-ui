import { Point, FoV, AstroViewer, CameraChangedDetail, CatalogueGL, FootprintSetGL, PointCoordinates } from 'astroviewer';
import { AstroEntity, AstroState, IAstroViewerAPI } from '../../../global-types';


export class AstroLibAdapter implements IAstroViewerAPI {

    private viewer?: AstroViewer;
    private _initialised = false;
    private listeners = new Set<(s: AstroState) => void>();
    private lastFov;
    private lastCentralRADeg: number | undefined;
    private lastCentralDecDeg: number | undefined;
    private lastMouseRADeg: number | undefined;
    private lastMouseDecDeg: number | undefined;

    constructor(canvasEl: HTMLCanvasElement) {
        this.init(canvasEl)
        this.lastFov = this.getState().fov
        this.notify();
    }

    private init(canvasEl: HTMLCanvasElement): void {
        if (this._initialised) return;

        (async () => {
            try {
                // TODO add canvas id to the constructor of AstroViewer();
                this.viewer = new AstroViewer(canvasEl);
                const baseUrl = this.viewer.getDefaultHiPSURL();
                const hipsUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
                this.viewer.loadHiPS(hipsUrl);
                this.viewer.run();

                this.lastFov = this.viewer?.getFoV().minFoV
                this.lastCentralRADeg = this.viewer?.getCenterCoordinates()?.astroDeg.ra
                this.lastCentralDecDeg = this.viewer?.getCenterCoordinates()?.astroDeg.dec
                this.lastMouseRADeg = this.viewer?.getCoordinatesFromMouse()?.astroDeg.ra
                this.lastMouseDecDeg = this.viewer?.getCoordinatesFromMouse()?.astroDeg.dec

                // const canvas = document.getElementById(canvasDomId)
                // canvas?.addEventListener('cameraChanged', (ev: Event) => {
                canvasEl?.addEventListener('cameraChanged', (ev: Event) => {
                    // console.log(ev)
                    const { fovDeg, position, vMatrix, pMatrix, timestamp, centralPoint, mouseHoverPoint } =
                        (ev as CustomEvent<CameraChangedDetail>).detail;
                    this.notifyIfChanged();
                });

                this._initialised = true;

            } catch (e) {
                console.error('AstroViewer boot failed:', e);
            }
        })();
    }

    // ---- IAstroViewerAPI implementation ----
    version = 'dev'

    private requireViewer() {
        const v = this.viewer;
        if (!v) throw new Error("astro-viewer is undefined");
        return v; // Now typed as non-null in the caller via local const
    }

    private requireCatalogueGL(e: AstroEntity): CatalogueGL {
        const gl = e.astroviewerGlObj;
        if (!gl) throw new Error("AstroEntity has no GL object");
        if ((gl as any)._kind !== "CatalogueGL") {
            throw new Error("Expected a CatalogueGL, got a FootprintSetGL");
        }
        return gl as CatalogueGL;
    }
    private requireFootprintSetGL(e: AstroEntity): FootprintSetGL {
        const gl = e.astroviewerGlObj;
        if (!gl) throw new Error("AstroEntity has no GL object");
        if ((gl as any)._kind !== "FootprintSetGL") {
            throw new Error("Expected a CatalogueGL, got a FootprintSetGL");
        }
        return gl as FootprintSetGL;
    }

    changeCatalogueRA(catalogue: AstroEntity, metadataColumnName: string): AstroEntity {
        const viewer = this.requireViewer();
        const catGL = this.requireCatalogueGL(catalogue);
        const updated = viewer.changeCatalogueRA(catGL, metadataColumnName);
        catalogue.astroviewerGlObj = updated;
        return catalogue;
    }

    changeCatalogueDec(catalogue: AstroEntity, metadataColumnName: string): AstroEntity {
        const viewer = this.requireViewer();
        const catGL = this.requireCatalogueGL(catalogue);
        const updated = viewer.changeCatalogueDec(catGL, metadataColumnName);
        catalogue.astroviewerGlObj = updated;
        return catalogue;
    }

    changeCatalogueColor(catalogue: AstroEntity, hexColor: string): AstroEntity {
        const viewer = this.requireViewer();
        const catGL = this.requireCatalogueGL(catalogue);
        const updated = viewer.changeCatalogueColor(catGL, hexColor);
        catalogue.astroviewerGlObj = updated;
        return catalogue;
    }

    setCatalogueShapeHue(catalogue: AstroEntity, metadataColumnName: string): AstroEntity {
        const viewer = this.requireViewer();
        const catGL = this.requireCatalogueGL(catalogue);
        const updated = viewer.setCatalogueShapeHue(catGL, metadataColumnName);
        catalogue.astroviewerGlObj = updated;
        return catalogue;
    }

    setCatalogueShapeSize(catalogue: AstroEntity, metadataColumnName: string): AstroEntity {
        const viewer = this.requireViewer();
        const catGL = this.requireCatalogueGL(catalogue);
        const updated = viewer.setCatalogueShapeSize(catGL, metadataColumnName);
        catalogue.astroviewerGlObj = updated;
        return catalogue;
    }

    hideCatalogue(catalogue: AstroEntity, show: boolean) {
        const viewer = this.requireViewer();
        const catGL = this.requireCatalogueGL(catalogue);
        viewer.hideCatalogue(catGL, show)
    }

    removeCatalogue(catalogue: AstroEntity) {
        const viewer = this.requireViewer();
        const catGL = this.requireCatalogueGL(catalogue);
        viewer.deleteCatalogue(catGL)
    }

    goto(ra: number, dec: number, fov?: number): void {
        const viewer = this.requireViewer();
        viewer.goTo(ra, dec)
    }

    toggleHealpixGrid(on?: boolean): void {
        const viewer = this.requireViewer();
        viewer.toggleHealpixGrid()
    }

    toggleEquatorialGrid(on?: boolean): void {
        const viewer = this.requireViewer();
        viewer.toggleEquatorialGrid()
    }

    toggleInsideSphere(on?: boolean): void {
        const viewer = this.requireViewer();
        viewer.toggleInsideSphere()
    }

    async showCatalogue(catalogue: AstroEntity): Promise<void> {
        const viewer = this.requireViewer();
        const catGL = this.requireCatalogueGL(catalogue);
        viewer.showCatalogue(catGL)
    }

    async showFootprintSet(fset: AstroEntity): Promise<void> {
        const viewer = this.requireViewer();
        const fsetGL = this.requireFootprintSetGL(fset);
        viewer.showFootprintSet(fsetGL)
    }


    setFoV(fov: number): void {
        throw new Error('Method not implemented.');
    }

    getFoVPolygon(): Point[] {
        const viewer = this.requireViewer();
        return viewer.getFoVPolygon()
    }

    getCenterCoordinates(): PointCoordinates | undefined {
        const viewer = this.requireViewer();
        return viewer.getCenterCoordinates()
    }

    getFoV(): FoV {
        const viewer = this.requireViewer();
        return viewer.getFoV()
    }

    getState(): AstroState {

        const viewer = this.requireViewer();

        const center = viewer.getCenterCoordinates()
        const fov = this.viewer?.getFoV().minFoV
        const equatorialGridVisible = (viewer.isEquatorialGridVisible() && true) ?? false
        const healpixGridVisible = (viewer.isHealpixGridVisible() && true) ?? false
        const insideSphere = (viewer.getInsideSphere() && true) ?? false
        const mouseDecDeg = viewer.getCoordinatesFromMouse()?.astroDeg.dec
        const mouseRADeg = viewer.getCoordinatesFromMouse()?.astroDeg.ra

        if (!center || !fov) return {
            centralRADeg: 0,
            centralDecDeg: 0,
            fov: 0,
            equatorialGridVisible: equatorialGridVisible,
            healpixGridVisible: healpixGridVisible,
            insideSphere: insideSphere,
            mouseRADeg: undefined,
            mouseDecDeg: undefined
        }

        return {
            centralRADeg: center.astroDeg.ra,
            centralDecDeg: center.astroDeg.dec,
            fov: fov,
            equatorialGridVisible: equatorialGridVisible,
            healpixGridVisible: healpixGridVisible,
            insideSphere: insideSphere,
            mouseRADeg: mouseRADeg,
            mouseDecDeg: mouseDecDeg
        }
    }

    onStateChanged(cb: (state: AstroState) => void) {
        // save callback cb function 
        this.listeners.add(cb);
        // retruns a function that when called removes the callback
        return () => this.listeners.delete(cb);
    }

    // ---- helpers ----
    private notify() {
        const s = this.getState();
        this.listeners.forEach(fn => fn(s));
    }

    private notifyIfChanged() {
        const fov = this.getState().fov;

        // Throttle: only emit if FoV actually changed (tolerance avoids spam)
        if (Number.isFinite(fov) && Math.abs(fov - this.lastFov) > 1e-3) {
            this.lastFov = fov;
            this.notify();
        }

        const centralRADeg = this.getState().centralRADeg
        const centralDecDeg = this.getState().centralDecDeg

        if (centralDecDeg && centralRADeg) {

            if (!this.lastCentralDecDeg) {
                this.lastCentralDecDeg = centralDecDeg
            }
            if (!this.lastCentralRADeg) {
                this.lastCentralRADeg = centralRADeg
            }

            // Throttle: only emit if central point actually changed (tolerance avoids spam)
            if ((Number.isFinite(centralDecDeg) && Math.abs(centralDecDeg - this.lastCentralDecDeg) > 1e-3) ||
                (Number.isFinite(centralRADeg) && Math.abs(centralRADeg - this.lastCentralRADeg) > 1e-3)) {
                this.lastCentralDecDeg = centralDecDeg;
                this.lastCentralRADeg = centralRADeg;
                this.notify();
            }
        }

        const mouseRADeg = this.getState().mouseRADeg
        const mouseDecDeg = this.getState().mouseDecDeg

        if (mouseRADeg && mouseDecDeg) {

            if (!this.lastMouseDecDeg) {
                this.lastMouseDecDeg = mouseDecDeg
            }
            if (!this.lastMouseRADeg) {
                this.lastMouseRADeg = mouseRADeg
            }

            // Throttle: only emit if mouse hover point actually changed (tolerance avoids spam)
            if ((Number.isFinite(mouseDecDeg) && Math.abs(mouseDecDeg - this.lastMouseDecDeg) > 1e-3) ||
                (Number.isFinite(mouseRADeg) && Math.abs(mouseRADeg - this.lastMouseRADeg) > 1e-3)) {
                this.lastMouseDecDeg = mouseDecDeg;
                this.lastMouseRADeg = mouseRADeg;
                this.notify();
            }
        }


    }

}