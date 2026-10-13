// Remet sous forme d'échappement JavaScript les caractères invisibles d'un fichier source
// (espace insécable, espace fine insécable, BOM) et les ligatures de la normalisation des noms :
// un caractère invisible dans le code ne se relit pas.
// Écrit sans aucune barre oblique inverse : les outils qui ont écrit le script décodaient les
// séquences d'échappement au passage (constaté le 26/09/2026).
// Usage : node tools/echapper-invisibles.js <fichier> [--verifier]
const fs = require('fs');
const p = process.argv[2];
const verifier = process.argv.includes('--verifier');
const BS = String.fromCharCode(92);
const CIBLES = [[0xa0, 'u00a0'], [0x202f, 'u202f'], [0xfeff, 'uFEFF'], [0x153, 'u0153'], [0xe6, 'u00e6']];
let s = fs.readFileSync(p, 'utf8');
const trouves = [];
for (const [code, nom] of CIBLES) {
    const c = String.fromCharCode(code);
    // Les ligatures ne sont visées que dans le code de normalisation, pas dans les textes affichés.
    const re = code === 0x153 || code === 0xe6 ? new RegExp('replace\\(/' + c + '/g', 'g') : new RegExp(c, 'g');
    const n = (s.match(re) || []).length;
    if (!n) continue;
    trouves.push(nom + ' ×' + n);
    s = s.replace(re, m => m.split(c).join(BS + nom));
}
if (verifier) {
    if (trouves.length) { console.error('caractères à échapper : ' + trouves.join(', ')); process.exit(1); }
    console.log('OK — aucun caractère invisible littéral');
} else {
    fs.writeFileSync(p, s);
    console.log(trouves.length ? 'échappés : ' + trouves.join(', ') : 'rien à échapper');
}
