// src/astro-controller.ts
import { bus } from './bus';
import type { Catalogue, DataProvider, FootprintSet, IAstroViewerAPI } from './types';

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

    // Catalogue Plots
    bus.on('astro.plot.catalogue:req', async ({ cid, dataProvider, catalogue }) => {
      try {

        await this.api.showCatalogue(catalogue.astroviewerGlObj)

        const payload: { dataProvider: DataProvider, catalogue: Catalogue } = {
          dataProvider: dataProvider,
          catalogue: catalogue
        };

        bus.emit('astro.plot.catalogue:res', { cid, ok: true, payload });
        bus.emit('tap:catalogueSelected', { ...payload });
      } catch (e: any) {
        bus.emit('astro.plot.catalogue:res', { cid, ok: false, error: e?.message ?? String(e) });
      }
    });

    bus.on('astro.metadata:raChanged', ({ catalogue, column }) => {
      // delegate to your viewer API here
      this.api.changeCatalogueRA(catalogue, column)
      // catalogue.astroviewerGlObj.catalogueProps.changeCatalogueMetaRA(column);
    });

    bus.on('astro.metadata:decChanged', ({ catalogue, column }) => {
      this.api.changeCatalogueDec(catalogue, column)
      // catalogue.astroviewerGlObj.catalogueProps.changeCatalogueMetaDec(column);
    });

    bus.on('astro.metadata:hueChanged', ({ catalogue, column }) => {
      this.api.setCatalogueShapeHue(catalogue, column)
      // catalogue.astroviewerGlObj.changeCatalogueMetaShapeHue(column);
    });

    bus.on('astro.metadata:sizeChanged', ({ catalogue, column }) => {
      this.api.setCatalogueShapeSize(catalogue, column)
      // catalogue.astroviewerGlObj.changeCatalogueMetaShapeSize(column);
    });

    bus.on('astro.metadata:colorChanged', ({ catalogue, hexColor }) => {
      this.api.changeCatalogueColor(catalogue, hexColor);
    });

    bus.on('astro.plot.catalogue:show', ({ catalogue, isVisible }) => {
      this.api.hideCatalogue(catalogue, isVisible);
    });

    bus.on('astro.plot.catalogue:remove', ({ catalogue}) => {
      this.api.removeCatalogue(catalogue);
    });

    // Footprintset Plots
    bus.on('astro.plot.footprintset:req', async ({ cid, dataProvider, footprintSet }) => {
      try {

        await this.api.showFootprintSet(footprintSet.astroviewerGlObj)

        const payload: { dataProvider: DataProvider, footprintSet: FootprintSet } = {
          dataProvider: dataProvider,
          footprintSet: footprintSet
        };

        bus.emit('astro.plot.footprintset:res', { cid, ok: true, payload });
        bus.emit('tap:footprintsetSelected', { ...payload });
      } catch (e: any) {
        bus.emit('astro.plot.footprintset:res', { cid, ok: false, error: e?.message ?? String(e) });
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
