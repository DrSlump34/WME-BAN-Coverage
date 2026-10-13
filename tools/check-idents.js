// Tout nom utilisé dans le script doit y être déclaré, et déclaré LÀ où on l'utilise.
// node --check ne voit pas une fonction disparue : le script compile, puis meurt au
// démarrage sur une ReferenceError, sans rien poser à l'écran.
//
// Repris de WME Jump to Node (0.06.00), où chaque déclaration a gagné une PORTÉE (le bloc, ou le
// corps de la fonction pour un paramètre) et où toute référence est contrôlée, appel ou non.
// Complété pour WME BAN Coverage le 26/09/2026 : générateurs function*, étalement ...nom (pris à
// tort pour une propriété, il laissait passer une fonction disparue), et numéros de ligne justes
// (les sauts de ligne des commentaires et des gabarits sont gardés).
// tools/temoins-idents.js prouve que ces cas font échouer le contrôle.
//
// Usage : node tools/check-idents.js [fichier]
const fs = require('fs');
const path = require('path');
const f = process.argv[2] || path.join(__dirname, '..', 'WME-BAN-Coverage.user.js');
const brut = fs.readFileSync(f, 'utf8');

// Ne garde que le CODE : chaînes, textes des gabarits, expressions régulières et commentaires
// sont remplacés par des blancs ; les expressions ${…} des gabarits restent, puisqu'elles
// s'exécutent.
function codeSeul(s) {
    let out = '', i = 0;
    const pile = [];              // profondeur d'accolades de chaque ${ ouvert
    let etat = 'code';
    // Un « / » ouvre une expression régulière s'il ne peut pas être une division.
    const avantRegex = () => {
        const m = out.match(/(\S)\s*$/);
        if (!m) return true;
        if ('(,=:[!&|?{};+-*%<>~^'.includes(m[1])) return true;
        return /\b(return|typeof|case|in|of)\s*$/.test(out);
    };
    while (i < s.length) {
        const c = s[i], d = s[i + 1];
        if (etat === 'code') {
            if (c === '/' && d === '/') { while (i < s.length && s[i] !== '\n') i++; continue; }
            // Les sauts de ligne sont GARDÉS (commentaires multilignes, texte des gabarits) : sans eux,
            // les numéros de ligne signalés dérivaient de plus de 170 lignes (audit WBC du 26/09).
            if (c === '/' && d === '*') { const j = s.indexOf('*/', i + 2), f = j < 0 ? s.length : j + 2; out += ' ' + s.slice(i, f).replace(/[^\n]/g, ''); i = f; continue; }
            if (c === '/' && avantRegex()) {
                let classe = false;
                i++;
                while (i < s.length && (classe || s[i] !== '/')) {
                    if (s[i] === '\\') i++;
                    else if (s[i] === '[') classe = true;
                    else if (s[i] === ']') classe = false;
                    i++;
                }
                i++;
                while (i < s.length && /[a-z]/.test(s[i])) i++;
                out += '/./';
                continue;
            }
            if (c === "'" || c === '"') { const q = c; i++; while (i < s.length && s[i] !== q) i += s[i] === '\\' ? 2 : 1; i++; out += "''"; continue; }
            if (c === '`') { etat = 'gabarit'; i++; out += ' '; continue; }
            if (c === '{' && pile.length) pile[pile.length - 1]++;
            if (c === '}' && pile.length) {
                if (pile[pile.length - 1] === 0) { pile.pop(); etat = 'gabarit'; i++; out += ' '; continue; }
                pile[pile.length - 1]--;
            }
            out += c; i++; continue;
        }
        // gabarit
        if (c === '\\') { i += 2; continue; }
        if (c === '`') { etat = 'code'; i++; out += ' '; continue; }
        if (c === '$' && d === '{') { pile.push(0); etat = 'code'; i += 2; out += ' '; continue; }
        if (c === '\n') out += '\n';
        i++;
    }
    return out;
}

const src = codeSeul(brut);

