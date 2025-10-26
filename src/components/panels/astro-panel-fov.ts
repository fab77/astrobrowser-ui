// =========================
// FILE: src/components/panels/astro-panel-fov.ts
// Shows the current Field of View and keeps it in sync with engine state
// =========================

import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { bus, cid } from '../../bus';

@customElement('astro-panel-fov')
export class AstroPanelFoV extends LitElement {
  static styles = css`
    :host{
      display:block;
      padding:8px;
      font: 500 14px/1.2 system-ui, sans-serif;
      position: absolute;
      bottom: 5px;
    }
    .row{
      display:flex; align-items:center; gap:8px;
    }
    .val{
      font-weight:600;
      letter-spacing: .2px;
    }
    small { opacity: .7; }
  `;

  @state() private fov = 0;

  private _offChanged?: () => void;
  private _offInit?: () => void;

  connectedCallback() {
    super.connectedCallback();

    // 1) Initialise from current engine state (correlated response)
    const correlation = cid();
    this._offInit = bus.on('astro.get.state:res', ({ cid: rcid, state }) => {
      if (rcid !== correlation) return;
      this.fov = Number(state.fov) || 0;
      this._offInit?.(); // unsubscribe init listener
      this._offInit = undefined;
    });
    bus.emit('astro.get.state:req', { cid: correlation });

    // 2) Keep in sync with future engine changes
    this._offChanged = bus.on('astro.state.changed', ({ state }) => {
      this.fov = Number(state.fov) || 0;
    });
  }

  disconnectedCallback() {
    this._offChanged?.(); this._offChanged = undefined;
    this._offInit?.();    this._offInit = undefined;
    super.disconnectedCallback();
  }

  render() {
    return html`
      <div class="row">
        <span>FoV:</span>
        <span class="val">${this.fov.toFixed(2)}°</span>
        <small>(degrees)</small>
      </div>
    `;
  }
}