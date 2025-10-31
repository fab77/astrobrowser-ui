// =========================
// FILE: src/components/panels/astro-panel-fov.ts
// Shows the current Field of View and keeps it in sync with engine state
// =========================

import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { bus, cid } from '../../bus';

type HMS = {
    H: number
    M: number
    S: number
}

type DMS = {
    D: number
    M: number
    S: number
}

@customElement('astro-panel-coordinates')
export class AstroPanelCoordinate extends LitElement {
    static styles = css`
    :host{
      display:block;
      padding:8px;
      font: 500 14px/1.2 system-ui, sans-serif;
      position: absolute;
      top: 50px;
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

    @state() private craDeg = 0; // central ra deg
    @state() private cdecDeg = 0; // central dec deg
    @state() private mraDeg = 0; // mouse ra deg
    @state() private mdecDeg = 0; // mouse dec deg

    @state() private raHMS: HMS = { H: 0, M: 0, S: 0 };
    @state() private decDMS: DMS = { D: 0, M: 0, S: 0 };


    private _offChanged?: () => void;
    private _offInit?: () => void;

    connectedCallback() {
        super.connectedCallback();

        // 1) Initialise from current engine state (correlated response)
        const correlation = cid();
        this._offInit = bus.on('astro.get.state:res', ({ cid: rcid, state }) => {
            if (rcid !== correlation) return;
            this.craDeg = Number(state.centralRADeg) || 0;
            this.cdecDeg = Number(state.centralDecDeg) || 0;
            
            this.mraDeg = Number(state.mouseRADeg) || 0;
            this.mdecDeg = Number(state.mouseDecDeg) || 0;

            this._offInit?.(); // unsubscribe init listener
            this._offInit = undefined;
        });
        bus.emit('astro.get.state:req', { cid: correlation });

        // 2) Keep in sync with future engine changes
        this._offChanged = bus.on('astro.state.changed', ({ state }) => {
            this.craDeg = Number(state.centralRADeg) || 0;
            this.cdecDeg = Number(state.centralDecDeg) || 0;
            this.mraDeg = Number(state.mouseRADeg) || 0;
            this.mdecDeg = Number(state.mouseDecDeg) || 0;
        });
    }

    disconnectedCallback() {
        this._offChanged?.(); this._offChanged = undefined;
        this._offInit?.(); this._offInit = undefined;
        super.disconnectedCallback();
    }

    render() {
        return html`
      <div class="row">
        <span>Central Coords:</span>
        <span class="val">${this.craDeg.toFixed(2)}° ${this.cdecDeg.toFixed(2)}° </span>
      </div>
      <div class="row">
        <span>Mouse Coords:</span>
        <span class="val">${this.mraDeg.toFixed(2)}° ${this.mdecDeg.toFixed(2)}° </span>
      </div>
    `;
    }
}