// =========================
// FILE: src/components/panels/astro-panel-grid.ts
// Example third-party-ready panel using the bus only
// =========================

import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { bus, cid } from '../../bus';
import { AstroState } from 'src/types';

@customElement('astro-panel-grid')
export class AstroPanelGrid extends LitElement {
  static styles = css`
  :host{
    padding:8px;
    position: absolute;
    top: 45px;
    border-bottom: 1px solid 
  }`;
  
  @property() astroSettings!: AstroState;


  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html`
    <div style="width: 100%">
      <label>
        <input type="checkbox" .checked=${this.astroSettings.healpixGridVisible}
          @change=${(e: any) => {
        const on = !!e.target.checked;
        this.astroSettings.healpixGridVisible = on;
        bus.emit('astro.toggle.healpix', { on });
      }}>
        Healpix grid
      </label>

      <label>
        <input type="checkbox" .checked=${this.astroSettings.equatorialGridVisible}
          @change=${(e: any) => {
        const on = !!e.target.checked;
        this.astroSettings.equatorialGridVisible = on;
        bus.emit('astro.toggle.equatorial', { on });
      }}>
        Equatorial grid
      </label>
      </div>
    `;
  }
}