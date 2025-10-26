// =========================
// FILE: src/components/panels/astro-panel-grid.ts
// Example third-party-ready panel using the bus only
// =========================

import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { bus, cid } from '../../bus';

@customElement('astro-panel-inside-sphere')
export class AstroPanelInsideSphere extends LitElement {
  static styles = css`:host{
  padding:8px;
  position: absolute;
  top: 90px;
  border-bottom: 1px solid 
  }`;
  @state() insideSphere = false;
  private _off?: () => void;


  connectedCallback() {
    super.connectedCallback();

    // Initialise from current engine state
    const correlation = cid();
    const offInit = bus.on('astro.get.state:res', ({ cid, state }) => {
      if (cid !== correlation) return;
      this.insideSphere = !!state.insideSphere;
      offInit();
    });
    bus.emit('astro.get.state:req', { cid: correlation });

    // Keep in sync with future engine changes
    this._off = bus.on('astro.state.changed', ({ state }) => {
      this.insideSphere = !!state.insideSphere;
    });
  }

  disconnectedCallback() {
    this._off?.();
    super.disconnectedCallback();
  }

  render() {
    return html`
      <div style="width: 100%">
      <label>
        <input type="checkbox" .checked=${this.insideSphere}
          @change=${(e: any) => {
        const on = !!e.target.checked;
        this.insideSphere = on;
        bus.emit('astro.toggle.insideSphere', { on });
      }}>
        Inside Sphere view
      </label>
      </div>
    `;
  }
}