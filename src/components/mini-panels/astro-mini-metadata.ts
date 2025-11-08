import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { CATALOGUE_TYPE, FOOTPRINTSET_TYPE, type MiniMetadataPanel } from '../../types';
import { bus } from '../../bus';
import { ColumnType, MetadataColumn } from 'astroviewer';


// const UCD_RA = 'pos.eq.ra';
// const UCD_DEC = 'pos.eq.dec';
// const UCD_OUTLINE = 'pos.outline;meta.pgsphere';

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
    button.close {
      all: unset; cursor:pointer; padding:4px 8px; border:1px solid #ddd; border-radius:8px; background:#fff;
    }
    main { overflow:auto; padding:10px 12px; }
    .cols {
      display: grid;
      gap: 8px;
    }
    .cols > div { padding:2px 0; border-bottom:1px dotted #eee; }
    .muted { color:#888; }
    .head { font-size:12px; color:#666; }
  `;

  @property({ attribute: false }) model!: MiniMetadataPanel;

  // store selected columns by name
  @state() private selectedRa?: string;
  @state() private selectedDec?: string;
  @state() private selectedShape?: string;
  @state() private selectedHue?: string;
  @state() private selectedOutline?: string;

  @state() private defaultRa?: string
  @state() private defaultDec?: string
  @state() private defaultOutline?: string

  connectedCallback(): void {
    super.connectedCallback();

    const glObj = this.model.catOrFoot.astroviewerGlObj
    if (!glObj) throw new Error(`No GL object associated to ${this.model.catOrFoot.name}`)
    // Prepopulate from metadata if present
    if (this.model.datasetType === CATALOGUE_TYPE) {

      const raName = glObj?.metadataManager.selectedRaColumn?.name
      if (raName) {
        this.selectedRa = raName;
        this.defaultRa = glObj?.metadataManager?.selectedRaColumn?.name;
      }

      const decName = glObj?.metadataManager?.selectedDecColumn?.name
      if (decName) {
        this.selectedDec = decName;
        this.defaultDec = glObj?.metadataManager?.selectedDecColumn?.name
      }

      const sizeName = glObj?.metadataManager?.selectedShapeColumn?.name
      if (sizeName) {
        this.selectedShape = sizeName;
      }

      const hueName = glObj?.metadataManager?.selectedHueColumn?.name
      if (hueName) {
        this.selectedHue = hueName
      }

    } else {
      const outlineName = glObj?.metadataManager?.selectedOutlineColumn?.name
      if (outlineName) {
        this.selectedOutline = outlineName;
        this.defaultOutline = glObj?.metadataManager?.selectedOutlineColumn?.name;
      }
    }
  }

  private onClose = () => {
    this.remove();
  };

  // helper: is this column "position-ish"?
  private isPosColumn(col: MetadataColumn): boolean {
    return (
      col.columnType == ColumnType.GEOM_DEC ||
      col.columnType == ColumnType.GEOM_RA ||
      col.columnType == ColumnType.GEOM_FOOTPRINT
    );
  }

  // checkbox change handler
  private onCheckboxChange(col: MetadataColumn) {
    const name = col.name as string | undefined;
    if (!name) return;

    // --- CATALOGUE MODE ---
    if (this.model.datasetType === CATALOGUE_TYPE) {
      if (col.columnType == ColumnType.GEOM_RA) {
        this.selectedRa = name;
      } else if (col.columnType == ColumnType.GEOM_DEC) {
        this.selectedDec = name;
      }
    } else {
      // --- FOOTPRINT MODE ---
      if (col.columnType == ColumnType.GEOM_FOOTPRINT) {
        this.selectedOutline = name;
      }
    }
  }


  private onRASelect(e: Event) {
    const select = e.target as HTMLSelectElement;
    const value = select.value;
    this.selectedRa = value === '-' ? undefined : value;

    console.log('[astro-mini-metadata] RA column changed:', this.selectedRa);

    if (!this.selectedRa) return
    if (this.model.datasetType === CATALOGUE_TYPE) {
      const cat = this.model.catOrFoot
      // cat.astroviewerGlObj.catalogueProps.changeCatalogueMetaRA(this.selectedRa) // <--- this shall be handled in the adapter via emit
      bus.emit('astro.metadata:raChanged', {
        catalogue: cat,
        column: this.selectedRa
      });
    }

  }

  private onDecSelect(e: Event) {
    const select = e.target as HTMLSelectElement;
    const value = select.value;
    this.selectedDec = value === '-' ? undefined : value;

    console.log('[astro-mini-metadata] Dec column changed:', this.selectedDec);

    if (!this.selectedDec) return
    if (this.model.datasetType === CATALOGUE_TYPE) {
      const cat = this.model.catOrFoot
      bus.emit('astro.metadata:decChanged', {
        catalogue: cat,
        column: this.selectedDec
      });
    }

  }

  private onHueSelect(e: Event) {
    const select = e.target as HTMLSelectElement;
    const value = select.value;
    this.selectedHue = value === '-' ? "STANDARD_HUE" : value;

    console.log('[astro-mini-metadata] Hue column changed:', this.selectedHue);

    // if (!this.selectedHue) return
    if (this.model.datasetType === CATALOGUE_TYPE) {
      const cat = this.model.catOrFoot

      bus.emit('astro.metadata:hueChanged', {
        catalogue: cat,
        column: this.selectedHue
      });
    }
  }

  private onShapeSizeSelect(e: Event) {
    const select = e.target as HTMLSelectElement;
    const value = select.value;
    this.selectedShape = value === '-' ? "STANDARD_SIZE" : value;

    console.log('[astro-mini-metadata] Size column changed:', this.selectedShape);

    // if (!this.selectedShape) return
    if (this.model.datasetType === CATALOGUE_TYPE) {
      const cat = this.model.catOrFoot

      bus.emit('astro.metadata:sizeChanged', {
        catalogue: cat,
        column: this.selectedShape
      });
    }

  }

  private isIn(list: MetadataColumn[], r: MetadataColumn) {
    return list?.some(c => c.name === r.name);
  }

  render() {

    const glObj = this.model?.catOrFoot?.astroviewerGlObj
    if (!glObj) throw new Error(`No GL object associated to ${this.model.catOrFoot.name}`)


    const raColumns = glObj.metadataManager.raColumnList || []
    let selectRATemplate = html``;
    if (this.model.datasetType === CATALOGUE_TYPE) {
      const options: unknown[] = [];
      for (const col of raColumns) {
        const isSelected = col.name === this.selectedRa;
        options.push(
          html`<option ?selected=${isSelected} value=${col.name}>${col.name}</option>`
        );
      }
      selectRATemplate = html`
        <label>
          RA column:
          <select id='raColumn' @change=${this.onRASelect}>
            ${options}
          </select>
        </label>`;
    }
    const selectRAContainer = html`<div>${selectRATemplate}</div>`;


    const decColumns = glObj.metadataManager.decColumnList || []
    let selectDecTemplate = html``;
    if (this.model.datasetType === CATALOGUE_TYPE) {
      const options: unknown[] = [];

      for (const col of decColumns) {
        const isSelected = col.name === this.selectedDec;
        options.push(
          html`<option ?selected=${isSelected} value=${col.name}>${col.name}</option>`
        );
      }
      selectDecTemplate = html`
        <label>
          Dec column:
          <select id='decColumn' @change=${this.onDecSelect}>
            ${options}
          </select>
        </label>`;
    }
    const selectDecContainer = html`<div>${selectDecTemplate}</div>`;



    const shapeColumns = glObj.metadataManager.shapeColumnList || []
    let selectShapeTemplate = html``;
    if (this.model.datasetType === CATALOGUE_TYPE) {
      const options: unknown[] = [];
      let hasSelected = false
      for (const col of shapeColumns) {
        const isSelected = col.name === this.selectedShape;
        if (isSelected) hasSelected = true;
        options.push(
          html`<option ?selected=${isSelected} value=${col.name}>${col.name}</option>`
        );
      }
      if (!hasSelected) {
        options.push(html`<option selected value="-">-</option>`)
      } else {
        options.push(html`<option value="-">-</option>`)
      }
      options.unshift(html`<option ?selected=${!hasSelected} value="-">-</option>`);
      selectShapeTemplate = html`
        <label>
          Shape column:
          <select id="shapeColumn" @change=${this.onShapeSizeSelect}>${options}</select>
        </label>`;
    }
    const selectShapeContainer = html`<div>${selectShapeTemplate}</div>`;

    const hueColumns = glObj.metadataManager.hueColumnList || [];
    let selectHueTemplate = html``;
    if (this.model.datasetType === CATALOGUE_TYPE) {
      const options: unknown[] = [];
      let hasSelected = false;
      for (const col of hueColumns) {
        const isSelected = col.name === this.selectedHue;
        if (isSelected) hasSelected = true;
        options.push(html`<option ?selected=${isSelected} value=${col.name}>${col.name}</option>`);
      }
      options.unshift(html`<option ?selected=${!hasSelected} value="-">-</option>`);
      selectHueTemplate = html`
        <label>
          Hue column:
          <select id="hueColumn" @change=${this.onHueSelect}>${options}</select>
        </label>`;
    }
    const selectHueContainer = html`<div>${selectHueTemplate}</div>`;

    const rows = glObj.metadataManager.columns || [];
    let colsNames = ['name', 'description', 'unit'];
    const selectedNameDetails = glObj.metadataManager.selectedNameColumn?.details;
    if (selectedNameDetails && selectedNameDetails instanceof Map) {
      const extraColsNames = [...selectedNameDetails].map(([k, v]) => k);
      colsNames = colsNames.concat(extraColsNames);
    }


    // Build a stable list of detail keys across ALL rows so every row has same # of cells
    const detailKeys: string[] = Array.from(new Set(
      rows.flatMap(r => r.details ? [...r.details.keys()] : [])
    ));

    // Header names: include the first column for the checkbox/pos
    const headerNames = ['pos', 'name', 'description', 'unit', ...detailKeys];

    // [...glObj.metadataManager.selectedNameColumn?.details].map( ([k, v]) => { return k}
    // colsNames.concat(glObj.metadataManager.selectedNameColumn?.details.map(c => {return c.name}))
    return html`
      <header>
        <div>
          <div class="title">${this.model?.catOrFoot?.name || this.model?.catOrFoot?.id}</div>
        </div>

        <div>
          <div>${selectRAContainer}</div>
          <div>${selectDecContainer}</div>
          <div>${selectShapeContainer}</div>
          <div>${selectHueContainer}</div>
        </div>

        <button class="close" @click=${this.onClose}>×</button>
      </header>



      <main>
    ${this.model?.catOrFoot?.description
        ? html`<p class="head">${this.model?.catOrFoot.description}</p>`
        : null}
    ${rows.length === 0
        ? html`<div class="muted">No metadata available.</div>`
        : html`
        <div class="cols" style=${`grid-template-columns: repeat(${headerNames.length}, minmax(80px, auto));`}>
          ${headerNames.map(h => html`<div class="muted">${h}</div>`)}

          ${rows.map(row => {
          const showCheckbox = this.isPosColumn(row);

          let checked = false;
          let disabled = false;

          if (this.model.datasetType === CATALOGUE_TYPE) {
            if (this.isIn(raColumns, row)) {
              checked = row.name === this.selectedRa;
              if (this.selectedRa && row.name !== this.selectedRa) disabled = true;
            } else if (this.isIn(decColumns, row)) {
              checked = row.name === this.selectedDec;
              if (this.selectedDec && row.name !== this.selectedDec) disabled = true;
            }
          }

          // Helper to read detail value by key, consistently for each row
          const getDetail = (k: string) =>
            (row.details && row.details.get(k)) ?? html`<span class="muted">—</span>`;

          return html`
              <!-- 1) POS/CHECKBOX column -->
              <div>
                ${showCheckbox
              ? html`<input
                      type="checkbox"
                      ?checked=${checked}
                      ?disabled=${disabled}
                      @change=${() => this.onCheckboxChange(row)}
                    />`
              : html`<span class="muted"></span>`}  <!-- render empty, not "—" if you prefer -->
              </div>

              <!-- 2) Fixed base columns -->
              <div><code>${row.name}</code></div>
              <div>${row.description ?? html`<span class="muted">—</span>`}</div>
              <div>${row.unit ?? html`<span class="muted">—</span>`}</div>

              <!-- 3) Stable detail columns in the same order for every row -->
              ${detailKeys.map(k => html`<div>${getDetail(k)}</div>`)}
            `;
        })}
        </div>
      `}
  </main>
    `;
  }
}