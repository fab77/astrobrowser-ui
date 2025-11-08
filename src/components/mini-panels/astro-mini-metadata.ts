import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CATALOGUE_TYPE, type MiniMetadataPanel } from '../../types';
import { bus } from '../../bus';
import { AstroMiniMetadataController } from './astro-mini-metadata.controller';
import '../mini-components/astro-select-field';
import type { MetadataColumn } from 'astroviewer';
import { EVT_ASTRO_META_RA_CHANGED, EVT_ASTRO_META_DEC_CHANGED, EVT_ASTRO_META_HUE_CHANGED, EVT_ASTRO_META_SIZE_CHANGED } from '../../events';

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
    header { display:flex; align-items:center; justify-content:space-between;
      gap: 12px; padding:10px 12px; border-bottom:1px solid #eee; background:#fafafa; }
    header .title { font-weight:600; }
    .controls { display:flex; flex-wrap:wrap; gap:8px 12px; align-items:center; }
    button.close { all: unset; cursor:pointer; padding:4px 8px; border:1px solid #ddd; border-radius:8px; background:#fff; }
    main { overflow:auto; padding:10px 12px; }
    .grid { display:grid; gap:8px; }
    .muted { color:#888; }
  `;

  @property({ attribute: false }) model!: MiniMetadataPanel;

  private ctl!: AstroMiniMetadataController;

  connectedCallback(): void {
    super.connectedCallback();
    this.ctl = new AstroMiniMetadataController(this, this.model);
  }

  private onClose = () => this.remove();

  // ---- select handlers (thin -> forward to bus) ----
  private onRaChanged = (e: CustomEvent<{ value: string }>) => {
    const value = e.detail.value;
    this.ctl.selectedRa = value === '-' ? undefined : value;
    if (this.ctl.selectedRa && this.ctl.isCatalogue) {
      bus.emit(EVT_ASTRO_META_RA_CHANGED, { catalogue: this.model.catOrFoot, column: this.ctl.selectedRa });
    }
  };

  private onDecChanged = (e: CustomEvent<{ value: string }>) => {
    const value = e.detail.value;
    this.ctl.selectedDec = value === '-' ? undefined : value;
    if (this.ctl.selectedDec && this.ctl.isCatalogue) {
      bus.emit(EVT_ASTRO_META_DEC_CHANGED, { catalogue: this.model.catOrFoot, column: this.ctl.selectedDec });
    }
  };

  private onHueChanged = (e: CustomEvent<{ value: string }>) => {
    const value = e.detail.value;
    this.ctl.selectedHue = value === '-' ? 'STANDARD_HUE' : value;
    if (this.ctl.isCatalogue) {
      bus.emit(EVT_ASTRO_META_HUE_CHANGED, { catalogue: this.model.catOrFoot, column: this.ctl.selectedHue });
    }
  };

  private onSizeChanged = (e: CustomEvent<{ value: string }>) => {
    const value = e.detail.value;
    this.ctl.selectedShape = value === '-' ? 'STANDARD_SIZE' : value;
    if (this.ctl.isCatalogue) {
      bus.emit(EVT_ASTRO_META_SIZE_CHANGED, { catalogue: this.model.catOrFoot, column: this.ctl.selectedShape });
    }
  };

  // checkbox behaviour (kept, but tiny)
  private onCheckboxChange(row: MetadataColumn) {
    const name = row.name as string | undefined;
    if (!name) return;

    if (this.model.datasetType === CATALOGUE_TYPE) {
      if (this.ctl.isIn(this.ctl.raColumns, row)) this.ctl.selectedRa = name;
      if (this.ctl.isIn(this.ctl.decColumns, row)) this.ctl.selectedDec = name;
    } else {
      // footprint outline
      this.ctl.selectedOutline = name;
    }
    this.requestUpdate();
  }

  private getDetail(row: MetadataColumn, key: string) {
    return (row.details && row.details.get(key)) ?? html`<span class="muted">—</span>`;
  }

  render() {
    const { raColumns, decColumns, shapeColumns, hueColumns, rows, detailKeys } = this.ctl;

    const headerNames = ['pos', 'name', 'description', 'unit', ...detailKeys];

    return html`
      <header>
        <div class="title">${this.model?.catOrFoot?.name || this.model?.catOrFoot?.id}</div>
        <div class="controls">
          ${this.ctl.isCatalogue ? html`
            <astro-select-field
              label="RA:"
              .options=${this.ctl.buildOptions(raColumns, this.ctl.selectedRa)}
              .value=${this.ctl.selectedRa ?? ''}
              @change=${this.onRaChanged}
            ></astro-select-field>

            <astro-select-field
              label="Dec:"
              .options=${this.ctl.buildOptions(decColumns, this.ctl.selectedDec)}
              .value=${this.ctl.selectedDec ?? ''}
              @change=${this.onDecChanged}
            ></astro-select-field>

            <astro-select-field
              label="Shape:"
              .options=${this.ctl.buildOptions(shapeColumns, this.ctl.selectedShape, /*withDash*/ true)}
              .value=${this.ctl.selectedShape ?? '-'}
              @change=${this.onSizeChanged}
            ></astro-select-field>

            <astro-select-field
              label="Hue:"
              .options=${this.ctl.buildOptions(hueColumns, this.ctl.selectedHue, /*withDash*/ true)}
              .value=${this.ctl.selectedHue ?? '-'}
              @change=${this.onHueChanged}
            ></astro-select-field>
          ` : null}
        </div>
        <button class="close" @click=${this.onClose} aria-label="Close">×</button>
      </header>

      <main>
        ${this.model?.catOrFoot?.description ? html`<p class="muted">${this.model.catOrFoot.description}</p>` : null}

        ${rows.length === 0 ? html`<div class="muted">No metadata available.</div>` : html`
          <div class="grid" style=${`grid-template-columns: repeat(${headerNames.length}, minmax(80px, auto));`}>
            ${headerNames.map(h => html`<div class="muted">${h}</div>`)}
            ${rows.map(row => {
              const isPos = this.ctl.isPosColumn(row);

              // emulate your previous "checked/disabled" behaviour
              let checked = false, disabled = false;
              if (this.ctl.isCatalogue) {
                if (this.ctl.isIn(raColumns, row)) {
                  checked = row.name === this.ctl.selectedRa;
                  if (this.ctl.selectedRa && row.name !== this.ctl.selectedRa) disabled = true;
                } else if (this.ctl.isIn(decColumns, row)) {
                  checked = row.name === this.ctl.selectedDec;
                  if (this.ctl.selectedDec && row.name !== this.ctl.selectedDec) disabled = true;
                }
              }

              return html`
                <div>
                  ${isPos ? html`
                    <input type="checkbox"
                      ?checked=${checked}
                      ?disabled=${disabled}
                      @change=${() => this.onCheckboxChange(row)}
                    />
                  ` : html`<span class="muted"></span>`}
                </div>

                <div><code>${row.name}</code></div>
                <div>${row.description ?? html`<span class="muted">—</span>`}</div>
                <div>${row.unit ?? html`<span class="muted">—</span>`}</div>
                ${this.ctl.detailKeys.map(k => html`<div>${this.getDetail(row, k)}</div>`)}
              `;
            })}
          </div>
        `}
      </main>
    `;
  }
}