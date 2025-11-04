import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { bus, cid } from '../../bus';
import { AstroTapCatalogueLoadedResPayload, Catalogue, CATALOGUE_TYPE, DataProvider, Metadata, MiniMetadataPanel } from '../../types';
import '../mini-panels/astro-mini-metadata'; // <-- make sure path matches where you put it
import { dataProviderStore } from '../../stores/DataProviderStore';

@customElement('astro-catalogue-table')
export class AstroCatalogueTable extends LitElement {
  static styles = css`
    :host { 
      display:block; 
      font: 13px/1.4 system-ui, sans-serif; 
      height: 45%;
      overflow: scroll; 
    }
      
    header {
      display:flex; align-items:center; gap:8px; padding:8px 10px;
      border-bottom:1px solid #eee; position:sticky; top:0; background:#fff; z-index:1;
    }
    input[type="search"]{
      flex:1; padding:6px 8px; border:1px solid #ddd; border-radius:8px;
    }
    .meta { font-size:12px; color:#666; }

    table { border-collapse:collapse; width:100%; }
    th, td { text-align:left; padding:8px 10px; border-bottom:1px solid #f0f0f0; vertical-align:top; }
    th { background:#fafafa; position:sticky; top:42px; z-index:1; }
    tbody tr:hover { background:#fcfcff; }
    
    .color-cell { display:flex; align-items:center; gap:8px; }
    .swatch { width:16px; height:16px; border-radius:4px; border:1px solid #ccc; }
    .color-input { inline-size: 32px; block-size: 24px; border: none; padding: 0; background: transparent; cursor: pointer; }

    .pill { display:inline-block; padding:2px 6px; border-radius:999px; background:#f2f2f2; font-size:11px; margin-right:6px; }
    .muted { color:#888; }
    .subtle { font-size:12px; color:#666; }
    .nowrap { white-space:nowrap; }
    .empty { padding:18px 10px; color:#777; }
    .btn {
      all: unset; cursor: pointer; padding:6px 10px; border:1px solid #ddd; border-radius:8px;
      transition: background .15s ease;
    }
    .btn + .btn { margin-left:6px; }
    .btn:hover { background:#f8f8f8; }
  `;

  @property({ attribute: false })
  dataProviders: DataProvider[] = []

  @state() activeCatalogues: Catalogue[] = []

  // private unsubStore?: () => void;
  @state() private filter = '';

