import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { AstroState } from '../../global-types';
import { AstroViewerController } from './AstroViewerController';

const stateAny: any = state;

@customElement('astro-viewer')
export class AstroViewer extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }

    .root {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    canvas {
      width: 100%;
      height: 100%;
      display: block;
    }
    `

  @property({ attribute: false })
  private astroState: AstroState = {
    centralRADeg: 0,
    centralDecDeg: 0,
    fov: 0,
    equatorialGridVisible: false,
    healpixGridVisible: false,
    insideSphere: false,
    mouseRADeg: undefined,
    mouseDecDeg: undefined
  }

  // Unique id per instance (no decorator needed)
  private readonly canvasId = `astro-canvas-${crypto.randomUUID()}`;

  private controller: AstroViewerController = new AstroViewerController()
  private resizeObserver?: ResizeObserver;

  @query('canvas')
  private canvasEl!: HTMLCanvasElement;

  protected firstUpdated(): void {
    if (!this.canvasEl) {
      console.error('[AstroViewer] canvas element not found');
      return;
    }

    this.controller.init(this.canvasEl, this.astroState);
    // 🔥 observe size changes and resize canvas+viewport
    this.resizeObserver = new ResizeObserver(() => {
      this.controller.resize(); // delegate to controller
    });
    this.resizeObserver.observe(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.resizeObserver?.disconnect();
  }
  
  protected render() {
    return html`
      <div class="root">
        <span>ASTRO VIEWER</span>
        <canvas id=${this.canvasId}></canvas>
      </div>
    `;

  }

  // HELPER

}