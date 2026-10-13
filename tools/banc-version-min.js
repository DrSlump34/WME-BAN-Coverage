// Banc de la version minimale et de l'intégrité (0.14.03) : le bloc _vm… est extrait du fichier LIVRÉ et
// exécuté avec un gestionnaire de scripts simulé (réponse de version-min.json, SDK, session Discuss, page).
// On vérifie aussi que init() s'arrête sur le verdict AVANT tout le reste, que l'enveloppe est nommée, et
// que version-min.json porte l'empreinte du fichier pour sa version.
// Des témoins (le fichier volontairement abîmé : bloc retiré, appel retiré, comparaison inversée…) doivent
// faire échouer le banc.
// Aucun pseudo n'est écrit ici : celui du mainteneur est lu dans la ligne @author de l'en-tête.
// Usage : node tools/banc-version-min.js
'use strict';
const fs = require('fs');
const path = require('path');
const { webcrypto } = require('crypto');
const { empreinteDe, texteEnveloppe, versionDe, ecartsVersionMin } = require('./empreinte.js');

const racine = path.join(__dirname, '..');
const BRUT = fs.readFileSync(path.join(racine, 'WME-BAN-Coverage.user.js'), 'utf8');
const VM = (() => { try { return JSON.parse(fs.readFileSync(path.join(racine, 'version-min.json'), 'utf8')); } catch (e) { return null; } })();
const DEBUT = '    // ─── VERSION MINIMALE ET INTÉGRITÉ';
const INIT = '    const init = async () => {\n';
const URL_VM = 'https://raw.githubusercontent.com/DrSlump34/WME-BAN-Coverage/master/version-min.json';
// Nom de l'attribut posé sur <html> : « data-vm- » + FNV-1a 32 bits de l'URL, en base 36 (recalculé ici).
const ATTR = 'data-vm-' + (s => { let x = 0x811c9dc5; for (let i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 0x01000193) >>> 0; } return x >>> 0; })(URL_VM).toString(36);
const attendre = ms => new Promise(r => setTimeout(r, ms));

// Une page minimale : documentElement (attributs), body (bandeau), getElementById.
function page() {
    const poses = [], attrs = {};
    const el = tag => ({ tag, style: {}, children: [], attrs: {}, setAttribute(k, v) { this.attrs[k] = v; },
        appendChild(c) { this.children.push(c); return c; }, remove() { const i = poses.indexOf(this); if (i >= 0) poses.splice(i, 1); } });
    const body = el('body');
    body.appendChild = c => { poses.push(c); return c; };
    return {
        poses, attrs,
        document: { body, documentElement: { setAttribute: (k, v) => { attrs[k] = v; } },
            createElement: el, getElementById: id => poses.find(p => p.id === id) || null },
    };
}

// Exécute le bloc extrait de `texte` dans un environnement simulé ; rend { verdict, bloque, page, requetes }.
async function executer(texte, o) {
    const i = texte.indexOf(DEBUT), j = texte.indexOf(INIT);
    if (i < 0 || j < 0 || j < i) throw new Error('bloc de version minimale introuvable avant init()');
    const bloc = texte.slice(i, j);
    const pg = page(), requetes = [];
    const sdk = {
        State: { getUserInfo: async () => {
            o.appelsSdk = (o.appelsSdk || 0) + 1;
            return o.pseudoApres !== undefined && o.appelsSdk <= o.pseudoApres ? { userName: '' } : { userName: o.pseudo };
        } },
    };
    const uw = {
        getWmeSdk: o.sansSdk ? undefined : () => sdk,
        fetch: async () => ({ ok: true, json: async () => ({ current_user: o.discuss ? { username: o.discuss } : null }) }),
    };
    const env = {
        SCRIPT_NAME: 'WME BAN Coverage',
        VERSION: o.version,
        _wmeIntegre: { toString: () => o.source },
        GM_xmlhttpRequest: req => {
            requetes.push(req.url);
            if (o.reseau === 'muet') return;                   // le gestionnaire ne rappelle jamais
            if (o.reseau === 'erreur') { req.onerror(); return; }
            setTimeout(() => req.onload({ status: o.statut || 200, responseText: o.reponse }), 1);
        },
        unsafeWindow: uw, window: uw,
        document: pg.document,
        console: { info() { }, log() { } },
        crypto: webcrypto, TextEncoder, Uint8Array,
        // Les attentes du script (7 s de secours, 500 ms par essai du pseudo) passent cent fois plus vite.
        setTimeout: (f, ms) => setTimeout(f, Math.max(1, Math.round((ms || 0) / 100))),
        detectLang: () => o.langue || 'fr',
        location: { pathname: '/fr/editor' }, navigator: { language: 'fr' },
    };
    const noms = Object.keys(env);
    const f = new Function(...noms, bloc + '\nreturn { _vmVerdict, _vmBloque };');
    const api = f(...noms.map(k => env[k]));
    const course = (p, ms) => Promise.race([p, attendre(ms).then(() => 'pendu')]);
    const verdict = await course(api._vmVerdict(), 1500);
    const bloque = await course(api._vmBloque(), 1500);
    return { verdict, bloque, page: pg, requetes };
}

