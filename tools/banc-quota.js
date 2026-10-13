// Le compteur du quota de l'ajout automatique (bloc // ==WBC-QUOTA== du fichier livré) : illisible, scellé,
// en trois copies. Signalé le 11/10/2026 : effacer `wbc.hn.<pseudo>` du localStorage rendait les 150 numéros.
// Chaque « page » est une nouvelle exécution du bloc (mémoire de page vide) sur les MÊMES stockages.
// Puis le banc se falsifie lui-même : un bloc privé du scellé ou de la réunion doit le faire échouer.
// ⚠️ Limite assumée : qui efface les DEUX stockages et recharge la page repart de zéro.
// Usage : node tools/banc-quota.js [fichier]
const fs = require('fs');
const path = require('path');
const f = process.argv[2] || path.join(__dirname, '..', 'WME-BAN-Coverage.user.js');
const brut = fs.readFileSync(f, 'utf8');

function extraire(src) {
    const h0 = src.indexOf('    const _hx = '), h1 = src.indexOf('    function _hc()');
    const q0 = src.indexOf('    // ==WBC-QUOTA=='), q1 = src.indexOf('    // ==/WBC-QUOTA==');
    if (h0 < 0 || h1 < 0 || q0 < 0 || q1 < 0) throw new Error('bornes introuvables');
    return src.slice(h0, h1) + '\n' + src.slice(q0, q1);
}

function scenario(src) {
    const code = extraire(src);
    const ls = new Map(), gm = new Map();
    const localStorage = { getItem: k => ls.has(k) ? ls.get(k) : null, setItem: (k, v) => ls.set(k, String(v)), removeItem: k => ls.delete(k) };
    const GM_getValue = (k, d) => gm.has(k) ? gm.get(k) : d, GM_setValue = (k, v) => gm.set(k, v);
    const page = (user = 'editeur_test') => new Function('localStorage', 'GM_getValue', 'GM_setValue', 'log',
        'let hnUser = ' + JSON.stringify(user) + ';\n' + code + '\nreturn { lireHorodatages, ecrireHorodatages, cle: _qn() };')(localStorage, GM_getValue, GM_setValue, () => { });
    const recents = l => l.filter(x => (typeof x === 'number' ? x : x.t) > Date.now() - 3600e3).length;
    const m = Date.now();
    const liste = Array.from({ length: 40 }, (_, i) => ({ t: m - i * 1000, s: 1000 + i, n: String(i + 1), e: i % 2, c: '35238' }));
    const res = [];
    const ok = (nom, v) => res.push([nom, !!v]);

    let p = page();
    p.ecrireHorodatages(liste);
    ok('relu à l\'identique', JSON.stringify(page().lireHorodatages().sort((a, b) => b.t - a.t)) === JSON.stringify(liste));
    const v = ls.get(p.cle) || '';
    ok('nom de clé neutre (ni pseudo, ni « hn »)', !/editeur_test|hn/i.test(p.cle));
    const dec = Buffer.from(v.replace(/^w2\.[0-9a-z]+\./, ''), 'base64').toString('latin1');
    ok('valeur illisible, même base64 décodé (ni JSON, ni horodatage, ni segment, ni commune)', v.startsWith('w2.') &&
        !/[{}"]/.test(v) && ![v, dec].some(x => /"[tsnec]":|\b1\d{12}\b|\b10[0-3]\d\b|35238/.test(x)));
    ok('les deux stockages écrits', ls.get(p.cle) === gm.get(p.cle));

    ls.clear();
    ok('localStorage effacé ⇒ rien de rendu', recents(page().lireHorodatages()) === 40);
    gm.clear(); p = page(); p.ecrireHorodatages(liste); ls.clear(); gm.clear();
    ok('les deux effacés, MÊME page ⇒ rien de rendu', recents(p.lireHorodatages()) === 40);
    ok('les deux effacés, page RECHARGÉE ⇒ remis à zéro (limite assumée)', recents(page().lireHorodatages()) === 0);

    page().ecrireHorodatages(liste.slice(0, 5));
    const w = ls.get(p.cle), i = w.length - 6;
    ls.set(p.cle, w.slice(0, i) + (w[i] === 'A' ? 'B' : 'A') + w.slice(i + 1));
    ok('copie retouchée ⇒ ajout bloqué (≥ 150 dans l\'heure)', recents(page().lireHorodatages()) >= 150);
    ls.clear(); gm.clear();
    page().ecrireHorodatages(liste.slice(0, 5));
    ls.set(p.cle, gm.get(p.cle).replace(/^w2\.[0-9a-z]+\./, 'w2.0.'));
    ok('sceau remplacé ⇒ ajout bloqué', recents(page().lireHorodatages()) >= 150);

    ls.clear(); gm.clear();
    ls.set('wbc.hn.editeur_test', JSON.stringify(liste.slice(0, 12)));
    ok('ancien format en clair repris', recents(page().lireHorodatages()) === 12);
    ok('ancien format effacé après reprise', !ls.has('wbc.hn.editeur_test') && ls.has(p.cle));

    ls.clear(); gm.clear();
    page('autre').ecrireHorodatages(liste);
    ok('copie d\'un autre pseudo : refusée (bloque, ne se partage pas)', recents(page().lireHorodatages()) === 0 || recents(page().lireHorodatages()) >= 150);
    return res;
}

let ko = 0;
for (const [nom, v] of scenario(brut)) { console.log((v ? '  ok ' : '  KO ') + nom); if (!v) ko++; }

// Contre-champ : le banc doit tomber quand on retire une protection.
const MUTANTS = [
    ['scellé ignoré', "if (!m || _qt(m[2]) !== m[1]) return false;", "if (!m) return false;"],
    ['copie retouchée ignorée au lieu de bloquer', "if (l === false) faux = true; else", "if (l === false) {} else"],
    ['seconde copie (Tampermonkey) non écrite', "        _gmEcrire(c, v);\n", "\n"],
    ['mémoire de page oubliée', "const c = _qn(), listes = [quotaMem || []];", "const c = _qn(), listes = [];"],
    ['brouillage neutralisé (base64 seul)', "x ^= x << 5; x >>>= 0; return x & 255; }; };", "x ^= x << 5; x >>>= 0; return 0; }; };"],
];
for (const [nom, a, b] of MUTANTS) {
    const src = brut.replace(/\r\n/g, '\n');
    if (!src.includes(a)) { console.log('  KO mutant « ' + nom + ' » : motif introuvable — le banc a vieilli'); ko++; continue; }
    let tombe;
    try { tombe = scenario(src.replace(a, b)).some(([, v]) => !v); } catch (e) { tombe = true; }
    console.log((tombe ? '  ok ' : '  KO ') + 'mutant « ' + nom + ' » : ' + (tombe ? 'détecté' : 'PASSE INAPERÇU'));
    if (!tombe) ko++;
}
console.log(ko ? ko + ' échec(s)' : 'banc-quota : tout est vert');
process.exit(ko ? 1 : 0);
