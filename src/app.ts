// =========================
// FILE: src/app.ts
// App bootstrap: wires AstroViewer API, Controller, UI Panel Manager & Registry
// =========================

import './styles/global.css';

// Ensure all components used directly in HTML or created at runtime are registered
import './components/dynamic-container/DinamicContainer';
import './components/astro-viewer/AstroViewer';
import './components/table-viewer/TableViewer';
import './components/top-nav-bar/TopNavBar'

// (import other panels here if/when you add them)



function assertEl<T extends Element>(el: T | null, sel: string): T {
    if (!el) throw new Error(`Missing required element: ${sel}`);
    return el;
}

async function main() {
    
}

// Bootstrap immediately
main().catch(err => {
    // Surface bootstrap errors early and clearly in dev
    console.error('[app] bootstrap failed:', err);
});