// Paires de parenthèses, crochets et accolades.
const paire = new Map();
{
    const pile = [];
    for (let i = 0; i < src.length; i++) {
        const c = src[i];
        if ('([{'.includes(c)) pile.push(i);
        else if (')]}'.includes(c)) { const o = pile.pop(); if (o !== undefined) paire.set(o, i); }
    }
}
const blocs = [...paire.entries()].filter(([o]) => src[o] === '{');
// Le bloc { } le plus intérieur qui contient pos ; à défaut, tout le fichier.
function blocDe(pos) {
    let best = [0, src.length];
    for (const [o, c] of blocs) if (o < pos && pos < c && c - o < best[1] - best[0]) best = [o, c];
    return best;
}
const suivant = (pos) => { while (pos < src.length && /\s/.test(src[pos])) pos++; return pos; };

// Fin d'une expression commencée en pos : première virgule ou point-virgule au niveau 0, ou
// fermeture de la parenthèse englobante.
function finExpression(pos) {
    let p = 0;
    for (let i = pos; i < src.length; i++) {
        const c = src[i];
        if ('([{'.includes(c)) { i = paire.get(i) ?? i; continue; }
        if (')]}'.includes(c) || ((c === ',' || c === ';') && p === 0)) return i;
    }
    return src.length;
}

const decls = [];                 // { nom, debut, fin }
const sitesDecl = new Set();      // positions des noms déclarés : ce ne sont pas des usages
const IDENT = /[A-Za-z_$][\w$]*/g;

function declarerMotif(debut, fin, portee) {
    // Un nom seul, ou un motif { a, b: c, d = 1 } / [a, b] : on garde les noms liés.
    const txt = src.slice(debut, fin);
    let m;
    const re = new RegExp(IDENT.source, 'g');
    while ((m = re.exec(txt))) {
        const pos = debut + m.index;
        const apres = src.slice(pos + m[0].length).match(/^\s*(.)/);
        if (apres && apres[1] === ':' ) { sitesDecl.add(pos); continue; }   // clé renommée : c'est l'alias qui est lié
        // Valeur par défaut : on saute l'expression.
        if (apres && apres[1] === '=' && src[suivant(pos + m[0].length) + 1] !== '=') {
            decls.push({ nom: m[0], debut: portee[0], fin: portee[1] }); sitesDecl.add(pos);
            const fe = finExpression(suivant(pos + m[0].length) + 1);
            re.lastIndex = Math.max(re.lastIndex, fe - debut);
            continue;
        }
        decls.push({ nom: m[0], debut: portee[0], fin: portee[1] });
        sitesDecl.add(pos);
    }
}

// Liste de paramètres entre les parenthèses o..c, visibles dans portee.
const declarerParams = (o, c, portee) => declarerMotif(o + 1, c, portee);

// Corps d'une fonction dont la liste de paramètres se ferme en c : bloc { } ou expression.
function corpsApres(c, fleche) {
    let p = suivant(c + 1);
    if (fleche) p = suivant(p + 2);          // saute « => »
    if (src[p] === '{') return [p, paire.get(p)];
    return [p, finExpression(p)];
}

