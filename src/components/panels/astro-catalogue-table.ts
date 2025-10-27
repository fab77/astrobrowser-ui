import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { bus } from '../../bus';
import { Catalogue, DataProvider, Metadata, TapRepoLoadedPayload } from 'src/types';
import { dataProviderStore } from '../../stores/DataProviderStore';

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
    details { margin:4px 0; }
    .cols { display:grid; grid-template-columns: 1fr auto auto auto auto; gap:8px; }
    .cols > div { padding:2px 0; border-bottom:1px dotted #eee; }
    .muted { color:#888; }
    .subtle { font-size:12px; color:#666; }
    .nowrap { white-space:nowrap; }
    .empty { padding:18px 10px; color:#777; }
  `;

  @state() private dataProvider: DataProvider = {
    type: 'TAP',
    url: '',
    functions: [],
    catalogues: [],
    footprints: []
  };

  private unsubStore?: () => void;

  @state() private filter = '';

  // ---- helpers -------------------------------------------------------------
  private getColumns(c: Catalogue): Metadata[] {
    // Your type uses metadataList?: MetadataDetails
    const fromMetadataDetails = c.metadataList?.metadataList ?? [];
    // Allow adapters to provide "columns" as a fallback
    const fromColumns = Array.isArray((c as any).columns) ? ((c as any).columns as Metadata[]) : [];
    return (fromMetadataDetails.length ? fromMetadataDetails : fromColumns).filter(Boolean);
  }

  private getRowCount(c: Catalogue): number | undefined {
    const n = (c as any).nrows ?? (c as any).rows ?? (c as any).rowCount ?? (c as any).estRows;
    return typeof n === 'number' ? n : undefined;
  }

  // ---- bus -----------------------------------------------------------------
  private _onDataProviderLoaded = (payload: TapRepoLoadedPayload) => {
    const { dataProvider } = payload ?? {};
    if (dataProvider) this.dataProvider = dataProvider;
  };

  connectedCallback(): void {
    super.connectedCallback();
    // 1) Subscribe to the sticky store (instant hydrate + future updates)
    this.unsubStore = dataProviderStore.subscribe((p) => {
      if (p) this.dataProvider = p;
    });
    // 2) (Optional) still listen to the bus
    bus.on('tap:repoLoaded', this._onDataProviderLoaded);
  }

  disconnectedCallback(): void {
    bus.off('tap:repoLoaded', this._onDataProviderLoaded);
    this.unsubStore?.();
    super.disconnectedCallback();
  }

  // ---- filtering -----------------------------------------------------------
  private filtered(): Catalogue[] {
    const q = this.filter.trim().toLowerCase();
    if (!q) return this.dataProvider?.catalogues ?? [];
    return (this.dataProvider?.catalogues ?? []).filter(c => {
      const cols = this.getColumns(c);
      const hay = [
        c.id,
        c.name,
        c.description,
        c.provider,
        ...cols.map(col => `${col.name} ${col.description} ${col.dataType} ${col.ucd} ${col.unit}`)
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }

  private onSelectCatalogue(c: Catalogue) {
    bus.emit('tap:catalogueSelected', { repo: this.dataProvider?.url, catalogue: c });
  }

  // ---- render --------------------------------------------------------------
  render() {
    const rows = this.filtered();
    return html`
      <header>
        <input
          type="search"
          placeholder="Filter catalogues, columns, UCDs, units…"
          @input=${(e: Event) => (this.filter = (e.target as HTMLInputElement).value)}
        />
        <div class="meta">
          ${this.dataProvider?.url
        ? html`<span class="pill">Repo</span>${this.dataProvider.url}`
        : html`<span class="muted">Waiting for TAP repo…</span>`}
        </div>
      </header>

      ${rows.length === 0
        ? html`<div class="empty">
            ${this.dataProvider?.url
            ? 'No catalogues match your filter.'
            : 'Load a TAP repository to see catalogues here.'}
          </div>`
        : html`
            <table>
              <thead>
                <tr>
                  <th class="nowrap">Catalogue</th>
                  <th>Description</th>
                  <th class="nowrap">Rows</th>
                  <th class="nowrap">Columns</th>
                </tr>
              </thead>
              <tbody>
                ${rows.map(c => {
          const cols = this.getColumns(c);
          const nrows = this.getRowCount(c);
          return html`
                    <tr @click=${() => this.onSelectCatalogue(c)} style="cursor:pointer">
                      <td class="nowrap">
                        <div><strong>${c.name || c.id}</strong></div>
                        <div class="subtle">${c.id}${c.provider ? ` · ${c.provider}` : ''}</div>
                      </td>
                      <td>
                        ${c.description || html`<span class="muted">—</span>`}
                        ${cols.length
              ? html`<details>
                              <summary>Show columns (${cols.length})</summary>
                              <div class="cols">
                                <div class="muted">name</div>
                                <div class="muted">type</div>
                                <div class="muted">unit</div>
                                <div class="muted">ucd</div>
                                <div class="muted">description</div>
                                ${cols.map(col => html`
                                  <div><code>${col.name}</code></div>
                                  <div>${col.dataType ?? html`<span class="muted">—</span>`}</div>
                                  <div>${col.unit ?? html`<span class="muted">—</span>`}</div>
                                  <div>${col.ucd ?? html`<span class="muted">—</span>`}</div>
                                  <div>${col.description ?? html`<span class="muted">—</span>`}</div>
                                `)}
                              </div>
                            </details>`
              : null}
                      </td>
                      <td class="nowrap">
                        ${typeof nrows === 'number' ? nrows.toLocaleString() : html`<span class="muted">—</span>`}
                      </td>
                      <td class="nowrap">${cols.length}</td>
                    </tr>
                  `;
        })}
              </tbody>
            </table>
          `}
    `;
  }
}