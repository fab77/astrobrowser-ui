import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { CATALOGUE_TYPE, type Catalogue, type FootprintSet, type MiniMetadataPanel } from '../../types';
import { bus } from '../../bus';

const UCD_RA = 'pos.eq.ra';
const UCD_DEC = 'pos.eq.dec';
const UCD_OUTLINE = 'pos.outline;meta.pgsphere';

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
      display:grid;
      grid-template-columns: auto 1fr auto auto auto 2fr;
      gap:8px;
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

    // Prepopulate from metadata if present
    if (this.model.datasetType === CATALOGUE_TYPE) {
      const cat = this.model.catOrFoot as Catalogue;
      const raName = cat.metadataDetails?.posEqRAMetaColumns?.[0]?.name;

      const decName = cat.metadataDetails?.posEqDecMetaColumns?.[0]?.name;
      if (raName) {
        this.selectedRa = raName;
        this.defaultRa = raName;
      }
      if (decName) {
        this.selectedDec = decName;
        this.defaultDec = decName;
      }
    } else {
      const foot = this.model.catOrFoot as FootprintSet;
      const outlineName =
        foot.metadataDetails?.pgSphereMetaColumns?.[0]?.name ??
        foot.metadataDetails?.sRegionMetaColumns?.[0]?.name;
      if (outlineName) {
        this.selectedOutline = outlineName;
        this.defaultOutline = outlineName;
      }
    }
  }

  private onClose = () => {
    this.remove();
  };

  // helper: is this column "position-ish"?
  private isPosColumn(col: any): boolean {
    return (
      (col.ucd ?? '').includes(UCD_RA) ||
      (col.ucd ?? '').includes(UCD_DEC) ||
      col?.ucd === UCD_OUTLINE
    );
  }

  // checkbox change handler
  private onCheckboxChange(col: any) {
    const ucd = col.ucd as string | undefined;
    const name = col.name as string | undefined;
    if (!ucd || !name) return;

    if (this.model.datasetType === CATALOGUE_TYPE) {
      // --- CATALOGUE MODE ---
      if ((col.ucd ?? '').includes(UCD_RA)) {
        // select this RA, deselect others
        this.selectedRa = name;
      } else if ((col.ucd ?? '').includes(UCD_DEC)) {
        this.selectedDec = name;
      }
    } else {
      // --- FOOTPRINT MODE ---
      if (ucd === UCD_OUTLINE) {
        // toggle: if already selected, keep it? you said "at least one shall be selected"
        // so we don't allow unselecting if it is the only one
        if (this.selectedOutline === name) {
          // try to unselect → only unselect if there is another outline candidate
          // but since we allow only one at a time, just do nothing to enforce "at least one"
          return;
        } else {
          this.selectedOutline = name;
        }
      }
    }
  }


  private onRASelect(e: Event) {
    const select = e.target as HTMLSelectElement;
    const value = select.value;
    this.selectedRa = value === '-' ? undefined : value;

    console.log('[astro-mini-metadata] Dec column changed:', this.selectedRa);

    if (!this.selectedRa) return
    if (this.model.datasetType === CATALOGUE_TYPE) {
      const cat = this.model.catOrFoot as Catalogue
      // cat.astroviewerGlObj.catalogueProps.changeCatalogueMetaRA(this.selectedRa) // <--- this shall be handled in the adapter via emit
      bus.emit('astro.metadata:raChanged', {
        catalogue: cat,
        column: this.selectedRa
      });
    }
    // (Optional) emit a bus or custom event if you want to notify the app:
    // this.dispatchEvent(
    //   new CustomEvent('ra-column-changed', {
    //     bubbles: true,
    //     composed: true,
    //     detail: {
    //       hue: this.selectedRa,
    //       catalogue: this.model.catOrFoot as Catalogue
    //     }
    //   })
    // );
  }

  private onDecSelect(e: Event) {
    const select = e.target as HTMLSelectElement;
    const value = select.value;
    this.selectedDec = value === '-' ? undefined : value;

    console.log('[astro-mini-metadata] Dec column changed:', this.selectedDec);

    if (!this.selectedDec) return
    if (this.model.datasetType === CATALOGUE_TYPE) {
      const cat = this.model.catOrFoot as Catalogue
      // cat.astroviewerGlObj.catalogueProps.changeCatalogueMetaDec(this.selectedDec) // <--- this shall be handled in the adapter via emit
      bus.emit('astro.metadata:decChanged', {
        catalogue: cat,
        column: this.selectedDec
      });
    }
    // (Optional) emit a bus or custom event if you want to notify the app:
    // this.dispatchEvent(
    //   new CustomEvent('dec-column-changed', {
    //     bubbles: true,
    //     composed: true,
    //     detail: {
    //       hue: this.selectedDec,
    //       catalogue: this.model.catOrFoot as Catalogue
    //     }
    //   })
    // );
  }

  private onHueSelect(e: Event) {
    const select = e.target as HTMLSelectElement;
    const value = select.value;
    this.selectedHue = value === '-' ? undefined : value;

    console.log('[astro-mini-metadata] Hue column changed:', this.selectedHue);

    if (!this.selectedHue) return
    if (this.model.datasetType === CATALOGUE_TYPE) {
      const cat = this.model.catOrFoot as Catalogue
      // this should call astroviewer-adapter.setCatalogueShapeHue()
      // cat.astroviewerGlObj.changeCatalogueMetaShapeHue(this.selectedHue) // <--- this shall be handled in the adapter via emit
      bus.emit('astro.metadata:hueChanged', {
        catalogue: cat,
        column: this.selectedHue
      });
    }
    // (Optional) emit a bus or custom event if you want to notify the app:
    // this.dispatchEvent(
    //   new CustomEvent('hue-column-changed', {
    //     bubbles: true,
    //     composed: true,
    //     detail: {
    //       hue: this.selectedHue,
    //       catalogue: this.model.catOrFoot as Catalogue
    //     }
    //   })
    // );
  }

  private onShapeSizeSelect(e: Event) {
    const select = e.target as HTMLSelectElement;
    const value = select.value;
    this.selectedShape = value === '-' ? undefined : value;

    console.log('[astro-mini-metadata] Hue column changed:', this.selectedShape);

    if (!this.selectedShape) return
    if (this.model.datasetType === CATALOGUE_TYPE) {
      const cat = this.model.catOrFoot as Catalogue
      // this should call astroviewer-adapter.setCatalogueShapeSize()
      // cat.astroviewerGlObj.changeCatalogueMetaShapeSize(this.selectedShape) // <--- this shall be handled in the adapter via emit
      bus.emit('astro.metadata:sizeChanged', {
        catalogue: cat,
        column: this.selectedShape
      });
    }
    // (Optional) emit a bus or custom event if you want to notify the app:
    // this.dispatchEvent(
    //   new CustomEvent('size-column-changed', {
    //     bubbles: true,
    //     composed: true,
    //     detail: {
    //       hue: this.selectedShape,
    //       catalogue: this.model.catOrFoot as Catalogue
    //     }
    //   })
    // );
  }

  render() {
    const cols = this.model?.catOrFoot?.metadataDetails?.metadataList || [];

    let selectRATemplate = html``;
    if (this.model.datasetType === CATALOGUE_TYPE) {
      const options: unknown[] = [];
      for (const col of cols) {
        if (!(col.ucd ?? '').includes(UCD_RA)) continue
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

    let selectDecTemplate = html``;
    if (this.model.datasetType === CATALOGUE_TYPE) {
      const options: unknown[] = [];

      for (const col of cols) {
        if (!(col.ucd ?? '').includes(UCD_DEC)) continue
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


    let selectShapeTemplate = html``;
    if (this.model.datasetType === CATALOGUE_TYPE) {
      const options: unknown[] = [];

      let hasSelected = false
      for (const col of cols) {
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
      options.reverse()
      selectShapeTemplate = html`
        <label>
          Shape column:
          <select id='shapeolumn' @change=${this.onShapeSizeSelect}>
            ${options}
          </select>
        </label>`;
    }
    const selectShapeContainer = html`<div>${selectShapeTemplate}</div>`;


    let selectHueTemplate = html``;
    if (this.model.datasetType === CATALOGUE_TYPE) {
      const options: unknown[] = [];

      let hasSelected = false
      for (const col of cols) {
        const isSelected = col.name === this.selectedHue
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
      options.reverse()
      selectHueTemplate = html`
        <label>
          Hue column:
          <select id='hueColumn' @change=${this.onHueSelect}>
            ${options}
          </select>
        </label>`;
    }
    const selectHueContainer = html`<div>${selectHueTemplate}</div>`;



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
        ${cols.length === 0
        ? html`<div class="muted">No metadata available.</div>`
        : html`
              <div class="cols">
                <div class="muted">pos</div>
                <div class="muted">name</div>
                <div class="muted">type</div>
                <div class="muted">unit</div>
                <div class="muted">ucd</div>
                <div class="muted">description</div>

                ${cols.map(col => {
          const showCheckbox = this.isPosColumn(col);

          // compute checked/disabled state
          let checked = false;
          let disabled = false;

          if (this.model.datasetType === CATALOGUE_TYPE) {

            if ((col.ucd ?? '').includes(UCD_RA)) {
              checked = col.name === this.selectedRa;
              // disable all other RA if one is selected and this is not it
              if (this.selectedRa && col.name !== this.selectedRa) disabled = true;
            } else if ((col.ucd ?? '').includes(UCD_DEC)) {
              checked = col.name === this.selectedDec;
              if (this.selectedDec && col.name !== this.selectedDec) disabled = true;
            }
          } else {
            // FOOTPRINT
            if (col.ucd === UCD_OUTLINE) {
              checked = col.name === this.selectedOutline;
              if (this.selectedOutline && col.name !== this.selectedOutline) disabled = true;
            }
          }

          return html`
                    <div>
                      ${showCheckbox
              ? html`
                            <input
                              type="checkbox"
                              ?checked=${checked}
                              ?disabled=${disabled}
                              @change=${() => this.onCheckboxChange(col)}
                            />
                          `
              : html`<span class="muted">—</span>`}
                    </div>
                    <div><code>${col.name}</code></div>
                    <div>${col.dataType ?? html`<span class="muted">—</span>`}</div>
                    <div>${col.unit ?? html`<span class="muted">—</span>`}</div>
                    <div>${col.ucd ?? html`<span class="muted">—</span>`}</div>
                    <div>${col.description ?? html`<span class="muted">—</span>`}</div>
                  `;
        })}
              </div>
            `}
      </main>
    `;
  }
}