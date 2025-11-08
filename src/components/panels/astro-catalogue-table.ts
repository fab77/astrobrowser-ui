// src/components/astro-catalogue-table.ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DataProvider, MiniMetadataPanel } from '../../types';
import { AstroCatalogueTableController } from './astro-catalogue-table.controller';
import '../mini-panels/astro-mini-metadata';
import '../mini-components/astro-tooltip-icon'

@customElement('astro-catalogue-table')
export class AstroCatalogueTable extends LitElement {
  static styles = css`
    :host { 
      display:block; 
      font: 13px/1.4 system-ui, sans-serif; 
    }

    header {
      display:flex; align-items:center; gap:8px; padding:8px 10px;
      border-bottom:1px solid #eee; position:sticky; top:0; background:#fff; z-index:1;
    }
    input[type="search"]{
      flex:1; padding:6px 8px; border:1px solid #ddd; border-radius:8px;
    }
    .meta { font-size:12px; color:#666; }

    .section { margin-top: 10px; border:1px solid #eee; border-radius:10px; overflow:hidden; background:#fff; }
    .section-header {
      display:flex; align-items:center; gap:8px; padding:8px 10px;
      background:#fafafa; border-bottom:1px solid #eee;
      cursor:pointer; user-select:none;
    }
    .section-title { font-weight:600; }
    .chevron {
      inline-size: 18px; block-size: 18px;
      display:inline-grid; place-items:center;
      border:1px solid #ddd; border-radius:6px; background:#fff;
      font-weight:700;
      transform: rotate(0deg);
      transition: transform .15s ease;
    }
    .chevron.open { transform: rotate(90deg); }

    .table-scroll {
      --available-height: 260px;
      max-height: var(--available-height);
      overflow: auto;
    }

    table {
      border-collapse: collapse;
      width: 100%;
      table-layout: fixed;
    }

    th, td {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    #availableCatalogues col:nth-child(1) { width: 35%; }
    #availableCatalogues col:nth-child(2) { width: 45%; }
    #availableCatalogues col:nth-child(3) { width: 20%; }
    thead th { position: sticky; top: 0; background:#fafafa; z-index: 1; }
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

    .color-input { inline-size: 32px; block-size: 24px; border: none; padding: 0; background: transparent; cursor: pointer; }

    /* Info icon */
    .info-icon {
      display:inline-flex;
      align-items:center;
      justify-content:center;
      inline-size:16px;
      block-size:16px;
      margin-left:4px;
      font-weight:600;
      font-size:11px;
      color:#555;
      border:1px solid #ccc;
      border-radius:50%;
      background:#f9f9f9;
      cursor:help;
      position:relative;
    }
    .info-icon:hover {
      background:#eef;
      border-color:#bbb;
    }
    /* Link icon + tooltip */
  .repo-icon {
    position: relative;
    display: inline-grid;
    place-items: center;
    inline-size: 24px;
    block-size: 24px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: #fff;
    cursor: pointer;
    user-select: none;
  }
  .repo-icon:hover { background: #f7f7ff; }

  /* Use an inline SVG mark for crispness */
  .repo-icon svg { inline-size: 14px; block-size: 14px; }

  /* Tooltip via data attribute */
  .repo-icon[data-tip]:hover::after,
  .repo-icon[data-tip]:focus-visible::after {
    content: attr(data-tip);
    position: absolute;
    left: 50%;
    bottom: calc(100% + 8px);
    transform: translateX(-50%);
    max-width: 420px;
    padding: 6px 8px;
    border-radius: 6px;
    background: #111;
    color: #fff;
    font-size: 12px;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-shadow: 0 6px 16px rgba(0,0,0,.18);
    z-index: 2;
  }
  .repo-icon[data-tip]:hover::before,
  .repo-icon[data-tip]:focus-visible::before {
    content: "";
    position: absolute;
    left: 50%;
    bottom: 100%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #111;
    margin-bottom: 2px;
  }
  `;

  @property({ attribute: false }) dataProviders: DataProvider[] = [];
  @state() private _filter = '';
  @state() private availableOpen = true;

  private ctl = new AstroCatalogueTableController(this, {
    getDataProviders: () => this.dataProviders,
    openMiniPanel: (model: MiniMetadataPanel) => {
      const el = document.createElement('astro-mini-metadata') as any;
      el.model = model;
      document.body.appendChild(el);
    }
  });

  private onFilterInput = (e: Event) => {
    this._filter = (e.target as HTMLInputElement).value;
    this.ctl.filter = this._filter;
    this.requestUpdate();
  };

