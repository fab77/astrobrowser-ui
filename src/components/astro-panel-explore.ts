import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './panels/astro-catalogue-table';
import './panels/astro-footprintset-table';
import { DataProvider, TapRepoLoadedPayload } from 'src/types';
import { dataProviderStore } from '../stores/DataProviderStore';
import { bus } from '../bus';

@customElement('astro-panel-explore')
export class AstroPanelExplore extends LitElement {
  static styles = css`
    :host { display:block; height:100%; margin-top: 40px;}
    .wrap { display:flex; flex-direction:column; height:100%; }
    header { padding:8px 10px; border-bottom:1px solid #eee; font-weight:600; }
    main { flex:1; overflow:auto; }
  `;

  @state() dataProviders: DataProvider[] = []


  private unsubStore?: () => void;
  @state() private filter = '';

  // --- hydrate from store + bus so it's sticky and also reacts live
  private _onDataProviderLoaded = (payload: TapRepoLoadedPayload) => {
    const { dataProvider } = payload ?? {};
    if (dataProvider) this.dataProviders.push(dataProvider);
  };

  connectedCallback(): void {
    super.connectedCallback();
    this.unsubStore = dataProviderStore.subscribe((p) => {
      if (p) {
        // this.dataProvider = p;
        if (!this.dataProviders.includes(p))
          this.dataProviders.push(p)
      }
    });
    bus.on('tap:repoLoaded', this._onDataProviderLoaded);
  }

  disconnectedCallback(): void {
    bus.off('tap:repoLoaded', this._onDataProviderLoaded);
    this.unsubStore?.();
    super.disconnectedCallback();
  }

  render() {
    return html`
      <div class="wrap">
        <header>Explore</header>
        <main>
            <astro-panel-goto></astro-panel-goto>  
            <astro-catalogue-table .dataProviders=${this.dataProviders}></astro-catalogue-table>
            <astro-footprintset-table .dataProviders=${this.dataProviders}></astro-footprintset-table>
        </main>
      </div>
    `;
  }
}