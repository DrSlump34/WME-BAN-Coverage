// Banc du cœur de calcul, tiré du FICHIER LIVRÉ (entre // ==WBC-CORE== et // ==/WBC-CORE==) :
// aucune constante recopiée. Chaque règle du rapprochement a son cas, puis chaque TÉMOIN — une
// mutation du code — doit faire échouer au moins un cas : un banc qui reste vert sur un code
// cassé ne prouve rien.
// Usage : node tools/banc-coeur.js [fichier]
const fs = require('fs');
const path = require('path');
const f = process.argv[2] || path.join(__dirname, '..', 'WME-BAN-Coverage.user.js');
const brut = fs.readFileSync(f, 'utf8');
const debut = brut.indexOf('// ==WBC-CORE=='), fin = brut.indexOf('// ==/WBC-CORE==');
if (debut < 0 || fin < 0) { console.error('bornes ==WBC-CORE== introuvables'); process.exit(1); }
const SOURCE = brut.slice(debut, fin);
const charger = src => new Function(src + '\nreturn Core;')();

// ---- Données : un point de départ, des décalages en mètres ------------------------------------
const LON0 = 4.7, LAT0 = 44.12;
const KX = 111320 * Math.cos(LAT0 * Math.PI / 180), KY = 110540;
const P = (dx, dy) => [LON0 + dx / KX, LAT0 + dy / KY];
const seg = (id, rue, pts) => ({ id, primaryStreetID: rue, streetIDs: [], geometry: { type: 'LineString', coordinates: pts.map(p => P(...p)) } });
const hn = (segID, number, dx, dy) => ({ id: segID + '/' + number, segID, number, geometry: { type: 'Point', coordinates: P(dx, dy) } });
const rpp = (id, streetID, houseNumber, dx, dy) => ({ id, streetID, houseNumber, residential: true, geometry: { type: 'Point', coordinates: P(dx, dy) } });
const adr = (Core, voie, num, suf, dx, dy) => { const [lon, lat] = P(dx, dy); return { voie, deleguee: '', brut: num + (suf ? ' ' + suf : ''), num: Core.normNum(num, suf), lon, lat, cert: true }; };

// Un village : une rue nommée d'est en ouest (y = 0), une rue SANS NOM au nord (y = 200),
// une rue « des Herbes » dans WME que la BAN appelle « des Herses » (y = 400), et deux rues
// parallèles à 40 m l'une de l'autre (y = 600 et y = 640 : « Herbé » et « Bourgneuf »).
function village(Core) {
    const streets = [{ id: 1, name: 'Grand’Rue' }, { id: 2, name: '' }, { id: 3, name: 'Rue des Herbes' }, { id: 4, name: 'Rue Herbé' }, { id: 5, name: 'Rue Bourgneuf' },
        { id: 6, name: "Place de l'Eglise" }, { id: 7, name: 'Rue du Four' }];
    const segments = [
        seg(10, 1, [[0, 0], [500, 0]]),
        seg(20, 2, [[0, 200], [500, 200]]),
        seg(30, 3, [[0, 400], [500, 400]]),
        seg(40, 4, [[0, 600], [100, 600]]),
        seg(50, 5, [[0, 640], [100, 640]]),
        seg(60, 6, [[0, 800], [100, 800]]),
        seg(70, 7, [[0, 830], [100, 830]]),
    ];
    const hns = [
        hn(10, '1', 10, 5), hn(10, '3', 50, 5), hn(10, '5bis', 90, 5), hn(10, '7 QUATER', 130, 5),
        hn(10, '12bis', 170, 5),                       // la BAN a « 12 b » : une lettre n'est pas « bis »
        hn(10, '99', 300, 5),                          // absent de la BAN : en trop
        hn(10, '9', 450, 5),                           // BAN « 9 » à 240 m : trop loin, c'est une autre adresse
        hn(20, '2', 20, 205), hn(20, '4', 60, 205),    // rue sans nom : rattachée par la géométrie
        hn(30, '1', 20, 405),                          // « des Herbes » porte le 1 des « Herses »
        hn(50, '1', 30, 628),                          // posé sur Bourgneuf, mais à 13 m du « Herbé 1 »
        hn(10, '1', 5000, 5000),                       // hors de la commune
    ];
    const rpps = [rpp(900, 1, '3', 52, 8)];            // double le HN 3 : un doublon, pas « en trop »
    const adresses = [
        adr(Core, 'Grand\'Rue', '1', '', 10, 12), adr(Core, 'Grand\'Rue', '3', '', 50, 12), adr(Core, 'Grand\'Rue', '5', 'bis', 90, 12),
        adr(Core, 'Grand\'Rue', '7', 'qua', 130, 12), adr(Core, 'Grand\'Rue', '12', 'b', 170, 12), adr(Core, 'Grand\'Rue', '9', '', 210, 12),
        // à 40 m de la rue sans nom et à 35 m de ses numéros : ni le nom ni la proximité (30 m) ne
        // les rattachent, seule la règle 2 le peut.
        adr(Core, 'Chemin du Lac', '2', '', 20, 240), adr(Core, 'Chemin du Lac', '4', '', 60, 240), adr(Core, 'Chemin du Lac', '6', '', 100, 240),
        adr(Core, 'Rue des Herses', '1', '', 20, 415),
        adr(Core, 'Rue Herbé', '1', '', 30, 615),      // le HN « 1 » de Bourgneuf est à 13 m d'ici…
        adr(Core, 'Rue Bourgneuf', '1', '', 30, 666),  // …et à 38 m d'ici : la règle du NOM doit l'emporter
        adr(Core, 'Place de l’Église', '2', '', 50, 822), // à 8 m de la rue du Four, à 22 m de la place
    ];
    const [w, s] = P(-1000, -1000), [e, n] = P(1500, 1500);
    const contour = { type: 'Polygon', coordinates: [[[w, s], [e, s], [e, n], [w, n], [w, s]]] };
    return { adresses, segments, streets, hns, rpps, contour };
}

