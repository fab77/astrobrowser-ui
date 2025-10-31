// =========================
// FILE: src/components/panels/astro-panel-grid.ts
// Example third-party-ready panel using the bus only
// =========================

import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { bus, cid } from '../../bus';
import { AstroState } from 'src/types';

@customElement('astro-panel-inside-sphere')
export class AstroPanelInsideSphere extends LitElement {
  static styles = css`:host{
  padding:8px;
  position: absolute;
  top: 90px;
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
        <input type="checkbox" .checked=${this.astroSettings.insideSphere}
          @change=${(e: any) => {
        const on = !!e.target.checked;
        this.astroSettings.insideSphere = on;
        bus.emit('astro.toggle.insideSphere', { on });
      }}>
        Inside Sphere view
      </label>
      </div>
    `;
  }
}