  private getDataProviderByURL(url: string): DataProvider {
    const dataProvider = this.dataProviders.find(p => p.url == url)
    if (!dataProvider) {
      const errmsg = `Dataprovider ${url} not found`
      console.error(errmsg);
      throw new Error(errmsg)
    }
    return dataProvider
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.activeCatalogues = dataProviderStore.getAllActiveCatalogues()
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  // ---- helpers -------------------------------------------------------------
  private getColumns(c: Catalogue): Metadata[] {
    const fromMD = c.metadataList?.metadataList ?? [];
    const fromColumns = Array.isArray((c as any).columns) ? ((c as any).columns as Metadata[]) : [];
    return (fromMD.length ? fromMD : fromColumns).filter(Boolean);
  }

  // ---- filtering -----------------------------------------------------------
  private filtered(): Catalogue[] {
    const q = this.filter.trim().toLowerCase();

    const allCatalogues = this.dataProviders.flatMap(p => p.catalogues)
    // if (!q) return this.dataProvider?.catalogues ?? [];
    if (!q) return allCatalogues ?? [];


    return (allCatalogues ?? []).filter(c => {
      const cols = this.getColumns(c);
      const hay = [
        c.name, c.description, c.provider,
        ...cols.map(col => `${col.name} ${col.description} ${col.dataType} ${col.ucd} ${col.unit}`)
      ].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    });
  }

  private openMetadataPanel(c: Catalogue) {
    // spawn a floating mini-panel; doesn’t affect current panel
    const el = document.createElement('astro-mini-metadata') as any;
    if (!c.metadataDetails) return

    const model: MiniMetadataPanel = {
      catOrFoot: c,
      datasetType: CATALOGUE_TYPE
    }

    el.model = model;
    document.body.appendChild(el);
  }

  private _callPlotCatalogue(c: Catalogue): Promise<{ dataProvider: DataProvider, catalogue: Catalogue }> {
    const correlation = cid();
    return new Promise((resolve, reject) => {
      const off = bus.on('astro.plot.catalogue:res', (msg: AstroTapCatalogueLoadedResPayload) => {
        if (msg.cid !== correlation) return;
        off();
        if (msg.ok) {
          // ok === true branch has payload guaranteed by the discriminated union
          safeResolve(msg.payload); // <- here is where the dataProvider and catalogue are returned
        } else {
          safeReject(new Error(msg.error ?? 'Unknown Catalogue plot error'));
        }
      });

      // Timeout guard
      const t = setTimeout(() => {
        off();
        reject(new Error('Timeout waiting for TAP repo response'));
      }, 15000);

      // Ensure cleanup if resolved early
      const safeResolve = (v: any) => { clearTimeout(t); resolve(v); };
      const safeReject = (e: any) => { clearTimeout(t); reject(e); };

      // Re-emit using the originals so we don't capture the wrapped ones
      bus.emit('astro.plot.catalogue:req', {
        cid: correlation,
        dataProvider: this.getDataProviderByURL(c.provider),
        catalogue: c
      });
    });
  }

  private async _plotCatalogue(c: Catalogue) {
    if (!c) return
    try {

      const { dataProvider, catalogue } = await this._callPlotCatalogue(c)

      console.log(`Catalogue ${catalogue.name} loaded from ${dataProvider.url}`)
      console.log(`Catalogue hue column name ${catalogue.astroviewerGlObj.catalogueProps.shapeHueColumn?.name} `)
      
      // this.activeCatalogues = [...this.activeCatalogues, c];  // <-- this will trigger the reactivity, not the push
      // this.activeCatalogues = dataProviderStore.addToActiveCatalogues(dataProvider, catalogue)
      this.activeCatalogues = []
      this.activeCatalogues = dataProviderStore.addToActiveCatalogues(catalogue)

    } catch (err: any) {
      console.error('[astro-catalogue-table] load failed:', err);
      alert(`Failed to load Catalogue data for plot:\n${c.name}\n\n${err?.message ?? err}`);
    } finally {

    }
  }

  private async _hideCatalogue(cat: Catalogue) {
    const isVisible = !cat.astroviewerGlObj._isVisible
    bus.emit('astro.plot.catalogue:show', { catalogue: cat, isVisible: isVisible });
  }

  private async _removeCatalogue(cat: Catalogue) {
    bus.emit('astro.plot.catalogue:remove', { catalogue: cat });
    // this.activeCatalogues = this.activeCatalogues.filter(c => c !== cat);
    // this.activeCatalogues = dataProviderStore.removeFromActiveCatalogues(cat.provider, cat)
    this.activeCatalogues = dataProviderStore.removeFromActiveCatalogues(cat)
  }

  private _onColorPicked(cat: Catalogue, ev: Event) {
    const hex = (ev.target as HTMLInputElement).value;
    bus.emit('astro.metadata:colorChanged', { catalogue: cat, hexColor: hex });
  }


  // ---- render --------------------------------------------------------------
  render() {
    const rows = this.filtered();
    return html`
      <header>
        <input type="search" placeholder="Filter by name, description, URL, columns…"
          @input=${(e: Event) => (this.filter = (e.target as HTMLInputElement).value)}
        />

        <div class="meta">
          ${this.dataProviders?.map(p => p.url
      ? html`<span class="pill">Repo</span>${p.url}`
      : html`<span class="muted">Waiting for TAP repo…</span>`)}
        </div>
      </header>

      ${rows.length === 0
        ? html`<div class="empty">
            ${this.dataProviders?.map(p => p.url ? html`No catalogues match your filter in ${p.url} .` : 'Load a TAP repository to see catalogues here.')}
          </div>`
        : html`
          <table>
            <thead>
              <tr>
                <th class="nowrap">Catalogue</th>
                <th>Description</th>
                <th class="nowrap">Repository URL</th>
                <th class="nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map(cat => {
          return html`
                <tr>
                  <td class="nowrap">
                    <div><strong>${cat.name}</strong></div>
                    <div class="subtle">${cat.name}</div>
                  </td>
                  <td>${cat.description || html`<span class="muted">—</span>`}</td>
                  <td class="nowrap"> ${cat.provider || html`<span class="muted">—</span>`}</td>
                  <td class="nowrap">
                    <button class="btn" @click=${() => this._plotCatalogue(cat)}>Plot</button>
                  </td>
                </tr>
                
              `})}
            </tbody>
          </table>
          <table id="activeCatalogues">
            <thead>
              <tr>
                <th class="nowrap">Selected Catalogues</th>
                <th>Description</th>
                <th class="nowrap">Repository URL</th>
                <th class="nowrap">Actions</th>
                <th>Colour</th>
              </tr>
            </thead>
            <tbody>
              ${this.activeCatalogues.map(cat => {
            const currentHex = cat.astroviewerGlObj.catalogueProps.shapeColor ?? '#4f46e5';
            return html`
                <tr>
                  <td class="nowrap">
                    <div><strong>${cat.name}</strong></div>
                    <div class="subtle">${cat.name}</div>
                  </td>
                  <td>${cat.description || html`<span class="muted">—</span>`}</td>
                  <td class="nowrap"> ${cat.provider || html`<span class="muted">—</span>`}</td>
                  <td class="nowrap">
                    <button class="btn" @click=${() => this.openMetadataPanel(cat)}>Show metadata</button>
                    <button class="btn" @click=${() => this._hideCatalogue(cat)}>Hide</button>
                    <button class="btn" @click=${() => this._removeCatalogue(cat)}>Remove</button>
                  </td>
                  <td>
                  <div class="color-cell">
                    <input
                      class="color-input"
                      type="color"
                      .value=${currentHex}
                      @input=${(e: Event) => this._onColorPicked(cat, e)}
                      title="Pick colour"
                    />
                  </div>
                </td>
                </tr>  `})}
            </tbody>
          </table>
        `}
    `;
  }
}