import { AstroViewer, CameraChangedDetail, PointCoordinates, addTAPRepo } from 'astroviewer';
import { AstroState, IAstroViewerAPI } from './types';

export class AstroViewerAdapter implements IAstroViewerAPI {

    private viewer?: AstroViewer;
    private _initialised = false;
    private listeners = new Set<(s: AstroState) => void>();
    private lastFov;

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
                // this.lastFov = this.getState().fov || 0;
                this.lastFov = this.viewer?.getFoV().minFoV
                const canvas = document.getElementById(canvasDomId)
                canvas?.addEventListener('cameraChanged', (ev: Event) => {
                    // console.log(ev)
                    const { fovDeg, position, vMatrix, pMatrix, timestamp, centre } =
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
    goto(ra: number, dec: number, fov?: number): void {
        this.viewer?.goTo(ra, dec)
    }
    toggleHealpixGrid(on?: boolean): void {
        this.viewer?.toggleHealpixGrid()
    }
    toggleEquatorialGrid(on?: boolean): void {
        this.viewer?.toggleEquatorialGrid()
    }
    setFoV(fov: number): void {
        throw new Error('Method not implemented.');
    }
    getState(): AstroState {

        const center = this.viewer?.getCenterCoordinates()
        const fov = this.viewer?.getFoV().minFoV
        
        // if (!fov) { 
        //     this.lastFov = 180. 
        // } else {
        //     this.lastFov = fov
        // }

        const equatorialGridVisible = (this.viewer?.isEquatorialGridVisible() && true) ?? false
        const healpixGridVisible = (this.viewer?.isHealpixGridVisible() && true) ?? false
        const insideSphere = (this.viewer?.getInsideSphere() && true) ?? false

        if (!center || !fov) return { ra: 0, dec: 0, fov: 0, equatorialGridVisible: equatorialGridVisible, healpixGridVisible: healpixGridVisible, insideSphere: insideSphere }

        return {
            ra: center.astroDeg.ra,
            dec: center.astroDeg.dec,
            fov: fov,
            equatorialGridVisible: equatorialGridVisible,
            healpixGridVisible: healpixGridVisible,
            insideSphere: insideSphere
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
    }

}