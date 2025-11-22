import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';


@customElement('table-viewer')
export class TableViewer extends LitElement {
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
    }`

    constructor() {
        super();
    }

    protected render() {
    
    return html`
      <div class="root">
        <span>TABLE VIEWER</span>
      </div>
    `;
  }

}