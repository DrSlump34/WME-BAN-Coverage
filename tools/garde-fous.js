// Garde-fous que NI Node NI un banc ne peuvent voir, parce qu'ils ne se paient que dans le bac à
// sable du gestionnaire de scripts, dans WME (mesuré le 26/09/2026 à Nîmes : sans eux, le calcul
// passait de 0,58 s à 13,6 s, page figée) :
//   1. les réponses de WME se décodent par JSON.parse(await r.text()), jamais par r.json() ;
//   2. le cœur de calcul lie ses globales (Math, Map, Set, Infinity…) en tête, une fois ;
// et, d'après l'audit du 26/09 :
//   3. aucune écriture en innerHTML d'une valeur de la BAN ou de WME sans esc() n'est ajoutée — on
//      vérifie au moins que esc() échappe les cinq caractères dangereux ;
//   4. l'export CSV neutralise les formules (= + - @ en tête de cellule).
// Chaque règle est vue ÉCHOUER sur une copie mutée du fichier, sinon le contrôle ne prouve rien.
// Usage : node tools/garde-fous.js [fichier]
const fs = require('fs');
const path = require('path');
const f = process.argv[2] || path.join(__dirname, '..', 'WME-BAN-Coverage.user.js');
const brut = fs.readFileSync(f, 'utf8');

function verifier(src) {
    const e = [];
    const wme = /async function wmeUneFois\([\s\S]*?\n    }\n/.exec(src);
    if (!wme) e.push('wmeUneFois introuvable');
    else {
        if (!wme[0].includes('await r.text()') || !wme[0].includes('JSON.parse(')) e.push('1. wmeUneFois ne décode plus le TEXTE par JSON.parse');
        if (/\br\.json\(\)/.test(wme[0].replace(/\/\/.*$/gm, ''))) e.push('1. wmeUneFois appelle r.json()');
    }
    const coeur = src.slice(src.indexOf('// ==WBC-CORE=='), src.indexOf('// ==/WBC-CORE=='));
    const lie = /const \{([^}]*)\} = globalThis;/.exec(coeur);
    if (!lie) e.push('2. le cœur ne lie plus ses globales (const { … } = globalThis;)');
    else for (const g of ['Math', 'Map', 'Set', 'Infinity', 'Number']) if (!new RegExp('\\b' + g + '\\b').test(lie[1])) e.push('2. globale non liée dans le cœur : ' + g);
    const esc = /const esc = s => ([^\n]+);/.exec(src);
    if (!esc) e.push('3. esc() introuvable');
    else {
        const fn = new Function('return s => ' + esc[1])();
        // Sortie EXACTE attendue : chercher seulement des caractères dangereux ne voyait pas une table
        // amputée qui écrit « undefined » à la place de l'apostrophe.
        const sortie = fn('<img src=x onerror="a(\'b\')">&');
        const attendu = '&lt;img src=x onerror=&quot;a(&#39;b&#39;)&quot;&gt;&amp;';
        if (sortie !== attendu) e.push('3. esc() ne rend pas la sortie attendue : ' + sortie);
    }
    const csv = /const csvChamp = ([^\n]+);/.exec(src);
    const neutre = /const csvNeutre = ([^\n]+);/.exec(src);
    if (!csv) e.push('4. csvChamp introuvable');
    else {
        const fn = new Function((neutre ? 'const csvNeutre = ' + neutre[1] + ';\n' : '') + 'return ' + csv[1])();
        for (const v of ['=1+1', '+33', '-2', '@SUM(A1)']) if (/^[=+\-@]/.test(String(fn(v)).replace(/^"/, ''))) e.push('4. csvChamp laisse une formule en tête : ' + v);
    }
    return e;
}

const erreurs = verifier(brut);
if (erreurs.length) { console.error(erreurs.join('\n')); process.exit(1); }

// Les témoins : chaque mutation doit faire échouer le contrôle.
const TEMOINS = [
    ['retour à r.json()', 'const txt = await r.text();', 'const txt = JSON.stringify(await r.json());'],
    ['globales du cœur non liées', ' } = globalThis;', ' } = { Math: globalThis.Math };'],
    ['esc() qui oublie l\'apostrophe', "'\"': '&quot;', \"'\": '&#39;'", "'\"': '&quot;'"],
    ['CSV sans neutralisation des formules', "/^[=+\\-@\\t\\r]/.test(s) ? \"'\" + s : s", 's'],
];
let ko = 0;
for (const [nom, avant, apres] of TEMOINS) {
    if (!brut.includes(avant)) { console.error('témoin « ' + nom + ' » : motif introuvable — le contrôle a vieilli'); ko++; continue; }
    let e;
    try { e = verifier(brut.replace(avant, apres)); } catch (x) { e = ['exception : ' + x.message]; }
    if (!e.length) { console.error('témoin « ' + nom + ' » : le contrôle NE VOIT PAS la mutation'); ko++; }
    else console.log('  témoin « ' + nom + ' » : ' + e[0]);
}
if (ko) process.exit(1);
console.log('OK — 4 garde-fous, ' + TEMOINS.length + ' témoins vus échouer');
