import { AstroViewer, PointCoordinates, addTAPRepo } from 'astroviewer';
import { AstroState, IAstroViewerAPI } from './types';

export class AstroViewerAdapter implements IAstroViewerAPI {

    private viewer?: AstroViewer;
    private _initialised = false;

    init(canvasDomId: string): void {
        if (this._initialised) return;

        (async () => {
            try {
                // TODO add canvas id to the constructor of AstroViewer();
                this.viewer = new AstroViewer(canvasDomId);
                const baseUrl = this.viewer.getDefaultHiPSURL();
                const hipsUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
                this.viewer.loadHiPS(hipsUrl);
                this.viewer.run();
                this._initialised = true;
            } catch (e) {
                console.error('AstroViewer boot failed:', e);
            }
        })();
    }
    version?: string | undefined;
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
        if (!center || !fov) return {ra: 0, dec: 0, fov: 0}

        return {
            ra: center.astroDeg.ra,
            dec: center.astroDeg.dec,
            fov: fov
        }
    }
    
    onStateChanged?: ((cb: (s: AstroState) => void) => void) | undefined;

}