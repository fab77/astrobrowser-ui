// src/astro-controller.ts
import { bus } from './bus';
import type { IAstroViewerAPI } from './types';

export class AstroController {
  constructor(private api: IAstroViewerAPI) {}

  mount() {
    // Commands
    bus.on('astro.goto', ({ ra, dec, fov }) => this.api.goto(ra, dec, fov));
    bus.on('astro.toggle.healpix', ({ on }) => this.api.toggleHealpixGrid(on));
    bus.on('astro.toggle.equatorial', ({ on }) => this.api.toggleEquatorialGrid(on));
    bus.on('astro.set.fov', ({ fov }) => this.api.setFoV(fov));

    // Queries
    bus.on('astro.get.state:req', ({ cid }) => {
      const state = this.api.getState();
      bus.emit('astro.get.state:res', { cid, state });
    });

    // Broadcast
    this.api.onStateChanged?.((state) => bus.emit('astro.state.changed', { state }));
    bus.emit('astro.ready', { version: this.api.version ?? '0.0.0' });
  }
}
