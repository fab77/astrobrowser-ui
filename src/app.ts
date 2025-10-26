// =========================
// FILE: src/app.ts
// App bootstrap: wires AstroViewer API, Controller, UI Panel Manager & Registry
// =========================

import './styles/global.css';

// Ensure all components used directly in HTML or created at runtime are registered
import './components/panels/astro-nav-bar';
import './components/panels/astro-panel-draggable';
import './components/panels/astro-panel-grid';
import './components/panels/astro-panel-goto';
// (import other panels here if/when you add them)

import { AstroController } from './astro-controller';
import { AstroViewerAdapter } from './astroviewer-adapter'; // must implement IAstroViewerAPI
import { UIPanelManager } from './ui/UIPanelManager';
import { PanelRegistry } from './services/panels/PanelRegistry';

function assertEl<T extends Element>(el: T | null, sel: string): T {
    if (!el) throw new Error(`Missing required element: ${sel}`);
    return el;
}

async function main() {
    // 1) Grab DOM anchors
    const workarea = assertEl(document.getElementById('workarea'), '#workarea');
    const canvas = assertEl(document.getElementById('astrocanvas') as HTMLCanvasElement | null, '#astrocanvas');

    
    // 2) Init AstroViewer adapter (bridge to your engine)
    //    If your adapter needs the canvas or the <astro-viewer> element, pass it here.
    //    Adjust the constructor to your actual signature.
    // const astroAPI = new AstroViewerAdapter({ canvas }); // tweak if your adapter differs
    const astroAPI = new AstroViewerAdapter(); // tweak if your adapter differs
    astroAPI.init(canvas.id)
    // 3) Mount the AstroController (handles astro.* bus commands)
    const controller = new AstroController(astroAPI);
    controller.mount();

    // 4) Build the PanelRegistry (maps keys -> factories)
    const registry = new PanelRegistry();

    // Core tab panels.
    // Use the same keys as your TabKey union: 'explore' | 'analysis' | 'metadata' | 'settings'
    registry.register('explore', () => {
        const el = document.createElement('astro-panel-draggable');
        el.innerHTML = `
      <h3 slot="title" style="margin:0;font:600 13px system-ui">Explore</h3>
      
      <astro-panel-goto></astro-panel-goto>
    `;
        return el;
    });

    registry.register('analysis', () => {
        const el = document.createElement('astro-panel-draggable');
        el.innerHTML = `
      <h3 slot="title" style="margin:0;font:600 13px system-ui">Analysis</h3>
      <div style="padding:8px">Analysis content…</div>
    `;
        return el;
    });

    registry.register('metadata', () => {
        const el = document.createElement('astro-panel-draggable');
        el.innerHTML = `
      <h3 slot="title" style="margin:0;font:600 13px system-ui">Metadata</h3>
      <div style="padding:8px">Metadata content…</div>
    `;
        return el;
    });

    registry.register('settings', () => {
        const el = document.createElement('astro-panel-draggable');
        el.innerHTML = `
      <h3 slot="title" style="margin:0;font:600 13px system-ui">Settings</h3>
      <astro-panel-grid></astro-panel-grid>
      
    `;
        return el;
    });

    // 5) Create & mount the UIPanelManager (enforces single-panel for core tabs)
    const ui = new UIPanelManager(workarea, registry);
    ui.mount();

    // 6) Optionally open a default tab panel on load (e.g., 'explore')
    // bus.emit('ui:openPanel', { tab: 'explore' as TabKey });

    // (Optional) If you later add plugin panels, you can load them and open with:
    // import { loadPanel } from './plugin-loader';
    // await loadPanel('https://your-cdn/plugin.js', registry);
    // bus.emit('ui:openPanelKey', { key: 'pluginKey' });
}

// Bootstrap immediately
main().catch(err => {
    // Surface bootstrap errors early and clearly in dev
    console.error('[app] bootstrap failed:', err);
});