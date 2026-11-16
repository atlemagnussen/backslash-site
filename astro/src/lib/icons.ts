// One original line icon per category folder, on a 24x24 grid, stroke only (colored by CSS).
// Deliberately generic shapes, not copies of project or brand logos.
export const CATEGORY_ICONS: Record<string, string> = {
    // penguin
    linux: `<path d="M12 3c-2.5 0-4 2-4 4.5 0 1.5-.8 2.8-1.6 4.2C5.2 14 5 17 6.5 19.5c.6 1 1.8 1.5 3 1.5h5c1.2 0 2.4-.5 3-1.5 1.5-2.5 1.3-5.5.1-7.8-.8-1.4-1.6-2.7-1.6-4.2C16 5 14.5 3 12 3z"/><path d="M10 11c-1.3 2.3-1.3 6 0 8h4c1.3-2 1.3-5.7 0-8"/><path d="M10.6 6.5h.01M13.4 6.5h.01"/><path d="M11 8.4l1 .9 1-.9"/>`,
    // devil head: horns, pointed chin
    bsd: `<path d="M6 13a6 6 0 0 1 12 0c0 3.5-3 7-6 8-3-1-6-4.5-6-8z"/><path d="M7.4 9.6C6 7.8 5.6 5.4 6 3.5c1.2 1.6 2.6 2.8 4.2 3.5M16.6 9.6c1.4-1.8 1.8-4.2 1.4-6.1-1.2 1.6-2.6 2.8-4.2 3.5"/><path d="M8.8 11.6l2 .9M15.2 11.6l-2 .9"/><path d="M9.8 16c1.4.9 3 .9 4.4 0"/>`,
    // key
    security: `<circle cx="7.5" cy="16.5" r="4"/><path d="M10.4 13.6L20 4M16.5 7.5l2.5 2.5M14 10l2 2"/>`,
    // currency sign B with strokes
    bitcoin: `<path d="M8 5v14M8 5h5.5a3.5 3.5 0 0 1 0 7H8M8 12h6.5a3.5 3.5 0 0 1 0 7H8"/><path d="M10 3v2M13 3v2M10 19v2M13 19v2"/>`,
    // stacked crates
    containers: `<rect x="3" y="12" width="8" height="8" rx="1"/><rect x="13" y="12" width="8" height="8" rx="1"/><rect x="8" y="4" width="8" height="8" rx="1"/><path d="M5.5 15v2M8.5 15v2M15.5 15v2M18.5 15v2M10.5 7v2M13.5 7v2"/>`,
    // three linked nodes
    network: `<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M10.8 7.2L6.2 15.8M13.2 7.2l4.6 8.6M7.5 18h9"/>`,
    // cloud
    cloud: `<path d="M7 18.5h10a4 4 0 0 0 .4-8 5.5 5.5 0 0 0-10.6-1A4.5 4.5 0 0 0 7 18.5z"/>`,
    // braces around a dot
    dotnet: `<path d="M9 4C6.5 4 7.5 10 5 12c2.5 2 1.5 8 4 8M15 4c2.5 0 1.5 6 4 8-2.5 2-1.5 8-4 8"/><circle cx="12" cy="12" r="1.2"/>`,
    // angle brackets with slash
    javascript: `<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4.5l-4 15"/>`,
    // music note
    audio: `<path d="M9 18V5.5l10-2.5v12.5"/><circle cx="6.8" cy="18" r="2.2"/><circle cx="16.8" cy="15.5" r="2.2"/>`,
    // branch
    "source-control": `<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="7" r="2"/><path d="M6 7v10M18 9c0 5-12 3-12 8"/>`,
    // terminal prompt
    unix: `<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M7 9.5l3 2.5-3 2.5M12.5 15H17"/>`,
}
