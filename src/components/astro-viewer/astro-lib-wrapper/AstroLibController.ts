import { bus } from '../../../bus'
import {CoordsType, Point, CatalogueGL, FootprintSetGL } from 'astroviewer'
import {EVT_ASTRO_PLOT_CATALOGUE_REMOVE, 
  EVT_ASTRO_PLOT_CATALOGUE_SHOW, 
  EVT_ASTRO_META_COLOR_CHANGED, 
  EVT_ASTRO_META_DEC_CHANGED, 
  EVT_ASTRO_META_HUE_CHANGED, 
  EVT_ASTRO_META_RA_CHANGED, 
  EVT_ASTRO_META_SIZE_CHANGED, 
  EVT_ASTRO_STATE_GET_req, 
  EVT_ASTRO_STATE_GET_res, 
  EVT_ASTRO_PLOT_FOOTPRINTSET_req, 
  EVT_ASTRO_PLOT_FOOTPRINTSET_res, 
  EVT_ASTRO_PLOT_CATALOGUE_res,
  EVT_ASTRO_PLOT_CATALOGUE_req,
  EVT_ASTRO_READY,
  EVT_ASTRO_STATE_CHANGED} from '../../../events'
import { AstroEntity, DataProvider, IAstroViewerAPI } from '../../../global-types';
import { dataProviderStore } from '../../../stores/DataProviderStore';

export class AstroLibController {
  constructor(private api: IAstroViewerAPI) { }

  
  mount() {
    // Commands
    bus.on('astro.goto', ({ ra, dec, fov }) => this.api.goto(ra, dec, fov));
    bus.on('astro.toggle.healpix', ({ on }) => this.api.toggleHealpixGrid(on));
    bus.on('astro.toggle.equatorial', ({ on }) => this.api.toggleEquatorialGrid(on));
    bus.on('astro.toggle.insideSphere', ({ on }) => this.api.toggleInsideSphere(on));
    bus.on('astro.set.fov', ({ fov }) => this.api.setFoV(fov));

    // Queries
    bus.on(EVT_ASTRO_STATE_GET_req, ({ cid }) => {
      const state = this.api.getState();
      bus.emit(EVT_ASTRO_STATE_GET_res, { cid, state });
    });

    // Catalogue Plots
    bus.on(EVT_ASTRO_PLOT_CATALOGUE_req, async ({ cid, dataProvider, catalogue }) => {
      try {
        const fovPolygon: Point[] = this.api.getFoVPolygon()
        dataProvider.queryCatalogueByFoV(catalogue.astroviewerGlObj as CatalogueGL, fovPolygon)

        await this.api.showCatalogue(catalogue)
        const payload: { dataProvider: DataProvider, catalogue: AstroEntity } = {
          dataProvider: dataProvider,
          catalogue: catalogue
        };

        bus.emit(EVT_ASTRO_PLOT_CATALOGUE_res, { cid, ok: true, payload });
        // bus.emit('tap:catalogueSelected', { ...payload });
      } catch (e: any) {
        bus.emit(EVT_ASTRO_PLOT_CATALOGUE_res, { cid, ok: false, error: e?.message ?? String(e) });
      }
    });

    bus.on(EVT_ASTRO_META_RA_CHANGED, ({ catalogue, column }) => {
      dataProviderStore.removeFromActiveCatalogues(catalogue)
      catalogue = this.api.changeCatalogueRA(catalogue, column) // <-- delegate to your viewer API here
      dataProviderStore.addToActiveCatalogues(catalogue)
    });

    bus.on(EVT_ASTRO_META_DEC_CHANGED, ({ catalogue, column }) => {
      dataProviderStore.removeFromActiveCatalogues(catalogue)
      catalogue = this.api.changeCatalogueDec(catalogue, column)
      dataProviderStore.addToActiveCatalogues(catalogue)
    });

    bus.on(EVT_ASTRO_META_HUE_CHANGED, ({ catalogue, column }) => {
      // dataProviderStore.removeFromActiveCatalogues(catalogue)
      catalogue = this.api.setCatalogueShapeHue(catalogue, column)
      // dataProviderStore.addToActiveCatalogues(catalogue)
    });

    bus.on(EVT_ASTRO_META_SIZE_CHANGED, ({ catalogue, column }) => {
      // dataProviderStore.removeFromActiveCatalogues(catalogue)
      catalogue = this.api.setCatalogueShapeSize(catalogue, column)
      // dataProviderStore.addToActiveCatalogues(catalogue)
    });

    bus.on(EVT_ASTRO_META_COLOR_CHANGED, ({ catalogue, hexColor }) => {
      dataProviderStore.removeFromActiveCatalogues(catalogue)
      catalogue = this.api.changeCatalogueColor(catalogue, hexColor);
      dataProviderStore.addToActiveCatalogues(catalogue)
    });

    

    bus.on(EVT_ASTRO_PLOT_CATALOGUE_SHOW, ({ catalogue, isVisible }) => {
      this.api.hideCatalogue(catalogue, isVisible);
    });

    bus.on(EVT_ASTRO_PLOT_CATALOGUE_REMOVE, ({ catalogue }) => {
      this.api.removeCatalogue(catalogue);
    });

    // Footprintset Plots
    bus.on(EVT_ASTRO_PLOT_FOOTPRINTSET_req, async ({ cid, dataProvider, footprintSet }) => {
      try {

        const fovPolygon: Point[] = this.api.getFoVPolygon()
        const radiusDeg = this.api.getFoV().minFoV / 2
        const centralPoint = this.api.getCenterCoordinates()
        if (!centralPoint?.astroDeg) throw new Error(`No central point retrieved`)
        const point = new Point({raDeg: centralPoint?.astroDeg.ra, decDeg: centralPoint?.astroDeg.dec}, CoordsType.ASTRO)
        dataProvider.queryFootprintSetByFov(footprintSet.astroviewerGlObj as FootprintSetGL, fovPolygon, point, radiusDeg)

        await this.api.showFootprintSet(footprintSet)
        const payload: { dataProvider: DataProvider, footprintSet: AstroEntity } = {
          dataProvider: dataProvider,
          footprintSet: footprintSet
        };

        bus.emit(EVT_ASTRO_PLOT_FOOTPRINTSET_res, { cid, ok: true, payload });
        // bus.emit('tap:footprintsetSelected', { ...payload });
      } catch (e: any) {
        bus.emit(EVT_ASTRO_PLOT_FOOTPRINTSET_res, { cid, ok: false, error: e?.message ?? String(e) });
      }
    });

    // Broadcast
    this.api.onStateChanged?.((state) => bus.emit(EVT_ASTRO_STATE_CHANGED, { state }));
    bus.emit(EVT_ASTRO_READY, { version: this.api.version ?? '0.0.0' });

    const state = this.api.getState();
    bus.emit(EVT_ASTRO_STATE_CHANGED, { state });

  }
}
