import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { bus, cid } from '../../bus';
import { AstroTaFootprintSetLoadedResPayload, AstroEntity, DataProvider, Metadata,  MiniMetadataPanel,  FOOTPRINTSET_TYPE } from '../../types';
import '../mini-panels/astro-mini-metadata'; // <-- make sure path matches where you put it

@customElement('astro-footprintset-table')
export class AstroFootprintSetTable extends LitElement {
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

  @property() dataProviders: DataProvider[] = []

  // private unsubStore?: () => void;
  @state() private filter = '';

  private getDataProviderByURL(url: string): DataProvider {
    const dataProvider = this.dataProviders.find( p => p.url == url )
    if (!dataProvider)  {
      const errmsg = `Dataprovider ${url} not found`
      console.error(errmsg);
      throw new Error(errmsg)
    }
    return dataProvider
  }
  
  connectedCallback(): void {
    super.connectedCallback();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  // ---- helpers -------------------------------------------------------------
  private getColumns(f: AstroEntity): Metadata[] {
    const fromMD = f.astroviewerGlObj?.metadataManager.columns ?? [];
    const fromColumns = Array.isArray((f as any).columns) ? ((f as any).columns as Metadata[]) : [];
    return (fromMD.length ? fromMD : fromColumns).filter(Boolean);
  }

  // ---- filtering -----------------------------------------------------------
  private filtered(): AstroEntity[] {
    const q = this.filter.trim().toLowerCase();
    
    const allFootprintSet = this.dataProviders.flatMap( p => p.footprints)
    if (!q) return allFootprintSet ?? [];

    
    return ( allFootprintSet ?? []).filter(f => {
      const cols = this.getColumns(f);
      const hay = [
        f.name, f.description, f.providerUrl,
        ...cols.map(col => `${col.name} ${col.description} ${col.dataType} ${col.ucd} ${col.unit}`)
      ].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    });
  }


// MiniMetadataPanel
  private openMetadataPanel(f: AstroEntity) {
    // spawn a floating mini-panel; doesn’t affect current panel
    const el = document.createElement('astro-mini-metadata') as any;
    if (!f.astroviewerGlObj?.metadataManager.columns) return
    
    const model: MiniMetadataPanel = {
      catOrFoot: f,
      datasetType: FOOTPRINTSET_TYPE
    }

    el.model = model;
    document.body.appendChild(el);
  }

  private _callPlotFootprintSet(f: AstroEntity): Promise<{ dataProvider: DataProvider, footprintSet: AstroEntity }> {
    const correlation = cid();
    return new Promise((resolve, reject) => {
      const off = bus.on('astro.plot.footprintset:res', (msg: AstroTaFootprintSetLoadedResPayload) => {
        if (msg.cid !== correlation) return;
        off();
        if (msg.ok) {
          // ok === true branch has payload guaranteed by the discriminated union
          safeResolve(msg.payload); // <- here is where the dataProvider and footprintSet are returned
        } else {
          safeReject(new Error(msg.error ?? 'Unknown FootprintSet plot error'));
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
      bus.emit('astro.plot.footprintset:req', { 
        cid: correlation, 
        dataProvider: this.getDataProviderByURL(f.providerUrl), 
        footprintSet: f });
    });
  }

  private async _plotFootprintSet(f: AstroEntity) {
    if (!f) return
    try {

      const { dataProvider, footprintSet } = await this._callPlotFootprintSet(f)

      console.log(`FootprontSets ${footprintSet.name} loaded from ${dataProvider.url}`)
      // DOM event for local consumers
      this.dispatchEvent(new CustomEvent('tap:footprintsetSelected', {
        bubbles: true, composed: true,
        detail: { repo: dataProvider.url, footprintSet: f }
      }));

    } catch (err: any) {
      console.error('[astro-footprintSet-table] load failed:', err);
      alert(`Failed to load footprintSet data for plot:\n${f.name}\n\n${err?.message ?? err}`);
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
            ${this.dataProviders?.map( p => p.url ? html`No footprontSets match your filter in ${p.url} .` : 'Load a TAP repository to see catalogues here.')}
          </div>`
        : html`
          <table>
            <thead>
              <tr>
                <th class="nowrap">FootprontSet</th>
                <th>Description</th>
                <th class="nowrap">Repository URL</th>
                <th class="nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map(f => html`
                <tr>
                  <td class="nowrap">
                    <div><strong>${f.name || f.id}</strong></div>
                    <div class="subtle">${f.name}</div>
                  </td>
                  <td>${f.description || html`<span class="muted">—</span>`}</td>
                  <td class="nowrap"> ${f.providerUrl || html`<span class="muted">—</span>`}</td>
                  <td class="nowrap">
                    <button class="btn" @click=${() => this.openMetadataPanel(f)}>Show metadata</button>
                    <button class="btn" @click=${() => this._plotFootprintSet(f)}>Plot</button>
                  </td>
                </tr>
              `)}
            </tbody>
          </table>
        `}
    `;
  }
}