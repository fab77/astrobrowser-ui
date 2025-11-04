import { AstroViewer, CameraChangedDetail, CatalogueGL, FootprintSetGL, TapRepo, addTAPRepo } from 'astroviewer';
import { DataProvider, AstroState, IAstroViewerAPI, Catalogue } from './types';
import { convertTapRepoToDataProvider } from './helpers/tap-converter';

export class AstroViewerAdapter implements IAstroViewerAPI {

    private viewer?: AstroViewer;
    private _initialised = false;
    private listeners = new Set<(s: AstroState) => void>();
    private lastFov;
    private lastCentralRADeg: number | undefined;
    private lastCentralDecDeg: number | undefined;
    private lastMouseRADeg: number | undefined;
    private lastMouseDecDeg: number | undefined;

    constructor(canvasDomId: string) {
        this.init(canvasDomId)
        this.lastFov = this.getState().fov
        this.notify();
    }

    private init(canvasDomId: string): void {
        if (this._initialised) return;

        (async () => {
            try {
                // TODO add canvas id to the constructor of AstroViewer();
                this.viewer = new AstroViewer(canvasDomId);
                const baseUrl = this.viewer.getDefaultHiPSURL();
                const hipsUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
                this.viewer.loadHiPS(hipsUrl);
                this.viewer.run();

                this.lastFov = this.viewer?.getFoV().minFoV
                this.lastCentralRADeg = this.viewer?.getCenterCoordinates()?.astroDeg.ra
                this.lastCentralDecDeg = this.viewer?.getCenterCoordinates()?.astroDeg.dec
                this.lastMouseRADeg = this.viewer?.getCoordinatesFromMouse()?.astroDeg.ra
                this.lastMouseDecDeg = this.viewer?.getCoordinatesFromMouse()?.astroDeg.dec

                const canvas = document.getElementById(canvasDomId)
                canvas?.addEventListener('cameraChanged', (ev: Event) => {
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

    changeCatalogueRA(catalogue: Catalogue, raColumnName: string): void {
        this.viewer?.changeCatalogueRA(catalogue.astroviewerGlObj as CatalogueGL, raColumnName)
    }

    changeCatalogueDec(catalogue: Catalogue, decColumnName: string): void {
        this.viewer?.changeCatalogueDec(catalogue.astroviewerGlObj as CatalogueGL, decColumnName)
    }

    changeCatalogueColor(catalogue: Catalogue, hexColor: string): void {
        this.viewer?.changeCatalogueColor(catalogue.astroviewerGlObj as CatalogueGL, hexColor)
    }

    setCatalogueShapeHue(catalogue: Catalogue, metadataColumnName: string): void {
        this.viewer?.setCatalogueShapeHue(catalogue.astroviewerGlObj as CatalogueGL, metadataColumnName)
    }
    setCatalogueShapeSize(catalogue: Catalogue, metadataColumnName: string): void {
        this.viewer?.setCatalogueShapeSize(catalogue.astroviewerGlObj as CatalogueGL, metadataColumnName)
    }

    hideCatalogue(catalogue: Catalogue, show: boolean) {
        this.viewer?.hideCatalogue(catalogue.astroviewerGlObj, show)
    }

    removeCatalogue(catalogue: Catalogue) {
        this.viewer?.deleteCatalogue(catalogue.astroviewerGlObj)
    }

    goto(ra: number, dec: number, fov?: number): void {
        this.viewer?.goTo(ra, dec)
    }

    toggleHealpixGrid(on?: boolean): void {
        this.viewer?.toggleHealpixGrid()
    }

    toggleEquatorialGrid(on?: boolean): void {
        this.viewer?.toggleEquatorialGrid()
    }

    toggleInsideSphere(on?: boolean): void {
        this.viewer?.toggleInsideSphere()
    }

    async addTAPRepo(url: string): Promise<DataProvider> {
        const tapRepo: TapRepo = await addTAPRepo(url)
        const dataProvider = convertTapRepoToDataProvider(tapRepo)
        return dataProvider
    }

    async showCatalogue(catalogue: CatalogueGL): Promise<void> {
        this.viewer?.showCatalogue(catalogue)
    }

    async showFootprintSet(fset: FootprintSetGL): Promise<void> {
        this.viewer?.showFootprintSet(fset)
    }


    setFoV(fov: number): void {
        throw new Error('Method not implemented.');
    }

    getState(): AstroState {

        const center = this.viewer?.getCenterCoordinates()
        const fov = this.viewer?.getFoV().minFoV
        const equatorialGridVisible = (this.viewer?.isEquatorialGridVisible() && true) ?? false
        const healpixGridVisible = (this.viewer?.isHealpixGridVisible() && true) ?? false
        const insideSphere = (this.viewer?.getInsideSphere() && true) ?? false
        const mouseDecDeg = this.viewer?.getCoordinatesFromMouse()?.astroDeg.dec
        const mouseRADeg = this.viewer?.getCoordinatesFromMouse()?.astroDeg.ra

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