  private openRepo(url?: string) {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  private toggleAvailable = () => {
    this.availableOpen = !this.availableOpen;
  };

  render() {
    const rows = this.ctl.filteredCatalogues();
    const active = this.ctl.activeCatalogues;

    return html`
      <header>
        <input type="search" placeholder="Filter by name, description, URL, columns…"
          .value=${this._filter}
          @input=${this.onFilterInput} />
        <div class="meta">
          ${this.dataProviders?.map(p => p.url
            ? html`<span class="pill">Repo</span>${p.url}`
            : html`<span class="muted">Waiting for TAP repo…</span>`)}
        </div>
      </header>

      <!-- AVAILABLE CATALOGUES -->
      <div class="section" id="availableSection">
        <button class="section-header" @click=${this.toggleAvailable} aria-expanded=${this.availableOpen}>
          <span class="chevron ${this.availableOpen ? 'open' : ''}">›</span>
          <span class="section-title">Available Catalogues</span>
          <span class="muted">(${rows.length})</span>
        </button>

        ${rows.length === 0 ? html`
          <div class="empty">
            ${this.dataProviders?.map(p => p.url
              ? html`No catalogues match your filter in ${p.url}.`
              : 'Load a TAP repository to see catalogues here.')}
          </div>
        ` : html`
          <div class="table-scroll" ?hidden=${!this.availableOpen}>
            <table id="availableCatalogues" role="table" aria-label="Available catalogues">
              <colgroup>
                <col style="width: 60%">
                <col style="width: 25%">
                <col style="width: 15%">
              </colgroup>
              <thead>
                <tr>
                  <th class="nowrap">Catalogue</th>
                  <th class="nowrap">Repository URL</th>
                  <th class="nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${rows.map(cat => html`
                  <tr>
                    <td class="nowrap">
                      <div style="display:flex; align-items:center; gap:4px;">
                        <strong>${cat.name}</strong>
                        <span class="info-icon" title=${cat.description || 'No description available'}>?</span>
                      </div>
                      <!-- <div class="subtle">${cat.name}</div> -->
                    </td>
                    <td class="nowrap">
  ${cat.providerUrl ? html`
    <astro-tooltip-icon placement="bottom" icon-title="Open repository">
      <span slot="icon">🔗</span>
      <span slot="content">
        <a href=${cat.providerUrl} target="_blank" rel="noopener">${cat.providerUrl}</a>
      </span>
    </astro-tooltip-icon>
  ` : html`<span class="muted">—</span>`}
</td>
                    <td class="nowrap">
                      <button class="btn" @click=${() => this.ctl.plotCatalogue(cat)}>Plot</button>
                    </td>
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        `}
      </div>

      <!-- ACTIVE CATALOGUES -->
      <table id="activeCatalogues" style="margin-top:12px;">
        <thead>
          <tr>
            <th class="nowrap">Selected Catalogues</th>
            <th class="nowrap">Repository URL</th>
            <th class="nowrap">Actions</th>
            <th>Colour</th>
          </tr>
        </thead>
        <tbody>
          ${active.map(cat => {
            const currentHex = cat.astroviewerGlObj?.shapeColor ?? '#4f46e5';
            return html`
              <tr>
                <td class="nowrap">
                  <div style="display:flex; align-items:center; gap:4px;">
                    <strong>${cat.name}</strong>
                    <span class="info-icon" title=${cat.description || 'No description available'}>?</span>
                  </div>
                </td>
                <td class="nowrap">
                  ${cat.providerUrl
                    ? html`
                      <button
                        class="repo-icon"
                        data-tip=${cat.providerUrl}
                        @click=${() => this.openRepo(cat.providerUrl)}
                        aria-label="Open repository"
                        title=${cat.providerUrl}  
                        
                      >
                        <!-- tiny external-link svg -->
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3zM5 5h6v2H7v10h10v-4h2v6H5V5z"/>
                        </svg>
                      </button>
                    `
                    : html`<span class="muted">—</span>`}
                </td>
                <td class="nowrap">
                  <button class="btn" @click=${() => this.ctl.openMetadata(cat)}>Show metadata</button>
                  <button class="btn" @click=${() => this.ctl.hideCatalogue(cat)}>Hide</button>
                  <button class="btn" @click=${() => this.ctl.removeCatalogue(cat)}>Remove</button>
                </td>
                <td>
                  <input
                    class="color-input"
                    type="color"
                    .value=${currentHex}
                    @input=${(e: Event) => this.ctl.changeColour(cat, (e.target as HTMLInputElement).value)}
                    title="Pick colour"
                  />
                </td>
              </tr>
            `;
          })}
        </tbody>
      </table>
    `;
  }
}