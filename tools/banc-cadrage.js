// Banc du cadrage dans la zone visible (0.10.00) : `cadrageVisible` est extraite du fichier LIVRÉ,
// puis on projette l'emprise cadrée en pixels et on vérifie qu'elle tient ENTIÈRE dans la zone que la
// fenêtre ne couvre pas, centrée sur elle. Des témoins (le calcul volontairement cassé) doivent échouer.
// Usage : node tools/banc-cadrage.js
'use strict';
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'WME-BAN-Coverage.user.js'), 'utf8');

function extraire(nom, texte) {
    const i = texte.indexOf('    function ' + nom + '(');
    if (i < 0) throw new Error(nom + ' introuvable dans le fichier livré');
    const j = texte.indexOf('\n    }\n', i);
    return texte.slice(i, j + 6);
}
const code = extraire('cadrageVisible', src);
const charger = c => new Function(c + '\nreturn cadrageVisible;')();

const R = 6378137, rad = Math.PI / 180;
const mx = lon => R * lon * rad, my = lat => R * Math.log(Math.tan(Math.PI / 4 + lat * rad / 2));
// Carte de 1500 × 900 px à l'écran (décalée par le volet de WME), zoom 12 autour de Nîmes.
const rc = { left: 380, right: 1880, top: 60, bottom: 960 };
const ZOOM = 12;
const uAct = 2 * Math.PI * R / (256 * Math.pow(2, ZOOM));       // m Mercator / px au zoom 12
const ext = [4.36 - 750 * uAct / R / rad, 43.8, 4.36 + 750 * uAct / R / rad, 43.9];

// L'emprise projetée en pixels d'écran pour le centre et le zoom rendus.
function projeter(bbox, c) {
    const u = uAct * Math.pow(2, ZOOM - c.zoom);
    const cxPx = (rc.left + rc.right) / 2, cyPx = (rc.top + rc.bottom) / 2;
    return {
        g: cxPx + (mx(bbox[0]) - mx(c.lon)) / u, d: cxPx + (mx(bbox[2]) - mx(c.lon)) / u,
        h: cyPx - (my(bbox[3]) - my(c.lat)) / u, b: cyPx - (my(bbox[1]) - my(c.lat)) / u,
    };
}
const CAS = [
    { nom: 'fenêtre à droite (520 px), commune', zone: { rc, g: rc.left, d: rc.right - 528, h: rc.top, b: rc.bottom }, bbox: [4.30, 43.78, 4.48, 43.92] },
    { nom: 'aucune fenêtre, département', zone: { rc, g: rc.left, d: rc.right, h: rc.top, b: rc.bottom }, bbox: [3.26, 43.46, 4.85, 44.46] },
    { nom: 'fenêtre repliée en haut (barre de 42 px)', zone: { rc, g: rc.left, d: rc.right, h: rc.top + 50, b: rc.bottom }, bbox: [4.30, 43.78, 4.48, 43.92] },
    { nom: 'fenêtre à gauche, emprise très haute (Mercator)', zone: { rc, g: rc.left + 540, d: rc.right, h: rc.top, b: rc.bottom }, bbox: [4.40, 43.20, 4.46, 44.60] },
    // Large et basse : tient sur la carte entière au zoom 11, pas dans les 972 px libres.
    { nom: 'fenêtre à droite, emprise large et basse', zone: { rc, g: rc.left, d: rc.right - 528, h: rc.top, b: rc.bottom }, bbox: [4.00, 43.83, 4.42, 43.87] },
    { nom: 'point seul (voie de 20 m)', zone: { rc, g: rc.left, d: rc.right - 528, h: rc.top, b: rc.bottom }, bbox: [4.3600, 43.8400, 4.3602, 43.8401] },
];
function verifier(f, c0) {
    const c = f(c0.bbox, c0.zone, ext, ZOOM, 3, 22);
    const p = projeter(c0.bbox, c), z = c0.zone, fautes = [];
    if (!(p.g >= z.g - 1 && p.d <= z.d + 1 && p.h >= z.h - 1 && p.b <= z.b + 1))
        fautes.push('déborde : ' + [p.g, p.d, p.h, p.b].map(Math.round).join(',') + ' hors de ' + [z.g, z.d, z.h, z.b].join(','));
    const ecX = (p.g + p.d) / 2 - (z.g + z.d) / 2, ecY = (p.h + p.b) / 2 - (z.h + z.b) / 2;
    if (Math.abs(ecX) > 2 || Math.abs(ecY) > 2) fautes.push('décentré de ' + Math.round(ecX) + ' × ' + Math.round(ecY) + ' px');
    // Le zoom le plus fort qui tient : un cran de plus déborderait (sauf plafond 22).
    if (c.zoom < 22) {
        const p2 = projeter(c0.bbox, Object.assign({}, c, { zoom: c.zoom + 1 }));
        if ((p2.d - p2.g) * 1.1 <= z.d - z.g && (p2.b - p2.h) * 1.1 <= z.b - z.h) fautes.push('zoom ' + c.zoom + ' trop faible : ' + (c.zoom + 1) + ' tiendrait');
    }
    return fautes;
}
let echecs = 0;
const f = charger(code);
for (const c of CAS) {
    const fautes = verifier(f, c);
    if (fautes.length) { echecs++; console.log('ÉCHEC — ' + c.nom + ' : ' + fautes.join(' ; ')); }
}
// Témoins : chaque défaut connu doit faire tomber au moins un cas.
const TEMOINS = [
    ['centré sur la carte entière (le défaut relevé le 28/09)', c => c.replace('const dx = (zone.g + zone.d) / 2 - (rc.left + rc.right) / 2', 'const dx = 0')],
    ['latitude en degrés au lieu du Mercator', c => c.replace('y0 = my(bbox[1]), y1 = my(bbox[3])', 'y0 = mx(bbox[1]), y1 = mx(bbox[3])')],
    ['zoom arrondi au-dessus', c => c.replace('Math.floor(Math.log2(uAct / uVoulu))', 'Math.ceil(Math.log2(uAct / uVoulu))')],
    ['zoom mesuré sur la carte entière', c => c.replace('const lv = Math.max(zone.d - zone.g, 50), hv = Math.max(zone.b - zone.h, 50);', 'const lv = W, hv = H;')],
    ['axe Y non inversé', c => c.replace('cy = (y0 + y1) / 2 + dy * u', 'cy = (y0 + y1) / 2 - dy * u')],
];
let vus = 0;
for (const [nom, muter] of TEMOINS) {
    const m = muter(code);
    if (m === code) { console.log('TÉMOIN INOPÉRANT (rien remplacé) — ' + nom); echecs++; continue; }
    const tombe = CAS.filter(c => verifier(charger(m), c).length);
    if (tombe.length) { vus++; console.log('  témoin « ' + nom + ' » : ' + tombe.length + ' cas tombent (' + tombe[0].nom + ')'); }
    else { echecs++; console.log('TÉMOIN NON VU — ' + nom); }
}
if (echecs) { console.log('\n' + echecs + ' échec(s)'); process.exit(1); }
console.log('\nOK — ' + CAS.length + ' cas, ' + vus + ' témoins vus échouer');
