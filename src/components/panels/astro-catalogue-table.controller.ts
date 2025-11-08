// src/components/controllers/astro-catalogue-table.controller.ts
import { ReactiveController, ReactiveControllerHost } from 'lit';
import { bus, cid } from '../../bus';
import { dataProviderStore } from '../../stores/DataProviderStore';
import {
  AstroTapCatalogueLoadedResPayload,
  AstroEntity, DataProvider, Metadata,
  CATALOGUE_TYPE, MiniMetadataPanel
} from '../../types';

type CtlDeps = { getDataProviders: () => DataProvider[]; openMiniPanel: (m: MiniMetadataPanel) => void; };

export class AstroCatalogueTableController implements ReactiveController {
  private host: ReactiveControllerHost;
  private deps: CtlDeps;

  filter = '';
  activeCatalogues: AstroEntity[] = [];
  get dataProviders(): DataProvider[] { return this.deps.getDataProviders(); }

  constructor(host: ReactiveControllerHost, deps: CtlDeps) {
    (this.host = host).addController(this);
    this.deps = deps;
  }

  hostConnected() {
    // prime active list from store
    this.activeCatalogues = dataProviderStore.getAllActiveCatalogues();
    this.host.requestUpdate();
  }

  /** Narrow columns source to one place */
  getColumns(c: AstroEntity): Metadata[] {
    const fromMD = c.astroviewerGlObj?.metadataManager.columns ?? [];
    const fromColumns = Array.isArray((c as any).columns) ? ((c as any).columns as Metadata[]) : [];
    return (fromMD.length ? fromMD : fromColumns).filter(Boolean);
  }

  /** Filtering logic kept out of render() */
  filteredCatalogues(): AstroEntity[] {
    const q = this.filter.trim().toLowerCase();
    const all = this.dataProviders.flatMap(p => p.catalogues) ?? [];
    if (!q) return all;

    return all.filter(c => {
      const cols = this.getColumns(c);
      const hay = [
        c.name, c.description, c.providerUrl,
        ...cols.map(col => `${col.name} ${col.description} ${col.dataType} ${col.ucd} ${col.unit}`)
      ].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    });
  }

  /** Resolve a provider by URL (shared across actions) */
  private providerByUrl(url: string): DataProvider {
    const p = this.dataProviders.find(x => x.url === url);
    if (!p) throw new Error(`Dataprovider ${url} not found`);
    return p;
  }

  /** Request/response choreography via bus with cid + timeout */
  private callPlot(c: AstroEntity): Promise<{ dataProvider: DataProvider; catalogue: AstroEntity }> {
    const correlation = cid();
    return new Promise((resolve, reject) => {
      const off = bus.on('astro.plot.catalogue:res', (msg: AstroTapCatalogueLoadedResPayload) => {
        if (msg.cid !== correlation) return;
        off();
        clearTimeout(t);
        if (msg.ok) resolve(msg.payload);
        else reject(new Error(msg.error ?? 'Unknown Catalogue plot error'));
      });
      const t = setTimeout(() => { off(); reject(new Error('Timeout waiting for TAP repo response')); }, 15000);

      bus.emit('astro.plot.catalogue:req', {
        cid: correlation,
        dataProvider: this.providerByUrl(c.providerUrl),
        catalogue: c
      });
    });
  }

  // ---------- Actions exposed to host ----------
  async plotCatalogue(c: AstroEntity) {
    if (!c) return;
    const { dataProvider, catalogue } = await this.callPlot(c);
    // reflect store changes in the controller state
    dataProviderStore.addToActiveCatalogues(catalogue);
    this.activeCatalogues = [...dataProviderStore.getAllActiveCatalogues()];
    this.host.requestUpdate();
    return { dataProvider, catalogue };
  }

  hideCatalogue(c: AstroEntity) {
    const isVisible = !c.astroviewerGlObj?.isVisible || false;
    bus.emit('astro.plot.catalogue:show', { catalogue: c, isVisible });
  }

  removeCatalogue(c: AstroEntity) {
    bus.emit('astro.plot.catalogue:remove', { catalogue: c });
    dataProviderStore.removeFromActiveCatalogues(c);
    this.activeCatalogues = [...dataProviderStore.getAllActiveCatalogues()];
    this.host.requestUpdate();
  }

  changeColour(c: AstroEntity, hex: string) {
    bus.emit('astro.metadata:colorChanged', { catalogue: c, hexColor: hex });
  }

  openMetadata(c: AstroEntity) {
    if (!c.astroviewerGlObj?.metadataManager.columns) return;
    this.deps.openMiniPanel({ catOrFoot: c, datasetType: CATALOGUE_TYPE });
  }
}