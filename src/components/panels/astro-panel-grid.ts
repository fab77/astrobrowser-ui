// =========================
// FILE: src/components/panels/astro-panel-grid.ts
// Example third-party-ready panel using the bus only
// =========================

import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { bus } from '../../bus';

@customElement('astro-panel-grid')
export class AstroPanelGrid extends LitElement {
  static styles = css`:host{
  // display:block;
  padding:8px;
  position: absolute;
  top: 45px;
  background: aqua;
  }`;
  @state() healpix = false;
  @state() equatorial = false;

  connectedCallback(){
    super.connectedCallback();
    // Optionally listen to state changes to reflect UI
    this._off = bus.on('astro.state.changed', ({ state }) => {
      // sync UI if needed based on state
    });
  }
  private _off?: () => void;
  disconnectedCallback(){ this._off?.(); super.disconnectedCallback(); }

  render(){
    return html`
      <label><input type="checkbox" .checked=${this.healpix} @change=${(e:any)=>{this.healpix=e.target.checked; bus.emit('astro.toggle.healpix', { on: this.healpix });}}> Healpix grid</label>
      <label><input type="checkbox" .checked=${this.equatorial} @change=${(e:any)=>{this.equatorial=e.target.checked; bus.emit('astro.toggle.equatorial', { on: this.equatorial });}}> Equatorial grid</label>
    `;
  }
}