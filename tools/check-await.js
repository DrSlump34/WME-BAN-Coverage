// Le SDK est créé en mode async : chaque appel du modèle de données rend une PROMESSE (mesuré le 14/10/2026,
// WME v2.374 — addVenue, updateAddress, getAddress, getAll compris). Un appel sans await passe en silence :
// « [object Promise] » pour identifiant, tableau « not iterable », adresse refusée prise pour acceptée.
// Ce contrôle exige `await` devant chaque appel `sdk.DataModel.X.y(` ou `DM.X.y(` du script, puis vérifie sur
// un témoin (un await retiré) qu'il échoue bien.
// Usage : node tools/check-await.js [fichier]
'use strict';
const fs = require('fs');
const path = require('path');
const f = process.argv[2] || path.join(__dirname, '..', 'WME-BAN-Coverage.user.js');

function fautes(texte) {
    const out = [];
    texte.split('\n').forEach((l, i) => {
        if (/^\s*\/\//.test(l)) return;
        const re = /(?:\bsdk\.DataModel|\bDM)\.[A-Za-z]+\.[A-Za-z]+\(/g;
        let m;
        while ((m = re.exec(l))) {
            const avant = l.slice(0, m.index);
            if (!/await\s*\(*\s*$/.test(avant)) out.push((i + 1) + ' : ' + l.trim().slice(0, 120));
        }
    });
    return out;
}

const brut = fs.readFileSync(f, 'utf8');
const f1 = fautes(brut);
if (f1.length) { console.error('APPELS SANS await :\n  ' + f1.join('\n  ')); process.exit(1); }
// Témoin : un await retiré doit être vu.
const temoin = brut.replace('await DM.Venues.updateAddress(', 'DM.Venues.updateAddress(');
if (temoin === brut) { console.error('témoin introuvable (await DM.Venues.updateAddress)'); process.exit(1); }
if (!fautes(temoin).length) { console.error('le témoin « await retiré » passe : le contrôle ne voit rien'); process.exit(1); }
console.log('OK — chaque appel du modèle de données est attendu ; témoin « await retiré » vu échouer');
