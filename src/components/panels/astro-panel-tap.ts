import { LitElement, html, css } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { bus, cid } from '../../bus';
import type { Catalogue, FootprintSet, AstroTapAddRepoResPayload, DataProvider } from '../../types';
import { dataProviderStore } from '../../stores/DataProviderStore';

@customElement('astro-panel-tap')
export class AstroPanelTap extends LitElement {
  static styles = css`
    :host {
      position: absolute;
      padding: 8px;
      box-sizing: border-box;
      font: 13px/1.35 system-ui, sans-serif;
      color: rgb(4, 82, 117);
      top: 135px;
    }
    .row { display: flex; align-items: center; gap: 8px; margin: 6px 0; }
    .url { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    button {
      all: unset; cursor: pointer; padding: 6px 10px; border: 1px solid #ccc; border-radius: 8px;
      background: #f7f7f7; font-weight: 600;
    }
    button[disabled] { opacity: .5; cursor: default; }
    .muted { color: #666; }
    .pill { display: inline-block; padding: 2px 8px; border: 1px solid #ddd; border-radius: 999px; font-size: 12px; margin-left: 6px; }
    details { border: 1px solid #eee; border-radius: 10px; padding: 8px 10px; margin-top: 8px; background: #fafafa; }
    summary { cursor: pointer; font-weight: 600; }
    ul { margin: 6px 0 0 16px; padding: 0; }
    li { margin: 2px 0; }
    .inline-input { display: flex; gap: 8px; margin-top: 10px; }
    input[type="text"] {
      flex: 1; padding: 6px 8px; border: 1px solid #ccc; border-radius: 8px; font: inherit;
    }
    h3 { margin: 0 0 6px; font-size: 14px; }
  `;

  /** Show these endpoints with “Load” buttons */
  @property({ type: Array })
  defaultTapRepoURLs: string[] = [
    'https://sky.esa.int/esasky-tap/tap',
    'https://alasky.cds.unistra.fr/TAPVizieR/tap',
    'https://gea.esac.esa.int/tap-server/tap',
  ];

  /** Outputs to fill after loading */
  @state() catalogues: Catalogue[] = [];
  @state() footprints: FootprintSet[] = [];

  /** Internal UI state */
  @state() private _loadingUrl: string | null = null;
  @state() private _lastLoadedUrl: string | null = null;
  @state() private _customUrl = '';

  private _off?: () => void;

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    this._off?.();
    super.disconnectedCallback();
  }

  private async _callAddTAPRepo(url: string): Promise<{ dataProvider: DataProvider }> {
    const correlation = cid();
    return new Promise((resolve, reject) => {
      const off = bus.on('astro.tap.addRepo:res', (msg: AstroTapAddRepoResPayload) => {
        if (msg.cid !== correlation) return;
        off();
        if (msg.ok) {
          // ok === true branch has payload guaranteed by the discriminated union
          safeResolve(msg.payload); // <- here is where the dataProvider is returned
        } else {
          safeReject(new Error(msg.error ?? 'Unknown TAP add error'));
        }
      });

      // Timeout guard
      const t = setTimeout(() => {
        off();
        reject(new Error('Timeout waiting for TAP repo response'));
      }, 15000);

      // Ensure cleanup if resolved early
      const safeResolve = (v: any) => { clearTimeout(t); resolve(v); };
      const safeReject  = (e: any) => { clearTimeout(t); reject(e); };

      // Re-emit using the originals so we don't capture the wrapped ones
      bus.emit('astro.tap.addRepo:req', { cid: correlation, url });
    });
  }

  private async _loadRepo(url: string) {
    if (!url || this._loadingUrl) return;
    this._loadingUrl = url;
    try {
      const { dataProvider } = await this._callAddTAPRepo(url);
      dataProviderStore.set(dataProvider)

      // Fill reactive outputs
      this.catalogues = Array.isArray(dataProvider.catalogues) ? dataProvider.catalogues : [];
      this.footprints = Array.isArray(dataProvider.footprints) ? dataProvider.footprints : [];
      this._lastLoadedUrl = url;

      // DOM event for local consumers
      this.dispatchEvent(new CustomEvent('tap-loaded', {
        bubbles: true, composed: true,
        detail: { url, catalogues: this.catalogues, footprints: this.footprints }
      }));

    //   // Bus event for app-wide consumers <- this is done in the AstroController
    //   bus.emit('tap:repoLoaded', { url, dataProvider: dataProvider });
    } catch (err: any) {
      console.error('[astro-panel-tap] load failed:', err);
      alert(`Failed to load TAP repo:\n${url}\n\n${err?.message ?? err}`);
    } finally {
      this._loadingUrl = null;
    }
  }

  private _onCustomLoad() {
    const url = this._customUrl.trim();
    if (url) this._loadRepo(url);
  }

  render() {
    return html`
      <h3>TAP repositories</h3>
      <div class="muted">Load one of the defaults or paste a TAP endpoint.</div>

      ${this.defaultTapRepoURLs.map(url => html`
        <div class="row">
          <div class="url" title=${url}>${url}</div>
          <button
            ?disabled=${this._loadingUrl === url}
            @click=${() => this._loadRepo(url)}
            aria-label=${`Load ${url}`}
          >
            ${this._loadingUrl === url ? 'Loading…' : 'Load'}
          </button>
        </div>
      `)}

      <div class="inline-input">
        <input
          type="text"
          placeholder="Paste a TAP endpoint URL…"
          .value=${this._customUrl}
          @input=${(e: Event) => (this._customUrl = (e.target as HTMLInputElement).value)}
          @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && this._onCustomLoad()}
        />
        <button ?disabled=${!!this._loadingUrl} @click=${this._onCustomLoad}>Load</button>
      </div>

      ${this._lastLoadedUrl ? html`
        <div style="margin-top:14px">
          <strong>Last loaded:</strong> <span class="url">${this._lastLoadedUrl}</span>
          <span class="pill" title="Catalogues count">${this.catalogues.length} catalogues</span>
          <span class="pill" title="Footprints count">${this.footprints.length} footprints</span>
        </div>

        ${this.catalogues.length ? html`
          <details open>
            <summary>Catalogues (${this.catalogues.length})</summary>
            <ul>
              ${this.catalogues.map(c => html`
                <li><code>${c.name ?? '(unnamed)'}</code>${c.description ? html` — ${c.description}` : ''}</li>
              `)}
            </ul>
          </details>
        ` : null}

        ${this.footprints.length ? html`
          <details style="margin-top:8px">
            <summary>Footprints (${this.footprints.length})</summary>
            <ul>
              ${this.footprints.map(f => html`
                <li><code>${f.name ?? '(unnamed)'}</code>${f.description ? html` — ${f.description}` : ''}</li>
              `)}
            </ul>
          </details>
        ` : null}
      ` : null}
    `;
  }
}