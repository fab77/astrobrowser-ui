import { LitElement, html, css, svg } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { bus } from '../../bus';
import { TabKey } from '../../types';
import { EVT_PANEL_OPEN } from '../../events';

@customElement('astro-nav-bar')
export class AstroNavBar extends LitElement {
  static styles = css`
    :host {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 42px;
      background: #1e1e1e;
      border-bottom: 1px solid #333;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
      color: #ddd;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 14px;
      box-sizing: border-box;
      z-index: 10;
      font: 500 14px/1 system-ui, sans-serif;
      user-select: none;
      opacity: 0.8
    }

    nav {
      display: flex;
      gap: 20px;
      align-items: center;
    }

    .tab {
      cursor: pointer;
      color: #045275;
      transition: color 0.2s, font-weight 0.2s;
      padding: 4px 0;
    }
    .tab:hover {
      color: #ccc;
    }
    .tab.active {
      font-weight: 600;
      color: #fff; 
      border-bottom-color: #09f;
    }

    .gearBtn {
      all: unset;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
      border-radius: 6px;
      transition: background 0.2s;
    }
    .gearBtn:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    .gear {
      width: 18px;
      height: 18px;
    }
  `;

  @state() private active: TabKey | null = null;

  // We'll store the "off" function returned by bus.on()
  private offClosePanel?: () => void;

  connectedCallback() {
    super.connectedCallback();

    // Subscribe to closePanel events
    this.offClosePanel = bus.on('ui:closePanel', ({ key }) => {
      if (key === this.active) this.active = null;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    // Clean up listener
    this.offClosePanel?.();
  }

  private setTab(tab: TabKey) {
    // Emit intent; UIPanelManager will handle open/close.
    bus.emit(EVT_PANEL_OPEN, { tab });
    // Toggle the visual active state
    this.active = (this.active === tab) ? null : tab;
  }
  private gearIcon() {
    return svg`<svg class="gear" viewBox="0 0 24 24" aria-hidden="true"
             xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor"
        d="M19.14 12.94a7.93 7.93 0 0 0 .06-1 7.93 7.93 0 0 0-.06-1l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.6 7.6 0 0 0-1.73-1l-.36-2.54a.5.5 0 0 0-.5-.43h-3.84a.5.5 0 0 0-.5.43l-.36 2.54a7.6 7.6 0 0 0-1.73 1l-2.39-.96a.5.5 0 0 0-.6.22L2.65 8.72a.5.5 0 0 0 .12.64L4.8 10.94c-.04.33-.06.66-.06 1s.02.67.06 1l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.13.22.39.31.6.22l2.39-.96c.53.41 1.11.75 1.73 1l.36 2.54c.05.24.26.43.5.43h3.84c.24 0 .45-.19.5-.43l.36-2.54c.62-.25 1.2-.59 1.73-1l2.39.96c.22.09.47 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7Z"/>
    </svg>`;
  }

  render() {
    return html`
      <nav>
        <span class="tab ${this.active === 'explore' ? 'active' : ''}"
              @click=${() => this.setTab('explore')}>Explore</span>
        <span class="tab ${this.active === 'analysis' ? 'active' : ''}"
              @click=${() => this.setTab('analysis')}>Analysis</span>
        <span class="tab ${this.active === 'metadata' ? 'active' : ''}"
              @click=${() => this.setTab('metadata')}>Metadata</span>
      </nav>
      <button class="gearBtn ${this.active === 'settings' ? 'active' : ''}"
              @click=${() => this.setTab('settings')}>
        ${this.gearIcon()}
      </button>
    `;
  }
}