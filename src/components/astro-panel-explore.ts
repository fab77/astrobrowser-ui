import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import './panels/astro-catalogue-table';

@customElement('astro-panel-explore')
export class AstroPanelExplore extends LitElement {
    static styles = css`
    :host { display:block; height:100%; }
    .wrap { display:flex; flex-direction:column; height:100%; }
    header { padding:8px 10px; border-bottom:1px solid #eee; font-weight:600; }
    main { flex:1; overflow:auto; }
  `;

    render() {
        return html`
      <div class="wrap">
        <header>Explore</header>
        <main>
            <astro-panel-goto></astro-panel-goto>  
            <astro-catalogue-table></astro-catalogue-table>
        </main>
      </div>
    `;
    }
}