let m;
// function nom(…) { … }, function (…) { … } et les générateurs function* (…) { … }
const reFn = /\bfunction\b\s*\*?\s*([A-Za-z_$][\w$]*)?\s*\(/g;
while ((m = reFn.exec(src))) {
    const o = m.index + m[0].length - 1, c = paire.get(o);
    const corps = corpsApres(c, false);
    if (m[1]) {
        const pos = m.index + m[0].indexOf(m[1], 8);
        const b = blocDe(m.index);
        decls.push({ nom: m[1], debut: b[0], fin: b[1] }); sitesDecl.add(pos);
    }
    declarerParams(o, c, corps);
}
// (…) => et nom =>
for (const [o, c] of paire) {
    if (src[o] !== '(') continue;
    if (!/^\s*=>/.test(src.slice(c + 1, c + 6))) continue;
    // Pas une liste d'arguments d'appel : « f(a) => » n'existe pas en JS, mais « if (x) => » non plus.
    declarerParams(o, c, corpsApres(c, true));
}
const reFlecheSimple = /(?<![\w$.])([A-Za-z_$][\w$]*)\s*=>/g;
while ((m = reFlecheSimple.exec(src))) {
    const fin = m.index + m[0].length;
    let p = suivant(fin);
    const corps = src[p] === '{' ? [p, paire.get(p)] : [p, finExpression(p)];
    decls.push({ nom: m[1], debut: corps[0], fin: corps[1] }); sitesDecl.add(m.index);
}
// catch (e) { … }
const reCatch = /\bcatch\s*\(/g;
while ((m = reCatch.exec(src))) {
    const o = m.index + m[0].length - 1, c = paire.get(o);
    const p = suivant(c + 1);
    declarerParams(o, c, [p, paire.get(p)]);
}
// const / let / var, avec plusieurs déclarateurs et les motifs { } [ ]
const reVar = /\b(const|let|var)\s+/g;
while ((m = reVar.exec(src))) {
    const portee = blocDe(m.index);
    let p = m.index + m[0].length;
    while (p < src.length) {
        p = suivant(p);
        let fin;
        if (src[p] === '{' || src[p] === '[') fin = paire.get(p) + 1;
        else { const n = src.slice(p).match(/^[A-Za-z_$][\w$]*/); if (!n) break; fin = p + n[0].length; }
        declarerMotif(p, fin, portee);
        p = suivant(fin);
        if (src[p] === '=' ) p = finExpression(p + 1);
        else if (/^(of|in)\b/.test(src.slice(p))) break;
        if (src[p] !== ',') break;
        p++;
    }
}

const MOTS = new Set(('if else for while do return function const let var new typeof instanceof in of try catch finally ' +
    'throw break continue switch case default async await delete void class extends super import export true false null ' +
    'this undefined yield').split(' '));
const GLOBAUX = new Set(('window document navigator console localStorage setTimeout clearTimeout setInterval clearInterval ' +
    'requestAnimationFrame Math JSON Object Array Number String Boolean Map Set WeakMap Promise Intl MutationObserver ' +
    'Infinity NaN Date Error RegExp isNaN parseInt parseFloat encodeURIComponent decodeURIComponent atob btoa ' +
    'GM_info GM_xmlhttpRequest GM_getValue GM_setValue crypto TextEncoder TextDecoder Uint8Array unsafeWindow arguments fetch location URL URLSearchParams Blob MessageChannel indexedDB Audio Event CustomEvent getComputedStyle performance globalThis').split(' '));

const absents = new Map();        // nom -> première ligne
const ligneDe = (() => {
    // Les positions de src ne sont pas celles du fichier : on retrouve la ligne en comptant les
    // sauts de ligne, que codeSeul conserve hors chaînes et commentaires multilignes.
    return pos => src.slice(0, pos).split('\n').length;
})();
const reUsage = /(?<![\w$])[A-Za-z_$][\w$]*/g;
while ((m = reUsage.exec(src))) {
    const nom = m[0], pos = m.index;
    if (MOTS.has(nom) || GLOBAUX.has(nom) || sitesDecl.has(pos)) continue;
    const avant = src.slice(0, pos).match(/(\S)\s*$/);
    // Propriété : x.nom, x?.nom — mais PAS l'étalement ...nom, qui est une valeur : le prendre pour une
    // propriété laissait passer [...fonctionDisparue(x)] (vu le 26/09 en mutant WBC).
    if (avant && avant[1] === '.' && src.slice(pos - 3, pos) !== '...') continue;
    const apres = src.slice(pos + nom.length).match(/^\s*(\S)/);
    if (apres && apres[1] === ':' && avant && '{,'.includes(avant[1])) continue;   // clé d'objet
    const ok = decls.some(d => d.nom === nom && d.debut <= pos && pos <= d.fin);
    if (!ok && !absents.has(nom)) absents.set(nom, ligneDe(pos));
}
if (absents.size) {
    console.error('UTILISÉS HORS DE TOUTE DÉCLARATION VISIBLE : ' + [...absents].map(([n, l]) => n + ' (~l. ' + l + ')').join(', '));
    process.exit(1);
}
console.log('OK — ' + decls.length + ' déclarations, chaque nom utilisé est déclaré à portée');
