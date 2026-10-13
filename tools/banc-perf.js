// Temps du calcul sur une commune de la taille de Nîmes (36 000 adresses, 2 000 voies,
// 20 000 segments, 1 400 numéros WME), tiré du FICHIER LIVRÉ. Le calcul tourne sur le fil de la
// page : tant qu'il dure, WME ne répond plus. Le 26/09, Nîmes restait ~11 s sans avancement visible ;
// la boucle voies × segments en prenait la moitié (942 ms ici avant l'index par nom, ~380 ms après).
// Usage : node tools/banc-perf.js [fichier] [plafond_ms]
const fs = require('fs');
const path = require('path');
const f = process.argv[2] || path.join(__dirname, '..', 'WME-BAN-Coverage.user.js');
const PLAFOND = Number(process.argv[3] || 700);
const brut = fs.readFileSync(f, 'utf8');
const src = brut.slice(brut.indexOf('// ==WBC-CORE=='), brut.indexOf('// ==/WBC-CORE=='));
const Core = new Function(src + '\nreturn Core;')();

// Une grille de rues : 100 rues est-ouest et 100 nord-sud sur 10 km, découpées en segments de
// 100 m ; chaque rue est découpée en 10 voies BAN de 18 numéros, soit 2 000 voies et 36 000 adresses.
const LON0 = 4.3, LAT0 = 43.8, KX = 111320 * Math.cos(LAT0 * Math.PI / 180), KY = 110540;
const P = (x, y) => [LON0 + x / KX, LAT0 + y / KY];
const streets = [], segments = [], adresses = [], hns = [];
let sid = 1, gid = 1;
for (let r = 0; r < 200; r++) {
    const ew = r < 100, k = ew ? r : r - 100;
    for (let part = 0; part < 10; part++) {
        const nom = (ew ? 'Rue ' : 'Avenue ') + k + '-' + part;
        streets.push({ id: sid, name: nom });
        for (let s = 0; s < 10; s++) {
            const a = part * 1000 + s * 100, b = a + 100, c = k * 100;
            segments.push({ id: gid++, primaryStreetID: sid, streetIDs: [], hasHNs: true, geometry: { coordinates: ew ? [P(a, c), P(b, c)] : [P(c, a), P(c, b)] } });
        }
        for (let n = 1; n <= 18; n++) {
            const x = part * 1000 + n * 50, [lon, lat] = ew ? P(x, k * 100 + 8) : P(k * 100 + 8, x);
            adresses.push({ voie: nom, deleguee: '', brut: String(n), num: String(n), lon, lat, cert: true });
            if (n % 25 === 0 || (r * 10 + part) % 26 === 0) hns.push({ id: 'h' + hns.length, segID: gid - 10 + Math.floor(n / 2), number: String(n), geometry: { coordinates: [lon, lat] } });
        }
        sid++;
    }
}
let echec = false;
function mesurer(nom, d) {
    const t0 = Date.now();
    const R = Core.analyser(d);
    const ms = Date.now() - t0;
    console.log(nom + ' : ' + d.adresses.length + ' adresses, ' + R.voies.length + ' voies, ' + d.segments.length + ' segments, ' + d.hns.length + ' HN → ' + ms + ' ms (plafond ' + PLAFOND + ' ms)');
    if (ms > PLAFOND) { console.error('  TROP LENT'); echec = true; }
}
mesurer('grille clairsemée', { adresses, segments, streets, hns, rpps: [], contour: null });

// Un CENTRE DENSE, comme Nîmes : la grille clairsemée ci-dessus est passée à 380 ms quand la page
// restait figée 7,7 s (26/09). Rues tous les 40 m sur 2,4 km, segments de 40 m à 8 sommets, et
// 36 000 adresses sur 120 voies : chaque recherche du segment le plus proche voit des centaines
// de segments.
{
    const st = [], sg = [], ad = [], hn = [];
    let s2 = 1, g2 = 1;
    const PAS_RUE = 40, N_RUES = 60, LONG = PAS_RUE * N_RUES;
    for (let r = 0; r < 2 * N_RUES; r++) {
        const ew = r < N_RUES, k = ew ? r : r - N_RUES;
        const nom = (ew ? 'Rue ' : 'Boulevard ') + k;
        // Une voie sur deux porte dans WME un nom qui n'est pas celui de la BAN : c'est ce qui
        // déclenche la recherche du segment le plus proche SANS filtre de nom (le cas coûteux).
        st.push({ id: s2, name: k % 2 ? nom : 'Autre ' + nom });
        for (let a = 0; a < LONG; a += PAS_RUE) {
            const pts = [];
            for (let q = 0; q <= 7; q++) { const x = a + q * PAS_RUE / 7, y = k * PAS_RUE + (q % 2) * 2; pts.push(ew ? P(x, y) : P(y, x)); }
            sg.push({ id: g2++, primaryStreetID: s2, streetIDs: [], hasHNs: true, geometry: { coordinates: pts } });
        }
        for (let n = 1; n <= 300; n++) {
            const x = (n / 300) * LONG, [lon, lat] = ew ? P(x, k * PAS_RUE + 9) : P(k * PAS_RUE + 9, x);
            ad.push({ voie: nom, deleguee: '', brut: String(n), num: String(n), lon, lat, cert: true });
            if (n % 20 === 0) hn.push({ id: 'd' + hn.length, segID: g2 - 1, number: String(n), geometry: { coordinates: [lon, lat] } });
        }
        s2++;
    }
    mesurer('centre dense', { adresses: ad, segments: sg, streets: st, hns: hn, rpps: [], contour: null });

    // …et les GRANDS segments d'une vraie commune : rocades, routes rurales, droites de plusieurs
    // kilomètres à 2 sommets, en diagonale. Mesuré le 26/09 : la 0.01.03 (304 ms sur le centre dense)
    // figeait encore Nîmes 7,5 s — chaque segment était rangé dans toutes les cases de sa boîte.
    const longs = [];
    let alea = 12345;
    const rnd = () => (alea = (alea * 16807) % 2147483647) / 2147483647;
    st.push({ id: 99999, name: 'Rocade' });
    for (let q = 0; q < 3000; q++) {
        const x = rnd() * 20000 - 8000, y = rnd() * 20000 - 8000, l = 2000 + rnd() * 4000, a = rnd() * Math.PI;
        longs.push({ id: 900000 + q, primaryStreetID: 99999, streetIDs: [], hasHNs: false, geometry: { coordinates: [P(x, y), P(x + l * Math.cos(a), y + l * Math.sin(a))] } });
    }
    // Une commune NUMÉROTÉE à 100 % (audit du 26/09, M12/M18) : chaque adresse a son HN. Le
    // rapprochement indexé par le seul numéro comparait chaque adresse à tous les numéros égaux de
    // la commune (1 239 ms mesurés sur la vraie BAN de Nîmes, sous Node).
    const hnTous = ad.map((a, k) => ({ id: 't' + k, segID: 1, number: a.brut, geometry: { coordinates: [a.lon, a.lat - 5 / KY] } }));
    mesurer('centre dense numéroté à 100 %', { adresses: ad, segments: sg, streets: st, hns: hnTous, rpps: [], contour: null });
    mesurer('centre dense + 3 000 longs segments', { adresses: ad, segments: sg.concat(longs), streets: st, hns: hn, rpps: [], contour: null });
}
if (echec) process.exit(1);