// Tous les cas, sur un texte donné ; rend la liste des fautes (vide = conforme).
// comparerFichier : confronter aussi le texte à version-min.json. Les témoins qui abîment le code s'en passent
// (toute mutation change l'empreinte : la comparaison les verrait tous sans rien prouver du mécanisme).
async function verifierTexte(texte, comparerFichier = true) {
    const fautes = [];
    const faute = m => fautes.push(m);
    let source, h;
    try { source = texteEnveloppe(texte); h = empreinteDe(texte); } catch (e) { faute('enveloppe : ' + e.message); source = 'x'; h = '0'; }
    const v = versionDe(texte);
    const mainteneur = ((texte.match(/^\/\/ @author\s+(\S+)/m) || [])[1] || '');
    const json = (min, empreintes) => JSON.stringify({ min, empreintes });
    const publie = { [v]: h };
    const CAS = [
        { nom: 'version publiée intacte ⇒ démarre', o: { version: v, source, reponse: json(v, publie), pseudo: 'quelquun' }, motif: null },
        { nom: 'version retirée (min supérieur) ⇒ bloquée', o: { version: v, source, reponse: json('99.0.0', publie), pseudo: 'quelquun' }, motif: 'retiree' },
        { nom: 'version retirée, même pour le mainteneur', o: { version: v, source, reponse: json('99.0.0', publie), pseudo: mainteneur }, motif: 'retiree' },
        { nom: 'min comparé en nombres (0.9.00 < 0.14.03)', o: { version: '0.14.03', source, reponse: json('0.9.00', { '0.14.03': h }), pseudo: 'quelquun' }, motif: null },
        { nom: 'copie modifiée ⇒ bloquée', o: { version: v, source: source + ' ', reponse: json(v, publie), pseudo: 'quelquun' }, motif: 'modifiee' },
        { nom: 'copie aux fins de ligne CRLF ⇒ même empreinte', o: { version: v, source: source.replace(/\n/g, '\r\n'), reponse: json(v, publie), pseudo: 'quelquun' }, motif: null },
        { nom: 'version non publiée, éditeur quelconque ⇒ bloquée', o: { version: '9.99.99', source, reponse: json(v, publie), pseudo: 'quelquun', discuss: 'quelquun' }, motif: 'inconnue' },
        { nom: 'version non publiée, le mainteneur ⇒ démarre', o: { version: '9.99.99', source, reponse: json(v, publie), pseudo: mainteneur }, motif: null },
        { nom: 'version non publiée, mainteneur à la casse près ⇒ démarre', o: { version: '9.99.99', source, reponse: json(v, publie), pseudo: mainteneur.toUpperCase() }, motif: null },
        { nom: 'le mainteneur, pseudo vide aux 4 premiers essais (profil pas chargé) ⇒ démarre', o: { version: '9.99.99', source, reponse: json(v, publie), pseudo: mainteneur, pseudoApres: 4 }, motif: null },
        { nom: 'le mainteneur, SDK indisponible, session Discuss ⇒ démarre', o: { version: '9.99.99', source, reponse: json(v, publie), sansSdk: true, discuss: mainteneur }, motif: null },
        { nom: 'version-min.json injoignable ⇒ démarre', o: { version: v, source, reseau: 'erreur' }, motif: null },
        { nom: 'gestionnaire qui ne rappelle jamais ⇒ démarre (secours 7 s)', o: { version: v, source, reseau: 'muet' }, motif: null },
        { nom: 'version-min.json illisible ⇒ démarre', o: { version: v, source, reponse: '<html>pas du JSON' }, motif: null },
        { nom: 'version-min.json en 404 ⇒ démarre', o: { version: v, source, reponse: '{"min":"99.0.0"}', statut: 404 }, motif: null },
        // Comme WJN : une version non numérique n'est jamais « retirée » ; absente des empreintes, elle suit la
        // règle des versions non publiées (le mainteneur seul).
        { nom: 'version non numérique jamais déclarée retirée (mainteneur)', o: { version: 'dev', source, reponse: json('99.0.0', publie), pseudo: mainteneur }, motif: null },
        { nom: 'version non numérique, éditeur quelconque ⇒ non publiée, pas retirée', o: { version: 'dev', source, reponse: json('99.0.0', publie), pseudo: 'quelquun', discuss: 'quelquun' }, motif: 'inconnue' },
        { nom: 'version non numérique, fichier sans empreintes ⇒ démarre', o: { version: 'dev', source, reponse: JSON.stringify({ min: '99.0.0' }), pseudo: 'quelquun' }, motif: null },
        { nom: 'fichier sans liste d\'empreintes ⇒ seul min compte', o: { version: v, source, reponse: JSON.stringify({ min: v }), pseudo: 'quelquun' }, motif: null },
    ];
    for (const c of CAS) {
        let r;
        try { r = await executer(texte, c.o); } catch (e) { faute(c.nom + ' : ' + e.message); continue; }
        const motif = r.verdict === 'pendu' ? 'pendu' : (r.verdict && r.verdict.motif) || null;
        if (motif !== c.motif) { faute(c.nom + ' : verdict ' + motif + ', attendu ' + c.motif); continue; }
        if (r.bloque !== !!c.motif) faute(c.nom + ' : _vmBloque rend ' + r.bloque);
        if (!!c.motif !== (r.page.poses.length === 1)) faute(c.nom + ' : ' + r.page.poses.length + ' bandeau(x) posé(s)');
        if (!r.requetes.length || !r.requetes[0].startsWith(URL_VM + '?t=')) faute(c.nom + ' : version-min.json non lu à ' + URL_VM + ' (' + r.requetes[0] + ')');
        {
            // L'attribut porte l'empreinte du code CHARGÉ (ici la source simulée), ramenée en LF.
            const hs = require('crypto').createHash('sha256').update(c.o.source.replace(/\r\n/g, '\n'), 'utf8').digest('hex');
            const cle = Object.keys(r.page.attrs).find(k => k.startsWith('data-vm-'));
            if (cle !== ATTR ||r.page.attrs[cle] !== hs) faute(c.nom + ' : attribut data-vm-… absent ou faux (' + cle + '=' + (cle && r.page.attrs[cle]) + ')');
        }
        if (c.motif && r.page.poses[0]) {
            const b = r.page.poses[0], lien = b.children.find(x => x.tag === 'a');
            if (!lien || lien.href !== 'https://greasyfork.org/scripts/600088') faute(c.nom + ' : lien du bandeau ' + (lien && lien.href));
            const txt = (b.children[0] && b.children[0].textContent) || '';
            if (!txt.includes('WME BAN Coverage')) faute(c.nom + ' : texte du bandeau vide');
        }
    }
    // Le bandeau dans les 8 langues du script (mêmes clés que DICO), hébreu de droite à gauche.
    for (const l of ['en', 'fr', 'de', 'es', 'it', 'pt-BR', 'pt-PT', 'he']) {
        let r;
        try { r = await executer(texte, { version: v, source, reponse: json('99.0.0', publie), langue: l }); } catch (e) { faute('langue ' + l + ' : ' + e.message); continue; }
        const b = r.page.poses[0];
        const txt = b && b.children[0] && b.children[0].textContent;
        if (!txt || !txt.includes('v99.0.0')) { faute('langue ' + l + ' : texte « retirée » absent'); continue; }
        if (l !== 'en' && /has been withdrawn/.test(txt)) faute('langue ' + l + ' : repli sur l\'anglais');
        if ((b.dir === 'rtl') !== (l === 'he')) faute('langue ' + l + ' : dir=' + b.dir);
    }
    // init() s'arrête sur le verdict avant toute autre chose.
    const k = texte.indexOf(INIT);
    if (k < 0 || !texte.slice(k + INIT.length).startsWith('        if (await _vmBloque()) return;')) faute('init() ne commence pas par « if (await _vmBloque()) return; »');
    if (!/^\/\/ @connect\s+raw\.githubusercontent\.com\s*$/m.test(texte)) faute('@connect raw.githubusercontent.com absent');
    // version-min.json du dépôt : cohérent avec le fichier.
    if (comparerFichier) {
        for (const e of ecartsVersionMin(texte, VM)) faute('version-min.json : ' + e);
        if (!VM || typeof VM._lisezmoi !== 'string' || !VM._lisezmoi.includes('_wmeIntegre')) faute('version-min.json : _lisezmoi absent');
    }
    return fautes;
}

