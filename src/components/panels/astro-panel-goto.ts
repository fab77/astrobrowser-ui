// =========================
// FILE: src/components/panels/astro-panel-goto.ts
// Example panel issuing a request/response query via correlation id
// =========================

import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { bus, cid } from '../../bus';

@customElement('astro-panel-goto')
export class AstroPanelGoto extends LitElement {
  static styles = css`
  :host{
    position: absolute;
    left: 10px;
    top: 40px;
    padding:8px;
    border-bottom: 1px solid 
  }
  input {
    width: 90%
  }`;
  // @state() ra = 0; @state() dec = 0; @state() fov = 5; @state() info = '';
  @state() ra = 0; @state() dec = 0; @state() info = '';

  private queryState() {
    const correlation = cid();
    const off = bus.on('astro.get.state:res', ({ cid, state }) => {
      if (cid !== correlation) return;           // ignore other responses
      this.info = `Current RA=${state.ra.toFixed(2)} DEC=${state.dec.toFixed(2)} FOV=${state.fov.toFixed(2)}`;
      off();                                      // unsubscribe once we've handled OUR response
    });
    bus.emit('astro.get.state:req', { cid: correlation });
    // off() would be called automatically because of once()
  }

  render() {
    return html`
      <div style="display:flex;gap:6px;align-items:center; width: 100%">
        <label>RA: 
          <input type="number" step="0.01" .value=${String(this.ra)} @input=${(e: any) => this.ra = parseFloat(e.target.value)} placeholder="RA°">
        </label>
        <label>Dec: 
          <input type="number" step="0.01" .value=${String(this.dec)} @input=${(e: any) => this.dec = parseFloat(e.target.value)} placeholder="DEC°">
        </label>
        <button @click=${() => bus.emit('astro.goto', { ra: this.ra, dec: this.dec })}>GoTo</button>
        <button @click=${() => this.queryState()}>Read State</button>
      </div>
      <div>${this.info}</div>
    `;
  }
}