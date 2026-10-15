// Banc de l'adaptateur pays, tiré du FICHIER LIVRÉ (de « const PAYS_FR = » à « const PAYS = ») et
// lancé contre les VRAIS serveurs (BAN, geo.api.gouv.fr) : Uzès, le Gard, une recherche par nom, par
// code postal, la commune au centre d'un point, l'empreinte et la date de révision.
// Puis chaque TÉMOIN — une mutation de l'adaptateur — doit faire échouer au moins un cas.
// Usage : node tools/banc-pays.js [fichier]      (réseau requis, ~10 s)
const fs = require('fs');
const path = require('path');
const f = process.argv[2] || path.join(__dirname, '..', 'WME-BAN-Coverage.user.js');
const brut = fs.readFileSync(f, 'utf8');
const borne = (a, b) => { const i = brut.indexOf(a), j = brut.indexOf(b); if (i < 0 || j < 0) { console.error('bornes introuvables : ' + a); process.exit(1); } return brut.slice(i, j); };
const CORE = borne('// ==WBC-CORE==', '// ==/WBC-CORE==');
const ADAPT = borne('    const PAYS_FR = (() => {', '    const PAYS = { FR: PAYS_FR };');

// Le réseau du script (gm, gmJson, gmTete) rejoué avec fetch, mêmes contrats : gm rend le texte, ou
// {texte, entetes} avec `complet` ; un statut hors 2xx lève une erreur qui porte `status`.
const err = (u, s) => Object.assign(new Error(u.split('/')[2] + ' HTTP ' + s), { reseau: true, status: s });
const gm = async (u, prog, complet) => {
    const r = await fetch(u);
    if (!r.ok) throw err(u, r.status);
    const texte = await r.text();
    return complet ? { texte, entetes: 'etag: ' + (r.headers.get('etag') || '') } : texte;
};
const gmJson = async u => JSON.parse(await gm(u));
const gmTete = async u => { const r = await fetch(u, { method: 'HEAD' }); if (r.status === 404) return '404'; if (!r.ok) throw err(u, r.status); return r.headers.get('etag') || ''; };
const etagDe = h => { const m = /^etag:\s*(.+)$/im.exec(h || ''); return m ? m[1].trim() : ''; };
const bboxDe = poly => { const c = poly.coordinates[0]; const xs = c.map(p => p[0]), ys = c.map(p => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };

const charger = src => new Function('gm', 'gmJson', 'gmTete', 'etagDe', 'bboxDe', CORE + '\n' + src + '\nreturn PAYS_FR;')(gm, gmJson, gmTete, etagDe, bboxDe);

async function cas(P) {
    const fautes = [];
    const ok = (c, m) => { if (!c) fautes.push(m); };
    const essai = async (m, fn) => { try { await fn(); } catch (e) { fautes.push(m + ' : ' + e.message); } };
    await essai('adresses Uzès', async () => {
        const l = await P.adresses('30334', () => { });
        ok(l.length > 3000 && l.length < 6000, 'Uzès : ' + l.length + ' adresses (attendu 3 000-6 000)');
        ok(l.every(a => a.voie && a.num && Number.isFinite(a.lon) && a.lon > 4.3 && a.lon < 4.5), 'Uzès : adresse mal formée ou hors commune');
        ok(typeof l.etag === 'string' && l.etag.length > 0, 'Uzès : ETag absent');
        const e = await P.empreinte('30334');
        ok(e === l.etag, 'empreinte (HEAD) ≠ ETag du téléchargement : ' + e + ' / ' + l.etag);
    });
    await essai('commune au point', async () => {
        const c = await P.auPoint(4.4196, 44.0124);
        ok(c && c.code === '30334' && c.dep === '30' && c.bbox && c.contour, 'centre d’Uzès ⇒ ' + JSON.stringify(c && { code: c.code, dep: c.dep }));
    });
    await essai('parCode', async () => { const c = await P.parCode('30334'); ok(c.nom === 'Uzès', 'parCode 30334 ⇒ ' + c.nom); });
    await essai('chercher', async () => {
        const a = await P.chercher('Uzès'); ok(a.some(c => c.code === '30334'), 'chercher « Uzès »');
        const b = await P.chercher('30700'); ok(b.some(c => c.code === '30334'), 'chercher « 30700 » (code postal)');
        const c = await P.chercher('2A004'); ok(c.some(x => x.code === '2A004'), 'chercher « 2A004 » (Ajaccio)');
    });
    await essai('groupes', async () => { const g = await P.groupes(); ok(g.length >= 101 && g.some(d => d.code === '30' && d.nom === 'Gard'), 'départements : ' + g.length); });
    await essai('communesDe', async () => { const l = await P.communesDe('30'); ok(l.length > 340 && l.length < 360 && l.every(c => c.dep === '30' && c.bbox), 'Gard : ' + l.length + ' communes'); });
    await essai('emprise', async () => {
        const c = await P.emprise('commune', '30334');
        ok(c && c[0] < 4.42 && c[2] > 4.42 && c[1] < 44.01 && c[3] > 44.01, 'emprise d’Uzès ' + JSON.stringify(c));
        const d = await P.emprise('dep', '30');
        ok(d && d[0] < 3.3 && d[2] > 4.8 && d[1] < 43.5 && d[3] > 44.4, 'emprise du Gard ' + JSON.stringify(d));
    });
    await essai('dateRevision', async () => { const d = await P.dateRevision('30334'); ok(Number.isFinite(d) && d > Date.UTC(2020, 0, 1), 'date de révision ' + d); });
    ok(P.code === 'FR' && P.source === 'BAN' && P.referentiel === 'geo.api.gouv.fr', 'noms de l’adaptateur');
    return fautes;
}

const TEMOINS = [
    ['URL de la BAN cassée', s => s.replace("/download/csv-bal/adresses'", "/download/csv-xxx/adresses'")],
    ['commune au point sans contour', s => s.replace("&lon=' + lon.toFixed(6) + '&fields=nom,code,codeDepartement,bbox,contour'", "&lon=' + lon.toFixed(6) + '&fields=nom,code,codeDepartement,bbox'")],
    ['recherche par code postal oubliée', s => s.replace("gmJson(GEO_URL + '/communes?codePostal=' + q + '&fields", "gmJson(GEO_URL + '/communes?code=' + q + '&fields")],
    ['code postal limité à 10 sans tri', s => s.replace("'&fields=nom,code,codeDepartement,codesPostaux,population').then(parPopulation)", "'&fields=nom,code,codeDepartement,codesPostaux&limit=10')")],
    ['union d’emprise fausse', s => s.replace('Math.max(...bs.map(x => x[2]))', 'Math.min(...bs.map(x => x[2]))')],
    ['empreinte sur la mauvaise URL', s => s.replace('l.push(await gmTete(BAN_URL(c)))', "l.push(await gmTete(GEO_URL + '/communes/' + c))")],
];

(async () => {
    const fautes = await cas(charger(ADAPT));
    if (fautes.length) { console.log('ÉCHEC\n  ' + fautes.join('\n  ')); process.exit(1); }
    let rates = 0;
    for (const [nom, m] of TEMOINS) {
        const src = m(ADAPT);
        if (src === ADAPT) { console.log('témoin « ' + nom + ' » : la mutation ne s’applique pas'); rates++; continue; }
        const f2 = await cas(charger(src));
        if (!f2.length) { console.log('témoin « ' + nom + ' » : NON VU'); rates++; }
    }
    if (rates) { console.log(rates + ' témoin(s) non vu(s)'); process.exit(1); }
    console.log('OK — adaptateur France : 9 groupes de cas sur les vrais serveurs (Uzès, Gard, recherche, emprise, empreinte), ' + TEMOINS.length + ' témoins vus échouer');
})();
