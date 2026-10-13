// Empreinte SHA-256 du code, calculée comme le script la calcule au démarrage (_vmEmpreinte) : le texte
// de l'enveloppe `(function _wmeIntegre() { … })`, c'est-à-dire ce que rend _wmeIntegre.toString() dans
// le navigateur, fins de ligne ramenées à LF. L'en-tête ==UserScript== (que GreasyFork réécrit) n'en fait
// pas partie. C'est la valeur à publier dans version-min.json pour la version de l'en-tête.
//
// Usage : node tools/empreinte.js [fichier]              → affiche version et empreinte
//         node tools/empreinte.js [fichier] --verifier   → échoue si version-min.json ne porte pas cette
//                                                          empreinte pour cette version, ou si min la dépasse
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const OUVERTURE = '(function _wmeIntegre() {';
const FERMETURE = '})();';

// Le texte que rend _wmeIntegre.toString() : de « function _wmeIntegre » à l'accolade fermante.
function texteEnveloppe(brut) {
    const s = String(brut).replace(/\r\n/g, '\n');
    const i = s.indexOf(OUVERTURE);
    if (i < 0) throw new Error('enveloppe « ' + OUVERTURE + ' » introuvable');
    if (s.indexOf(OUVERTURE, i + 1) >= 0) throw new Error('enveloppe ouverte deux fois');
    const j = s.lastIndexOf(FERMETURE);
    if (j < i) throw new Error('fermeture « ' + FERMETURE + ' » introuvable');
    if (s.slice(j + FERMETURE.length).trim()) throw new Error('du code suit la fermeture de l\'enveloppe');
    const texte = s.slice(i + 1, j + 1);
    // Contre-épreuve : le moteur doit rendre exactement ce texte pour la fonction.
    const rendu = new Function('return (' + texte + ');')().toString();
    if (rendu !== texte) throw new Error('toString() ne rend pas le texte découpé');
    return texte;
}
// Même filtre que _vmEmpreinte (sans effet sur l'enveloppe, gardé pour que le calcul soit identique).
function empreinteDe(brut) {
    const t = texteEnveloppe(brut).split('\n').filter(l => !/^\/\/ @(downloadURL|updateURL)\b/.test(l)).join('\n');
    return crypto.createHash('sha256').update(t, 'utf8').digest('hex');
}
const versionDe = brut => ((String(brut).match(/^\/\/ @version\s+(\S+)/m) || [])[1] || '');
const cmp = (a, b) => {
    const x = String(a).split('.').map(Number), y = String(b).split('.').map(Number);
    for (let i = 0; i < Math.max(x.length, y.length); i++) { const d = (x[i] || 0) - (y[i] || 0); if (d) return d < 0 ? -1 : 1; }
    return 0;
};
// Rend la liste des écarts entre le fichier et version-min.json (vide = cohérent).
function ecartsVersionMin(brut, vm) {
    const v = versionDe(brut), h = empreinteDe(brut), e = [];
    if (!vm || typeof vm !== 'object') return ['version-min.json illisible'];
    if (typeof vm.min !== 'string' || !/^\d+(\.\d+)*$/.test(vm.min)) e.push('min absent ou non numérique');
    else if (cmp(v, vm.min) < 0) e.push('min ' + vm.min + ' dépasse la version du fichier ' + v + ' : elle serait bloquée');
    const att = vm.empreintes && vm.empreintes[v];
    if (!att) e.push('aucune empreinte pour ' + v);
    else if (String(att).toLowerCase() !== h) e.push('empreinte publiée pour ' + v + ' = ' + att + ', calculée = ' + h);
    return e;
}
module.exports = { texteEnveloppe, empreinteDe, versionDe, ecartsVersionMin };

if (require.main === module) {
    const args = process.argv.slice(2);
    const f = args.find(a => !a.startsWith('--')) || path.join(__dirname, '..', 'WME-BAN-Coverage.user.js');
    const brut = fs.readFileSync(f, 'utf8');
    console.log(versionDe(brut) + ' ' + empreinteDe(brut));
    if (args.includes('--verifier')) {
        const vm = JSON.parse(fs.readFileSync(path.join(path.dirname(f), 'version-min.json'), 'utf8'));
        const e = ecartsVersionMin(brut, vm);
        if (e.length) { console.error('ÉCART — ' + e.join(' ; ')); process.exit(1); }
        console.log('OK — version-min.json porte cette empreinte, min ' + vm.min);
    }
}
