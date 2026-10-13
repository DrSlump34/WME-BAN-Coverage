// Le plafond de l'ajout automatique (150 numéros par heure) ne doit pas pouvoir être relevé en
// changeant UNE constante : la sonde de la page (_hc) doit alors refuser, ce qui éteint le bouton.
// Tiré du FICHIER LIVRÉ : le cœur (entre // ==WBC-CORE== et // ==/WBC-CORE==) et le bloc d'habilitation.
// Chaque falsification doit faire tomber la sonde ; le fichier intact doit la passer.
// ⚠️ Limite d'un contrôle dans le navigateur : qui SUPPRIME l'appel à _hc() le contourne. Le but est de
// décourager, pas d'empêcher.
// Usage : node tools/banc-plafond.js [fichier]
const fs = require('fs');
const path = require('path');
const f = process.argv[2] || path.join(__dirname, '..', 'WME-BAN-Coverage.user.js');
const brut = fs.readFileSync(f, 'utf8');

function sonde(src) {
    const d = src.indexOf('// ==WBC-CORE=='), e = src.indexOf('// ==/WBC-CORE==');
    const h0 = src.indexOf('    const _hx = '), h1 = src.indexOf('    async function _hp()');
    if (d < 0 || e < 0 || h0 < 0 || h1 < 0) throw new Error('bornes introuvables');
    return new Function(src.slice(d, e) + '\n' + src.slice(h0, h1) + '\nreturn _hc();')();
}

const CAS = [
    ['plafond du cœur relevé à 1000', 'const HN_MAX = 150,', 'const HN_MAX = 1000,'],
    ['fenêtre du cœur allongée à 2 h', 'HN_FENETRE_MS = 3600 * 1000;', 'HN_FENETRE_MS = 2 * 3600 * 1000;'],
    ['sonde seule relevée à 1000', 'const _hk = [0x96, 0x36ee80];', 'const _hk = [0x3e8, 0x36ee80];'],
    ['plafond du cœur ET sonde relevés, recoupement oublié', 'const HN_MAX = 150,', 'const HN_MAX = 1000,', 'const _hk = [0x96, 0x36ee80];', 'const _hk = [0x3e8, 0x36ee80];'],
    ['recoupement neutralisé, plafond du cœur relevé (la sonde du cœur tient encore)', ') >>> 0) === _hq;', ') >>> 0) !== -1;', 'const HN_MAX = 150,', 'const HN_MAX = 1000,'],
];
let ko = 0;
const ok0 = (() => { try { return sonde(brut); } catch (e) { console.error('fichier livré : ' + e.message); return false; } })();
console.log((ok0 ? '  ok ' : '  KO ') + 'fichier livré : la sonde passe');
if (!ok0) ko++;
for (const [nom, ...paires] of CAS) {
    let src = brut;
    for (let i = 0; i < paires.length; i += 2) {
        if (!src.includes(paires[i])) { console.error('  KO ' + nom + ' : motif introuvable — le banc a vieilli'); ko++; src = null; break; }
        src = src.replace(paires[i], paires[i + 1]);
    }
    if (!src) continue;
    let r;
    try { r = sonde(src); } catch (e) { r = false; }
    console.log((r === false ? '  ok ' : '  KO ') + nom + ' : sonde ' + (r ? 'PASSE' : 'refuse'));
    if (r !== false) ko++;
}
if (ko) { console.error('\n' + ko + ' échec(s)'); process.exit(1); }
console.log('\nOK — la sonde refuse chaque falsification d\'une seule constante');
