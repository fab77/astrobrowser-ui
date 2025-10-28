// FILE: src/panels/mini-panels/astro-mini-metadata.ts
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Catalogue, Metadata } from 'src/types';

@customElement('astro-mini-metadata')
export class AstroMiniMetadata extends LitElement {
  static styles = css`
    :host {
      position: fixed; right: 16px; bottom: 16px;
      width: min(720px, calc(100vw - 32px));
      max-height: min(70vh, calc(100vh - 32px));
      display:flex; flex-direction:column;
      background:#fff; border:1px solid #ddd; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,.12);
      overflow:hidden; z-index: 9999;
      font: 13px/1.4 system-ui, sans-serif; color:#222;
    }
    header {
      display:flex; align-items:center; justify-content:space-between;
      padding:10px 12px; border-bottom:1px solid #eee; background:#fafafa;
    }
    header .title { font-weight:600; }
    header .meta { font-size:12px; color:#666; }
    button.close {
      all: unset; cursor:pointer; padding:4px 8px; border:1px solid #ddd; border-radius:8px; background:#fff;
    }
    main { overflow:auto; padding:10px 12px; }
    .cols { display:grid; grid-template-columns: 1fr auto auto auto auto; gap:8px; }
    .cols > div { padding:2px 0; border-bottom:1px dotted #eee; }
    .muted { color:#888; }
    .rowhead { position: sticky; top:0; background:#fff; }
    .head { font-size:12px; color:#666; }
  `;

  @property({ attribute: false }) catalogue!: Catalogue;
  @property({ attribute: false }) providerUrl: string = '';

  private getColumns(): Metadata[] {
    const fromMD = this.catalogue?.metadataList?.metadataList ?? [];
    const fromColumns = Array.isArray((this.catalogue as any)?.columns)
      ? ((this.catalogue as any).columns as Metadata[])
      : [];
    return (fromMD.length ? fromMD : fromColumns).filter(Boolean);
  }

  private onClose = () => {
    this.remove(); // remove self from DOM
  };

  render() {
    // const cols = this.getColumns();
    const cols = this.catalogue.metadataDetails?.metadataList || []
    return html`
      <header>
        <div>
          <div class="title">${this.catalogue?.name || this.catalogue?.id}</div>
        </div>
        <button class="close" @click=${this.onClose}>×</button>
      </header>
      <main>
        ${this.catalogue?.description
        ? html`<p class="head">${this.catalogue.description}</p>`
        : null}
        ${cols.length === 0
        ? html`<div class="muted">No metadata available.</div>`
        : html`
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
            `}
      </main>
    `;
  }
}