(async () => {
    let echecs = 0;
    const fautes = await verifierTexte(BRUT);
    for (const f of fautes) { echecs++; console.log('ÉCHEC — ' + f); }
    const TEMOINS = [
        ['bloc de version minimale retiré', t => t.slice(0, t.indexOf(DEBUT)) + t.slice(t.indexOf(INIT)).replace('        if (await _vmBloque()) return;   // version retirée, copie modifiée ou non publiée : bandeau, rien d’autre\n', '')],
        ['appel retiré de init()', t => t.replace('        if (await _vmBloque()) return;   // version retirée, copie modifiée ou non publiée : bandeau, rien d’autre\n', '')],
        ['appel déplacé après le verrou anti-double-chargement', t => t.replace('        if (await _vmBloque()) return;   // version retirée, copie modifiée ou non publiée : bandeau, rien d’autre\n        if (pw.__WBC_LOADED) return;\n', '        if (pw.__WBC_LOADED) return;\n        if (await _vmBloque()) return;\n')],
        ['enveloppe anonyme', t => t.replace('(function _wmeIntegre() {', '(function () {')],
        ['comparaison de version inversée', t => t.replace('_vmCmp(v, j.min) < 0) return { motif: \'retiree\'', '_vmCmp(v, j.min) > 0) return { motif: \'retiree\'')],
        ['empreinte non comparée', t => t.replace('return h === String(attendue).toLowerCase() ? null : { motif: \'modifiee\' };', 'return null;')],
        ['version non publiée acceptée pour tous', t => t.replace('if (!attendue) return (await _vmAuteur()) ? null : { motif: \'inconnue\' };', 'if (!attendue) return null;')],
        ['pseudo non attendu (ancienne _vmAuteur)', t => t.replace('for (let i = 0; i < 20; i++) {', 'for (let i = 0; i < 1; i++) {')],
        ['minuteur de secours retiré', t => t.replace('        setTimeout(() => res(null), 7000);   // gestionnaire de scripts qui ne rappelle jamais : on démarre\n', '')],
        ['fichier injoignable ⇒ bloqué', t => t.replace('if (!j || typeof j !== \'object\') return null;', 'if (!j || typeof j !== \'object\') return { motif: \'inconnue\' };')],
        ['attribut data-vm retiré', t => t.replace("document.documentElement.setAttribute('data-vm-' + _vmHx(_VM_URL).toString(36), h || 'sans-source');", '')],
        ['fins de ligne non normalisées', t => t.replace("String(src).replace(/\\r\\n/g, '\\n')", 'String(src)')],
        ['bandeau sans pt-BR', t => t.replace("            'pt-BR': { retiree:", "            'pt-XX': { retiree:")],
        ['code modifié après le calcul de l\'empreinte (seul témoin confronté à version-min.json)', t => t.replace("    const LAYER = 'wbc-adresses';", "    const LAYER = 'wbc-adresses2';")],
    ];
    let vus = 0;
    for (const [nom, muter] of TEMOINS) {
        const m = muter(BRUT);
        if (m === BRUT) { console.log('TÉMOIN INOPÉRANT (rien remplacé) — ' + nom); echecs++; continue; }
        const f = await verifierTexte(m, nom.includes('version-min.json'));
        if (f.length) { vus++; console.log('  témoin « ' + nom + ' » : ' + f.length + ' faute(s) (' + f[0] + ')'); }
        else { echecs++; console.log('TÉMOIN NON VU — ' + nom); }
    }
    if (echecs) { console.log('\n' + echecs + ' échec(s)'); process.exit(1); }
    console.log('\nOK — contrôle de version : ' + vus + ' témoins vus échouer');
})();