function cas(Core) {
    const r = [];
    const ok = (nom, cond, detail) => r.push({ nom, ok: !!cond, detail });
    const N = Core.normNum, M = Core.normNom;
    ok('normNum 12 + bis', N('12', 'bis') === '12bis');
    ok('normNum « 12 BIS »', N('12 BIS') === '12bis');
    ok('normNum « 12-b » reste une lettre', N('12-b') === '12b' && N('12-b') !== N('12', 'bis'));
    ok('normNum qua = quater', N('4', 'qua') === N('4 quater') && N('4 QUATER') === '4qua');
    ok('normNum zéros de tête', N('007') === '7');
    ok('normNom abréviations', M('Av. Maréchal Foch') === M('Avenue Marechal Foch'));
    ok('normNom apostrophe et accents', M('Rue de l’Église') === M("Rue de l'Eglise"));
    ok('normNom St-Jean', M('Rue St-Jean') === M('Rue Saint Jean'));

    // Fichier BAN : CRLF, guillemets, doublon de clé, 99999, colonnes lues par leur nom.
    const csv = 'uid_adresse;cle_interop;commune_insee;voie_nom;numero;suffixe;long;lat;certification_commune\r\n' +
        '"@a:1";x_1;30084;Rue A;1;;4.7;44.1;1\r\n"@a:2";x_2;30084;"Rue ""B""";2;bis;4.7;44.1;0\r\n' +
        '"@a:2";x_2;30084;Rue B;2;bis;4.71;44.1;0\r\n"@a:3";x_3;30084;Lieu-dit;99999;;4.7;44.1;1\r\n';
    const b = Core.lireBan(csv);
    ok('lireBan : 2 adresses (doublon de clé et 99999 écartés)', b.adresses.length === 2, b.adresses.length);
    ok('lireBan : certification lue malgré CRLF', b.adresses[0].cert === true && b.adresses[1].cert === false);
    ok('lireBan : guillemets doublés', b.adresses[1].voie === 'Rue "B"');
    ok('lireBan : numéro + suffixe', b.adresses[1].num === '2bis');

    // Numéros de RÉSERVE (29/09/2026, BAN entière) : un 9990-9999 seul sur sa voie est écarté ;
    // une numérotation métrique qui passe par là (Arles : 9098 → 10288) est gardée, comme une série
    // à rebours (9981 → 9999, gardée par prudence) ; 9989 et 10000 ne sont pas des réserves.
    const R9 = (id, voie, num) => '"@a:r' + id + '";r_' + id + ';30084;' + voie + ';' + num + ';;4.7' + id + ';44.1;0\r\n';
    const csv9 = 'uid_adresse;cle_interop;commune_insee;voie_nom;numero;suffixe;long;lat;certification_commune\r\n' +
        R9(1, 'Rue Arago', 9999) + R9(2, 'Rue Arago', 9998) + R9(3, 'Rue Arago', 12) +       // réserve seule : 2 écartés
        R9(4, 'Route de Crau', 9098) + R9(5, 'Route de Crau', 9995) + R9(6, 'Route de Crau', 10288) + // métrique : gardés
        R9(7, 'Lotissement', 9985) + R9(8, 'Lotissement', 9999) +                          // série à rebours : gardés
        R9(9, 'Chemin', 9989) + R9(10, 'Chemin bis', 10000) +                               // hors plage : gardés
        R9(11, 'Route longue', 9996) + R9(12, 'Route longue', 10050);                       // seul voisin au-delà de 10 000 : gardé
    const b9 = Core.lireBan(csv9);
    const n9 = (voie, num) => b9.adresses.some(x => x.voie === voie && x.brut === String(num));
    ok('réserve : 9999 et 9998 seuls sur leur voie écartés, comptés à part', !n9('Rue Arago', 9999) && !n9('Rue Arago', 9998) && n9('Rue Arago', 12) && b9.reserve === 2, b9.reserve);
    ok('réserve : numérotation métrique gardée (9995 entre 9098 et 10288)', n9('Route de Crau', 9995) && n9('Route de Crau', 10288));
    ok('réserve : série à rebours gardée (9999 avec 9985)', n9('Lotissement', 9999) && n9('Lotissement', 9985));
    ok('réserve : 9989 et 10000 ne sont pas des réserves', n9('Chemin', 9989) && n9('Chemin bis', 10000));
    ok('réserve : voisin au-delà de 10 000 seulement = métrique gardée', n9('Route longue', 9996));
    ok('réserve : 10 adresses gardées sur 12', b9.adresses.length === 10, b9.adresses.length);

    // Commune NOUVELLE : la même cle_interop revient pour deux communes déléguées à 5 km l'une de
    // l'autre (Cherbourg-en-Cotentin, audit du 26/09) — ce sont deux adresses. Et un doublon interne à
    // la BAN (même clé, deux identifiants @a à 20 m) n'en est qu'une.
    const L = (a, cle, lon) => '" @a:' + a + ' @v:v @c:c";' + cle + ';50129;Rue Jules Ferry;44;;' + lon + ';49.6;1\r\n';
    const csv2 = 'uid_adresse;cle_interop;commune_insee;voie_nom;numero;suffixe;long;lat;certification_commune\r\n' +
        L('a1', '50129_1_00044', '-1.60') + L('a2', '50129_1_00044', '-1.53') +      // 5 km : deux adresses
        L('a3', '50129_2_00035', '-1.70') + L('a4', '50129_2_00035', '-1.70028') +  // 20 m : une seule
        L('a5', '50129_3_00001', '-1.80') + L('a5', '50129_3_00001', '-1.8004');     // une adresse, deux positions
    const b2 = Core.lireBan(csv2);
    ok('lireBan : même clé à 5 km (commune nouvelle) = 2 adresses, à 20 m = 1, deux positions = 1', b2.adresses.length === 4, b2.adresses.length);
    const cher = path.join(__dirname, '..', 'bancs', 'ban-50129.csv.gz');
    if (fs.existsSync(cher)) {
        const n = Core.lireBan(require('zlib').gunzipSync(fs.readFileSync(cher)).toString('utf8')).adresses.length;
        // Étalon : le compte de l'arbitre de l'audit (script indépendant, fusion à 150 m) = 28 236.
        ok('BAN Cherbourg-en-Cotentin : 28 236 adresses (27 858 avant l\'audit)', n === 28236, n);
    } else ok('BAN Cherbourg présente dans bancs/', false, cher);

    // Une vraie commune (Codolet, BAN du 26/09/2026) : le fichier se lit en entier.
    const fic = path.join(__dirname, '..', 'bancs', 'ban-30084.csv');
    if (fs.existsSync(fic)) {
        const c = Core.lireBan(fs.readFileSync(fic, 'utf8'));
        ok('BAN Codolet : 386 adresses, toutes certifiées', c.adresses.length === 386 && c.adresses.every(a => a.cert), c.adresses.length);
    } else ok('BAN Codolet présente dans bancs/', false, fic);

    const R = Core.analyser(village(Core));
    const V = nom => R.voies.find(v => v.nom === nom) || {};
    const a = (voie, brut) => (V(voie).adresses || []).find(x => x.brut === brut) || {};
    ok('règle 1 : même nom (apostrophe typographique côté WME)', a('Grand\'Rue', '1').trouve === 'HN');
    // Une adresse trouvée garde la position du numéro WME retenu (le trait BAN → WME de la carte) et
    // la distance entre les deux : le HN « 1 » est à (10, 5), l'adresse à (10, 12), soit 7 m.
    {
        const a1 = a('Grand\'Rue', '1'), [lw, bw] = P(10, 5);
        ok('adresse trouvée : position du numéro WME et distance gardées', Math.abs(a1.wlon - lw) < 1e-9 && Math.abs(a1.wlat - bw) < 1e-9 && a1.dm === 7, JSON.stringify([a1.wlon, a1.wlat, a1.dm]));
    }
    ok('suffixe bis trouvé', a('Grand\'Rue', '5 bis').trouve === 'HN');
    ok('suffixe qua = QUATER trouvé', a('Grand\'Rue', '7 qua').trouve === 'HN');
    ok('« 12 b » BAN ≠ « 12bis » WME', !a('Grand\'Rue', '12 b').trouve);
    ok('même numéro à 240 m : non trouvé', !a('Grand\'Rue', '9').trouve);
    ok('règle 2 : rue SANS NOM rattachée par la géométrie', a('Chemin du Lac', '2').trouve === 'HN' && a('Chemin du Lac', '4').trouve === 'HN');
    ok('rue sans nom : statut « sansNom »', V('Chemin du Lac').statutNom === 'sansNom', V('Chemin du Lac').statutNom);
    ok('rue sans nom : 6 manquant', (V('Chemin du Lac').manquants || []).join() === '6');
    ok('une lettre d\'écart : « Herses » ↔ « Herbes » = orthographe', V('Rue des Herses').statutNom === 'orthographe' && V('Rue des Herses').nomWme === 'Rue des Herbes', V('Rue des Herses').statutNom);
    // Les écarts de nom relevés à Uzès le 26/09, un par famille.
    const E = (a, b) => Core.ecartNoms(M(a), M(b));
    ok('écart : article (Rue Pélisserie / Rue de la Pelisserie)', E('Rue Pélisserie', 'Rue de la Pelisserie') === 'autreArticle', E('Rue Pélisserie', 'Rue de la Pelisserie'));
    ok('écart : type (Rue / Chemin Olivier de Serres)', E('Rue Olivier de Serres', 'Chemin Olivier de Serres') === 'autreType');
    ok('écart : orthographe (Brugière / Bruguière, Charras / Charas)', E('Rue Henri Brugière', 'Rue Henri Bruguière') === 'orthographe' && E('Avenue Moïse Charras', 'Avenue Moïse Charas') === 'orthographe');
    ok('écart : partiel (Place Bosc / Place Adolphe Bosc, Professeur Gaston Broche)', E('Place Bosc', 'Place Adolphe Bosc') === 'nomPartiel' && E('Rue du Professeur Gaston Broche', 'Rue Gaston Broche') === 'nomPartiel');
    ok('écart : vraiment différent (Saint-Roman / Plan de l\'Oume, Haute / Basse)', E('Rue Saint-Roman', 'Rue du Plan de l\'Oume') === 'different' && E('Rue Haute', 'Rue Basse') === 'different');
    ok('écart : nom tronqué dans WME (Saint-Siffret / Saint-Siff) = partiel', E('Chemin de Saint-Siffret', 'Chemin de Saint-Siff') === 'nomPartiel', E('Chemin de Saint-Siffret', 'Chemin de Saint-Siff'));
    ok('écart : noms courts non rapprochés (Pin / Pic)', E('Rue du Pin', 'Rue du Pic') === 'different');
    ok('nom différent : signalé absent de WME', V('Rue des Herses').nomAbsent === true);
    ok('nom différent : numéro trouvé quand même (règle 2)', a('Rue des Herses', '1').trouve === 'HN');
    ok('le NOM l\'emporte sur la proximité (Bourgneuf 1)', a('Rue Bourgneuf', '1').trouve === 'HN');
    ok('… et Herbé 1 reste manquant', !a('Rue Herbé', '1').trouve);
    ok('adresse plus proche d\'une rue voisine : la voie garde son nom', V('Place de l’Église').statutNom === 'identique', V('Place de l’Église').statutNom + ' / ' + V('Place de l’Église').nomWme);
    ok('RPP qui double un HN : doublon', R.doublons.length === 1 && R.doublons[0].type === 'RPP', JSON.stringify(R.doublons));
    ok('HN absent de la BAN : en trop (hors commune écarté)', R.enTrop.map(x => x.brut).sort().join() === '9,99', R.enTrop.map(x => x.brut).join());
    ok('« 12 b » BAN / « 12bis » WME : suffixe à vérifier', a('Grand\'Rue', '12 b').suffixe === '12bis' && R.totaux.suffixes === 1, a('Grand\'Rue', '12 b').suffixe);
    ok('coeurNom : le type et les articles tombent', Core.coeurNom(M('Chemin de la Justice')) === Core.coeurNom(M('Rue Justice')) && Core.coeurNom(M('Rue du Stade')) === 'stade');

    // Statuts de nom : alternatif, numéro de route, type seul différent.
    {
        const trois = (nomPrincipal, alt, voie) => {
            const streets = [{ id: 1, name: nomPrincipal }].concat(alt ? [{ id: 2, name: alt }] : []);
            return Core.analyser({
                adresses: [adr(Core, voie, '1', '', 20, 10), adr(Core, voie, '3', '', 60, 10)],
                segments: [{ id: 1, primaryStreetID: 1, streetIDs: alt ? [2] : [], geometry: { coordinates: [P(0, 0), P(200, 0)] } }],
                streets, hns: [hn(1, '1', 20, 3)], rpps: [], contour: null,
            }).voies[0];
        };
        const va = trois('D979', 'Route de Saint-Ambroix', 'Route de Saint-Ambroix');
        ok('nom BAN en ALTERNATIF : statut « alternatif », principal D979', va.statutNom === 'alternatif' && va.nomPrincipal === 'D979', va.statutNom + ' / ' + va.nomPrincipal);
        ok('nom BAN en alternatif : numéro trouvé (règle 1)', va.presents === 1);
        const vr = trois('D979', '', 'Route de Saint-Ambroix');
        ok('principal = n° de route, nom BAN absent : « numeroRoute »', vr.statutNom === 'numeroRoute' && vr.nomWme === 'D979', vr.statutNom);
        const vt = trois('Chemin Olivier de Serres', '', 'Rue Olivier de Serres');
        ok('seul le type diffère : « autreType »', vt.statutNom === 'autreType', vt.statutNom);
        const vi = trois('Route de Saint-Ambroix', 'D979', 'Route de Saint-Ambroix');
        ok('nom BAN en principal (n° en alternatif) : « identique »', vi.statutNom === 'identique', vi.statutNom);
    }
    ok('totaux cohérents', R.totaux.ban === 13 && R.totaux.presents + R.totaux.manquants === R.totaux.ban && R.totaux.hn === 8, JSON.stringify(R.totaux));

    // Une longue diagonale de 4 km à 2 sommets (une rocade) et une adresse à 60 m de son milieu :
    // le rangement par cases échantillonnées ne doit pas la perdre.
    {
        const a0 = P(0, 0), a1 = P(2828, 2828);
        const d = {
            adresses: [adr(Core, 'Route de la Rocade', '1', '', 1414 + 42, 1414 - 42)],
            segments: [{ id: 1, primaryStreetID: 1, streetIDs: [], geometry: { coordinates: [a0, a1] } }],
            streets: [{ id: 1, name: 'Route de la Rocade' }], hns: [], rpps: [], contour: null,
        };
        const R2 = Core.analyser(d);
        ok('longue diagonale à 60 m : segment retrouvé', R2.voies[0].statutNom === 'identique', R2.voies[0].statutNom);
        // À 55 m d'un sommet placé en coin de case : le cas où la marge d'échantillonnage compte.
        const d2 = Object.assign({}, d, { adresses: [adr(Core, 'Route de la Rocade', '1', '', 2828 - 30, 2828 + 46)] });
        ok('longue diagonale près d\'un sommet : segment retrouvé', Core.analyser(d2).voies[0].statutNom === 'identique');
    }

    // Audit du 26/09 — M4, M5, M3, règle 3 et vote du nom (M17).
    {
        ok('M5 : suffixe chiffré « 5 3 » ≠ « 53 »', N('5', '3') !== N('53') && N('5', '3') !== N('5'), N('5', '3'));
        const seg2 = [{ id: 1, primaryStreetID: 1, streetIDs: [], geometry: { coordinates: [P(0, 0), P(300, 0)] } },
            { id: 2, primaryStreetID: 2, streetIDs: [], geometry: { coordinates: [P(0, 60), P(300, 60)] } }];
        const st2 = [{ id: 1, name: 'Rue A' }, { id: 2, name: 'Rue B' }];
        // Règle 3 : un numéro posé sur une AUTRE rue à 20 m est trouvé ; à 40 m, non.
        const r3 = Core.analyser({ adresses: [adr(Core, 'Rue A', '7', '', 100, 25), adr(Core, 'Rue A', '9', '', 200, 25)],
            segments: seg2, streets: st2, hns: [hn(2, '7', 100, 45), hn(2, '9', 200, 65)], rpps: [], contour: null });
        const a7 = r3.voies[0].adresses.find(x => x.brut === '7'), a9 = r3.voies[0].adresses.find(x => x.brut === '9');
        ok('règle 3 : même numéro sur une autre rue à 20 m = trouvé, à 40 m = non', a7.trouve === 'HN' && !a9.trouve, a7.trouve + '/' + a9.trouve);
        // M4 : Rue A 5 trouvée par son HN ; un second « 5 » sur Rue B à 20 m (la BAN n'a pas de Rue B 5)
        // est un numéro EN TROP (mauvaise rue), pas un doublon de Rue A 5.
        const m4 = Core.analyser({ adresses: [adr(Core, 'Rue A', '5', '', 150, 25)], segments: seg2, streets: st2,
            hns: [hn(1, '5', 150, 3), hn(2, '5', 150, 45)], rpps: [], contour: null });
        ok('M4 : numéro sur une autre rue à 20 m, l\'adresse déjà trouvée = en trop, pas doublon', m4.enTrop.length === 1 && m4.doublons.length === 0, m4.enTrop.length + '/' + m4.doublons.length);
        // Vote du nom : la voie BAN « Rue C » n'existe pas dans WME ; 3 de ses numéros tombent près de
        // « Rue A », 1 près de « Rue B » ⇒ le nom WME retenu est « Rue A », celui de la majorité.
        const vt = Core.analyser({ adresses: [adr(Core, 'Rue C', '1', '', 50, 10), adr(Core, 'Rue C', '3', '', 100, 10), adr(Core, 'Rue C', '5', '', 150, 10), adr(Core, 'Rue C', '7', '', 150, 55)],
            segments: seg2, streets: st2, hns: [], rpps: [], contour: null });
        ok('vote du nom : la majorité des numéros décide', vt.voies[0].nomWme === 'Rue A', vt.voies[0].nomWme);
        // M3 : « Impasse Bourgneuf » sans segment, numéros près de « Rue Bourgneuf » qui est une AUTRE
        // voie BAN : c'est une voie absente, pas un « autre type ».
        const segB = [{ id: 1, primaryStreetID: 1, streetIDs: [], geometry: { coordinates: [P(0, 0), P(300, 0)] } }];
        const m3 = Core.analyser({ adresses: [adr(Core, 'Impasse Bourgneuf', '1', '', 50, 20), adr(Core, 'Rue Bourgneuf', '2', '', 200, 10)],
            segments: segB, streets: [{ id: 1, name: 'Rue Bourgneuf' }], hns: [], rpps: [], contour: null });
        const vi = m3.voies.find(v => v.nom === 'Impasse Bourgneuf');
        ok('M3 : nom WME = celui d\'une autre voie BAN ⇒ « different » et absente, pas « autreType »', vi.statutNom === 'different' && vi.nomAbsent, vi.statutNom + '/' + vi.nomAbsent);
        // M3 : un segment du même nom HORS de l'emprise de la commune ne compte pas (voisine homonyme).
        const loin = [{ id: 1, primaryStreetID: 1, streetIDs: [], geometry: { coordinates: [P(0, 0), P(300, 0)] } },
            { id: 9, primaryStreetID: 9, streetIDs: [], geometry: { coordinates: [P(4000, 4000), P(4300, 4000)] } }];
        const [cw, cs] = P(-500, -500), [ce, cn] = P(1000, 1000);
        const m3b = Core.analyser({ adresses: [adr(Core, 'Rue du Moulin', '1', '', 50, 10)], segments: loin,
            streets: [{ id: 1, name: 'Rue Haute' }, { id: 9, name: 'Rue du Moulin' }], hns: [], rpps: [], contour: null, emprise: [cw, cs, ce, cn] });
        ok('M3 : homonyme hors de la commune ⇒ la voie reste « absente de WME »', m3b.voies[0].nomAbsent === true, m3b.voies[0].nomAbsent);
    }

    // Filtre « adresses certifiées » (audit du 26/09, B2) : les non certifiées sortent des COMPTES,
    // pas du rapprochement — leur numéro WME n'est pas « en trop », et une commune sans aucune
    // adresse certifiée n'est pas « vide ».
    {
        const ad = [adr(Core, 'Rue Haute', '1', '', 20, 10), adr(Core, 'Rue Haute', '3', '', 60, 10), adr(Core, 'Rue Haute', '5', '', 100, 10)];
        ad[2].cert = false;
        const base = { segments: [{ id: 1, primaryStreetID: 1, streetIDs: [], geometry: { coordinates: [P(0, 0), P(200, 0)] } }], streets: [{ id: 1, name: 'Rue Haute' }],
            hns: [hn(1, '1', 20, 3), hn(1, '3', 60, 3), hn(1, '5', 100, 3)], rpps: [], contour: null };
        const tous = Core.analyser(Object.assign({ adresses: ad }, base));
        const cert = Core.analyser(Object.assign({ adresses: ad, certSeules: true }, base));
        ok('certifiées seules : 2 adresses comptées, 1 écartée', cert.totaux.ban === 2 && cert.totaux.ecartees === 1 && tous.totaux.ban === 3, JSON.stringify(cert.totaux));
        ok('certifiées seules : le HN d\'une adresse non certifiée n\'est PAS en trop', cert.totaux.enTrop === 0 && cert.enTrop.length === 0, cert.totaux.enTrop);
        ok('certifiées seules : la non certifiée n\'est ni manquante ni dans la voie', cert.voies[0].ban === 2 && cert.voies[0].adresses.every(a => a.brut !== '5'));
        const zero = ad.map(a => Object.assign({}, a, { cert: false }));
        const z = Core.analyser(Object.assign({ adresses: zero, certSeules: true }, base));
        ok('commune sans adresse certifiée : 0 comptée, 3 écartées, aucun en trop', z.totaux.ban === 0 && z.totaux.ecartees === 3 && z.totaux.enTrop === 0 && z.voies.length === 0, JSON.stringify(z.totaux));
    }
    // 0.05 : le segment qui devrait porter une adresse manquante, et le point du segment le plus proche.
    // « Chemin du Lac 6 » est en (100, 240) ; la rue sans nom (segment 20) passe à y = 200, soit 40 m.
    {
        const a6 = a('Chemin du Lac', '6'), [lp, bp] = P(100, 200);
        ok('manquant : segment probable = la rue sans nom, à 40 m', a6.seg === 20 && a6.pd === 40, JSON.stringify([a6.seg, a6.pd]));
        ok('manquant : pied sur le segment, en face de l’adresse', Math.abs(a6.plon - lp) < 1e-7 && Math.abs(a6.plat - bp) < 1e-7, JSON.stringify([a6.plon, a6.plat, lp, bp]));
        ok('trouvé : pas de segment probable', a("Grand'Rue", '1').seg === null);
        ok('voie : ses segments rendus', (V('Chemin du Lac').segs || []).includes(20) && (V("Grand'Rue").segs || []).includes(10), JSON.stringify(V('Chemin du Lac').segs));
    }
    // 0.05 : un export relu (le relevé qui sert à suivre l'avancement), commune puis département.
    {
        const FIN = '\r\n';
        const H = 'commune_insee;commune;voie_ban;commune_deleguee;voie_wme;nom_principal_wme;statut_nom;numero;etat;numero_wme_suffixe;certifiee;lon;lat;filtre_certifiees;segment_probable_wme' + FIN;
        const csv = '﻿' + H +
            "30084;Codolet;Grand'Rue;;Grand'Rue;;identique;1;HN;;1;4.7;44.1;0;" + FIN +
            "30084;Codolet;Grand'Rue;;Grand'Rue;;identique;3;RPP;;1;4.7;44.1;0;" + FIN +
            "30084;Codolet;Grand'Rue;;Grand'Rue;;identique;5;manquant;;1;4.7;44.1;0;10" + FIN +
            "30084;Codolet;'=Rue X;;;;aucun;2;suffixe;2bis;1;4.7;44.1;0;" + FIN +
            '30084;Codolet;;;Rue du Four;;;99;en_trop_HN;;;4.7;44.1;0;' + FIN;
        const e = Core.lireExport(csv);
        const g = e && e.voies.get(M("Grand'Rue") + '|');
        ok('export commune relu : code, totaux (HN et RPP trouvés, manquant, suffixe, en trop)', e && e.type === 'commune' && e.code === '30084' &&
            e.totaux.ban === 4 && e.totaux.presents === 2 && e.totaux.manquants === 2 && e.totaux.enTrop === 1, JSON.stringify(e && e.totaux));
        ok('export commune relu : par voie', g && g.ban === 3 && g.presents === 2, JSON.stringify(g));
        ok('export commune relu : voie neutralisée à l’export retrouvée par son nom normé', e && e.voies.has(M('=Rue X') + '|'), e && [...e.voies.keys()].join(' / '));
        const dep = 'commune_insee;commune;adresses_ban;certifiees;dans_wme;hn;rpp;manquantes;dont_suffixe;en_trop;doublons;couverture;filtre_certifiees;non_certifiees_ecartees' + FIN +
            '30084;Codolet;386;386;120;100;20;266;3;4;1;0.3109;0;0' + FIN + '30001;Aigaliers;;;;;;;;;;erreur;;' + FIN;
        const d = Core.lireExport(dep);
        ok('export département relu : une commune analysée, l’échec ignoré', d && d.type === 'dep' && d.communes.size === 1 && d.communes.get('30084').presents === 120 && d.totaux.enTrop === 4, JSON.stringify(d && d.totaux));
        ok('fichier étranger : null', Core.lireExport('a;b' + FIN + '1;2' + FIN) === null);
    }
    // 0.12.00 : ajout automatique de numéros (L6). Nom principal EXACT (accents, casse, apostrophes et
    // espaces près), ville = la commune ou « Village (Commune) », 150 numéros par heure glissante.
    {
        const S = Core.nomSouple;
        ok('nom souple : accents, casse, apostrophe typographique tolérés', S('Rue de l’Église') === S("rue de l'eglise") && S(' Rue  Haute ') === S('Rue Haute'));
        ok('nom souple : ni abréviation ni tiret tolérés', S('Av. Foch') !== S('Avenue Foch') && S('Rue Saint-Jean') !== S('Rue Saint Jean'));
        const V = Core.villeHnOk;
        ok('ville : la commune, ou « Village (Commune) »', V('Brie', 'Brie') && V('BRIE', 'brie') && V('Le Hameau (Brie)', 'Brie'), '');
        ok('ville : une autre commune, ou la commune en village, refusée', !V('Janzé', 'Brie') && !V('Brie (Janzé)', 'Brie') && !V('', 'Brie'));
        const H = Core.numeroHn;
        ok('numéro WME : 12, 12bis, 7quater, 12b', H('12') === '12' && H('12 bis') === '12bis' && H('7 qua') === '7quater' && H('012 b') === '12b', [H('12'), H('12 bis'), H('7 qua'), H('012 b')].join(' '));
        ok('numéro WME : suffixe chiffré et 0 non posés', H('5 3') === null && H('0') === null);
        const T0 = 1e12, h = 3600 * 1000;
        const cent = Array.from({ length: 150 }, (_, k) => T0 - h / 2 + k * 1000);
        const q0 = Core.quotaHn(cent, T0), q1 = Core.quotaHn(cent.slice(1), T0), q2 = Core.quotaHn(cent.concat([T0 - h - 60000]), T0);
        ok('quota : 150 dans l’heure ⇒ plus rien, place libre 1 h après le plus ancien', q0.reste === 0 && q0.libre === cent[0] + h, JSON.stringify([q0.reste, q0.libre - T0]));
        ok('quota : 149 ⇒ reste 1 ; un ajout de plus d’une heure ne compte pas', q1.reste === 1 && q2.utilises === 150, JSON.stringify([q1.reste, q2.utilises]));
        const q3 = Core.quotaHn(cent.concat([T0 - 1000]), T0);
        ok('quota : 151 ⇒ la place se libère au 2e plus ancien', q3.reste === 0 && q3.libre === cent[1] + h, q3.libre - T0);

        const sg = (id, nom, ville, dy) => ({ id, nom, ville, coords: [P(0, dy), P(300, dy)] });
        const segs = [sg(1, 'Rue Haute', 'Brie', 0), sg(2, 'rue haute', 'Janzé', 500), sg(3, 'Av Haute', 'Brie', 1000), sg(4, 'R. Haute', 'Brie', 1500)];
        const ad = (brut, dx, dy, x) => { const [lon, lat] = P(dx, dy); return Object.assign({ brut, lon, lat, trouve: null, suffixe: '' }, x || {}); };
        const voie = { nom: 'Rue Haute', adresses: [
            ad('1', 20, 10), ad('3', 60, 10), ad('5', 100, 10, { suffixe: '5bis' }), ad('7', 100, 200), ad('9', 140, 10, { trouve: 'HN' }),
            ad('5 3', 160, 10), ad('11', 200, 10), ad('13', 50, 505), ad('15', 60, 1005), ad('17', 250, 10), ad('2', 30, -10, { hnPose: true }),
        ] };
        const pl = Core.planHn(voie, 'Brie', segs, ['3'], 2);
        const nums = pl.poses.map(p => p.number + '@' + p.segmentId).join(' ');
        ok('plan : seul le segment au nom exact ET dans la commune est admis', pl.admis === 1 && pl.refus.nom === 2 && pl.refus.ville === 1, JSON.stringify([pl.admis, pl.refus]));
        ok('plan : 1 et 11 posés sur le segment 1, dans l’ordre, jusqu’au quota', nums === '1@1 11@1', nums);
        const e = pl.ecartes;
        ok('plan : existant, suffixe, format, loin, quota, déjà posé écartés', e.existe === 1 && e.suffixe === 1 && e.format === 1 && e.loin === 3 && e.quota === 1 && e.dejaPose === 1, JSON.stringify(e));
        ok('plan : le numéro est posé à l’adresse BAN', pl.poses[0].lon === voie.adresses[0].lon && pl.poses[0].lat === voie.adresses[0].lat);
        const pl2 = Core.planHn({ nom: 'Rue Haute', adresses: [ad('4', 10, 10), ad('4', 12, 12)] }, 'Brie', segs, ['4 BIS'], 100);
        ok('plan : un doublon de la BAN n’est posé qu’une fois ; « 4 BIS » n’est pas « 4 »', pl2.poses.length === 1 && pl2.ecartes.existe === 1, JSON.stringify([pl2.poses.length, pl2.ecartes]));
        // Comptage à l'enregistrement : réservé à l'ajout, compté s'il est sur le serveur, rendu sinon.
        const E = [T0 - 10 * h, { t: T0 - 1000, s: 1, n: '12bis', e: 0 }, { t: T0 - 900, s: 1, n: '14', e: 0 }, { t: T0 - 800, s: 2, n: '3', e: 0 }, { t: T0 - 700, s: 1, n: '16', e: 1 }];
        const qE = Core.quotaHn(E, T0);
        ok('quota : entrées réservées et enregistrées comptent, horodatage ancien non', qE.utilises === 4 && qE.reste === 146, JSON.stringify([qE.utilises, qE.reste]));
        const rr = Core.rapprocherHn(E, new Map([[1, ['12 BIS', '16']]]));
        ok('rapprochement : 12bis retrouvé ⇒ compté ; 14 absent ⇒ rendu ; segment 2 non relu ⇒ réservé', rr.comptes.length === 1 && rr.comptes[0].n === '12bis' && rr.comptes[0].e === 1 &&
            rr.rendus.length === 1 && rr.rendus[0].n === '14' && rr.entrees.length === 4 && rr.entrees.some(x => x.s === 2 && x.e === 0), JSON.stringify(rr));
        ok('rapprochement : le quota récupère le numéro rendu', Core.quotaHn(rr.entrees, T0).reste === 147);
        const pl3 = Core.planHn(voie, 'Brie', [segs[1], segs[2]], [], 100);
        ok('plan : aucun segment admis ⇒ rien', pl3.admis === 0 && pl3.poses.length === 0);
        // 0.13.00 — hors agglomération : principal SANS ville + « nom BAN / commune » en alternatif ⇒ RPP.
        const sgH = (id, nom, ville, alts, dy) => ({ id, nom, ville, alts, coords: [P(0, dy), P(300, dy)] });
        const segsH = [sg(1, 'Rue Haute', 'Brie', 0),
            sgH(5, 'Rue Haute', '', [{ nom: 'rue haute', ville: 'Brie' }], 2000),       // hors agglo, nommage fait
            sgH(6, 'Rue Haute', '', [], 2500),                                            // hors agglo, alternatif absent
            sgH(7, 'D3', '', [{ nom: 'Rue Haute', ville: 'Brie' }], 3000),              // départementale hors agglo
            sgH(8, 'Rue Haute', '', [{ nom: 'Rue Haute', ville: 'Janzé' }], 3500),     // alternatif d'une autre commune
            sgH(9, 'Rue Haute', 'Brie', [{ nom: 'Rue Haute', ville: 'Brie' }], 4000)]; // ville au principal : en agglo
        const voieH = { nom: 'Rue Haute', adresses: [ad('21', 20, 10), ad('23', 20, 2010), ad('25', 20, 2510), ad('27', 20, 3010), ad('29', 20, 3510), ad('31', 20, 4010)] };
        const plH = Core.planHn(voieH, 'Brie', segsH, [], 100);
        const resume = plH.poses.map(x => x.number + '@' + x.segmentId + (x.rpp ? ':RPP(' + x.rpp.rue + '/' + x.rpp.ville + ')' : '')).join(' ');
        ok('hors agglo : 23 et 27 en RPP (nom de l’alternatif), 21 et 31 en numéros', resume === '21@1 23@5:RPP(rue haute/Brie) 27@7:RPP(Rue Haute/Brie) 31@9', resume);
        ok('hors agglo : sans alternatif ou avec une autre commune, rien (25 et 29 trop loin)', plH.ecartes.loin === 2 && plH.hors === 2 && plH.admis === 4, JSON.stringify([plH.ecartes, plH.hors, plH.admis]));
        ok('hors agglo : nommé ⇒ admis (pas refusé) ; sans alternatif ou autre commune ⇒ refusé « ville »', plH.refus.nom === 0 && plH.refus.ville === 2, JSON.stringify(plH.refus));
        ok('hors agglo : nommage incomplet compté à part (sans l’alternatif, ou alternatif d’une autre commune)', plH.refus.sansAlt === 2, JSON.stringify(plH.refus));
        // 0.15.01 : principal = numéro de route sans l'alternatif — compté seulement s'il est le segment probable d'une adresse.
        const segsR = [sgH(10, 'D633', '', [], 0), sgH(11, 'D12', '', [], 600), sgH(12, 'D633', '', [{ nom: 'Rue Haute', ville: 'Brie' }], 1200)];
        const voieR = { nom: 'Rue Haute', adresses: [ad('2', 20, 10, { seg: 10 }), ad('4', 20, 1210, { seg: 12 })] };
        const plR = Core.planHn(voieR, 'Brie', segsR, [], 100);
        ok('hors agglo : D633 sans alternatif, probable d’une adresse ⇒ signalé ; D12 voisine ⇒ non ; D633 nommée ⇒ admise', plR.refus.sansAltRoute === 1 && plR.admis === 1, JSON.stringify([plR.refus, plR.admis]));
        // 0.15.04 : alternatif « Village (Commune) » ⇒ le RPP porte la commune (cas de Chapifeu, 12/10).
        const segsV = [sgH(13, 'Chapifeu', '', [{ nom: 'Chapifeu', ville: 'La Chapelle-Janson (La Chapelle-Fleurigné)' }], 0)];
        const plV = Core.planHn({ nom: 'Chapifeu', adresses: [ad('1', 20, 10)] }, 'La Chapelle-Fleurigné', segsV, [], 100);
        ok('RPP : « Village (Commune) » en alternatif ⇒ ville du RPP = la commune', plV.poses.length === 1 && plV.poses[0].rpp && plV.poses[0].rpp.ville === 'La Chapelle-Fleurigné', JSON.stringify(plV.poses.map(p => p.rpp)));
        ok('RPP : ville sans parenthèse gardée telle quelle', Core.villeRpp('Brie') === 'Brie' && Core.villeRpp('') === '' && Core.villeRpp('Saint-Malo ( Paramé )') === 'Paramé');
        const plH2 = Core.planHn(voieH, 'Brie', segsH, ['23'], 100);
        ok('hors agglo : un RPP déjà présent (même en attente) n’est pas reposé', !plH2.poses.some(x => x.number === '23') && plH2.ecartes.existe === 1, JSON.stringify(plH2.ecartes));
        // Rapprochement d'un RPP : enregistré compté, disparu rendu, indécidable gardé réservé.
        const ER = [{ t: T0 - 500, s: 5, n: '23', e: 0, r: 1, lon: 0, lat: 0 }, { t: T0 - 400, s: 7, n: '27', e: 0, r: 1, lon: 0, lat: 0 },
            { t: T0 - 300, s: 7, n: '29', e: 0, r: 1, lon: 0, lat: 0 }, { t: T0 - 200, s: 7, n: '33', e: 0, r: 1, lon: 0, lat: 0 }];
        const etats = { '23': 'ok', '27': 'absent', '29': null, '33': 'attente' };
        const rR = Core.rapprocherHn(ER, new Map([[5, ['23']], [7, ['27', '29', '33']]]), x => etats[x.n]);
        ok('RPP : 23 compté, 27 rendu, 29 (indécidable) et 33 (en attente) gardés réservés',
            rR.comptes.map(x => x.n).join() === '23' && rR.rendus.map(x => x.n).join() === '27' && rR.entrees.length === 3 && rR.entrees.filter(x => x.e === 0).length === 2, JSON.stringify(rR));
        ok('RPP : jamais tranché par les numéros du segment (sans état, rien de rendu)', Core.rapprocherHn(ER, new Map([[5, []], [7, []]])).rendus.length === 0);
        // 0.13.03 — voie longue : zones qui tiennent dans une vue au zoom 16 (demi-côtés 400 × 220 m).
        const za = (dx, dy) => { const [lon, lat] = P(dx, dy); return { lon, lat }; };
        const Z = Core.zonesHn([za(0, 0), za(100, 50), za(0, 1500), za(30, 1480), za(2000, 0)], 400, 220);
        ok('zones : 3 groupes (sud, nord, est), chacun avec ses adresses', Z.length === 3 && Z.map(z => z.adresses.length).sort().join() === '1,2,2', JSON.stringify(Z.map(z => z.adresses.length)));
        const Zc = Z.find(z => z.adresses.length === 2 && Math.abs(z.lat - za(0, 0).lat) < 0.001);
        ok('zones : le centre est la moyenne de ses adresses', !!Zc && Math.abs(Zc.lon - (za(0, 0).lon + za(100, 50).lon) / 2) < 1e-9, JSON.stringify(Zc));
        ok('zones : aucune adresse perdue ni doublée', Z.reduce((t, z) => t + z.adresses.length, 0) === 5);
    }
    // Variante d'ARTICLE (Saint-Laurent-des-Arbres, 29/09) : BAN « Avenue Sembrancher », WME « Avenue de Sembrancher ».
    // Le 386 BAN est à 10 m d'un autre chemin et à 55 m du 386 WME : sans la variante, ni le nom (règle 1), ni le
    // segment (règle 2), ni la proximité (30 m) ne le rattachent. Un TYPE différent reste une autre voie.
    {
        // Deux tronçons de l'avenue : le 386 WME est sur le 84, qu'aucune adresse BAN n'a pour plus proche.
        const segsA = [{ id: 80, primaryStreetID: 8, streetIDs: [], geometry: { coordinates: [P(100, 1000), P(400, 1000)] } },
            { id: 84, primaryStreetID: 8, streetIDs: [], geometry: { coordinates: [P(0, 1000), P(100, 1000)] } },
            { id: 81, primaryStreetID: 9, streetIDs: [], geometry: { coordinates: [P(0, 1065), P(400, 1065)] } },
            { id: 82, primaryStreetID: 10, streetIDs: [], geometry: { coordinates: [P(0, 2000), P(400, 2000)] } },
            { id: 83, primaryStreetID: 9, streetIDs: [], geometry: { coordinates: [P(0, 2065), P(400, 2065)] } }];
        const stA = [{ id: 8, name: 'Avenue de Sembrancher' }, { id: 9, name: 'Chemin Voisin' }, { id: 10, name: 'Impasse du Moulin' }];
        const mA = Core.analyser({ adresses: [adr(Core, 'Avenue Sembrancher', '386', '', 50, 1055), adr(Core, 'Avenue Sembrancher', '7', '', 150, 1010),
                adr(Core, 'Avenue Sembrancher', '9', '', 250, 1010), adr(Core, 'Rue du Moulin', '4', '', 50, 2055)],
            segments: segsA, streets: stA, hns: [hn(84, '386', 50, 1000), hn(82, '4', 50, 2000)], rpps: [], contour: null });
        const vA = mA.voies.find(v => v.nom === 'Avenue Sembrancher'), vM = mA.voies.find(v => v.nom === 'Rue du Moulin');
        ok('variante d’article : le 386 de « Avenue de Sembrancher » est trouvé, rien en trop', vA.adresses.find(a => a.brut === '386').trouve === 'HN' && !mA.enTrop.some(x => x.brut === '386'), JSON.stringify([vA.presents, mA.enTrop.map(x => x.brut)]));
        ok('variante d’article : l’écart de nom reste signalé', vA.statutNom === 'autreArticle', vA.statutNom);
        ok('type différent (Impasse / Rue du Moulin) : pas une variante, le 4 reste manquant', vM.presents === 0, JSON.stringify([vM.presents, vM.statutNom]));
    }
    return r;
}

