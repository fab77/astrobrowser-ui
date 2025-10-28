// src/astro-controller.ts
import { bus } from './bus';
import type { Catalogue, DataProvider, IAstroViewerAPI } from './types';

export class AstroController {
  constructor(private api: IAstroViewerAPI) { }

  mount() {
    // Commands
    bus.on('astro.goto', ({ ra, dec, fov }) => this.api.goto(ra, dec, fov));
    bus.on('astro.toggle.healpix', ({ on }) => this.api.toggleHealpixGrid(on));
    bus.on('astro.toggle.equatorial', ({ on }) => this.api.toggleEquatorialGrid(on));
    bus.on('astro.toggle.insideSphere', ({ on }) => this.api.toggleInsideSphere(on));
    bus.on('astro.set.fov', ({ fov }) => this.api.setFoV(fov));

    // Queries
    bus.on('astro.get.state:req', ({ cid }) => {
      const state = this.api.getState();
      bus.emit('astro.get.state:res', { cid, state });
    });

    // Plots
    bus.on('astro.plot.catalogue:req', async ({cid, dataProvider, catalogue}) => {
      try {

        await this.api.showCatalogue(catalogue.astroviewerGlObj)

        const payload: { dataProvider: DataProvider, catalogue: Catalogue } = {
          dataProvider: dataProvider,
          catalogue: catalogue
        };
        
        bus.emit('astro.plot.catalogue:res', { cid, ok: true, payload });
        bus.emit('tap:catalogueSelected', { ...payload });
      } catch  (e: any) {
        bus.emit('astro.plot.catalogue:res', { cid, ok: false, error: e?.message ?? String(e) });
      }
    });
    
    // === TAP integration (bus-only) ===
    bus.on('astro.tap.addRepo:req', async ({ cid, url }) => {
      try {
        const dataProvider = await this.api.addTAPRepo(url);
        const payload: { dataProvider: DataProvider } = {
          dataProvider: dataProvider
        };
        // reply to the requester
        bus.emit('astro.tap.addRepo:res', { cid, ok: true, payload });

        // broadcast availability app-wide
        bus.emit('tap:repoLoaded', { url, ...payload });
      } catch (e: any) {
        bus.emit('astro.tap.addRepo:res', { cid, ok: false, error: e?.message ?? String(e) });
      }
    });


    // Broadcast
    this.api.onStateChanged?.((state) => bus.emit('astro.state.changed', { state }));
    bus.emit('astro.ready', { version: this.api.version ?? '0.0.0' });

    const state = this.api.getState();
    bus.emit('astro.state.changed', { state });

  }
}

// function async(arg0: {}): (payload: { repo: string; catalogueId: string; }) => void {
//   throw new Error('Function not implemented.');
// }

