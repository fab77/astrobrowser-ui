import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { bus, cid } from "../bus";
import './panels/astro-panel-grid'
import './panels/astro-panel-inside-sphere'
import './panels/astro-panel-tap'
import { AstroState } from "../types";


@customElement('astro-panel-settings')
export class AstroPanelSettings extends LitElement {
    static styles = css`
    :host { display:block; height:100%; margin-top: 40px;}
    .wrap { display:flex; flex-direction:column; height:100%; }
    header { padding:8px 10px; border-bottom:1px solid #eee; font-weight:600; }
    main { flex:1; overflow:auto; }
  `;

    @state() astroSettings?: AstroState

    connectedCallback() {
        super.connectedCallback();

        const correlation = cid();
        const offInit = bus.on('astro.get.state:res', ({ cid, state }) => {
            if (cid !== correlation) return;
            this.astroSettings = state
            offInit();
        });
        bus.emit('astro.get.state:req', { cid: correlation });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }

    render() {
        return html`
        <h3 slot="title" style="margin:0;font:600 13px system-ui">Settings</h3>
        <astro-panel-grid .astroSettings=${this.astroSettings} ></astro-panel-grid>
        <astro-panel-inside-sphere .astroSettings=${this.astroSettings}></astro-panel-inside-sphere>
        <astro-panel-tap></astro-panel-tap>
        `;
    }
}