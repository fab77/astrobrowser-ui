import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { bus, cid } from '../../bus';
import { AstroTapCatalogueLoadedResPayload, Catalogue, DataProvider, Metadata, TapRepoLoadedPayload } from 'src/types';
import { dataProviderStore } from '../../stores/DataProviderStore';
import '../mini-panels/astro-mini-metadata'; // <-- make sure path matches where you put it

@customElement('astro-catalogue-table')
export class AstroCatalogueTable extends LitElement {
  static styles = css`
    :host { display:block; font: 13px/1.4 system-ui, sans-serif; color:#222; }
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

  // @state() private dataProvider: DataProvider = {
  //   type: 'TAP',
  //   url: '',
  //   functions: [],
  //   catalogues: [],
  //   footprints: []
  // };

  @state() dataProviders: DataProvider[] = []

  private unsubStore?: () => void;
  @state() private filter = '';

  private getDataProviderByURL(url: string): DataProvider {
    const dataProvider = this.dataProviders.find( p => p.url == url )
    if (!dataProvider)  {
      console.error('[astro-catalogue-table] load failed:');
      throw new Error(`Dataprovider ${url} not found`)
    }
    return dataProvider
  }
  
  // --- hydrate from store + bus so it's sticky and also reacts live
  private _onDataProviderLoaded = (payload: TapRepoLoadedPayload) => {
    const { dataProvider } = payload ?? {};
    if (dataProvider) this.dataProviders.push (dataProvider);
  };

  connectedCallback(): void {
    super.connectedCallback();
    this.unsubStore = dataProviderStore.subscribe((p) => { if (p) {
      // this.dataProvider = p;
      if (!this.dataProviders.includes(p))
        this.dataProviders.push(p)
    }  });
    bus.on('tap:repoLoaded', this._onDataProviderLoaded);
  }

  disconnectedCallback(): void {
    bus.off('tap:repoLoaded', this._onDataProviderLoaded);
    this.unsubStore?.();
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
    
    const allCatalogues = this.dataProviders.flatMap( p => p.catalogues)
    // if (!q) return this.dataProvider?.catalogues ?? [];
    if (!q) return allCatalogues ?? [];

    
    return ( allCatalogues ?? []).filter(c => {
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
    el.catalogue = c;
    el.providerUrl = c.provider ?? '';
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
        catalogue: c });
    });
  }

  private async _plotCatalogue(c: Catalogue) {
    if (!c) return
    try {

      const { dataProvider, catalogue } = await this._callPlotCatalogue(c)

      console.log(`Catalogue ${catalogue.name} loaded from ${dataProvider.url}`)
      // DOM event for local consumers
      this.dispatchEvent(new CustomEvent('tap:catalogueSelected', {
        bubbles: true, composed: true,
        detail: { repo: dataProvider.url, catalogues: c }
      }));

    } catch (err: any) {
      console.error('[astro-catalogue-table] load failed:', err);
      alert(`Failed to load Catalogue data for plot:\n${c.name}\n\n${err?.message ?? err}`);
    } finally {
      
    }
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
          ${this.dataProviders?.map (p => p.url
        ? html`<span class="pill">Repo</span>${p.url}`
        : html`<span class="muted">Waiting for TAP repo…</span>`)}
        </div>
      </header>

      ${rows.length === 0
        ? html`<div class="empty">
            ${this.dataProviders?.map( p => p.url ? html`No catalogues match your filter in ${p.url} .` : 'Load a TAP repository to see catalogues here.')}
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
              ${rows.map(c => html`
                <tr>
                  <td class="nowrap">
                    <div><strong>${c.name || c.id}</strong></div>
                    <div class="subtle">${c.name}</div>
                  </td>
                  <td>${c.description || html`<span class="muted">—</span>`}</td>
                  <td class="nowrap"> ${this.dataProviders.map( p => p.url)|| html`<span class="muted">—</span>`}</td>
                  <td class="nowrap">
                    <button class="btn" @click=${() => this.openMetadataPanel(c)}>Show metadata</button>
                    <button class="btn" @click=${() => this._plotCatalogue(c)}>Plot</button>
                  </td>
                </tr>
              `)}
            </tbody>
          </table>
        `}
    `;
  }
}