const run = src => { try { return cas(charger(src)); } catch (e) { return [{ nom: 'exception', ok: false, detail: e.message }]; } };

// ---- 1. Le code livré passe tout ----------------------------------------------------------------
const res = run(SOURCE);
const ko = res.filter(x => !x.ok);
res.forEach(x => console.log((x.ok ? '  ok ' : '  KO ') + x.nom + (x.ok || x.detail == null ? '' : ' — ' + x.detail)));
if (ko.length) { console.error('\n' + ko.length + ' cas en échec sur le fichier livré'); process.exit(1); }

// ---- 2. Chaque témoin (mutation) doit faire échouer au moins un cas -----------------------------
// Pas de témoin pour le CRLF : il est tenu deux fois (un retour chariot isolé clôt déjà la ligne, et trim()
// nettoie le dernier champ) ; muter l'une des deux ne peut rien faire tomber, et c'est voulu.
const TEMOINS = [
    ['tri par distance seule (la règle ne passe plus d\'abord)', 'couples.sort((p, q) => p.regle - q.regle || rang(p.x) - rang(q.x) || p.dm - q.dm)', 'couples.sort((p, q) => p.dm - q.dm)'],
    ['RPP avant HN', "const rang = x => x.type === 'HN' ? 0 : 1;", 'const rang = x => 0;'],
    ['règle 2 retirée (rue sans nom)', "(x.seg && v.segs.has(x.seg)) ? 2", 'false ? 2'],
    ['rayon ignoré', 'if (dm > RAYON_M) continue;', ''],
    ['quater non ramené', "const SUFFIXES = { quater: 'qua', quinquies: 'qui' };", 'const SUFFIXES = {};'],
    ['doublons comptés en trop', 'const doublons = dehors.filter(x => admissibles.has(x));', 'const doublons = [];'],
    ['contour ignoré', 'dansContour(x.lon, x.lat, d.contour)', 'true'],
    ['nom de voie préféré retiré', 'const pn = v.norm ? plusProche(g, a.lon, a.lat, SEG_MAX_M, m, v.norm) : null;', 'const pn = null;'],
    ['filtre des certifiées remis AVANT le rapprochement (défaut B2)', 'const lat0 = d.adresses.length ? d.adresses[0].lat : 46;', 'if (d.certSeules) d = Object.assign({}, d, { adresses: d.adresses.filter(a => a.cert) }); const lat0 = d.adresses.length ? d.adresses[0].lat : 46;'],
    ['filtre des certifiées ignoré', 'const compte = a => !d.certSeules || a.cert;', 'const compte = a => true;'],
    ['M5 : suffixe chiffré recollé au numéro', "const sf = String(suffixe || '').trim();", "const sf = '';"],
    ['M4 : la règle 3 refait des doublons', 'const admissibles = new Set(couples.filter(c => c.regle <= 2).map(c => c.x));', 'const admissibles = new Set(couples.map(c => c.x));'],
    ['M3 : nom d\'une autre voie BAN pris pour une variante', "else if (nomsBan.has(gagnant[0])) v.statutNom = 'different';", ''],
    ['M3 : homonyme hors commune compté', 'v.nomAbsent = !!v.norm && !(parNom.get(v.norm) || []).some(dansEmprise);', 'v.nomAbsent = !!v.norm && !parNom.has(v.norm);'],
    ['règle 3 retirée (PROCHE_M = 0)', 'const PROCHE_M = 30;', 'const PROCHE_M = 0;'],
    ['vote du nom inversé (la minorité décide)', 'const gagnant = [...votes.entries()].sort((x, y) => y[1].n - x[1].n)[0];', 'const gagnant = [...votes.entries()].sort((x, y) => x[1].n - y[1].n)[0];'],
    ['position en double gardée', 'if (vues.has(id)) continue;', ''],
    ['ancienne clé de dédoublonnage (cle_interop seule)', 'const id = ida || cle;', 'const id = cle;'],
    ['doublon interne de la BAN gardé (fusion à 150 m retirée)', 'return Math.hypot(px - x, py - y) <= FUSION_M; })) continue;', 'return false; })) continue;'],
    ['alternatif jamais signalé', 'if (g1.enAlt * 2 > g1.n) {', 'if (false) {'],
    ['numéro de route non reconnu', "else if (ROUTE_RE.test(v.nomWme)) v.statutNom = 'numeroRoute';", ''],
    ['type de voie non distingué', "if (cb && cb === cw) return typeDe(ban) === typeDe(wme) ? 'autreArticle' : 'autreType';", ''],
    ['orthographe jamais reconnue', "if (cb.length >= 4 && cw.length >= 4 && distanceEdition(cb, cw, max) <= max) return 'orthographe';", ''],
    ['nom partiel jamais reconnu', "if (dans(mb, mw) || dans(mw, mb)) return 'nomPartiel';", ''],
    ['nom tronqué non reconnu', "if (court.length >= 6 && long.startsWith(court)) return 'nomPartiel';", ''],
    ['article confondu avec le type', "return typeDe(ban) === typeDe(wme) ? 'autreArticle' : 'autreType';", "return 'autreType';"],
    ['suffixe non rapproché', 'if (meilleur) { a.suffixe = meilleur.brut; suffixes.add(meilleur); }', ''],
    ['rangement par sommets seulement (côtés non échantillonnés)', 'for (let q = 0; q <= pas; q++)', 'for (let q = 0; q <= pas; q += pas)'],
    ['0.05 : pied pris au premier sommet', 'return { seg: best, d: bd, fx, fy };', 'return { seg: best, d: bd, fx: best.xy[0][0], fy: best.xy[0][1] };'],
    ['0.05 : segment probable jamais gardé', 'a.proche = pp;', 'a.proche = null;'],
    ['0.11.02 : réserve jamais écartée', "if (v < 9990 || v > 9999 || voisins.has(a.voie + '|' + a.deleguee)) return true;", 'return true;'],
    ['0.11.02 : voisins ignorés (métrique écartée)', "voisins.has(a.voie + '|' + a.deleguee)) return true;", "false) return true;"],
    ['0.11.02 : plage 10000-10999 oubliée', '|| (v >= 10000 && v <= 10999)', ''],
    ['0.05 : export relu sans les RPP', "if (etat === 'HN' || etat === 'RPP') { v.presents++; T.presents++; }", "if (etat === 'HN') { v.presents++; T.presents++; }"],
    ['0.12.00 : nom normé (abréviations) au lieu du nom exact', 'const bonNom = s => nomSouple(s.nom) === nomBan;', 'const bonNom = s => normNom(s.nom) === normNom(voie.nom);'],
    ['0.12.00 : ville ignorée', 'bonNom(s) && villeHnOk(s.ville, commune) && traceOk(s)', 'bonNom(s) && traceOk(s)'],
    ['0.13.03 : zone sans limite (tout dans une seule)', 'if (Math.abs(x - x0) <= 2 * demiX && Math.abs(y - y0) <= 2 * demiY)', 'if (true)'],
    ['0.13.03 : centre pris au premier point', 'const lon = dedans.reduce((t, a) => t + a.lon, 0) / dedans.length', 'const lon = a0.lon'],
    ['0.15.01 : numéro de route sans alternatif jamais compté', '!nomSouple(s.ville) && !horsAgglo(s) && probables.has(s.id)).length,', '!nomSouple(s.ville) && !horsAgglo(s) && false).length,'],
    ['0.15.01 : toute départementale voisine comptée', '!nomSouple(s.ville) && !horsAgglo(s) && probables.has(s.id)).length,', '!nomSouple(s.ville) && !horsAgglo(s)).length,'],
    ['0.13.04 : nommage incomplet jamais compté', 'sansAlt: segs.filter(s => bonNom(s) && !nomSouple(s.ville) && !horsAgglo(s)).length,', 'sansAlt: 0,'],
    ['0.13.00 : hors agglo jamais admis', 'const horsA = segs.filter(s => horsAgglo(s) && traceOk(s));', 'const horsA = [];'],
    ['0.13.00 : principal avec ville pris pour hors agglo', 'const horsAgglo = s => !nomSouple(s.ville) && !!altBan(s);', 'const horsAgglo = s => !!altBan(s);'],
    ['0.13.00 : alternatif d’une autre commune admis', 'nomSouple(a.nom) === nomBan && villeHnOk(a.ville, commune)) || null;', 'nomSouple(a.nom) === nomBan) || null;'],
    ['0.13.00 : RPP posé comme numéro', 'rpp: alt ? { rue: alt.nom, ville: villeRpp(alt.ville) } : null', 'rpp: null'],
    ['0.15.04 : ville « Village (Commune) » recopiée telle quelle', 'rpp: alt ? { rue: alt.nom, ville: villeRpp(alt.ville) } : null', 'rpp: alt ? { rue: alt.nom, ville: alt.ville } : null'],
    ['0.13.00 : RPP disparu jamais rendu', "else if (st === 'absent') rendus.push(x);", "else if (st === 'absent') garder.push(x);"],
    ['0.13.00 : RPP indécidable rendu', 'const st = etatRpp ? etatRpp(x) : null;', "const st = etatRpp ? (etatRpp(x) || 'absent') : 'absent';"],
    ['0.13.00 : RPP tranché par les numéros du segment', 'if (x && typeof x === \'object\' && x.r === 1 && x.e !== 1) {', 'if (false) {'],
    ['0.12.00 : « Village (Commune) » refusé', 'return !!m && m[2].trim() === c;', 'return false;'],
    ['0.12.00 : accents non tolérés', "return String(s || '').normalize('NFD').replace(/\\p{Diacritic}/gu, '')", "return String(s || '')"],
    ['0.12.00 : quota du plan ignoré', 'if (poses.length >= reste) { ecartes.quota++; continue; }', ''],
    ['0.12.00 : numéro existant reposé', 'if (vus.has(cle)) { ecartes.existe++; continue; }', ''],
    ['0.12.00 : suffixe divergent posé', 'if (a.suffixe) { ecartes.suffixe++; continue; }', ''],
    ['0.12.00 : fenêtre d’une heure ignorée', 'heureHn(x) > maintenant - HN_FENETRE_MS', 'true'],
    ['0.12.00 : variantes d’article jamais retenues', 'v.variantes = new Set((parCoeur.get(cleArticle(v.norm)) || [])', 'v.variantes = new Set(([])'],
    ['0.12.00 : le type de voie retiré de la clé des variantes', "return c ? c + '|' + typeDe(norm) : '';", "return c;"],
    ['0.12.00 : numéro retiré avant l’enregistrement jamais rendu', 'else rendus.push(x);', 'else garder.push(x);'],
    ['0.12.00 : réservation tranchée sans relecture du segment', "x.e === 1 || !lus.has(x.s)) { garder.push(x); continue; }", "x.e === 1) { garder.push(x); continue; }"],
    ['0.12.00 : réservation comptée sans comparer le numéro', '.some(n => normNum(n) === normNum(x.n))', '.length >= 0'],
    ['0.12.00 : plafond relevé à 1000', 'const HN_MAX = 150,', 'const HN_MAX = 1000,'],
    ['0.12.00 : quater non développé', "const SUFFIXES_HN = { qua: 'quater', qui: 'quinquies' };", 'const SUFFIXES_HN = {};'],
    ['0.12.00 : distance au segment ignorée', 'let best = null, bd = SEG_MAX_M;', 'let best = null, bd = Infinity;'],
];
let temoinsKo = 0;
for (const [nom, avant, apres] of TEMOINS) {
    if (!SOURCE.includes(avant)) { console.error('témoin « ' + nom + ' » : motif introuvable dans le code — le banc a vieilli'); temoinsKo++; continue; }
    const r = run(SOURCE.replace(avant, apres));
    const tombes = r.filter(x => !x.ok).map(x => x.nom);
    if (!tombes.length) { console.error('témoin « ' + nom + ' » : AUCUN cas n\'échoue — le banc ne le voit pas'); temoinsKo++; }
    else console.log('  témoin « ' + nom + ' » : ' + tombes.length + ' cas tombent (' + tombes[0] + (tombes.length > 1 ? ', …' : '') + ')');
}
if (temoinsKo) process.exit(1);
console.log('\nOK — ' + res.length + ' cas, ' + TEMOINS.length + ' témoins vus échouer');
