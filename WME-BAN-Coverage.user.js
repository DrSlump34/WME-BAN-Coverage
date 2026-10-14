// ==UserScript==
// @name         WME BAN Coverage
// @name:fr      WME BAN Coverage
// @name:de      WME BAN Coverage
// @name:es      WME BAN Coverage
// @name:it      WME BAN Coverage
// @name:pt-BR   WME BAN Coverage
// @name:pt      WME BAN Coverage
// @name:he      WME BAN Coverage
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyNCcgaGVpZ2h0PScyNCcgdmlld0JveD0nMCAwIDI0IDI0Jz48cGF0aCBkPSdNMTIgMi41IEwyIDExIEg1IFYyMSBIMTkgVjExIEgyMiBaJyBmaWxsPScjZWY2YzAwJyBzdHJva2U9JyNlZjZjMDAnIHN0cm9rZS13aWR0aD0nMS4yJyBzdHJva2UtbGluZWpvaW49J3JvdW5kJy8+PHJlY3QgeD0nNi41JyB5PScxMy41JyB3aWR0aD0nNCcgaGVpZ2h0PSc3LjUnIGZpbGw9JyNmZmYnLz48Y2lyY2xlIGN4PScxNy41JyBjeT0nMTcuNScgcj0nNicgZmlsbD0nIzJlN2QzMicgc3Ryb2tlPScjZmZmJyBzdHJva2Utd2lkdGg9JzEuNicvPjxwYXRoIGQ9J00xNC42IDE3LjYgTDE2LjggMTkuOCBMMjAuNCAxNS42JyBmaWxsPSdub25lJyBzdHJva2U9JyNmZmYnIHN0cm9rZS13aWR0aD0nMicgc3Ryb2tlLWxpbmVjYXA9J3JvdW5kJyBzdHJva2UtbGluZWpvaW49J3JvdW5kJy8+PC9zdmc+
// @namespace    https://github.com/DrSlump34
// @version      0.15.03
// @description  Compare the French national address base (BAN) with the house numbers and residential places of WME, for a commune or a whole département: figures, statistics, and a street-by-street inventory. Computed live; scans are kept in your browser only, and flagged when the BAN or WME changed since.
// @description:fr Compare la Base Adresse Nationale (BAN) aux numéros et aux points résidentiels de WME, pour une commune ou un département entier : chiffres, statistiques et état des lieux voie par voie. Calculé en direct ; les balayages restent dans votre navigateur, signalés quand la BAN ou WME a changé depuis.
// @description:de Vergleicht die französische Adressdatenbank (BAN) mit den Hausnummern und Wohnorten im WME, für eine Gemeinde oder ein ganzes Département: Zahlen, Statistiken und Bestandsaufnahme Straße für Straße. Live berechnet; kein Ergebnis wird gespeichert.
// @description:es Compara la base nacional de direcciones francesa (BAN) con los números y los puntos residenciales de WME, para un municipio o un departamento entero: cifras, estadísticas e inventario calle por calle. Calculado en directo; no se guarda ningún resultado.
// @description:it Confronta la base nazionale degli indirizzi francese (BAN) con i numeri civici e i punti residenziali di WME, per un comune o un intero dipartimento: cifre, statistiche e inventario via per via. Calcolato dal vivo; nessun risultato viene conservato.
// @description:pt-BR Compara a base nacional de endereços francesa (BAN) com os números e os pontos residenciais do WME, para um município ou um departamento inteiro: números, estatísticas e inventário rua a rua. Calculado ao vivo; nenhum resultado é guardado.
// @description:pt Compara a base nacional de moradas francesa (BAN) com os números de porta e os pontos residenciais do WME, para um município ou um departamento inteiro: números, estatísticas e inventário rua a rua. Calculado em direto; nenhum resultado é guardado.
// @description:he משווה את מאגר הכתובות הלאומי של צרפת (BAN) למספרי הבתים ולנקודות המגורים ב-WME, עבור רשות מקומית או מחוז שלם: מספרים, סטטיסטיקות ומצב קיים רחוב אחר רחוב. מחושב בזמן אמת; אף תוצאה אינה נשמרת.
// @author       DrSlump34
// @copyright    DrSlump34 2026
// @license      MIT
// @homepageURL  https://github.com/DrSlump34/WME-BAN-Coverage
// @supportURL   https://greasyfork.org/scripts/600088-wme-ban-coverage/feedback
// @downloadURL  https://update.greasyfork.org/scripts/600088/WME%20BAN%20Coverage.user.js
// @updateURL    https://update.greasyfork.org/scripts/600088/WME%20BAN%20Coverage.meta.js
// @match        https://www.waze.com/*/editor*
// @match        https://www.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @exclude      https://www.waze.com/*user/*editor/*
// @exclude      https://www.waze.com/discuss/*
// @exclude      https://www.waze.com/editor/sdk/*
// @exclude      https://beta.waze.com/*user/*editor/*
// @exclude      https://beta.waze.com/editor/sdk/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @connect      plateforme.adresse.data.gouv.fr
// @connect      geo.api.gouv.fr
// @connect      update.greasyfork.org
// @connect      raw.githubusercontent.com
// @run-at       document-idle
// ==/UserScript==

/*  Pour une commune ou un département, le script lit en direct les deux côtés :
 *    - la BAN, commune par commune, sur la plateforme de la Base Adresse Nationale ;
 *    - WME, par les mêmes appels que l'éditeur (segments, rues, numéros des segments, RPP),
 *      sans parcourir la carte : la zone n'a pas besoin d'avoir été affichée.
 *  Puis il rapproche chaque adresse BAN d'un numéro WME et rend les chiffres, les statistiques
 *  et l'état des lieux voie par voie.
 *
 *  La BAN est le référentiel. Une voie BAN est rattachée aux segments WME qui portent ses
 *  numéros, qu'ils aient un nom ou non : c'est ce qui permet de compter une rue sans nom.
 *
 *  Aucun résultat n'est envoyé ailleurs : les balayages sont gardés dans CE navigateur (IndexedDB), avec
 *  les préférences (périmètre, interrupteurs, place de la fenêtre, couleurs des points), et
 *  geo.api.gouv.fr reçoit le centre de la carte et les recherches de commune. GreasyFork (nouvelle version)
 *  et GitHub (version minimale, version-min.json) sont seulement lus.
 *  Le script ne modifie la carte que sur demande d'un L6 (« Ajouter les numéros », voie par voie, 150 numéros
 *  par heure) ; il n'enregistre jamais : l'éditeur relit et enregistre avec WME.
 */

(function _wmeIntegre() {
    'use strict';

    const SCRIPT_ID = 'wme-ban-coverage';
    const SCRIPT_NAME = 'WME BAN Coverage';
    const VERSION = (typeof GM_info !== 'undefined' && GM_info.script && GM_info.script.version) || 'dev';
    // Adresses de publication (GreasyFork 600088, non répertorié ; dépôt GitHub public). Pas de sujet
    // Discuss : le lien du pied ne s'affiche que si URL_DISCUSS est renseignée.
    const URL_GF = 'https://greasyfork.org/scripts/600088-wme-ban-coverage';
    const URL_DISCUSS = '';
    const URL_GH = 'https://github.com/DrSlump34/WME-BAN-Coverage';
    const LAYER = 'wbc-adresses';
    const GEOM_KEY = 'wbc.fenetre';
    const OPTS_KEY = 'wbc.opts';

    const BAN_URL = code => 'https://plateforme.adresse.data.gouv.fr/ban/communes/' + code + '/download/csv-bal/adresses';
    const GEO_URL = 'https://geo.api.gouv.fr';
    // Paris, Marseille et Lyon : la BAN n'existe que par arrondissement (le code de la commune rend 404).
    const ARRONDISSEMENTS = {
        '75056': Array.from({ length: 20 }, (_, i) => String(75101 + i)),
        '13055': Array.from({ length: 16 }, (_, i) => String(13201 + i)),
        '69123': Array.from({ length: 9 }, (_, i) => String(69381 + i)),
    };
    // Au-delà d'environ 0,08° de côté, le serveur de WME rend une zone ALLÉGÉE sans le dire
    // (mesuré le 26/09/2026 à Nîmes : 2 391 segments et 0 RPP au lieu de 13 566 et 458). On
    // découpe donc en carreaux de 0,05°, calés sur une grille fixe pour pouvoir les réutiliser
    // d'une commune à sa voisine.
    const CARREAU = 0.05;
    const CARREAUX_GARDES = 48;
    const PARALLELE = 3;
    const ROAD_TYPES = '1,2,3,4,5,6,7,8,9,10,15,16,17,18,19,20,22';

    const pw = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;

    // L'icône du script, détourée (sans plaque) : maison orange, coche verte. Mêmes couleurs sur
    // fond clair et sombre. Aucun identifiant interne, donc plusieurs copies ne se gênent pas.
    const icone = h => '<svg xmlns="http://www.w3.org/2000/svg" width="' + h + '" height="' + h + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M12 2.5 L2 11 H5 V21 H19 V11 H22 Z" fill="#ef6c00" stroke="#ef6c00" stroke-width="1.2" stroke-linejoin="round"/><rect x="6.5" y="13.5" width="4" height="7.5" fill="#fff"/><circle cx="17.5" cy="17.5" r="6" fill="#2e7d32" stroke="#fff" stroke-width="1.6"/><path d="M14.6 17.6 L16.8 19.8 L20.4 15.6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    let sdk = null;
    const log = m => console.log('[WBC] ' + m);
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    // =====================================================================
    //  I18N — détection sur la locale de WME, repli sur l'anglais
    // =====================================================================

    // Pluriels : n arrive formaté (« 1 234 ») ; seuls ses chiffres comptent. En français 0 et 1 sont au
    // singulier (« 0 voie complète »), ailleurs seul 1 l'est (audit du 26/09, M24).
    const chiffres = n => String(n).replace(/[^0-9]/g, '');
    const un = n => chiffres(n) === '0' || chiffres(n) === '1';
    const un1 = n => chiffres(n) === '1';

    const DICO = {
        en: {
            sbHint: 'Compares the national address base (BAN) with the house numbers and residential places (RPP) of WME, for a commune or a whole département.',
            sbOpen: 'Open the window',
            sbHelp: 'Help',
            hWhatT: 'What is compared',
            hWhatB: "<p>The <b>BAN</b> is the reference: every address it lists should exist in WME, either as a house number on a segment (HN) or as a residential place (RPP).</p><p>Both sides are read live: the BAN from its national platform (adresse.data.gouv.fr), the commune boundaries and lists from geo.api.gouv.fr — which receives the map centre and your searches — and WME from the same servers as the editor. The area does not need to be displayed or loaded.</p>",
            hMatchT: 'When is a number found',
            hMatchB: '<p>A BAN address is found when WME has the same number (suffixes included: <i>bis</i>, <i>ter</i>, letters) less than 150 m away, and:</p><table class="wbc-help-table"><tr><td>1</td><td>on a street with the same name (main or alternate name), or one that differs only by an article (“Avenue Sembrancher” = “Avenue de Sembrancher”; the name gap is still reported);</td></tr><tr><td>2</td><td>or on a segment that carries this street\'s addresses, <b>named or not</b>;</td></tr><tr><td>3</td><td>or less than 30 m from the address.</td></tr></table><p>Rule 1 is tried first everywhere, then 2, then 3. A WME number is used only once.</p>',
            hNamesT: 'The «\u00a0WME street\u00a0» column',
            hNamesB: '<table class="wbc-help-table"><tr><td>&#x2713;</td><td>the segments near the addresses carry the BAN name.</td></tr><tr><td><i>name</i></td><td>they carry another name: the name to check.</td></tr><tr><td><i>no name</i></td><td>they carry no name.</td></tr><tr><td><i>no segment</i></td><td>no segment less than 80 m from the addresses.</td></tr><tr><td>&#x2713; alt</td><td>the BAN name is carried as an <b>alternate</b> name; the main name is shown next to it.</td></tr><tr><td>road no.</td><td>the main name is a road number and the BAN name is missing from the alternate names: add it.</td></tr><tr><td>type</td><td>only the street type differs (Rue / Chemin…).</td></tr><tr><td>article · spelling · partial</td><td>close names: an article, a letter or two, or a shortened form. <i>missing from WME</i>: the street is not in WME, the name shown is the neighbouring one.</td></tr></table><p>A missing number shown in orange with <b>≠</b> exists in WME with another suffix (12 b / 12bis): to check.</p><p>&#x26A0; marks a BAN name that no segment of the commune carries.</p>',
            hLimitsT: 'Good to know',
            hLimitsB: "<p>A whole département takes a few minutes: the BAN is read commune by commune, WME in squares of about 5 km. The button Stop interrupts it; what is done stays displayed, and failed communes can be retried alone.</p><p>Paris, Marseille and Lyon are read district by district. No result is stored anywhere: closing WME erases them. Only your preferences (area, switches, window position, point colours) stay in your browser.</p>",
            hSafeB: "The script changes the map only on request: the “Add the house numbers” button, reserved for L6 editors, places numbers and never saves them. It reads WME and the BAN; its results stay in this browser.",
            lnkDiscuss: 'Discuss thread',
            majBtn: v => 'Version ' + v + ' is available',
            majInstall: 'Install',
            close: 'Close',
            dragTip: 'Drag to move · double-click to put it back',
            modeHere: 'Map centre',
            modeCommune: 'Other commune',
            modeDep: 'Département',
            modeLbl: 'Area',
            hereHint: 'The commune under the centre of the map, taken when the analysis starts.',
            searchPh: 'Name, postcode or INSEE code',
            searchNone: 'No commune found',
            depChoose: 'Choose a département',
            analyse: 'Analyse',
            stop: 'Stop',
            stLocate: 'Finding the commune…',
            stBan: 'BAN: reading…',
            stBanMo: mo => 'BAN: reading… ' + mo + ' MB',
            stWme: (i, n) => 'WME: square ' + i + '/' + n,
            stHn: 'WME: house numbers…',
            stCalc: 'Computing…',
            stDep: (i, n, nom) => 'Commune ' + i + '/' + n + ' — ' + nom,
            stDone: s => 'Done in ' + s + ' s',
            stStopped: 'Stopped',
            errNoCommune: 'No French commune under the centre of the map.',
            errPick: 'Choose a commune first.',
            errPickDep: 'Choose a département first.',
            errBan: 'The BAN has no addresses for this commune.',
            errNet: m => 'Network error: ' + m,
            errWme: 'WME did not answer: ' ,
            errGrant: 'The script manager refused the network request (check the script\'s permissions).',
            emptyIntro: 'Choose an area, then start the analysis.',
            kBan: 'BAN addresses',
            kCert: n => n + (un1(n) ? " certified" : " certified"),
            kWme: 'Found in WME',
            kHnRpp: (h, r) => h + ' HN · ' + r + ' RPP',
            kMiss: 'Missing',
            kExtra: 'Extra in WME',
            kDup: n => n + (un1(n) ? " duplicate" : " duplicates"),
            kCov: 'Coverage',
            voiesLine: (c, n) => c + (un1(c) ? ' complete street out of ' : ' complete streets out of ') + n,
            vNoName: n => n + (un1(n) ? " without name" : " without name"),
            vOtherName: n => n + (un1(n) ? " with another name" : " with another name"),
            vNoSeg: n => n + (un1(n) ? " without segment" : " without segment"),
            fAll: 'All',
            fTodo: 'Incomplete',
            fName: 'Name to check',
            fDone: 'Complete',
            filterPh: 'Filter streets',
            layerSwitch: 'Gaps',
            exportCsv: 'Export CSV',
            thStreetBan: 'BAN street',
            thStreetWme: 'WME street',
            thBan: 'BAN',
            thWme: 'WME',
            thGap: 'Gap',
            thCommune: 'Commune',
            thMiss: 'Missing',
            nameNone: 'no name',
            nameNoSeg: 'no segment',
            tipSame: 'The nearby segments carry the BAN name',
            tipOther: 'The nearby segments carry another name',
            tipAbsent: 'No segment of the commune carries this name',
            missingT: 'Missing numbers',
            noneMissing: 'Nothing missing on this street.',
            tipGo: 'Show on the map',
            extraT: n => 'WME numbers without a BAN address (' + n + ')',
            dupT: n => 'Numbers present twice in WME (' + n + ')',
            noStreet: 'No street matches.',
            depBack: 'Back to the département',
            tipHN: 'House number on a segment',
            tipRPP: 'Residential place (RPP)',
            errCommune: 'failed',
            showFound: 'Found',
            hovDist: m => 'WME number ' + m + ' m away',
            sbMap: "Map",
            sbHover: "Details on hover",
            sbHoverHint: "Rest the pointer on a point of the map: its address, its state and its certification appear.",
            sbColors: "Colours",
            sbColorsReset: "Default colours",
            legColMap: "Municipality map",
            tipColMap: "Colour of the département map: the 5 shades are derived from it, lightest for the least covered.",
            tipColPoint: "Colour of these points on the map.",
            hovMissing: "Missing in WME",
            hovFound: k => 'Found in WME (' + k + ')',
            hovExtra: "WME number with no BAN address",
            hovCert: "Address certified by the commune",
            hovNotCert: "Address not certified by the commune",
            hovWmeStreet: r => 'WME street: ' + r,
            sizeTip: "Enlarge / restore the window",
            searching: "Searching…",
            tipAnalyse: "Analyse the chosen area. If it was already scanned, its date is shown first, with Open or Run again.",
            tipAnalyseCom: c => "Analyse " + c + " again, the commune shown, and update its line in the département. To scan the whole département, go back to it first.",
            tipStop: "Stop the running analysis. What is done stays displayed and saved.",
            tipModeCommune: "Pick a municipality by name, postcode or INSEE code.",
            tipModeDep: "Analyse every municipality of a département.",
            tipFDone: "Streets whose BAN addresses are all in WME.",
            tipFAll: "All the streets of the municipality.",
            tipSort: "Sort on this column; a second click reverses the order.",
            tipDepBack: "Back to the list of the département’s municipalities, without running the analysis again.",
            tipCsv: "Download the municipality’s report, address by address, as CSV (spreadsheet).",
            tipCsvDep: "Download one row per municipality of the département, as CSV (spreadsheet).",
            tipNext: "Centre the map on the next missing number of the street, then of the next incomplete street.",
            tipRetry: "Run again only the municipalities whose analysis failed.",
            tipCmpStop: "Remove the displayed comparison; the scan stays.",
            tipRefresh: "Scan this municipality again; the new result is compared with the previous one.",
            tipRefreshN: "Scan again only the flagged municipalities (BAN or WME changed since); the result is compared with the previous scan.",
            tipMemoOpen: "Open the window on this scan and fit the map to it.",
            tipMemoClear: "Delete every scan saved in this browser (two clicks).",
            tipSbOpen: "Open the WBC window (like the button on the right of the map).",
            tipColorsReset: "Reset the point colours to their defaults.",
            tipHelpHdr: "Expand or collapse this part of the help.",
            tipFab: "Open or close the window",
            tipVoie: "Expand the street (its numbers, missing ones in red) and fit the map to it.",
            tipCommune: "Open this municipality’s details and fit the map to it.",
            memoBanBtn: "Check BAN",
            memoBanTip: "Check whether the BAN changed since the scan, commune by commune (one small request each). Nothing is scanned again.",
            memoBanUpd: "BAN updates",
            copyBtn: "Copy",
            copyTip: "Copy the coverage rate to the clipboard, formatted for Discord.",
            copyDone: "Copied",
            copyFail: "Copy failed",
            copyTitre: lieu => '📊 **BAN address coverage in WME — ' + lieu + '**',
            copyAdr: (p, b, c) => 'Addresses found in WME: **' + p + ' / ' + b + ' (' + c + ')**',
            copyCommunes: (n, tot, d) => 'Municipalities analysed: ' + n + '/' + tot + ' · scan of ' + d,
            copyCert: "certified addresses only",
            foldTip: "Minimize the window",
            unfoldTip: "Expand the window",
            dejaCommune: d => 'Already analysed on ' + d,
            dejaDep: (d, n, total) => 'Already analysed on ' + d + ' (' + n + '/' + total + ' municipalities)',
            dejaViaDep: c => 'with département ' + c,
            dejaOpenTip: "Shows this scan at once, without running the analysis again.",
            dejaRelaunch: "Run again",
            dejaRelaunchTip: "Runs the full analysis again; the saved scan becomes the reference of the comparison.",
            lastMissing: "No other missing number in the table.",
            retryFailed: n => 'Retry the ' + n + (un1(n) ? ' failed commune' : ' failed communes'),
            stDoneErr: (s, n) => 'Done in ' + s + ' s — ' + n + (un1(n) ? ' commune failed' : ' communes failed'),
            noCert: n => 'None of the ' + n + ' BAN addresses of this commune is certified.',
            errSession: "WME session expired: reload the page.",
            errFormat: src => src + ' answered in an unexpected format: the script needs an update.',
            delNote: "not attributable to a delegated commune",
            mapCap: (a, b) => 'Map: ' + a + ' points shown out of ' + b + ' in view (zoom in to see them all)',
            legExtra: "extra in WME",
            legFound: "found",
            legMiss: "missing",
            eta: m => '≈ ' + m + (un1(m) ? ' min left' : ' min left'),
            certNote: n => 'Certified addresses only: ' + n + (un1(n) ? ' uncertified address set aside' : ' uncertified addresses set aside'),
            articleTag: "article",
            tipArticle: "Only an article differs (de, la, du…)",
            orthoTag: "spelling",
            tipOrtho: "Spelling differs by a letter or two",
            partielTag: "partial",
            tipPartiel: "One name is a shortened form of the other",
            absentTag: "missing from WME",
            altTag: "alt",
            tipAlt: p => "The BAN name is carried as an alternate name; main name: " + p,
            routeTag: "road no.",
            tipRoute: "The main name is a road number, and the BAN name is not among the alternate names",
            typeTag: "type",
            tipType: "Only the street type differs",
            vAlt: n => n + (un1(n) ? " with the name as alternate" : " with the name as alternate"),
            vRoute: n => n + (un1(n) ? " under a road number" : " under a road number"),
            vType: n => n + (un1(n) ? " under a close name" : " under a close name"),
            kSuf: n => 'incl. ' + n + (un1(n) ? ' suffix to check' : ' suffixes to check'),
            tipSuf: w => "WME has " + w + ": check the suffix",
            certOnly: 'Certified',
            nextMissing: "Next missing",
            etaSoon: "less than a minute left",
            delAll: "All delegated communes",
            depMap: 'Commune polygons',
            legNoData: 'not analysed',
            hovCom: (ban, wme, miss) => 'BAN ' + ban + ' · WME ' + wme + ' · missing ' + miss,
            hovComClick: 'Click (zoomed out) to open it',
            hovProbSeg: (id, d) => 'Probable segment: ' + id + ' (' + d + ' m)',
            selSegs: n => 'Select the segments (' + n + ')',
            selSegsTip: 'Selects in WME the segments that carry this street’s addresses',
            selSegsPart: (a, b) => a + '/' + b + ' segments selected: the others are not loaded — zoom in on the street.',
            selSegsNone: 'No segment of this street is loaded in WME: zoom in on it and try again.',
            ajHnAdd: n => 'Add the house numbers (' + n + ')',
            nextStreet: n => 'Next street (' + n + ' to add)',
            tipNextStreet: 'Opens the street of the commune where “Add” has the most numbers to place (BAN name as primary or alternate), skipping the streets already opened with this button.',
            nextStreetNone: 'No other street ready: the streets left have their numbers placed, or a name to fix first.',
            ajHnAddTip: r => 'L6 only: places in WME the missing numbers of this street, on the segments whose primary name is exactly the BAN name (accents and case aside) and whose city is the commune or “Village (Commune)”. At most 150 numbers per sliding hour, counted when saved (' + r + ' left). Nothing is saved: check them, then save in WME. Out of town (primary name without a city, BAN name with the commune as an alternate), the address becomes a residential place (RPP) — same conversion as the WME Naming Auditor ⚡ — and counts in the quota.',
            ajHnNoName: 'The WME name of this street is not the BAN name: automatic adding needs a primary name identical to the BAN.',
            ajHnNone: 'No number can be added automatically on this street.',
            ajHnQuota: h => 'Limit reached (150 numbers per hour): next adding possible at ' + h + '.',
            ajHnRunning: 'Adding the house numbers…',
            bgTab: 'Tab in the background: Chrome slows the work in progress down (up to 3 times longer). Keep this tab in front.',
            bgTabTip: 'Chrome throttles the timers of a hidden tab (one per second, then one per minute after 5 minutes) and lowers its priority. Measured on 29/09/2026: a department took 41 min in the background against 13 min in front.',
            ajHnDone: (n, r) => n + (un1(n) ? ' number placed — check it' : ' numbers placed — check them') + ', then save in WME. Left in the quota: ' + r + '.',
            ajHnAddMix: (n, r) => 'Add (' + n + ' numbers · ' + r + ' RPP)',
            ajHnDoneMix: (n, r, q) => n + (un1(n) ? ' number' : ' numbers') + ' and ' + r + ' RPP placed — check them, then save in WME. Left in the quota: ' + q + '.',
            ajHnDoneRpp: (r, q) => r + ' RPP placed — ' + (un1(r) ? 'check it' : 'check them') + ', then save in WME. Left in the quota: ' + q + '.',
            ajRppCrit: l => '⚠️ To fix by hand: ' + l + '.',
            ajRppCritHn: n => 'number ' + n + ' left as a house number on an out-of-town segment',
            ajRppCritPoi: n => 'RPP ' + n + ' left without an address',
            ajRppCritDbl: n => 'address ' + n + ' in DOUBLE (house number + RPP)',
            ajHnSansAlt: (r, c) => 'Some out-of-town segments carry “' + r + '” without a city but lack the alternate “' + r + ' / ' + c + '”: no RPP can be placed there until it is added.',
            ajHnSansAltRoute: (r, c) => 'Some out-of-town segments have a road number as primary name, without a city, but lack the alternate “' + r + ' / ' + c + '”: no RPP can be placed there until it is added.',
            ajHnSkip: n => n + (un1(n) ? ' address skipped' : ' addresses skipped') + ' (details in the console).',
            ajHnNoSeg: 'No loaded segment has exactly this name as primary name with the commune as city: nothing was placed.',
            ajHnErr: m => 'Adding stopped: ' + m,
            ajHnRights: 'Reserved for L6 editors.',
            ajHnSee: n => (un1(n) ? 'It is' : 'They are') + ' circled in turquoise on the map.',
            ajHnPoseTip: 'Placed by WBC, not saved yet: click to centre the map on it.',
            ajHnSaved: (c, r, q) => 'Save: ' + c + (un1(c) ? ' number counted' : ' numbers counted') + ', ' + r + ' given back to the quota (removed before saving). Quota left: ' + q + '.',
            ajHnSavedTip: 'Placed by WBC and saved.',
            hHnT: 'Adding house numbers (L6)',
            hHnB: '<p>Reserved for <b>L6</b> editors. In the expanded row of a street, <i>Add the house numbers</i> places its missing addresses in WME — <b>one street at a time</b>, never a whole commune. For a single number: the “+” on its chip (on hover), or a click on its point on the map.</p><p><b>Conditions</b>: the primary name of the segments is exactly the BAN name (only accents, case, apostrophes and spaces are tolerated) and their city is the commune or “Village (Commune)”. Each number goes to the nearest admitted segment (80 m at most); a number already present, even pending, is never placed again; a different or numeric suffix is left to the editor.</p><p><b>Nothing is saved</b>: placed numbers are circled in turquoise on the map (even with the window closed) and marked ✚ in the street; check them, then save or undo in WME.</p><p><b>Quota</b>: 150 numbers per sliding hour. A number is reserved when placed, then counted if it is found on the server after saving; removed or changed before, it is given back. Numbers typed by hand never count. Once saved, they become “found” without running the analysis again; an older saved scan says so (“run again”).</p><p><b>Out of town</b>: on a segment whose primary name has no city and which carries the BAN name with the commune as an alternate, the address becomes a <b>residential place (RPP)</b> — the same conversion as the ⚡ of WME Naming Auditor: place created at the number, its address, the number\u2019s entry point kept, number removed; any failed step is undone. The button then shows both counts, numbers and RPP; RPP count in the quota.</p>',
            ajHnQuotaTip: 'Sliding hour: a number counts for one hour from when it was placed. Only numbers placed by this button and actually saved are counted.',
            ajHnLeft: n => 'Quota: ' + n + ' left this hour',
            ajHnFull: h => 'Quota reached — next adding at ' + h,
            ajHn1: 'Add this number',
            ajHn1Tip: 'L6 only: places this single number in WME, with the checks of “Add the house numbers” (BAN name, city, segment within 80 m); counts in the quota. Nothing is saved.',
            ajHn1Exists: n => 'Number ' + n + ' is already in WME on this street: nothing placed.',
            ajHn1Far: n => 'No admitted segment (BAN name, right city) within 80 m of number ' + n + ': nothing placed.',
            tipGoAdd: 'Show on the map. On hover, “+” adds this single number.',
            cmpBtn: 'Compare',
            cmpTip: 'Load a CSV exported earlier for the same commune or département: the progress since then is shown.',
            cmpLine: (d, w, m, x) => 'Since the export of ' + d + ': ' + w + ' in WME · ' + m + ' missing · ' + x + ' extra',
            cmpStop: 'Stop comparing',
            cmpWrong: 'This export is for another commune or département.',
            cmpBad: 'This file is not a WME BAN Coverage export.',
            cmpCert: 'The export used another “certified only” setting: the figures do not compare.',
            thDelta: 'Δ',
            thDeltaTip: d => 'Change in WME since the export of ' + d,
            namesCsv: 'Gaps (CSV)',
            namesCsvTip: 'The streets whose WME name differs from the BAN, with their segments and a WME link: to fix or to report.',
            namesNone: 'No name gap to export.',
            hTrackT: 'Following up and reporting',
            hTrackB: '<p><b>Département map</b>: after a département, each commune is coloured by coverage (light = little, dark = much). Hover it for its figures; zoomed out, a click opens it.</p><p><b>Missing number</b>: with its street open, a dotted line goes to the segment that should probably carry it; its id is in the CSV.</p><p><b>Select the segments</b> of a street from its row: its segments are selected in WME.</p><p><b>Progress</b>: the CSV export is also a snapshot. Later, <i>Compare</i> reads it back and gives the change street by street (or commune by commune). Nothing is stored anywhere else.</p><p><b>Gaps (CSV)</b>: the streets to rename, with a WME link each, to fix or to send to the area managers.</p>',
            certOnlyTip: "Certified addresses only",
            layerSwitchTip: "Missing and extra numbers on the map",
            showFoundTip: "Also show found addresses",
            depMapTip: 'Communes coloured on the map',
            etaShort: m => '\u2248\u00a0' + m + '\u00a0min',
            memoSweep: d => 'Scan of ' + d,
            memoBanWait: 'BAN: checking…',
            memoBanProg: (i, n) => 'BAN: checking ' + i + '/' + n,
            memoBanOk: 'BAN unchanged',
            memoBanMaj: d => 'BAN updated' + (d ? ' (' + d + ')' : ''),
            memoBanMajN: n => 'BAN updated: ' + n,
            memoBanErr: 'BAN: check failed',
            dejaHnDepuis: n => n + (un1(n) ? ' number added by WBC since then: relaunch' : ' numbers added by WBC since then: relaunch'),
            memoWmeBtn: 'Check WME',
            memoWmeTip: 'Re-reads the area, house numbers included, and compares it with the scan: segments (count and date), each house number (id, value, segment, position) and residential places.',
            memoWmeProg: (i, n) => 'WME: checking ' + i + '/' + n,
            memoWmeOk: 'WME unchanged',
            memoWmeMaj: d => 'WME edited' + (d ? ' (' + d + ')' : ''),
            memoWmeMajN: n => 'WME edited: ' + n,
            memoRefresh: 'Refresh',
            memoRefreshN: n => 'Refresh flagged (' + n + ')',
            memoTagBan: 'BAN updated since the scan',
            memoTagWme: 'WME edited since the scan',
            cmpLineMemo: (d, w, m, x) => 'Since the scan of ' + d + ': ' + w + ' in WME · ' + m + ' missing · ' + x + ' extra',
            secMemo: 'Saved scans',
            memoHint: 'Kept in this browser only. Reopening one shows it at once and checks whether the BAN has changed since.',
            memoNone: 'No saved scan yet.',
            memoOpen: 'Open',
            memoDel: 'Delete this scan',
            memoClear: 'Delete all',
            memoErr: m => 'The scan could not be saved: ' + m,
            hMemoT: 'Saved scans and updates',
            hMemoB: '<p>Every scan is kept in this browser (nothing is sent anywhere). Choosing the same commune or département again, or <i>Open</i> in the Scripts tab, shows it at once with its date. <i>Analyse</i> reminds you too: if the same area was already scanned, its date is shown with <i>Open</i> and <i>Run again</i>. If WBC has added house numbers in that area since, the banner says so and <i>Run again</i> becomes the main button.</p><p><b>BAN</b>: the address file of each commune is compared with the one of the scan — automatically for a commune (one request), with <i>Check BAN</i> for a département (one request per commune; nothing is scanned again). <b>WME</b>: <i>Check WME</i> re-reads the area, house numbers included: segments (count and date), each house number (id, value, segment, position — house numbers have no date in WME, and adding one does not change its segment’s date) and residential places.</p><p>Flagged communes carry a BAN or WME tag and an orange outline on the map; <i>Refresh</i> re-scans only them. The new scan is compared with the previous one automatically.</p>',
            memoClearSure: 'Click again to delete all',
        },
        fr: {
            sbHint: 'Compare la Base Adresse Nationale (BAN) aux numéros et aux points résidentiels (RPP) de WME, pour une commune ou un département entier.',
            sbOpen: 'Ouvrir la fenêtre',
            sbHelp: 'Aide',
            hWhatT: 'Ce qui est comparé',
            hWhatB: "<p>La <b>BAN</b> est le référentiel\u00a0: chaque adresse qu’elle recense devrait exister dans WME, en numéro sur un segment (HN) ou en point résidentiel (RPP).</p><p>Les deux côtés sont lus en direct\u00a0: la BAN sur sa plateforme nationale (adresse.data.gouv.fr), les contours et listes de communes sur geo.api.gouv.fr — qui reçoit le centre de la carte et vos recherches —, et WME sur les mêmes serveurs que l’éditeur. La zone n’a pas besoin d’être affichée ni chargée.</p>",
            hMatchT: 'Quand un numéro est trouvé',
            hMatchB: '<p>Une adresse BAN est trouvée quand WME porte le même numéro (suffixes compris\u00a0: <i>bis</i>, <i>ter</i>, lettres) à moins de 150\u00a0m, et\u00a0:</p><table class="wbc-help-table"><tr><td>1</td><td>sur une voie du même nom (nom principal ou alternatif), ou qui n’en diffère que par un article («\u00a0Avenue Sembrancher\u00a0» = «\u00a0Avenue de Sembrancher\u00a0»\u00a0; l’écart de nom reste signalé)\u00a0;</td></tr><tr><td>2</td><td>ou sur un segment qui porte les adresses de cette voie, <b>nommé ou non</b>\u00a0;</td></tr><tr><td>3</td><td>ou à moins de 30\u00a0m de l\'adresse.</td></tr></table><p>La règle 1 est essayée partout d\'abord, puis la 2, puis la 3. Un numéro WME ne sert qu\'une fois.</p>',
            hNamesT: 'La colonne «\u00a0Voie WME\u00a0»',
            hNamesB: '<table class="wbc-help-table"><tr><td>&#x2713;</td><td>les segments proches des adresses portent le nom de la BAN.</td></tr><tr><td><i>nom</i></td><td>ils portent un autre nom\u00a0: le nom à vérifier.</td></tr><tr><td><i>sans nom</i></td><td>ils ne portent aucun nom.</td></tr><tr><td><i>aucun segment</i></td><td>aucun segment à moins de 80\u00a0m des adresses.</td></tr><tr><td>&#x2713; alt</td><td>le nom de la BAN est porté en nom <b>alternatif</b>\u00a0; le nom principal est affiché à côté.</td></tr><tr><td>n° de route</td><td>le nom principal est un numéro de route et le nom de la BAN manque aux noms alternatifs\u00a0: à ajouter.</td></tr><tr><td>type</td><td>seul le type de voie diffère (Rue / Chemin…).</td></tr><tr><td>article · orthographe · partiel</td><td>noms proches\u00a0: un article, une ou deux lettres, ou une forme abrégée. <i>absente de WME</i>\u00a0: la voie n’existe pas dans WME, le nom montré est celui de la voisine.</td></tr></table><p>Un numéro manquant en orange avec <b>≠</b> existe dans WME avec un autre suffixe (12 b / 12bis)\u00a0: à vérifier.</p><p>&#x26A0; signale un nom de la BAN qu\'aucun segment de la commune ne porte.</p>',
            hLimitsT: 'Bon à savoir',
            hLimitsB: "<p>Un département entier prend quelques minutes\u00a0: la BAN se lit commune par commune, WME par carreaux d’environ 5\u00a0km. Le bouton Arrêter l’interrompt\u00a0; ce qui est fait reste affiché, et les communes en échec se reprennent seules.</p><p>Paris, Marseille et Lyon se lisent arrondissement par arrondissement. Aucun résultat n’est conservé\u00a0: fermer WME les efface. Seules vos préférences (périmètre, interrupteurs, place de la fenêtre, couleurs des points) restent dans le navigateur.</p>",
            hSafeB: "Le script ne modifie la carte que sur demande\u00a0: le bouton «\u00a0Ajouter les numéros\u00a0», réservé aux L6, pose des numéros et ne les enregistre jamais. Il lit WME et la BAN\u00a0; ses résultats restent dans ce navigateur.",
            lnkDiscuss: 'Fil Discuss',
            majBtn: v => 'La version ' + v + ' est disponible',
            majInstall: 'Installer',
            close: 'Fermer',
            dragTip: 'Glisser pour déplacer · double-clic pour la remettre en place',
            modeHere: 'Centre de la carte',
            modeCommune: 'Autre commune',
            modeDep: 'Département',
            modeLbl: 'Périmètre',
            hereHint: 'La commune sous le centre de la carte, prise au lancement de l\'analyse.',
            searchPh: 'Nom, code postal ou code INSEE',
            searchNone: 'Aucune commune trouvée',
            depChoose: 'Choisir un département',
            analyse: 'Analyser',
            stop: 'Arrêter',
            stLocate: 'Recherche de la commune…',
            stBan: 'BAN\u00a0: lecture…',
            stBanMo: mo => 'BAN\u00a0: lecture… ' + mo + '\u00a0Mo',
            stWme: (i, n) => 'WME\u00a0: carreau ' + i + '/' + n,
            stHn: 'WME\u00a0: numéros…',
            stCalc: 'Calcul…',
            stDep: (i, n, nom) => 'Commune ' + i + '/' + n + ' — ' + nom,
            stDone: s => 'Terminé en ' + s + '\u00a0s',
            stStopped: 'Arrêté',
            errNoCommune: 'Aucune commune française sous le centre de la carte.',
            errPick: 'Choisissez d\'abord une commune.',
            errPickDep: 'Choisissez d\'abord un département.',
            errBan: 'La BAN ne recense aucune adresse pour cette commune.',
            errNet: m => 'Erreur réseau\u00a0: ' + m,
            errWme: 'WME n\'a pas répondu\u00a0: ',
            errGrant: 'Le gestionnaire de scripts a refusé l\'appel réseau (vérifiez les autorisations du script).',
            emptyIntro: 'Choisissez un périmètre, puis lancez l\'analyse.',
            kBan: 'Adresses BAN',
            kCert: n => n + (un(n) ? " certifiée" : " certifiées"),
            kWme: 'Trouvées dans WME',
            kHnRpp: (h, r) => h + ' HN · ' + r + ' RPP',
            kMiss: 'Manquantes',
            kExtra: 'En trop dans WME',
            kDup: n => n + (un(n) ? " en double" : " en double"),
            kCov: 'Couverture',
            voiesLine: (c, n) => c + (un(c) ? ' voie complète sur ' : ' voies complètes sur ') + n,
            vNoName: n => n + (un(n) ? " sans nom" : " sans nom"),
            vOtherName: n => n + (un(n) ? " sous un autre nom" : " sous un autre nom"),
            vNoSeg: n => n + (un(n) ? " sans segment" : " sans segment"),
            fAll: 'Toutes',
            fTodo: 'Incomplètes',
            fName: 'Nom à vérifier',
            fDone: 'Complètes',
            filterPh: 'Filtrer les voies',
            layerSwitch: 'Écarts',
            exportCsv: 'Export CSV',
            thStreetBan: 'Voie BAN',
            thStreetWme: 'Voie WME',
            thBan: 'BAN',
            thWme: 'WME',
            thGap: 'Écart',
            thCommune: 'Commune',
            thMiss: 'Manq.',
            nameNone: 'sans nom',
            nameNoSeg: 'aucun segment',
            tipSame: 'Les segments proches portent le nom de la BAN',
            tipOther: 'Les segments proches portent un autre nom',
            tipAbsent: 'Aucun segment de la commune ne porte ce nom',
            missingT: 'Numéros manquants',
            noneMissing: 'Rien ne manque sur cette voie.',
            tipGo: 'Montrer sur la carte',
            extraT: n => 'Numéros WME sans adresse BAN (' + n + ')',
            dupT: n => 'Numéros présents deux fois dans WME (' + n + ')',
            noStreet: 'Aucune voie ne correspond.',
            depBack: 'Retour au département',
            tipHN: 'Numéro sur un segment',
            tipRPP: 'Point résidentiel (RPP)',
            errCommune: 'échec',
            showFound: 'Présentes',
            hovDist: m => 'numéro WME à ' + m + '\u00a0m',
            sbMap: "Carte",
            sbHover: "Fiche au survol",
            sbHoverHint: "Arrêtez le pointeur sur un point de la carte\u00a0: son adresse, son état et sa certification s’affichent.",
            sbColors: "Couleurs",
            sbColorsReset: "Couleurs par défaut",
            legColMap: "Carte des communes",
            tipColMap: "Couleur de la carte du département\u00a0: les 5 teintes en découlent, la plus claire pour les moins couvertes.",
            tipColPoint: "Couleur de ces points sur la carte.",
            hovMissing: "Manquant dans WME",
            hovFound: k => 'Trouvé dans WME (' + k + ')',
            hovExtra: "Numéro WME sans adresse BAN",
            hovCert: "Adresse certifiée par la commune",
            hovNotCert: "Adresse non certifiée par la commune",
            hovWmeStreet: r => 'Voie WME\u00a0: ' + r,
            sizeTip: "Agrandir / rétablir la fenêtre",
            searching: "Recherche…",
            tipAnalyse: "Lancer l’analyse du périmètre choisi. S’il a déjà été balayé, sa date s’affiche d’abord, avec Ouvrir ou Relancer.",
            tipAnalyseCom: c => "Relancer l’analyse de " + c + ", la commune affichée, et mettre à jour sa ligne du département. Pour balayer tout le département, revenez-y d’abord.",
            tipStop: "Arrêter l’analyse en cours. Ce qui est fait reste affiché et gardé.",
            tipModeCommune: "Choisir une commune par son nom, son code postal ou son code INSEE.",
            tipModeDep: "Analyser toutes les communes d’un département.",
            tipFDone: "Les voies dont toutes les adresses BAN sont dans WME.",
            tipFAll: "Toutes les voies de la commune.",
            tipSort: "Trier sur cette colonne\u00a0; un second clic inverse l’ordre.",
            tipDepBack: "Revenir à la liste des communes du département, sans relancer l’analyse.",
            tipCsv: "Télécharger l’état des lieux de la commune, adresse par adresse, en CSV (tableur).",
            tipCsvDep: "Télécharger une ligne par commune du département, en CSV (tableur).",
            tipNext: "Centrer la carte sur le prochain numéro manquant de la voie, puis de la voie incomplète suivante.",
            tipRetry: "Relancer seulement les communes dont l’analyse a échoué.",
            tipCmpStop: "Retirer la comparaison affichée\u00a0; le balayage reste.",
            tipRefresh: "Balayer de nouveau cette commune\u00a0; le nouveau résultat est comparé au précédent.",
            tipRefreshN: "Balayer de nouveau les seules communes signalées (BAN ou WME modifiés depuis)\u00a0; le résultat est comparé au balayage précédent.",
            tipMemoOpen: "Ouvrir la fenêtre sur ce balayage et cadrer la carte dessus.",
            tipMemoClear: "Supprimer tous les balayages gardés dans ce navigateur (en deux clics).",
            tipSbOpen: "Ouvrir la fenêtre de WBC (comme le bouton à droite de la carte).",
            tipColorsReset: "Remettre les couleurs des points par défaut.",
            tipHelpHdr: "Déplier ou replier cette partie de l’aide.",
            tipFab: "Ouvrir ou fermer la fenêtre",
            tipVoie: "Déplier la voie (ses numéros, les manquants en rouge) et cadrer la carte dessus.",
            tipCommune: "Ouvrir le détail de cette commune et cadrer la carte dessus.",
            memoBanBtn: "Vérifier la BAN",
            memoBanTip: "Regarder, commune par commune, si la BAN a changé depuis le balayage (une petite requête chacune). Rien n’est rebalayé.",
            memoBanUpd: "Mises à jour BAN",
            copyBtn: "Copier",
            copyTip: "Copier le taux de couverture dans le presse-papiers, mis en forme pour Discord.",
            copyDone: "Copié",
            copyFail: "Copie impossible",
            copyTitre: lieu => '📊 **Couverture des adresses BAN dans WME — ' + lieu + '**',
            copyAdr: (p, b, c) => 'Adresses trouvées dans WME\u00a0: **' + p + ' / ' + b + ' (' + c + ')**',
            copyCommunes: (n, tot, d) => 'Communes analysées\u00a0: ' + n + '/' + tot + ' · balayage du ' + d,
            copyCert: "adresses certifiées seulement",
            foldTip: "Réduire la fenêtre",
            unfoldTip: "Déplier la fenêtre",
            dejaCommune: d => 'Déjà analysé le ' + d,
            dejaDep: (d, n, total) => 'Déjà analysé le ' + d + ' (' + n + '/' + total + ' communes)',
            dejaViaDep: c => 'avec le département ' + c,
            dejaOpenTip: "Affiche ce balayage tout de suite, sans relancer l’analyse.",
            dejaRelaunch: "Relancer",
            dejaRelaunchTip: "Relance toute l’analyse\u00a0; le balayage gardé sert de référence à la comparaison.",
            lastMissing: "Plus aucun manquant dans le tableau.",
            retryFailed: n => 'Reprendre ' + (un(n) ? 'la commune en échec' : 'les ' + n + ' communes en échec'),
            stDoneErr: (s, n) => 'Terminé en ' + s + '\u00a0s — ' + n + (un(n) ? ' commune en échec' : ' communes en échec'),
            noCert: n => 'Aucune des ' + n + ' adresses BAN de cette commune n’est certifiée.',
            errSession: "Session WME expirée\u00a0: rechargez la page.",
            errFormat: src => src + ' a répondu dans un format inattendu\u00a0: le script est à mettre à jour.',
            delNote: "non rattachables à une commune déléguée",
            mapCap: (a, b) => 'Carte\u00a0: ' + a + ' points montrés sur ' + b + ' dans la vue (zoomez pour tout voir)',
            legExtra: "en trop dans WME",
            legFound: "trouvé",
            legMiss: "manquant",
            eta: m => '≈\u00a0' + m + '\u00a0min restante' + (un(m) ? '' : 's'),
            articleTag: "article",
            tipArticle: "Seul un article diffère (de, la, du…)",
            orthoTag: "orthographe",
            tipOrtho: "L’orthographe diffère d’une ou deux lettres",
            partielTag: "partiel",
            tipPartiel: "Un nom est la forme abrégée de l’autre",
            absentTag: "absente de WME",
            altTag: "alt",
            tipAlt: p => "Le nom de la BAN est porté en nom alternatif\u00a0; nom principal\u00a0: " + p,
            routeTag: "n° de route",
            tipRoute: "Le nom principal est un numéro de route, et le nom de la BAN n’est pas parmi les noms alternatifs",
            typeTag: "type",
            tipType: "Seul le type de voie diffère",
            vAlt: n => n + (un(n) ? " en nom alternatif" : " en nom alternatif"),
            vRoute: n => n + (un(n) ? " sous un numéro de route" : " sous un numéro de route"),
            vType: n => n + (un(n) ? " sous un nom proche" : " sous un nom proche"),
            kSuf: n => 'dont ' + n + (un(n) ? ' suffixe à vérifier' : ' suffixes à vérifier'),
            tipSuf: w => "WME porte " + w + "\u00a0: suffixe à vérifier",
            certOnly: 'Certifiées',
            certNote: n => 'Adresses certifiées seulement\u00a0: ' + n + (un(n) ? ' non certifiée écartée' : ' non certifiées écartées'),
            nextMissing: "Manquant suivant",
            etaSoon: "moins d’une minute restante",
            delAll: "Toutes les communes déléguées",
            depMap: 'Polygones des communes',
            legNoData: 'non analysée',
            hovCom: (ban, wme, miss) => 'BAN ' + ban + ' · WME ' + wme + ' · manquantes ' + miss,
            hovComClick: 'Clic (carte dézoomée) pour l’ouvrir',
            hovProbSeg: (id, d) => 'Segment probable\u00a0: ' + id + ' (' + d + '\u00a0m)',
            selSegs: n => 'Sélectionner les segments (' + n + ')',
            selSegsTip: 'Sélectionne dans WME les segments qui portent les adresses de cette voie',
            selSegsPart: (a, b) => a + '/' + b + ' segments sélectionnés\u00a0: les autres ne sont pas chargés — zoomez sur la voie.',
            selSegsNone: 'Aucun segment de cette voie n’est chargé dans WME\u00a0: zoomez dessus et recommencez.',
            ajHnAdd: n => 'Ajouter les numéros (' + n + ')',
            nextStreet: n => 'Voie suivante (' + n + ' à ajouter)',
            tipNextStreet: 'Ouvre la voie de la commune où «\xa0Ajouter\xa0» a le plus de numéros à poser (nom BAN en principal ou en alternatif), en sautant les voies déjà ouvertes par ce bouton.',
            nextStreetNone: 'Plus aucune voie prête\xa0: celles qui restent ont leurs numéros posés, ou un nom à corriger d’abord.',
            ajHnAddTip: r => 'Réservé aux L6\xa0: pose dans WME les numéros manquants de cette voie, sur les segments dont le nom principal est exactement celui de la BAN (aux accents et à la casse près) et dont la ville est la commune ou «\xa0Village (Commune)\xa0». Au plus 150 numéros par heure glissante, comptés à l’enregistrement (reste ' + r + '). Rien n’est enregistré\xa0: vérifiez, puis enregistrez dans WME. Hors agglomération (nom principal sans ville, nom BAN avec la commune en alternatif), l’adresse devient un POI résidentiel (RPP) — même conversion que le ⚡ de WME Naming Auditor — et compte au quota.',
            ajHnNoName: 'Le nom WME de cette voie n’est pas celui de la BAN\xa0: l’ajout automatique exige un nom principal identique à la BAN.',
            ajHnNone: 'Aucun numéro à ajouter automatiquement sur cette voie.',
            ajHnQuota: h => 'Quota atteint (150 numéros par heure)\xa0: prochain ajout possible à ' + h + '.',
            ajHnRunning: 'Ajout des numéros…',
            bgTab: 'Onglet passé en arrière-plan\xa0: Chrome ralentit le travail en cours (jusqu’à 3 fois plus long). Gardez cet onglet au premier plan.',
            bgTabTip: 'Chrome bride les minuteries d’un onglet caché (une par seconde, puis une par minute après 5 minutes) et baisse sa priorité. Mesuré le 29/09/2026\xa0: un département en 41\xa0min en arrière-plan, contre 13\xa0min au premier plan.',
            ajHnDone: (n, r) => n + (un(n) ? ' numéro posé — vérifiez-le' : ' numéros posés — vérifiez-les') + ', puis enregistrez dans WME. Reste au quota\xa0: ' + r + '.',
            ajHnAddMix: (n, r) => 'Ajouter (' + n + ' numéros · ' + r + ' RPP)',
            ajHnDoneMix: (n, r, q) => n + (un(n) ? ' numéro' : ' numéros') + ' et ' + r + ' RPP posés — vérifiez-les, puis enregistrez dans WME. Reste au quota\xa0: ' + q + '.',
            ajHnDoneRpp: (r, q) => r + (un(r) ? ' RPP posé — vérifiez-le' : ' RPP posés — vérifiez-les') + ', puis enregistrez dans WME. Reste au quota\xa0: ' + q + '.',
            ajRppCrit: l => '⚠️ À reprendre à la main\xa0: ' + l + '.',
            ajRppCritHn: n => 'numéro ' + n + ' resté en numéro de rue sur un segment hors agglomération',
            ajRppCritPoi: n => 'RPP ' + n + ' resté sans adresse',
            ajRppCritDbl: n => 'adresse ' + n + ' en DOUBLE (numéro + RPP)',
            ajHnSansAlt: (r, c) => 'Des segments hors agglomération portent «\xa0' + r + '\xa0» sans ville mais n’ont pas l’alternatif «\xa0' + r + ' / ' + c + '\xa0»\xa0: aucun RPP n’y est posé tant qu’il manque.',
            ajHnSansAltRoute: (r, c) => 'Des segments hors agglomération ont un numéro de route pour nom principal, sans ville, mais pas l’alternatif «\xa0' + r + ' / ' + c + '\xa0»\xa0: aucun RPP n’y est posé tant qu’il manque.',
            ajHnSkip: n => n + (un(n) ? ' adresse écartée' : ' adresses écartées') + ' (détail dans la console).',
            ajHnNoSeg: 'Aucun segment chargé ne porte exactement ce nom en nom principal avec la commune pour ville\xa0: rien n’a été posé.',
            ajHnErr: m => 'Ajout interrompu\xa0: ' + m,
            ajHnRights: 'Réservé aux éditeurs L6.',
            ajHnSee: n => un(n) ? 'Il est entouré en turquoise sur la carte.' : 'Ils sont entourés en turquoise sur la carte.',
            ajHnPoseTip: 'Posé par WBC, pas encore enregistré\xa0: cliquez pour centrer la carte dessus.',
            ajHnSaved: (c, r, q) => 'Enregistrement\xa0: ' + c + (un(c) ? ' numéro compté' : ' numéros comptés') + ', ' + r + ' rendu(s) au quota (retirés avant l’enregistrement). Reste au quota\xa0: ' + q + '.',
            ajHnSavedTip: 'Posé par WBC et enregistré.',
            hHnT: 'Ajouter les numéros (L6)',
            hHnB: '<p>Réservé aux éditeurs <b>L6</b>. Dans la ligne dépliée d’une voie, <i>Ajouter les numéros</i> pose dans WME ses adresses manquantes — <b>voie par voie</b>, jamais pour toute la commune. Pour un seul numéro\u00a0: le «\u00a0+\u00a0» de sa pastille (au survol), ou un clic sur son point de la carte.</p><p><b>Conditions</b>\u00a0: le nom principal des segments est exactement celui de la BAN (seuls les accents, la casse, les apostrophes et les espaces sont tolérés) et leur ville est la commune ou «\u00a0Village (Commune)\u00a0». Chaque numéro va au segment admis le plus proche (80\u00a0m au plus)\u00a0; un numéro déjà présent, même en attente, n’est jamais reposé\u00a0; un suffixe différent ou chiffré est laissé à l’éditeur.</p><p><b>Rien n’est enregistré</b>\u00a0: les numéros posés sont entourés en turquoise sur la carte (même fenêtre fermée) et marqués ✚ dans la voie\u00a0; relisez-les, puis enregistrez ou annulez avec WME.</p><p><b>Quota</b>\u00a0: 150 numéros par heure glissante. Un numéro est réservé à l’ajout, puis compté s’il se retrouve sur le serveur après l’enregistrement\u00a0; retiré ou modifié avant, il est rendu. Les numéros saisis à la main ne comptent jamais. Une fois enregistrés, ils passent en «\u00a0trouvés\u00a0» sans relancer l’analyse\u00a0; un balayage gardé plus ancien le signale («\u00a0relancez\u00a0»).</p><p><b>Hors agglomération</b>\u00a0: sur un segment dont le nom principal n’a pas de ville et qui porte le nom BAN avec la commune en alternatif, l’adresse devient un <b>POI résidentiel (RPP)</b> — même conversion que le ⚡ de WME Naming Auditor\u00a0: POI créé à la place du numéro, son adresse, le point d’entrée du numéro repris, numéro retiré\u00a0; une étape qui échoue est défaite. Le bouton donne alors les deux comptes, numéros et RPP\u00a0; les RPP comptent au quota.</p>',
            ajHnQuotaTip: 'Heure glissante\u00a0: un numéro compte pendant une heure à partir de son ajout. Seuls les numéros posés par ce bouton et réellement enregistrés sont comptés.',
            ajHnLeft: n => 'Quota\xa0: ' + n + (un(n) ? ' restant' : ' restants') + ' dans l’heure',
            ajHnFull: h => 'Quota atteint — prochain ajout à ' + h,
            ajHn1: 'Ajouter ce numéro',
            ajHn1Tip: 'Réservé aux L6\xa0: pose ce seul numéro dans WME, avec les contrôles d’«\xa0Ajouter les numéros\xa0» (nom BAN, ville, segment à moins de 80\xa0m)\xa0; il compte au quota. Rien n’est enregistré.',
            ajHn1Exists: n => 'Le ' + n + ' est déjà dans WME sur cette voie\xa0: rien n’est posé.',
            ajHn1Far: n => 'Aucun segment admis (nom BAN, bonne ville) à moins de 80\xa0m du ' + n + '\xa0: rien n’est posé.',
            tipGoAdd: 'Montrer sur la carte. Au survol, «\xa0+\xa0» ajoute ce seul numéro.',
            cmpBtn: 'Comparer',
            cmpTip: 'Charger un CSV exporté plus tôt pour la même commune ou le même département\u00a0: l’avancement depuis s’affiche.',
            cmpLine: (d, w, m, x) => 'Depuis l’export du ' + d + '\u00a0: ' + w + ' dans WME · ' + m + ' manquantes · ' + x + ' en trop',
            cmpStop: 'Arrêter la comparaison',
            cmpWrong: 'Cet export porte sur une autre commune ou un autre département.',
            cmpBad: 'Ce fichier n’est pas un export de WME BAN Coverage.',
            cmpCert: 'L’export n’avait pas le même réglage «\u00a0certifiées seulement\u00a0»\u00a0: les chiffres ne se comparent pas.',
            thDelta: 'Δ',
            thDeltaTip: d => 'Écart dans WME depuis l’export du ' + d,
            namesCsv: 'Écarts (CSV)',
            namesCsvTip: 'Les voies dont le nom WME diffère de la BAN, avec leurs segments et un lien WME\u00a0: à corriger ou à signaler.',
            namesNone: 'Aucun écart de nom à exporter.',
            hTrackT: 'Suivre et signaler',
            hTrackB: '<p><b>Carte du département</b>\u00a0: après un département, chaque commune est colorée selon sa couverture (clair = peu, foncé = beaucoup). Le survol donne ses chiffres\u00a0; carte dézoomée, un clic l’ouvre.</p><p><b>Numéro manquant</b>\u00a0: voie ouverte, un pointillé mène au segment qui devrait probablement le porter\u00a0; son identifiant est dans le CSV.</p><p><b>Sélectionner les segments</b> d’une voie depuis sa ligne\u00a0: ils sont sélectionnés dans WME.</p><p><b>Avancement</b>\u00a0: l’export CSV sert aussi de relevé. Plus tard, <i>Comparer</i> le relit et donne l’écart voie par voie (ou commune par commune). Rien n’est gardé ailleurs.</p><p><b>Écarts (CSV)</b>\u00a0: les voies à renommer, chacune avec un lien WME, à corriger ou à transmettre aux responsables de la zone.</p>',
            certOnlyTip: "Adresses certifiées seulement",
            layerSwitchTip: "Manquants et en trop sur la carte",
            showFoundTip: "Afficher aussi les trouvés",
            depMapTip: 'Communes colorées sur la carte',
            etaShort: m => '\u2248\u00a0' + m + '\u00a0min',
            memoSweep: d => 'Balayage du ' + d,
            memoBanWait: 'BAN\u00a0: vérification…',
            memoBanProg: (i, n) => 'BAN\u00a0: vérification ' + i + '/' + n,
            memoBanOk: 'BAN inchangée',
            memoBanMaj: d => 'BAN mise à jour' + (d ? ' (' + d + ')' : ''),
            memoBanMajN: n => 'BAN mise à jour\u00a0: ' + n,
            memoBanErr: 'BAN\u00a0: vérification impossible',
            dejaHnDepuis: n => n + (un(n) ? ' numéro ajouté par WBC depuis\xa0: relancez' : ' numéros ajoutés par WBC depuis\xa0: relancez'),
            memoWmeBtn: 'Vérifier WME',
            memoWmeTip: 'Relit la zone, numéros compris, et la compare au balayage\u00a0: segments (nombre et date), chaque numéro (identifiant, valeur, segment, position) et points résidentiels.',
            memoWmeProg: (i, n) => 'WME\u00a0: vérification ' + i + '/' + n,
            memoWmeOk: 'WME inchangé',
            memoWmeMaj: d => 'WME modifié' + (d ? ' (' + d + ')' : ''),
            memoWmeMajN: n => 'WME modifié\u00a0: ' + n,
            memoRefresh: 'Rafraîchir',
            memoRefreshN: n => 'Rafraîchir les signalées (' + n + ')',
            memoTagBan: 'BAN mise à jour depuis le balayage',
            memoTagWme: 'WME modifié depuis le balayage',
            cmpLineMemo: (d, w, m, x) => 'Depuis le balayage du ' + d + '\u00a0: ' + w + ' dans WME · ' + m + ' manquantes · ' + x + ' en trop',
            secMemo: 'Balayages gardés',
            memoHint: 'Conservés dans ce navigateur seulement. En rouvrir un l’affiche tout de suite et vérifie si la BAN a changé depuis.',
            memoNone: 'Aucun balayage gardé pour l’instant.',
            memoOpen: 'Ouvrir',
            memoDel: 'Supprimer ce balayage',
            memoClear: 'Tout supprimer',
            memoErr: m => 'Le balayage n’a pas pu être gardé\u00a0: ' + m,
            hMemoT: 'Balayages gardés et mises à jour',
            hMemoB: '<p>Chaque balayage est gardé dans ce navigateur (rien n’est envoyé nulle part). Choisir de nouveau la même commune ou le même département, ou <i>Ouvrir</i> dans l’onglet Scripts, l’affiche tout de suite avec sa date. <i>Analyser</i> le rappelle aussi\u00a0: si le même périmètre a déjà été balayé, sa date s’affiche avec <i>Ouvrir</i> et <i>Relancer</i>. Si WBC a ajouté des numéros dans ce périmètre depuis, le bandeau le dit et <i>Relancer</i> devient le bouton principal.</p><p><b>BAN</b>\u00a0: le fichier d’adresses de chaque commune est comparé à celui du balayage — d’office pour une commune (une requête), avec <i>Vérifier la BAN</i> pour un département (une requête par commune\u00a0; rien n’est rebalayé). <b>WME</b>\u00a0: <i>Vérifier WME</i> relit la zone, numéros compris\u00a0: segments (nombre et date), chaque numéro (identifiant, valeur, segment, position — les numéros n’ont pas de date dans WME, et en ajouter un ne change pas la date de son segment) et points résidentiels.</p><p>Les communes signalées portent une étiquette BAN ou WME et un contour orange sur la carte\u00a0; <i>Rafraîchir</i> ne rebalaie qu’elles. Le nouveau balayage est comparé d’office au précédent.</p>',
            memoClearSure: 'Cliquer encore pour tout supprimer',
        },
        de: {
            sbHint: 'Vergleicht die nationale Adressdatenbank (BAN) mit den Hausnummern und Wohnorten (RPP) im WME, für eine Gemeinde oder ein ganzes Département.',
            sbOpen: 'Fenster öffnen',
            sbHelp: 'Hilfe',
            hWhatT: 'Was verglichen wird',
            hWhatB: "<p>Die <b>BAN</b> ist die Referenz: jede Adresse, die sie aufführt, sollte im WME vorhanden sein, als Hausnummer an einem Segment (HN) oder als Wohnort (RPP).</p><p>Beide Seiten werden live gelesen: die BAN von ihrer nationalen Plattform (adresse.data.gouv.fr), Gemeindegrenzen und -listen von geo.api.gouv.fr — das die Kartenmitte und Ihre Suchen erhält — und das WME von denselben Servern wie der Editor. Der Bereich muss weder angezeigt noch geladen sein.</p>",
            hMatchT: 'Wann eine Nummer gefunden ist',
            hMatchB: '<p>Eine BAN-Adresse gilt als gefunden, wenn das WME dieselbe Nummer (mit Zusätzen: <i>bis</i>, <i>ter</i>, Buchstaben) in weniger als 150 m trägt, und zwar:</p><table class="wbc-help-table"><tr><td>1</td><td>an einer Straße mit demselben Namen (Haupt- oder Alternativname) oder einem, der sich nur durch einen Artikel unterscheidet („Avenue Sembrancher“ = „Avenue de Sembrancher“; die Namensabweichung wird weiter gemeldet);</td></tr><tr><td>2</td><td>oder an einem Segment, das die Adressen dieser Straße trägt, <b>mit oder ohne Namen</b>;</td></tr><tr><td>3</td><td>oder weniger als 30 m von der Adresse entfernt.</td></tr></table><p>Regel 1 wird überall zuerst versucht, dann 2, dann 3. Eine WME-Nummer zählt nur einmal.</p>',
            hNamesT: 'Die Spalte „WME-Straße“',
            hNamesB: '<table class="wbc-help-table"><tr><td>&#x2713;</td><td>die Segmente bei den Adressen tragen den BAN-Namen.</td></tr><tr><td><i>Name</i></td><td>sie tragen einen anderen Namen: zu prüfen.</td></tr><tr><td><i>ohne Namen</i></td><td>sie tragen keinen Namen.</td></tr><tr><td><i>kein Segment</i></td><td>kein Segment näher als 80 m an den Adressen.</td></tr><tr><td>&#x2713; alt</td><td>der BAN-Name steht als <b>Alternativname</b>; der Hauptname steht daneben.</td></tr><tr><td>Straßennr.</td><td>der Hauptname ist eine Straßennummer und der BAN-Name fehlt bei den Alternativnamen: ergänzen.</td></tr><tr><td>Typ</td><td>nur der Straßentyp unterscheidet sich (Rue / Chemin…).</td></tr><tr><td>Artikel · Schreibung · gekürzt</td><td>ähnliche Namen: ein Artikel, ein, zwei Buchstaben oder eine Kurzform. <i>fehlt im WME</i>: die Straße fehlt, der gezeigte Name ist der der Nachbarstraße.</td></tr></table><p>Eine fehlende Nummer in Orange mit <b>≠</b> steht im WME mit anderem Zusatz (12 b / 12bis): prüfen.</p><p>&#x26A0; markiert einen BAN-Namen, den kein Segment der Gemeinde trägt.</p>',
            hLimitsT: 'Gut zu wissen',
            hLimitsB: "<p>Ein ganzes Département dauert einige Minuten: die BAN wird Gemeinde für Gemeinde gelesen, das WME in Kacheln von etwa 5 km. Die Schaltfläche Anhalten unterbricht; das Erledigte bleibt sichtbar, und fehlgeschlagene Gemeinden lassen sich einzeln wiederholen.</p><p>Paris, Marseille und Lyon werden Bezirk für Bezirk gelesen. Kein Ergebnis wird gespeichert: das Schließen des WME löscht sie. Nur Ihre Einstellungen (Bereich, Schalter, Fensterposition, Punktfarben) bleiben im Browser.</p>",
            hSafeB: "Das Skript ändert die Karte nur auf Anforderung: die Schaltfläche „Hausnummern hinzufügen“, L6 vorbehalten, setzt Nummern und speichert sie nie. Es liest WME und BAN; seine Ergebnisse bleiben in diesem Browser.",
            lnkDiscuss: 'Discuss-Thread',
            majBtn: v => 'Version ' + v + ' ist verfügbar',
            majInstall: 'Installieren',
            close: 'Schließen',
            dragTip: 'Ziehen zum Verschieben · Doppelklick setzt es zurück',
            modeHere: 'Kartenmitte',
            modeCommune: 'Andere Gemeinde',
            modeDep: 'Département',
            modeLbl: 'Bereich',
            hereHint: 'Die Gemeinde unter der Kartenmitte, beim Start der Analyse ermittelt.',
            searchPh: 'Name, Postleitzahl oder INSEE-Code',
            searchNone: 'Keine Gemeinde gefunden',
            depChoose: 'Département wählen',
            analyse: 'Analysieren',
            stop: 'Anhalten',
            stLocate: 'Gemeinde wird gesucht…',
            stBan: 'BAN: wird gelesen…',
            stBanMo: mo => 'BAN: wird gelesen… ' + mo + ' MB',
            stWme: (i, n) => 'WME: Kachel ' + i + '/' + n,
            stHn: 'WME: Hausnummern…',
            stCalc: 'Berechnung…',
            stDep: (i, n, nom) => 'Gemeinde ' + i + '/' + n + ' — ' + nom,
            stDone: s => 'Fertig in ' + s + ' s',
            stStopped: 'Angehalten',
            errNoCommune: 'Keine französische Gemeinde unter der Kartenmitte.',
            errPick: 'Zuerst eine Gemeinde wählen.',
            errPickDep: 'Zuerst ein Département wählen.',
            errBan: 'Die BAN führt für diese Gemeinde keine Adresse.',
            errNet: m => 'Netzwerkfehler: ' + m,
            errWme: 'Das WME hat nicht geantwortet: ',
            errGrant: 'Der Skriptmanager hat die Netzwerkanfrage abgelehnt (Berechtigungen des Skripts prüfen).',
            emptyIntro: 'Bereich wählen, dann die Analyse starten.',
            kBan: 'BAN-Adressen',
            kCert: n => n + (un1(n) ? " zertifiziert" : " zertifiziert"),
            kWme: 'Im WME gefunden',
            kHnRpp: (h, r) => h + ' HN · ' + r + ' RPP',
            kMiss: 'Fehlend',
            kExtra: 'Zu viel im WME',
            kDup: n => n + (un1(n) ? " doppelt" : " doppelt"),
            kCov: 'Abdeckung',
            voiesLine: (c, n) => c + (un1(c) ? ' vollständige Straße von ' : ' vollständige Straßen von ') + n,
            vNoName: n => n + (un1(n) ? " ohne Namen" : " ohne Namen"),
            vOtherName: n => n + (un1(n) ? " mit anderem Namen" : " mit anderem Namen"),
            vNoSeg: n => n + (un1(n) ? " ohne Segment" : " ohne Segment"),
            fAll: 'Alle',
            fTodo: 'Unvollständig',
            fName: 'Name prüfen',
            fDone: 'Vollständig',
            filterPh: 'Straßen filtern',
            layerSwitch: 'Abweichungen',
            exportCsv: 'CSV-Export',
            thStreetBan: 'BAN-Straße',
            thStreetWme: 'WME-Straße',
            thBan: 'BAN',
            thWme: 'WME',
            thGap: 'Lücke',
            thCommune: 'Gemeinde',
            thMiss: 'Fehlt',
            nameNone: 'ohne Namen',
            nameNoSeg: 'kein Segment',
            tipSame: 'Die nahen Segmente tragen den BAN-Namen',
            tipOther: 'Die nahen Segmente tragen einen anderen Namen',
            tipAbsent: 'Kein Segment der Gemeinde trägt diesen Namen',
            missingT: 'Fehlende Nummern',
            noneMissing: 'In dieser Straße fehlt nichts.',
            tipGo: 'Auf der Karte zeigen',
            extraT: n => 'WME-Nummern ohne BAN-Adresse (' + n + ')',
            dupT: n => 'Im WME doppelt vorhandene Nummern (' + n + ')',
            noStreet: 'Keine Straße entspricht.',
            depBack: 'Zurück zum Département',
            tipHN: 'Hausnummer an einem Segment',
            tipRPP: 'Wohnort (RPP)',
            errCommune: 'fehlgeschlagen',
            showFound: 'Vorhanden',
            hovDist: m => 'WME-Nummer in ' + m + ' m',
            sbMap: "Karte",
            sbHover: "Details beim Überfahren",
            sbHoverHint: "Den Zeiger auf einem Kartenpunkt ruhen lassen: Adresse, Zustand und Zertifizierung erscheinen.",
            sbColors: "Farben",
            sbColorsReset: "Standardfarben",
            legColMap: "Gemeindekarte",
            tipColMap: "Farbe der Départementkarte: die 5 Farbtöne leiten sich davon ab, der hellste für die am wenigsten abgedeckten.",
            tipColPoint: "Farbe dieser Punkte auf der Karte.",
            hovMissing: "Fehlt im WME",
            hovFound: k => 'Im WME gefunden (' + k + ')',
            hovExtra: "WME-Nummer ohne BAN-Adresse",
            hovCert: "Von der Gemeinde zertifizierte Adresse",
            hovNotCert: "Nicht von der Gemeinde zertifizierte Adresse",
            hovWmeStreet: r => 'WME-Straße: ' + r,
            sizeTip: "Fenster vergrößern / wiederherstellen",
            searching: "Suche…",
            tipAnalyse: "Den gewählten Bereich analysieren. Wurde er schon durchlaufen, erscheint zuerst sein Datum, mit Öffnen oder Neu starten.",
            tipAnalyseCom: c => c + " erneut analysieren (angezeigte Gemeinde) und ihre Zeile im Département aktualisieren. Für das ganze Département zuerst dorthin zurückkehren.",
            tipStop: "Die laufende Analyse stoppen. Bereits Erledigtes bleibt angezeigt und gespeichert.",
            tipModeCommune: "Eine Gemeinde über Name, Postleitzahl oder INSEE-Code wählen.",
            tipModeDep: "Alle Gemeinden eines Départements analysieren.",
            tipFDone: "Straßen, deren BAN-Adressen alle in WME sind.",
            tipFAll: "Alle Straßen der Gemeinde.",
            tipSort: "Nach dieser Spalte sortieren; ein zweiter Klick kehrt die Reihenfolge um.",
            tipDepBack: "Zurück zur Gemeindeliste des Départements, ohne neue Analyse.",
            tipCsv: "Den Bericht der Gemeinde, Adresse für Adresse, als CSV (Tabelle) herunterladen.",
            tipCsvDep: "Eine Zeile pro Gemeinde des Départements als CSV (Tabelle) herunterladen.",
            tipNext: "Die Karte auf die nächste fehlende Nummer der Straße zentrieren, danach der nächsten unvollständigen Straße.",
            tipRetry: "Nur die Gemeinden neu starten, deren Analyse fehlgeschlagen ist.",
            tipCmpStop: "Den angezeigten Vergleich entfernen; der Durchlauf bleibt.",
            tipRefresh: "Diese Gemeinde erneut durchlaufen; das neue Ergebnis wird mit dem vorigen verglichen.",
            tipRefreshN: "Nur die markierten Gemeinden erneut durchlaufen (BAN oder WME seitdem geändert); verglichen mit dem vorigen Durchlauf.",
            tipMemoOpen: "Das Fenster mit diesem Durchlauf öffnen und die Karte darauf ausrichten.",
            tipMemoClear: "Alle in diesem Browser gespeicherten Durchläufe löschen (zwei Klicks).",
            tipSbOpen: "Das WBC-Fenster öffnen (wie der Knopf rechts an der Karte).",
            tipColorsReset: "Die Punktfarben auf die Standardwerte zurücksetzen.",
            tipHelpHdr: "Diesen Teil der Hilfe auf- oder zuklappen.",
            tipFab: "Fenster öffnen oder schließen",
            tipVoie: "Die Straße aufklappen (ihre Nummern, fehlende in Rot) und die Karte darauf ausrichten.",
            tipCommune: "Die Details dieser Gemeinde öffnen und die Karte darauf ausrichten.",
            memoBanBtn: "BAN prüfen",
            memoBanTip: "Gemeinde für Gemeinde prüfen, ob sich die BAN seit dem Durchlauf geändert hat (je eine kleine Anfrage). Nichts wird neu durchlaufen.",
            memoBanUpd: "BAN-Aktualisierungen",
            copyBtn: "Kopieren",
            copyTip: "Die Abdeckungsrate in die Zwischenablage kopieren, für Discord formatiert.",
            copyDone: "Kopiert",
            copyFail: "Kopieren fehlgeschlagen",
            copyTitre: lieu => '📊 **Abdeckung der BAN-Adressen in WME — ' + lieu + '**',
            copyAdr: (p, b, c) => 'In WME gefundene Adressen: **' + p + ' / ' + b + ' (' + c + ')**',
            copyCommunes: (n, tot, d) => 'Analysierte Gemeinden: ' + n + '/' + tot + ' · Durchlauf vom ' + d,
            copyCert: "nur zertifizierte Adressen",
            foldTip: "Fenster minimieren",
            unfoldTip: "Fenster aufklappen",
            dejaCommune: d => 'Bereits analysiert am ' + d,
            dejaDep: (d, n, total) => 'Bereits analysiert am ' + d + ' (' + n + '/' + total + ' Gemeinden)',
            dejaViaDep: c => 'mit Département ' + c,
            dejaOpenTip: "Zeigt diesen Durchlauf sofort an, ohne die Analyse erneut zu starten.",
            dejaRelaunch: "Neu starten",
            dejaRelaunchTip: "Startet die ganze Analyse erneut; der gespeicherte Durchlauf dient als Vergleichsbasis.",
            lastMissing: "Keine weitere fehlende Nummer in der Tabelle.",
            retryFailed: n => (un1(n) ? 'Fehlgeschlagene Gemeinde' : 'Die ' + n + ' fehlgeschlagenen Gemeinden') + ' erneut versuchen',
            stDoneErr: (s, n) => 'Fertig in ' + s + ' s — ' + n + (un1(n) ? ' Gemeinde fehlgeschlagen' : ' Gemeinden fehlgeschlagen'),
            noCert: n => 'Keine der ' + n + ' BAN-Adressen dieser Gemeinde ist zertifiziert.',
            errSession: "WME-Sitzung abgelaufen: Seite neu laden.",
            errFormat: src => src + ' hat in einem unerwarteten Format geantwortet: das Skript muss aktualisiert werden.',
            delNote: "keinem Ortsteil zuordenbar",
            mapCap: (a, b) => 'Karte: ' + a + ' von ' + b + ' Punkten im Ausschnitt (hineinzoomen, um alle zu sehen)',
            legExtra: "zu viel im WME",
            legFound: "gefunden",
            legMiss: "fehlt",
            eta: m => '≈ ' + m + ' Min. verbleibend',
            certNote: n => 'Nur zertifizierte Adressen: ' + n + (un1(n) ? ' nicht zertifizierte ausgelassen' : ' nicht zertifizierte ausgelassen'),
            articleTag: "Artikel",
            tipArticle: "Nur ein Artikel unterscheidet sich (de, la, du…)",
            orthoTag: "Schreibung",
            tipOrtho: "Die Schreibung weicht um ein, zwei Buchstaben ab",
            partielTag: "gekürzt",
            tipPartiel: "Ein Name ist die Kurzform des anderen",
            absentTag: "fehlt im WME",
            altTag: "alt",
            tipAlt: p => "Der BAN-Name steht als Alternativname; Hauptname: " + p,
            routeTag: "Straßennr.",
            tipRoute: "Der Hauptname ist eine Straßennummer, und der BAN-Name ist nicht unter den Alternativnamen",
            typeTag: "Typ",
            tipType: "Nur der Straßentyp unterscheidet sich",
            vAlt: n => n + (un1(n) ? " als Alternativname" : " als Alternativname"),
            vRoute: n => n + (un1(n) ? " unter einer Straßennummer" : " unter einer Straßennummer"),
            vType: n => n + (un1(n) ? " unter ähnlichem Namen" : " unter ähnlichem Namen"),
            kSuf: n => 'davon ' + n + (un1(n) ? ' Zusatz prüfen' : ' Zusätze prüfen'),
            tipSuf: w => "WME hat " + w + ": Zusatz prüfen",
            certOnly: 'Zertifiziert',
            nextMissing: "Nächste fehlende",
            etaSoon: "weniger als eine Minute",
            delAll: "Alle Ortsteile",
            depMap: 'Gemeindepolygone',
            legNoData: 'nicht analysiert',
            hovCom: (ban, wme, miss) => 'BAN ' + ban + ' · WME ' + wme + ' · fehlend ' + miss,
            hovComClick: 'Klick (herausgezoomt) öffnet sie',
            hovProbSeg: (id, d) => 'Wahrscheinliches Segment: ' + id + ' (' + d + ' m)',
            selSegs: n => 'Segmente auswählen (' + n + ')',
            selSegsTip: 'Wählt im WME die Segmente aus, die die Adressen dieser Straße tragen',
            selSegsPart: (a, b) => a + '/' + b + ' Segmente ausgewählt: die anderen sind nicht geladen — auf die Straße zoomen.',
            selSegsNone: 'Kein Segment dieser Straße ist im WME geladen: hineinzoomen und erneut versuchen.',
            ajHnAdd: n => 'Hausnummern hinzufügen (' + n + ')',
            nextStreet: n => 'Nächste Straße (' + n + ' hinzuzufügen)',
            tipNextStreet: 'Öffnet die Straße der Gemeinde, in der „Hinzufügen“ die meisten Nummern zu setzen hat (BAN-Name als Haupt- oder Alternativname), und überspringt die mit dieser Schaltfläche bereits geöffneten Straßen.',
            nextStreetNone: 'Keine weitere Straße bereit: Die übrigen haben ihre Nummern, oder ihr Name muss zuerst korrigiert werden.',
            ajHnAddTip: r => 'Nur L6: setzt in WME die fehlenden Nummern dieser Straße, auf den Segmenten, deren Hauptname genau der BAN-Name ist (bis auf Akzente und Groß-/Kleinschreibung) und deren Stadt die Gemeinde oder „Ortsteil (Gemeinde)“ ist. Höchstens 150 Nummern pro gleitender Stunde, beim Speichern gezählt (' + r + ' übrig). Nichts wird gespeichert: prüfen, dann in WME speichern. Außerorts (Hauptname ohne Stadt, BAN-Name mit der Gemeinde als Alternativname) wird die Adresse zu einem Wohnort-POI (RPP) — gleiche Umwandlung wie das ⚡ von WME Naming Auditor — und zählt zum Kontingent.',
            ajHnNoName: 'Der WME-Name dieser Straße ist nicht der BAN-Name: automatisches Hinzufügen erfordert einen mit der BAN identischen Hauptnamen.',
            ajHnNone: 'Auf dieser Straße kann keine Nummer automatisch hinzugefügt werden.',
            ajHnQuota: h => 'Kontingent erreicht (150 Nummern pro Stunde): nächstes Hinzufügen um ' + h + ' möglich.',
            ajHnRunning: 'Hausnummern werden hinzugefügt…',
            bgTab: 'Tab im Hintergrund: Chrome verlangsamt die laufende Arbeit (bis zu 3-mal länger). Diesen Tab im Vordergrund lassen.',
            bgTabTip: 'Chrome drosselt die Timer eines verborgenen Tabs (einer pro Sekunde, nach 5 Minuten einer pro Minute) und senkt seine Priorität. Gemessen am 29.09.2026: ein Département 41 Min. im Hintergrund gegen 13 Min. im Vordergrund.',
            ajHnDone: (n, r) => n + (un1(n) ? ' Nummer gesetzt' : ' Nummern gesetzt') + ' — prüfen, dann in WME speichern. Verbleibendes Kontingent: ' + r + '.',
            ajHnAddMix: (n, r) => 'Hinzufügen (' + n + ' Nummern · ' + r + ' RPP)',
            ajHnDoneMix: (n, r, q) => n + (un1(n) ? ' Nummer' : ' Nummern') + ' und ' + r + ' RPP gesetzt — prüfen, dann in WME speichern. Verbleibendes Kontingent: ' + q + '.',
            ajHnDoneRpp: (r, q) => r + ' RPP gesetzt — prüfen, dann in WME speichern. Verbleibendes Kontingent: ' + q + '.',
            ajRppCrit: l => '⚠️ Von Hand zu korrigieren: ' + l + '.',
            ajRppCritHn: n => 'Nummer ' + n + ' als Hausnummer auf einem Segment außerorts geblieben',
            ajRppCritPoi: n => 'RPP ' + n + ' ohne Adresse geblieben',
            ajRppCritDbl: n => 'Adresse ' + n + ' DOPPELT (Hausnummer + RPP)',
            ajHnSansAlt: (r, c) => 'Einige Segmente außerorts tragen „' + r + '“ ohne Stadt, aber ohne den Alternativnamen „' + r + ' / ' + c + '“: dort wird kein RPP gesetzt, solange er fehlt.',
            ajHnSansAltRoute: (r, c) => 'Einige Segmente außerorts haben eine Straßennummer als Hauptnamen, ohne Stadt, aber nicht den Alternativnamen „' + r + ' / ' + c + '“: dort wird kein RPP gesetzt, solange er fehlt.',
            ajHnSkip: n => n + (un1(n) ? ' Adresse übersprungen' : ' Adressen übersprungen') + ' (Details in der Konsole).',
            ajHnNoSeg: 'Kein geladenes Segment trägt genau diesen Namen als Hauptnamen mit der Gemeinde als Stadt: nichts wurde gesetzt.',
            ajHnErr: m => 'Hinzufügen abgebrochen: ' + m,
            ajHnRights: 'Nur für L6-Editoren.',
            ajHnSee: n => (un1(n) ? 'Sie ist' : 'Sie sind') + ' auf der Karte türkis eingekreist.',
            ajHnPoseTip: 'Von WBC gesetzt, noch nicht gespeichert: klicken, um die Karte darauf zu zentrieren.',
            ajHnSaved: (c, r, q) => 'Gespeichert: ' + c + (un1(c) ? ' Nummer gezählt' : ' Nummern gezählt') + ', ' + r + ' dem Kontingent zurückgegeben (vor dem Speichern entfernt). Verbleibendes Kontingent: ' + q + '.',
            ajHnSavedTip: 'Von WBC gesetzt und gespeichert.',
            hHnT: 'Hausnummern hinzufügen (L6)',
            hHnB: '<p>Nur für <b>L6</b>-Editoren. In der aufgeklappten Zeile einer Straße setzt <i>Hausnummern hinzufügen</i> ihre fehlenden Adressen im WME — <b>Straße für Straße</b>, nie für eine ganze Gemeinde. Für eine einzelne Nummer: das „+“ an ihrem Feld (beim Überfahren) oder ein Klick auf ihren Punkt auf der Karte.</p><p><b>Bedingungen</b>: der Hauptname der Segmente ist genau der BAN-Name (nur Akzente, Groß-/Kleinschreibung, Apostrophe und Leerzeichen werden toleriert) und ihre Stadt ist die Gemeinde oder „Ortsteil (Gemeinde)“. Jede Nummer kommt auf das nächste zugelassene Segment (höchstens 80 m); eine schon vorhandene Nummer, auch ungespeichert, wird nie erneut gesetzt; ein abweichender oder numerischer Zusatz bleibt dem Editor überlassen.</p><p><b>Nichts wird gespeichert</b>: gesetzte Nummern sind auf der Karte türkis eingekreist (auch bei geschlossenem Fenster) und in der Straße mit ✚ markiert; prüfen, dann im WME speichern oder rückgängig machen.</p><p><b>Kontingent</b>: 150 Nummern pro gleitender Stunde. Eine Nummer wird beim Setzen reserviert und gezählt, wenn sie nach dem Speichern auf dem Server steht; vorher entfernt oder geändert, wird sie zurückgegeben. Von Hand eingegebene Nummern zählen nie. Gespeichert gelten sie als „gefunden“, ohne neue Analyse; ein älterer gespeicherter Scan weist darauf hin („neu starten“).</p><p><b>Außerorts</b>: Auf einem Segment, dessen Hauptname keine Stadt hat und das den BAN-Namen mit der Gemeinde als Alternativnamen trägt, wird die Adresse zu einem <b>Wohnort-POI (RPP)</b> — gleiche Umwandlung wie das ⚡ von WME Naming Auditor: POI an der Stelle der Nummer, seine Adresse, Einfahrtspunkt der Nummer übernommen, Nummer entfernt; ein fehlgeschlagener Schritt wird rückgängig gemacht. Die Schaltfläche zeigt dann beide Zahlen, Nummern und RPP; RPP zählen zum Kontingent.</p>',
            ajHnQuotaTip: 'Gleitende Stunde: eine Nummer zählt eine Stunde ab dem Setzen. Gezählt werden nur mit dieser Schaltfläche gesetzte und tatsächlich gespeicherte Nummern.',
            ajHnLeft: n => 'Kontingent: ' + n + ' übrig in dieser Stunde',
            ajHnFull: h => 'Kontingent erreicht — nächstes Hinzufügen um ' + h,
            ajHn1: 'Diese Nummer hinzufügen',
            ajHn1Tip: 'Nur L6: setzt nur diese Nummer im WME, mit den Prüfungen von „Hausnummern hinzufügen“ (BAN-Name, Stadt, Segment innerhalb von 80 m); zählt zum Kontingent. Nichts wird gespeichert.',
            ajHn1Exists: n => 'Nummer ' + n + ' ist auf dieser Straße schon im WME: nichts gesetzt.',
            ajHn1Far: n => 'Kein zugelassenes Segment (BAN-Name, richtige Stadt) innerhalb von 80 m um Nummer ' + n + ': nichts gesetzt.',
            tipGoAdd: 'Auf der Karte zeigen. Beim Überfahren fügt „+“ nur diese Nummer hinzu.',
            cmpBtn: 'Vergleichen',
            cmpTip: 'Eine früher exportierte CSV derselben Gemeinde oder desselben Départements laden: der Fortschritt seitdem wird angezeigt.',
            cmpLine: (d, w, m, x) => 'Seit dem Export vom ' + d + ': ' + w + ' im WME · ' + m + ' fehlend · ' + x + ' zu viel',
            cmpStop: 'Vergleich beenden',
            cmpWrong: 'Dieser Export betrifft eine andere Gemeinde oder ein anderes Département.',
            cmpBad: 'Diese Datei ist kein Export von WME BAN Coverage.',
            cmpCert: 'Der Export hatte eine andere Einstellung „nur zertifizierte“: die Zahlen sind nicht vergleichbar.',
            thDelta: 'Δ',
            thDeltaTip: d => 'Änderung im WME seit dem Export vom ' + d,
            namesCsv: 'Abweichungen (CSV)',
            namesCsvTip: 'Die Straßen, deren WME-Name von der BAN abweicht, mit ihren Segmenten und einem WME-Link: zum Korrigieren oder Melden.',
            namesNone: 'Keine Namensabweichung zu exportieren.',
            hTrackT: 'Verfolgen und melden',
            hTrackB: '<p><b>Département-Karte</b>: nach einem Département ist jede Gemeinde nach ihrer Abdeckung eingefärbt (hell = wenig, dunkel = viel). Beim Überfahren erscheinen ihre Zahlen; herausgezoomt öffnet ein Klick sie.</p><p><b>Fehlende Nummer</b>: bei geöffneter Straße führt eine gepunktete Linie zum Segment, das sie wahrscheinlich tragen sollte; seine ID steht in der CSV.</p><p><b>Segmente auswählen</b> einer Straße aus ihrer Zeile: sie werden im WME ausgewählt.</p><p><b>Fortschritt</b>: der CSV-Export dient auch als Stand. Später liest <i>Vergleichen</i> ihn wieder ein und zeigt die Änderung Straße für Straße (oder Gemeinde für Gemeinde). Nichts wird anderswo gespeichert.</p><p><b>Abweichungen (CSV)</b>: die umzubenennenden Straßen, jede mit einem WME-Link, zum Korrigieren oder zur Weitergabe an die Gebietsverantwortlichen.</p>',
            certOnlyTip: "Nur zertifizierte Adressen",
            layerSwitchTip: "Fehlende und überzählige Nummern auf der Karte",
            showFoundTip: "Auch gefundene Adressen zeigen",
            depMapTip: 'Gemeinden farbig auf der Karte',
            etaShort: m => '\u2248\u00a0' + m + '\u00a0min',
            memoSweep: d => 'Durchlauf vom ' + d,
            memoBanWait: 'BAN: Prüfung…',
            memoBanProg: (i, n) => 'BAN: Prüfung ' + i + '/' + n,
            memoBanOk: 'BAN unverändert',
            memoBanMaj: d => 'BAN aktualisiert' + (d ? ' (' + d + ')' : ''),
            memoBanMajN: n => 'BAN aktualisiert: ' + n,
            memoBanErr: 'BAN: Prüfung fehlgeschlagen',
            dejaHnDepuis: n => n + (un1(n) ? ' Nummer seitdem von WBC hinzugefügt: neu starten' : ' Nummern seitdem von WBC hinzugefügt: neu starten'),
            memoWmeBtn: 'WME prüfen',
            memoWmeTip: 'Liest das Gebiet samt Hausnummern neu und vergleicht es mit dem Durchlauf: Segmente (Anzahl und Datum), jede Hausnummer (ID, Wert, Segment, Lage) und Wohnorte.',
            memoWmeProg: (i, n) => 'WME: Prüfung ' + i + '/' + n,
            memoWmeOk: 'WME unverändert',
            memoWmeMaj: d => 'WME bearbeitet' + (d ? ' (' + d + ')' : ''),
            memoWmeMajN: n => 'WME bearbeitet: ' + n,
            memoRefresh: 'Aktualisieren',
            memoRefreshN: n => 'Markierte aktualisieren (' + n + ')',
            memoTagBan: 'BAN seit dem Durchlauf aktualisiert',
            memoTagWme: 'WME seit dem Durchlauf bearbeitet',
            cmpLineMemo: (d, w, m, x) => 'Seit dem Durchlauf vom ' + d + ': ' + w + ' im WME · ' + m + ' fehlend · ' + x + ' zu viel',
            secMemo: 'Gespeicherte Durchläufe',
            memoHint: 'Nur in diesem Browser gespeichert. Beim erneuten Öffnen sofort angezeigt, mit Prüfung, ob sich die BAN seitdem geändert hat.',
            memoNone: 'Noch kein gespeicherter Durchlauf.',
            memoOpen: 'Öffnen',
            memoDel: 'Diesen Durchlauf löschen',
            memoClear: 'Alle löschen',
            memoErr: m => 'Der Durchlauf konnte nicht gespeichert werden: ' + m,
            hMemoT: 'Gespeicherte Durchläufe und Aktualisierungen',
            hMemoB: '<p>Jeder Durchlauf wird in diesem Browser gespeichert (nichts wird verschickt). Dieselbe Gemeinde oder dasselbe Département erneut wählen, oder <i>Öffnen</i> im Skripte-Reiter, zeigt ihn sofort mit Datum. Auch <i>Analysieren</i> erinnert daran: Wurde derselbe Bereich schon durchlaufen, erscheint sein Datum mit <i>Öffnen</i> und <i>Neu starten</i>. Hat WBC seitdem Hausnummern in diesem Bereich hinzugefügt, sagt es das Banner, und <i>Neu starten</i> wird zur Hauptschaltfläche.</p><p><b>BAN</b>: die Adressdatei jeder Gemeinde wird mit der des Durchlaufs verglichen — automatisch für eine Gemeinde (eine Anfrage), mit <i>BAN prüfen</i> für ein Département (eine Anfrage pro Gemeinde; nichts wird neu durchlaufen). <b>WME</b>: <i>WME prüfen</i> liest das Gebiet samt Hausnummern neu: Segmente (Anzahl und Datum), jede Hausnummer (ID, Wert, Segment, Lage — Hausnummern haben im WME kein Datum, und eine neue ändert das Datum ihres Segments nicht) und Wohnorte.</p><p>Markierte Gemeinden tragen ein BAN- oder WME-Etikett und einen orangen Rand auf der Karte; <i>Aktualisieren</i> durchläuft nur sie neu. Der neue Durchlauf wird automatisch mit dem vorigen verglichen.</p>',
            memoClearSure: 'Zum Löschen aller erneut klicken',
        },
        es: {
            sbHint: 'Compara la base nacional de direcciones (BAN) con los números y los puntos residenciales (RPP) de WME, para un municipio o un departamento entero.',
            sbOpen: 'Abrir la ventana',
            sbHelp: 'Ayuda',
            hWhatT: 'Qué se compara',
            hWhatB: "<p>La <b>BAN</b> es la referencia: cada dirección que recoge debería existir en WME, como número en un segmento (HN) o como punto residencial (RPP).</p><p>Ambos lados se leen en directo: la BAN en su plataforma nacional (adresse.data.gouv.fr), los límites y listas de municipios en geo.api.gouv.fr — que recibe el centro del mapa y sus búsquedas — y WME en los mismos servidores que el editor. No hace falta mostrar ni cargar la zona.</p>",
            hMatchT: 'Cuándo se encuentra un número',
            hMatchB: '<p>Una dirección BAN se encuentra cuando WME tiene el mismo número (sufijos incluidos: <i>bis</i>, <i>ter</i>, letras) a menos de 150 m, y:</p><table class="wbc-help-table"><tr><td>1</td><td>en una calle con el mismo nombre (principal o alternativo), o que solo difiere en un artículo («Avenue Sembrancher» = «Avenue de Sembrancher»; la diferencia de nombre se sigue señalando);</td></tr><tr><td>2</td><td>o en un segmento que lleva las direcciones de esa calle, <b>con nombre o sin él</b>;</td></tr><tr><td>3</td><td>o a menos de 30 m de la dirección.</td></tr></table><p>La regla 1 se prueba primero en todas partes, luego la 2, luego la 3. Un número de WME solo sirve una vez.</p>',
            hNamesT: 'La columna «Calle WME»',
            hNamesB: '<table class="wbc-help-table"><tr><td>&#x2713;</td><td>los segmentos cercanos a las direcciones llevan el nombre de la BAN.</td></tr><tr><td><i>nombre</i></td><td>llevan otro nombre: el nombre a revisar.</td></tr><tr><td><i>sin nombre</i></td><td>no llevan ningún nombre.</td></tr><tr><td><i>ningún segmento</i></td><td>ningún segmento a menos de 80 m de las direcciones.</td></tr><tr><td>&#x2713; alt</td><td>el nombre de la BAN figura como nombre <b>alternativo</b>; el nombre principal aparece al lado.</td></tr><tr><td>n.º de carretera</td><td>el nombre principal es un número de carretera y el nombre de la BAN falta en los alternativos: añadirlo.</td></tr><tr><td>tipo</td><td>solo difiere el tipo de vía (Rue / Chemin…).</td></tr><tr><td>artículo · ortografía · parcial</td><td>nombres parecidos: un artículo, una o dos letras, o una forma abreviada. <i>ausente de WME</i>: la calle no existe en WME, el nombre mostrado es el de la vecina.</td></tr></table><p>Un número que falta en naranja con <b>≠</b> existe en WME con otro sufijo (12 b / 12bis): revisar.</p><p>&#x26A0; señala un nombre de la BAN que ningún segmento del municipio lleva.</p>',
            hLimitsT: 'Conviene saber',
            hLimitsB: "<p>Un departamento entero tarda unos minutos: la BAN se lee municipio por municipio, WME en cuadros de unos 5 km. El botón Detener lo interrumpe; lo hecho sigue visible y los municipios con error se pueden reintentar solos.</p><p>París, Marsella y Lyon se leen distrito por distrito. No se guarda ningún resultado: cerrar WME los borra. Solo sus preferencias (ámbito, interruptores, posición de la ventana, colores de los puntos) quedan en el navegador.</p>",
            hSafeB: "El script solo modifica el mapa a petición: el botón «Añadir los números», reservado a los L6, coloca números y nunca los guarda. Lee WME y la BAN; sus resultados se quedan en este navegador.",
            lnkDiscuss: 'Hilo en Discuss',
            majBtn: v => 'La versión ' + v + ' está disponible',
            majInstall: 'Instalar',
            close: 'Cerrar',
            dragTip: 'Arrastrar para mover · doble clic para volver a su sitio',
            modeHere: 'Centro del mapa',
            modeCommune: 'Otro municipio',
            modeDep: 'Departamento',
            modeLbl: 'Ámbito',
            hereHint: 'El municipio bajo el centro del mapa, tomado al iniciar el análisis.',
            searchPh: 'Nombre, código postal o código INSEE',
            searchNone: 'Ningún municipio encontrado',
            depChoose: 'Elegir un departamento',
            analyse: 'Analizar',
            stop: 'Detener',
            stLocate: 'Buscando el municipio…',
            stBan: 'BAN: leyendo…',
            stBanMo: mo => 'BAN: leyendo… ' + mo + ' MB',
            stWme: (i, n) => 'WME: cuadro ' + i + '/' + n,
            stHn: 'WME: números…',
            stCalc: 'Calculando…',
            stDep: (i, n, nom) => 'Municipio ' + i + '/' + n + ' — ' + nom,
            stDone: s => 'Terminado en ' + s + ' s',
            stStopped: 'Detenido',
            errNoCommune: 'Ningún municipio francés bajo el centro del mapa.',
            errPick: 'Elija primero un municipio.',
            errPickDep: 'Elija primero un departamento.',
            errBan: 'La BAN no recoge ninguna dirección para este municipio.',
            errNet: m => 'Error de red: ' + m,
            errWme: 'WME no ha respondido: ',
            errGrant: 'El gestor de scripts rechazó la petición de red (revise los permisos del script).',
            emptyIntro: 'Elija un ámbito y lance el análisis.',
            kBan: 'Direcciones BAN',
            kCert: n => n + (un1(n) ? " certificada" : " certificadas"),
            kWme: 'Encontradas en WME',
            kHnRpp: (h, r) => h + ' HN · ' + r + ' RPP',
            kMiss: 'Faltan',
            kExtra: 'De más en WME',
            kDup: n => n + (un1(n) ? " duplicado" : " duplicados"),
            kCov: 'Cobertura',
            voiesLine: (c, n) => c + (un1(c) ? ' calle completa de ' : ' calles completas de ') + n,
            vNoName: n => n + (un1(n) ? " sin nombre" : " sin nombre"),
            vOtherName: n => n + (un1(n) ? " con otro nombre" : " con otro nombre"),
            vNoSeg: n => n + (un1(n) ? " sin segmento" : " sin segmento"),
            fAll: 'Todas',
            fTodo: 'Incompletas',
            fName: 'Nombre a revisar',
            fDone: 'Completas',
            filterPh: 'Filtrar calles',
            layerSwitch: 'Diferencias',
            exportCsv: 'Exportar CSV',
            thStreetBan: 'Calle BAN',
            thStreetWme: 'Calle WME',
            thBan: 'BAN',
            thWme: 'WME',
            thGap: 'Diferencia',
            thCommune: 'Municipio',
            thMiss: 'Faltan',
            nameNone: 'sin nombre',
            nameNoSeg: 'ningún segmento',
            tipSame: 'Los segmentos cercanos llevan el nombre de la BAN',
            tipOther: 'Los segmentos cercanos llevan otro nombre',
            tipAbsent: 'Ningún segmento del municipio lleva este nombre',
            missingT: 'Números que faltan',
            noneMissing: 'No falta nada en esta calle.',
            tipGo: 'Mostrar en el mapa',
            extraT: n => 'Números de WME sin dirección BAN (' + n + ')',
            dupT: n => 'Números presentes dos veces en WME (' + n + ')',
            noStreet: 'Ninguna calle coincide.',
            depBack: 'Volver al departamento',
            tipHN: 'Número en un segmento',
            tipRPP: 'Punto residencial (RPP)',
            errCommune: 'fallo',
            showFound: 'Presentes',
            hovDist: m => 'número de WME a ' + m + ' m',
            sbMap: "Mapa",
            sbHover: "Ficha al pasar el puntero",
            sbHoverHint: "Detenga el puntero sobre un punto del mapa: aparecen su dirección, su estado y su certificación.",
            sbColors: "Colores",
            sbColorsReset: "Colores por defecto",
            legColMap: "Mapa de municipios",
            tipColMap: "Color del mapa del departamento: de él salen los 5 tonos, el más claro para los menos cubiertos.",
            tipColPoint: "Color de estos puntos en el mapa.",
            hovMissing: "Falta en WME",
            hovFound: k => 'Encontrada en WME (' + k + ')',
            hovExtra: "Número de WME sin dirección BAN",
            hovCert: "Dirección certificada por el municipio",
            hovNotCert: "Dirección no certificada por el municipio",
            hovWmeStreet: r => 'Calle WME: ' + r,
            sizeTip: "Ampliar / restaurar la ventana",
            searching: "Buscando…",
            tipAnalyse: "Analizar la zona elegida. Si ya se analizó, primero se muestra su fecha, con Abrir o Relanzar.",
            tipAnalyseCom: c => "Volver a analizar " + c + ", el municipio mostrado, y actualizar su línea del departamento. Para analizar todo el departamento, vuelva primero a él.",
            tipStop: "Detener el análisis en curso. Lo hecho sigue mostrado y guardado.",
            tipModeCommune: "Elegir un municipio por nombre, código postal o código INSEE.",
            tipModeDep: "Analizar todos los municipios de un departamento.",
            tipFDone: "Las calles cuyas direcciones BAN están todas en WME.",
            tipFAll: "Todas las calles del municipio.",
            tipSort: "Ordenar por esta columna; un segundo clic invierte el orden.",
            tipDepBack: "Volver a la lista de municipios del departamento, sin relanzar el análisis.",
            tipCsv: "Descargar el informe del municipio, dirección por dirección, en CSV (hoja de cálculo).",
            tipCsvDep: "Descargar una fila por municipio del departamento, en CSV (hoja de cálculo).",
            tipNext: "Centrar el mapa en el siguiente número que falta de la calle, y luego de la siguiente calle incompleta.",
            tipRetry: "Relanzar solo los municipios cuyo análisis falló.",
            tipCmpStop: "Quitar la comparación mostrada; el análisis se queda.",
            tipRefresh: "Analizar de nuevo este municipio; el nuevo resultado se compara con el anterior.",
            tipRefreshN: "Analizar de nuevo solo los municipios señalados (BAN o WME cambiados desde entonces); se compara con el análisis anterior.",
            tipMemoOpen: "Abrir la ventana con este análisis y encuadrar el mapa en él.",
            tipMemoClear: "Borrar todos los análisis guardados en este navegador (dos clics).",
            tipSbOpen: "Abrir la ventana de WBC (como el botón a la derecha del mapa).",
            tipColorsReset: "Restablecer los colores de los puntos por defecto.",
            tipHelpHdr: "Desplegar o plegar esta parte de la ayuda.",
            tipFab: "Abrir o cerrar la ventana",
            tipVoie: "Desplegar la calle (sus números, los que faltan en rojo) y encuadrar el mapa en ella.",
            tipCommune: "Abrir el detalle de este municipio y encuadrar el mapa en él.",
            memoBanBtn: "Comprobar la BAN",
            memoBanTip: "Ver, municipio por municipio, si la BAN cambió desde el análisis (una pequeña petición cada uno). No se vuelve a analizar nada.",
            memoBanUpd: "Cambios en la BAN",
            copyBtn: "Copiar",
            copyTip: "Copiar la tasa de cobertura al portapapeles, con formato para Discord.",
            copyDone: "Copiado",
            copyFail: "No se pudo copiar",
            copyTitre: lieu => '📊 **Cobertura de las direcciones BAN en WME — ' + lieu + '**',
            copyAdr: (p, b, c) => 'Direcciones encontradas en WME: **' + p + ' / ' + b + ' (' + c + ')**',
            copyCommunes: (n, tot, d) => 'Municipios analizados: ' + n + '/' + tot + ' · análisis del ' + d,
            copyCert: "solo direcciones certificadas",
            foldTip: "Minimizar la ventana",
            unfoldTip: "Desplegar la ventana",
            dejaCommune: d => 'Ya analizado el ' + d,
            dejaDep: (d, n, total) => 'Ya analizado el ' + d + ' (' + n + '/' + total + ' municipios)',
            dejaViaDep: c => 'con el departamento ' + c,
            dejaOpenTip: "Muestra este análisis al instante, sin volver a lanzarlo.",
            dejaRelaunch: "Relanzar",
            dejaRelaunchTip: "Vuelve a lanzar todo el análisis; el análisis guardado sirve de referencia para la comparación.",
            lastMissing: "No queda ningún número que falte en la tabla.",
            retryFailed: n => 'Reintentar ' + (un1(n) ? 'el municipio con error' : 'los ' + n + ' municipios con error'),
            stDoneErr: (s, n) => 'Terminado en ' + s + ' s — ' + n + (un1(n) ? ' municipio con error' : ' municipios con error'),
            noCert: n => 'Ninguna de las ' + n + ' direcciones BAN de este municipio está certificada.',
            errSession: "Sesión de WME caducada: recargue la página.",
            errFormat: src => src + ' respondió en un formato inesperado: hay que actualizar el script.',
            delNote: "no atribuibles a un municipio delegado",
            mapCap: (a, b) => 'Mapa: ' + a + ' puntos mostrados de ' + b + ' en la vista (acerque el zoom para verlos todos)',
            legExtra: "de más en WME",
            legFound: "encontrado",
            legMiss: "falta",
            eta: m => '≈ ' + m + ' min restante' + (un1(m) ? '' : 's'),
            certNote: n => 'Solo direcciones certificadas: ' + n + (un1(n) ? ' no certificada descartada' : ' no certificadas descartadas'),
            articleTag: "artículo",
            tipArticle: "Solo difiere un artículo (de, la, du…)",
            orthoTag: "ortografía",
            tipOrtho: "La ortografía difiere en una o dos letras",
            partielTag: "parcial",
            tipPartiel: "Un nombre es la forma abreviada del otro",
            absentTag: "ausente de WME",
            altTag: "alt",
            tipAlt: p => "El nombre de la BAN figura como nombre alternativo; nombre principal: " + p,
            routeTag: "n.º de carretera",
            tipRoute: "El nombre principal es un número de carretera, y el nombre de la BAN no está entre los alternativos",
            typeTag: "tipo",
            tipType: "Solo difiere el tipo de vía",
            vAlt: n => n + (un1(n) ? " como nombre alternativo" : " como nombre alternativo"),
            vRoute: n => n + (un1(n) ? " con un número de carretera" : " con un número de carretera"),
            vType: n => n + (un1(n) ? " con un nombre parecido" : " con un nombre parecido"),
            kSuf: n => 'de ellas ' + n + (un1(n) ? ' sufijo a revisar' : ' sufijos a revisar'),
            tipSuf: w => "WME tiene " + w + ": revise el sufijo",
            certOnly: 'Certificadas',
            nextMissing: "Siguiente que falta",
            etaSoon: "menos de un minuto",
            delAll: "Todos los municipios delegados",
            depMap: 'Polígonos de municipios',
            legNoData: 'sin analizar',
            hovCom: (ban, wme, miss) => 'BAN ' + ban + ' · WME ' + wme + ' · faltan ' + miss,
            hovComClick: 'Clic (mapa alejado) para abrirlo',
            hovProbSeg: (id, d) => 'Segmento probable: ' + id + ' (' + d + ' m)',
            selSegs: n => 'Seleccionar los segmentos (' + n + ')',
            selSegsTip: 'Selecciona en WME los segmentos que llevan las direcciones de esta calle',
            selSegsPart: (a, b) => a + '/' + b + ' segmentos seleccionados: los demás no están cargados — acérquese a la calle.',
            selSegsNone: 'Ningún segmento de esta calle está cargado en WME: acérquese y vuelva a intentarlo.',
            ajHnAdd: n => 'Añadir los números (' + n + ')',
            nextStreet: n => 'Calle siguiente (' + n + ' por añadir)',
            tipNextStreet: 'Abre la calle del municipio donde «Añadir» tiene más números por colocar (nombre BAN como principal o alternativo), saltando las calles ya abiertas con este botón.',
            nextStreetNone: 'No queda ninguna calle lista: las restantes ya tienen sus números, o primero hay que corregir su nombre.',
            ajHnAddTip: r => 'Solo L6: coloca en WME los números que faltan en esta calle, en los segmentos cuyo nombre principal es exactamente el de la BAN (salvo acentos y mayúsculas) y cuya ciudad es el municipio o «Pueblo (Municipio)». Como máximo 150 números por hora móvil, contados al guardar (quedan ' + r + '). No se guarda nada: compruébelos y luego guarde en WME. Fuera de poblado (nombre principal sin ciudad, nombre BAN con el municipio como alternativo), la dirección se convierte en un lugar residencial (RPP) — misma conversión que el ⚡ de WME Naming Auditor — y cuenta en la cuota.',
            ajHnNoName: 'El nombre WME de esta calle no es el de la BAN: la adición automática exige un nombre principal idéntico al de la BAN.',
            ajHnNone: 'Ningún número se puede añadir automáticamente en esta calle.',
            ajHnQuota: h => 'Cuota alcanzada (150 números por hora): próxima adición posible a las ' + h + '.',
            ajHnRunning: 'Añadiendo los números…',
            bgTab: 'Pestaña en segundo plano: Chrome ralentiza el trabajo en curso (hasta 3 veces más largo). Mantenga esta pestaña en primer plano.',
            bgTabTip: 'Chrome frena los temporizadores de una pestaña oculta (uno por segundo y, tras 5 minutos, uno por minuto) y baja su prioridad. Medido el 29/09/2026: un departamento en 41 min en segundo plano frente a 13 min en primer plano.',
            ajHnDone: (n, r) => n + (un1(n) ? ' número colocado — compruébelo' : ' números colocados — compruébelos') + ' y luego guarde en WME. Cuota restante: ' + r + '.',
            ajHnAddMix: (n, r) => 'Añadir (' + n + ' números · ' + r + ' RPP)',
            ajHnDoneMix: (n, r, q) => n + (un1(n) ? ' número' : ' números') + ' y ' + r + ' RPP colocados — compruébelos y luego guarde en WME. Cuota restante: ' + q + '.',
            ajHnDoneRpp: (r, q) => r + (un1(r) ? ' RPP colocado — compruébelo' : ' RPP colocados — compruébelos') + ' y luego guarde en WME. Cuota restante: ' + q + '.',
            ajRppCrit: l => '⚠️ A corregir a mano: ' + l + '.',
            ajRppCritHn: n => 'número ' + n + ' quedado como número de portal en un segmento fuera de poblado',
            ajRppCritPoi: n => 'RPP ' + n + ' quedado sin dirección',
            ajRppCritDbl: n => 'dirección ' + n + ' DUPLICADA (número + RPP)',
            ajHnSansAlt: (r, c) => 'Algunos segmentos fuera de poblado llevan «' + r + '» sin ciudad pero no el alternativo «' + r + ' / ' + c + '»: no se coloca ningún RPP mientras falte.',
            ajHnSansAltRoute: (r, c) => 'Algunos segmentos fuera de poblado tienen un número de carretera como nombre principal, sin ciudad, pero no el alternativo «' + r + ' / ' + c + '»: no se coloca ningún RPP mientras falte.',
            ajHnSkip: n => n + (un1(n) ? ' dirección descartada' : ' direcciones descartadas') + ' (detalle en la consola).',
            ajHnNoSeg: 'Ningún segmento cargado lleva exactamente este nombre como nombre principal con el municipio como ciudad: no se ha colocado nada.',
            ajHnErr: m => 'Adición interrumpida: ' + m,
            ajHnRights: 'Reservado a los editores L6.',
            ajHnSee: n => (un1(n) ? 'Aparece rodeado' : 'Aparecen rodeados') + ' en turquesa en el mapa.',
            ajHnPoseTip: 'Colocado por WBC, aún sin guardar: haga clic para centrar el mapa en él.',
            ajHnSaved: (c, r, q) => 'Guardado: ' + c + (un1(c) ? ' número contado' : ' números contados') + ', ' + r + ' devueltos a la cuota (retirados antes de guardar). Cuota restante: ' + q + '.',
            ajHnSavedTip: 'Colocado por WBC y guardado.',
            hHnT: 'Añadir los números (L6)',
            hHnB: '<p>Reservado a los editores <b>L6</b>. En la fila desplegada de una calle, <i>Añadir los números</i> coloca en WME sus direcciones que faltan — <b>calle por calle</b>, nunca para todo el municipio. Para un solo número: el «+» de su etiqueta (al pasar el ratón) o un clic en su punto del mapa.</p><p><b>Condiciones</b>: el nombre principal de los segmentos es exactamente el de la BAN (solo se toleran acentos, mayúsculas, apóstrofos y espacios) y su ciudad es el municipio o «Pueblo (Municipio)». Cada número va al segmento admitido más cercano (80 m como máximo); un número ya presente, incluso pendiente, nunca se vuelve a colocar; un sufijo distinto o numérico se deja al editor.</p><p><b>No se guarda nada</b>: los números colocados aparecen rodeados en turquesa en el mapa (incluso con la ventana cerrada) y marcados con ✚ en la calle; revíselos y luego guarde o deshaga en WME.</p><p><b>Cuota</b>: 150 números por hora móvil. Un número se reserva al colocarlo y se cuenta si aparece en el servidor tras guardar; retirado o modificado antes, se devuelve. Los números escritos a mano nunca cuentan. Una vez guardados, pasan a «encontrados» sin volver a analizar; un análisis guardado más antiguo lo indica («relance»).</p><p><b>Fuera de poblado</b>: en un segmento cuyo nombre principal no tiene ciudad y que lleva el nombre BAN con el municipio como alternativo, la dirección se convierte en un <b>lugar residencial (RPP)</b> — misma conversión que el ⚡ de WME Naming Auditor: lugar creado en el número, su dirección, el punto de entrada del número conservado, número retirado; un paso fallido se deshace. El botón muestra entonces ambos recuentos, números y RPP; los RPP cuentan en la cuota.</p>',
            ajHnQuotaTip: 'Hora móvil: un número cuenta durante una hora desde que se coloca. Solo se cuentan los números colocados con este botón y guardados de verdad.',
            ajHnLeft: n => 'Cuota: ' + n + (un1(n) ? ' restante' : ' restantes') + ' en esta hora',
            ajHnFull: h => 'Cuota alcanzada — próxima adición a las ' + h,
            ajHn1: 'Añadir este número',
            ajHn1Tip: 'Solo L6: coloca solo este número en WME, con los controles de «Añadir los números» (nombre BAN, ciudad, segmento a menos de 80 m); cuenta en la cuota. No se guarda nada.',
            ajHn1Exists: n => 'El número ' + n + ' ya está en WME en esta calle: no se coloca nada.',
            ajHn1Far: n => 'Ningún segmento admitido (nombre BAN, ciudad correcta) a menos de 80 m del número ' + n + ': no se coloca nada.',
            tipGoAdd: 'Mostrar en el mapa. Al pasar el ratón, «+» añade solo este número.',
            cmpBtn: 'Comparar',
            cmpTip: 'Cargar un CSV exportado antes para el mismo municipio o departamento: se muestra el avance desde entonces.',
            cmpLine: (d, w, m, x) => 'Desde la exportación del ' + d + ': ' + w + ' en WME · ' + m + ' faltan · ' + x + ' de más',
            cmpStop: 'Dejar de comparar',
            cmpWrong: 'Esta exportación es de otro municipio o departamento.',
            cmpBad: 'Este archivo no es una exportación de WME BAN Coverage.',
            cmpCert: 'La exportación tenía otro ajuste «solo certificadas»: las cifras no se comparan.',
            thDelta: 'Δ',
            thDeltaTip: d => 'Cambio en WME desde la exportación del ' + d,
            namesCsv: 'Diferencias (CSV)',
            namesCsvTip: 'Las calles cuyo nombre en WME difiere de la BAN, con sus segmentos y un enlace WME: para corregir o señalar.',
            namesNone: 'Ninguna diferencia de nombre que exportar.',
            hTrackT: 'Seguir y señalar',
            hTrackB: '<p><b>Mapa del departamento</b>: tras un departamento, cada municipio se colorea según su cobertura (claro = poca, oscuro = mucha). Al pasar el ratón se ven sus cifras; con el mapa alejado, un clic lo abre.</p><p><b>Número que falta</b>: con la calle abierta, una línea de puntos lleva al segmento que probablemente debería llevarlo; su identificador está en el CSV.</p><p><b>Seleccionar los segmentos</b> de una calle desde su fila: quedan seleccionados en WME.</p><p><b>Avance</b>: la exportación CSV sirve también de registro. Más tarde, <i>Comparar</i> la vuelve a leer y da el cambio calle por calle (o municipio por municipio). No se guarda nada en otro sitio.</p><p><b>Diferencias (CSV)</b>: las calles que renombrar, cada una con un enlace WME, para corregir o enviar a los responsables de la zona.</p>',
            certOnlyTip: "Solo direcciones certificadas",
            layerSwitchTip: "Números que faltan y de más en el mapa",
            showFoundTip: "Mostrar también las encontradas",
            depMapTip: 'Municipios coloreados en el mapa',
            etaShort: m => '\u2248\u00a0' + m + '\u00a0min',
            memoSweep: d => 'Análisis del ' + d,
            memoBanWait: 'BAN: comprobando…',
            memoBanProg: (i, n) => 'BAN: comprobando ' + i + '/' + n,
            memoBanOk: 'BAN sin cambios',
            memoBanMaj: d => 'BAN actualizada' + (d ? ' (' + d + ')' : ''),
            memoBanMajN: n => 'BAN actualizada: ' + n,
            memoBanErr: 'BAN: comprobación imposible',
            dejaHnDepuis: n => n + (un1(n) ? ' número añadido por WBC desde entonces: relance' : ' números añadidos por WBC desde entonces: relance'),
            memoWmeBtn: 'Comprobar WME',
            memoWmeTip: 'Vuelve a leer la zona, números incluidos, y la compara con el análisis: segmentos (número y fecha), cada número (identificador, valor, segmento, posición) y puntos residenciales.',
            memoWmeProg: (i, n) => 'WME: comprobando ' + i + '/' + n,
            memoWmeOk: 'WME sin cambios',
            memoWmeMaj: d => 'WME editado' + (d ? ' (' + d + ')' : ''),
            memoWmeMajN: n => 'WME editado: ' + n,
            memoRefresh: 'Actualizar',
            memoRefreshN: n => 'Actualizar señalados (' + n + ')',
            memoTagBan: 'BAN actualizada desde el análisis',
            memoTagWme: 'WME editado desde el análisis',
            cmpLineMemo: (d, w, m, x) => 'Desde el análisis del ' + d + ': ' + w + ' en WME · ' + m + ' faltan · ' + x + ' de más',
            secMemo: 'Análisis guardados',
            memoHint: 'Guardados solo en este navegador. Al reabrir uno se muestra enseguida y se comprueba si la BAN ha cambiado desde entonces.',
            memoNone: 'Ningún análisis guardado todavía.',
            memoOpen: 'Abrir',
            memoDel: 'Borrar este análisis',
            memoClear: 'Borrar todo',
            memoErr: m => 'No se pudo guardar el análisis: ' + m,
            hMemoT: 'Análisis guardados y actualizaciones',
            hMemoB: '<p>Cada análisis se guarda en este navegador (no se envía nada). Elegir de nuevo el mismo municipio o departamento, o <i>Abrir</i> en la pestaña Scripts, lo muestra enseguida con su fecha. <i>Analizar</i> también lo recuerda: si la misma zona ya se analizó, se muestra su fecha con <i>Abrir</i> y <i>Relanzar</i>. Si WBC ha añadido números en esa zona desde entonces, el aviso lo indica y <i>Relanzar</i> pasa a ser el botón principal.</p><p><b>BAN</b>: el archivo de direcciones de cada municipio se compara con el del análisis — automáticamente para un municipio (una petición), con <i>Comprobar la BAN</i> para un departamento (una petición por municipio; no se vuelve a analizar nada). <b>WME</b>: <i>Comprobar WME</i> vuelve a leer la zona, números incluidos: segmentos (número y fecha), cada número (identificador, valor, segmento, posición — los números no tienen fecha en WME, y añadir uno no cambia la fecha de su segmento) y puntos residenciales.</p><p>Los municipios señalados llevan una etiqueta BAN o WME y un contorno naranja en el mapa; <i>Actualizar</i> solo vuelve a analizar esos. El nuevo análisis se compara automáticamente con el anterior.</p>',
            memoClearSure: 'Pulse otra vez para borrar todo',
        },
        it: {
            sbHint: 'Confronta la base nazionale degli indirizzi (BAN) con i numeri civici e i punti residenziali (RPP) di WME, per un comune o un intero dipartimento.',
            sbOpen: 'Apri la finestra',
            sbHelp: 'Aiuto',
            hWhatT: 'Cosa viene confrontato',
            hWhatB: "<p>La <b>BAN</b> è il riferimento: ogni indirizzo che elenca dovrebbe esistere in WME, come numero su un segmento (HN) o come punto residenziale (RPP).</p><p>Entrambi i lati sono letti dal vivo: la BAN dalla sua piattaforma nazionale (adresse.data.gouv.fr), i confini e gli elenchi dei comuni da geo.api.gouv.fr — che riceve il centro della mappa e le tue ricerche — e WME dagli stessi server dell’editor. La zona non deve essere visualizzata né caricata.</p>",
            hMatchT: 'Quando un numero è trovato',
            hMatchB: '<p>Un indirizzo BAN è trovato quando WME ha lo stesso numero (suffissi compresi: <i>bis</i>, <i>ter</i>, lettere) a meno di 150 m, e:</p><table class="wbc-help-table"><tr><td>1</td><td>su una via con lo stesso nome (principale o alternativo), o che ne differisce solo per un articolo («Avenue Sembrancher» = «Avenue de Sembrancher»; la differenza di nome resta segnalata);</td></tr><tr><td>2</td><td>oppure su un segmento che porta gli indirizzi di questa via, <b>con o senza nome</b>;</td></tr><tr><td>3</td><td>oppure a meno di 30 m dall\'indirizzo.</td></tr></table><p>La regola 1 è provata ovunque per prima, poi la 2, poi la 3. Un numero WME serve una sola volta.</p>',
            hNamesT: 'La colonna «Via WME»',
            hNamesB: '<table class="wbc-help-table"><tr><td>&#x2713;</td><td>i segmenti vicini agli indirizzi portano il nome della BAN.</td></tr><tr><td><i>nome</i></td><td>portano un altro nome: il nome da verificare.</td></tr><tr><td><i>senza nome</i></td><td>non portano alcun nome.</td></tr><tr><td><i>nessun segmento</i></td><td>nessun segmento a meno di 80 m dagli indirizzi.</td></tr><tr><td>&#x2713; alt</td><td>il nome della BAN è un nome <b>alternativo</b>; il nome principale è mostrato accanto.</td></tr><tr><td>n. strada</td><td>il nome principale è un numero di strada e il nome della BAN manca tra gli alternativi: aggiungerlo.</td></tr><tr><td>tipo</td><td>differisce solo il tipo di via (Rue / Chemin…).</td></tr><tr><td>articolo · ortografia · parziale</td><td>nomi simili: un articolo, una o due lettere, o una forma abbreviata. <i>assente in WME</i>: la via non esiste in WME, il nome mostrato è quello della vicina.</td></tr></table><p>Un numero mancante in arancione con <b>≠</b> esiste in WME con un altro suffisso (12 b / 12bis): da verificare.</p><p>&#x26A0; segnala un nome della BAN che nessun segmento del comune porta.</p>',
            hLimitsT: 'Buono a sapersi',
            hLimitsB: "<p>Un intero dipartimento richiede qualche minuto: la BAN si legge comune per comune, WME a riquadri di circa 5 km. Il pulsante Ferma lo interrompe; quanto fatto resta visibile e i comuni in errore si possono riprovare da soli.</p><p>Parigi, Marsiglia e Lione si leggono arrondissement per arrondissement. Nessun risultato viene conservato: chiudere WME li cancella. Solo le tue preferenze (ambito, interruttori, posizione della finestra, colori dei punti) restano nel browser.</p>",
            hSafeB: "Lo script modifica la mappa solo su richiesta: il pulsante «Aggiungi i numeri», riservato agli L6, inserisce numeri e non li salva mai. Legge WME e la BAN; i risultati restano in questo browser.",
            lnkDiscuss: 'Discussione su Discuss',
            majBtn: v => 'La versione ' + v + ' è disponibile',
            majInstall: 'Installa',
            close: 'Chiudi',
            dragTip: 'Trascina per spostare · doppio clic per rimetterla a posto',
            modeHere: 'Centro della mappa',
            modeCommune: 'Altro comune',
            modeDep: 'Dipartimento',
            modeLbl: 'Ambito',
            hereHint: 'Il comune sotto il centro della mappa, preso all\'avvio dell\'analisi.',
            searchPh: 'Nome, CAP o codice INSEE',
            searchNone: 'Nessun comune trovato',
            depChoose: 'Scegli un dipartimento',
            analyse: 'Analizza',
            stop: 'Ferma',
            stLocate: 'Ricerca del comune…',
            stBan: 'BAN: lettura…',
            stBanMo: mo => 'BAN: lettura… ' + mo + ' MB',
            stWme: (i, n) => 'WME: riquadro ' + i + '/' + n,
            stHn: 'WME: numeri…',
            stCalc: 'Calcolo…',
            stDep: (i, n, nom) => 'Comune ' + i + '/' + n + ' — ' + nom,
            stDone: s => 'Fatto in ' + s + ' s',
            stStopped: 'Fermato',
            errNoCommune: 'Nessun comune francese sotto il centro della mappa.',
            errPick: 'Scegli prima un comune.',
            errPickDep: 'Scegli prima un dipartimento.',
            errBan: 'La BAN non elenca alcun indirizzo per questo comune.',
            errNet: m => 'Errore di rete: ' + m,
            errWme: 'WME non ha risposto: ',
            errGrant: 'Il gestore di script ha rifiutato la richiesta di rete (verifica i permessi dello script).',
            emptyIntro: 'Scegli un ambito, poi avvia l\'analisi.',
            kBan: 'Indirizzi BAN',
            kCert: n => n + (un1(n) ? " certificato" : " certificati"),
            kWme: 'Trovati in WME',
            kHnRpp: (h, r) => h + ' HN · ' + r + ' RPP',
            kMiss: 'Mancanti',
            kExtra: 'In più in WME',
            kDup: n => n + (un1(n) ? " doppio" : " doppi"),
            kCov: 'Copertura',
            voiesLine: (c, n) => c + (un1(c) ? ' via completa su ' : ' vie complete su ') + n,
            vNoName: n => n + (un1(n) ? " senza nome" : " senza nome"),
            vOtherName: n => n + (un1(n) ? " con un altro nome" : " con un altro nome"),
            vNoSeg: n => n + (un1(n) ? " senza segmento" : " senza segmento"),
            fAll: 'Tutte',
            fTodo: 'Incomplete',
            fName: 'Nome da verificare',
            fDone: 'Complete',
            filterPh: 'Filtra le vie',
            layerSwitch: 'Scarti',
            exportCsv: 'Esporta CSV',
            thStreetBan: 'Via BAN',
            thStreetWme: 'Via WME',
            thBan: 'BAN',
            thWme: 'WME',
            thGap: 'Scarto',
            thCommune: 'Comune',
            thMiss: 'Manc.',
            nameNone: 'senza nome',
            nameNoSeg: 'nessun segmento',
            tipSame: 'I segmenti vicini portano il nome della BAN',
            tipOther: 'I segmenti vicini portano un altro nome',
            tipAbsent: 'Nessun segmento del comune porta questo nome',
            missingT: 'Numeri mancanti',
            noneMissing: 'Non manca nulla su questa via.',
            tipGo: 'Mostra sulla mappa',
            extraT: n => 'Numeri WME senza indirizzo BAN (' + n + ')',
            dupT: n => 'Numeri presenti due volte in WME (' + n + ')',
            noStreet: 'Nessuna via corrisponde.',
            depBack: 'Torna al dipartimento',
            tipHN: 'Numero civico su un segmento',
            tipRPP: 'Punto residenziale (RPP)',
            errCommune: 'fallito',
            showFound: 'Presenti',
            hovDist: m => 'numero WME a ' + m + ' m',
            sbMap: "Mappa",
            sbHover: "Scheda al passaggio",
            sbHoverHint: "Ferma il puntatore su un punto della mappa: compaiono indirizzo, stato e certificazione.",
            sbColors: "Colori",
            sbColorsReset: "Colori predefiniti",
            legColMap: "Mappa dei comuni",
            tipColMap: "Colore della mappa del dipartimento: ne derivano le 5 tonalità, la più chiara per i meno coperti.",
            tipColPoint: "Colore di questi punti sulla mappa.",
            hovMissing: "Mancante in WME",
            hovFound: k => 'Trovato in WME (' + k + ')',
            hovExtra: "Numero WME senza indirizzo BAN",
            hovCert: "Indirizzo certificato dal comune",
            hovNotCert: "Indirizzo non certificato dal comune",
            hovWmeStreet: r => 'Via WME: ' + r,
            sizeTip: "Ingrandisci / ripristina la finestra",
            searching: "Ricerca…",
            tipAnalyse: "Analizza la zona scelta. Se è già stata scansionata, compare prima la sua data, con Apri o Rilancia.",
            tipAnalyseCom: c => "Rianalizza " + c + ", il comune mostrato, e aggiorna la sua riga nel dipartimento. Per scansionare tutto il dipartimento, tornaci prima.",
            tipStop: "Ferma l’analisi in corso. Quanto fatto resta visibile e salvato.",
            tipModeCommune: "Scegli un comune per nome, CAP o codice INSEE.",
            tipModeDep: "Analizza tutti i comuni di un dipartimento.",
            tipFDone: "Le strade i cui indirizzi BAN sono tutti in WME.",
            tipFAll: "Tutte le strade del comune.",
            tipSort: "Ordina per questa colonna; un secondo clic inverte l’ordine.",
            tipDepBack: "Torna all’elenco dei comuni del dipartimento, senza rilanciare l’analisi.",
            tipCsv: "Scarica il resoconto del comune, indirizzo per indirizzo, in CSV (foglio di calcolo).",
            tipCsvDep: "Scarica una riga per comune del dipartimento, in CSV (foglio di calcolo).",
            tipNext: "Centra la mappa sul prossimo numero mancante della strada, poi della strada incompleta successiva.",
            tipRetry: "Rilancia solo i comuni la cui analisi è fallita.",
            tipCmpStop: "Togli il confronto mostrato; la scansione resta.",
            tipRefresh: "Scansiona di nuovo questo comune; il nuovo risultato è confrontato con il precedente.",
            tipRefreshN: "Scansiona di nuovo solo i comuni segnalati (BAN o WME cambiati da allora); confronto con la scansione precedente.",
            tipMemoOpen: "Apri la finestra su questa scansione e inquadra la mappa.",
            tipMemoClear: "Elimina tutte le scansioni salvate in questo browser (due clic).",
            tipSbOpen: "Apri la finestra di WBC (come il pulsante a destra della mappa).",
            tipColorsReset: "Ripristina i colori predefiniti dei punti.",
            tipHelpHdr: "Espandi o comprimi questa parte dell’aiuto.",
            tipFab: "Apri o chiudi la finestra",
            tipVoie: "Espandi la strada (i suoi numeri, quelli mancanti in rosso) e inquadra la mappa.",
            tipCommune: "Apri il dettaglio di questo comune e inquadra la mappa.",
            memoBanBtn: "Verifica la BAN",
            memoBanTip: "Controlla, comune per comune, se la BAN è cambiata dalla scansione (una piccola richiesta ciascuno). Nulla viene riscansionato.",
            memoBanUpd: "Aggiornamenti BAN",
            copyBtn: "Copia",
            copyTip: "Copia il tasso di copertura negli appunti, formattato per Discord.",
            copyDone: "Copiato",
            copyFail: "Copia non riuscita",
            copyTitre: lieu => '📊 **Copertura degli indirizzi BAN in WME — ' + lieu + '**',
            copyAdr: (p, b, c) => 'Indirizzi trovati in WME: **' + p + ' / ' + b + ' (' + c + ')**',
            copyCommunes: (n, tot, d) => 'Comuni analizzati: ' + n + '/' + tot + ' · scansione del ' + d,
            copyCert: "solo indirizzi certificati",
            foldTip: "Riduci la finestra",
            unfoldTip: "Espandi la finestra",
            dejaCommune: d => 'Già analizzato il ' + d,
            dejaDep: (d, n, total) => 'Già analizzato il ' + d + ' (' + n + '/' + total + ' comuni)',
            dejaViaDep: c => 'con il dipartimento ' + c,
            dejaOpenTip: "Mostra subito questa scansione, senza rilanciare l’analisi.",
            dejaRelaunch: "Rilancia",
            dejaRelaunchTip: "Rilancia l’intera analisi; la scansione salvata fa da riferimento per il confronto.",
            lastMissing: "Nessun altro numero mancante nella tabella.",
            retryFailed: n => 'Riprova ' + (un1(n) ? 'il comune in errore' : 'i ' + n + ' comuni in errore'),
            stDoneErr: (s, n) => 'Fatto in ' + s + ' s — ' + n + (un1(n) ? ' comune in errore' : ' comuni in errore'),
            noCert: n => 'Nessuno dei ' + n + ' indirizzi BAN di questo comune è certificato.',
            errSession: "Sessione WME scaduta: ricarica la pagina.",
            errFormat: src => src + ' ha risposto in un formato inatteso: lo script va aggiornato.',
            delNote: "non attribuibili a un comune delegato",
            mapCap: (a, b) => 'Mappa: ' + a + ' punti mostrati su ' + b + ' nella vista (ingrandisci per vederli tutti)',
            legExtra: "in più in WME",
            legFound: "trovato",
            legMiss: "mancante",
            eta: m => '≈ ' + m + (un1(m) ? ' minuto rimanente' : ' min rimanenti'),
            certNote: n => 'Solo indirizzi certificati: ' + n + (un1(n) ? ' non certificato escluso' : ' non certificati esclusi'),
            articleTag: "articolo",
            tipArticle: "Differisce solo un articolo (de, la, du…)",
            orthoTag: "ortografia",
            tipOrtho: "L’ortografia differisce di una o due lettere",
            partielTag: "parziale",
            tipPartiel: "Un nome è la forma abbreviata dell’altro",
            absentTag: "assente in WME",
            altTag: "alt",
            tipAlt: p => "Il nome della BAN è un nome alternativo; nome principale: " + p,
            routeTag: "n. strada",
            tipRoute: "Il nome principale è un numero di strada, e il nome della BAN non è tra i nomi alternativi",
            typeTag: "tipo",
            tipType: "Differisce solo il tipo di via",
            vAlt: n => n + (un1(n) ? " come nome alternativo" : " come nome alternativo"),
            vRoute: n => n + (un1(n) ? " con un numero di strada" : " con un numero di strada"),
            vType: n => n + (un1(n) ? " con un nome simile" : " con un nome simile"),
            kSuf: n => 'di cui ' + n + (un1(n) ? ' suffisso da verificare' : ' suffissi da verificare'),
            tipSuf: w => "WME ha " + w + ": verificare il suffisso",
            certOnly: 'Certificati',
            nextMissing: "Mancante successivo",
            etaSoon: "meno di un minuto",
            delAll: "Tutti i comuni delegati",
            depMap: 'Poligoni dei comuni',
            legNoData: 'non analizzato',
            hovCom: (ban, wme, miss) => 'BAN ' + ban + ' · WME ' + wme + ' · mancanti ' + miss,
            hovComClick: 'Clic (mappa rimpicciolita) per aprirlo',
            hovProbSeg: (id, d) => 'Segmento probabile: ' + id + ' (' + d + ' m)',
            selSegs: n => 'Seleziona i segmenti (' + n + ')',
            selSegsTip: 'Seleziona in WME i segmenti che portano gli indirizzi di questa via',
            selSegsPart: (a, b) => a + '/' + b + ' segmenti selezionati: gli altri non sono caricati — ingrandisci sulla via.',
            selSegsNone: 'Nessun segmento di questa via è caricato in WME: ingrandisci e riprova.',
            ajHnAdd: n => 'Aggiungi i numeri (' + n + ')',
            nextStreet: n => 'Via successiva (' + n + ' da aggiungere)',
            tipNextStreet: 'Apre la via del comune in cui «Aggiungi» ha più numeri da inserire (nome BAN come principale o alternativo), saltando le vie già aperte con questo pulsante.',
            nextStreetNone: 'Nessun’altra via pronta: le rimanenti hanno già i numeri, o prima va corretto il nome.',
            ajHnAddTip: r => 'Solo L6: inserisce in WME i numeri mancanti di questa via, sui segmenti il cui nome principale è esattamente quello della BAN (a meno di accenti e maiuscole) e la cui città è il comune o «Frazione (Comune)». Al massimo 150 numeri per ora mobile, contati al salvataggio (ne restano ' + r + '). Niente viene salvato: controllali, poi salva in WME. Fuori dal centro abitato (nome principale senza città, nome BAN con il comune come alternativo), l’indirizzo diventa un luogo residenziale (RPP) — stessa conversione del ⚡ di WME Naming Auditor — e conta nella quota.',
            ajHnNoName: 'Il nome WME di questa via non è quello della BAN: l’aggiunta automatica richiede un nome principale identico a quello della BAN.',
            ajHnNone: 'Nessun numero può essere aggiunto automaticamente su questa via.',
            ajHnQuota: h => 'Quota raggiunta (150 numeri all’ora): prossima aggiunta possibile alle ' + h + '.',
            ajHnRunning: 'Aggiunta dei numeri…',
            bgTab: 'Scheda in secondo piano: Chrome rallenta il lavoro in corso (fino a 3 volte più lungo). Tieni questa scheda in primo piano.',
            bgTabTip: 'Chrome rallenta i timer di una scheda nascosta (uno al secondo, poi uno al minuto dopo 5 minuti) e ne abbassa la priorità. Misurato il 29/09/2026: un dipartimento in 41 min in secondo piano contro 13 min in primo piano.',
            ajHnDone: (n, r) => n + (un1(n) ? ' numero inserito — controllalo' : ' numeri inseriti — controllali') + ', poi salva in WME. Quota residua: ' + r + '.',
            ajHnAddMix: (n, r) => 'Aggiungi (' + n + ' numeri · ' + r + ' RPP)',
            ajHnDoneMix: (n, r, q) => n + (un1(n) ? ' numero' : ' numeri') + ' e ' + r + ' RPP inseriti — controllali, poi salva in WME. Quota residua: ' + q + '.',
            ajHnDoneRpp: (r, q) => r + (un1(r) ? ' RPP inserito — controllalo' : ' RPP inseriti — controllali') + ', poi salva in WME. Quota residua: ' + q + '.',
            ajRppCrit: l => '⚠️ Da sistemare a mano: ' + l + '.',
            ajRppCritHn: n => 'numero ' + n + ' rimasto come numero civico su un segmento fuori centro abitato',
            ajRppCritPoi: n => 'RPP ' + n + ' rimasto senza indirizzo',
            ajRppCritDbl: n => 'indirizzo ' + n + ' DOPPIO (numero + RPP)',
            ajHnSansAlt: (r, c) => 'Alcuni segmenti fuori dal centro abitato portano «' + r + '» senza città ma non l’alternativo «' + r + ' / ' + c + '»: nessun RPP viene inserito finché manca.',
            ajHnSansAltRoute: (r, c) => 'Alcuni segmenti fuori dal centro abitato hanno un numero di strada come nome principale, senza città, ma non l’alternativo «' + r + ' / ' + c + '»: nessun RPP vi viene inserito finché manca.',
            ajHnSkip: n => n + (un1(n) ? ' indirizzo scartato' : ' indirizzi scartati') + ' (dettagli nella console).',
            ajHnNoSeg: 'Nessun segmento caricato porta esattamente questo nome come nome principale con il comune come città: non è stato inserito nulla.',
            ajHnErr: m => 'Aggiunta interrotta: ' + m,
            ajHnRights: 'Riservato agli editor L6.',
            ajHnSee: n => (un1(n) ? 'È cerchiato' : 'Sono cerchiati') + ' in turchese sulla mappa.',
            ajHnPoseTip: 'Inserito da WBC, non ancora salvato: clicca per centrare la mappa.',
            ajHnSaved: (c, r, q) => 'Salvataggio: ' + c + (un1(c) ? ' numero contato' : ' numeri contati') + ', ' + r + ' restituiti alla quota (rimossi prima del salvataggio). Quota residua: ' + q + '.',
            ajHnSavedTip: 'Inserito da WBC e salvato.',
            hHnT: 'Aggiungere i numeri (L6)',
            hHnB: '<p>Riservato agli editor <b>L6</b>. Nella riga aperta di una via, <i>Aggiungi i numeri</i> inserisce in WME i suoi indirizzi mancanti — <b>via per via</b>, mai per un intero comune. Per un solo numero: il «+» della sua etichetta (al passaggio del mouse) o un clic sul suo punto sulla mappa.</p><p><b>Condizioni</b>: il nome principale dei segmenti è esattamente quello della BAN (sono tollerati solo accenti, maiuscole, apostrofi e spazi) e la loro città è il comune o «Frazione (Comune)». Ogni numero va al segmento ammesso più vicino (al massimo 80 m); un numero già presente, anche in attesa, non viene mai reinserito; un suffisso diverso o numerico è lasciato all’editor.</p><p><b>Niente viene salvato</b>: i numeri inseriti sono cerchiati in turchese sulla mappa (anche a finestra chiusa) e segnati con ✚ nella via; controllali, poi salva o annulla in WME.</p><p><b>Quota</b>: 150 numeri per ora mobile. Un numero è riservato quando viene inserito e contato se si trova sul server dopo il salvataggio; rimosso o modificato prima, viene restituito. I numeri inseriti a mano non contano mai. Una volta salvati, risultano «trovati» senza rilanciare l’analisi; un’analisi salvata più vecchia lo segnala («rilancia»).</p><p><b>Fuori dal centro abitato</b>: su un segmento il cui nome principale non ha città e che porta il nome BAN con il comune come alternativo, l’indirizzo diventa un <b>luogo residenziale (RPP)</b> — stessa conversione del ⚡ di WME Naming Auditor: luogo creato al posto del numero, il suo indirizzo, il punto d’ingresso del numero ripreso, numero rimosso; un passaggio fallito viene annullato. Il pulsante mostra allora i due conteggi, numeri e RPP; gli RPP contano nella quota.</p>',
            ajHnQuotaTip: 'Ora mobile: un numero conta per un’ora da quando è inserito. Sono contati solo i numeri inseriti con questo pulsante e salvati davvero.',
            ajHnLeft: n => 'Quota: ' + n + ' rimanenti in quest’ora',
            ajHnFull: h => 'Quota raggiunta — prossima aggiunta alle ' + h,
            ajHn1: 'Aggiungi questo numero',
            ajHn1Tip: 'Solo L6: inserisce in WME solo questo numero, con i controlli di «Aggiungi i numeri» (nome BAN, città, segmento entro 80 m); conta nella quota. Niente viene salvato.',
            ajHn1Exists: n => 'Il numero ' + n + ' è già in WME su questa via: niente inserito.',
            ajHn1Far: n => 'Nessun segmento ammesso (nome BAN, città giusta) entro 80 m dal numero ' + n + ': niente inserito.',
            tipGoAdd: 'Mostra sulla mappa. Al passaggio del mouse, «+» aggiunge solo questo numero.',
            cmpBtn: 'Confronta',
            cmpTip: 'Carica un CSV esportato in precedenza per lo stesso comune o dipartimento: si vede l’avanzamento da allora.',
            cmpLine: (d, w, m, x) => 'Dall’esportazione del ' + d + ': ' + w + ' in WME · ' + m + ' mancanti · ' + x + ' in più',
            cmpStop: 'Interrompi il confronto',
            cmpWrong: 'Questa esportazione riguarda un altro comune o dipartimento.',
            cmpBad: 'Questo file non è un’esportazione di WME BAN Coverage.',
            cmpCert: 'L’esportazione aveva un’altra impostazione «solo certificati»: le cifre non sono confrontabili.',
            thDelta: 'Δ',
            thDeltaTip: d => 'Variazione in WME dall’esportazione del ' + d,
            namesCsv: 'Scarti (CSV)',
            namesCsvTip: 'Le vie il cui nome in WME differisce dalla BAN, con i loro segmenti e un link WME: da correggere o segnalare.',
            namesNone: 'Nessuna differenza di nome da esportare.',
            hTrackT: 'Seguire e segnalare',
            hTrackB: '<p><b>Mappa del dipartimento</b>: dopo un dipartimento, ogni comune è colorato secondo la copertura (chiaro = poca, scuro = molta). Al passaggio del mouse compaiono le sue cifre; a mappa rimpicciolita, un clic lo apre.</p><p><b>Numero mancante</b>: con la via aperta, una linea tratteggiata porta al segmento che probabilmente dovrebbe portarlo; il suo identificativo è nel CSV.</p><p><b>Seleziona i segmenti</b> di una via dalla sua riga: vengono selezionati in WME.</p><p><b>Avanzamento</b>: l’esportazione CSV fa anche da rilievo. Più tardi, <i>Confronta</i> la rilegge e dà la variazione via per via (o comune per comune). Nulla viene conservato altrove.</p><p><b>Scarti (CSV)</b>: le vie da rinominare, ciascuna con un link WME, da correggere o inviare ai responsabili della zona.</p>',
            certOnlyTip: "Solo indirizzi certificati",
            layerSwitchTip: "Numeri mancanti e in più sulla mappa",
            showFoundTip: "Mostra anche i trovati",
            depMapTip: 'Comuni colorati sulla mappa',
            etaShort: m => '\u2248\u00a0' + m + '\u00a0min',
            memoSweep: d => 'Scansione del ' + d,
            memoBanWait: 'BAN: verifica…',
            memoBanProg: (i, n) => 'BAN: verifica ' + i + '/' + n,
            memoBanOk: 'BAN invariata',
            memoBanMaj: d => 'BAN aggiornata' + (d ? ' (' + d + ')' : ''),
            memoBanMajN: n => 'BAN aggiornata: ' + n,
            memoBanErr: 'BAN: verifica impossibile',
            dejaHnDepuis: n => n + (un1(n) ? ' numero aggiunto da WBC da allora: rilancia' : ' numeri aggiunti da WBC da allora: rilancia'),
            memoWmeBtn: 'Verifica WME',
            memoWmeTip: 'Rilegge la zona, numeri civici compresi, e la confronta con la scansione: segmenti (numero e data), ogni numero civico (identificativo, valore, segmento, posizione) e punti residenziali.',
            memoWmeProg: (i, n) => 'WME: verifica ' + i + '/' + n,
            memoWmeOk: 'WME invariato',
            memoWmeMaj: d => 'WME modificato' + (d ? ' (' + d + ')' : ''),
            memoWmeMajN: n => 'WME modificato: ' + n,
            memoRefresh: 'Aggiorna',
            memoRefreshN: n => 'Aggiorna i segnalati (' + n + ')',
            memoTagBan: 'BAN aggiornata dopo la scansione',
            memoTagWme: 'WME modificato dopo la scansione',
            cmpLineMemo: (d, w, m, x) => 'Dalla scansione del ' + d + ': ' + w + ' in WME · ' + m + ' mancanti · ' + x + ' in più',
            secMemo: 'Scansioni salvate',
            memoHint: 'Conservate solo in questo browser. Riaprirne una la mostra subito e verifica se la BAN è cambiata da allora.',
            memoNone: 'Nessuna scansione salvata.',
            memoOpen: 'Apri',
            memoDel: 'Elimina questa scansione',
            memoClear: 'Elimina tutto',
            memoErr: m => 'Impossibile salvare la scansione: ' + m,
            hMemoT: 'Scansioni salvate e aggiornamenti',
            hMemoB: '<p>Ogni scansione è conservata in questo browser (non viene inviato nulla). Scegliere di nuovo lo stesso comune o dipartimento, o <i>Apri</i> nella scheda Script, la mostra subito con la sua data. Anche <i>Analizza</i> lo ricorda: se la stessa zona è già stata scansionata, compare la sua data con <i>Apri</i> e <i>Rilancia</i>. Se da allora WBC ha aggiunto numeri in quell’area, l’avviso lo dice e <i>Rilancia</i> diventa il pulsante principale.</p><p><b>BAN</b>: il file degli indirizzi di ogni comune è confrontato con quello della scansione — automaticamente per un comune (una richiesta), con <i>Verifica la BAN</i> per un dipartimento (una richiesta per comune; nulla viene riscansionato). <b>WME</b>: <i>Verifica WME</i> rilegge la zona, numeri civici compresi: segmenti (numero e data), ogni numero civico (identificativo, valore, segmento, posizione — i numeri non hanno data in WME, e aggiungerne uno non cambia la data del suo segmento) e punti residenziali.</p><p>I comuni segnalati portano un’etichetta BAN o WME e un contorno arancione sulla mappa; <i>Aggiorna</i> ripete la scansione solo per loro. La nuova scansione è confrontata automaticamente con la precedente.</p>',
            memoClearSure: 'Clicca di nuovo per eliminare tutto',
        },
        'pt-BR': {
            sbHint: 'Compara a base nacional de endereços (BAN) com os números e os pontos residenciais (RPP) do WME, para um município ou um departamento inteiro.',
            sbOpen: 'Abrir a janela',
            sbHelp: 'Ajuda',
            hWhatT: 'O que é comparado',
            hWhatB: "<p>A <b>BAN</b> é a referência: cada endereço que ela lista deveria existir no WME, como número em um segmento (HN) ou como ponto residencial (RPP).</p><p>Os dois lados são lidos ao vivo: a BAN na sua plataforma nacional (adresse.data.gouv.fr), os limites e listas de municípios no geo.api.gouv.fr — que recebe o centro do mapa e as suas buscas — e o WME nos mesmos servidores do editor. A área não precisa estar exibida nem carregada.</p>",
            hMatchT: 'Quando um número é encontrado',
            hMatchB: '<p>Um endereço da BAN é encontrado quando o WME tem o mesmo número (sufixos incluídos: <i>bis</i>, <i>ter</i>, letras) a menos de 150 m, e:</p><table class="wbc-help-table"><tr><td>1</td><td>em uma rua com o mesmo nome (principal ou alternativo), ou que só difere por um artigo (“Avenue Sembrancher” = “Avenue de Sembrancher”; a diferença de nome continua sinalizada);</td></tr><tr><td>2</td><td>ou em um segmento que leva os endereços dessa rua, <b>com ou sem nome</b>;</td></tr><tr><td>3</td><td>ou a menos de 30 m do endereço.</td></tr></table><p>A regra 1 é tentada primeiro em todo lugar, depois a 2, depois a 3. Um número do WME só serve uma vez.</p>',
            hNamesT: 'A coluna «Rua WME»',
            hNamesB: '<table class="wbc-help-table"><tr><td>&#x2713;</td><td>os segmentos próximos dos endereços têm o nome da BAN.</td></tr><tr><td><i>nome</i></td><td>têm outro nome: o nome a verificar.</td></tr><tr><td><i>sem nome</i></td><td>não têm nome.</td></tr><tr><td><i>nenhum segmento</i></td><td>nenhum segmento a menos de 80 m dos endereços.</td></tr><tr><td>&#x2713; alt</td><td>o nome da BAN está como nome <b>alternativo</b>; o nome principal aparece ao lado.</td></tr><tr><td>nº de rodovia</td><td>o nome principal é um número de rodovia e o nome da BAN falta nos alternativos: adicionar.</td></tr><tr><td>tipo</td><td>só o tipo de via difere (Rue / Chemin…).</td></tr><tr><td>artigo · grafia · parcial</td><td>nomes parecidos: um artigo, uma ou duas letras, ou uma forma abreviada. <i>ausente do WME</i>: a rua não existe no WME, o nome mostrado é o da vizinha.</td></tr></table><p>Um número faltando em laranja com <b>≠</b> existe no WME com outro sufixo (12 b / 12bis): verificar.</p><p>&#x26A0; indica um nome da BAN que nenhum segmento do município tem.</p>',
            hLimitsT: 'Bom saber',
            hLimitsB: "<p>Um departamento inteiro leva alguns minutos: a BAN é lida município por município, o WME em quadrados de cerca de 5 km. O botão Parar interrompe; o que foi feito continua visível e os municípios com erro podem ser refeitos sozinhos.</p><p>Paris, Marselha e Lyon são lidas distrito por distrito. Nenhum resultado é guardado: fechar o WME os apaga. Só as suas preferências (área, interruptores, posição da janela, cores dos pontos) ficam no navegador.</p>",
            hSafeB: "O script só altera o mapa quando solicitado: o botão “Adicionar os números”, reservado aos L6, coloca números e nunca os salva. Lê o WME e a BAN; os resultados ficam neste navegador.",
            lnkDiscuss: 'Tópico no Discuss',
            majBtn: v => 'A versão ' + v + ' está disponível',
            majInstall: 'Instalar',
            close: 'Fechar',
            dragTip: 'Arraste para mover · clique duplo para devolver ao lugar',
            modeHere: 'Centro do mapa',
            modeCommune: 'Outro município',
            modeDep: 'Departamento',
            modeLbl: 'Área',
            hereHint: 'O município sob o centro do mapa, tomado ao iniciar a análise.',
            searchPh: 'Nome, CEP ou código INSEE',
            searchNone: 'Nenhum município encontrado',
            depChoose: 'Escolher um departamento',
            analyse: 'Analisar',
            stop: 'Parar',
            stLocate: 'Procurando o município…',
            stBan: 'BAN: lendo…',
            stBanMo: mo => 'BAN: lendo… ' + mo + ' MB',
            stWme: (i, n) => 'WME: quadrado ' + i + '/' + n,
            stHn: 'WME: números…',
            stCalc: 'Calculando…',
            stDep: (i, n, nom) => 'Município ' + i + '/' + n + ' — ' + nom,
            stDone: s => 'Concluído em ' + s + ' s',
            stStopped: 'Parado',
            errNoCommune: 'Nenhum município francês sob o centro do mapa.',
            errPick: 'Escolha primeiro um município.',
            errPickDep: 'Escolha primeiro um departamento.',
            errBan: 'A BAN não lista nenhum endereço para este município.',
            errNet: m => 'Erro de rede: ' + m,
            errWme: 'O WME não respondeu: ',
            errGrant: 'O gerenciador de scripts recusou a requisição de rede (verifique as permissões do script).',
            emptyIntro: 'Escolha uma área e inicie a análise.',
            kBan: 'Endereços BAN',
            kCert: n => n + (un1(n) ? " certificado" : " certificados"),
            kWme: 'Encontrados no WME',
            kHnRpp: (h, r) => h + ' HN · ' + r + ' RPP',
            kMiss: 'Faltando',
            kExtra: 'A mais no WME',
            kDup: n => n + (un1(n) ? " duplicado" : " duplicados"),
            kCov: 'Cobertura',
            voiesLine: (c, n) => c + (un1(c) ? ' rua completa de ' : ' ruas completas de ') + n,
            vNoName: n => n + (un1(n) ? " sem nome" : " sem nome"),
            vOtherName: n => n + (un1(n) ? " com outro nome" : " com outro nome"),
            vNoSeg: n => n + (un1(n) ? " sem segmento" : " sem segmento"),
            fAll: 'Todas',
            fTodo: 'Incompletas',
            fName: 'Nome a verificar',
            fDone: 'Completas',
            filterPh: 'Filtrar ruas',
            layerSwitch: 'Diferenças',
            exportCsv: 'Exportar CSV',
            thStreetBan: 'Rua BAN',
            thStreetWme: 'Rua WME',
            thBan: 'BAN',
            thWme: 'WME',
            thGap: 'Diferença',
            thCommune: 'Município',
            thMiss: 'Faltam',
            nameNone: 'sem nome',
            nameNoSeg: 'nenhum segmento',
            tipSame: 'Os segmentos próximos têm o nome da BAN',
            tipOther: 'Os segmentos próximos têm outro nome',
            tipAbsent: 'Nenhum segmento do município tem este nome',
            missingT: 'Números faltando',
            noneMissing: 'Nada falta nesta rua.',
            tipGo: 'Mostrar no mapa',
            extraT: n => 'Números do WME sem endereço BAN (' + n + ')',
            dupT: n => 'Números presentes duas vezes no WME (' + n + ')',
            noStreet: 'Nenhuma rua corresponde.',
            depBack: 'Voltar ao departamento',
            tipHN: 'Número em um segmento',
            tipRPP: 'Ponto residencial (RPP)',
            errCommune: 'falhou',
            showFound: 'Presentes',
            hovDist: m => 'número do WME a ' + m + ' m',
            sbMap: "Mapa",
            sbHover: "Detalhes ao passar o mouse",
            sbHoverHint: "Pare o ponteiro sobre um ponto do mapa: aparecem o endereço, o estado e a certificação.",
            sbColors: "Cores",
            sbColorsReset: "Cores padrão",
            legColMap: "Mapa dos municípios",
            tipColMap: "Cor do mapa do departamento: os 5 tons derivam dela, o mais claro para os menos cobertos.",
            tipColPoint: "Cor destes pontos no mapa.",
            hovMissing: "Faltando no WME",
            hovFound: k => 'Encontrado no WME (' + k + ')',
            hovExtra: "Número do WME sem endereço BAN",
            hovCert: "Endereço certificado pelo município",
            hovNotCert: "Endereço não certificado pelo município",
            hovWmeStreet: r => 'Rua WME: ' + r,
            sizeTip: "Ampliar / restaurar a janela",
            searching: "Buscando…",
            tipAnalyse: "Analisar a área escolhida. Se já foi varrida, a data aparece antes, com Abrir ou Refazer.",
            tipAnalyseCom: c => "Analisar de novo " + c + ", o município mostrado, e atualizar a sua linha do departamento. Para varrer todo o departamento, volte primeiro a ele.",
            tipStop: "Parar a análise em andamento. O que foi feito continua exibido e salvo.",
            tipModeCommune: "Escolher um município pelo nome, CEP ou código INSEE.",
            tipModeDep: "Analisar todos os municípios de um departamento.",
            tipFDone: "As vias cujos endereços BAN estão todos no WME.",
            tipFAll: "Todas as vias do município.",
            tipSort: "Ordenar por esta coluna; um segundo clique inverte a ordem.",
            tipDepBack: "Voltar à lista de municípios do departamento, sem refazer a análise.",
            tipCsv: "Baixar o relatório do município, endereço por endereço, em CSV (planilha).",
            tipCsvDep: "Baixar uma linha por município do departamento, em CSV (planilha).",
            tipNext: "Centralizar o mapa no próximo número faltante da via, depois da próxima via incompleta.",
            tipRetry: "Refazer só os municípios cuja análise falhou.",
            tipCmpStop: "Remover a comparação exibida; a varredura continua.",
            tipRefresh: "Varrer de novo este município; o novo resultado é comparado com o anterior.",
            tipRefreshN: "Varrer de novo só os municípios sinalizados (BAN ou WME alterados desde então); comparado com a varredura anterior.",
            tipMemoOpen: "Abrir a janela nesta varredura e enquadrar o mapa nela.",
            tipMemoClear: "Apagar todas as varreduras salvas neste navegador (dois cliques).",
            tipSbOpen: "Abrir a janela do WBC (como o botão à direita do mapa).",
            tipColorsReset: "Restaurar as cores padrão dos pontos.",
            tipHelpHdr: "Expandir ou recolher esta parte da ajuda.",
            tipFab: "Abrir ou fechar a janela",
            tipVoie: "Expandir a via (seus números, os faltantes em vermelho) e enquadrar o mapa nela.",
            tipCommune: "Abrir o detalhe deste município e enquadrar o mapa nele.",
            memoBanBtn: "Verificar a BAN",
            memoBanTip: "Ver, município por município, se a BAN mudou desde a varredura (uma pequena requisição cada). Nada é varrido de novo.",
            memoBanUpd: "Atualizações da BAN",
            copyBtn: "Copiar",
            copyTip: "Copiar a taxa de cobertura para a área de transferência, formatada para o Discord.",
            copyDone: "Copiado",
            copyFail: "Falha ao copiar",
            copyTitre: lieu => '📊 **Cobertura dos endereços BAN no WME — ' + lieu + '**',
            copyAdr: (p, b, c) => 'Endereços encontrados no WME: **' + p + ' / ' + b + ' (' + c + ')**',
            copyCommunes: (n, tot, d) => 'Municípios analisados: ' + n + '/' + tot + ' · varredura de ' + d,
            copyCert: "só endereços certificados",
            foldTip: "Minimizar a janela",
            unfoldTip: "Expandir a janela",
            dejaCommune: d => 'Já analisado em ' + d,
            dejaDep: (d, n, total) => 'Já analisado em ' + d + ' (' + n + '/' + total + ' municípios)',
            dejaViaDep: c => 'com o departamento ' + c,
            dejaOpenTip: "Mostra esta varredura na hora, sem refazer a análise.",
            dejaRelaunch: "Refazer",
            dejaRelaunchTip: "Refaz toda a análise; a varredura salva serve de referência para a comparação.",
            lastMissing: "Nenhum outro número faltando na tabela.",
            retryFailed: n => 'Tentar de novo ' + (un1(n) ? 'o município com erro' : 'os ' + n + ' municípios com erro'),
            stDoneErr: (s, n) => 'Concluído em ' + s + ' s — ' + n + (un1(n) ? ' município com erro' : ' municípios com erro'),
            noCert: n => 'Nenhum dos ' + n + ' endereços BAN deste município é certificado.',
            errSession: "Sessão do WME expirada: recarregue a página.",
            errFormat: src => src + ' respondeu num formato inesperado: o script precisa ser atualizado.',
            delNote: "não atribuíveis a um município delegado",
            mapCap: (a, b) => 'Mapa: ' + a + ' pontos mostrados de ' + b + ' na vista (aproxime para ver todos)',
            legExtra: "a mais no WME",
            legFound: "encontrado",
            legMiss: "faltando",
            eta: m => '≈ ' + m + ' min restante' + (un1(m) ? '' : 's'),
            certNote: n => 'Somente endereços certificados: ' + n + (un1(n) ? ' não certificado deixado de lado' : ' não certificados deixados de lado'),
            articleTag: "artigo",
            tipArticle: "Só um artigo difere (de, la, du…)",
            orthoTag: "grafia",
            tipOrtho: "A grafia difere em uma ou duas letras",
            partielTag: "parcial",
            tipPartiel: "Um nome é a forma abreviada do outro",
            absentTag: "ausente do WME",
            altTag: "alt",
            tipAlt: p => "O nome da BAN está como nome alternativo; nome principal: " + p,
            routeTag: "nº de rodovia",
            tipRoute: "O nome principal é um número de rodovia, e o nome da BAN não está entre os alternativos",
            typeTag: "tipo",
            tipType: "Só o tipo de via é diferente",
            vAlt: n => n + (un1(n) ? " como nome alternativo" : " como nome alternativo"),
            vRoute: n => n + (un1(n) ? " com um número de rodovia" : " com um número de rodovia"),
            vType: n => n + (un1(n) ? " com um nome parecido" : " com um nome parecido"),
            kSuf: n => 'sendo ' + n + (un1(n) ? ' sufixo a verificar' : ' sufixos a verificar'),
            tipSuf: w => "O WME tem " + w + ": verifique o sufixo",
            certOnly: 'Certificados',
            nextMissing: "Próximo faltando",
            etaSoon: "menos de um minuto",
            delAll: "Todos os municípios delegados",
            depMap: 'Polígonos dos municípios',
            legNoData: 'não analisado',
            hovCom: (ban, wme, miss) => 'BAN ' + ban + ' · WME ' + wme + ' · faltando ' + miss,
            hovComClick: 'Clique (mapa afastado) para abri-lo',
            hovProbSeg: (id, d) => 'Segmento provável: ' + id + ' (' + d + ' m)',
            selSegs: n => 'Selecionar os segmentos (' + n + ')',
            selSegsTip: 'Seleciona no WME os segmentos que levam os endereços desta rua',
            selSegsPart: (a, b) => a + '/' + b + ' segmentos selecionados: os outros não estão carregados — aproxime da rua.',
            selSegsNone: 'Nenhum segmento desta rua está carregado no WME: aproxime e tente de novo.',
            ajHnAdd: n => 'Adicionar os números (' + n + ')',
            nextStreet: n => 'Próxima rua (' + n + ' a adicionar)',
            tipNextStreet: 'Abre a rua do município onde “Adicionar” tem mais números a colocar (nome da BAN como principal ou alternativo), pulando as ruas já abertas por este botão.',
            nextStreetNone: 'Nenhuma outra rua pronta: as restantes já têm seus números, ou precisam primeiro de correção do nome.',
            ajHnAddTip: r => 'Somente L6: coloca no WME os números que faltam nesta rua, nos segmentos cujo nome principal é exatamente o da BAN (exceto acentos e maiúsculas) e cuja cidade é o município ou “Vila (Município)”. No máximo 150 números por hora móvel, contados ao salvar (restam ' + r + '). Nada é salvo: confira e depois salve no WME. Fora da área urbana (nome principal sem cidade, nome BAN com o município como alternativo), o endereço vira um local residencial (RPP) — mesma conversão do ⚡ do WME Naming Auditor — e conta na cota.',
            ajHnNoName: 'O nome WME desta rua não é o da BAN: a adição automática exige um nome principal idêntico ao da BAN.',
            ajHnNone: 'Nenhum número pode ser adicionado automaticamente nesta rua.',
            ajHnQuota: h => 'Cota atingida (150 números por hora): próxima adição possível às ' + h + '.',
            ajHnRunning: 'Adicionando os números…',
            bgTab: 'Aba em segundo plano: o Chrome deixa o trabalho em andamento mais lento (até 3 vezes mais longo). Mantenha esta aba em primeiro plano.',
            bgTabTip: 'O Chrome limita os temporizadores de uma aba oculta (um por segundo, depois um por minuto após 5 minutos) e reduz sua prioridade. Medido em 29/09/2026: um departamento em 41 min em segundo plano contra 13 min em primeiro plano.',
            ajHnDone: (n, r) => n + (un1(n) ? ' número colocado' : ' números colocados') + ' — confira e depois salve no WME. Cota restante: ' + r + '.',
            ajHnAddMix: (n, r) => 'Adicionar (' + n + ' números · ' + r + ' RPP)',
            ajHnDoneMix: (n, r, q) => n + (un1(n) ? ' número' : ' números') + ' e ' + r + ' RPP colocados — confira e depois salve no WME. Cota restante: ' + q + '.',
            ajHnDoneRpp: (r, q) => r + (un1(r) ? ' RPP colocado' : ' RPP colocados') + ' — confira e depois salve no WME. Cota restante: ' + q + '.',
            ajRppCrit: l => '⚠️ A corrigir à mão: ' + l + '.',
            ajRppCritHn: n => 'número ' + n + ' ficou como número de casa num segmento fora da área urbana',
            ajRppCritPoi: n => 'RPP ' + n + ' ficou sem endereço',
            ajRppCritDbl: n => 'endereço ' + n + ' em DUPLICIDADE (número + RPP)',
            ajHnSansAlt: (r, c) => 'Alguns segmentos fora da área urbana têm “' + r + '” sem cidade, mas não o alternativo “' + r + ' / ' + c + '”: nenhum RPP é colocado enquanto ele faltar.',
            ajHnSansAltRoute: (r, c) => 'Alguns segmentos fora da área urbana têm um número de rodovia como nome principal, sem cidade, mas não o alternativo “' + r + ' / ' + c + '”: nenhum RPP é colocado ali enquanto faltar.',
            ajHnSkip: n => n + (un1(n) ? ' endereço ignorado' : ' endereços ignorados') + ' (detalhes no console).',
            ajHnNoSeg: 'Nenhum segmento carregado tem exatamente este nome como nome principal com o município como cidade: nada foi colocado.',
            ajHnErr: m => 'Adição interrompida: ' + m,
            ajHnRights: 'Reservado aos editores L6.',
            ajHnSee: n => un1(n) ? 'Ele aparece circulado em turquesa no mapa.' : 'Eles aparecem circulados em turquesa no mapa.',
            ajHnPoseTip: 'Colocado pelo WBC, ainda não salvo: clique para centralizar o mapa nele.',
            ajHnSaved: (c, r, q) => 'Salvamento: ' + c + (un1(c) ? ' número contado' : ' números contados') + ', ' + r + ' devolvidos à cota (removidos antes de salvar). Cota restante: ' + q + '.',
            ajHnSavedTip: 'Colocado pelo WBC e salvo.',
            hHnT: 'Adicionar os números (L6)',
            hHnB: '<p>Reservado aos editores <b>L6</b>. Na linha aberta de uma rua, <i>Adicionar os números</i> coloca no WME os endereços que faltam — <b>rua por rua</b>, nunca para o município inteiro. Para um só número: o “+” da sua etiqueta (ao passar o mouse) ou um clique no seu ponto no mapa.</p><p><b>Condições</b>: o nome principal dos segmentos é exatamente o da BAN (só acentos, maiúsculas, apóstrofos e espaços são tolerados) e a cidade deles é o município ou “Vila (Município)”. Cada número vai para o segmento admitido mais próximo (no máximo 80 m); um número já presente, mesmo pendente, nunca é recolocado; um sufixo diferente ou numérico fica para o editor.</p><p><b>Nada é salvo</b>: os números colocados aparecem circulados em turquesa no mapa (mesmo com a janela fechada) e marcados com ✚ na rua; confira e depois salve ou desfaça no WME.</p><p><b>Cota</b>: 150 números por hora móvel. Um número é reservado ao ser colocado e contado se estiver no servidor após salvar; retirado ou alterado antes, ele é devolvido. Números digitados à mão nunca contam. Depois de salvos, passam a «encontrados» sem refazer a análise; uma varredura guardada mais antiga avisa («refaça»).</p><p><b>Fora da área urbana</b>: num segmento cujo nome principal não tem cidade e que leva o nome BAN com o município como alternativo, o endereço vira um <b>local residencial (RPP)</b> — mesma conversão do ⚡ do WME Naming Auditor: local criado no lugar do número, seu endereço, ponto de entrada do número mantido, número removido; uma etapa que falha é desfeita. O botão mostra então as duas contagens, números e RPP; os RPP contam na cota.</p>',
            ajHnQuotaTip: 'Hora móvel: um número conta durante uma hora a partir de quando é colocado. Só contam os números colocados por este botão e realmente salvos.',
            ajHnLeft: n => 'Cota: ' + n + (un1(n) ? ' restante' : ' restantes') + ' nesta hora',
            ajHnFull: h => 'Cota atingida — próxima adição às ' + h,
            ajHn1: 'Adicionar este número',
            ajHn1Tip: 'Somente L6: coloca só este número no WME, com as verificações de “Adicionar os números” (nome BAN, cidade, segmento a menos de 80 m); conta na cota. Nada é salvo.',
            ajHn1Exists: n => 'O número ' + n + ' já está no WME nesta rua: nada foi colocado.',
            ajHn1Far: n => 'Nenhum segmento admitido (nome BAN, cidade certa) a menos de 80 m do número ' + n + ': nada foi colocado.',
            tipGoAdd: 'Mostrar no mapa. Ao passar o mouse, “+” adiciona só este número.',
            cmpBtn: 'Comparar',
            cmpTip: 'Carregar um CSV exportado antes para o mesmo município ou departamento: o avanço desde então é mostrado.',
            cmpLine: (d, w, m, x) => 'Desde a exportação de ' + d + ': ' + w + ' no WME · ' + m + ' faltando · ' + x + ' a mais',
            cmpStop: 'Parar de comparar',
            cmpWrong: 'Esta exportação é de outro município ou departamento.',
            cmpBad: 'Este arquivo não é uma exportação do WME BAN Coverage.',
            cmpCert: 'A exportação tinha outra configuração “só certificados”: os números não se comparam.',
            thDelta: 'Δ',
            thDeltaTip: d => 'Mudança no WME desde a exportação de ' + d,
            namesCsv: 'Diferenças (CSV)',
            namesCsvTip: 'As ruas cujo nome no WME difere da BAN, com seus segmentos e um link WME: para corrigir ou relatar.',
            namesNone: 'Nenhuma diferença de nome para exportar.',
            hTrackT: 'Acompanhar e relatar',
            hTrackB: '<p><b>Mapa do departamento</b>: depois de um departamento, cada município é colorido pela cobertura (claro = pouca, escuro = muita). Passando o mouse aparecem seus números; com o mapa afastado, um clique o abre.</p><p><b>Número faltando</b>: com a rua aberta, uma linha pontilhada leva ao segmento que provavelmente deveria levá-lo; seu identificador está no CSV.</p><p><b>Selecionar os segmentos</b> de uma rua pela sua linha: eles ficam selecionados no WME.</p><p><b>Avanço</b>: a exportação CSV serve também de registro. Mais tarde, <i>Comparar</i> a relê e dá a mudança rua por rua (ou município por município). Nada é guardado em outro lugar.</p><p><b>Diferenças (CSV)</b>: as ruas a renomear, cada uma com um link WME, para corrigir ou enviar aos responsáveis da área.</p>',
            certOnlyTip: "Somente endereços certificados",
            layerSwitchTip: "Números faltando e a mais no mapa",
            showFoundTip: "Mostrar também os encontrados",
            depMapTip: 'Municípios coloridos no mapa',
            etaShort: m => '\u2248\u00a0' + m + '\u00a0min',
            memoSweep: d => 'Varredura de ' + d,
            memoBanWait: 'BAN: verificando…',
            memoBanProg: (i, n) => 'BAN: verificando ' + i + '/' + n,
            memoBanOk: 'BAN sem mudança',
            memoBanMaj: d => 'BAN atualizada' + (d ? ' (' + d + ')' : ''),
            memoBanMajN: n => 'BAN atualizada: ' + n,
            memoBanErr: 'BAN: verificação impossível',
            dejaHnDepuis: n => n + (un1(n) ? ' número adicionado pelo WBC desde então: reinicie' : ' números adicionados pelo WBC desde então: reinicie'),
            memoWmeBtn: 'Verificar WME',
            memoWmeTip: 'Relê a área, números incluídos, e a compara com a varredura: segmentos (quantidade e data), cada número (identificador, valor, segmento, posição) e pontos residenciais.',
            memoWmeProg: (i, n) => 'WME: verificando ' + i + '/' + n,
            memoWmeOk: 'WME sem mudança',
            memoWmeMaj: d => 'WME editado' + (d ? ' (' + d + ')' : ''),
            memoWmeMajN: n => 'WME editado: ' + n,
            memoRefresh: 'Atualizar',
            memoRefreshN: n => 'Atualizar sinalizados (' + n + ')',
            memoTagBan: 'BAN atualizada desde a varredura',
            memoTagWme: 'WME editado desde a varredura',
            cmpLineMemo: (d, w, m, x) => 'Desde a varredura de ' + d + ': ' + w + ' no WME · ' + m + ' faltando · ' + x + ' a mais',
            secMemo: 'Varreduras guardadas',
            memoHint: 'Guardadas só neste navegador. Reabrir uma a mostra na hora e verifica se a BAN mudou desde então.',
            memoNone: 'Nenhuma varredura guardada ainda.',
            memoOpen: 'Abrir',
            memoDel: 'Apagar esta varredura',
            memoClear: 'Apagar tudo',
            memoErr: m => 'Não foi possível guardar a varredura: ' + m,
            hMemoT: 'Varreduras guardadas e atualizações',
            hMemoB: '<p>Cada varredura é guardada neste navegador (nada é enviado). Escolher de novo o mesmo município ou departamento, ou <i>Abrir</i> na aba Scripts, a mostra na hora com sua data. <i>Analisar</i> também avisa: se a mesma área já foi varrida, a data aparece com <i>Abrir</i> e <i>Refazer</i>. Se o WBC adicionou números nessa área desde então, o aviso diz isso e <i>Refazer</i> passa a ser o botão principal.</p><p><b>BAN</b>: o arquivo de endereços de cada município é comparado ao da varredura — automaticamente para um município (uma requisição), com <i>Verificar a BAN</i> para um departamento (uma requisição por município; nada é varrido de novo). <b>WME</b>: <i>Verificar WME</i> relê a área, números incluídos: segmentos (quantidade e data), cada número (identificador, valor, segmento, posição — os números não têm data no WME, e adicionar um não muda a data do seu segmento) e pontos residenciais.</p><p>Os municípios sinalizados levam uma etiqueta BAN ou WME e um contorno laranja no mapa; <i>Atualizar</i> refaz a varredura só deles. A nova varredura é comparada automaticamente com a anterior.</p>',
            memoClearSure: 'Clique de novo para apagar tudo',
        },
        'pt-PT': {
            sbHint: 'Compara a base nacional de moradas (BAN) com os números de porta e os pontos residenciais (RPP) do WME, para um município ou um departamento inteiro.',
            sbOpen: 'Abrir a janela',
            sbHelp: 'Ajuda',
            hWhatT: 'O que é comparado',
            hWhatB: "<p>A <b>BAN</b> é a referência: cada morada que lista deveria existir no WME, como número num segmento (HN) ou como ponto residencial (RPP).</p><p>Os dois lados são lidos em direto: a BAN na sua plataforma nacional (adresse.data.gouv.fr), os limites e listas de municípios no geo.api.gouv.fr — que recebe o centro do mapa e as suas pesquisas — e o WME nos mesmos servidores do editor. A zona não precisa de estar visível nem carregada.</p>",
            hMatchT: 'Quando um número é encontrado',
            hMatchB: '<p>Uma morada da BAN é encontrada quando o WME tem o mesmo número (sufixos incluídos: <i>bis</i>, <i>ter</i>, letras) a menos de 150 m, e:</p><table class="wbc-help-table"><tr><td>1</td><td>numa rua com o mesmo nome (principal ou alternativo), ou que só difere por um artigo («Avenue Sembrancher» = «Avenue de Sembrancher»; a diferença de nome continua assinalada);</td></tr><tr><td>2</td><td>ou num segmento que tem as moradas dessa rua, <b>com ou sem nome</b>;</td></tr><tr><td>3</td><td>ou a menos de 30 m da morada.</td></tr></table><p>A regra 1 é tentada primeiro em todo o lado, depois a 2, depois a 3. Um número do WME só serve uma vez.</p>',
            hNamesT: 'A coluna «Rua WME»',
            hNamesB: '<table class="wbc-help-table"><tr><td>&#x2713;</td><td>os segmentos perto das moradas têm o nome da BAN.</td></tr><tr><td><i>nome</i></td><td>têm outro nome: o nome a verificar.</td></tr><tr><td><i>sem nome</i></td><td>não têm nome.</td></tr><tr><td><i>nenhum segmento</i></td><td>nenhum segmento a menos de 80 m das moradas.</td></tr><tr><td>&#x2713; alt</td><td>o nome da BAN está como nome <b>alternativo</b>; o nome principal aparece ao lado.</td></tr><tr><td>n.º de estrada</td><td>o nome principal é um número de estrada e o nome da BAN falta nos alternativos: acrescentar.</td></tr><tr><td>tipo</td><td>só o tipo de via difere (Rue / Chemin…).</td></tr><tr><td>artigo · grafia · parcial</td><td>nomes parecidos: um artigo, uma ou duas letras, ou uma forma abreviada. <i>ausente do WME</i>: a rua não existe no WME, o nome mostrado é o da vizinha.</td></tr></table><p>Um número em falta a laranja com <b>≠</b> existe no WME com outro sufixo (12 b / 12bis): verificar.</p><p>&#x26A0; assinala um nome da BAN que nenhum segmento do município tem.</p>',
            hLimitsT: 'Bom saber',
            hLimitsB: "<p>Um departamento inteiro demora alguns minutos: a BAN é lida município a município, o WME em quadrados de cerca de 5 km. O botão Parar interrompe; o que está feito continua visível e os municípios com erro podem ser repetidos sozinhos.</p><p>Paris, Marselha e Lyon são lidas distrito a distrito. Nenhum resultado é guardado: fechar o WME apaga-os. Só as suas preferências (zona, interruptores, posição da janela, cores dos pontos) ficam no navegador.</p>",
            hSafeB: "O script só altera o mapa a pedido: o botão «Adicionar os números», reservado aos L6, coloca números e nunca os guarda. Lê o WME e a BAN; os resultados ficam neste navegador.",
            lnkDiscuss: 'Tópico no Discuss',
            majBtn: v => 'A versão ' + v + ' está disponível',
            majInstall: 'Instalar',
            close: 'Fechar',
            dragTip: 'Arrastar para mover · duplo clique para a repor no lugar',
            modeHere: 'Centro do mapa',
            modeCommune: 'Outro município',
            modeDep: 'Departamento',
            modeLbl: 'Zona',
            hereHint: 'O município sob o centro do mapa, tomado ao iniciar a análise.',
            searchPh: 'Nome, código postal ou código INSEE',
            searchNone: 'Nenhum município encontrado',
            depChoose: 'Escolher um departamento',
            analyse: 'Analisar',
            stop: 'Parar',
            stLocate: 'A procurar o município…',
            stBan: 'BAN: a ler…',
            stBanMo: mo => 'BAN: a ler… ' + mo + ' MB',
            stWme: (i, n) => 'WME: quadrado ' + i + '/' + n,
            stHn: 'WME: números…',
            stCalc: 'A calcular…',
            stDep: (i, n, nom) => 'Município ' + i + '/' + n + ' — ' + nom,
            stDone: s => 'Concluído em ' + s + ' s',
            stStopped: 'Parado',
            errNoCommune: 'Nenhum município francês sob o centro do mapa.',
            errPick: 'Escolha primeiro um município.',
            errPickDep: 'Escolha primeiro um departamento.',
            errBan: 'A BAN não lista nenhuma morada para este município.',
            errNet: m => 'Erro de rede: ' + m,
            errWme: 'O WME não respondeu: ',
            errGrant: 'O gestor de scripts recusou o pedido de rede (verifique as permissões do script).',
            emptyIntro: 'Escolha uma zona e inicie a análise.',
            kBan: 'Moradas BAN',
            kCert: n => n + (un1(n) ? " certificada" : " certificadas"),
            kWme: 'Encontradas no WME',
            kHnRpp: (h, r) => h + ' HN · ' + r + ' RPP',
            kMiss: 'Em falta',
            kExtra: 'A mais no WME',
            kDup: n => n + (un1(n) ? " duplicado" : " duplicados"),
            kCov: 'Cobertura',
            voiesLine: (c, n) => c + (un1(c) ? ' rua completa de ' : ' ruas completas de ') + n,
            vNoName: n => n + (un1(n) ? " sem nome" : " sem nome"),
            vOtherName: n => n + (un1(n) ? " com outro nome" : " com outro nome"),
            vNoSeg: n => n + (un1(n) ? " sem segmento" : " sem segmento"),
            fAll: 'Todas',
            fTodo: 'Incompletas',
            fName: 'Nome a verificar',
            fDone: 'Completas',
            filterPh: 'Filtrar ruas',
            layerSwitch: 'Diferenças',
            exportCsv: 'Exportar CSV',
            thStreetBan: 'Rua BAN',
            thStreetWme: 'Rua WME',
            thBan: 'BAN',
            thWme: 'WME',
            thGap: 'Diferença',
            thCommune: 'Município',
            thMiss: 'Falta',
            nameNone: 'sem nome',
            nameNoSeg: 'nenhum segmento',
            tipSame: 'Os segmentos próximos têm o nome da BAN',
            tipOther: 'Os segmentos próximos têm outro nome',
            tipAbsent: 'Nenhum segmento do município tem este nome',
            missingT: 'Números em falta',
            noneMissing: 'Não falta nada nesta rua.',
            tipGo: 'Mostrar no mapa',
            extraT: n => 'Números do WME sem morada BAN (' + n + ')',
            dupT: n => 'Números presentes duas vezes no WME (' + n + ')',
            noStreet: 'Nenhuma rua corresponde.',
            depBack: 'Voltar ao departamento',
            tipHN: 'Número de porta num segmento',
            tipRPP: 'Ponto residencial (RPP)',
            errCommune: 'falhou',
            showFound: 'Presentes',
            hovDist: m => 'número do WME a ' + m + ' m',
            sbMap: "Mapa",
            sbHover: "Detalhes ao passar o rato",
            sbHoverHint: "Pare o ponteiro sobre um ponto do mapa: aparecem a morada, o estado e a certificação.",
            sbColors: "Cores",
            sbColorsReset: "Cores predefinidas",
            legColMap: "Mapa dos municípios",
            tipColMap: "Cor do mapa do departamento: os 5 tons derivam dela, o mais claro para os menos cobertos.",
            tipColPoint: "Cor destes pontos no mapa.",
            hovMissing: "Em falta no WME",
            hovFound: k => 'Encontrado no WME (' + k + ')',
            hovExtra: "Número do WME sem morada BAN",
            hovCert: "Morada certificada pelo município",
            hovNotCert: "Morada não certificada pelo município",
            hovWmeStreet: r => 'Rua WME: ' + r,
            sizeTip: "Ampliar / repor a janela",
            searching: "A procurar…",
            tipAnalyse: "Analisar a área escolhida. Se já foi analisada, a data aparece primeiro, com Abrir ou Voltar a correr.",
            tipAnalyseCom: c => "Analisar de novo " + c + ", o município exibido, e atualizar sua linha do departamento. Para analisar todo o departamento, volte primeiro a ele.",
            tipStop: "Parar a análise em curso. O que está feito continua visível e guardado.",
            tipModeCommune: "Escolher um município pelo nome, código postal ou código INSEE.",
            tipModeDep: "Analisar todos os municípios de um departamento.",
            tipFDone: "As vias cujos endereços BAN estão todos no WME.",
            tipFAll: "Todas as vias do município.",
            tipSort: "Ordenar por esta coluna; um segundo clique inverte a ordem.",
            tipDepBack: "Voltar à lista de municípios do departamento, sem voltar a correr a análise.",
            tipCsv: "Descarregar o relatório do município, endereço a endereço, em CSV (folha de cálculo).",
            tipCsvDep: "Descarregar uma linha por município do departamento, em CSV (folha de cálculo).",
            tipNext: "Centrar o mapa no próximo número em falta da via, depois da via incompleta seguinte.",
            tipRetry: "Voltar a correr só os municípios cuja análise falhou.",
            tipCmpStop: "Retirar a comparação mostrada; o varrimento mantém-se.",
            tipRefresh: "Varrer de novo este município; o novo resultado é comparado com o anterior.",
            tipRefreshN: "Varrer de novo só os municípios assinalados (BAN ou WME alterados desde então); comparado com o varrimento anterior.",
            tipMemoOpen: "Abrir a janela neste varrimento e enquadrar o mapa nele.",
            tipMemoClear: "Apagar todos os varrimentos guardados neste navegador (dois cliques).",
            tipSbOpen: "Abrir a janela do WBC (como o botão à direita do mapa).",
            tipColorsReset: "Repor as cores predefinidas dos pontos.",
            tipHelpHdr: "Expandir ou recolher esta parte da ajuda.",
            tipFab: "Abrir ou fechar a janela",
            tipVoie: "Expandir a via (os seus números, os em falta a vermelho) e enquadrar o mapa nela.",
            tipCommune: "Abrir o detalhe deste município e enquadrar o mapa nele.",
            memoBanBtn: "Verificar a BAN",
            memoBanTip: "Ver, município a município, se a BAN mudou desde o varrimento (um pequeno pedido cada). Nada é varrido de novo.",
            memoBanUpd: "Atualizações da BAN",
            copyBtn: "Copiar",
            copyTip: "Copiar a taxa de cobertura para a área de transferência, formatada para o Discord.",
            copyDone: "Copiado",
            copyFail: "Não foi possível copiar",
            copyTitre: lieu => '📊 **Cobertura das moradas BAN no WME — ' + lieu + '**',
            copyAdr: (p, b, c) => 'Moradas encontradas no WME: **' + p + ' / ' + b + ' (' + c + ')**',
            copyCommunes: (n, tot, d) => 'Municípios analisados: ' + n + '/' + tot + ' · varrimento de ' + d,
            copyCert: "só moradas certificadas",
            foldTip: "Minimizar a janela",
            unfoldTip: "Expandir a janela",
            dejaCommune: d => 'Já analisado em ' + d,
            dejaDep: (d, n, total) => 'Já analisado em ' + d + ' (' + n + '/' + total + ' municípios)',
            dejaViaDep: c => 'com o departamento ' + c,
            dejaOpenTip: "Mostra este varrimento de imediato, sem voltar a correr a análise.",
            dejaRelaunch: "Voltar a correr",
            dejaRelaunchTip: "Volta a correr toda a análise; o varrimento guardado serve de referência para a comparação.",
            lastMissing: "Não há mais números em falta na tabela.",
            retryFailed: n => 'Repetir ' + (un1(n) ? 'o município com erro' : 'os ' + n + ' municípios com erro'),
            stDoneErr: (s, n) => 'Concluído em ' + s + ' s — ' + n + (un1(n) ? ' município com erro' : ' municípios com erro'),
            noCert: n => 'Nenhuma das ' + n + ' moradas BAN deste município está certificada.',
            errSession: "Sessão do WME expirada: recarregue a página.",
            errFormat: src => src + ' respondeu num formato inesperado: o script tem de ser atualizado.',
            delNote: "não atribuíveis a uma freguesia delegada",
            mapCap: (a, b) => 'Mapa: ' + a + ' pontos mostrados de ' + b + ' na vista (aproxime para ver todos)',
            legExtra: "a mais no WME",
            legFound: "encontrado",
            legMiss: "em falta",
            eta: m => '≈ ' + m + ' min restante' + (un1(m) ? '' : 's'),
            certNote: n => 'Só moradas certificadas: ' + n + (un1(n) ? ' não certificada posta de lado' : ' não certificadas postas de lado'),
            articleTag: "artigo",
            tipArticle: "Só um artigo difere (de, la, du…)",
            orthoTag: "grafia",
            tipOrtho: "A grafia difere numa ou duas letras",
            partielTag: "parcial",
            tipPartiel: "Um nome é a forma abreviada do outro",
            absentTag: "ausente do WME",
            altTag: "alt",
            tipAlt: p => "O nome da BAN está como nome alternativo; nome principal: " + p,
            routeTag: "n.º de estrada",
            tipRoute: "O nome principal é um número de estrada, e o nome da BAN não está entre os alternativos",
            typeTag: "tipo",
            tipType: "Só o tipo de via difere",
            vAlt: n => n + (un1(n) ? " como nome alternativo" : " como nome alternativo"),
            vRoute: n => n + (un1(n) ? " com um número de estrada" : " com um número de estrada"),
            vType: n => n + (un1(n) ? " com um nome parecido" : " com um nome parecido"),
            kSuf: n => 'das quais ' + n + (un1(n) ? ' sufixo a verificar' : ' sufixos a verificar'),
            tipSuf: w => "O WME tem " + w + ": verifique o sufixo",
            certOnly: 'Certificadas',
            nextMissing: "Seguinte em falta",
            etaSoon: "menos de um minuto",
            delAll: "Todas as freguesias delegadas",
            depMap: 'Polígonos dos municípios',
            legNoData: 'não analisado',
            hovCom: (ban, wme, miss) => 'BAN ' + ban + ' · WME ' + wme + ' · em falta ' + miss,
            hovComClick: 'Clique (mapa afastado) para o abrir',
            hovProbSeg: (id, d) => 'Segmento provável: ' + id + ' (' + d + ' m)',
            selSegs: n => 'Selecionar os segmentos (' + n + ')',
            selSegsTip: 'Seleciona no WME os segmentos que levam as moradas desta rua',
            selSegsPart: (a, b) => a + '/' + b + ' segmentos selecionados: os outros não estão carregados — aproxime-se da rua.',
            selSegsNone: 'Nenhum segmento desta rua está carregado no WME: aproxime-se e tente de novo.',
            ajHnAdd: n => 'Adicionar os números (' + n + ')',
            nextStreet: n => 'Rua seguinte (' + n + ' a adicionar)',
            tipNextStreet: 'Abre a rua do município onde «Adicionar» tem mais números a colocar (nome da BAN como principal ou alternativo), saltando as ruas já abertas por este botão.',
            nextStreetNone: 'Nenhuma outra rua pronta: as restantes já têm os números, ou precisam primeiro de correção do nome.',
            ajHnAddTip: r => 'Apenas L6: coloca no WME os números em falta nesta rua, nos segmentos cujo nome principal é exatamente o da BAN (exceto acentos e maiúsculas) e cuja cidade é o município ou «Aldeia (Município)». No máximo 150 números por hora móvel, contados ao guardar (restam ' + r + '). Nada é guardado: verifique e depois guarde no WME. Fora da localidade (nome principal sem cidade, nome BAN com o município como alternativo), a morada passa a local residencial (RPP) — mesma conversão do ⚡ do WME Naming Auditor — e conta na quota.',
            ajHnNoName: 'O nome WME desta rua não é o da BAN: a adição automática exige um nome principal idêntico ao da BAN.',
            ajHnNone: 'Nenhum número pode ser adicionado automaticamente nesta rua.',
            ajHnQuota: h => 'Quota atingida (150 números por hora): próxima adição possível às ' + h + '.',
            ajHnRunning: 'A adicionar os números…',
            bgTab: 'Separador em segundo plano: o Chrome abranda o trabalho em curso (até 3 vezes mais longo). Mantenha este separador em primeiro plano.',
            bgTabTip: 'O Chrome limita os temporizadores de um separador oculto (um por segundo, depois um por minuto após 5 minutos) e baixa a sua prioridade. Medido a 29/09/2026: um departamento em 41 min em segundo plano contra 13 min em primeiro plano.',
            ajHnDone: (n, r) => n + (un1(n) ? ' número colocado' : ' números colocados') + ' — verifique e depois guarde no WME. Quota restante: ' + r + '.',
            ajHnAddMix: (n, r) => 'Adicionar (' + n + ' números · ' + r + ' RPP)',
            ajHnDoneMix: (n, r, q) => n + (un1(n) ? ' número' : ' números') + ' e ' + r + ' RPP colocados — verifique e depois guarde no WME. Quota restante: ' + q + '.',
            ajHnDoneRpp: (r, q) => r + (un1(r) ? ' RPP colocado' : ' RPP colocados') + ' — verifique e depois guarde no WME. Quota restante: ' + q + '.',
            ajRppCrit: l => '⚠️ A corrigir à mão: ' + l + '.',
            ajRppCritHn: n => 'número ' + n + ' ficou como número de porta num segmento fora da localidade',
            ajRppCritPoi: n => 'RPP ' + n + ' ficou sem morada',
            ajRppCritDbl: n => 'morada ' + n + ' em DUPLICADO (número + RPP)',
            ajHnSansAlt: (r, c) => 'Alguns segmentos fora da localidade têm «' + r + '» sem cidade, mas não o alternativo «' + r + ' / ' + c + '»: nenhum RPP é colocado enquanto faltar.',
            ajHnSansAltRoute: (r, c) => 'Alguns segmentos fora da localidade têm um número de estrada como nome principal, sem localidade, mas não o alternativo «' + r + ' / ' + c + '»: nenhum RPP é colocado ali enquanto faltar.',
            ajHnSkip: n => n + (un1(n) ? ' endereço ignorado' : ' endereços ignorados') + ' (detalhes na consola).',
            ajHnNoSeg: 'Nenhum segmento carregado tem exatamente este nome como nome principal com o município como cidade: nada foi colocado.',
            ajHnErr: m => 'Adição interrompida: ' + m,
            ajHnRights: 'Reservado aos editores L6.',
            ajHnSee: n => (un1(n) ? 'Aparece rodeado' : 'Aparecem rodeados') + ' a turquesa no mapa.',
            ajHnPoseTip: 'Colocado pelo WBC, ainda não guardado: clique para centrar o mapa nele.',
            ajHnSaved: (c, r, q) => 'Gravação: ' + c + (un1(c) ? ' número contado' : ' números contados') + ', ' + r + ' devolvidos à quota (retirados antes de guardar). Quota restante: ' + q + '.',
            ajHnSavedTip: 'Colocado pelo WBC e guardado.',
            hHnT: 'Adicionar os números (L6)',
            hHnB: '<p>Reservado aos editores <b>L6</b>. Na linha aberta de uma rua, <i>Adicionar os números</i> coloca no WME os endereços em falta — <b>rua a rua</b>, nunca para o município inteiro. Para um só número: o «+» da sua etiqueta (ao passar o rato) ou um clique no seu ponto no mapa.</p><p><b>Condições</b>: o nome principal dos segmentos é exatamente o da BAN (só acentos, maiúsculas, apóstrofos e espaços são tolerados) e a cidade deles é o município ou «Aldeia (Município)». Cada número vai para o segmento admitido mais próximo (no máximo 80 m); um número já presente, mesmo pendente, nunca é recolocado; um sufixo diferente ou numérico fica para o editor.</p><p><b>Nada é guardado</b>: os números colocados aparecem rodeados a turquesa no mapa (mesmo com a janela fechada) e marcados com ✚ na rua; verifique e depois guarde ou anule no WME.</p><p><b>Quota</b>: 150 números por hora móvel. Um número é reservado ao ser colocado e contado se estiver no servidor depois de guardar; retirado ou alterado antes, é devolvido. Números escritos à mão nunca contam. Depois de guardados, passam a «encontrados» sem voltar a analisar; uma análise guardada mais antiga avisa («volte a correr»).</p><p><b>Fora da localidade</b>: num segmento cujo nome principal não tem cidade e que tem o nome BAN com o município como alternativo, a morada passa a <b>local residencial (RPP)</b> — mesma conversão do ⚡ do WME Naming Auditor: local criado no lugar do número, a sua morada, ponto de entrada do número mantido, número retirado; um passo que falhe é desfeito. O botão mostra então as duas contagens, números e RPP; os RPP contam na quota.</p>',
            ajHnQuotaTip: 'Hora móvel: um número conta durante uma hora a partir de quando é colocado. Só contam os números colocados por este botão e realmente guardados.',
            ajHnLeft: n => 'Quota: ' + n + (un1(n) ? ' restante' : ' restantes') + ' nesta hora',
            ajHnFull: h => 'Quota atingida — próxima adição às ' + h,
            ajHn1: 'Adicionar este número',
            ajHn1Tip: 'Só L6: coloca apenas este número no WME, com as verificações de «Adicionar os números» (nome BAN, localidade, segmento a menos de 80 m); conta na quota. Nada é guardado.',
            ajHn1Exists: n => 'O número ' + n + ' já está no WME nesta rua: nada foi colocado.',
            ajHn1Far: n => 'Nenhum segmento admitido (nome BAN, localidade certa) a menos de 80 m do número ' + n + ': nada foi colocado.',
            tipGoAdd: 'Mostrar no mapa. Ao passar o rato, «+» adiciona apenas este número.',
            cmpBtn: 'Comparar',
            cmpTip: 'Carregar um CSV exportado antes para o mesmo município ou departamento: é mostrado o avanço desde então.',
            cmpLine: (d, w, m, x) => 'Desde a exportação de ' + d + ': ' + w + ' no WME · ' + m + ' em falta · ' + x + ' a mais',
            cmpStop: 'Parar a comparação',
            cmpWrong: 'Esta exportação é de outro município ou departamento.',
            cmpBad: 'Este ficheiro não é uma exportação do WME BAN Coverage.',
            cmpCert: 'A exportação tinha outra definição «só certificadas»: os números não se comparam.',
            thDelta: 'Δ',
            thDeltaTip: d => 'Alteração no WME desde a exportação de ' + d,
            namesCsv: 'Diferenças (CSV)',
            namesCsvTip: 'As ruas cujo nome no WME difere da BAN, com os seus segmentos e uma ligação WME: para corrigir ou assinalar.',
            namesNone: 'Nenhuma diferença de nome para exportar.',
            hTrackT: 'Acompanhar e assinalar',
            hTrackB: '<p><b>Mapa do departamento</b>: depois de um departamento, cada município é colorido pela cobertura (claro = pouca, escuro = muita). Ao passar o rato surgem os seus números; com o mapa afastado, um clique abre-o.</p><p><b>Número em falta</b>: com a rua aberta, uma linha pontilhada leva ao segmento que provavelmente o deveria levar; o seu identificador está no CSV.</p><p><b>Selecionar os segmentos</b> de uma rua a partir da sua linha: ficam selecionados no WME.</p><p><b>Avanço</b>: a exportação CSV serve também de registo. Mais tarde, <i>Comparar</i> relê-a e dá a alteração rua a rua (ou município a município). Nada é guardado noutro sítio.</p><p><b>Diferenças (CSV)</b>: as ruas a renomear, cada uma com uma ligação WME, para corrigir ou enviar aos responsáveis da área.</p>',
            certOnlyTip: "Só moradas certificadas",
            layerSwitchTip: "Números em falta e a mais no mapa",
            showFoundTip: "Mostrar também os encontrados",
            depMapTip: 'Municípios coloridos no mapa',
            etaShort: m => '\u2248\u00a0' + m + '\u00a0min',
            memoSweep: d => 'Varrimento de ' + d,
            memoBanWait: 'BAN: a verificar…',
            memoBanProg: (i, n) => 'BAN: a verificar ' + i + '/' + n,
            memoBanOk: 'BAN sem alterações',
            memoBanMaj: d => 'BAN atualizada' + (d ? ' (' + d + ')' : ''),
            memoBanMajN: n => 'BAN atualizada: ' + n,
            memoBanErr: 'BAN: verificação impossível',
            dejaHnDepuis: n => n + (un1(n) ? ' número adicionado pelo WBC desde então: relance' : ' números adicionados pelo WBC desde então: relance'),
            memoWmeBtn: 'Verificar WME',
            memoWmeTip: 'Relê a área, números incluídos, e compara-a com o varrimento: segmentos (quantidade e data), cada número (identificador, valor, segmento, posição) e pontos residenciais.',
            memoWmeProg: (i, n) => 'WME: a verificar ' + i + '/' + n,
            memoWmeOk: 'WME sem alterações',
            memoWmeMaj: d => 'WME editado' + (d ? ' (' + d + ')' : ''),
            memoWmeMajN: n => 'WME editado: ' + n,
            memoRefresh: 'Atualizar',
            memoRefreshN: n => 'Atualizar assinalados (' + n + ')',
            memoTagBan: 'BAN atualizada desde o varrimento',
            memoTagWme: 'WME editado desde o varrimento',
            cmpLineMemo: (d, w, m, x) => 'Desde o varrimento de ' + d + ': ' + w + ' no WME · ' + m + ' em falta · ' + x + ' a mais',
            secMemo: 'Varrimentos guardados',
            memoHint: 'Guardados só neste navegador. Reabrir um mostra-o de imediato e verifica se a BAN mudou desde então.',
            memoNone: 'Nenhum varrimento guardado ainda.',
            memoOpen: 'Abrir',
            memoDel: 'Apagar este varrimento',
            memoClear: 'Apagar tudo',
            memoErr: m => 'Não foi possível guardar o varrimento: ' + m,
            hMemoT: 'Varrimentos guardados e atualizações',
            hMemoB: '<p>Cada varrimento é guardado neste navegador (nada é enviado). Escolher de novo o mesmo município ou departamento, ou <i>Abrir</i> no separador Scripts, mostra-o de imediato com a sua data. <i>Analisar</i> também avisa: se a mesma área já foi analisada, a data aparece com <i>Abrir</i> e <i>Voltar a correr</i>. Se o WBC adicionou números nessa área desde então, o aviso indica-o e <i>Voltar a correr</i> passa a ser o botão principal.</p><p><b>BAN</b>: o ficheiro de moradas de cada município é comparado com o do varrimento — automaticamente para um município (um pedido), com <i>Verificar a BAN</i> para um departamento (um pedido por município; nada é varrido de novo). <b>WME</b>: <i>Verificar WME</i> relê a área, números incluídos: segmentos (quantidade e data), cada número (identificador, valor, segmento, posição — os números não têm data no WME, e acrescentar um não muda a data do seu segmento) e pontos residenciais.</p><p>Os municípios assinalados levam uma etiqueta BAN ou WME e um contorno laranja no mapa; <i>Atualizar</i> refaz o varrimento só deles. O novo varrimento é comparado automaticamente com o anterior.</p>',
            memoClearSure: 'Clique de novo para apagar tudo',
        },
        he: {
            sbHint: 'משווה את מאגר הכתובות הלאומי (BAN) למספרי הבתים ולנקודות המגורים (RPP) ב-WME, עבור רשות מקומית או מחוז שלם.',
            sbOpen: 'פתיחת החלון',
            sbHelp: 'עזרה',
            hWhatT: 'מה משווים',
            hWhatB: "<p>ה-<b>BAN</b> הוא המקור הקובע: כל כתובת שהוא מונה אמורה להופיע ב-WME, כמספר בית על מקטע (HN) או כנקודת מגורים (RPP).</p><p>שני הצדדים נקראים בזמן אמת: ה-BAN מהפלטפורמה הלאומית שלו (adresse.data.gouv.fr), גבולות ורשימות הרשויות מ-geo.api.gouv.fr — שמקבל את מרכז המפה ואת החיפושים — ו-WME מאותם שרתים של העורך. אין צורך להציג או לטעון את האזור.</p>",
            hMatchT: 'מתי מספר נמצא',
            hMatchB: '<p>כתובת BAN נמצאת כאשר ב-WME יש אותו מספר (כולל סיומות: <i>bis</i>, <i>ter</i>, אותיות) במרחק של פחות מ-150 מ\', ו:</p><table class="wbc-help-table"><tr><td>1</td><td>על רחוב באותו שם (שם ראשי או חלופי), או ששונה ממנו רק במילית יידוע (\u2066«Avenue Sembrancher» = «Avenue de Sembrancher»\u2069; הפער בשם עדיין מדווח);</td></tr><tr><td>2</td><td>או על מקטע שנושא את הכתובות של הרחוב הזה, <b>עם שם או בלי</b>;</td></tr><tr><td>3</td><td>או במרחק של פחות מ-30 מ\' מהכתובת.</td></tr></table><p>כלל 1 נבדק ראשון בכל מקום, אחריו 2, אחריו 3. מספר ב-WME משמש פעם אחת בלבד.</p>',
            hNamesT: 'העמודה «רחוב WME»',
            hNamesB: '<table class="wbc-help-table"><tr><td>&#x2713;</td><td>המקטעים הקרובים לכתובות נושאים את השם של ה-BAN.</td></tr><tr><td><i>שם</i></td><td>הם נושאים שם אחר: השם שיש לבדוק.</td></tr><tr><td><i>ללא שם</i></td><td>הם אינם נושאים שם.</td></tr><tr><td><i>אין מקטע</i></td><td>אין מקטע במרחק של פחות מ-80 מ\' מהכתובות.</td></tr><tr><td>&#x2713; חלופי</td><td>השם מה-BAN מופיע כשם <b>חלופי</b>; השם הראשי מוצג לצידו.</td></tr><tr><td>מס׳ כביש</td><td>השם הראשי הוא מספר כביש ושם ה-BAN חסר בשמות החלופיים: יש להוסיף.</td></tr><tr><td>סוג</td><td>רק סוג הרחוב שונה (Rue / Chemin…).</td></tr><tr><td>מילית · כתיב · חלקי</td><td>שמות דומים: מילית, אות או שתיים, או צורה מקוצרת. <i>חסר ב-WME</i>: הרחוב אינו קיים ב-WME, והשם המוצג הוא של הרחוב השכן.</td></tr></table><p>מספר חסר בכתום עם <b>≠</b> קיים ב-WME עם סיומת אחרת (12 b / 12bis): יש לבדוק.</p><p>&#x26A0; מסמן שם ב-BAN שאף מקטע ברשות אינו נושא.</p>',
            hLimitsT: 'כדאי לדעת',
            hLimitsB: "<p>מחוז שלם לוקח כמה דקות: ה-BAN נקרא רשות אחר רשות, ו-WME בריבועים של כ-5 ק\"מ. הכפתור עצירה מפסיק את הפעולה; מה שכבר נעשה נשאר מוצג, ואפשר לנסות שוב רק את הרשויות שנכשלו.</p><p>פריז, מרסיי וליון נקראות רובע אחר רובע. אף תוצאה אינה נשמרת: סגירת WME מוחקת אותן. רק ההעדפות (תחום, מתגים, מיקום החלון, צבעי הנקודות) נשארות בדפדפן.</p>",
            hSafeB: "הסקריפט משנה את המפה רק לפי בקשה: הכפתור «הוספת המספרים», השמור לעורכי L6, מציב מספרים ולעולם אינו שומר אותם. הוא קורא את WME ואת ה-BAN; התוצאות נשארות בדפדפן זה.",
            lnkDiscuss: 'שרשור ב-Discuss',
            majBtn: v => 'גרסה ' + v + ' זמינה',
            majInstall: 'התקנה',
            close: 'סגירה',
            dragTip: 'גררו כדי להזיז · לחיצה כפולה מחזירה למקום',
            modeHere: 'מרכז המפה',
            modeCommune: 'רשות אחרת',
            modeDep: 'מחוז',
            modeLbl: 'תחום',
            hereHint: 'הרשות שמתחת למרכז המפה, בעת תחילת הניתוח.',
            searchPh: 'שם, מיקוד או קוד INSEE',
            searchNone: 'לא נמצאה רשות',
            depChoose: 'בחירת מחוז',
            analyse: 'ניתוח',
            stop: 'עצירה',
            stLocate: 'מחפש את הרשות…',
            stBan: 'BAN: קורא…',
            stBanMo: mo => 'BAN: קורא… ' + mo + ' MB',
            stWme: (i, n) => 'WME: ריבוע ' + i + '/' + n,
            stHn: 'WME: מספרי בתים…',
            stCalc: 'מחשב…',
            stDep: (i, n, nom) => 'רשות ' + i + '/' + n + ' — ' + nom,
            stDone: s => 'הסתיים תוך ' + s + ' שנ\'',
            stStopped: 'נעצר',
            errNoCommune: 'אין רשות צרפתית מתחת למרכז המפה.',
            errPick: 'בחרו קודם רשות.',
            errPickDep: 'בחרו קודם מחוז.',
            errBan: 'ה-BAN אינו מונה אף כתובת לרשות הזו.',
            errNet: m => 'שגיאת רשת: ' + m,
            errWme: 'WME לא הגיב: ',
            errGrant: 'מנהל הסקריפטים סירב לבקשת הרשת (בדקו את ההרשאות של הסקריפט).',
            emptyIntro: 'בחרו תחום והתחילו את הניתוח.',
            kBan: 'כתובות BAN',
            kCert: n => n + ' מאושרות',
            kWme: 'נמצאו ב-WME',
            kHnRpp: (h, r) => h + ' HN · ' + r + ' RPP',
            kMiss: 'חסרות',
            kExtra: 'עודפות ב-WME',
            kDup: n => n + ' כפולים',
            kCov: 'כיסוי',
            voiesLine: (c, n) => c + ' רחובות מלאים מתוך ' + n,
            vNoName: n => n + ' ללא שם',
            vOtherName: n => n + ' בשם אחר',
            vNoSeg: n => n + ' ללא מקטע',
            fAll: 'הכל',
            fTodo: 'חלקיים',
            fName: 'שם לבדיקה',
            fDone: 'מלאים',
            filterPh: 'סינון רחובות',
            layerSwitch: 'פערים',
            exportCsv: 'ייצוא CSV',
            thStreetBan: 'רחוב BAN',
            thStreetWme: 'רחוב WME',
            thBan: 'BAN',
            thWme: 'WME',
            thGap: 'פער',
            thCommune: 'רשות',
            thMiss: 'חסר',
            nameNone: 'ללא שם',
            nameNoSeg: 'אין מקטע',
            tipSame: 'המקטעים הקרובים נושאים את השם של ה-BAN',
            tipOther: 'המקטעים הקרובים נושאים שם אחר',
            tipAbsent: 'אף מקטע ברשות אינו נושא את השם הזה',
            missingT: 'מספרים חסרים',
            noneMissing: 'שום דבר לא חסר ברחוב הזה.',
            tipGo: 'הצגה על המפה',
            extraT: n => 'מספרים ב-WME ללא כתובת BAN (' + n + ')',
            dupT: n => 'מספרים שמופיעים פעמיים ב-WME (' + n + ')',
            noStreet: 'אין רחוב מתאים.',
            depBack: 'חזרה למחוז',
            tipHN: 'מספר בית על מקטע',
            tipRPP: 'נקודת מגורים (RPP)',
            errCommune: 'נכשל',
            showFound: 'קיימות',
            hovDist: m => 'המספר ב-WME במרחק ' + m + ' מ׳',
            sbMap: "מפה",
            sbHover: "פרטים במעבר עכבר",
            sbHoverHint: "עצרו את הסמן על נקודה במפה: הכתובת, המצב והאישור שלה יופיעו.",
            sbColors: "צבעים",
            sbColorsReset: "צבעי ברירת מחדל",
            legColMap: "מפת הרשויות",
            tipColMap: "צבע מפת המחוז: 5 הגוונים נגזרים ממנו, הבהיר ביותר לפחות מכוסים.",
            tipColPoint: "צבע הנקודות האלה במפה.",
            hovMissing: "חסר ב-WME",
            hovFound: k => 'נמצא ב-WME (' + k + ')',
            hovExtra: "מספר ב-WME ללא כתובת BAN",
            hovCert: "כתובת מאושרת על ידי הרשות",
            hovNotCert: "כתובת שאינה מאושרת על ידי הרשות",
            hovWmeStreet: r => 'רחוב ב-WME: ' + r,
            sizeTip: "הגדלה / שחזור של החלון",
            searching: "מחפש…",
            tipAnalyse: "ניתוח האזור שנבחר. אם כבר נסרק, התאריך שלו מוצג קודם, עם פתיחה או הרצה מחדש.",
            tipAnalyseCom: c => "ניתוח מחדש של " + c + ", היישוב המוצג, ועדכון השורה שלו במחוז. כדי לסרוק את כל המחוז, חזרו אליו קודם.",
            tipStop: "עצירת הניתוח הנוכחי. מה שכבר נעשה נשאר מוצג ושמור.",
            tipModeCommune: "בחירת רשות לפי שם, מיקוד או קוד INSEE.",
            tipModeDep: "ניתוח כל הרשויות של מחוז.",
            tipFDone: "הרחובות שכל כתובות ה-BAN שלהם נמצאות ב-WME.",
            tipFAll: "כל הרחובות של הרשות.",
            tipSort: "מיון לפי עמודה זו; לחיצה שנייה הופכת את הסדר.",
            tipDepBack: "חזרה לרשימת הרשויות של המחוז, בלי להריץ שוב את הניתוח.",
            tipCsv: "הורדת דוח הרשות, כתובת אחר כתובת, כקובץ CSV (גיליון).",
            tipCsvDep: "הורדת שורה לכל רשות במחוז, כקובץ CSV (גיליון).",
            tipNext: "מרכוז המפה על המספר החסר הבא ברחוב, ואז ברחוב החסר הבא.",
            tipRetry: "הרצה מחדש רק של הרשויות שהניתוח שלהן נכשל.",
            tipCmpStop: "הסרת ההשוואה המוצגת; הסריקה נשארת.",
            tipRefresh: "סריקה מחדש של הרשות; התוצאה החדשה מושווית לקודמת.",
            tipRefreshN: "סריקה מחדש רק של הרשויות המסומנות (BAN או WME השתנו מאז); מושווה לסריקה הקודמת.",
            tipMemoOpen: "פתיחת החלון על סריקה זו והתאמת המפה אליה.",
            tipMemoClear: "מחיקת כל הסריקות השמורות בדפדפן זה (שתי לחיצות).",
            tipSbOpen: "פתיחת חלון WBC (כמו הכפתור מימין למפה).",
            tipColorsReset: "איפוס צבעי הנקודות לברירת המחדל.",
            tipHelpHdr: "פתיחה או סגירה של חלק זה בעזרה.",
            tipFab: "פתיחה או סגירה של החלון",
            tipVoie: "פתיחת הרחוב (המספרים שלו, החסרים באדום) והתאמת המפה אליו.",
            tipCommune: "פתיחת פרטי הרשות והתאמת המפה אליה.",
            memoBanBtn: "בדיקת BAN",
            memoBanTip: "בדיקה, רשות אחר רשות, אם ה-BAN השתנה מאז הסריקה (בקשה קטנה לכל אחת). שום דבר לא נסרק מחדש.",
            memoBanUpd: "עדכוני BAN",
            copyBtn: "העתקה",
            copyTip: "העתקת שיעור הכיסוי ללוח, בעיצוב ל-Discord.",
            copyDone: "הועתק",
            copyFail: "ההעתקה נכשלה",
            copyTitre: lieu => '📊 **כיסוי כתובות BAN ב-WME — ' + lieu + '**',
            copyAdr: (p, b, c) => 'כתובות שנמצאו ב-WME: **' + p + ' / ' + b + ' (' + c + ')**',
            copyCommunes: (n, tot, d) => 'רשויות שנותחו: ' + n + '/' + tot + ' · סריקה מ־' + d,
            copyCert: "כתובות מאושרות בלבד",
            foldTip: "מזעור החלון",
            unfoldTip: "הרחבת החלון",
            dejaCommune: d => 'נותח כבר ב־' + d,
            dejaDep: (d, n, total) => 'נותח כבר ב־' + d + ' (' + n + '/' + total + ' רשויות)',
            dejaViaDep: c => 'עם המחוז ' + c,
            dejaOpenTip: "מציג את הסריקה הזו מיד, בלי להריץ שוב את הניתוח.",
            dejaRelaunch: "הרצה מחדש",
            dejaRelaunchTip: "מריץ שוב את כל הניתוח; הסריקה השמורה משמשת בסיס להשוואה.",
            lastMissing: "אין עוד מספר חסר בטבלה.",
            retryFailed: n => 'נסו שוב את ' + n + ' הרשויות שנכשלו',
            stDoneErr: (s, n) => 'הסתיים תוך ' + s + ' שנ׳ — ' + n + ' רשויות נכשלו',
            noCert: n => 'אף אחת מ-' + n + ' כתובות ה-BAN של הרשות אינה מאושרת.',
            errSession: "פג תוקף ההתחברות ל-WME: טענו את הדף מחדש.",
            errFormat: src => src + ' ענה בפורמט לא צפוי: יש לעדכן את הסקריפט.',
            delNote: "לא ניתן לשייך לרשות מאוחדת",
            mapCap: (a, b) => 'מפה: מוצגות ' + a + ' נקודות מתוך ' + b + ' בתצוגה (התקרבו כדי לראות את כולן)',
            legExtra: "עודף ב-WME",
            legFound: "נמצא",
            legMiss: "חסר",
            articleTag: "מילית",
            tipArticle: "רק מילית שונה (de, la, du…)",
            orthoTag: "כתיב",
            tipOrtho: "הכתיב שונה באות או שתיים",
            partielTag: "חלקי",
            tipPartiel: "שם אחד הוא קיצור של האחר",
            absentTag: "חסר ב-WME",
            altTag: "חלופי",
            tipAlt: p => "השם מה-BAN מופיע כשם חלופי; השם הראשי: " + p,
            routeTag: "מס׳ כביש",
            tipRoute: "השם הראשי הוא מספר כביש, ושם ה-BAN אינו בין השמות החלופיים",
            typeTag: "סוג",
            tipType: "רק סוג הרחוב שונה",
            vAlt: n => n + ' בשם חלופי',
            vRoute: n => n + ' תחת מספר כביש',
            vType: n => n + ' בשם דומה',
            kSuf: n => 'מהן ' + n + ' סיומות לבדיקה',
            tipSuf: w => "ב-WME מופיע " + w + ": יש לבדוק את הסיומת",
            certOnly: 'מאושרות',
            certNote: n => 'כתובות מאושרות בלבד: ' + n + ' לא מאושרות הושמטו',
            nextMissing: "החסר הבא",
            eta: m => '≈ ' + m + ' דק׳ נותרו',
            etaSoon: "פחות מדקה",
            delAll: "כל הרשויות המאוחדות",
            depMap: 'מצולעי רשויות',
            legNoData: 'לא נותח',
            hovCom: (ban, wme, miss) => 'BAN ' + ban + ' · WME ' + wme + ' · חסרים ' + miss,
            hovComClick: 'לחיצה (במפה מוקטנת) פותחת אותה',
            hovProbSeg: (id, d) => 'מקטע סביר: ' + id + ' (' + d + ' מ׳)',
            selSegs: n => 'בחירת המקטעים (' + n + ')',
            selSegsTip: 'בוחר ב-WME את המקטעים שנושאים את הכתובות של רחוב זה',
            selSegsPart: (a, b) => a + '/' + b + ' מקטעים נבחרו: האחרים אינם טעונים — יש להתקרב לרחוב.',
            selSegsNone: 'אף מקטע של רחוב זה אינו טעון ב-WME: יש להתקרב ולנסות שוב.',
            ajHnAdd: n => 'הוספת המספרים (' + n + ')',
            nextStreet: n => 'הרחוב הבא (' + n + ' להוספה)',
            tipNextStreet: 'פותח את הרחוב ברשות שבו ל«הוספה» יש הכי הרבה מספרים להציב (שם ה-BAN כשם ראשי או חלופי), ומדלג על רחובות שכבר נפתחו בכפתור זה.',
            nextStreetNone: 'אין עוד רחוב מוכן: לרחובות הנותרים כבר יש מספרים, או שיש לתקן קודם את שמם.',
            ajHnAddTip: r => 'L6 בלבד: מציב ב-WME את המספרים החסרים ברחוב זה, על המקטעים ששמם הראשי זהה בדיוק לשם ב-BAN (למעט סימנים דיאקריטיים ואותיות רישיות) ושהעיר שלהם היא הרשות או «כפר (רשות)». לכל היותר 150 מספרים בשעה נעה, נספרים בשמירה (נותרו ' + r + '). דבר אינו נשמר: יש לבדוק ואז לשמור ב-WME. מחוץ ליישוב (שם ראשי ללא עיר, שם ה-BAN עם הרשות כשם חלופי), הכתובת הופכת למקום מגורים (RPP) — אותה המרה כמו ⚡ של WME Naming Auditor — ונספרת במכסה.',
            ajHnNoName: 'שם הרחוב ב-WME אינו השם ב-BAN: הוספה אוטומטית דורשת שם ראשי זהה לשם ב-BAN.',
            ajHnNone: 'לא ניתן להוסיף אוטומטית אף מספר ברחוב זה.',
            ajHnQuota: h => 'המכסה נוצלה (150 מספרים בשעה): ההוספה הבאה אפשרית בשעה ' + h + '.',
            ajHnRunning: 'מוסיף את המספרים…',
            bgTab: 'הלשונית ברקע: Chrome מאט את העבודה הנוכחית (עד פי 3). כדאי להשאיר את הלשונית הזו בחזית.',
            bgTabTip: 'Chrome מגביל את הטיימרים של לשונית מוסתרת (אחד בשנייה, ואחרי 5 דקות אחד בדקה) ומוריד את העדיפות שלה. נמדד ב־29/09/2026: מחוז שלם ב־41 דקות ברקע לעומת 13 דקות בחזית.',
            ajHnDone: (n, r) => (un1(n) ? 'מספר אחד הוצב' : n + ' מספרים הוצבו') + ' — יש לבדוק ואז לשמור ב-WME. יתרת המכסה: ' + r + '.',
            ajHnAddMix: (n, r) => 'הוספה (' + n + ' מספרים · ' + r + ' RPP)',
            ajHnDoneMix: (n, r, q) => n + ' מספרים ו-' + r + ' RPP הוצבו — יש לבדוק ואז לשמור ב-WME. יתרת המכסה: ' + q + '.',
            ajHnDoneRpp: (r, q) => (un1(r) ? 'RPP אחד הוצב' : r + ' RPP הוצבו') + ' — יש לבדוק ואז לשמור ב-WME. יתרת המכסה: ' + q + '.',
            ajRppCrit: l => '⚠️ לתיקון ידני: ' + l + '.',
            ajRppCritHn: n => 'מספר ' + n + ' נשאר מספר בית על מקטע מחוץ ליישוב',
            ajRppCritPoi: n => 'RPP ' + n + ' נשאר ללא כתובת',
            ajRppCritDbl: n => 'כתובת ' + n + ' כפולה (מספר + RPP)',
            ajHnSansAlt: (r, c) => 'חלק מהמקטעים מחוץ ליישוב נושאים את «' + r + '» ללא עיר אך ללא השם החלופי «' + r + ' / ' + c + '»: לא יוצב שם RPP כל עוד הוא חסר.',
            ajHnSansAltRoute: (r, c) => 'לחלק מהמקטעים מחוץ לשטח הבנוי יש מספר כביש כשם ראשי, ללא עיר, אך אין להם השם החלופי „' + r + ' / ' + c + '”: לא יוצב שם RPP כל עוד הוא חסר.',
            ajHnSkip: n => (un1(n) ? 'כתובת אחת דולגה' : n + ' כתובות דולגו') + ' (פרטים במסוף).',
            ajHnNoSeg: 'אף מקטע טעון אינו נושא בדיוק שם זה כשם ראשי עם הרשות כעיר: דבר לא הוצב.',
            ajHnErr: m => 'ההוספה הופסקה: ' + m,
            ajHnRights: 'שמור לעורכי L6.',
            ajHnSee: n => un1(n) ? 'הוא מוקף בטורקיז על המפה.' : 'הם מוקפים בטורקיז על המפה.',
            ajHnPoseTip: 'הוצב על ידי WBC, טרם נשמר: יש ללחוץ כדי למרכז את המפה עליו.',
            ajHnSaved: (c, r, q) => 'שמירה: ' + (un1(c) ? 'מספר אחד נספר' : c + ' מספרים נספרו') + ', ' + r + ' הוחזרו למכסה (הוסרו לפני השמירה). יתרת המכסה: ' + q + '.',
            ajHnSavedTip: 'הוצב על ידי WBC ונשמר.',
            hHnT: 'הוספת המספרים (L6)',
            hHnB: '<p>שמור לעורכי <b>L6</b>. בשורה הפתוחה של רחוב, <i>הוספת המספרים</i> מציבה ב-WME את הכתובות החסרות שלו — <b>רחוב אחר רחוב</b>, לעולם לא לרשות שלמה. למספר בודד: ה־„+” שעל התווית שלו (במעבר העכבר), או לחיצה על הנקודה שלו במפה.</p><p><b>תנאים</b>: השם הראשי של המקטעים זהה בדיוק לשם ב-BAN (רק סימנים דיאקריטיים, אותיות רישיות, גרשים ורווחים נסבלים) והעיר שלהם היא הרשות או «כפר (רשות)». כל מספר מוצב על המקטע המותר הקרוב ביותר (80 מ׳ לכל היותר); מספר שכבר קיים, גם אם טרם נשמר, לעולם אינו מוצב שוב; סיומת שונה או מספרית נשארת לעורך.</p><p><b>דבר אינו נשמר</b>: המספרים שהוצבו מוקפים בטורקיז על המפה (גם כשהחלון סגור) ומסומנים ✚ ברחוב; יש לבדוק אותם ואז לשמור או לבטל ב-WME.</p><p><b>מכסה</b>: 150 מספרים בשעה נעה. מספר נשמר במכסה בעת ההצבה, ונספר אם הוא נמצא בשרת אחרי השמירה; אם הוסר או שונה לפני כן, הוא מוחזר. מספרים שהוקלדו ידנית לעולם אינם נספרים. לאחר השמירה הם עוברים ל«נמצאו» בלי להריץ שוב את הניתוח; סריקה שמורה ישנה יותר מציינת זאת («הרצה מחדש»).</p><p><b>מחוץ ליישוב</b>: על מקטע שלשמו הראשי אין עיר ושנושא את שם ה-BAN עם הרשות כשם חלופי, הכתובת הופכת ל<b>מקום מגורים (RPP)</b> — אותה המרה כמו ⚡ של WME Naming Auditor: מקום שנוצר במקום המספר, הכתובת שלו, נקודת הכניסה של המספר נשמרת, המספר מוסר; שלב שנכשל מבוטל. הכפתור מציג אז את שני המניינים, מספרים ו-RPP; ה-RPP נספרים במכסה.</p>',
            ajHnQuotaTip: 'שעה נעה: מספר נספר במשך שעה מרגע הצבתו. נספרים רק מספרים שהוצבו בכפתור זה ונשמרו בפועל.',
            ajHnLeft: n => 'מכסה: נותרו ' + n + ' בשעה זו',
            ajHnFull: h => 'המכסה נוצלה — ההוספה הבאה בשעה ' + h,
            ajHn1: 'הוספת המספר הזה',
            ajHn1Tip: 'ל־L6 בלבד: מציב ב־WME רק את המספר הזה, עם הבדיקות של „הוספת המספרים” (שם BAN, עיר, מקטע בטווח 80 מ׳); נספר במכסה. דבר אינו נשמר.',
            ajHn1Exists: n => 'המספר ' + n + ' כבר קיים ב־WME ברחוב הזה: לא הוצב דבר.',
            ajHn1Far: n => 'אין מקטע מאושר (שם BAN, עיר נכונה) בטווח 80 מ׳ מהמספר ' + n + ': לא הוצב דבר.',
            tipGoAdd: 'הצגה על המפה. במעבר העכבר, „+” מוסיף רק את המספר הזה.',
            cmpBtn: 'השוואה',
            cmpTip: 'טעינת CSV שיוצא קודם עבור אותה רשות או אותו מחוז: מוצגת ההתקדמות מאז.',
            cmpLine: (d, w, m, x) => 'מאז הייצוא של ' + d + ': ' + w + ' ב-WME · ' + m + ' חסרים · ' + x + ' עודפים',
            cmpStop: 'הפסקת ההשוואה',
            cmpWrong: 'ייצוא זה שייך לרשות או למחוז אחר.',
            cmpBad: 'קובץ זה אינו ייצוא של WME BAN Coverage.',
            cmpCert: 'בייצוא הייתה הגדרה אחרת של „מאושרות בלבד“: אי אפשר להשוות את המספרים.',
            thDelta: 'Δ',
            thDeltaTip: d => 'שינוי ב-WME מאז הייצוא של ' + d,
            namesCsv: 'פערים (CSV)',
            namesCsvTip: 'הרחובות ששמם ב-WME שונה מה-BAN, עם המקטעים שלהם וקישור WME: לתיקון או לדיווח.',
            namesNone: 'אין פערי שמות לייצוא.',
            hTrackT: 'מעקב ודיווח',
            hTrackB: '<p><b>מפת המחוז</b>: אחרי מחוז, כל רשות צבועה לפי הכיסוי (בהיר = מעט, כהה = הרבה). ריחוף מציג את המספרים; במפה מוקטנת, לחיצה פותחת אותה.</p><p><b>מספר חסר</b>: כשהרחוב פתוח, קו מנוקד מוביל למקטע שכנראה אמור לשאת אותו; המזהה שלו מופיע ב-CSV.</p><p><b>בחירת המקטעים</b> של רחוב מהשורה שלו: הם נבחרים ב-WME.</p><p><b>התקדמות</b>: ייצוא ה-CSV משמש גם כתיעוד. מאוחר יותר, <i>השוואה</i> קורא אותו שוב ומציג את השינוי רחוב אחר רחוב (או רשות אחר רשות). דבר אינו נשמר במקום אחר.</p><p><b>פערים (CSV)</b>: הרחובות לשינוי שם, כל אחד עם קישור WME, לתיקון או לשליחה לאחראי האזור.</p>',
            certOnlyTip: "כתובות מאושרות בלבד",
            layerSwitchTip: "מספרים חסרים ועודפים על המפה",
            showFoundTip: "להציג גם את הכתובות שנמצאו",
            depMapTip: 'רשויות צבועות על המפה',
            etaShort: m => '\u2248\u00a0' + m + '\u00a0min',
            memoSweep: d => 'סריקה מ-' + d,
            memoBanWait: 'BAN: בבדיקה…',
            memoBanProg: (i, n) => 'BAN: בבדיקה ' + i + '/' + n,
            memoBanOk: 'BAN ללא שינוי',
            memoBanMaj: d => 'BAN עודכן' + (d ? ' (' + d + ')' : ''),
            memoBanMajN: n => 'BAN עודכן: ' + n,
            memoBanErr: 'BAN: הבדיקה נכשלה',
            dejaHnDepuis: n => (un1(n) ? 'מספר אחד נוסף' : n + ' מספרים נוספו') + ' על ידי WBC מאז: יש להפעיל מחדש',
            memoWmeBtn: 'בדיקת WME',
            memoWmeTip: 'קורא מחדש את האזור, כולל מספרי הבתים, ומשווה לסריקה: מקטעים (מספר ותאריך), כל מספר בית (מזהה, ערך, מקטע, מיקום) ונקודות מגורים.',
            memoWmeProg: (i, n) => 'WME: בבדיקה ' + i + '/' + n,
            memoWmeOk: 'WME ללא שינוי',
            memoWmeMaj: d => 'WME נערך' + (d ? ' (' + d + ')' : ''),
            memoWmeMajN: n => 'WME נערך: ' + n,
            memoRefresh: 'רענון',
            memoRefreshN: n => 'רענון המסומנות (' + n + ')',
            memoTagBan: 'BAN עודכן מאז הסריקה',
            memoTagWme: 'WME נערך מאז הסריקה',
            cmpLineMemo: (d, w, m, x) => 'מאז הסריקה מ-' + d + ': ' + w + ' ב-WME · ' + m + ' חסרים · ' + x + ' עודפים',
            secMemo: 'סריקות שמורות',
            memoHint: 'נשמרות בדפדפן זה בלבד. פתיחה מחדש מציגה מיד ובודקת אם ה-BAN השתנה מאז.',
            memoNone: 'אין עדיין סריקה שמורה.',
            memoOpen: 'פתיחה',
            memoDel: 'מחיקת סריקה זו',
            memoClear: 'מחיקת הכול',
            memoErr: m => 'לא ניתן היה לשמור את הסריקה: ' + m,
            hMemoT: 'סריקות שמורות ועדכונים',
            hMemoB: '<p>כל סריקה נשמרת בדפדפן זה (דבר אינו נשלח). בחירה חוזרת של אותה רשות או אותו מחוז, או <i>פתיחה</i> בלשונית הסקריפטים, מציגה אותה מיד עם התאריך. גם <i>ניתוח</i> מזכיר זאת: אם אותו אזור כבר נסרק, התאריך שלו מוצג עם <i>פתיחה</i> ו<i>הרצה מחדש</i>. אם WBC הוסיף מספרים באזור זה מאז, ההודעה מציינת זאת ו<i>הרצה מחדש</i> הופך לכפתור הראשי.</p><p><b>BAN</b>: קובץ הכתובות של כל רשות מושווה לזה של הסריקה — אוטומטית לרשות אחת (בקשה אחת), ועם <i>בדיקת BAN</i> למחוז (בקשה לכל רשות; שום דבר לא נסרק מחדש). <b>WME</b>: <i>בדיקת WME</i> קוראת מחדש את האזור, כולל מספרי הבתים: מקטעים (מספר ותאריך), כל מספר בית (מזהה, ערך, מקטע, מיקום — למספרים אין תאריך ב-WME, והוספת מספר אינה משנה את תאריך המקטע שלו) ונקודות מגורים.</p><p>רשויות מסומנות נושאות תווית BAN או WME ומתאר כתום על המפה; <i>רענון</i> סורק מחדש רק אותן. הסריקה החדשה מושווית אוטומטית לקודמת.</p>',
            memoClearSure: 'לחיצה נוספת למחיקת הכול',
        },
    };

    // Seul « br » distingue le portugais brésilien ; d'anciens navigateurs rendent encore
    // « iw » pour l'hébreu.
    const detectLang = () => {
        try {
            const l = (pw.W?.userscripts?.state?.locale || document.documentElement.lang || navigator.language || 'en').toLowerCase();
            if (l.startsWith('pt')) return l.includes('br') ? 'pt-BR' : 'pt-PT';
            if (l.startsWith('he') || l.startsWith('iw')) return 'he';
            return ['fr', 'de', 'es', 'it', 'en'].find(c => l.startsWith(c)) || 'en';
        } catch (e) { return 'en'; }
    };
    let _lang = 'en';
    const t = (key, ...args) => {
        const v = (DICO[_lang] && DICO[_lang][key]) || DICO.en[key];
        if (typeof v === 'function') return v(...args);
        return v !== undefined ? v : key;
    };
    // Nombres et pourcentages dans la langue du SCRIPT, pas dans celle du navigateur.
    const LOCALES = { en: 'en', fr: 'fr-FR', de: 'de-DE', es: 'es-ES', it: 'it-IT', 'pt-BR': 'pt-BR', 'pt-PT': 'pt-PT', he: 'he-IL' };
    let nf = null, pf = null;
    const nb = n => (nf || (nf = new Intl.NumberFormat(LOCALES[_lang] || 'en'))).format(n);
    const pct = (a, b) => (pf || (pf = new Intl.NumberFormat(LOCALES[_lang] || 'en', { style: 'percent', maximumFractionDigits: 1 }))).format(b ? a / b : 0);

    // ==WBC-CORE== — le calcul, sans rien toucher à la page : le banc l'extrait du fichier servi
    // et le fait tourner sous Node.
    const Core = (() => {
        // Les globales des boucles chaudes, liées UNE fois : dans le bac à sable du gestionnaire de
        // scripts, chaque `Math.…` ou `Infinity` d'une boucle traverse sa couche d'interception de
        // la portée globale (Nîmes : calcul ~10 fois plus lent que le même code sous Node, 26/09).
        const { Math, Map, Set, Number, String, Date, parseFloat, Infinity, Object, Error } = globalThis;

        // ---- Numéros -------------------------------------------------------------------
        // La BAN écrit le numéro et le suffixe à part (« 12 », « bis ») et abrège quater et
        // quinquies en « qua » et « qui » ; WME porte un texte libre (« 12bis », « 12 BIS »,
        // « 12-b »). On ramène les deux à « 12bis ». Une lettre (« 12b ») reste distincte de
        // « bis » : ce ne sont pas les mêmes adresses.
        const SUFFIXES = { quater: 'qua', quinquies: 'qui' };
        function normNum(n, suffixe) {
            // Un suffixe CHIFFRÉ (« 5 » + « 3 », 46 cas à Arles) ne se colle pas au numéro : « 5 3 »
            // n'est pas « 53 » (audit du 26/09, M5).
            const sf = String(suffixe || '').trim();
            if (/^\d/.test(sf)) return normNum(n) + '/' + sf.toLowerCase().replace(/\s+/g, '');
            const s =(String(n == null ? '' : n) + ' ' + (suffixe || '')).toLowerCase()
                .normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[\s\-_.\/]+/g, '');
            const m = /^0*(\d+)([a-z]*)$/.exec(s);
            if (!m) return s || null;
            return m[1] + (SUFFIXES[m[2]] || m[2]);
        }

        // ---- Noms de voies -------------------------------------------------------------
        // Mêmes abréviations que Draw Borders France, appliquées aux deux côtés : un nom WME
        // saisi « Av. Foch » se compare à « Avenue Foch » de la BAN.
        const ABREV = {
            av: 'avenue', ave: 'avenue', bd: 'boulevard', bld: 'boulevard', bvd: 'boulevard', r: 'rue', pl: 'place', ch: 'chemin',
            chem: 'chemin', imp: 'impasse', rte: 'route', all: 'allee', crs: 'cours', fg: 'faubourg', qu: 'quai', sq: 'square',
            pte: 'porte', res: 'residence', lot: 'lotissement', za: 'zone artisanale', zi: 'zone industrielle',
            st: 'saint', ste: 'sainte', mal: 'marechal', gal: 'general', pdt: 'president', dr: 'docteur', prof: 'professeur',
        };
        function normNom(nom) {
            if (!nom) return '';
            return String(nom).toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
                .replace(/\u0153/g, 'oe').replace(/\u00e6/g, 'ae')
                .replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean)
                .map(m => ABREV[m] || m).join(' ');
        }

        // Un nom principal qui est un NUMÉRO de route (D979, RD 6086, N86, M65, VC 12…) : la
        // convention Waze, où le nom d'usage de la BAN va en alternatif.
        const ROUTE_RE = /^\s*(?:[ADNMCR]|RD|RN|RM|CD|CR|VC|VO)\s?-?\s?\d+\s?[a-z]?(?:\s|$|[-–—(])/i;

        // Le nom sans son type de voie ni ses articles : « Rue Olivier de Serres » et « Chemin
        // Olivier de Serres » ont le même cœur, seul le type diffère. Sur des noms déjà normés.
        const TYPES = new Set(('rue chemin avenue boulevard impasse place placette allee route cours quai square passage ' +
            'traverse sentier montee lotissement residence hameau carrefour rond point esplanade promenade voie ruelle ' +
            'venelle clos cite faubourg parvis chaussee rampe descente cote digue porte plan mail domaine quartier ' +
            'rocade corniche galerie levee berge carriere draille calade chemin rural communale vicinal').split(' '));
        const ARTICLES = new Set('de du des d la le les l au aux'.split(' '));
        function coeurNom(norm) {
            const mots = String(norm || '').split(' ').filter(Boolean);
            while (mots.length > 1 && TYPES.has(mots[0])) mots.shift();
            while (mots.length > 1 && ARTICLES.has(mots[0])) mots.shift();
            return mots.join(' ');
        }
        const PROCHES = new Set(['autreType', 'autreArticle', 'orthographe', 'nomPartiel']);
        const typeDe = norm => { const m = String(norm || '').split(' ')[0]; return TYPES.has(m) ? m : ''; };

        // Distance d'édition (insertions, suppressions, substitutions) entre deux cœurs de nom :
        // « brugiere » / « bruguiere » = 1. Bornée : au-delà de `max`, la valeur exacte importe peu.
        function distanceEdition(a, b, max) {
            if (Math.abs(a.length - b.length) > max) return max + 1;
            let prec = Array.from({ length: b.length + 1 }, (_, j) => j);
            for (let i = 1; i <= a.length; i++) {
                const cour = [i];
                let minLigne = i;
                for (let j = 1; j <= b.length; j++) {
                    cour[j] = Math.min(prec[j] + 1, cour[j - 1] + 1, prec[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
                    minLigne = Math.min(minLigne, cour[j]);
                }
                if (minLigne > max) return max + 1;
                prec = cour;
            }
            return prec[b.length];
        }

        // Deux noms normés qui ne sont pas égaux : en quoi diffèrent-ils ? Du plus anodin au plus lourd.
        //   autreArticle  « Rue Pélisserie » / « Rue de la Pelisserie »
        //   autreType     « Rue Olivier de Serres » / « Chemin Olivier de Serres »
        //   orthographe   « Henri Brugière » / « Henri Bruguière » (1 lettre pour 8)
        //   nomPartiel    « Place Bosc » / « Place Adolphe Bosc » (tous les mots de l'un dans l'autre)
        //   different     tout le reste
        function ecartNoms(ban, wme) {
            const cb = coeurNom(ban), cw = coeurNom(wme);
            if (cb && cb === cw) return typeDe(ban) === typeDe(wme) ? 'autreArticle' : 'autreType';
            const max = Math.max(1, Math.floor(Math.min(cb.length, cw.length) / 8));
            if (cb.length >= 4 && cw.length >= 4 && distanceEdition(cb, cw, max) <= max) return 'orthographe';
            const mb = cb.split(' ').filter(m => !ARTICLES.has(m)), mw = cw.split(' ').filter(m => !ARTICLES.has(m));
            const dans = (x, y) => x.length && x.every(m => y.includes(m));
            if (dans(mb, mw) || dans(mw, mb)) return 'nomPartiel';
            // Nom TRONQUÉ : « Chemin de Saint-Siff » dans WME pour « Chemin de Saint-Siffret » (Uzès, 26/09).
            const court = cb.length < cw.length ? cb : cw, long = court === cb ? cw : cb;
            if (court.length >= 6 && long.startsWith(court)) return 'nomPartiel';
            return 'different';
        }

        // ---- Fichier BAN (format BAL, un fichier par commune) --------------------------
        // Colonnes lues par leur NOM, jamais par leur rang. Le fichier est en CRLF.
        // Les lignes une \u00E0 une : garder le tableau de TOUTES les lignes avant de les lire faisait un pic
        // de ~158 Mo pour les 8,7 Mo de la BAN de N\u00EEmes (audit du 26/09, M25).
        const lignesCsv = function* (texte) {
            let champ = '', ligne = [], guill = false;
            for (let i = 0; i < texte.length; i++) {
                const c = texte[i];
                if (guill) {
                    if (c === '"') { if (texte[i + 1] === '"') { champ += '"'; i++; } else guill = false; }
                    else champ += c;
                } else if (c === '"') guill = true;
                else if (c === ';') { ligne.push(champ); champ = ''; }
                else if (c === '\n' || c === '\r') {
                    if (c === '\r' && texte[i + 1] === '\n') i++;
                    ligne.push(champ); champ = '';
                    if (ligne.length > 1 || ligne[0] !== '') yield ligne;
                    ligne = [];
                } else champ += c;
            }
            if (champ !== '' || ligne.length) { ligne.push(champ); yield ligne; }
        }
        const lireCsv = texte => [...lignesCsv(texte)];
        function lireBan(texte) {
            const l = lignesCsv(texte);
            const tete = l.next();
            if (tete.done) return { adresses: [], ignorees: 0, reserve: 0 };
            const h = tete.value.map(x => x.trim().replace(/^\uFEFF/, ''));
            const col = n => h.indexOf(n);
            const c = {
                uid: col('uid_adresse'), cle: col('cle_interop'), voie: col('voie_nom'), num: col('numero'), suf: col('suffixe'), lon: col('long'), lat: col('lat'),
                cert: col('certification_commune'), del: col('commune_deleguee_nom'),
            };
            if (c.voie < 0 || c.num < 0 || c.lon < 0 || c.lat < 0) throw Object.assign(new Error('BAN : colonnes attendues absentes (' + h.join(', ') + ')'), { format: true, source: 'ban' });
            // Qu'est-ce qu'UNE adresse ? (audit du 26/09, mesuré sur Cherbourg-en-Cotentin)
            //  - une adresse a plusieurs lignes quand elle a plusieurs positions (entrée, bâtiment) :
            //    elles partagent l'identifiant @a de uid_adresse ; une seule compte ;
            //  - la cle_interop NE suffit PAS : dans une commune nouvelle, elle revient pour des
            //    adresses de communes déléguées différentes, à des kilomètres (27 858 clés pour 28 314
            //    adresses à Cherbourg : 456 adresses perdues en dédoublonnant par la clé) ;
            //  - mais deux @a de même clé à moins de FUSION_M sont un doublon de la BAN elle-même (78 à
            //    Cherbourg) : garder les deux ferait un « manquant » impossible à combler.
            // Sans colonne uid_adresse, repli sur la cle_interop.
            const FUSION_M = 150;
            const vues = new Set();
            const parCle = new Map();
            const adresses = [];
            let ignorees = 0;
            for (const r of l) {
                const num = (r[c.num] || '').trim();
                const lon = parseFloat(r[c.lon]), lat = parseFloat(r[c.lat]);
                // 99999 : voie ou lieu-dit sans numéro, pas une adresse.
                if (!num || num === '99999' || !Number.isFinite(lon) || !Number.isFinite(lat)) { ignorees++; continue; }
                const suffixe = c.suf >= 0 ? (r[c.suf] || '').trim() : '';
                const cle = c.cle >= 0 && r[c.cle] ? r[c.cle].trim() : (r[c.voie] + '|' + num + '|' + suffixe);
                const ida = c.uid >= 0 ? (/@a:([^\s"]+)/.exec(r[c.uid] || '') || [])[1] : null;
                const id = ida || cle;
                if (vues.has(id)) continue;
                vues.add(id);
                if (ida) {
                    const m = versMetres(lat);
                    const [x, y] = m(lon, lat);
                    const deja = parCle.get(cle) || [];
                    if (deja.some(p => { const [px, py] = m(p[0], p[1]); return Math.hypot(px - x, py - y) <= FUSION_M; })) continue;
                    deja.push([lon, lat]);
                    parCle.set(cle, deja);
                }
                adresses.push({
                    voie: (r[c.voie] || '').trim(),
                    deleguee: c.del >= 0 ? (r[c.del] || '').trim() : '',
                    brut: num + (suffixe ? ' ' + suffixe : ''),
                    num: normNum(num, suffixe),
                    lon, lat,
                    cert: c.cert >= 0 && (r[c.cert] || '').trim() === '1',
                });
            }
            // Numéros de RÉSERVE : des communes saisissent 9999 (ou 9991-9998) pour une adresse sans numéro
            // attribué. Mesuré le 29/09/2026 sur la BAN entière (26,1 M adresses) : 931 numéros de 9990 à
            // 9999 sur 783 voies, dont 773 où le numéro est seul. Mais une NUMÉROTATION MÉTRIQUE passe
            // aussi par là (Arles, route de Saint-Martin-de-Crau : 9098 → 10288) : on n'écarte donc un
            // 9990-9999 que s'il n'a, sur sa voie, aucun voisin de 9000 à 9989 ni de 10000 à 10999.
            // Une série de réserve à rebours (9981 → 9999) est gardée : perdre une vraie adresse est pire.
            const entier = a => parseInt(a.brut, 10);
            const voisins = new Set();
            for (const a of adresses) {
                const v = entier(a);
                if ((v >= 9000 && v <= 9989) || (v >= 10000 && v <= 10999)) voisins.add(a.voie + '|' + a.deleguee);
            }
            let reserve = 0;
            const gardees = adresses.filter(a => {
                const v = entier(a);
                if (v < 9990 || v > 9999 || voisins.has(a.voie + '|' + a.deleguee)) return true;
                reserve++;
                return false;
            });
            return { adresses: gardees, ignorees, reserve };
        }

        // ---- Géométrie (WGS84, distances locales en mètres) ----------------------------
        function versMetres(lat0) { const kx = 111320 * Math.cos(lat0 * Math.PI / 180); return (lon, lat) => [lon * kx, lat * 110540]; }
        function distSeg(px, py, ax, ay, bx, by) {
            const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
            let u = l2 === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / l2;
            u = Math.max(0, Math.min(1, u));
            return Math.hypot(px - (ax + u * dx), py - (ay + u * dy));
        }
        function dansAnneau(x, y, anneau) {
            let dedans = false;
            for (let i = 0, j = anneau.length - 1; i < anneau.length; j = i++) {
                const [xi, yi] = anneau[i], [xj, yj] = anneau[j];
                if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) dedans = !dedans;
            }
            return dedans;
        }
        // Polygon ou MultiPolygon GeoJSON, trous compris. Sans contour : tout est dedans.
        function dansContour(lon, lat, geo) {
            if (!geo) return true;
            const polys = geo.type === 'MultiPolygon' ? geo.coordinates : [geo.coordinates];
            return polys.some(p => dansAnneau(lon, lat, p[0]) && !p.slice(1).some(tr => dansAnneau(lon, lat, tr)));
        }

        // Grille de cases de CASE_M mètres : trouver le segment le plus proche d'un point sans les
        // parcourir tous. Chaque segment est converti en mètres UNE fois (`xy`) et porte sa boîte
        // englobante : dans un centre-ville, une recherche voit des centaines de segments, et la
        // version d'avant (cases de 200 m, reconversion à chaque appel) figeait la page 7,7 s à
        // Nîmes quand les noms WME ne correspondaient pas (26/09).
        // Un segment est rangé dans les cases que ses côtés TRAVERSENT (échantillonnés tous les
        // CASE_M/2 mètres), pas dans toute sa boîte : une rocade diagonale de 5 km remplissait
        // 2 500 cases. Clé numérique : plus rapide qu'une chaîne pour des centaines de milliers.
        const CASE_M = 100;
        const cle = (i, j) => (i + 1048576) * 2097152 + (j + 1048576);
        function grille(segs, m) {
            const g = new Map();
            for (const s of segs) {
                s.xy = s.coords.map(([x, y]) => m(x, y));
                let w = Infinity, so = Infinity, e = -Infinity, n = -Infinity;
                for (const [x, y] of s.xy) { w = Math.min(w, x); e = Math.max(e, x); so = Math.min(so, y); n = Math.max(n, y); }
                s.bb = [w, so, e, n];
                const cases = new Set();
                for (let k = 1; k < s.xy.length; k++) {
                    const [ax, ay] = s.xy[k - 1], [bx, by] = s.xy[k];
                    const pas = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / (CASE_M / 2)));
                    for (let q = 0; q <= pas; q++) cases.add(cle(Math.floor((ax + (bx - ax) * q / pas) / CASE_M), Math.floor((ay + (by - ay) * q / pas) / CASE_M)));
                }
                if (s.xy.length === 1) cases.add(cle(Math.floor(s.xy[0][0] / CASE_M), Math.floor(s.xy[0][1] / CASE_M)));
                for (const c of cases) { const l = g.get(c); if (l) l.push(s); else g.set(c, [s]); }
            }
            g.passage = 0;
            return g;
        }
        // Le segment le plus proche à moins de maxM ; avec `nom`, seulement parmi ceux qui le portent.
        // Seules les cases à portée de maxM sont ouvertes, et un segment dont la boîte est déjà plus
        // loin que le meilleur trouvé n'est pas parcouru.
        function plusProche(g, lon, lat, maxM, m, nom) {
            const [px, py] = m(lon, lat);
            const marque = ++g.passage;
            let best = null, bd = maxM;
            // Échantillons tous les CASE_M/2 : tout point d'un côté est à moins de CASE_M/4 de l'un
            // d'eux, d'où la marge.
            const r = maxM + CASE_M / 4;
            const i1 = Math.floor((px - r) / CASE_M), i2 = Math.floor((px + r) / CASE_M);
            const j1 = Math.floor((py - r) / CASE_M), j2 = Math.floor((py + r) / CASE_M);
            for (let i = i1; i <= i2; i++) for (let j = j1; j <= j2; j++) {
                for (const s of g.get(cle(i, j)) || []) {
                    if (s.vu === marque) continue;
                    s.vu = marque;
                    if (nom && !s.noms.has(nom)) continue;
                    const b = s.bb;
                    const dx = Math.max(b[0] - px, 0, px - b[2]), dy = Math.max(b[1] - py, 0, py - b[3]);
                    if (dx * dx + dy * dy >= bd * bd) continue;
                    const xy = s.xy;
                    for (let k = 1; k < xy.length; k++) {
                        const d = distSeg(px, py, xy[k - 1][0], xy[k - 1][1], xy[k][0], xy[k][1]);
                        if (d < bd) { bd = d; best = s; }
                    }
                }
            }
            if (!best) return null;
            // Le point du segment le plus proche (en mètres) : la carte y trace le pointillé d'une adresse
            // manquante vers son segment probable.
            let fx = best.xy[0][0], fy = best.xy[0][1], fd = Infinity;
            for (let k = 1; k < best.xy.length; k++) {
                const [ax, ay] = best.xy[k - 1], [bx, by] = best.xy[k];
                const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
                const u = l2 === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l2));
                const qx = ax + u * dx, qy = ay + u * dy, dd = Math.hypot(px - qx, py - qy);
                if (dd < fd) { fd = dd; fx = qx; fy = qy; }
            }
            return { seg: best, d: bd, fx, fy };
        }

        // ---- Le rapprochement -----------------------------------------------------------
        //  Référentiel = la BAN. Chaque voie BAN est rattachée aux segments WME qui portent ses
        //  numéros, qu'ils aient un nom ou non. Un numéro BAN est « dans WME » si un numéro
        //  identique (HN d'un segment ou RPP) se trouve à moins de RAYON_M et :
        //    1. porte le même nom de voie (rue principale ou alternative) ;
        //    2. ou est posé sur un segment rattaché à cette voie (rue sans nom, nom différent) ;
        //    3. ou est à moins de PROCHE_M de l'adresse (même numéro au même endroit).
        //  Les couples sont tranchés pour TOUTE la commune, règle 1 d'abord : sinon un « 1 » posé
        //  rue Bourgneuf part à la « rue Herbé 1 » voisine, plus proche (mesuré à Codolet, 26/09).
        const SEG_MAX_M = 80;     // au-delà, une adresse BAN n'a « aucun segment proche »
        const RAYON_M = 150;      // un même numéro plus loin est une autre adresse
        const PROCHE_M = 30;
        const MARGE_NOM = 0.003;  // ≈ 300 m : un segment du même nom au-delà est un homonyme

        function analyser(d) {
            // Durée de chaque étape, rendue avec le résultat : c'est elle qui désigne l'étape lente
            // sur une vraie commune, là où un banc ne fait que la supposer.
            const chrono = {}, top0 = Date.now();
            let topPrec = top0;
            const top = nom => { const n = Date.now(); chrono[nom] = n - topPrec; topPrec = n; };
            const lat0 = d.adresses.length ? d.adresses[0].lat : 46;
            const m = versMetres(lat0);
            const dist = (a, b) => { const [ax, ay] = m(a.lon, a.lat), [bx, by] = m(b.lon, b.lat); return Math.hypot(ax - bx, ay - by); };

            const rues = new Map();
            for (const s of d.streets || []) rues.set(s.id, { nom: s.name || '', norm: normNom(s.name) });
            const segs = [];
            const parId = new Map();
            // Les segments par nom : sans cet index, chaque voie parcourait tous les segments de la
            // commune (2 000 voies × 20 000 segments à Nîmes, la moitié du temps de calcul).
            const parNom = new Map();
            for (const s of d.segments || []) {
                const c = s.geometry && s.geometry.coordinates;
                if (!c || c.length < 2) continue;
                const ids = [s.primaryStreetID].concat(s.streetIDs || []).filter(x => x != null);
                const noms = new Set(ids.map(i => (rues.get(i) || {}).norm).filter(Boolean));
                const prim = rues.get(s.primaryStreetID) || {};
                const o = { id: s.id, coords: c, noms, nom: prim.nom || '', principal: prim.norm || '' };
                segs.push(o);
                parId.set(s.id, o);
                noms.forEach(n => { if (!parNom.has(n)) parNom.set(n, []); parNom.get(n).push(o); });
            }
            top('segments');
            const g = grille(segs, m);
            top('grille');

            // Les numéros WME
            const wme = [];
            for (const h of d.hns || []) {
                const p = h.geometry && h.geometry.coordinates;
                if (!p || h.number == null || h.number === '') continue;
                const s = parId.get(h.segID);
                wme.push({ type: 'HN', brut: String(h.number), num: normNum(h.number), lon: p[0], lat: p[1], seg: s || null, noms: s ? s.noms : new Set(), rue: s ? s.nom : '', id: h.id });
            }
            for (const v of d.rpps || []) {
                const geo = v.geometry;
                if (!geo || v.houseNumber == null || v.houseNumber === '') continue;
                let p = geo.coordinates;
                if (geo.type === 'Polygon') { const a = p[0]; p = [a.reduce((x, q) => x + q[0], 0) / a.length, a.reduce((x, q) => x + q[1], 0) / a.length]; }
                const r = rues.get(v.streetID);
                const pp = plusProche(g, p[0], p[1], SEG_MAX_M, m);
                wme.push({ type: 'RPP', brut: String(v.houseNumber), num: normNum(v.houseNumber), lon: p[0], lat: p[1], seg: pp ? pp.seg : null, noms: new Set(r && r.norm ? [r.norm] : []), rue: r ? r.nom : '', id: v.id });
            }
            // Les numéros WME par NUMÉRO ET PAR CASE de RAYON_M : une adresse ne compare plus qu'aux
            // numéros égaux de son voisinage. Indexés par le seul numéro, les « 1 », « 2 »… d'une commune
            // bien numérotée se comparaient tous entre eux (1,2 s à Nîmes numérotée à 100 %, audit M12).
            // Deux niveaux : le numéro, puis une clé NUMÉRIQUE de case (une chaîne par case et par adresse
            // coûtait ~130 ms sur 36 000 adresses peu numérotées).
            const kx = 111320 * Math.cos(lat0 * Math.PI / 180);
            const ci = lon => Math.floor(lon * kx / RAYON_M), cj = lat => Math.floor(lat * 110540 / RAYON_M);
            const cleCase = (i, j) => (i + 1048576) * 2097152 + (j + 1048576);
            const indexer = (cle, x, idx) => {
                let parCase = idx.get(cle);
                if (!parCase) idx.set(cle, parCase = new Map());
                const k = cleCase(ci(x.lon), cj(x.lat)), l = parCase.get(k);
                if (l) l.push(x); else parCase.set(k, [x]);
            };
            // Les numéros égaux dans la case de l'adresse et ses huit voisines : tout numéro à moins de
            // RAYON_M y est forcément.
            const autour = (idx, cle, lon, lat) => {
                const parCase = idx.get(cle);
                if (!parCase) return [];
                const i = ci(lon), j = cj(lat), res = [];
                for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) { const l = parCase.get(cleCase(i + di, j + dj)); if (l) for (const x of l) res.push(x); }
                return res;
            };
            const parNum = new Map();
            for (const w of wme) indexer(w.num, w, parNum);
            const autourDe = (num, lon, lat) => autour(parNum, num, lon, lat);

            top('numerosWme');
            // Les voies BAN, et les segments qui les portent
            // L'emprise de la commune (bbox), à défaut celle de ses adresses, élargie de ~300 m.
            let emp = d.emprise;
            if (!emp) {
                emp = [Infinity, Infinity, -Infinity, -Infinity];
                for (const a of d.adresses) { emp[0] = Math.min(emp[0], a.lon); emp[1] = Math.min(emp[1], a.lat); emp[2] = Math.max(emp[2], a.lon); emp[3] = Math.max(emp[3], a.lat); }
            }
            const dansEmprise = s => s.coords.some(([x, y]) => x >= emp[0] - MARGE_NOM && x <= emp[2] + MARGE_NOM && y >= emp[1] - MARGE_NOM && y <= emp[3] + MARGE_NOM);
            const nomsBan = new Set(d.adresses.map(a => normNom(a.voie)));
            // Les noms WME par « cœur + type » : « Avenue de Sembrancher » et « Avenue Sembrancher » ne diffèrent
            // que par l'ARTICLE, c'est la même voie (Saint-Laurent-des-Arbres, 29/09 : la BAN a perdu le « de », et
            // ses 32 numéros présents dans WME sortaient manquants — et en trop). Le TYPE, lui, distingue deux voies
            // (« Rue Bourgneuf » ≠ « Impasse Bourgneuf ») : il reste dans la clé.
            const cleArticle = norm => { const c = coeurNom(norm); return c ? c + '|' + typeDe(norm) : ''; };
            const parCoeur = new Map();
            for (const nom of parNom.keys()) {
                const k = cleArticle(nom);
                if (!k) continue;
                if (!parCoeur.has(k)) parCoeur.set(k, []);
                parCoeur.get(k).push(nom);
            }
            const voies = new Map();
            for (const a of d.adresses) {
                const k = normNom(a.voie) + '|' + a.deleguee;
                if (!voies.has(k)) voies.set(k, { nom: a.voie, norm: normNom(a.voie), deleguee: a.deleguee, adresses: [] });
                voies.get(k).adresses.push(a);
            }
            for (const v of voies.values()) {
                v.segs = new Set();
                const votes = new Map();
                let w = Infinity, so = Infinity, e = -Infinity, n = -Infinity;
                for (const a of v.adresses) {
                    w = Math.min(w, a.lon); e = Math.max(e, a.lon); so = Math.min(so, a.lat); n = Math.max(n, a.lat);
                    // Un segment qui porte le nom de la voie à portée l'emporte sur un plus proche
                    // qui n'en est pas (le numéro 2 d'une place tombe souvent sur la rue d'en face).
                    const pn = v.norm ? plusProche(g, a.lon, a.lat, SEG_MAX_M, m, v.norm) : null;
                    const pp = pn || plusProche(g, a.lon, a.lat, SEG_MAX_M, m);
                    // Le segment qui devrait porter l'adresse si elle manque (rendu au tracé et à l'export).
                    a.proche = pp;
                    if (!pp) continue;
                    v.segs.add(pp.seg);
                    const cle = pn ? v.norm : normNom(pp.seg.nom);
                    const vote = votes.get(cle) || { n: 0, nom: pn ? v.nom : pp.seg.nom, enAlt: 0, principaux: new Map() };
                    vote.n++;
                    // Le nom de la BAN trouvé seulement en ALTERNATIF : on retient le nom principal
                    // qui le porte, pour pouvoir le dire (« D979 », nom BAN en alternatif).
                    if (pn && pp.seg.principal !== v.norm) {
                        vote.enAlt++;
                        vote.principaux.set(pp.seg.nom, (vote.principaux.get(pp.seg.nom) || 0) + 1);
                    }
                    votes.set(cle, vote);
                }
                v.bbox = [w, so, e, n];
                // Les noms WME qui ne diffèrent du nom BAN que par l'article valent le nom BAN pour le rapprochement,
                // sauf s'ils sont eux-mêmes une voie de la BAN. L'écart de nom reste signalé (statutNom).
                v.variantes = new Set((parCoeur.get(cleArticle(v.norm)) || []).filter(nom => nom !== v.norm && !nomsBan.has(nom)));
                // Les segments du même nom (ou d'une variante d'article) tout près des numéros appartiennent aussi à la voie.
                for (const nom of [v.norm, ...v.variantes]) for (const s of parNom.get(nom) || []) {
                    if (s.coords.some(([x, y]) => x >= w - MARGE_NOM && x <= e + MARGE_NOM && y >= so - MARGE_NOM && y <= n + MARGE_NOM)) v.segs.add(s);
                }
                const gagnant = [...votes.entries()].sort((x, y) => y[1].n - x[1].n)[0];
                v.nomWme = gagnant ? gagnant[1].nom : null;
                v.nomPrincipal = '';
                if (!gagnant) v.statutNom = 'aucun';
                else if (gagnant[0] === v.norm) {
                    // Porté surtout en alternatif : le nom principal le plus fréquent est celui qu'on montre.
                    const g1 = gagnant[1];
                    if (g1.enAlt * 2 > g1.n) {
                        v.statutNom = 'alternatif';
                        v.nomPrincipal = [...g1.principaux.entries()].sort((x, y) => y[1] - x[1])[0][0];
                    } else v.statutNom = 'identique';
                }
                else if (gagnant[0] === '') v.statutNom = 'sansNom';
                else if (ROUTE_RE.test(v.nomWme)) v.statutNom = 'numeroRoute';
                // Le nom WME est celui d'une AUTRE voie de la BAN : les numéros tombent sur la voisine,
                // ce n'est pas une variante du nom (« Impasse Bourgneuf » près de « Rue Bourgneuf »).
                else if (nomsBan.has(gagnant[0])) v.statutNom = 'different';
                else v.statutNom = ecartNoms(v.norm, gagnant[0]);
                // « Absente de WME » : aucun segment de ce nom DANS L'EMPRISE DE LA COMMUNE — les carreaux
                // lus débordent de plusieurs km, un homonyme voisin ne compte pas (audit du 26/09, M3).
                v.nomAbsent = !!v.norm && !(parNom.get(v.norm) || []).some(dansEmprise);
            }

            top('voies');
            // Tous les couples (adresse, numéro WME) admissibles, tranchés règle par règle, le HN
            // avant le RPP (quand les deux portent la même adresse, le RPP est le doublon, à
            // quelques mètres près), puis au plus près ; une adresse et un numéro WME ne servent
            // qu'une fois.
            const couples = [];
            // Même nom : le nom BAN, ou une variante d'article portée par le numéro WME.
            const memeNom = (x, v) => x.noms.has(v.norm) || (v.variantes.size > 0 && [...x.noms].some(nom => v.variantes.has(nom)));
            for (const v of voies.values()) {
                for (const a of v.adresses) {
                    a.trouve = null;
                    for (const x of autourDe(a.num, a.lon, a.lat)) {
                        const dm = dist(a, x);
                        if (dm > RAYON_M) continue;
                        const regle = memeNom(x, v) ? 1 : (x.seg && v.segs.has(x.seg)) ? 2 : dm <= PROCHE_M ? 3 : 0;
                        if (regle) couples.push({ a, x, regle, dm });
                    }
                }
            }
            const rang = x => x.type === 'HN' ? 0 : 1;
            couples.sort((p, q) => p.regle - q.regle || rang(p.x) - rang(q.x) || p.dm - q.dm);
            const pris = new Set();
            for (const c of couples) {
                if (c.a.trouve || pris.has(c.x)) continue;
                c.a.trouve = c.x.type;
                // Le numéro WME retenu et sa distance : la carte trace le lien BAN → WME, la fiche le dit.
                c.a.wme = c.x;
                c.a.dm = c.dm;
                pris.add(c.x);
            }
            // Même numéro, SUFFIXE différent (« 12 b » BAN, « 12bis » WME), sur la même voie
            // (règle 1 ou 2) : l'adresse reste manquante, mais elle porte le numéro WME à vérifier,
            // et ce numéro WME n'est plus compté « en trop ».
            const base = n => (/^\d+/.exec(n || '') || [''])[0];
            // Même index par case que parNum, sur la partie chiffrée du numéro.
            const parBase = new Map();
            for (const x of wme) { if (pris.has(x)) continue; const b = base(x.num); if (b) indexer(b, x, parBase); }
            const baseAutour = (b, lon, lat) => autour(parBase, b, lon, lat);
            const suffixes = new Set();
            for (const v of voies.values()) for (const a of v.adresses) {
                if (a.trouve) continue;
                let meilleur = null, dmin = RAYON_M;
                for (const x of baseAutour(base(a.num), a.lon, a.lat)) {
                    if (suffixes.has(x) || x.num === a.num) continue;
                    const dm = dist(a, x);
                    if (dm <= dmin && (memeNom(x, v) || (x.seg && v.segs.has(x.seg)))) { meilleur = x; dmin = dm; }
                }
                if (meilleur) { a.suffixe = meilleur.brut; suffixes.add(meilleur); }
            }
            // Un numéro WME resté seul alors qu'une adresse BAN admissible existait double un
            // numéro déjà trouvé : c'est un doublon, pas un numéro en trop.
            top('couples');
            // Seules les règles 1 et 2 (même voie) font un doublon : un même numéro sur une AUTRE rue,
            // admis par la seule proximité (règle 3), est un numéro en trop (audit du 26/09, M4).
            const admissibles = new Set(couples.filter(c => c.regle <= 2).map(c => c.x));
            const dehors = wme.filter(x => !pris.has(x) && !suffixes.has(x) && dansContour(x.lon, x.lat, d.contour));
            const doublons = dehors.filter(x => admissibles.has(x));
            const enTrop = dehors.filter(x => !admissibles.has(x));

            // Adresses certifiées seulement : TOUTES les adresses ont servi au rapprochement ci-dessus
            // (le numéro WME d'une adresse non certifiée n'est donc ni « en trop » ni « en double »),
            // et les non certifiées ne sortent qu'ICI, des comptes, des voies et des manquants. Une
            // voie qui n'en garde aucune disparaît du tableau.
            const compte = a => !d.certSeules || a.cert;
            const liste = [];
            for (const v of voies.values()) {
                const gardees = v.adresses.filter(compte);
                if (!gardees.length) continue;
                const hn = gardees.filter(a => a.trouve === 'HN').length, rpp = gardees.filter(a => a.trouve === 'RPP').length;
                liste.push({
                    nom: v.nom, deleguee: v.deleguee, nomWme: v.nomWme, nomPrincipal: v.nomPrincipal, statutNom: v.statutNom, nomAbsent: v.nomAbsent,
                    ban: gardees.length, hn, rpp, presents: hn + rpp,
                    manquants: gardees.filter(a => !a.trouve).map(a => a.brut),
                    suffixes: gardees.filter(a => a.suffixe).length,
                    adresses: gardees.map(a => ({ brut: a.brut, lon: a.lon, lat: a.lat, trouve: a.trouve, suffixe: a.suffixe || '', cert: a.cert,
                        wlon: a.trouve ? a.wme.lon : null, wlat: a.trouve ? a.wme.lat : null, dm: a.trouve ? Math.round(a.dm) : null,
                        seg: !a.trouve && a.proche ? a.proche.seg.id : null,
                        plon: !a.trouve && a.proche ? a.proche.fx / kx : null, plat: !a.trouve && a.proche ? a.proche.fy / 110540 : null,
                        pd: !a.trouve && a.proche ? Math.round(a.proche.d) : null })),
                    bbox: v.bbox,
                    segs: [...v.segs].map(x => x.id),
                });
            }
            const sortie = x => ({ type: x.type, brut: x.brut, rue: x.rue, lon: x.lon, lat: x.lat });
            const tot = liste.reduce((s, v) => ({ ban: s.ban + v.ban, hn: s.hn + v.hn, rpp: s.rpp + v.rpp, suf: s.suf + v.suffixes }), { ban: 0, hn: 0, rpp: 0, suf: 0 });
            return {
                chrono: Object.assign(chrono, { fin: Date.now() - topPrec, total: Date.now() - top0 }),
                voies: liste,
                enTrop: enTrop.map(sortie),
                doublons: doublons.map(sortie),
                totaux: {
                    ban: tot.ban, cert: d.adresses.filter(a => a.cert).length, hn: tot.hn, rpp: tot.rpp, presents: tot.hn + tot.rpp,
                    manquants: tot.ban - tot.hn - tot.rpp, enTrop: enTrop.length, doublons: doublons.length, suffixes: tot.suf,
                    certSeules: !!d.certSeules, ecartees: d.adresses.length - tot.ban, adressesBan: d.adresses.length,
                    voies: liste.length, voiesCompletes: liste.filter(v => v.presents === v.ban).length,
                    voiesSansNom: liste.filter(v => v.statutNom === 'sansNom').length,
                    voiesAutreNom: liste.filter(v => v.statutNom === 'different').length,
                    voiesSansSegment: liste.filter(v => v.statutNom === 'aucun').length,
                    voiesAlt: liste.filter(v => v.statutNom === 'alternatif').length,
                    voiesRoute: liste.filter(v => v.statutNom === 'numeroRoute').length,
                    voiesProche: liste.filter(v => PROCHES.has(v.statutNom)).length,
                },
            };
        }

        // ---- Un export relu ---------------------------------------------------------------
        // Les CSV que le script exporte servent de relevé : relus plus tard, ils donnent l'avancement sans
        // que rien soit gardé ailleurs que chez l'éditeur. Les voies se retrouvent par leur nom NORMÉ : l'apostrophe
        // qui neutralise une cellule « =… » à l'export n'y change rien.
        function lireExport(texte) {
            const l = lireCsv(String(texte || '').replace(/^\uFEFF/, ''));
            if (!l.length) return null;
            const h = l[0].map(x => x.trim());
            const val = (r, n) => { const i = h.indexOf(n); return i >= 0 && r[i] != null ? String(r[i]) : ''; };
            const T = { ban: 0, presents: 0, manquants: 0, enTrop: 0, doublons: 0 };
            let cert = false;
            if (h.includes('voie_ban') && h.includes('etat')) {
                const voies = new Map();
                let code = '';
                for (const r of l.slice(1)) {
                    code = code || val(r, 'commune_insee');
                    cert = cert || val(r, 'filtre_certifiees') === '1';
                    const etat = val(r, 'etat'), voie = val(r, 'voie_ban');
                    if (/^en_trop_/.test(etat)) { T.enTrop++; continue; }
                    if (/^doublon_/.test(etat)) { T.doublons++; continue; }
                    if (!voie) continue;
                    const k = normNom(voie) + '|' + val(r, 'commune_deleguee');
                    const v = voies.get(k) || { ban: 0, presents: 0 };
                    v.ban++; T.ban++;
                    if (etat === 'HN' || etat === 'RPP') { v.presents++; T.presents++; } else T.manquants++;
                    voies.set(k, v);
                }
                return { type: 'commune', code, certSeules: cert, voies, totaux: T };
            }
            if (h.includes('adresses_ban') && h.includes('dans_wme')) {
                const communes = new Map();
                for (const r of l.slice(1)) {
                    const ban = Number.parseInt(val(r, 'adresses_ban'), 10);
                    if (!Number.isFinite(ban)) continue;
                    cert = cert || val(r, 'filtre_certifiees') === '1';
                    const c = { ban, presents: Number(val(r, 'dans_wme')) || 0, manquants: Number(val(r, 'manquantes')) || 0,
                        enTrop: Number(val(r, 'en_trop')) || 0, doublons: Number(val(r, 'doublons')) || 0 };
                    communes.set(val(r, 'commune_insee'), c);
                    for (const k in T) T[k] += c[k];
                }
                return { type: 'dep', certSeules: cert, communes, totaux: T };
            }
            return null;
        }

        // ---- Ajout automatique de numéros (L6 seulement, 0.12.00, 29/09) --------
        // Le nom « souple » : accents, casse, apostrophes et espaces tolérés, RIEN d'autre (ni abréviation,
        // ni article, ni type de voie) — le nom principal du segment doit ÊTRE celui de la BAN.
        function nomSouple(s) {
            return String(s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[\u2018\u2019`\u00b4]/g, "'")
                .replace(/\s+/g, ' ').trim().toLowerCase();
        }
        // La ville du segment : la commune, ou « Village (Commune) ».
        function villeHnOk(ville, commune) {
            const v = nomSouple(ville), c = nomSouple(commune);
            if (!v || !c) return false;
            if (v === c) return true;
            const m = /^(.+?)\s*\(([^()]+)\)$/.exec(v);
            return !!m && m[2].trim() === c;
        }
        // Le numéro écrit dans WME : « 12 », « 12bis », « 7quater », « 12b ». Un suffixe chiffré (« 5 3 »)
        // ou une forme inconnue n'est pas posé : il demande un humain.
        const SUFFIXES_HN = { qua: 'quater', qui: 'quinquies' };
        function numeroHn(brut) {
            const m = /^0*(\d+)(?:\s+([a-z]+))?$/i.exec(String(brut || '').trim());
            if (!m || m[1] === '0') return null;
            if (!m[2]) return m[1];
            const sf = m[2].toLowerCase();
            return m[1] + (SUFFIXES_HN[sf] || sf);
        }
        // Au plus HN_MAX numéros par fenêtre glissante de HN_FENETRE_MS. Une entrée par numéro posé :
        // { t: heure de l'ajout, s: segment, n: numéro, e: 0 réservé (en attente dans WME) | 1 enregistré }.
        // Réservée dès l'ajout (jamais plus de HN_MAX en attente), elle n'est gardée que si le numéro se
        // retrouve sur le serveur après l'enregistrement (voir rapprocherHn). Un simple horodatage (0.12.00
        // première version) vaut une entrée enregistrée. `libre` : quand une place se libère.
        const HN_MAX = 150, HN_FENETRE_MS = 3600 * 1000;
        const heureHn = x => typeof x === 'number' ? x : x && typeof x.t === 'number' ? x.t : NaN;
        function quotaHn(entrees, maintenant) {
            const r = (entrees || []).filter(x => heureHn(x) > maintenant - HN_FENETRE_MS).sort((a, b) => heureHn(a) - heureHn(b));
            const reste = Math.max(0, HN_MAX - r.length);
            return { utilises: r.length, reste, libre: reste ? maintenant : heureHn(r[r.length - HN_MAX]) + HN_FENETRE_MS, garder: r };
        }
        // Après un enregistrement réussi (ou au démarrage, pour une page fermée sans enregistrer) : `lus`
        // = numéros présents SUR LE SERVEUR, par segment relu (Map id → [numéros]). Une entrée réservée
        // dont le numéro y est devient enregistrée ; absente (annulée, supprimée ou modifiée avant
        // l'enregistrement), elle est rendue au quota. Un segment non relu ne tranche rien.
        // Une entrée de RPP (`r: 1`, 0.13.00) ne se relit pas par segment : `etatRpp(x)` dit si son POI est
        // enregistré ('ok'), encore en attente ('attente'), disparu ('absent') ou indécidable (null : POI hors
        // du modèle — l'entrée reste réservée jusqu'à la fin de sa fenêtre, jamais rendue sur un doute).
        function rapprocherHn(entrees, lus, etatRpp) {
            const garder = [], comptes = [], rendus = [];
            for (const x of entrees || []) {
                if (x && typeof x === 'object' && x.r === 1 && x.e !== 1) {
                    const st = etatRpp ? etatRpp(x) : null;
                    if (st === 'ok') { const y = Object.assign({}, x, { e: 1 }); garder.push(y); comptes.push(y); }
                    else if (st === 'absent') rendus.push(x);
                    else garder.push(x);
                    continue;
                }
                if (typeof x === 'number' || !x || x.e === 1 || !lus.has(x.s)) { garder.push(x); continue; }
                if ((lus.get(x.s) || []).some(n => normNum(n) === normNum(x.n))) { const y = Object.assign({}, x, { e: 1 }); garder.push(y); comptes.push(y); }
                else rendus.push(x);
            }
            return { entrees: garder, comptes, rendus };
        }
        // Le plan d'UNE voie. Segments admis : nom principal = nom BAN (souple), ville = la commune. Chaque
        // adresse manquante va au plus proche d'entre eux à moins de SEG_MAX_M, sauf si WME porte déjà ce
        // numéro sur la voie, si un numéro WME voisin n'en diffère que par le suffixe, si elle vient d'être
        // posée, ou si le quota est épuisé. segs : [{ id, coords, nom, ville }] lus dans WME ; existants :
        // les numéros WME de ces segments.
        //
        // HORS AGGLOMÉRATION (0.13.00, 02/10) : un segment dont le nom principal n'a PAS de
        // ville et qui porte en alternatif « nom BAN / la commune » est hors agglomération selon la doctrine de
        // nommage FR (principal sans ville, ville en alternatif). L'adresse y devient un RPP, pas un numéro :
        // la pose porte `rpp: { rue, ville }` (le nom et la ville de cet alternatif, tels qu'écrits dans WME).
        // ⚠️ Le critère est le NOMMAGE, pas une zone : WBC n'a pas les contours d'agglomération. Un segment
        // hors agglo dont le nommage n'est pas fait reste refusé (compté dans `refus.horsAgglo`).
        function planHn(voie, commune, segs, existants, reste) {
            const nomBan = nomSouple(voie.nom);
            const bonNom = s => nomSouple(s.nom) === nomBan;
            const altBan = s => (s.alts || []).find(a => nomSouple(a.nom) === nomBan && villeHnOk(a.ville, commune)) || null;
            const horsAgglo = s => !nomSouple(s.ville) && !!altBan(s);
            const traceOk = s => s.coords && s.coords.length > 1;
            const enAgglo = segs.filter(s => bonNom(s) && villeHnOk(s.ville, commune) && traceOk(s));
            const horsA = segs.filter(s => horsAgglo(s) && traceOk(s));
            const admis = enAgglo.concat(horsA);
            const probables = new Set((voie.adresses || []).filter(a => !a.trouve && a.seg != null).map(a => a.seg));
            const refus = {
                nom: segs.filter(s => !bonNom(s) && !horsAgglo(s)).length,
                ville: segs.filter(s => bonNom(s) && !villeHnOk(s.ville, commune) && !horsAgglo(s)).length,
                // 0.13.04 : dont « hors agglo sans l'alternatif nom BAN / commune » — le cas du chemin des Baylés
                // (02/10) : 16 adresses écartées sans que le message dise pourquoi.
                sansAlt: segs.filter(s => bonNom(s) && !nomSouple(s.ville) && !horsAgglo(s)).length,
                // 0.15.01 : principal = numéro de route sans ville, segment probable d'une adresse manquante de la voie.
                sansAltRoute: segs.filter(s => ROUTE_RE.test(s.nom || '') && !nomSouple(s.ville) && !horsAgglo(s) && probables.has(s.id)).length,
            };
            const ecartes = { existe: 0, suffixe: 0, format: 0, loin: 0, quota: 0, dejaPose: 0 };
            const poses = [];
            const vus = new Set((existants || []).map(n => normNum(n)));
            for (const a of voie.adresses || []) {
                if (a.trouve) continue;
                if (a.hnPose || a.hnEnregistre) { ecartes.dejaPose++; continue; }
                if (a.suffixe) { ecartes.suffixe++; continue; }
                const number = numeroHn(a.brut);
                if (!number) { ecartes.format++; continue; }
                const cle = normNum(number);
                if (vus.has(cle)) { ecartes.existe++; continue; }
                const m = versMetres(a.lat), [px, py] = m(a.lon, a.lat);
                let best = null, bd = SEG_MAX_M;
                for (const s of admis) for (let k = 1; k < s.coords.length; k++) {
                    const [ax, ay] = m(s.coords[k - 1][0], s.coords[k - 1][1]), [bx, by] = m(s.coords[k][0], s.coords[k][1]);
                    const dd = distSeg(px, py, ax, ay, bx, by);
                    if (dd <= bd) { bd = dd; best = s; }
                }
                if (!best) { ecartes.loin++; continue; }
                if (poses.length >= reste) { ecartes.quota++; continue; }
                vus.add(cle);
                const alt = enAgglo.indexOf(best) < 0 ? altBan(best) : null;
                poses.push({ number, lon: a.lon, lat: a.lat, segmentId: best.id, adresse: a, rpp: alt ? { rue: alt.nom, ville: alt.ville } : null });
            }
            return { poses, ecartes, admis: admis.length, hors: horsA.length, refus };
        }

        // Les zones d'une voie LONGUE (0.13.03) : au zoom 16, WME ne charge que ce qui est à l'écran, et une voie de
        // 1,5 km n'y tient pas (essai du 02/10, chemin des Baylés : 6 RPP posés, 16 adresses hors de la vue). Les
        // adresses restantes sont regroupées, de proche en proche, en zones d'au plus `demiX` × `demiY` mètres de
        // demi-côté autour de leur premier point ; chaque zone rend son centre et ses adresses.
        function zonesHn(adresses, demiX, demiY) {
            const reste = (adresses || []).slice(), zones = [];
            while (reste.length) {
                const a0 = reste.shift(), m = versMetres(a0.lat), [x0, y0] = m(a0.lon, a0.lat);
                const dedans = [a0];
                for (let k = reste.length - 1; k >= 0; k--) {
                    const [x, y] = m(reste[k].lon, reste[k].lat);
                    if (Math.abs(x - x0) <= 2 * demiX && Math.abs(y - y0) <= 2 * demiY) dedans.push(reste.splice(k, 1)[0]);
                }
                const lon = dedans.reduce((t, a) => t + a.lon, 0) / dedans.length, lat = dedans.reduce((t, a) => t + a.lat, 0) / dedans.length;
                zones.push({ lon, lat, adresses: dedans });
            }
            return zones;
        }

        return { normNum, normNom, coeurNom, ecartNoms, lireCsv, lireBan, lireExport, dansContour, analyser, nomSouple, villeHnOk, numeroHn, quotaHn, rapprocherHn, planHn, zonesHn };
    })();
    // ==/WBC-CORE==

    // =====================================================================
    //  Réseau
    // =====================================================================

    const Arret = function () { return Object.assign(new Error('arrêt'), { arret: true }); };

    // Une erreur de réseau porte `reseau` : c'est ce drapeau, et non le texte du message, qui
    // décide de l'afficher comme telle.
    // `source` dit QUI a échoué (wme, ban, geo) : le message se construit ici, une fois, sans
    // reconnaître l'erreur à son texte (audit du 26/09, M21 : le préfixe se doublait en de et pt).
    const errReseau = (msg, status, source) => Object.assign(new Error(msg), { reseau: true, status, source });
    const errFormat = source => Object.assign(new Error('format'), { format: true, source });
    function messageErreur(e) {
        if (e.format) return t('errFormat', e.source === 'wme' ? 'WME' : e.source === 'ban' ? 'BAN' : 'geo.api.gouv.fr');
        // Une session WME expirée répond 401 ou 403 : recharger la page, pas « réessayer plus tard ».
        if (e.source === 'wme' && (e.status === 401 || e.status === 403)) return t('errSession');
        if (e.reseau && e.source === 'wme') return t('errWme') + e.message;
        if (e.reseau) return t('errNet', e.message);
        return e.message;
    }

    // La BAN et geo.api.gouv.fr passent par le gestionnaire de scripts : la page de WME refuse
    // tout appel vers un autre domaine (mesuré : « Failed to fetch »).
    // `surProgres(fraction, octets)` suit le téléchargement ; la fraction est null quand le serveur
    // n'annonce pas la taille — c'est le cas de la BAN, servie compressée (mesuré sur Nîmes, 26/09).
    // Un refus passager (429, 5xx, coupure) se retente deux fois, à 1,5 s puis 4 s : un département
    // enchaîne 350 téléchargements, et un seul refus mettait sa commune en échec. Un 404 (commune
    // sans BAN) ou une erreur de script ne se retente pas.
    const passager = e => e && e.reseau && (!e.status || e.status === 429 || e.status >= 500);
    async function avecEssais(f) {
        for (const attente of [1500, 4000]) {
            try { return await f(); }
            catch (e) { if (!passager(e)) throw e; log('nouvel essai dans ' + attente + ' ms : ' + e.message); await new Promise(r => setTimeout(r, attente)); }
        }
        return f();
    }
    // `complet` : rend {texte, entetes} — l'ETag du fichier BAN sert à savoir, plus tard, s'il a changé.
    const gm = (url, surProgres, complet) => avecEssais(() => gmUneFois(url, surProgres, complet));
    const etagDe = h => { const m = /^etag:\s*(.+)$/im.exec(h || ''); return m ? m[1].trim() : ''; };
    // HEAD seul : quelques centaines d'octets pour savoir si un fichier BAN a changé (ETag stable d'une requête
    // à l'autre, identique au GET — vérifié le 27/09/2026). 404 (arrondissement absent) rend '404', comme au GET.
    const gmTete = url => avecEssais(() => new Promise((ok, ko) => {
        const hote = url.split('/')[2];
        if (typeof GM_xmlhttpRequest !== 'function') { ko(new Error(t('errGrant'))); return; }
        GM_xmlhttpRequest({
            method: 'HEAD', url, timeout: 30000,
            onload: r => r.status === 404 ? ok('404') : (r.status >= 200 && r.status < 300) ? ok(etagDe(r.responseHeaders)) : ko(errReseau(hote + ' HTTP ' + r.status, r.status, 'ext')),
            onerror: () => ko(errReseau(hote, 0, 'ext')),
            ontimeout: () => ko(errReseau(hote + ' (timeout)', 0, 'ext')),
        });
    }));
    function gmUneFois(url, surProgres, complet) {
        const hote = url.split('/')[2];
        return new Promise((ok, ko) => {
            if (typeof GM_xmlhttpRequest !== 'function') { ko(new Error(t('errGrant'))); return; }
            GM_xmlhttpRequest({
                method: 'GET', url, timeout: 90000,
                onprogress: surProgres ? p => { if (p) surProgres(p.lengthComputable && p.total ? Math.min(1, p.loaded / p.total) : null, p.loaded || 0); } : undefined,
                onload: r => (r.status >= 200 && r.status < 300) ? ok(complet ? { texte: r.responseText, entetes: r.responseHeaders || '' } : r.responseText) : ko(errReseau(hote + ' HTTP ' + r.status, r.status, 'ext')),
                onerror: () => ko(errReseau(hote, 0, 'ext')),
                ontimeout: () => ko(errReseau(hote + ' (timeout)', 0, 'ext')),
            });
        });
    }
    // Une réponse qui n'est pas du JSON (page d'erreur HTML servie en 200) est un défaut de FORMAT,
    // dit comme tel, et non une exception de script.
    const gmJson = async url => { const txt = await gm(url); try { return JSON.parse(txt); } catch (e) { throw errFormat('geo'); } };

    // WME, lui, se lit sur son propre domaine, avec la session de l'éditeur. Les chemins viennent
    // de W.Config.paths : ils changent d'un serveur à l'autre (row, usa, il).
    const cheminWme = (cle, repli) => (pw.W && pw.W.Config && pw.W.Config.paths && pw.W.Config.paths[cle]) || repli;
    const wmeJson = url => avecEssais(() => wmeUneFois(url));
    async function wmeUneFois(url) {
        let r;
        try { r = await pw.fetch(url, { credentials: 'same-origin' }); }
        catch (e) { throw errReseau(e.message, 0, 'wme'); }
        if (!r.ok) throw errReseau('HTTP ' + r.status, r.status, 'wme');
        // Le TEXTE, décodé ici : les objets de `r.json()` appartiennent à la page, et les parcourir
        // depuis le script est lent (8 fois dans la page même, mesuré sur Nîmes le 26/09 ; le calcul
        // de Nîmes y passait 13,6 s).
        const txt = await r.text();
        try { return JSON.parse(txt); } catch (e) { throw errFormat('wme'); }
    }

    // Exécute les tâches par paquets de `n`, en s'arrêtant dès qu'on le demande.
    async function parPaquets(taches, n, jeton, surFin) {
        const res = new Array(taches.length);
        let i = 0, faites = 0;
        const ouvrier = async () => {
            while (i < taches.length) {
                if (jeton.stop) throw Arret();
                const k = i++;
                res[k] = await taches[k]();
                faites++;
                if (surFin) surFin(faites, taches.length);
            }
        };
        await Promise.all(Array.from({ length: Math.min(n, taches.length) }, ouvrier));
        return res;
    }

    // =====================================================================
    //  Les sources
    // =====================================================================

    const bboxDe = poly => {
        const c = poly.coordinates[0];
        const xs = c.map(p => p[0]), ys = c.map(p => p[1]);
        return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
    };
    const versCommune = c => ({ code: c.code, nom: c.nom, dep: c.codeDepartement || (c.departement && c.departement.code) || '', bbox: c.bbox ? bboxDe(c.bbox) : null, contour: c.contour || null });

    const Geo = {
        auPoint: async (lon, lat) => {
            const l = await gmJson(GEO_URL + '/communes?lat=' + lat.toFixed(6) + '&lon=' + lon.toFixed(6) + '&fields=nom,code,codeDepartement,bbox,contour');
            return l.length ? versCommune(l[0]) : null;
        },
        parCode: async code => versCommune(await gmJson(GEO_URL + '/communes/' + encodeURIComponent(code) + '?fields=nom,code,codeDepartement,bbox,contour')),
        chercher: async q => {
            const F = '&fields=nom,code,codeDepartement,codesPostaux&limit=10';
            if (/^\d{5}$/.test(q)) {
                // Les deux lectures (code postal, code INSEE) : une seule en échec ne masque pas l'autre,
                // les deux en échec remontent l'erreur au lieu d'un « aucune commune » trompeur.
                const [ra, rb] = await Promise.allSettled([gmJson(GEO_URL + '/communes?codePostal=' + q + F), gmJson(GEO_URL + '/communes?code=' + q + F)]);
                if (ra.status === 'rejected' && rb.status === 'rejected') throw ra.reason;
                const a = ra.status === 'fulfilled' ? ra.value : [], b = rb.status === 'fulfilled' ? rb.value : [];
                const vus = new Set();
                return b.concat(a).filter(c => !vus.has(c.code) && vus.add(c.code));
            }
            if (/^(2[ab]|\d{2})\d{3}$/i.test(q)) return gmJson(GEO_URL + '/communes?code=' + q.toUpperCase() + F);
            return gmJson(GEO_URL + '/communes?nom=' + encodeURIComponent(q) + '&boost=population' + F);
        },
        departements: null,
        listeDepartements: async () => {
            if (!Geo.departements) Geo.departements = await gmJson(GEO_URL + '/departements?fields=nom,code');
            return Geo.departements;
        },
        communesDe: async dep => (await gmJson(GEO_URL + '/departements/' + encodeURIComponent(dep) + '/communes?fields=nom,code,codeDepartement,bbox,contour')).map(versCommune),
    };

    async function lireBanCommune(code, avance) {
        const codes = ARRONDISSEMENTS[code] || [code];
        // Paris, Marseille, Lyon : les arrondissements se lisent QUATRE à la fois (un par un, Marseille
        // enchaînait 16 téléchargements, audit M25). Les octets reçus s'additionnent pour l'affichage.
        const recus = new Array(codes.length).fill(0);
        let finis = 0;
        const total = () => recus.reduce((a, b) => a + b, 0);
        const parts = new Array(codes.length), etags = new Array(codes.length).fill('');
        let reserve = 0;
        let suivant = 0;
        const ouvrier = async () => {
            while (suivant < codes.length) {
                const k = suivant++;
                let texte;
                try {
                    const rep = await gm(BAN_URL(codes[k]), (f, o) => { recus[k] = o; avance(codes.length > 1 ? finis / codes.length : f, total()); }, true);
                    texte = rep.texte;
                    etags[k] = etagDe(rep.entetes);
                }
                catch (e) { if (e.status === 404) { etags[k] = '404'; finis++; continue; } throw e; }
                recus[k] = texte.length;
                finis++;
                avance(codes.length > 1 ? finis / codes.length : null, total());
                const lu = Core.lireBan(texte);
                parts[k] = lu.adresses;
                reserve += lu.reserve;
            }
        };
        await Promise.all(Array.from({ length: Math.min(4, codes.length) }, ouvrier));
        const adresses = parts.filter(Boolean).flat();
        // L'empreinte du ou des fichiers lus, dans l'ordre des codes : relue par un HEAD, elle dit si la BAN a changé.
        adresses.etag = etags.every(x => x) ? etags.join('|') : '';
        // Numéros de réserve écartés (9990-9999 sans voisin sur la voie) : dits au journal, pas à l'écran.
        adresses.reserve = reserve;
        return adresses;
    }

    // Les carreaux WME d'un passage : gardés le temps d'un département, pour que deux communes
    // voisines ne relisent pas les mêmes ; les plus anciens sortent au-delà de CARREAUX_GARDES.
    function nouveauCache() { return { carreaux: new Map(), hn: new Map() }; }
    // `sansNumeros` : les carreaux seuls (segments, rues, points résidentiels) — la vérification des mises à jour.
    async function lireWme(bbox, cache, jeton, prog, sansNumeros) {
        const [w, s, e, n] = bbox;
        const url = cheminWme('features', '/row-Descartes/app/Features');
        const cles = [];
        for (let i = Math.floor(w / CARREAU); i <= Math.floor(e / CARREAU); i++)
            for (let j = Math.floor(s / CARREAU); j <= Math.floor(n / CARREAU); j++) cles.push([i, j]);
        const taches = cles.map(([i, j]) => async () => {
            const k = i + ':' + j;
            if (cache.carreaux.has(k)) { const v = cache.carreaux.get(k); cache.carreaux.delete(k); cache.carreaux.set(k, v); return v; }
            const b = [i * CARREAU, j * CARREAU, (i + 1) * CARREAU, (j + 1) * CARREAU].map(x => +x.toFixed(6)).join(',');
            const r = await wmeJson(url + '?bbox=' + b + '&language=' + encodeURIComponent(_lang) + '&v=2&apiV2=true&zoomLevel=17&roadTypes=' + ROAD_TYPES + '&venueLevel=4&venueFilter=1,1,1,1');
            // Seuls les champs que lit le calcul sont gardés : un carreau brut porte des dizaines
            // d'attributs par segment, et un département en garde des dizaines (la mémoire de
            // l'onglet montait d'environ 2 Mo par commune sur le Gard, 26/09).
            // Une réponse sans la liste des segments n'est pas « une zone vide » : c'est un format que
            // le script ne connaît plus. Dit comme tel, sinon tout passerait « manquant » sans erreur
            // (audit du 26/09, M11).
            if (!r || !r.segments || !Array.isArray(r.segments.objects)) throw errFormat('wme');
            const v = {
                segments: ((r.segments && r.segments.objects) || []).map(x => ({ id: x.id, geometry: x.geometry, primaryStreetID: x.primaryStreetID, streetIDs: x.streetIDs, hasHNs: x.hasHNs, date: x.updatedOn || x.createdOn || 0 })),
                streets: ((r.streets && r.streets.objects) || []).map(x => ({ id: x.id, name: x.name })),
                rpps: ((r.venues && r.venues.objects) || []).filter(x => x.residential).map(x => ({ id: x.id, geometry: x.geometry, streetID: x.streetID, houseNumber: x.houseNumber, date: x.updatedOn || x.createdOn || 0 })),
            };
            cache.carreaux.set(k, v);
            while (cache.carreaux.size > CARREAUX_GARDES) cache.carreaux.delete(cache.carreaux.keys().next().value);
            return v;
        });
        // Avancement local : les carreaux jusqu'à 80 %, les numéros ensuite.
        prog(t('stWme', 0, taches.length), 0);
        const parts = await parPaquets(taches, PARALLELE, jeton, (f, tot) => prog(t('stWme', f, tot), 0.8 * f / tot));
        const segments = new Map(), streets = new Map(), rpps = new Map();
        for (const p of parts) {
            p.segments.forEach(x => segments.set(x.id, x));
            p.streets.forEach(x => streets.set(x.id, x));
            p.rpps.forEach(x => rpps.set(x.id, x));
        }
        if (sansNumeros) return { segments: [...segments.values()], streets: [...streets.values()], rpps: [...rpps.values()], hns: [] };
        // Les numéros des segments qui en portent, par lots de 100 (le lot de l'éditeur).
        prog(t('stHn'), 0.8);
        const urlHn = cheminWme('houseNumbers', '/row-Descartes/app/HouseNumbers');
        const aLire = [...segments.values()].filter(x => x.hasHNs && !cache.hn.has(x.id)).map(x => x.id);
        const lots = [];
        for (let i = 0; i < aLire.length; i += 100) lots.push(aLire.slice(i, i + 100));
        const finLot = (f, tot) => prog(t('stHn'), 0.8 + 0.2 * f / tot);
        await parPaquets(lots.map(ids => async () => {
            const r = await wmeJson(urlHn + '?ids=' + ids.join(','));
            if (!r || !r.segmentHouseNumbers || !Array.isArray(r.segmentHouseNumbers.objects)) throw errFormat('wme');
            ids.forEach(id => cache.hn.set(id, []));
            for (const h of (r.segmentHouseNumbers && r.segmentHouseNumbers.objects) || []) {
                if (!cache.hn.has(h.segID)) cache.hn.set(h.segID, []);
                cache.hn.get(h.segID).push({ id: h.id, segID: h.segID, number: h.number, geometry: h.geometry });
            }
        }), PARALLELE, jeton, finLot);
        const hns = [];
        for (const x of segments.values()) if (x.hasHNs) hns.push(...(cache.hn.get(x.id) || []));
        return { segments: [...segments.values()], streets: [...streets.values()], rpps: [...rpps.values()], hns };
    }

    // `prog(texte, fraction, enCours)` : la fraction couvre toute la commune — la BAN jusqu'à 30 %,
    // WME jusqu'à 95 %, puis le calcul. Quand la BAN ne dit pas sa taille, `enCours` fait tourner
    // la barre et le texte donne les mégaoctets reçus : une attente se voit toujours.
    const mo = o => new Intl.NumberFormat(LOCALES[_lang] || 'en', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(o / 1048576);
    // `banPret` : la BAN déjà en cours de téléchargement (un département lit celle de la commune
    // suivante pendant le calcul de la courante).
    // 🔴 Onglet en ARRIÈRE-PLAN : Chrome allonge chaque setTimeout à ~1 s (mesuré le 27/09 : 40 ms demandés,
    // 620 à 1 020 ms obtenus), puis, au-delà de 5 min, peut ne plus réveiller les minuteries qu'une fois par
    // minute — une pause par commune suffisait à faire « ne plus avancer » un département (Var, relevé
    // en réel). Caché, il n'y a rien à peindre : on rend la main par MessageChannel, que Chrome ne freine pas
    // (0 à 12 ms mesurés dans le même onglet caché).
    function ceder() {
        if (!document.hidden) return new Promise(r => setTimeout(r, 40));
        return new Promise(r => { const c = new MessageChannel(); c.port1.onmessage = () => { c.port1.close(); r(); }; c.port2.postMessage(0); });
    }

    async function analyserCommune(com, cache, jeton, prog, banPret) {
        const t0 = Date.now();
        prog(t('stBan'), 0, true);
        const toutes = await (banPret || lireBanCommune(com.code, (f, o) => prog(t('stBanMo', mo(o)), f == null ? 0 : 0.3 * f, f == null)));
        if (jeton.stop) throw Arret();
        const adresses = toutes;
        if (!adresses.length) return { commune: com, vide: true, totaux: null };
        // La zone lue côté WME : l'emprise des adresses ET celle de la commune, élargies pour attraper
        // les segments qui les portent. Avec les adresses seules, un numéro WME posé dans un hameau ou
        // une zone d'activité sans adresse BAN n'était jamais lu, donc jamais compté « en trop ».
        let w = Infinity, s = Infinity, e = -Infinity, n = -Infinity;
        for (const a of adresses) { w = Math.min(w, a.lon); e = Math.max(e, a.lon); s = Math.min(s, a.lat); n = Math.max(n, a.lat); }
        if (com.bbox) { w = Math.min(w, com.bbox[0]); s = Math.min(s, com.bbox[1]); e = Math.max(e, com.bbox[2]); n = Math.max(n, com.bbox[3]); }
        const M = 0.003;
        const bbox = [w - M, s - M, e + M, n + M];
        const tBan = Date.now() - t0;
        const wme = await lireWme(bbox, cache, jeton, (txt, f) => prog(txt, 0.3 + 0.65 * f));
        const empreinte = empreinteWme(wme, bbox);
        prog(t('stCalc'), 0.97);
        // Laisser la page peindre « Calcul… » avant le calcul, qui occupe le fil (≈ 0,4 s à Nîmes).
        await ceder();
        const tWme = Date.now() - t0 - tBan;
        // Le filtre des certifiées est celui du LANCEMENT (figé dans le jeton) : changer l'interrupteur
        // pendant un département ne mêle plus deux règles dans les totaux.
        const r = Core.analyser({ adresses, contour: com.contour, emprise: com.bbox, certSeules: !!jeton.certSeules, ...wme });
        // Le détail des durées ne s'écrit que pour une commune seule, ou quand le calcul pèse : un
        // département en écrivait 350 lignes.
        if (!jeton.departement || r.chrono.total > 300)
            log(com.nom + ' — ' + adresses.length + ' adresses' + (adresses.reserve ? ' (+ ' + adresses.reserve + ' numéros de réserve écartés)' : '') + ', ' + wme.segments.length + ' segments, ' + wme.hns.length + ' HN, ' + wme.rpps.length + ' RPP — BAN ' + tBan + ' ms, WME ' + tWme + ' ms, calcul ' + JSON.stringify(r.chrono));
        r.commune = com;
        // Ce qu'il faut pour savoir plus tard si la BAN ou WME a changé depuis ce balayage.
        r.memo = { date: Date.now(), cert: !!jeton.certSeules, etag: adresses.etag || '', wme: empreinte, bbox };
        return r;
    }

    // =====================================================================
    //  Calque : les adresses de la voie ouverte, ou tous les manquants
    // =====================================================================

    let calqueOk = false;

    // ---- Carte du département : chaque commune colorée selon sa couverture ------------------------------
    // Rampe séquentielle d'UNE teinte, du clair (peu couvert) au foncé (bien couvert), en 5 classes.
    // Classes FIXES resserrées vers le bas (décision du 28/09) : en 20 points, 316 communes du Gard
    // sur 350 tombaient dans la première et la carte était uniforme ; fixes pour qu'une teinte dise la même
    // chose d'un département à l'autre. La teinte se règle dans l'onglet Scripts (idem) : la rampe garde la
    // TEINTE et la saturation de la couleur choisie, et vise cinq LUMINANCES fixes (rapport ~1,7 entre deux
    // classes). Mélanger la couleur vers le blanc et le noir, ou fixer la clarté TSL, ne suffisait pas : un
    // jaune donnait des classes presque égales (contraste 1,11 entre deux, mesuré le 28/09) — à clarté égale,
    // le jaune est bien plus lumineux que le bleu. Chaque classe cherche la clarté qui atteint sa luminance.
    // Posé AVANT le calque des points : les points restent dessus. pointerEvents: 'none' partout.
    const LAYER_COM = 'wbc-communes';
    const BORNES_COUV = [0.05, 0.10, 0.25, 0.50];
    const libelleClasse = i => [0, 5, 10, 25, 50, 100][i] + '-' + [0, 5, 10, 25, 50, 100][i + 1] + '%';
    const LUMINANCES_COUV = [0.52, 0.29, 0.155, 0.08, 0.038];
    const luminance = hex => {
        const n = parseInt(hex.slice(1), 16);
        const v = [16, 8, 0].map(k => { const x = ((n >> k) & 255) / 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
        return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
    };
    // Teinte et saturation d'une couleur #rrggbb, puis la couleur de même teinte à la clarté voulue.
    function teinteSat(hex) {
        const n = parseInt(hex.slice(1), 16), r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
        if (!d) return { h: 0, s: 0 };
        const h = max === r ? ((g - b) / d + (g < b ? 6 : 0)) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
        return { h: h * 60, s: d / (1 - Math.abs(2 * l - 1)) };
    }
    function deTsl(h, s, l) {
        const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2;
        const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
        return '#' + [r, g, b].map(v => Math.round((v + m) * 255).toString(16).padStart(2, '0')).join('');
    }
    let rampeMemo = null;
    const teintesCouv = () => {
        const base = couleur('carte');
        if (!rampeMemo || rampeMemo.base !== base) {
            const { h, s } = teinteSat(base), sat = Math.min(s, 0.85);
            // À teinte et saturation fixes, la luminance croît avec la clarté : dichotomie.
            const viser = y => { let a = 0, b = 1; for (let k = 0; k < 24; k++) { const m = (a + b) / 2; if (luminance(deTsl(h, sat, m)) < y) a = m; else b = m; } return deTsl(h, sat, (a + b) / 2); };
            rampeMemo = { base, l: LUMINANCES_COUV.map(viser) };
        }
        return rampeMemo.l;
    };
    const ZOOM_CLIC_MAX = 13;
    const ZOOM_ETIQUETTES = 11;
    const classeCouv = T => !T || !T.ban ? -1 : BORNES_COUV.filter(b => T.presents / T.ban >= b).length;
    let calqueComOk = false, communesSig = '';
    // ⚠️ SDK en mode async (seul mode au 01/01/2027, Discuss 412920) : tout appel rend une promesse.
    // Les opérations sur les calques passent UNE PAR UNE : vider/ajouter entrelacés doubleraient les points.
    let fileCalques = Promise.resolve();
    const enFile = travail => { fileCalques = fileCalques.then(travail, travail); return fileCalques; };
    async function poserCalqueCommunes() {
        try {
            const pr = f => (f && f.properties) || {};
            await sdk.Map.addLayer({
                layerName: LAYER_COM,
                styleContext: {
                    fond: ({ feature }) => pr(feature).classe >= 0 ? teintesCouv()[pr(feature).classe] : '#9e9e9e',
                    // Le liseré des noms suit la teinte choisie (foncé : le nom blanc reste lisible).
                    lisere: () => assombrir(couleur('carte'), 0.3),
                    opa: ({ feature }) => pr(feature).classe >= 0 ? 0.55 : 0.2,
                    // Les noms seulement de près : 350 étiquettes sur un département se recouvrent.
                    lbl: ({ feature, zoomLevel }) => zoomLevel == null || zoomLevel >= ZOOM_ETIQUETTES ? pr(feature).lbl || '' : '',
                    // Commune signalée (BAN ou WME changé depuis le balayage) : contour orange épais.
                    trait: ({ feature }) => pr(feature).maj ? '#fb8c00' : '#ffffff',
                    ep: ({ feature }) => pr(feature).maj ? 3 : 1,
                },
                styleRules: [{ style: { fillColor: '${fond}', fillOpacity: '${opa}', strokeColor: '${trait}', strokeWidth: '${ep}', strokeOpacity: 0.9,
                    label: '${lbl}', fontColor: '#ffffff', fontSize: '11px', fontWeight: 'bold', labelOutlineColor: '${lisere}', labelOutlineWidth: 3, pointerEvents: 'none' } }],
            });
            calqueComOk = true;
        } catch (e) { log('calque des communes : ' + e.message); }
    }
    const communesVisibles = () => !!(resDep && !resultat && opts.carteDep);
    // Redessinée seulement si une commune change de classe ou de chiffres (le tableau d'un département se
    // redessine toutes les 1,5 s pendant l'analyse).
    function majCommunes() {
        if (!calqueComOk) return;
        const lignes = communesVisibles() ? resDep.communes.filter(c => c.commune.contour) : [];
        const signalee = c => !!c.verif && (c.verif.ban === 'maj' || c.verif.wme === 'maj');
        const sig = couleur('carte') + '|' + lignes.map(c => c.commune.code + ':' + classeCouv(c.totaux) + ':' + (c.totaux ? c.totaux.presents : '') + (signalee(c) ? '!' : '')).join(',');
        if (sig === communesSig) return;
        communesSig = sig;
        enFile(() => dessinerCommunes(lignes, signalee));
    }
    async function dessinerCommunes(lignes, signalee) {
        try {
            await sdk.Map.removeAllFeaturesFromLayer({ layerName: LAYER_COM });
            if (!lignes.length) return;
            // 🔴 Le SDK REFUSE les MultiPolygon (« geometry must match the configured type », mesuré le 27/09 sur
            // le Gard) et rejette alors TOUT le lot : une commune en plusieurs morceaux (Aigues-Mortes) vidait la
            // carte. Chaque morceau devient un Polygon ; l'étiquette ne va que sur le plus grand.
            const morceaux = geo => geo.type === 'MultiPolygon' ? geo.coordinates.map(c => ({ type: 'Polygon', coordinates: c })) : [geo];
            const taille = pg => { const r = pg.coordinates[0]; let a = 0; for (let i = 1; i < r.length; i++) a += r[i - 1][0] * r[i][1] - r[i][0] * r[i - 1][1]; return Math.abs(a); };
            const features = [];
            for (const c of lignes) {
                const pgs = morceaux(c.commune.contour);
                const grand = pgs.reduce((m, pg, k) => taille(pg) > taille(pgs[m]) ? k : m, 0);
                const lbl = c.totaux && c.totaux.ban ? c.commune.nom + '\n' + pct(c.totaux.presents, c.totaux.ban) : '';
                pgs.forEach((pg, k) => features.push({ type: 'Feature', id: 'wbc-c' + c.commune.code + '-' + k, geometry: pg,
                    properties: { classe: classeCouv(c.totaux), lbl: k === grand ? lbl : '', maj: signalee(c) ? 1 : 0 } }));
            }
            await sdk.Map.addFeaturesToLayer({ layerName: LAYER_COM, features });
        } catch (e) { log('carte des communes : ' + e.message); }
    }
    function communeSous(ll) {
        if (!ll || !communesVisibles()) return null;
        return resDep.communes.find(c => {
            const b = c.commune.bbox;
            if (!c.commune.contour || (b && (ll.lon < b[0] || ll.lon > b[2] || ll.lat < b[1] || ll.lat > b[3]))) return false;
            return Core.dansContour(ll.lon, ll.lat, c.commune.contour);
        }) || null;
    }
    function htmlFicheCommune(c) {
        const T = c.totaux, l = ['<b><bdi>' + esc(c.commune.nom) + '</bdi></b> <small>' + esc(c.commune.code) + '</small>'];
        if (T && T.ban) {
            l.push('<b>' + esc(pct(T.presents, T.ban)) + '</b> · ' + esc(t('hovCom', nb(T.ban), nb(T.presents), nb(T.manquants))));
            if (resCommunes.has(c.commune.code) || c.memo) l.push(esc(t('hovComClick')));
        } else l.push(esc(t('legNoData')));
        return l.join('<br>');
    }
    // Pastille de légende à la couleur choisie pour cet état.
    const pastille = etat => '<span class="wbc-pt" style="background:' + couleur(etat) + '"></span>';
    // Couleurs des points, réglables dans l'onglet Scripts. L'étiquette du numéro prend la même teinte
    // assombrie (lisible sur son contour blanc).
    const COULEURS_DEF = { manquant: '#e53935', present: '#43a047', trop: '#fb8c00', carte: '#2a78d6', pose: '#00838f' };
    const HEX_RE = /^#[0-9a-f]{6}$/i;
    const couleur = etat => { const c = opts.couleurs && opts.couleurs[etat]; return HEX_RE.test(c || '') ? c : COULEURS_DEF[etat]; };
    function assombrir(hex, f) {
        const n = parseInt(hex.slice(1), 16);
        const c = k => Math.round(((n >> k) & 255) * f).toString(16).padStart(2, '0');
        return '#' + c(16) + c(8) + c(0);
    }
    async function poserCalque() {
        try {
            const texte = { fontSize: '11px', fontWeight: 'bold', labelYOffset: -13, labelOutlineColor: '#ffffff', labelOutlineWidth: 3, label: '${lbl}' };
            const etat = f => (f && f.properties && f.properties.etat) || 'manquant';
            const pt = { fillColor: '${coul}', fillOpacity: 0.95, strokeColor: '#ffffff', strokeWidth: 2, fontColor: '${coulTexte}' };
            await sdk.Map.addLayer({
                layerName: LAYER,
                // Les couleurs sont lues À CHAQUE DESSIN dans les réglages : changer une couleur ne
                // demande que de redessiner, pas de recréer le calque.
                styleContext: {
                    lbl: ({ feature }) => (feature && feature.properties && feature.properties.lbl) || '',
                    // Le trait BAN → WME prend la couleur des adresses trouvées.
                    coul: ({ feature }) => couleur(etat(feature) === 'lien' ? 'present' : etat(feature) === 'lienManq' ? 'manquant' : etat(feature)),
                    coulTexte: ({ feature }) => assombrir(couleur(etat(feature)), 0.6),
                },
                styleRules: [
                    { predicate: p => p.etat === 'manquant', style: Object.assign({ pointRadius: 6 }, pt, texte) },
                    { predicate: p => p.etat === 'present', style: Object.assign({ pointRadius: 5 }, pt, texte) },
                    { predicate: p => p.etat === 'trop', style: Object.assign({ pointRadius: 6 }, pt, texte) },
                    // Numéro posé par « Ajouter les numéros », pas encore enregistré : un anneau large et
                    // translucide AUTOUR de la pastille blanche de WME (posée au même point), pour le
                    // retrouver avant d'enregistrer (29/09).
                    { predicate: p => p.etat === 'pose', style: Object.assign({}, texte, { pointRadius: 15, fillColor: '#00e5ff', fillOpacity: 0.3,
                        strokeColor: '#00838f', strokeWidth: 4, strokeOpacity: 1, fontColor: '#006064', labelYOffset: -24 }) },
                    { predicate: p => p.etat === 'lien', style: { strokeColor: '${coul}', strokeWidth: 2, strokeOpacity: 0.9, strokeDashstyle: 'dash' } },
                    // Adresse manquante → segment qui devrait probablement la porter : pointillé fin.
                    { predicate: p => p.etat === 'lienManq', style: { strokeColor: '${coul}', strokeWidth: 2, strokeOpacity: 0.85, strokeDashstyle: 'dot' } },
                ],
            });
            calqueOk = true;
        } catch (e) { log('calque : ' + e.message); }
        appliquerVisibilite();
    }
    // Une case « WME BAN Coverage » dans le sélecteur de calques de WME (comme WRP et WDA) : on masque
    // ou remontre les points sans rouvrir la fenêtre (audit du 26/09, M16). L'événement part pour
    // n'importe quel calque : on relit NOTRE case.
    // Les points ne se voient que fenêtre OUVERTE : la fermer les retire de la carte, la rouvrir les
    // remontre (27/09 : sinon rien ne les enlevait). La case garde son rôle.
    // Exception : les numéros POSÉS par « Ajouter les numéros » et pas encore relus restent sur la carte
    // fenêtre fermée — on la ferme justement pour dégager la carte avant d'enregistrer (29/09) ; eux seuls.
    let calqueVisible = true;
    const fenetreOuverte = () => !!(ovEl && ovEl.classList.contains('open'));
    const aDesPoses = () => !!resultat && resultat.voies.some(v => v.adresses.some(a => a.hnPose && !a.trouve));
    const calqueAffiche = () => calqueVisible && fenetreOuverte();
    function appliquerVisibilite() {
        const vis = calqueAffiche(), visAdr = calqueVisible && (fenetreOuverte() || aDesPoses());
        enFile(async () => {
            try { await sdk.Map.setLayerVisibility({ layerName: LAYER, visibility: visAdr }); } catch (e) { }
            try { await sdk.Map.setLayerVisibility({ layerName: LAYER_COM, visibility: vis }); } catch (e) { }
        });
        if (!vis) cacherFiche();
        // Ouverte ou fermée, le calque ne porte pas les mêmes points.
        majCalque();
    }
    async function poserCaseCalque() {
        try {
            await sdk.LayerSwitcher.addLayerCheckbox({ name: SCRIPT_NAME });
            await sdk.LayerSwitcher.setLayerCheckboxChecked({ name: SCRIPT_NAME, isChecked: true });
            sdk.Events.on({ eventName: 'wme-layer-checkbox-toggled', eventHandler: async () => {
                let etat;
                try { etat = await sdk.LayerSwitcher.isLayerCheckboxChecked({ name: SCRIPT_NAME }); } catch (e) { return; }
                if (etat === calqueVisible) return;
                calqueVisible = etat;
                appliquerVisibilite();
            } });
        } catch (e) { log('case de calque : ' + e.message); }
    }

    // ---- Survol d'un point : la fiche de l'adresse -------------------------------------------------
    // Calculé À LA MAIN : sdk.Events.trackLayerEvents casse la sélection au cadre de WME (Ctrl+Maj+
    // glisser, prouvé le 24/09 — voir WNA et WJN, qui font de même). On cherche le point dessiné le plus
    // proche du pointeur à moins de SURVOL_PX, en mètres pour ne convertir que la position du pointeur.
    const SURVOL_PX = 9;
    let pointsVus = [];
    let fiche = null;
    function htmlFiche(p) {
        const r = resultat, lignes = [];
        const etiq = (cls, txt) => (cls === 'suffixe' ? '' : pastille(cls)) + '<span class="wbc-f-etat ' + cls + '">' + esc(txt) + '</span>';
        if (p.trop) {
            const x = p.trop;
            lignes.push('<b><bdi>' + esc(x.brut) + ' ' + esc(x.rue || t('nameNone')) + '</bdi></b>');
            lignes.push(etiq('trop', t('hovExtra')) + ' · ' + esc(t(x.type === 'HN' ? 'tipHN' : 'tipRPP')));
        } else if (p.ad) {
            const a = p.ad, v = p.voie;
            lignes.push('<b><bdi>' + esc(a.brut + ' ' + v.nom) + '</bdi></b>');
            lignes.push('<bdi>' + esc(r ? r.commune.nom : '') + (v.deleguee ? ' (' + esc(v.deleguee) + ')' : '') + '</bdi>');
            if (a.trouve) lignes.push(etiq('present', t('hovFound', a.trouve)) + (a.dm != null ? ' · ' + esc(t('hovDist', nb(a.dm))) : ''));
            else if (a.hnPose) lignes.push('<span class="wbc-f-etat pose">' + esc(t('ajHnPoseTip')) + '</span>');
            else if (a.suffixe) lignes.push(etiq('suffixe', t('tipSuf', a.suffixe)));
            else lignes.push(etiq('manquant', t('hovMissing')));
            if (!a.trouve && a.seg != null) lignes.push(esc(t('hovProbSeg', a.seg, nb(a.pd))));
            lignes.push(esc(t(a.cert ? 'hovCert' : 'hovNotCert')));
            if (v.statutNom !== 'identique' && v.nomWme) lignes.push(esc(t('hovWmeStreet', v.nomWme)));
        }
        return lignes.join('<br>');
    }
    function cacherFiche() { if (fiche) fiche.hidden = true; }
    // Un mouvement traité après un plus récent (SDK async) est abandonné : c'est le dernier qui compte.
    let generationSurvol = 0;
    // Le point dessiné le plus proche du pointeur, à moins de SURVOL_PX (adresse ou numéro en trop) ; `ll` : le
    // pointeur. Le SDK prend des pixels d'ÉCRAN, comme clientX/clientY (voir WJN) : soustraire la position de
    // la carte décalait la recherche de la largeur du volet gauche, et aucune fiche n'apparaissait.
    async function pointSous(x, y) {
        const ll = await sdk.Map.getLonLatFromPixel({ x, y }), ll2 = await sdk.Map.getLonLatFromPixel({ x: x + SURVOL_PX, y });
        if (!ll || !ll2) return { ll: null, best: null };
        const kx = Math.cos(ll.lat * Math.PI / 180);
        let best = null, bd = Math.pow((ll2.lon - ll.lon) * kx, 2);
        for (const p of pointsVus) {
            if (!p.ad && !p.trop) continue;
            const d = Math.pow((p.lon - ll.lon) * kx, 2) + Math.pow(p.lat - ll.lat, 2);
            if (d <= bd) { bd = d; best = p; }
        }
        return { ll, best };
    }
    async function surSurvol(ev) {
        if (!opts.survol || !calqueAffiche() || (!pointsVus.length && !communesVisibles())) { cacherFiche(); return; }
        // Bulle épinglée ouverte (clic sur un point) : pas de fiche par-dessus.
        if (bulleAdr) { cacherFiche(); return; }
        const generation = ++generationSurvol;
        let sous;
        try { sous = await pointSous(ev.clientX, ev.clientY); } catch (e) { cacherFiche(); return; }
        if (generation !== generationSurvol) return;
        const { ll, best } = sous;
        if (!ll) { cacherFiche(); return; }
        // Pas de point sous le pointeur : la commune colorée (carte du département), s'il y en a une.
        let html = best ? htmlFiche(best) : null;
        if (!html) { const c = communeSous(ll); if (c) html = htmlFicheCommune(c); }
        if (!html) { cacherFiche(); return; }
        if (!fiche) {
            fiche = document.createElement('div');
            fiche.id = 'wbc-fiche';
            fiche.setAttribute('role', 'tooltip');
            document.body.appendChild(fiche);
        }
        fiche.dir = _lang === 'he' ? 'rtl' : 'ltr';
        fiche.innerHTML = html;
        fiche.hidden = false;
        // À droite et au-dessus du pointeur, ramenée dans l'écran.
        const w = fiche.offsetWidth, h = fiche.offsetHeight;
        fiche.style.left = Math.max(4, Math.min(ev.clientX + 14, window.innerWidth - w - 4)) + 'px';
        fiche.style.top = Math.max(4, Math.min(ev.clientY - h - 10, window.innerHeight - h - 4)) + 'px';
    }
    // ---- Clic sur une adresse manquante : « Ajouter ce numéro » (0.15.00, L6) ---------------------------
    // La fiche du survol ne capte pas la souris. Un CLIC sur une adresse que l'ajout peut poser ouvre à sa place une
    // bulle épinglée : la fiche, et le bouton (grisé avec sa raison si le nom ou le quota l'interdit). Elle se
    // ferme au déplacement de la carte, à Échap, à la croix, ou au clic suivant sur la carte.
    let bulle = null, bulleAdr = null;
    function fermerBulle() { if (bulle) bulle.hidden = true; bulleAdr = null; }
    function ouvrirBulle(p, cx, cy) {
        const v = p.voie, i = resultat ? resultat.voies.indexOf(v) : -1, k = i < 0 ? -1 : v.adresses.indexOf(p.ad);
        if (k < 0) return false;
        const q = Core.quotaHn(lireHorodatages(), Date.now());
        const raison = !nomOkHn(v) ? t('ajHnNoName') : !q.reste ? t('ajHnQuota', heureCourte(q.libre)) : '';
        if (!bulle) {
            bulle = document.createElement('div');
            bulle.id = 'wbc-bulle';
            bulle.setAttribute('role', 'dialog');
            document.body.appendChild(bulle);
            bulle.addEventListener('click', ev => {
                if (ev.target.closest('[data-bulle-fermer]')) { fermerBulle(); return; }
                const b = ev.target.closest('[data-hn1]');
                if (!b || b.disabled || !resultat || !droitHn || hnEnCours) return;
                const [bi, bk] = b.dataset.hn1.split(':').map(Number);
                fermerBulle();
                vue.curseur = bk;
                ajouterHnVoie(bi, bk);
            });
        }
        bulle.dir = _lang === 'he' ? 'rtl' : 'ltr';
        bulle.setAttribute('aria-label', t('ajHn1') + ' ' + p.ad.brut);
        bulle.innerHTML = '<button type="button" class="wbc-bulle-x" data-bulle-fermer title="' + esc(t('close')) + '" aria-label="' + esc(t('close')) + '">&#x2715;</button>' + htmlFiche(p) +
            '<div class="wbc-bulle-act"><button type="button" class="wbc-bulle-btn" data-hn1="' + i + ':' + k + '" title="' + esc(raison || t('ajHn1Tip')) + '"' + (raison || hnEnCours ? ' disabled' : '') + '>+ ' + esc(t('ajHn1')) + '</button>' +
            (raison ? '<div class="wbc-bulle-raison">' + esc(raison) + '</div>' : '') + '</div>';
        bulle.hidden = false;
        bulleAdr = [i, k];
        const w = bulle.offsetWidth, h = bulle.offsetHeight;
        bulle.style.left = Math.max(4, Math.min(cx + 14, window.innerWidth - w - 4)) + 'px';
        bulle.style.top = Math.max(4, Math.min(cy - h - 10, window.innerHeight - h - 4)) + 'px';
        cacherFiche();
        const btn = bulle.querySelector('.wbc-bulle-btn:not([disabled])');
        if (btn) btn.focus({ preventScroll: true });
        return true;
    }
    document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && bulleAdr) fermerBulle(); });
    async function brancherSurvol() {
        let vueEl;
        try { vueEl = await sdk.Map.getMapViewportElement(); } catch (e) { log('survol : ' + e.message); return; }
        let prevu = null, dernier = null;
        vueEl.addEventListener('mousemove', ev => {
            // Un mouvement traité toutes les 30 ms au plus ; setTimeout et non requestAnimationFrame,
            // suspendu dans un onglet en arrière-plan.
            dernier = ev;
            if (prevu) return;
            prevu = setTimeout(() => { prevu = null; surSurvol({ currentTarget: vueEl, clientX: dernier.clientX, clientY: dernier.clientY }).catch(e => log('survol : ' + e.message)); }, 30);
        }, { passive: true });
        vueEl.addEventListener('mouseleave', cacherFiche);
        vueEl.addEventListener('mousedown', cacherFiche);
        // Carte du département : un CLIC (pas un glisser) sur une commune colorée l'ouvre — carte dézoomée
        // seulement, là où WME n'a rien à sélectionner.
        let bas = null;
        vueEl.addEventListener('mousedown', ev => { bas = ev.button === 0 ? [ev.clientX, ev.clientY] : null; }, true);
        vueEl.addEventListener('mousedown', fermerBulle);
        vueEl.addEventListener('mouseup', async ev => {
            if (!bas || ev.button !== 0 || Math.hypot(ev.clientX - bas[0], ev.clientY - bas[1]) > 4 || !calqueAffiche()) return;
            if (droitHn && resultat && pointsVus.length) {
                let sous = null;
                try { sous = await pointSous(ev.clientX, ev.clientY); } catch (e) { }
                if (sous && sous.best && sous.best.ad && hnPosable(sous.best.ad) && ouvrirBulle(sous.best, ev.clientX, ev.clientY)) return;
            }
            if (!communesVisibles()) return;
            let z = 99;
            try { z = await sdk.Map.getZoomLevel(); } catch (e) { }
            if (z >= ZOOM_CLIC_MAX) return;
            let ll = null;
            try { ll = await sdk.Map.getLonLatFromPixel({ x: ev.clientX, y: ev.clientY }); } catch (e) { }
            const c = ll && communeSous(ll);
            if (!c || !(resCommunes.has(c.commune.code) || c.memo)) return;
            ouvrirCommuneDep(c.commune.code).then(() => { if (c.commune.bbox) cadrer(c.commune.bbox); });
        });
        try { sdk.Events.on({ eventName: 'wme-map-move', eventHandler: () => { cacherFiche(); fermerBulle(); } }); } catch (e) { }
    }

    function dessiner(points) {
        pointsVus = points;
        cacherFiche();
        if (!calqueOk) return;
        enFile(() => dessinerPoints(points));
    }
    async function dessinerPoints(points) {
        try {
            await sdk.Map.removeAllFeaturesFromLayer({ layerName: LAYER });
            if (!points.length) return;
            await sdk.Map.addFeaturesToLayer({
                layerName: LAYER,
                features: points.map((p, i) => ({ type: 'Feature', id: 'wbc-' + i,
                    geometry: p.ligne ? { type: 'LineString', coordinates: p.ligne } : { type: 'Point', coordinates: [p.lon, p.lat] },
                    properties: { etat: p.etat, lbl: p.lbl || '' } })),
            });
        } catch (e) { log('dessin : ' + e.message); }
    }
    // Un point au milieu de la zone visible, au zoom voulu : même calcul que le cadrage, posé en une fois
    // (l'ancienne version centrait puis corrigeait, et ne voyait que la largeur).
    async function centrerLibre(lon, lat, zoomLevel) {
        try {
            const zone = zoneVisible(), ext = await sdk.Map.getMapExtent(), zoom = await sdk.Map.getZoomLevel();
            const zc = zoomLevel == null ? zoom : zoomLevel;
            const c = zone && ext ? cadrageVisible([lon, lat, lon, lat], zone, ext, zoom, zc, zc) : { lon, lat, zoom: zc };
            await sdk.Map.setMapCenter({ lonLat: { lon: c.lon, lat: c.lat }, zoomLevel: c.zoom });
        } catch (e) {
            log('centrage : ' + e.message);
            try { await sdk.Map.setMapCenter({ lonLat: { lon, lat }, zoomLevel }); } catch (e2) { }
        }
    }
    // La partie de la carte que rien ne couvre, en pixels d'écran : la carte, moins la fenêtre et le
    // pied de page. La fenêtre est déplaçable et peut être repliée (une simple barre) : on essaie les
    // quatre découpes (à gauche, à droite, au-dessus, au-dessous d'elle) et on garde la plus grande
    // surface — même règle que WCT (`_zoneVisible`).
    function zoneVisible() {
        const carte = document.getElementById('WazeMap') || document.querySelector('.olMapViewport');
        if (!carte) return null;
        const rc = carte.getBoundingClientRect();
        let g = rc.left, d = rc.right, h = rc.top, b = rc.bottom;
        const pied = document.querySelector('.wz-map-ol-footer');
        if (pied) { const p = pied.getBoundingClientRect(); if (p.height && p.top < b && p.top > h) b = p.top; }
        if (ovEl && ovEl.classList.contains('open')) {
            const f = ovEl.getBoundingClientRect();
            if (!(f.bottom <= h || f.top >= b || f.right <= g || f.left >= d)) {
                let mieux = null, aire = -1;
                for (const c of [{ g, d: Math.min(d, f.left), h, b }, { g: Math.max(g, f.right), d, h, b },
                    { g, d, h, b: Math.min(b, f.top) }, { g, d, h: Math.max(h, f.bottom), b }]) {
                    const a = Math.max(0, c.d - c.g) * Math.max(0, c.b - c.h);
                    if (a > aire) { aire = a; mieux = c; }
                }
                ({ g, d, h, b } = mieux);
            }
        }
        return { rc: { left: rc.left, right: rc.right, top: rc.top, bottom: rc.bottom }, g, d, h, b };
    }
    // Le centre et le zoom qui montrent une emprise EN ENTIER au milieu de la zone visible
    // (28/09 : la vue se centrait sur la carte entière, sous la fenêtre ouverte).
    // Fonction PURE, éprouvée par tools/banc-cadrage.js. Le calcul se fait en Mercator — en degrés,
    // un degré de latitude vaut ~1,4 degré de longitude à l'écran en France, et le zoom tombait faux.
    // `ext` et `zoom` : l'emprise et le zoom ACTUELS de la carte, d'où l'échelle se déduit ; chaque
    // niveau de zoom la double. Le zoom est entier (WME arrondit), le décalage calculé pour CE zoom.
    function cadrageVisible(bbox, zone, ext, zoom, zMin, zMax) {
        const R = 6378137, rad = Math.PI / 180;
        const mx = lon => R * lon * rad, my = lat => R * Math.log(Math.tan(Math.PI / 4 + Math.max(-85, Math.min(85, lat)) * rad / 2));
        const lonDe = x => x / R / rad, latDe = y => (2 * Math.atan(Math.exp(y / R)) - Math.PI / 2) / rad;
        const rc = zone.rc, W = rc.right - rc.left, H = rc.bottom - rc.top;
        const lv = Math.max(zone.d - zone.g, 50), hv = Math.max(zone.b - zone.h, 50);
        // Mètres Mercator par pixel au zoom actuel.
        const uAct = (mx(ext[2]) - mx(ext[0])) / W;
        const x0 = mx(bbox[0]), x1 = mx(bbox[2]), y0 = my(bbox[1]), y1 = my(bbox[3]);
        // L'emprise, marge de 8 % de chaque côté, doit tenir dans la zone visible.
        const uVoulu = Math.max((x1 - x0) / lv, (y1 - y0) / hv, 1e-3) * 1.16;
        const z = Math.max(zMin, Math.min(zMax, zoom + Math.floor(Math.log2(uAct / uVoulu))));
        const u = uAct * Math.pow(2, zoom - z);
        // Pour que le centre de l'emprise tombe au centre de la zone visible, le centre de la carte
        // s'en écarte en sens inverse. L'axe Y de l'écran descend, le Mercator monte.
        const dx = (zone.g + zone.d) / 2 - (rc.left + rc.right) / 2, dy = (zone.h + zone.b) / 2 - (rc.top + rc.bottom) / 2;
        const cx = (x0 + x1) / 2 - dx * u, cy = (y0 + y1) / 2 + dy * u;
        return { lon: lonDe(cx), lat: latDe(cy), zoom: z };
    }
    async function cadrer(bbox) {
        try {
            const zone = zoneVisible(), ext = await sdk.Map.getMapExtent(), zoom = await sdk.Map.getZoomLevel();
            if (!zone || !ext) { await sdk.Map.zoomToExtent({ bbox }); return; }
            const c = cadrageVisible(bbox, zone, ext, zoom, 3, 22);
            await sdk.Map.setMapCenter({ lonLat: { lon: c.lon, lat: c.lat }, zoomLevel: c.zoom });
        } catch (er) {
            log('cadrage : ' + er.message);
            try { await sdk.Map.zoomToExtent({ bbox }); } catch (e2) { }
        }
    }
    // Choisir une commune ou un département montre son emprise ENTIÈRE sur la carte
    // (28/09). Seule l'emprise est demandée (pas les contours) ; celle d'un département est
    // l'union de ses communes, gardée le temps de la session. Un choix plus récent l'emporte.
    const empriseDep = new Map();
    let cadrageNo = 0;
    async function cadrerChoix(type, code) {
        const no = ++cadrageNo;
        try {
            let b = null;
            if (type === 'commune') {
                const c = await attendre(gmJson(GEO_URL + '/communes/' + encodeURIComponent(code) + '?fields=bbox'));
                b = c && c.bbox ? bboxDe(c.bbox) : null;
            } else {
                if (!empriseDep.has(code)) {
                    const l = await attendre(gmJson(GEO_URL + '/departements/' + encodeURIComponent(code) + '/communes?fields=code,bbox'));
                    const bs = l.filter(c => c.bbox).map(c => bboxDe(c.bbox));
                    if (bs.length) empriseDep.set(code, [Math.min(...bs.map(x => x[0])), Math.min(...bs.map(x => x[1])), Math.max(...bs.map(x => x[2])), Math.max(...bs.map(x => x[3]))]);
                }
                b = empriseDep.get(code);
            }
            if (b && no === cadrageNo) cadrer(b);
        } catch (e) { log('cadrage : ' + e.message); }
    }

    // =====================================================================
    //  Apparence — mêmes jetons que WCT, WJN et WRP
    // =====================================================================

    // ⚠️ Pas d'accent grave dans ce bloc : il vit dans un template literal.
    const CSS = `
:root {
    --wbc-blue: #2196f3; --wbc-blue-btn: #1976d2; --wbc-blue-dk: #1565c0; --wbc-grey: #9e9e9e;
    --wbc-surface: #ffffff; --wbc-bg: #f5f7f9; --wbc-border: #dde3ea;
    --wbc-text: #2d3748; --wbc-text2: #566372; --wbc-radius: 8px;
}
#wbc-fab-wrap { width: 40px; height: 40px; border-radius: 50%; background: #fff; box-shadow: 0 2px 6px rgba(0,0,0,.3);
    display: flex; align-items: center; justify-content: center; cursor: pointer; user-select: none; transition: box-shadow .15s; }
#wbc-fab-wrap:hover { box-shadow: 0 3px 10px rgba(0,0,0,.4); }
#wbc-fab-btn { background: none; border: none; padding: 0; margin: 0; cursor: inherit; display: flex; align-items: center;
    justify-content: center; width: 100%; height: 100%; border-radius: 50%; }
#wbc-fab-btn.actif { background: #e3f2fd; }
#wbc-fab-btn:focus-visible { outline: 2px solid var(--wbc-blue); outline-offset: 2px; }

/* Onglet Scripts — calqué sur #wjn-sidebar */
/* WME Studio, thème sombre : ses variables, toujours avec un repli. Sans Studio, ou en thème clair, ces règles ne s'appliquent pas. */
html:is([data-wme-studio-theme="dark"],[data-wme-studio-theme="black"]) #wbc-sidebar { color: var(--wme-studio-text, #e8eaed); }
html:is([data-wme-studio-theme="dark"],[data-wme-studio-theme="black"]) #wbc-sidebar :is(p,td,th,li,label,b,strong,bdi,dd,dt):not([class]) { color: inherit; }
html:is([data-wme-studio-theme="dark"],[data-wme-studio-theme="black"]) #wbc-sidebar :is([class*="hint"],[class*="note"],[class*="-ver"],[class*="foot"],[class*="links"],[class*="meta"],[class*="-lbl"]) { color: var(--wme-studio-text-secondary, #b6c0ca); }
html:is([data-wme-studio-theme="dark"],[data-wme-studio-theme="black"]) #wbc-sidebar :is(h2,[class*="-sec"]:not(button),[class*="sb-on"]) { color: #64b5f6; }
html:is([data-wme-studio-theme="dark"],[data-wme-studio-theme="black"]) #wbc-sidebar :is([class*="btn-neutral"],[class*="btn-sec"],[class*="chip"],[class*="help-hdr"],[class*="aide-h"],[class*="hist-row"],kbd,select,input:not([type=checkbox]):not([type=radio])) { background: var(--wme-studio-input, #3a3f44); color: var(--wme-studio-text, #e8eaed); border-color: var(--wme-studio-border, #4a5056); }
html:is([data-wme-studio-theme="dark"],[data-wme-studio-theme="black"]) #wbc-sidebar :is([class*="help-hdr"],[class*="aide-h"]).on { background: var(--wme-studio-hover, #454b52); color: var(--wme-studio-text, #e8eaed); }
html:is([data-wme-studio-theme="dark"],[data-wme-studio-theme="black"]) #wbc-sidebar :is([class*="help-body"],[class*="aide-c"]) { color: var(--wme-studio-text, #e8eaed); }
#wbc-sidebar { padding: 10px 12px; font-family: 'Rubik','Open Sans',sans-serif; font-size: 12px; color: var(--wbc-text); }
#wbc-sidebar h2 { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; color: var(--wbc-blue); margin: 0 0 8px; }
#wbc-sidebar h2 .wbc-sb-ico { display: inline-flex; }
#wbc-sidebar h2 .wbc-sb-ver { font-size: 11px; font-weight: 400; color: var(--wbc-grey); }
.wbc-sb-hint { font-size: 11px; color: var(--wbc-text2); line-height: 1.6; margin: 0; }
.wbc-sb-sec { font-size: 11px; font-weight: 700; color: var(--wbc-blue); text-transform: uppercase; letter-spacing: .05em; margin: 14px 0 6px; }
.wbc-help-section { border: 1px solid var(--wbc-border); border-radius: var(--wbc-radius); margin-bottom: 4px; overflow: hidden; }
.wbc-help-hdr { display: flex; align-items: center; justify-content: space-between; width: 100%; height: auto; min-height: 0; margin: 0;
    border: none; font-family: inherit; text-align: start; padding: 5px 9px; font-size: 11px; font-weight: 700;
    cursor: pointer; background: var(--wbc-bg); color: var(--wbc-text); user-select: none; }
.wbc-help-hdr.on { color: var(--wbc-blue-dk); background: #e3f2fd; }
.wbc-help-hdr:hover { background: #eef4fb; }
.wbc-help-body { padding: 7px 9px; font-size: 11px; line-height: 1.5; color: var(--wbc-text); }
.wbc-help-body p { margin: 0 0 5px; }
.wbc-help-table { width: 100%; border-collapse: collapse; margin-bottom: 5px; }
.wbc-help-table td { padding: 3px 5px; vertical-align: top; border-bottom: 1px solid var(--wbc-border); }
.wbc-help-table td:first-child { width: 58px; white-space: nowrap; color: var(--wbc-text2); }
.wbc-sb-links { margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--wbc-border); font-size: 11px; color: var(--wbc-text2); text-align: center; }
.wbc-sb-links a { color: var(--wbc-blue-dk); }
.wbc-sb-links[hidden] { display: none; }
.wbc-sb-maj { margin: 0 0 8px; padding: 5px 8px; border-radius: 8px; background: #ffebee; color: #c62828; font-size: 11px; font-weight: 600; }
.wbc-sb-maj[hidden] { display: none; }
.wbc-sb-maj a { color: #c62828; }
.wbc-sb-foot { margin-top: 10px; font-size: 11px; color: var(--wbc-grey); line-height: 1.6; }
/* Réglages de la carte dans l'onglet : interrupteur à droite comme WJN, couleurs en pastilles. */
.wbc-sb-ligne { justify-content: space-between; margin: 0 0 4px; }
.wbc-toggle input:disabled + .wbc-toggle-slider { opacity: .45; cursor: not-allowed; }
.wbc-toggle-row:has(input:disabled) .wbc-toggle-lbl { color: var(--wbc-text2); }
#wbc-sidebar[dir="rtl"] .wbc-toggle input:checked + .wbc-toggle-slider:before { transform: translateX(-16px); }
.wbc-sb-lbl { margin: 10px 0 4px; font-size: 12px; font-weight: 600; }
.wbc-couleurs { display: flex; flex-wrap: wrap; gap: 6px 14px; }
.wbc-couleur { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; cursor: pointer; }
.wbc-couleur input[type="color"] { width: 26px; height: 24px; padding: 0; border: 1px solid var(--wbc-border); border-radius: 6px; background: #fff; cursor: pointer; }
#wbc-sidebar :focus-visible, #wbc-ov :focus-visible { outline: 2px solid var(--wbc-blue); outline-offset: 1px; }

/* Boutons en pilule : un seul plein par écran */
.wbc-btn { display: inline-flex; align-items: center; gap: 5px; height: auto; min-height: 24px; padding: 3px 10px; margin: 0;
    border: none; border-radius: 50px; font: 600 11px 'Rubik','Open Sans',sans-serif; cursor: pointer; white-space: nowrap; }
.wbc-btn-primary { background: var(--wbc-blue-btn); color: #fff; }
.wbc-btn-neutral { background: #dde3ea; color: var(--wbc-text); }
.wbc-btn:hover { filter: brightness(1.08); }
.wbc-btn[hidden] { display: none; }
.wbc-btn[disabled] { opacity: .5; cursor: not-allowed; }

/* La fenêtre */
#wbc-ov { position: fixed; z-index: 9989; display: none; flex-direction: column; width: 520px; min-width: 300px; min-height: 220px;
    background: #fff; border: 1px solid var(--wbc-border); border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,.22), 0 2px 8px rgba(0,0,0,.12);
    overflow: hidden; font-family: 'Rubik','Open Sans',sans-serif; font-size: 12px; color: var(--wbc-text); }
#wbc-ov.open { display: flex; }
#wbc-hdr { flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 12px;
    background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%); color: #fff; cursor: move; user-select: none; }
.wbc-hdr-title { display: flex; align-items: center; min-width: 0; font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.wbc-hdr-v { font-size: 11px; font-weight: 400; opacity: .9; margin-inline-start: 5px; }
.wbc-hdr-ico { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; margin-inline-end: 7px; border-radius: 50%; background: #fff; flex-shrink: 0; }
.wbc-hdr-btn { flex-shrink: 0; width: 24px; height: 24px; min-height: 0; padding: 0; margin: 0; border: none; border-radius: 50%;
    background: rgba(255,255,255,.18); color: #fff; font-size: 12px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.wbc-hdr-btn:hover { background: rgba(255,255,255,.35); }
/* Sur l'en-tête bleu, le contour bleu de focus était invisible (1,2:1) : blanc, comme WRP (M23). */
#wbc-ov .wbc-hdr-btn:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
.wbc-hdr-btns { display: flex; gap: 5px; flex-shrink: 0; }
.wbc-lecteur { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
.wbc-th { all: unset; cursor: pointer; font: inherit; color: inherit; text-transform: inherit; letter-spacing: inherit; }
#wbc-ov[dir="rtl"] .wbc-fl { display: inline-block; transform: scaleX(-1); }
#wbc-haut { flex-shrink: 0; padding: 8px 10px 8px; border-bottom: 1px solid var(--wbc-border); }
.wbc-lbl { font-size: 12px; font-weight: 600; margin: 0 0 4px; }
.wbc-modes { display: flex; flex-wrap: wrap; gap: 4px; }
.wbc-mode { display: inline-flex; align-items: center; padding: 2px 10px; height: auto; min-height: 24px; margin: 0; border: 1px solid #90caf9; border-radius: 50px; background: #fff; color: var(--wbc-blue-dk);
    font: 600 11px 'Rubik','Open Sans',sans-serif; cursor: pointer; white-space: nowrap; }
.wbc-mode:hover { background: #f0f7fe; }
/* Sélection lisible sans la couleur (WCAG 1.4.1) : trait doublé et gras. */
.wbc-mode[aria-checked="true"] { background: #e3f2fd; border-color: var(--wbc-blue-dk); box-shadow: inset 0 0 0 1px var(--wbc-blue-dk); font-weight: 700; }
.wbc-mode[disabled] { opacity: .5; cursor: not-allowed; }
.wbc-choix { margin-top: 6px; position: relative; }
.wbc-choix[hidden] { display: none; }
.wbc-note { margin: 0; font-size: 11px; color: var(--wbc-text2); line-height: 1.5; }
#wbc-ov input.wbc-champ, #wbc-ov select.wbc-champ { box-sizing: border-box; width: 100%; min-width: 0; height: 26px; margin: 0; padding: 2px 8px;
    border: 1px solid var(--wbc-border); border-radius: 8px; background: var(--wbc-bg); font: 12px 'Rubik','Open Sans',sans-serif; color: var(--wbc-text); outline: none; }
#wbc-ov input.wbc-champ:focus, #wbc-ov select.wbc-champ:focus { background: #fff; border-color: var(--wbc-blue); }
#wbc-ov input.wbc-champ::placeholder { color: var(--wbc-text2); font-style: italic; }
.wbc-sugg { position: absolute; left: 0; right: 0; top: 28px; z-index: 5; list-style: none; margin: 0; padding: 3px 0; max-height: 240px; overflow-y: auto;
    background: #fff; border: 1px solid var(--wbc-border); border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,.18); }
.wbc-sugg[hidden] { display: none; }
.wbc-sugg li { padding: 5px 9px; font-size: 11px; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.wbc-sugg li.sel, .wbc-sugg li[data-code]:hover { background: #e3f2fd; }
.wbc-sugg li.wbc-vide { color: var(--wbc-grey); font-style: italic; cursor: default; }
.wbc-sugg small { color: var(--wbc-text2); }
.wbc-row { display: flex; align-items: center; gap: 6px; margin-top: 8px; min-width: 0; }
/* Deux lignes au plus : en département, l'étape en cours disparaissait au bout de la ligne (M24). */
.wbc-statut { flex: 1; min-width: 0; font-size: 11px; color: var(--wbc-text2); text-align: end; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.wbc-statut.erreur { color: #c62828; white-space: normal; }
/* Avancement : une ligne, des cases de largeur fixe ; seul le nom de la commune se coupe (…). */
.wbc-progres { display: grid; grid-template-columns: 3.4em minmax(0, 1fr) 11em; gap: 6px; margin-top: 6px; font-size: 11px; color: var(--wbc-text2);
    white-space: nowrap; font-variant-numeric: tabular-nums; }
.wbc-progres.dep { grid-template-columns: 3.4em 4.6em 4.8em minmax(0, 1fr) 11em; }
.wbc-progres[hidden] { display: none; }
/* Onglet en arrière-plan pendant un passage (0.15.01) : resté affiché jusqu'à la fin, pour être vu au retour. */
.wbc-arriere { margin: 6px 0 0; padding: 4px 8px; border-radius: 6px; background: #fff3e0; color: #8a3a00; font-size: 11px; line-height: 1.45; cursor: help; }
.wbc-arriere[hidden] { display: none; }
.wbc-progres > span { overflow: hidden; text-overflow: ellipsis; }
.wbc-progres .st-pct, .wbc-progres .st-cpt { text-align: end; font-weight: 700; color: var(--wbc-text); }
.wbc-progres .st-nom { font-weight: 600; color: var(--wbc-text); }
.wbc-switchs { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 12px; margin: 6px 0 0; }
.wbc-switchs .wbc-toggle-row { margin: 0; }
#wbc-switchs-vue { display: contents; }
.wbc-extras { position: sticky; bottom: -10px; z-index: 2; margin: 0 -10px -10px; padding: 0 10px 10px; background: #fff; }
.wbc-extras details[open] ul { max-height: 30vh; overflow-y: auto; }
.wbc-table th.cov, .wbc-table td.cov { width: 96px; text-align: end; white-space: nowrap; }
/* Tableau du département : chiffres resserrés, la place gagnée va aux noms de communes. */
.wbc-table-dep th.num, .wbc-table-dep td.num { width: 54px; }
.wbc-legende-dep { gap: 3px 8px; }
.wbc-legende-dep > span { display: inline-flex; align-items: center; white-space: nowrap; }
.wbc-barre { height: 6px; margin-top: 6px; border-radius: 3px; background: #e3eaf1; overflow: hidden; }
.wbc-barre[hidden] { display: none; }
.wbc-barre > i { display: block; height: 100%; width: 0; background: var(--wbc-blue); transition: width .2s; }
/* Animée par transform : elle continue de bouger quand la page calcule (ouvrir le Gard fige le fil
   principal plusieurs secondes), une marge animée s'y figeait. 233 % de 30 % = 70 % de la barre. */
.wbc-barre.en-cours > i { width: 30% !important; transition: none; animation: wbc-en-cours 1.1s ease-in-out infinite alternate; }
@keyframes wbc-en-cours { from { transform: translateX(0); } to { transform: translateX(233%); } }
#wbc-ov[dir="rtl"] .wbc-barre.en-cours > i { animation-name: wbc-en-cours-rtl; }
@keyframes wbc-en-cours-rtl { from { transform: translateX(0); } to { transform: translateX(-233%); } }
/* Une attente courte dans une ligne (vérification, recherche, suppression) : une roue, pas un texte. */
.wbc-roue { display: inline-block; flex-shrink: 0; box-sizing: border-box; width: 11px; height: 11px; border: 2px solid currentColor; border-inline-end-color: transparent;
    border-radius: 50%; vertical-align: -2px; opacity: .75; animation: wbc-roue .8s linear infinite; }
@keyframes wbc-roue { to { transform: rotate(360deg); } }
.wbc-mini { display: inline-block; width: 60px; height: 4px; margin-inline-end: 5px; border-radius: 2px; background: #e3eaf1; overflow: hidden; vertical-align: middle; }
.wbc-mini > i { display: block; height: 100%; background: var(--wbc-blue); transition: width .2s; }
@media (prefers-reduced-motion: reduce) { .wbc-barre.en-cours > i { animation: none; width: 100% !important; opacity: .45; } .wbc-roue { animation-duration: 2.4s; } }
#wbc-corps { flex: 1; min-height: 0; overflow-y: auto; padding: 10px; }
#wbc-resize { position: absolute; right: 0; bottom: 0; width: 16px; height: 16px; cursor: nwse-resize; z-index: 3; opacity: .5;
    background: linear-gradient(135deg, transparent 46%, #9aa5b1 46%, #9aa5b1 54%, transparent 54%),
                linear-gradient(135deg, transparent 70%, #9aa5b1 70%, #9aa5b1 78%, transparent 78%); }
#wbc-resize:hover { opacity: 1; }
/* Repliée : l'en-tête, et pendant un passage l'avancement et sa barre. La hauteur posée en ligne par
   le glisser est battue par !important, sinon replier ne rétrécit rien (même piège que WCT). */
#wbc-ov.replie { height: auto !important; min-height: 0; }
#wbc-ov.replie #wbc-corps, #wbc-ov.replie #wbc-resize, #wbc-ov.replie .wbc-ligne-haut, #wbc-ov.replie .wbc-switchs, #wbc-ov.replie #wbc-deja { display: none; }
#wbc-ov.replie #wbc-haut { padding-top: 0; border-bottom: 0; }
#wbc-ov.replie #wbc-haut:not(:has(> #wbc-progres:not([hidden]), > #wbc-barre:not([hidden]))) { display: none; }
#wbc-deja .wbc-memo { margin: 6px 0 0; }

/* Résultats */
.wbc-titre { display: flex; align-items: baseline; gap: 6px; margin: 0 0 8px; font-size: 14px; font-weight: 700; color: var(--wbc-text); }
.wbc-titre small { font-size: 11px; font-weight: 400; color: var(--wbc-text2); }
.wbc-retour { display: inline-block; margin: 0 0 6px; padding: 0; border: none; background: none; height: auto; min-height: 0;
    color: var(--wbc-blue-dk); font: 600 11px 'Rubik','Open Sans',sans-serif; cursor: pointer; }
.wbc-retour:hover { text-decoration: underline; }
/* Tuiles serrées, une rangée : chiffre, libellé, détail — ces deux derniers coupés (…) si la place manque. */
.wbc-kpis { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 5px; }
.wbc-kpi { padding: 3px 7px; border: 1px solid var(--wbc-border); border-radius: 7px; background: var(--wbc-bg); min-width: 0; }
.wbc-kpi b { display: block; font-size: 14px; line-height: 1.2; font-weight: 700; font-variant-numeric: tabular-nums; }
.wbc-kpi span { display: block; font-size: 10px; line-height: 1.3; color: var(--wbc-text2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.wbc-cov-l { display: flex; align-items: center; gap: 8px; margin: 6px 0 6px; font-size: 11px; color: var(--wbc-text2); }
.wbc-cov-l b { font-size: 13px; color: var(--wbc-text); font-variant-numeric: tabular-nums; }
.wbc-cov-l .wbc-cov { flex: 1; margin: 0; }
.wbc-titre-l { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; margin: 0 0 6px; }
.wbc-titre-l .wbc-titre { margin: 0; flex: 1 1 auto; min-width: 0; }
.wbc-actions { display: flex; flex-wrap: wrap; gap: 4px; }
.wbc-actions .wbc-btn { padding: 2px 8px; font-size: 10.5px; }
.wbc-n { font-weight: 400; opacity: .75; font-variant-numeric: tabular-nums; }
.wbc-ligne-haut { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.wbc-ligne-haut .wbc-choix { flex: 1 1 150px; margin-top: 0; min-width: 0; }
.wbc-ligne-haut .wbc-choix[data-pour="here"] { display: none; }
/* L'état ne prend que la place qui reste : Analyser ne passe plus à la ligne (mesuré le 27/09, fenêtre de 520 px). */
.wbc-switchs .wbc-statut { flex: 1 1 0; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; text-align: end; }
/* Pastilles de périmètre et de filtre resserrées ; la recherche des voies descend jusqu'à 80 px avant de passer
   à la ligne (filtres comptés + recherche = 474 px pour 483 utiles dans une fenêtre de 520, mesuré le 27/09). */
#wbc-ov .wbc-mode { padding: 2px 7px; }
.wbc-toggle-lbl .wbc-pt { width: 8px; height: 8px; border-width: 1px; margin-inline-end: 2px; vertical-align: 0; }
.wbc-toggle-lbl .wbc-pt:last-of-type { margin-inline-end: 5px; }
.wbc-kpi.ko b { color: #c62828; }
.wbc-kpi.ok b { color: #2e7d32; }
.wbc-kpi.warn b { color: #b23c00; }
.wbc-cov { height: 8px; margin: 8px 0 4px; border-radius: 4px; background: #e3eaf1; overflow: hidden; }
.wbc-cov > i { display: block; height: 100%; background: var(--wbc-blue); }
.wbc-ligne { font-size: 11px; color: var(--wbc-text2); margin: 4px 0 8px; line-height: 1.5; }
.wbc-outils { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin: 8px 0 6px; }
.wbc-filtres { display: flex; flex-wrap: wrap; gap: 4px; }
.wbc-outils input.wbc-champ { flex: 1 1 80px; width: auto !important; }
.wbc-toggle-row { display: flex; align-items: center; gap: 8px; margin: 0 0 6px; }
.wbc-toggle-lbl { font-size: 12px; font-weight: 600; cursor: pointer; }
.wbc-toggle { position: relative; width: 36px; height: 20px; flex-shrink: 0; }
.wbc-toggle input { opacity: 0; width: 0; height: 0; }
.wbc-toggle-slider { position: absolute; cursor: pointer; inset: 0; background: #8a94a0; border-radius: 50px; transition: background .2s; }
.wbc-toggle-slider:before { content: ''; position: absolute; width: 14px; height: 14px; inset-inline-start: 3px; bottom: 3px; background: #fff; border-radius: 50%; transition: transform .2s; }
.wbc-toggle input:checked + .wbc-toggle-slider { background: var(--wbc-blue); }
.wbc-toggle input:focus-visible + .wbc-toggle-slider { outline: 2px solid var(--wbc-blue-dk); outline-offset: 2px; }
.wbc-toggle input:checked + .wbc-toggle-slider:before { transform: translateX(16px); }
#wbc-ov[dir="rtl"] .wbc-toggle input:checked + .wbc-toggle-slider:before { transform: translateX(-16px); }
.wbc-table { width: 100%; border-collapse: collapse; font-size: 11.5px; table-layout: fixed; }
.wbc-table th { position: sticky; top: -10px; z-index: 1; background: #fff; padding: 5px 6px; text-align: start; font-size: 10.5px; font-weight: 700;
    color: var(--wbc-text2); text-transform: uppercase; letter-spacing: .03em; border-bottom: 2px solid var(--wbc-border); cursor: pointer; user-select: none; white-space: nowrap; }
/* 64 px et retour à la ligne permis dans l'en-tête : « DIFERENCIA ▼ » débordait de 52 px (M24). */
.wbc-table th.num, .wbc-table td.num { text-align: end; width: 64px; font-variant-numeric: tabular-nums; }
.wbc-table th.num { white-space: normal; }
.wbc-table th[aria-sort="ascending"]::after { content: ' \\25B2'; }
.wbc-table th[aria-sort="descending"]::after { content: ' \\25BC'; }
.wbc-table td { padding: 4px 6px; border-bottom: 1px solid #eef1f4; vertical-align: top; overflow: hidden; text-overflow: ellipsis; }
.wbc-table tr.wbc-l { cursor: pointer; }
.wbc-table tr.wbc-l:hover td { background: #f0f7fe; }
.wbc-table tr.wbc-l.ouvert td { background: #e3f2fd; }
.wbc-table td.ecart.ko { color: #c62828; font-weight: 700; }
.wbc-table td.ecart.ok { color: #2e7d32; font-weight: 700; }
.wbc-nom-ok { color: #2e7d32; font-weight: 700; }
.wbc-nom-diff { color: #b23c00; }
.wbc-nom-vide { color: #b23c00; font-style: italic; }
.wbc-nom-aucun { color: #c62828; font-style: italic; }
.wbc-absent { color: #b23c00; cursor: help; }
.wbc-del { display: block; font-size: 10px; color: var(--wbc-text2); }
.wbc-detail td { background: #fafcfe; padding: 6px 8px 8px; }
.wbc-detail h4 { margin: 0 0 4px; font-size: 11px; font-weight: 700; color: var(--wbc-text2); }
.wbc-nums { display: flex; flex-wrap: wrap; gap: 3px; }
.wbc-num { display: inline-flex; align-items: center; padding: 2px 8px; height: auto; min-height: 24px; margin: 0; border: 1px solid #ef9a9a; border-radius: 50px; background: #ffebee;
    color: #c62828; font: 600 11px 'Rubik','Open Sans',sans-serif; cursor: pointer; }
.wbc-num:hover { background: #ffcdd2; }
.wbc-num.trop { border-color: #ffcc80; background: #fff3e0; color: #b23c00; }
/* Suffixe à vérifier : violet — l'orange est réservé aux numéros EN TROP, sur la carte comme ici. */
.wbc-num.suffixe { border-color: #ce93d8; background: #f3e5f5; color: #6a1b9a; }
/* Posé par « Ajouter les numéros », pas encore enregistré : puce PLEINE, la couleur de l'anneau sur la carte (blanc sur #00838f : 4,6:1). */
.wbc-num.pose { border-color: #006064; background: #00838f; color: #fff; }
.wbc-num.pose:hover { background: #006064; }
.wbc-f-etat.pose { color: #006064; font-weight: 700; }
/* 0.13.01 : le quota sur SA ligne, en entier (02/10 : « tronqué sur sa longueur, il faut l'infobulle » —
   derrière le bouton à deux comptes, il débordait de la cellule). */
.wbc-hn-quota { display: block; margin: 4px 0 0; font-size: 11.5px; font-weight: 600; color: var(--wbc-text2); white-space: normal; }
.wbc-hn-quota.plein { color: #c62828; font-weight: 600; }
.wbc-hn-msg { margin: 0 0 6px; padding: 5px 8px; border-radius: 6px; background: #e0f7fa; color: #004d57; font-size: 11px; line-height: 1.45; }
.wbc-hn-msg.erreur { background: #ffebee; color: #b71c1c; }
/* Le temps que la fenêtre d'enregistrement de WME est affichée, WBC passe SOUS elle (mesuré le 29/09 :
   .save-popover-container est empilée au niveau 9, WBC à 9989 ⇒ le compte rendu d'enregistrement et ses
   erreurs étaient cachés). */
#wbc-ov.wbc-sous { z-index: 8 !important; }
.wbc-num.enregistre { border-color: #a5d6a7; background: #e8f5e9; color: #1b5e20; }
.wbc-legende { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; margin: -2px 0 6px; font-size: 11px; color: var(--wbc-text2); }
.wbc-pt { display: inline-block; width: 10px; height: 10px; margin-inline-end: 4px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 0 1px #9aa5b1; vertical-align: -1px; }
.wbc-pt.manquant { background: #e53935; }
.wbc-pt.present { background: #43a047; }
.wbc-pt.trop { background: #fb8c00; }
.wbc-num.courant { outline: 2px solid var(--wbc-blue-dk); outline-offset: 1px; }
.wbc-copier { display: inline-flex; align-items: center; gap: 5px; }
.wbc-ico-copie { flex: none; }
/* « + » d'une adresse seule (0.15.00) : pastille à l'angle, montrée au survol, au focus et sur la pastille courante —
   jamais « ✚ », qui marque déjà un numéro POSÉ. Turquoise de la pose (blanc sur #00838f : 4,6:1). */
.wbc-num-g { position: relative; display: inline-flex; }
.wbc-num-plus { position: absolute; top: -6px; inset-inline-end: -6px; z-index: 1; display: flex; align-items: center; justify-content: center;
    width: 17px; height: 17px; min-height: 0; margin: 0; padding: 0; border: 1px solid #fff; border-radius: 50%; background: #00838f; color: #fff;
    font: 700 13px/1 'Rubik','Open Sans',sans-serif; cursor: pointer; opacity: 0; box-shadow: 0 1px 3px rgba(0,0,0,.3); }
.wbc-num-g:hover .wbc-num-plus, .wbc-num-g:focus-within .wbc-num-plus, .wbc-num-g.courant .wbc-num-plus { opacity: 1; }
.wbc-num-plus:hover { background: #006064; }
.wbc-num-plus:focus-visible { outline: 2px solid var(--wbc-blue-dk); outline-offset: 1px; }
.wbc-tag { display: inline-block; padding: 0 6px; border-radius: 50px; background: #eceff1; color: #37474f; font-size: 10px; font-weight: 600; cursor: help; white-space: nowrap; }
.wbc-principal { color: var(--wbc-text2); font-size: 11px; }
.wbc-suivant { margin-inline-start: 6px; padding: 1px 8px; font-size: 10.5px; vertical-align: middle; }
.wbc-outils select.wbc-champ { flex: 0 1 180px; width: auto !important; }
.wbc-cov-mini { display: inline-block; width: 38px; height: 6px; margin-inline-end: 4px; border-radius: 3px; background: #e3eaf1; vertical-align: middle; overflow: hidden; }
.wbc-cov-mini > i { display: block; height: 100%; background: var(--wbc-blue); }
/* Légende de la carte du département : carrés pleins, sans le liseré blanc des points (10 px cerclés de
   blanc, la teinte se lisait mal, relevé à l'écran le 27/09). */
.wbc-pt.carre { width: 12px; height: 12px; border-radius: 2px; border: 0; box-shadow: none; vertical-align: -2px; }
.wbc-pt.gris { background: #9e9e9e; opacity: .5; }
/* Le champ fichier de la comparaison reste caché : une règle des champs de la fenêtre l'emportait sur
   l'attribut hidden, et « Choisir un fichier » s'affichait au pied de la fenêtre. */
#wbc-cmp-fichier { display: none !important; }
.wbc-cmp { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; margin: 6px 0 0; padding: 5px 8px; border: 1px solid #90caf9; border-radius: 8px;
    background: #e3f2fd; color: #0d47a1; font-size: 11px; }
.wbc-cmp span { flex: 1 1 200px; min-width: 0; }
.wbc-delta { color: var(--wbc-text2); }
.wbc-delta.plus { color: #1b5e20; font-weight: 700; }
.wbc-delta.moins { color: #c62828; font-weight: 700; }
.wbc-voie-outils { margin: 0 0 6px; }
.wbc-memo { display: flex; flex-wrap: wrap; align-items: center; gap: 3px 10px; margin: 0 0 6px; padding: 3px 8px; border: 1px solid var(--wbc-border);
    border-radius: 8px; background: var(--wbc-bg); font-size: 11px; color: var(--wbc-text2); }
.wbc-memo .date { font-weight: 600; color: var(--wbc-text); }
.wbc-memo .ok { color: #2e7d32; font-weight: 600; }
.wbc-memo .maj { color: #b23c00; font-weight: 700; }
.wbc-memo-btns { display: flex; gap: 4px; margin-inline-start: auto; }
.wbc-memo-btns .wbc-btn { padding: 1px 8px; font-size: 10.5px; }
.wbc-tag.maj { background: #fff3e0; color: #b23c00; border-color: #ffcc80; font-weight: 700; }
.wbc-memo-liste { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.wbc-memo-liste li { display: flex; align-items: center; gap: 6px; min-width: 0; font-size: 11px; }
.wbc-memo-nom { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.wbc-chip-x { flex-shrink: 0; width: 22px; height: 22px; padding: 0; border: 1px solid var(--wbc-border); border-radius: 50%; background: #fff;
    color: var(--wbc-text2); font-size: 10px; cursor: pointer; }
.wbc-chip-x:hover { background: #e53935; border-color: #e53935; color: #fff; }
.wbc-extra { margin-top: 10px; border: 1px solid var(--wbc-border); border-radius: 8px; }
.wbc-extra summary { padding: 5px 9px; font-size: 11px; font-weight: 700; cursor: pointer; background: var(--wbc-bg); border-radius: 8px; }
.wbc-extra[open] summary { border-radius: 8px 8px 0 0; }
.wbc-extra ul { list-style: none; margin: 0; padding: 6px 9px; }
.wbc-extra li { display: flex; flex-wrap: wrap; gap: 3px; align-items: baseline; margin-bottom: 4px; font-size: 11px; }
.wbc-extra li > span:first-child { margin-inline-end: 4px; font-weight: 600; }
.wbc-vide { color: var(--wbc-text2); font-size: 11px; padding: 10px 2px; line-height: 1.6; }
.wbc-err { color: #c62828; }

/* Fiche au survol d'un point du calque : posée sur le body, jamais dans un conteneur positionné de
   WME (elle passerait sous la carte), et sans capter la souris. */
#wbc-fiche { position: fixed; z-index: 10050; max-width: 300px; padding: 6px 9px; pointer-events: none;
    background: #fff; border: 1px solid var(--wbc-border); border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,.2);
    font: 11px/1.55 'Rubik','Open Sans',sans-serif; color: var(--wbc-text); }
#wbc-fiche[hidden] { display: none; }
#wbc-fiche b { font-size: 12px; }
/* Bulle épinglée d'une adresse cliquée (0.15.00) : la fiche, qui capte la souris, et « + Ajouter ce numéro ». */
#wbc-bulle { position: fixed; z-index: 10051; max-width: 300px; padding: 6px 26px 8px 9px; background: #fff; border: 1px solid var(--wbc-border);
    border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,.25); font: 11px/1.55 'Rubik','Open Sans',sans-serif; color: var(--wbc-text); }
#wbc-bulle[dir="rtl"] { padding: 6px 9px 8px 26px; }
#wbc-bulle[hidden] { display: none; }
#wbc-bulle b { font-size: 12px; }
.wbc-bulle-x { position: absolute; top: 3px; inset-inline-end: 3px; width: 20px; height: 20px; margin: 0; padding: 0; border: 0; border-radius: 50%;
    background: transparent; color: var(--wbc-text2); font-size: 12px; line-height: 20px; cursor: pointer; }
.wbc-bulle-x:hover { background: #eceff1; }
.wbc-bulle-act { margin-top: 6px; }
.wbc-bulle-btn { height: 26px; margin: 0; padding: 0 12px; border: 1px solid #006064; border-radius: 50px; background: #00838f; color: #fff;
    font: 600 11.5px 'Rubik','Open Sans',sans-serif; cursor: pointer; }
.wbc-bulle-btn:hover { background: #006064; }
.wbc-bulle-btn:focus-visible { outline: 2px solid var(--wbc-blue-dk); outline-offset: 2px; }
.wbc-bulle-btn[disabled] { border-color: #b0bec5; background: #eceff1; color: #78909c; cursor: not-allowed; }
.wbc-bulle-raison { margin-top: 4px; color: #b23c00; }
.wbc-f-etat { display: inline-block; margin-top: 2px; padding: 0 7px; border-radius: 50px; font-weight: 600; }
.wbc-f-etat.manquant { background: #ffebee; color: #c62828; }
.wbc-f-etat.present { background: #e8f5e9; color: #2e7d32; }
.wbc-f-etat.trop { background: #fff3e0; color: #b23c00; }
.wbc-f-etat.suffixe { background: #f3e5f5; color: #6a1b9a; }
`;

    // =====================================================================
    //  État de la fenêtre
    // =====================================================================

    let ovEl = null;
    const OPTS_DEF = () => ({ mode: 'here', carte: false, trouves: false, certSeules: false, survol: true, couleurs: {}, carteDep: true, replie: false });
    let opts = OPTS_DEF();
    let choixCommune = null;          // {code, nom, dep} choisi dans la recherche
    let choixDep = '';
    let jeton = null;                 // le passage en cours ({stop})
    let deja = null;                  // le balayage gardé proposé avant d'analyser ({e, cert, cible, ban, banDate})
    let resultat = null;              // commune affichée
    let resDep = null;                // département affiché (liste des communes)
    const resCommunes = new Map();    // code -> résultat, le temps de la session
    let vue = { filtre: 'todo', texte: '', tri: 'ecart', sens: -1, ouverte: null, deleguee: '', curseur: -1 };

    function lireOpts() {
        try { const o = Object.assign(OPTS_DEF(), JSON.parse(localStorage.getItem(OPTS_KEY) || '{}')); if (!o.couleurs || typeof o.couleurs !== 'object') o.couleurs = {}; return o; }
        catch (e) { return OPTS_DEF(); }
    }
    const ecrireOpts = () => { try { localStorage.setItem(OPTS_KEY, JSON.stringify(opts)); } catch (e) { } };
    const lireGeom = () => { try { return JSON.parse(localStorage.getItem(GEOM_KEY) || 'null'); } catch (e) { return null; } };
    const $ = sel => ovEl.querySelector(sel);

    function progres(p) {
        const e = $('#wbc-progres');
        if (!p) { e.hidden = true; e.innerHTML = ''; return; }
        const c = (cls, v) => '<span class="' + cls + '"><bdi>' + esc(v || '') + '</bdi></span>';
        e.classList.toggle('dep', !!p.cpt);
        e.innerHTML = c('st-pct', p.pct) + (p.cpt ? c('st-eta', p.eta) + c('st-cpt', p.cpt) : '') + c('st-nom', p.nom) + c('st-etape', p.etape);
        e.title = [p.pct, p.eta, p.cpt, p.nom, p.etape].filter(Boolean).join(' · ');
        e.hidden = false;
    }
    function statut(txt, erreur) {
        const e = $('#wbc-statut');
        e.textContent = txt || '';
        e.classList.toggle('erreur', !!erreur);
        e.title = txt || '';
    }
    // `enCours` : barre animée, pour une étape dont on ne connaît pas la durée.
    function barre(frac, enCours) {
        const b = $('#wbc-barre');
        b.hidden = frac == null;
        b.classList.toggle('en-cours', !!enCours);
        if (frac != null) b.firstElementChild.style.width = Math.round(frac * 100) + '%';
        if (jeton && frac != null && !enCours) titreAvancement(frac);
        // Une étape de durée inconnue n'a pas de valeur : la barre est alors « indéterminée ».
        if (frac != null && !enCours) b.setAttribute('aria-valuenow', String(Math.round(frac * 100)));
        else b.removeAttribute('aria-valuenow');
    }
    const annoncer = txt => { const a = ovEl && $('#wbc-annonce'); if (a) a.textContent = txt; };
    // ---- Onglet en arrière-plan (0.15.01, demande de l'auteur du 29/09) ----------------------------
    // Caché, l'onglet est freiné par Chrome (voir ceder()) : un passage ou un ajout qui a connu l'arrière-plan le
    // dit dans la fenêtre — c'est au RETOUR qu'on le lit : fini pendant l'absence, le bandeau reste jusqu'au retour
    // sur l'onglet, puis 15 s (essai du 14/10 : un ajout d'un numéro dure 350 ms, il s'effaçait avant tout retour).
    // Le titre de l'onglet porte l'avancement (« 35 % · WBC »), lisible depuis un autre onglet ; rendu à la fin.
    let titreOrigine = null, arrierePlanVu = false, masqueArriere = null;
    // hnEnCours est déclaré plus bas : un visibilitychange reçu avant sa déclaration ne doit pas lever d'erreur.
    const travailEnCours = () => { try { return !!jeton || hnEnCours; } catch (e) { return !!jeton; } };
    // `debut` : un nouveau travail part, l'avertissement du précédent ne vaut plus.
    function majArrierePlan(debut) {
        if (debut) arrierePlanVu = false;
        if (travailEnCours() && document.hidden) arrierePlanVu = true;
        clearTimeout(masqueArriere);
        if (arrierePlanVu && !travailEnCours() && !document.hidden) masqueArriere = setTimeout(() => { arrierePlanVu = false; majArrierePlan(); }, 15000);
        const e = ovEl && $('#wbc-arriere');
        if (e) e.hidden = !arrierePlanVu;
    }
    function titreAvancement(frac) {
        if (frac == null) { if (titreOrigine != null) { document.title = titreOrigine; titreOrigine = null; } return; }
        if (titreOrigine == null) titreOrigine = document.title;
        document.title = Math.round(frac * 100) + '\u00a0% · WBC';
    }
    // Fonction fléchée : passé tel quel, l'événement arrivait dans `debut` et effaçait le bandeau au retour (essai du 14/10).
    document.addEventListener('visibilitychange', () => majArrierePlan());
    // Chaque attente se voit (28/09) : durée connue ⇒ barre qui avance, inconnue
    // ⇒ barre animée ou roue, jamais un texte seul. `attendre(p)` tient la barre animée le temps de p ;
    // un passage en cours la pilote déjà, et des attentes qui se chevauchent ne l'éteignent pas trop tôt.
    let attentes = 0;
    async function attendre(p) {
        attentes++;
        if (!jeton && ovEl) barre(0, true);
        try { return await p; }
        finally { if (--attentes === 0 && !jeton && ovEl) barre(null); }
    }
    // La roue porte son texte en infobulle et pour le lecteur d'écran.
    const roue = tip => '<span class="wbc-roue" role="img" title="' + esc(tip) + '" aria-label="' + esc(tip) + '"></span>';

    // =====================================================================
    //  Lancer, arrêter
    // =====================================================================

    // `tache(j)` : un passage imposé (vérifier WME, rafraîchir une commune) ; `certImpose` : son filtre des certifiées.
    async function lancer(reprise, tache, certImpose) {
        if (jeton) return;
        // Une reprise garde le filtre des certifiées du passage qu'elle complète : deux règles ne se
        // mêlent pas dans les totaux d'un même département.
        const cert = certImpose != null ? !!certImpose : reprise && resDep ? !!resDep.certSeules : !!opts.certSeules;
        const j = jeton = { stop: false, certSeules: cert, departement: !!reprise || (!tache && opts.mode === 'dep') };
        const t0 = Date.now();
        majBoutons();
        majArrierePlan(true);
        // Jusqu'à la première étape chiffrée (commune localisée, liste du département, mémoire) : barre animée.
        barre(0, true);
        annoncer(t('analyse') + '…');
        let fin = '';
        try {
            // Un verrou Web Lock tenu le temps du passage : Chrome ne GÈLE pas un onglet qui en détient un
            // (gel des onglets en arrière-plan, économiseur d'énergie). Sans l'API, le passage tourne quand même.
            const passage = () => tache ? tache(j) : (reprise || opts.mode === 'dep') ? lancerDepartement(j, reprise) : lancerCommune(j);
            if (navigator.locks && navigator.locks.request) await navigator.locks.request('wme-ban-coverage-analyse', passage);
            else await passage();
            const s = new Intl.NumberFormat(LOCALES[_lang] || 'en', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format((Date.now() - t0) / 1000);
            // Un département qui a des échecs ne se dit pas « Terminé » tout court (audit M20).
            fin = j.echecs ? t('stDoneErr', s, nb(j.echecs)) : t('stDone', s);
            statut(fin, !!j.echecs);
        } catch (e) {
            if (j.finDep && resDep) { try { await j.finDep(); } catch (x) { log('mémoire : ' + x.message); } }
            if (e.arret) fin = t('stStopped');
            else { log(e.stack || e.message); fin = messageErreur(e); }
            statut(fin, !e.arret);
        } finally {
            jeton = null;
            barre(null);
            progres(null);
            titreAvancement(null);
            majArrierePlan();
            majBoutons();
            annoncer(fin);
            // Les boutons qui n'existent qu'une fois le passage fini (reprise des échecs, Vérifier WME, Rafraîchir)
            // apparaissent : la vue était dessinée pendant le passage, sans eux (commune : relevé le 27/09).
            rendre();
        }
    }
    const arreter = () => { if (jeton) jeton.stop = true; };

    // ---- Droits de copie (L6, Local Champs, Global Champs, 28/09) ----------------
    // Le rang vient de WME (0-indexé : 5 = L6). Le statut de Champ n'existe QUE dans les groupes du forum
    // Discuss, servi par le même site que WME : on le lit avec la session de l'éditeur (mesuré le 28/09 :
    // `fr-local-champ`, `editors-global-champ`…). Les Emeritus n'en sont plus. Ce n'est pas une sécurité
    // (le script se lit) : le bouton Copier sert à publier un chiffre, il est réservé à ceux qui le portent.
    // Habilitation en empreintes, comme les autres verrous (11/10/2026 : aucun
    // verrou de rang ou de rôle en clair). Ne pas modifier sans accord du mainteneur du script.
    let droitChamp = false;
    const _cx = t => { let x = 0x811c9dc5; for (let i = 0; i < t.length; i++) { x ^= t.charCodeAt(i); x = Math.imul(x, 0x01000193) >>> 0; } return x >>> 0; };
    const _cz = [0x853f760, 0xb53fc19, 0x851b8c9, 0x4631c6b8, 0x3e2070ff];
    const _cq = 0x734005f7;
    const _cok = j => j.some(x => _cz.indexOf(_cx(x)) >= 0) && ((_cz.reduce((a, b) => (a ^ b) >>> 0, 0) >>> 0) === _cq);
    async function lireDroitChamp() {
        let u = null;
        try { u = await sdk.State.getUserInfo(); } catch (e) { }
        const wu = pw.W && pw.W.loginManager && pw.W.loginManager.user;
        const rang = u && u.rank != null ? u.rank : wu ? wu.rank : null;
        const j = [];
        if (rang != null) j.push('r' + rang);
        if (wu && wu.isStaff) j.push('s1');
        if (_cok(j)) return true;
        const nom = (u && u.userName) || (wu && wu.userName);
        if (!nom) return false;
        try {
            const r = await pw.fetch('/discuss/u/' + encodeURIComponent(nom) + '.json', { credentials: 'same-origin', headers: { Accept: 'application/json' } });
            if (!r.ok) return false;
            const d = JSON.parse(await r.text());
            const gr = ((d.user && d.user.groups) || []).map(g => String(g.name)).filter(n => !/emeritus/i.test(n));
            if (gr.some(n => /(^|-)local-champ$/i.test(n))) j.push('lc');
            if (gr.some(n => /(^|-)global-champ$/i.test(n))) j.push('gc');
            return _cok(j);
        } catch (e) { log('droits : ' + e.message); return false; }
    }

    // Avant d'analyser, le balayage déjà gardé du même périmètre (même filtre des certifiées) est
    // annoncé avec sa date : un département se relance en plusieurs minutes pour rien
    // (28/09). Un avertissement, pas un verrou : « Relancer » reste à un clic.
    let demande = false;
    async function demanderAnalyse() {
        if (jeton || deja || demande) return;
        demande = true;
        const cert = !!opts.certSeules;
        try {
            const { e, cible } = await attendre((async () => {
                let code = null, cible = null, e = null;
                // Une commune du département affichée : c'est ELLE qui se relance (02/10 : après
                // avoir ajouté des numéros à Saint-Malo, « Analyser » relançait les 332 communes de l'Ille-et-Vilaine).
                const cd = communeDuDep();
                if (cd) { cible = cd; code = cd.code; }
                else if (opts.mode === 'dep') code = choixDep;
                else if (opts.mode === 'commune') code = choixCommune && choixCommune.code;
                else {
                    // Centre de la carte : la commune est localisée ici, et le passage reprend CETTE commune
                    // (la carte a pu bouger pendant la question).
                    statut(t('stLocate'));
                    try { const c = await sdk.Map.getMapCenter(); cible = await Geo.auPoint(c.lon, c.lat); } catch (er) { cible = null; }
                    statut('');
                    code = cible && cible.code;
                }
                if (code) try { e = await Memo.lire('index', cleMemo(code, cert)); } catch (er) { log('mémoire : ' + er.message); }
                return { e, cible };
            })());
            if (!e || jeton) { if (!jeton) lancerSans(cible); return; }
            deja = { e, cert, cible };
            montrerDeja();
            if (e.type === 'commune') verifierBanDeja(deja);
        } finally { demande = false; }
    }
    // La commune affichée depuis la liste du département choisi, ou null. Pour balayer tout le
    // département, « Retour au département » d'abord : Analyser vise ce qui est à l'écran.
    const communeDuDep = () => opts.mode === 'dep' && resultat && resDep && resDep.dep.code === choixDep &&
        resDep.communes.some(l => l.commune.code === resultat.commune.code) ? resultat.commune : null;
    const lancerSans = cible => cible ? lancer(null, j => lancerCommune(j, cible)) : lancer();
    // La BAN d'une commune se vérifie en une requête (ETag) : l'information la plus utile pour décider.
    // Pour un département (une requête par commune), la date seule.
    async function verifierBanDeja(d) {
        let r = null;
        try { r = await Memo.lire('communes', d.e.cle); } catch (er) { log('mémoire : ' + er.message); }
        let v = 'aucune', date = null;
        if (r && r.memo && r.memo.etag && !r.memo.etag.split('|').some(x => !x)) {
            try {
                v = (await etagBan(d.e.code)) === r.memo.etag ? 'ok' : 'maj';
                if (v === 'maj') date = await dateBan(d.e.code);
            } catch (er) { v = 'erreur'; log('BAN ' + d.e.nom + ' : ' + er.message); }
        }
        if (deja !== d) return;
        d.ban = v;
        d.banDate = date;
        montrerDeja();
    }
    function montrerDeja() {
        const el = ovEl && $('#wbc-deja');
        if (!el) return;
        if (!deja) { el.hidden = true; el.innerHTML = ''; majBoutons(); return; }
        const e = deja.e, d = deja;
        // Réécrit quand la vérification BAN répond : le focus revient au bouton qu'il occupait.
        const a = document.activeElement;
        const ajouts = ajoutsDepuis(e);
        const garde = a && el.contains(a) ? a.dataset.act : (!a || a === document.body || ovEl.contains(a)) ? (ajouts ? 'dejarelancer' : 'dejaouvrir') : null;
        const quand = e.type === 'dep' ? t('dejaDep', dateHeure(e.date), nb(e.n), nb(e.total)) : t('dejaCommune', dateHeure(e.date));
        const ban = e.type !== 'commune' || d.ban === 'aucune' ? '' : d.ban == null ? banAttente()
            : d.ban === 'ok' ? bout('ok', t('memoBanOk')) : d.ban === 'maj' ? bout('maj', t('memoBanMaj', d.banDate ? dateCourte(d.banDate) : '')) : bout('maj', t('memoBanErr'));
        el.innerHTML = '<div class="wbc-memo wbc-deja">' + bout('date', quand) + bout('', (e.nom ? e.nom + ' · ' : '') + pct(e.presents, e.ban)) +
            (e.viaDep ? bout('', t('dejaViaDep', e.viaDep)) : '') + ban + (ajouts ? bout('maj', t('dejaHnDepuis', nb(ajouts))) : '') +
            // Des numéros ajoutés par WBC depuis : le balayage gardé est dépassé, « Relancer » devient le bouton plein.
            '<span class="wbc-memo-btns"><button type="button" class="wbc-btn ' + (ajouts ? 'wbc-btn-neutral' : 'wbc-btn-primary') + '" data-act="dejaouvrir" title="' + esc(t('dejaOpenTip')) + '">' + esc(t('memoOpen')) + '</button>' +
            '<button type="button" class="wbc-btn ' + (ajouts ? 'wbc-btn-primary' : 'wbc-btn-neutral') + '" data-act="dejarelancer" title="' + esc(t('dejaRelaunchTip')) + '">' + esc(t('dejaRelaunch')) + '</button></span></div>';
        el.hidden = false;
        majBoutons();
        const b = garde && el.querySelector('[data-act="' + garde + '"]');
        if (b) b.focus();
    }
    function oublierDeja() {
        if (!deja) return;
        deja = null;
        montrerDeja();
    }
    function repondreDeja(ouvrir) {
        const d = deja;
        if (!d || jeton) return;
        oublierDeja();
        if (!ouvrir) { lancerSans(d.cible); return; }
        if (d.e.type === 'dep') ouvrirMemoDep(d.e.code, d.cert);
        else ouvrirMemoCommune(d.e.code, d.cert);
        // Le bouton cliqué a disparu avec le bandeau : le focus passe à Analyser, revenu à sa place.
        const go = $('[data-act="go"]');
        if (go && !go.hidden) go.focus();
    }

    async function lancerCommune(j, cible) {
        let com;
        if (cible) com = cible;
        else if (opts.mode === 'here') {
            statut(t('stLocate'));
            const c = await sdk.Map.getMapCenter();
            com = await Geo.auPoint(c.lon, c.lat);
            if (!com) throw new Error(t('errNoCommune'));
        } else {
            if (!choixCommune) throw new Error(t('errPick'));
            statut(t('stLocate'));
            com = await Geo.parCode(choixCommune.code);
        }
        if (j.stop) throw Arret();
        statut('');
        const r = await analyserCommune(com, nouveauCache(), j, (txt, f, enCours) => { barre(f, enCours); progres({ pct: enCours ? '' : pct(f, 1), nom: com.nom, etape: txt }); });
        if (r.vide) throw new Error(t('errBan'));
        // Le balayage précédent du même périmètre devient la référence de la comparaison, sans export.
        let avant = null;
        try { avant = await Memo.lire('communes', cleMemo(com.code, j.certSeules)); } catch (e) { log('mémoire : ' + e.message); }
        cmp = avant && avant.memo ? cmpDepuisCommune(avant) : null;
        r.verif = {};
        // Rafraîchie depuis un département gardé : sa ligne du département suit, et le département est regardé.
        const ligneDep = resDep && resDep.certSeules === !!j.certSeules ? resDep.communes.find(x => x.commune.code === com.code) : null;
        await garderCommune(r, ligneDep ? resDep.dep.code : '');
        if (ligneDep) { ligneDep.totaux = r.totaux; ligneDep.memo = r.memo; ligneDep.etat = 'ok'; ligneDep.erreur = ''; ligneDep.verif = r.verif; await garderDep(); }
        resCommunes.set(com.code, r);
        // Le département affiché n'est plus effacé : « Retour au département » y ramène (audit M22,
        // 200 s de calcul perdues sur le Gard).
        montrerCommune(r);
    }

    // `reprise` : ne relancer que les communes en échec du département affiché (audit du 26/09, M20 :
    // il fallait tout relancer, 200 s pour le Gard, pour reprendre une commune).
    async function lancerDepartement(j, reprise) {
        let lignes;
        let avantDep = null;
        if (reprise && resDep) {
            // Une reprise (échecs) ou un rafraîchissement (communes signalées) se compare au département tel qu'il était.
            avantDep = cmpDepuisDep(resDep, resDep.date || Date.now());
            lignes = Array.isArray(reprise) ? reprise : resDep.communes.filter(c => c.etat === 'erreur');
            lignes.forEach(l => { l.etat = 'attente'; l.erreur = ''; l.verif = {}; });
        } else {
            if (!choixDep) throw new Error(t('errPickDep'));
            statut(t('stLocate'));
            const deps = await Geo.listeDepartements();
            const dep = deps.find(d => d.code === choixDep) || { code: choixDep, nom: choixDep };
            const liste = await Geo.communesDe(dep.code);
            // Ordre spatial (bandes de latitude, puis longitude en serpentin) : deux communes
            // successives se touchent le plus souvent, et leurs carreaux WME resservent.
            const centre = c => c.bbox ? [(c.bbox[0] + c.bbox[2]) / 2, (c.bbox[1] + c.bbox[3]) / 2] : [0, 0];
            liste.sort((a, b) => {
                const [xa, ya] = centre(a), [xb, yb] = centre(b);
                const ba = Math.floor(ya / CARREAU), bb = Math.floor(yb / CARREAU);
                if (ba !== bb) return bb - ba;
                return ba % 2 ? xb - xa : xa - xb;
            });
            // Les résultats d'une analyse précédente sont libérés : un département garde toutes ses
            // adresses en mémoire, deux en gardaient deux fois plus (audit M25).
            resCommunes.clear();
            try { const a = await Memo.lire('deps', cleMemo(dep.code, j.certSeules)); if (a) avantDep = cmpDepuisDep(a, a.date); } catch (e) { log('mémoire : ' + e.message); }
            resDep = { dep, certSeules: !!j.certSeules, communes: liste.map(c => ({ commune: c, totaux: null, etat: 'attente' })) };
            lignes = resDep.communes;
        }
        const communes = lignes.map(l => l.commune);
        let sauvegardes = Promise.resolve();
        // Arrêt ou erreur : ce qui est fait est gardé quand même.
        const finDepartement = async avant => { await sauvegardes; resDep.date = Date.now(); await garderDep(); if (avant) cmp = avant; };
        j.finDep = () => finDepartement(avantDep);
        statut('');
        resultat = null;
        rendre();
        const cache = nouveauCache();
        // La BAN de la commune SUIVANTE se télécharge pendant que la courante lit WME et calcule :
        // les deux attentes se recouvrent au lieu de s'additionner.
        const lireBan = k => { const p = lireBanCommune(communes[k].code, () => { }); p.catch(() => { }); return p; };
        let suivante = null;
        const debut = Date.now();
        let reste = '';
        for (let i = 0; i < communes.length; i++) {
            if (j.stop) throw Arret();
            const c = communes[i], ligne = lignes[i];
            const banPret = suivante || lireBan(i);
            suivante = i + 1 < communes.length ? lireBan(i + 1) : null;
            // Temps restant : la moyenne des communes faites, à partir de la troisième.
            if (i >= 3) {
                const min = (Date.now() - debut) / i * (communes.length - i) / 60000;
                // Arrondi AU-DESSUS : « moins d'une minute » s'affichait à 58 % du Gard, Nîmes encore à venir.
                reste = min < 0.5 ? '< 1 min' : t('etaShort', Math.ceil(min));
            }
            barre(i / communes.length);
            try {
                const r = await analyserCommune(c, cache, j, (txt, f) => {
                    const tout = (i + f) / communes.length;
                    barre(tout);
                    progres({ pct: pct(tout, 1), eta: reste, cpt: nb(i + 1) + '/' + nb(communes.length), nom: c.nom, etape: txt });
                }, banPret);
                if (r.vide) ligne.etat = 'vide';
                else {
                    ligne.totaux = r.totaux; ligne.etat = 'ok'; ligne.memo = r.memo; ligne.verif = {}; r.verif = ligne.verif;
                    resCommunes.set(c.code, r);
                    // Gardée au fil de l'eau, en file (pas d'attente dans la boucle) : un arrêt ne perd pas ce qui est fait.
                    const code = resDep.dep.code;
                    sauvegardes = sauvegardes.then(() => garderCommune(r, code));
                }
            } catch (e) {
                if (e.arret) throw e;
                ligne.etat = 'erreur';
                ligne.erreur = messageErreur(e);
                log(c.nom + ' : ' + e.message);
            }
            if (!resultat) rendreDep(false);
        }
        j.echecs = resDep.communes.filter(c => c.etat === 'erreur').length;
        await finDepartement(avantDep);
        if (!resultat) rendreDep(true);
    }

    // =====================================================================
    //  Rendu
    // =====================================================================

    // Le corps de la fenêtre se reconstruit en entier ; l'élément qui avait le focus (filtre, tri,
    // ligne, numéro…) et la position de défilement sont RENDUS après coup — sans cela, chaque clic de
    // filtre ou de tri renvoyait le clavier au début de la page (audit du 26/09, M19).
    const ATTRS_FOCUS = ['data-filtre', 'data-tri', 'data-tridep', 'data-voie', 'data-commune', 'data-adr', 'data-hn1', 'data-act', 'data-trop', 'data-doublon'];
    function rendre() {
        if (!ovEl) return;
        const corps = $('#wbc-corps');
        const actif = document.activeElement && corps.contains(document.activeElement) ? document.activeElement : null;
        let cible = null, curseur = null;
        if (actif) {
            if (actif.id) cible = '#' + actif.id;
            else { const a = ATTRS_FOCUS.find(x => actif.hasAttribute(x)); if (a) cible = '[' + a + '="' + String(actif.getAttribute(a)).replace(/"/g, '') + '"]'; }
            if (actif.id === 'wbc-filtre-txt') curseur = actif.selectionStart;
        }
        const haut = corps.scrollTop;
        if (resultat) corps.innerHTML = htmlCommune(resultat);
        else if (resDep) corps.innerHTML = htmlDepartement(resDep);
        else corps.innerHTML = '<p class="wbc-vide">' + esc(t('emptyIntro')) + '</p>';
        majCommunes();
        majInterrupteurs();
        // L'infobulle d'Analyser dit ce qu'il vise : la commune affichée ou le périmètre choisi.
        majBoutons();
        const f = corps.querySelector('#wbc-filtre-txt');
        if (f) f.value = vue.texte;
        corps.scrollTop = haut;
        if (cible) {
            const e = corps.querySelector(cible);
            if (e) { e.focus({ preventScroll: true }); if (curseur != null) try { e.setSelectionRange(curseur, curseur); } catch (x) { } }
        }
    }
    // En département, le tableau se retrie à chaque commune : on ne le redessine qu'au plus toutes les
    // 1,5 s, et pas tant que le pointeur est dessus — la ligne visée ne bouge plus sous la souris.
    let rendreDepTimer = null;
    function rendreDep(force) {
        clearTimeout(rendreDepTimer);
        const corps = ovEl && $('#wbc-corps');
        if (!force && corps && corps.matches(':hover')) { rendreDepTimer = setTimeout(() => rendreDep(false), 1500); return; }
        if (force) { rendre(); return; }
        rendreDepTimer = setTimeout(() => { if (!resultat) rendre(); }, 1500);
    }

    // ---- Comparaison à un export relu ----------------------------------------------------------------
    let cmp = null;                   // {date, data} : l'export chargé (Core.lireExport)
    const signe = d => (d > 0 ? '+' : d < 0 ? '\u2212' : '\u00b1') + nb(Math.abs(d));
    const dateCourte = ms => new Intl.DateTimeFormat(LOCALES[_lang] || 'en', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(ms);
    const cmpCommune = r => cmp && cmp.data.type === 'commune' && r && cmp.data.code === r.commune.code ? cmp : null;
    const cmpDep = () => cmp && cmp.data.type === 'dep' && resDep && !resultat ? cmp : null;
    function ligneCmp(c, T) {
        const A = c.data.totaux;
        return '<p class="wbc-cmp"><span>' + esc(t(c.source === 'memo' ? 'cmpLineMemo' : 'cmpLine', dateCourte(c.date), signe(T.presents - A.presents), signe(T.manquants - A.manquants), signe((T.enTrop || 0) - A.enTrop))) +
            (c.data.certSeules !== !!T.certSeules ? ' — ' + esc(t('cmpCert')) : '') + '</span>' +
            '<button type="button" class="wbc-btn wbc-btn-neutral" data-act="cmpx" title="' + esc(t('tipCmpStop')) + '">' + esc(t('cmpStop')) + '</button></p>';
    }
    const celluleDelta = (d, date) => '<td class="num wbc-delta' + (d == null ? '' : d > 0 ? ' plus' : d < 0 ? ' moins' : '') + '" title="' + esc(t('thDeltaTip', date)) + '">' + (d == null ? '—' : d ? signe(d) : '0') + '</td>';
    const boutonCmp = () => '<button type="button" class="wbc-btn wbc-btn-neutral" data-act="cmp" title="' + esc(t('cmpTip')) + '">' + esc(t('cmpBtn')) + '</button>';
    async function chargerExport(fichier) {
        let data = null;
        try { data = Core.lireExport(await attendre(fichier.text())); } catch (e) { data = null; }
        if (!data) { statut(t('cmpBad'), true); return; }
        const ok = resultat ? data.type === 'commune' && data.code === resultat.commune.code
            : resDep ? data.type === 'dep' && resDep.communes.some(c => data.communes.has(c.commune.code)) : false;
        if (!ok) { statut(t('cmpWrong'), true); return; }
        // La date du relevé : celle du nom du fichier exporté (ban-wme_…_AAAA-MM-JJ.csv), sinon celle du fichier.
        const m = /(\d{4})-(\d{2})-(\d{2})\.csv$/i.exec(fichier.name || '');
        cmp = { date: m ? new Date(+m[1], +m[2] - 1, +m[3]).getTime() : (fichier.lastModified || Date.now()), data };
        statut('');
        rendre();
    }

    // Le texte entier en infobulle : dans une tuile étroite, libellé et détail se coupent (…).
    const kpi = (val, lbl, cls, sous) => '<div class="wbc-kpi' + (cls ? ' ' + cls : '') + '" title="' + esc(lbl + (sous ? ' — ' + sous : '')) + '"><b>' + val + '</b><span>' + esc(lbl) + '</span>' + (sous ? '<span>' + esc(sous) + '</span>' : '') + '</div>';

    // Les chiffres affichés suivent le filtre de commune déléguée : avant, seul le tableau filtrait
    // et les chiffres restaient ceux de la commune nouvelle entière (audit du 26/09, M7). Les numéros
    // en trop ou en double ne se rattachent à aucune voie BAN, donc à aucune déléguée : « — ».
    function totauxVus(r) {
        if (!vue.deleguee) return r.totaux;
        const vs = r.voies.filter(v => v.deleguee === vue.deleguee);
        const s = k => vs.reduce((x, v) => x + v[k], 0);
        const nbStatut = st => vs.filter(v => v.statutNom === st).length;
        return Object.assign({}, r.totaux, {
            ban: s('ban'), hn: s('hn'), rpp: s('rpp'), presents: s('presents'), manquants: s('ban') - s('presents'), suffixes: s('suffixes'),
            cert: vs.reduce((x, v) => x + v.adresses.filter(a => a.cert).length, 0), enTrop: null, doublons: null,
            voies: vs.length, voiesCompletes: vs.filter(v => v.presents === v.ban).length,
            voiesSansNom: nbStatut('sansNom'), voiesAutreNom: nbStatut('different'), voiesSansSegment: nbStatut('aucun'),
            voiesAlt: nbStatut('alternatif'), voiesRoute: nbStatut('numeroRoute'),
            voiesProche: vs.filter(v => ['autreType', 'autreArticle', 'orthographe', 'nomPartiel'].includes(v.statutNom)).length,
        });
    }

    // Quatre tuiles sur UNE rangée ; la couverture n'est plus une tuile mais le chiffre en tête de sa barre
    // (27/09 : deux rangées de tuiles prenaient 154 px sur 611 dans sa fenêtre).
    function htmlKpis(T) {
        const c = pct(T.presents, T.ban);
        return '<div class="wbc-kpis">' +
            kpi(nb(T.ban), t('kBan'), '', t('kCert', nb(T.cert))) +
            kpi(nb(T.presents), t('kWme'), '', t('kHnRpp', nb(T.hn), nb(T.rpp))) +
            kpi(nb(T.manquants), t('kMiss'), T.manquants ? 'ko' : 'ok', T.suffixes ? t('kSuf', nb(T.suffixes)) : '') +
            (T.enTrop == null ? kpi('—', t('kExtra'), '', t('delNote'))
                : kpi(nb(T.enTrop), t('kExtra'), T.enTrop ? 'warn' : '', T.doublons ? t('kDup', nb(T.doublons)) : '')) +
            '</div><div class="wbc-cov-l" title="' + esc(t('kCov')) + '"><b>' + esc(c) + '</b><span class="wbc-cov" role="img" aria-label="' + esc(t('kCov') + ' ' + c) + '"><i style="width:' +
            (T.ban ? (100 * T.presents / T.ban).toFixed(1) : 0) + '%"></i></span><span class="wbc-cov-lbl">' + esc(t('kCov')) + '</span></div>';
    }

    function voiesFiltrees(r) {
        const q = Core.normNom(vue.texte);
        let l = r.voies.filter(v => {
            if (vue.filtre === 'todo' && v.presents >= v.ban) return false;
            if (vue.filtre === 'done' && v.presents < v.ban) return false;
            // « Nom à vérifier » : tout sauf le nom BAN porté en principal ou en alternatif.
            if (vue.filtre === 'name' && (v.statutNom === 'identique' || v.statutNom === 'alternatif')) return false;
            if (vue.deleguee && v.deleguee !== vue.deleguee) return false;
            return !q || Core.normNom(v.nom).includes(q) || Core.normNom(v.nomWme || '').includes(q);
        });
        const cle = {
            nom: v => v.nom, wme: v => v.nomWme || '', ban: v => v.ban, wmeN: v => v.presents, ecart: v => v.ban - v.presents,
        }[vue.tri] || (v => v.ban - v.presents);
        l = l.slice().sort((a, b) => {
            const x = cle(a), y = cle(b);
            const c = typeof x === 'number' ? x - y : String(x).localeCompare(String(y), LOCALES[_lang]);
            return c * vue.sens || a.nom.localeCompare(b.nom, LOCALES[_lang]);
        });
        return l;
    }

    function celluleNom(v) {
        let h;
        const tag = (txt, tip) => ' <span class="wbc-tag" title="' + esc(tip) + '">' + esc(txt) + '</span>';
        if (v.statutNom === 'identique') h = '<span class="wbc-nom-ok" title="' + esc(t('tipSame')) + '">&#x2713;</span>';
        else if (v.statutNom === 'alternatif') h = '<span class="wbc-nom-ok">&#x2713;</span>' + tag(t('altTag'), t('tipAlt', v.nomPrincipal)) + ' <bdi class="wbc-principal">' + esc(v.nomPrincipal) + '</bdi>';
        else if (v.statutNom === 'numeroRoute') h = '<span class="wbc-nom-diff"><bdi>' + esc(v.nomWme) + '</bdi></span>' + tag(t('routeTag'), t('tipRoute'));
        else if (v.statutNom === 'autreType') h = '<span class="wbc-nom-diff"><bdi>' + esc(v.nomWme) + '</bdi></span>' + tag(t('typeTag'), t('tipType'));
        else if (v.statutNom === 'autreArticle') h = '<span class="wbc-nom-diff"><bdi>' + esc(v.nomWme) + '</bdi></span>' + tag(t('articleTag'), t('tipArticle'));
        else if (v.statutNom === 'orthographe') h = '<span class="wbc-nom-diff"><bdi>' + esc(v.nomWme) + '</bdi></span>' + tag(t('orthoTag'), t('tipOrtho'));
        else if (v.statutNom === 'nomPartiel') h = '<span class="wbc-nom-diff"><bdi>' + esc(v.nomWme) + '</bdi></span>' + tag(t('partielTag'), t('tipPartiel'));
        // Autre nom ET nom BAN introuvable dans la commune : la voie manque dans WME, et le nom
        // montré n'est que celui de la rue voisine où tombent ses numéros.
        else if (v.statutNom === 'different' && v.nomAbsent) h = tag(t('absentTag'), t('tipAbsent')) + ' <bdi class="wbc-principal" title="' + esc(t('tipOther')) + '">' + esc(v.nomWme) + '</bdi>';
        else if (v.statutNom === 'sansNom') h = '<span class="wbc-nom-vide">' + esc(t('nameNone')) + '</span>';
        else if (v.statutNom === 'aucun') h = '<span class="wbc-nom-aucun">' + esc(t('nameNoSeg')) + '</span>';
        else h = '<span class="wbc-nom-diff" title="' + esc(t('tipOther')) + '"><bdi>' + esc(v.nomWme) + '</bdi></span>';
        if (v.nomAbsent && !(v.statutNom === 'different')) h += ' <span class="wbc-absent" title="' + esc(t('tipAbsent')) + '" aria-label="' + esc(t('tipAbsent')) + '">&#x26A0;</span>';
        return h;
    }

    // L'en-tête triable porte un BOUTON : atteignable au clavier, annoncé comme commande (M23).
    const th = (cle, lbl, num) => '<th scope="col"' + (num ? ' class="num"' : '') + (vue.tri === cle ? ' aria-sort="' + (vue.sens > 0 ? 'ascending' : 'descending') + '"' : '') + '><button type="button" class="wbc-th" data-tri="' + cle + '" title="' + esc(t('tipSort')) + '">' + esc(lbl) + '</button></th>';

    // Les pastilles des numéros manquants d'une voie ouverte. Le « + » (0.15.00, L6) ajoute l'adresse SEULE : visible
    // au survol, au focus et sur la pastille courante, seulement si l'ajout peut la poser (pré-contrôle du bouton).
    function htmlNums(v, i) {
        const plus = droitHn && !hnEnCours && nomOkHn(v) && Core.quotaHn(lireHorodatages(), Date.now()).reste > 0;
        return '<div class="wbc-nums">' + v.adresses.map((a, k) => {
            if (a.trouve) return '';
            const p = plus && hnPosable(a);
            const tip = a.hnPose ? t('ajHnPoseTip') : a.hnEnregistre ? t('ajHnSavedTip') : a.suffixe ? t('tipSuf', a.suffixe) : p ? t('tipGoAdd') : t('tipGo');
            const num = '<button type="button" class="wbc-num' + (a.hnPose ? ' pose' : a.hnEnregistre ? ' enregistre' : a.suffixe ? ' suffixe' : '') + (vue.curseur === k ? ' courant' : '') + '" data-adr="' + i + ':' + k + '" title="' + esc(tip) + '">' + (a.hnPose ? '&#x271A; ' : a.hnEnregistre ? '&#x2713; ' : '') + esc(a.brut) + (a.suffixe && !a.hnPose ? ' ≠ ' + esc(a.suffixe) : '') + '</button>';
            return p ? '<span class="wbc-num-g' + (vue.curseur === k ? ' courant' : '') + '">' + num + '<button type="button" class="wbc-num-plus" data-hn1="' + i + ':' + k + '" title="' + esc(t('ajHn1') + ' — ' + t('ajHn1Tip')) + '" aria-label="' + esc(t('ajHn1') + ' ' + a.brut) + '">+</button></span>' : num;
        }).join('') + '</div>';
    }
    function htmlCommune(r) {
        const T = totauxVus(r), c = r.commune;
        // Chaque filtre porte son nombre de voies (la ligne « N voies complètes sur M » disparaît) ; le détail
        // des noms à vérifier passe en infobulle du filtre.
        const vs = r.voies.filter(v => !vue.deleguee || v.deleguee === vue.deleguee);
        const nF = { todo: vs.filter(v => v.presents < v.ban).length, name: vs.filter(v => v.statutNom !== 'identique' && v.statutNom !== 'alternatif').length,
            done: vs.filter(v => v.presents >= v.ban).length, all: vs.length };
        const detailNoms = [T.voiesAlt ? t('vAlt', nb(T.voiesAlt)) : '', T.voiesSansNom ? t('vNoName', nb(T.voiesSansNom)) : '', T.voiesAutreNom ? t('vOtherName', nb(T.voiesAutreNom)) : '',
            T.voiesRoute ? t('vRoute', nb(T.voiesRoute)) : '', T.voiesProche ? t('vType', nb(T.voiesProche)) : '', T.voiesSansSegment ? t('vNoSeg', nb(T.voiesSansSegment)) : ''].filter(x => x).join(' · ');
        const filtre = (k, lbl, tip) => '<button type="button" class="wbc-mode" role="radio" data-filtre="' + k + '" aria-checked="' + (vue.filtre === k) + '"' + (tip ? ' title="' + esc(tip) + '"' : '') + '>' +
            esc(lbl) + ' <span class="wbc-n">' + nb(nF[k]) + '</span></button>';
        const voies = voiesFiltrees(r);
        let h = (resDep ? '<button type="button" class="wbc-retour" data-act="dep" title="' + esc(t('tipDepBack')) + '"><span class="wbc-fl">&#x2190;</span> ' + esc(t('depBack')) + '</button>' : '') +
            // Le titre porte les actions de la commune : la ligne des filtres n'a plus que les filtres et la recherche.
            '<div class="wbc-titre-l"><h3 class="wbc-titre"><bdi>' + esc(c.nom) + '</bdi> <small>' + esc(c.code) + '</small></h3><span class="wbc-actions">' +
            '<button type="button" class="wbc-btn wbc-btn-neutral" data-act="csv" title="' + esc(t('tipCsv')) + '">' + esc(t('exportCsv')) + '</button>' +
            '<button type="button" class="wbc-btn wbc-btn-neutral" data-act="noms" title="' + esc(t('namesCsvTip')) + '">' + esc(t('namesCsv')) + '</button>' + boutonCmp() + '</span></div>' + htmlMemoCommune(r) +
            (T.certSeules ? '<p class="wbc-ligne">' + esc(t('certNote', nb(T.ecartees))) + '</p>' : '') +
            (T.certSeules && !T.ban ? '<p class="wbc-vide wbc-err">' + esc(t('noCert', nb(T.adressesBan))) + '</p>' : '') +
            htmlKpis(T) + (cmpCommune(r) ? ligneCmp(cmpCommune(r), r.totaux) : '') +
            // La légende du calque est dans les interrupteurs Écarts et Présentes (pastilles de couleur) ;
            // reste ici la note de plafond d'affichage, quand il y en a une.
            '<p class="wbc-note" id="wbc-calque-note" hidden></p>' +
            '<div class="wbc-outils"><div class="wbc-filtres" role="radiogroup">' + filtre('todo', t('fTodo'), t('voiesLine', nb(T.voiesCompletes), nb(T.voies))) +
            filtre('name', t('fName'), detailNoms) + filtre('done', t('fDone'), t('tipFDone')) + filtre('all', t('fAll'), t('tipFAll')) + '</div>' +
            '<input type="search" class="wbc-champ" id="wbc-filtre-txt" placeholder="' + esc(t('filterPh')) + '" autocomplete="off" spellcheck="false">' +
            selectDeleguee(r) + '</div>';
        const cc = cmpCommune(r), dC = cc ? dateCourte(cc.date) : '', nCol = cc ? 6 : 5;
        if (!voies.length) h += '<p class="wbc-vide">' + esc(t('noStreet')) + '</p>';
        else {
            h += '<table class="wbc-table"><thead><tr>' + th('nom', t('thStreetBan')) + th('wme', t('thStreetWme')) + th('ban', t('thBan'), 1) + th('wmeN', t('thWme'), 1) + th('ecart', t('thGap'), 1) +
                (cc ? '<th scope="col" class="num" title="' + esc(t('thDeltaTip', dC)) + '">' + esc(t('thDelta')) + '</th>' : '') + '</tr></thead><tbody>';
            for (const v of voies) {
                const i = r.voies.indexOf(v), gap = v.ban - v.presents, ouvert = vue.ouverte === i;
                h += '<tr class="wbc-l' + (ouvert ? ' ouvert' : '') + '" data-voie="' + i + '" tabindex="0" aria-expanded="' + ouvert + '" title="' + esc(t('tipVoie')) + '">' +
                    '<td><bdi>' + esc(v.nom) + '</bdi>' + (v.deleguee ? '<span class="wbc-del">' + esc(v.deleguee) + '</span>' : '') + '</td>' +
                    '<td>' + celluleNom(v) + '</td><td class="num">' + nb(v.ban) + '</td>' +
                    '<td class="num" title="' + esc(t('kHnRpp', v.hn, v.rpp)) + '">' + nb(v.presents) + '</td>' +
                    '<td class="num ecart ' + (gap ? 'ko' : 'ok') + '">' + (gap ? '−' + nb(gap) : '0') + '</td>' +
                    (cc ? celluleDelta((() => { const a = cc.data.voies.get(Core.normNom(v.nom) + '|' + (v.deleguee || '')); return a ? v.presents - a.presents : null; })(), dC) : '') + '</tr>';
                if (ouvert) h += '<tr class="wbc-detail"><td colspan="' + nCol + '"><p class="wbc-voie-outils"><button type="button" class="wbc-btn wbc-btn-neutral" data-act="selvoie" title="' +
                    esc(t('selSegsTip')) + '"' + ((v.segs || []).length ? '' : ' disabled') + '>' + esc(t('selSegs', nb((v.segs || []).length))) + '</button>' + (droitHn ? boutonHn(v) : '') + '</p>' +
                    (droitHn && vue.hnMsg && vue.hnMsg.i === i ? '<p class="wbc-hn-msg' + (vue.hnMsg.err ? ' erreur' : '') + '" role="status">' + esc(vue.hnMsg.txt) + '</p>' : '') + '<h4>' + esc(t('missingT')) +
                    (v.manquants.length ? ' <button type="button" class="wbc-btn wbc-btn-neutral wbc-suivant" data-act="suivant" title="' + esc(t('tipNext')) + '">' + esc(t('nextMissing')) + ' <span class="wbc-fl">&#x25B6;</span></button>' : '') + '</h4>' +
                    (v.manquants.length ? htmlNums(v, i)
                        : '<p class="wbc-note">' + esc(t('noneMissing')) + '</p>') + '</td></tr>';
            }
            h += '</tbody></table>';
        }
        // Les blocs repliés restent visibles en bas pendant qu'on fait défiler les voies (27/09).
        const extras = htmlExtras(r.enTrop, 'trop', t('extraT', nb(r.enTrop.length))) + htmlExtras(r.doublons, 'doublon', t('dupT', nb(r.doublons.length)));
        if (extras) h += '<div class="wbc-extras">' + extras + '</div>';
        return h;
    }

    // Les communes déléguées d'une commune nouvelle : une liste seulement s'il y en a.
    function selectDeleguee(r) {
        const dels = [...new Set(r.voies.map(v => v.deleguee).filter(Boolean))].sort((a, b) => a.localeCompare(b, LOCALES[_lang]));
        if (!dels.length) return '';
        return '<select class="wbc-champ wbc-del-sel" id="wbc-deleguee" aria-label="' + esc(t('delAll')) + '"><option value="">' + esc(t('delAll')) + '</option>' +
            dels.map(d => '<option value="' + esc(d) + '"' + (vue.deleguee === d ? ' selected' : '') + '>' + esc(d) + '</option>').join('') + '</select>';
    }

    function htmlExtras(liste, cle, titre) {
        if (!liste.length) return '';
        const parRue = new Map();
        liste.forEach((x, k) => { const r = x.rue || '∅'; if (!parRue.has(r)) parRue.set(r, []); parRue.get(r).push(k); });
        const rues = [...parRue.keys()].sort((a, b) => a.localeCompare(b, LOCALES[_lang]));
        return '<details class="wbc-extra"><summary>' + esc(titre) + '</summary><ul>' + rues.map(r =>
            '<li><span><bdi>' + (r === '∅' ? '<i>' + esc(t('nameNone')) + '</i>' : esc(r)) + '</bdi></span>' +
            parRue.get(r).map(k => '<button type="button" class="wbc-num trop" data-' + cle + '="' + k + '" title="' + esc(t(liste[k].type === 'HN' ? 'tipHN' : 'tipRPP')) + '">' + esc(liste[k].brut) + '</button>').join('') + '</li>').join('') +
            '</ul></details>';
    }

    // ---- Copier la couverture pour Discord (L6/LC/GC, 28/09) ----------------------
    // Les totaux du département affiché, en trois lignes (titre en gras, adresses, communes et date).
    function texteCouvDep(d) {
        const ok = d.communes.filter(c => c.totaux);
        const ban = ok.reduce((x, c) => x + c.totaux.ban, 0), pres = ok.reduce((x, c) => x + c.totaux.presents, 0);
        return [t('copyTitre', d.dep.nom + ' (' + d.dep.code + ')' + (d.certSeules ? ' — ' + t('copyCert') : '')),
            t('copyAdr', nb(pres), nb(ban), pct(pres, ban)),
            t('copyCommunes', nb(ok.length), nb(d.communes.length), dateCourte(d.date || Date.now()))].join('\n');
    }
    async function copierCouverture(bouton) {
        const txt = resDep ? texteCouvDep(resDep) : '';
        if (!txt) return;
        let ok = false;
        try { await navigator.clipboard.writeText(txt); ok = true; } catch (e) {
            // Repli : la sélection d'un champ caché (presse-papiers refusé hors geste, ou navigateur ancien).
            try {
                const z = document.createElement('textarea');
                z.value = txt; z.style.position = 'fixed'; z.style.opacity = '0';
                document.body.appendChild(z); z.select(); ok = document.execCommand('copy'); z.remove();
            } catch (e2) { ok = false; }
        }
        // Le bouton le dit deux secondes, puis reprend son libellé.
        bouton.textContent = ok ? '✓ ' + t('copyDone') : t('copyFail');
        annoncer(ok ? t('copyDone') : t('copyFail'));
        setTimeout(() => { if (bouton.isConnected) bouton.innerHTML = LIB_COPIER; }, 2000);
    }
    // Libellé (0.15.01, demande de l'auteur du 28/09) : l'icône de copie puis « Discord », la destination du texte.
    // Icône dessinée (deux feuilles décalées) plutôt que « ⧉ », absent de bien des polices.
    const LIB_COPIER = '<svg class="wbc-ico-copie" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true" focusable="false">' +
        '<rect x="5.5" y="5.5" width="8.5" height="8.5" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
        '<path d="M10.5 3.2V3a1.5 1.5 0 0 0-1.5-1.5H3A1.5 1.5 0 0 0 1.5 3v6A1.5 1.5 0 0 0 3 10.5h.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg> Discord';
    const boutonCopier = () => droitChamp && !jeton ? '<button type="button" class="wbc-btn wbc-btn-neutral wbc-copier" data-act="copier" title="' + esc(t('copyTip')) + '" aria-label="' + esc(t('copyBtn') + ' — Discord') + '">' + LIB_COPIER + '</button>' : '';

    function htmlDepartement(d) {
        const ok = d.communes.filter(c => c.totaux);
        const T = ok.reduce((s, c) => {
            for (const k of ['ban', 'cert', 'hn', 'rpp', 'presents', 'manquants', 'enTrop', 'doublons', 'suffixes']) s[k] += c.totaux[k];
            return s;
        }, { ban: 0, cert: 0, hn: 0, rpp: 0, presents: 0, manquants: 0, enTrop: 0, doublons: 0, suffixes: 0 });
        const tri = {
            nom: c => c.commune.nom, ban: c => c.totaux ? c.totaux.ban : -1, wmeN: c => c.totaux ? c.totaux.presents : -1,
            ecart: c => c.totaux ? c.totaux.manquants : -1, cov: c => c.totaux && c.totaux.ban ? c.totaux.presents / c.totaux.ban : -1,
        }[vue.triDep || 'ecart'];
        const sens = vue.sensDep || -1;
        const lignes = d.communes.slice().sort((a, b) => {
            const x = tri(a), y = tri(b);
            return (typeof x === 'number' ? x - y : String(x).localeCompare(String(y), LOCALES[_lang])) * sens;
        });
        const thD = (cle, lbl, num) => '<th scope="col"' + (num === 2 ? ' class="cov"' : num ? ' class="num"' : '') + ((vue.triDep || 'ecart') === cle ? ' aria-sort="' + (sens > 0 ? 'ascending' : 'descending') + '"' : '') + '><button type="button" class="wbc-th" data-tridep="' + cle + '" title="' + esc(t('tipSort')) + '">' + esc(lbl) + '</button></th>';
        const cd = cmpDep(), dD = cd ? dateCourte(cd.date) : '';
        let h = '<div class="wbc-titre-l"><h3 class="wbc-titre"><bdi>' + esc(d.dep.nom) + '</bdi> <small>' + esc(d.dep.code) + ' · ' + nb(ok.length) + '/' + nb(d.communes.length) + '</small></h3><span class="wbc-actions">' +
            (!jeton && d.communes.some(c => c.etat === 'erreur') ? '<button type="button" class="wbc-btn wbc-btn-neutral" data-act="reprise" title="' + esc(t('tipRetry')) + '">' + esc(t('retryFailed', nb(d.communes.filter(c => c.etat === 'erreur').length))) + '</button>' : '') +
            boutonCopier() + '<button type="button" class="wbc-btn wbc-btn-neutral" data-act="csvdep" title="' + esc(t('tipCsvDep')) + '">' + esc(t('exportCsv')) + '</button>' +
            (!jeton && resCommunes.size ? '<button type="button" class="wbc-btn wbc-btn-neutral" data-act="nomsdep" title="' + esc(t('namesCsvTip')) + '">' + esc(t('namesCsv')) + '</button>' : '') +
            (!jeton ? boutonCmp() : '') + '</span></div>' + htmlMemoDep(d) +
            htmlKpis(T) + (cd ? ligneCmp(cd, Object.assign({ certSeules: d.certSeules }, T)) : '') +
            // Tranches courtes (« 0-5% ») : la légende tient sur une ligne, « non analysée » compris.
            // Chaque pastille AVEC son texte : séparés, ils prenaient chacun l'écart de la légende et « non
            // analysée » passait à la ligne (mesuré à 44 px de haut dans une fenêtre de 520 px, 27/09).
            (opts.carteDep ? '<p class="wbc-legende wbc-legende-dep">' + teintesCouv().map((c, i) => '<span><span class="wbc-pt carre" style="background:' + c + '"></span>' + libelleClasse(i) + '</span>').join('') +
                '<span><span class="wbc-pt carre gris"></span>' + esc(t('legNoData')) + '</span></p>' : '') +
            '<table class="wbc-table wbc-table-dep"><thead><tr>' + thD('nom', t('thCommune')) + thD('ban', t('thBan'), 1) + thD('wmeN', t('thWme'), 1) + thD('ecart', t('thMiss'), 1) + thD('cov', t('kCov'), 2) +
            (cd ? '<th scope="col" class="num" title="' + esc(t('thDeltaTip', dD)) + '">' + esc(t('thDelta')) + '</th>' : '') + '</tr></thead><tbody>';
        for (const c of lignes) {
            const T2 = c.totaux;
            const v = c.verif || {};
            h += '<tr class="wbc-l" data-commune="' + esc(c.commune.code) + '"' + (T2 ? ' tabindex="0"' : '') + ' title="' + esc(t('tipCommune')) + '"><td><bdi>' + esc(c.commune.nom) + '</bdi>' +
                (v.ban === 'maj' ? ' <span class="wbc-tag maj" title="' + esc(t('memoTagBan') + (v.banDate ? ' · ' + dateCourte(v.banDate) : '')) + '">BAN</span>' : '') +
                (v.wme === 'maj' ? ' <span class="wbc-tag maj" title="' + esc(t('memoTagWme') + (v.wmeDate ? ' · ' + dateCourte(v.wmeDate) : '')) + '">WME</span>' : '') + '</td>';
            const nc = cd ? 5 : 4;
            if (T2 && T2.certSeules && !T2.ban) h += '<td colspan="' + nc + '" class="wbc-note">' + esc(t('noCert', nb(T2.adressesBan))) + '</td>';
            else if (T2) h += '<td class="num">' + nb(T2.ban) + '</td><td class="num">' + nb(T2.presents) + '</td><td class="num ecart ' + (T2.manquants ? 'ko' : 'ok') + '">' + nb(T2.manquants) + '</td>' +
                '<td class="cov"><span class="wbc-cov-mini"><i style="width:' + (T2.ban ? (100 * T2.presents / T2.ban).toFixed(1) : 0) + '%"></i></span>' + pct(T2.presents, T2.ban) + '</td>' +
                (cd ? celluleDelta(cd.data.communes.has(c.commune.code) ? T2.presents - cd.data.communes.get(c.commune.code).presents : null, dD) : '');
            else h += '<td colspan="' + nc + '" class="wbc-note' + (c.etat === 'erreur' ? ' wbc-err' : '') + '">' + (c.etat === 'erreur' ? esc(t('errCommune') + ' — ' + c.erreur) : c.etat === 'vide' ? '—' : '…') + '</td>';
            h += '</tr>';
        }
        return h + '</tbody></table>';
    }

    function montrerCommune(r) {
        resultat = r;
        vue.ouverte = null;
        vue.texte = '';
        vue.deleguee = '';
        vue.curseur = -1;
        tropMontre = null;
        rendre();
        majCalque();
        $('#wbc-corps').scrollTop = 0;
    }

    // Le calque montre la voie ouverte ; l'interrupteur y ajoute tous les manquants de la commune.
    // Au-delà de MAX_POINTS (une grande ville), seuls ceux de la vue sont dessinés, et le calque
    // suit les déplacements de la carte.
    const MAX_POINTS = 3000;
    let calqueSuitLaVue = false;
    let tropMontre = null;            // le numéro « en trop » cliqué dans la liste, mis en évidence
    // Avec le SDK async, un calcul lancé plus tard peut finir plus tôt : seul le dernier dessine.
    let generationCalque = 0;
    function majCalque() {
        majCalqueAsync().catch(e => log('calque : ' + e.message));
    }
    async function majCalqueAsync() {
        const generation = ++generationCalque;
        const pts = [];
        calqueSuitLaVue = false;
        let note = '';
        if (resultat) {
            const voies = resultat.voies.filter(v => !vue.deleguee || v.deleguee === vue.deleguee);
            if (opts.carte) {
                let tous = [];
                voies.forEach(v => v.adresses.forEach(a => { if (!a.trouve && !a.hnPose) tous.push({ lon: a.lon, lat: a.lat, etat: 'manquant', lbl: a.brut, ad: a, voie: v }); }));
                // Les adresses trouvées, en vert, sur demande (case « Afficher aussi les trouvés ») :
                // la carte complète de la couverture, sous le même plafond.
                if (opts.trouves) voies.forEach(v => v.adresses.forEach(a => { if (a.trouve) tous.push({ lon: a.lon, lat: a.lat, etat: 'present', lbl: a.brut, ad: a, voie: v }); }));
                // Les numéros WME en trop, en orange à côté des manquants.
                if (!vue.deleguee) resultat.enTrop.forEach(x => tous.push({ lon: x.lon, lat: x.lat, etat: 'trop', lbl: x.brut, trop: x }));
                if (tous.length > MAX_POINTS) {
                    // Une grande ville : seuls les points de la vue, et le calque suit la carte. S'il en
                    // reste trop, un sur k, RÉPARTI sur toute la vue (couper la fin de la liste vidait des
                    // rues entières et les « en trop » d'abord, audit M6) — et on le DIT.
                    calqueSuitLaVue = true;
                    let ext = null;
                    try { ext = await sdk.Map.getMapExtent(); } catch (e) { }
                    if (ext) tous = tous.filter(p => p.lon >= ext[0] && p.lon <= ext[2] && p.lat >= ext[1] && p.lat <= ext[3]);
                    if (tous.length > MAX_POINTS) {
                        const k = Math.ceil(tous.length / MAX_POINTS);
                        note = t('mapCap', nb(Math.ceil(tous.length / k)), nb(tous.length));
                        tous = tous.filter((p, i) => i % k === 0);
                    }
                }
                pts.push(...tous);
            }
            const v = vue.ouverte != null ? resultat.voies[vue.ouverte] : null;
            if (v) {
                // Voie ouverte : un trait relie chaque adresse trouvée au numéro WME qui lui a été
                // rapproché — on voit d'où vient la correspondance, et un HN mal placé saute aux yeux.
                // Tracés avant les points, pour passer dessous.
                v.adresses.forEach(a => { if (a.trouve && a.wlon != null) pts.unshift({ ligne: [[a.lon, a.lat], [a.wlon, a.wlat]], etat: 'lien' }); });
                v.adresses.forEach(a => { if (!a.trouve && !a.hnPose && a.plon != null) pts.unshift({ ligne: [[a.lon, a.lat], [a.plon, a.plat]], etat: 'lienManq' }); });
                v.adresses.forEach(a => { if ((a.trouve && !(opts.carte && opts.trouves)) || (!a.trouve && !a.hnPose && !opts.carte)) pts.push({ lon: a.lon, lat: a.lat, etat: a.trouve ? 'present' : 'manquant', lbl: a.brut, ad: a, voie: v }); });
            }
            if (tropMontre) pts.push({ lon: tropMontre.lon, lat: tropMontre.lat, etat: 'trop', lbl: tropMontre.brut, trop: tropMontre });
            // Les numéros posés et pas encore relus : toujours dessinés, au-dessus du reste (au plus 150 par heure).
            voies.forEach(w => w.adresses.forEach(a => { if (a.hnPose && !a.trouve) pts.push({ lon: a.lon, lat: a.lat, etat: 'pose', lbl: a.brut, ad: a, voie: w }); }));
        }
        if (generation !== generationCalque) return;
        const n = ovEl && ovEl.querySelector('#wbc-calque-note');
        if (n) { n.textContent = note; n.hidden = !note; }
        dessiner(fenetreOuverte() ? pts : pts.filter(p => p.etat === 'pose'));
    }

    // =====================================================================
    //  Export CSV — le fichier part du navigateur, rien ne transite ailleurs
    // =====================================================================

    // Une cellule qui commence par = + - @ est une FORMULE pour un tableur (CWE-1236) : une apostrophe
    // devant la neutralise. Les numéros négatifs n'existent pas dans ces données.
    const csvNeutre = s => /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
    const csvChamp = v => { const s = csvNeutre(String(v == null ? '' : v)); return /[;"\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
    function telecharger(nom, lignes) {
        const blob = new Blob(['\uFEFF' + lignes.map(l => l.map(csvChamp).join(';')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = nom;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    }
    function exporterCommune(r) {
        const c = r.commune;
        const l = [['commune_insee', 'commune', 'voie_ban', 'commune_deleguee', 'voie_wme', 'nom_principal_wme', 'statut_nom', 'numero', 'etat', 'numero_wme_suffixe', 'certifiee', 'lon', 'lat', 'filtre_certifiees', 'segment_probable_wme']];
        const filtre = r.totaux.certSeules ? '1' : '0';
        for (const v of r.voies) for (const a of v.adresses)
            l.push([c.code, c.nom, v.nom, v.deleguee, v.nomWme || '', v.nomPrincipal || '', v.statutNom + (v.nomAbsent ? '+absent' : ''), a.brut,
                a.trouve || (a.suffixe ? 'suffixe' : 'manquant'), a.suffixe || '', a.cert ? '1' : '0', a.lon.toFixed(6), a.lat.toFixed(6), filtre, a.seg != null ? a.seg : '']);
        for (const [liste, etat] of [[r.enTrop, 'en_trop'], [r.doublons, 'doublon']])
            for (const x of liste) l.push([c.code, c.nom, '', '', x.rue, '', '', x.brut, etat + '_' + x.type, '', '', x.lon.toFixed(6), x.lat.toFixed(6), filtre, '']);
        telecharger('ban-wme_' + c.code + '_' + new Date().toISOString().slice(0, 10) + '.csv', l);
    }
    // Les voies dont le nom WME est à revoir (même règle que le filtre « Nom à vérifier »), avec leurs
    // segments et un lien WME qui les sélectionne : de quoi corriger, ou transmettre aux responsables.
    const PERMALIEN_SEGS = 50;
    function permalien(v) {
        const q = new URLSearchParams(location.search), u = new URL(location.origin + location.pathname);
        if (q.get('env')) u.searchParams.set('env', q.get('env'));
        const b = v.bbox;
        u.searchParams.set('lat', ((b[1] + b[3]) / 2).toFixed(6));
        u.searchParams.set('lon', ((b[0] + b[2]) / 2).toFixed(6));
        u.searchParams.set('zoomLevel', '17');
        if (v.segs && v.segs.length) u.searchParams.set('segments', v.segs.slice(0, PERMALIEN_SEGS).join(','));
        return u.toString();
    }
    const ecartDeNom = v => !(v.statutNom === 'identique' || v.statutNom === 'alternatif') || v.nomAbsent;
    function exporterEcarts(resultats, nomFichier) {
        const l = [['commune_insee', 'commune', 'voie_ban', 'commune_deleguee', 'voie_wme', 'nom_principal_wme', 'statut_nom', 'adresses_ban', 'manquantes', 'segments_wme', 'lien_wme']];
        for (const r of resultats) for (const v of r.voies) {
            if (!ecartDeNom(v)) continue;
            l.push([r.commune.code, r.commune.nom, v.nom, v.deleguee, v.nomWme || '', v.nomPrincipal || '', v.statutNom + (v.nomAbsent ? '+absent' : ''),
                v.ban, v.ban - v.presents, (v.segs || []).join(','), permalien(v)]);
        }
        if (l.length < 2) { statut(t('namesNone')); return; }
        telecharger(nomFichier + '_' + new Date().toISOString().slice(0, 10) + '.csv', l);
    }

    function exporterDepartement(d) {
        const l = [['commune_insee', 'commune', 'adresses_ban', 'certifiees', 'dans_wme', 'hn', 'rpp', 'manquantes', 'dont_suffixe', 'en_trop', 'doublons', 'couverture', 'filtre_certifiees', 'non_certifiees_ecartees']];
        for (const c of d.communes) {
            const T = c.totaux;
            if (!T) { l.push([c.commune.code, c.commune.nom, '', '', '', '', '', '', '', '', '', c.etat, '', '']); continue; }
            l.push([c.commune.code, c.commune.nom, T.ban, T.cert, T.presents, T.hn, T.rpp, T.manquants, T.suffixes, T.enTrop, T.doublons, T.ban ? (T.presents / T.ban).toFixed(4) : '', T.certSeules ? '1' : '0', T.ecartees]);
        }
        telecharger('ban-wme_dep' + d.dep.code + '_' + new Date().toISOString().slice(0, 10) + '.csv', l);
    }

    // =====================================================================
    //  Mémoire des balayages (IndexedDB de CE navigateur) et vérification des mises à jour
    // =====================================================================
    //  Trois tables : `communes` (le résultat complet, pour le rouvrir tel quel), `deps` (la liste des
    //  communes d'un département, sans leurs adresses) et `index` (la liste légère de l'onglet Scripts).
    //  Clé : code + filtre des certifiées. Rien ne sort du navigateur.
    const Memo = (() => {
        let base = null;
        const TABLES = ['communes', 'deps', 'index'];
        const ouvrir = () => base || (base = new Promise((ok, ko) => {
            const r = indexedDB.open('wme-ban-coverage', 1);
            r.onupgradeneeded = () => { const d = r.result; for (const x of TABLES) if (!d.objectStoreNames.contains(x)) d.createObjectStore(x); };
            r.onsuccess = () => ok(r.result);
            r.onerror = () => { base = null; ko(r.error || new Error('IndexedDB')); };
        }));
        const op = async (table, mode, f) => {
            const d = await ouvrir();
            return new Promise((ok, ko) => {
                const tx = d.transaction(table, mode), req = f(tx.objectStore(table));
                tx.oncomplete = () => ok(req ? req.result : undefined);
                tx.onerror = () => ko(tx.error || new Error('IndexedDB'));
                tx.onabort = () => ko(tx.error || new Error('IndexedDB'));
            });
        };
        return {
            lire: (table, cle) => op(table, 'readonly', x => x.get(cle)),
            ecrire: (table, cle, v) => op(table, 'readwrite', x => x.put(v, cle)),
            effacer: (table, cle) => op(table, 'readwrite', x => x.delete(cle)),
            tout: table => op(table, 'readonly', x => x.getAll()),
            vider: async () => { for (const x of TABLES) await op(x, 'readwrite', o => o.clear()); },
        };
    })();
    const cleMemo = (code, cert) => code + '|' + (cert ? 'c' : 't');
    const dateHeure = ms => new Intl.DateTimeFormat(LOCALES[_lang] || 'en', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(ms);

    // `viaDep` : la commune a été balayée avec son département (elle ne s'affiche pas seule dans la liste).
    async function garderCommune(r, viaDep) {
        if (!r || !r.memo) return;
        const cle = cleMemo(r.commune.code, r.memo.cert);
        try {
            await Memo.ecrire('communes', cle, Object.assign({}, r, { verif: undefined }));
            await Memo.ecrire('index', cle, { cle, type: 'commune', code: r.commune.code, nom: r.commune.nom, cert: r.memo.cert, date: r.memo.date,
                ban: r.totaux.ban, presents: r.totaux.presents, viaDep: viaDep || '' });
            if (!viaDep) majMemoOnglet();
        } catch (e) { log('mémoire : ' + e.message); statut(t('memoErr', e.message), true); }
    }
    async function garderDep() {
        if (!resDep) return;
        const d = resDep, cle = cleMemo(d.dep.code, d.certSeules);
        const lignes = d.communes.map(l => ({ commune: l.commune, totaux: l.totaux, etat: l.etat, erreur: l.erreur || '', memo: l.memo || null }));
        const ok = lignes.filter(l => l.totaux);
        try {
            await Memo.ecrire('deps', cle, { dep: d.dep, certSeules: d.certSeules, date: d.date || Date.now(), communes: lignes });
            await Memo.ecrire('index', cle, { cle, type: 'dep', code: d.dep.code, nom: d.dep.nom, cert: d.certSeules, date: d.date || Date.now(),
                ban: ok.reduce((x, l) => x + l.totaux.ban, 0), presents: ok.reduce((x, l) => x + l.totaux.presents, 0), n: ok.length, total: lignes.length });
            majMemoOnglet();
        } catch (e) { log('mémoire : ' + e.message); statut(t('memoErr', e.message), true); }
    }

    // Le balayage précédent, au format de la comparaison (le même que celui d'un export relu).
    const cmpDepuisCommune = r => ({ date: r.memo.date, source: 'memo', data: { type: 'commune', code: r.commune.code, certSeules: !!r.memo.cert,
        voies: new Map(r.voies.map(v => [Core.normNom(v.nom) + '|' + (v.deleguee || ''), { ban: v.ban, presents: v.presents }])),
        totaux: { ban: r.totaux.ban, presents: r.totaux.presents, manquants: r.totaux.manquants, enTrop: r.totaux.enTrop, doublons: r.totaux.doublons } } });
    function cmpDepuisDep(d, date) {
        const communes = new Map(), T = { ban: 0, presents: 0, manquants: 0, enTrop: 0, doublons: 0 };
        for (const l of d.communes) {
            if (!l.totaux) continue;
            const c = { ban: l.totaux.ban, presents: l.totaux.presents, manquants: l.totaux.manquants, enTrop: l.totaux.enTrop, doublons: l.totaux.doublons };
            communes.set(l.commune.code, c);
            for (const k in T) T[k] += c[k];
        }
        return communes.size ? { date, source: 'memo', data: { type: 'dep', certSeules: !!d.certSeules, communes, totaux: T } } : null;
    }

    // ---- Rouvrir ------------------------------------------------------------------------------------------
    // Relire un balayage prend jusqu'à quelques secondes (un département) : la barre animée le montre.
    const ouvrirMemoCommune = (code, cert) => attendre(ouvrirMemoCommuneBrut(code, cert));
    async function ouvrirMemoCommuneBrut(code, cert) {
        let r = null;
        try { r = await Memo.lire('communes', cleMemo(code, cert)); } catch (e) { log('mémoire : ' + e.message); }
        if (!r || !r.memo) return false;
        r.verif = {};
        resCommunes.set(code, r);
        cmp = null;
        montrerCommune(r);
        verifierBan([r]);
        return true;
    }
    // Relire un balayage prend jusqu'à quelques secondes (un département) : la barre animée le montre.
    const ouvrirMemoDep = (code, cert) => attendre(ouvrirMemoDepBrut(code, cert));
    async function ouvrirMemoDepBrut(code, cert) {
        let d = null;
        try { d = await Memo.lire('deps', cleMemo(code, cert)); } catch (e) { log('mémoire : ' + e.message); }
        if (!d) return false;
        resCommunes.clear();
        resDep = { dep: d.dep, certSeules: d.certSeules, date: d.date, communes: d.communes.map(l => Object.assign(l, { verif: {} })) };
        resultat = null;
        cmp = null;
        dessiner([]);
        rendre();
        // Pas de vérification BAN d'office pour un département : 349 requêtes (le Gard) donnaient
        // l'impression d'un nouveau balayage (28/09). « Vérifier la BAN » la lance.
        return true;
    }
    // Une commune d'un département : en mémoire de session, sinon relue dans la mémoire du navigateur.
    const ouvrirCommuneDep = code => attendre(ouvrirCommuneDepBrut(code));
    async function ouvrirCommuneDepBrut(code) {
        if (resCommunes.has(code)) { montrerCommune(resCommunes.get(code)); return; }
        const l = resDep && resDep.communes.find(x => x.commune.code === code);
        if (!l || !l.memo) return;
        let r = null;
        try { r = await Memo.lire('communes', cleMemo(code, resDep.certSeules)); } catch (e) { log('mémoire : ' + e.message); }
        if (!r) return;
        r.verif = l.verif || (l.verif = {});
        resCommunes.set(code, r);
        montrerCommune(r);
    }

    // ---- BAN : le fichier a-t-il changé ? (ETag, par HEAD) -------------------------------------------------
    const etagBan = async code => {
        const l = [];
        for (const c of ARRONDISSEMENTS[code] || [code]) l.push(await gmTete(BAN_URL(c)));
        return l.join('|');
    };
    // La date de révision n'est lue que pour les communes signalées, pour l'afficher.
    async function dateBan(code) {
        try {
            const j = await gmJson('https://plateforme.adresse.data.gouv.fr/api/district/cog/' + encodeURIComponent(code));
            const d = j && j.response && j.response[0];
            const x = d && ((d.meta && d.meta.bal && d.meta.bal.dateRevision) || d.lastRecordDate);
            return x ? Date.parse(x) : null;
        } catch (e) { return null; }
    }
    let verifBan = null;              // {i, n} pendant la vérification BAN du périmètre affiché
    let rendreMemoTimer = null;
    const rendreBientot = () => { if (!rendreMemoTimer) rendreMemoTimer = setTimeout(() => { rendreMemoTimer = null; rendre(); }, 600); };
    async function verifierBan(objs) {
        const cibles = objs.filter(o => o.memo && o.memo.etag && !o.memo.etag.split('|').some(x => !x));
        if (!cibles.length) return;
        const moi = verifBan = { i: 0, n: cibles.length };
        rendre();
        // La vérification d'un département (« Vérifier la BAN », une requête par commune) se voit sur la
        // barre principale, sous son propre nom — « Mises à jour BAN », pas le nom d'une commune — pour
        // qu'on ne la prenne pas pour un balayage (28/09). Une commune seule (une
        // requête) n'a que la roue de son bandeau.
        const avance = () => {
            if (jeton || verifBan !== moi || !ovEl || moi.n < 2) return;
            barre(moi.i / moi.n);
            progres({ pct: pct(moi.i, moi.n), eta: '', cpt: nb(moi.i) + '/' + nb(moi.n), nom: t('memoBanUpd'), etape: '' });
        };
        attentes++;
        avance();
        try {
            await parPaquets(cibles.map(o => async () => {
                if (verifBan !== moi) return;
                o.verif = o.verif || {};
                try {
                    const e = await etagBan(o.commune.code);
                    o.verif.ban = e === o.memo.etag ? 'ok' : 'maj';
                    if (o.verif.ban === 'maj') o.verif.banDate = await dateBan(o.commune.code);
                } catch (er) { o.verif.ban = 'erreur'; log('BAN ' + o.commune.nom + ' : ' + er.message); }
                moi.i++;
                avance();
                rendreBientot();
            }), 6, { stop: false }, null);
        } finally {
            if (--attentes === 0 && !jeton && ovEl) { barre(null); progres(null); }
        }
        if (verifBan === moi) verifBan = null;
        rendre();
    }

    // ---- WME : segments, numéros et points résidentiels ont-ils changé ? (sur demande) ------------------------
    // 🔴 Les numéros (HN) ne portent AUCUNE date, et en ajouter un NE change PAS la date de son segment (mesuré
    // le 27/09/2026 sur un vrai ajout : 15 Chemin des Dames, Bagnols-sur-Cèze, segment resté daté de
    // 2019). Les numéros se comparent donc UN PAR UN : identifiant, valeur, segment et position, résumés en un
    // nombre et une empreinte. Ajout, suppression, correction ou déplacement changent l'empreinte.
    const fnv = txt => { let h = 0x811c9dc5; for (let i = 0; i < txt.length; i++) { h ^= txt.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16); };
    function empreinteWme(w, b) {
        const dans = pts => !!pts && pts.some(([x, y]) => x >= b[0] && x <= b[2] && y >= b[1] && y <= b[3]);
        const e = { segN: 0, segMax: 0, hn: 0, rppN: 0, rppMax: 0, hnN: 0, hnSig: '' };
        const segsDedans = new Set();
        for (const s of w.segments) {
            if (!dans(s.geometry && s.geometry.coordinates)) continue;
            e.segN++; e.segMax = Math.max(e.segMax, s.date || 0); if (s.hasHNs) e.hn++;
            segsDedans.add(s.id);
        }
        const cles = [];
        for (const h of w.hns || []) {
            if (!segsDedans.has(h.segID)) continue;
            const c = h.geometry && h.geometry.coordinates;
            cles.push(h.id + '|' + h.number + '|' + h.segID + '|' + (c ? c[0].toFixed(5) + ',' + c[1].toFixed(5) : ''));
        }
        cles.sort();
        e.hnN = cles.length;
        e.hnSig = fnv(cles.join(';'));
        for (const v of w.rpps) {
            const g = v.geometry;
            if (!g || !dans(g.type === 'Point' ? [g.coordinates] : g.coordinates[0])) continue;
            e.rppN++; e.rppMax = Math.max(e.rppMax, v.date || 0);
        }
        return e;
    }
    async function verifierWme(j, objs) {
        const cache = nouveauCache();
        statut('');
        let i = 0;
        for (const o of objs) {
            if (j.stop) throw Arret();
            i++;
            const b = o.memo.bbox;
            const w = await lireWme(b, cache, j, (txt, f) => {
                const tout = (i - 1 + f) / objs.length;
                barre(tout);
                progres({ pct: pct(tout, 1), eta: '', cpt: objs.length > 1 ? nb(i) + '/' + nb(objs.length) : '', nom: o.commune.nom, etape: txt });
            });
            const e = empreinteWme(w, b), a = o.memo.wme;
            o.verif = o.verif || {};
            // Un balayage de la 0.06.00 n'a pas l'empreinte des numéros : il se compare sur le reste.
            const pareil = !!a && ['segN', 'segMax', 'hn', 'rppN', 'rppMax', 'hnN', 'hnSig'].every(k => a[k] === undefined || e[k] === a[k]);
            o.verif.wme = pareil ? 'ok' : 'maj';
            const recent = Math.max(e.segMax, e.rppMax);
            o.verif.wmeDate = !pareil && recent > (o.memo.date || 0) ? recent : null;
            rendreBientot();
        }
    }

    // ---- Le bandeau du balayage --------------------------------------------------------------------------
    const bout = (cls, txt) => '<span class="' + cls + '">' + esc(txt) + '</span>';
    // Vérification BAN en cours : une roue pour une commune, une barre qui avance pour un département.
    const banAttente = () => '<span>' + roue(t('memoBanWait')) + ' BAN</span>';
    const banProgres = v => '<span title="' + esc(t('memoBanProg', nb(v.i), nb(v.n))) + '"><span class="wbc-mini"><i style="width:' + Math.round(100 * v.i / Math.max(1, v.n)) + '%"></i></span>BAN ' + nb(v.i) + '/' + nb(v.n) + '</span>';
    function htmlMemoCommune(r) {
        if (!r.memo) return '';
        const v = r.verif || {};
        const ban = verifBan && verifBan.n === 1 && v.ban == null ? banAttente()
            : v.ban === 'ok' ? bout('ok', t('memoBanOk')) : v.ban === 'maj' ? bout('maj', t('memoBanMaj', v.banDate ? dateCourte(v.banDate) : ''))
            : v.ban === 'erreur' ? bout('maj', t('memoBanErr')) : '';
        const wme = v.wme === 'ok' ? bout('ok', t('memoWmeOk')) : v.wme === 'maj' ? bout('maj', t('memoWmeMaj', v.wmeDate ? dateCourte(v.wmeDate) : '')) : '';
        return '<div class="wbc-memo">' + bout('date', t('memoSweep', dateHeure(r.memo.date))) + ban + wme +
            (jeton ? '' : '<span class="wbc-memo-btns"><button type="button" class="wbc-btn wbc-btn-neutral" data-act="memowme" title="' + esc(t('memoWmeTip')) + '">' + esc(t('memoWmeBtn')) + '</button>' +
                '<button type="button" class="wbc-btn wbc-btn-neutral" data-act="memorafr" title="' + esc(t('tipRefresh')) + '">' + esc(t('memoRefresh')) + '</button></span>') + '</div>';
    }
    function htmlMemoDep(d) {
        if (!d.date) return '';
        const avec = d.communes.filter(l => l.memo);
        const nBan = avec.filter(l => l.verif && l.verif.ban === 'maj').length, nWme = avec.filter(l => l.verif && l.verif.wme === 'maj').length;
        const vusBan = avec.filter(l => l.verif && l.verif.ban).length, vusWme = avec.filter(l => l.verif && l.verif.wme).length;
        const signalees = avec.filter(l => l.verif && (l.verif.ban === 'maj' || l.verif.wme === 'maj')).length;
        const ban = verifBan ? banProgres(verifBan) : nBan ? bout('maj', t('memoBanMajN', nb(nBan))) : vusBan ? bout('ok', t('memoBanOk')) : '';
        const wme = nWme ? bout('maj', t('memoWmeMajN', nb(nWme))) : vusWme === avec.length && vusWme ? bout('ok', t('memoWmeOk')) : '';
        return '<div class="wbc-memo">' + bout('date', t('memoSweep', dateHeure(d.date))) + ban + wme +
            (jeton ? '' : '<span class="wbc-memo-btns">' +
                (verifBan ? '' : '<button type="button" class="wbc-btn wbc-btn-neutral" data-act="memoban" title="' + esc(t('memoBanTip')) + '">' + esc(t('memoBanBtn')) + '</button>') +
                '<button type="button" class="wbc-btn wbc-btn-neutral" data-act="memowme" title="' + esc(t('memoWmeTip')) + '">' + esc(t('memoWmeBtn')) + '</button>' +
                (signalees ? '<button type="button" class="wbc-btn wbc-btn-neutral" data-act="memorafr" title="' + esc(t('tipRefreshN')) + '">' + esc(t('memoRefreshN', nb(signalees))) + '</button>' : '') + '</span>') + '</div>';
    }
    function actionMemo(a) {
        if (a === 'memoban') {
            if (resDep && !verifBan) verifierBan(resDep.communes.filter(l => l.memo));
        } else if (a === 'memowme') {
            const objs = resultat ? (resultat.memo ? [resultat] : []) : resDep ? resDep.communes.filter(l => l.memo) : [];
            if (objs.length) lancer(null, j => verifierWme(j, objs), resultat ? resultat.memo.cert : resDep.certSeules);
        } else if (a === 'memorafr') {
            if (resultat && resultat.memo) lancer(null, j => lancerCommune(j, resultat.commune), resultat.memo.cert);
            else if (resDep) {
                const l = resDep.communes.filter(x => x.verif && (x.verif.ban === 'maj' || x.verif.wme === 'maj'));
                if (l.length) lancer(l, null, resDep.certSeules);
            }
        }
    }

    // ---- La liste de l'onglet Scripts ----------------------------------------------------------------------
    let ongletMemo = null;
    async function majMemoOnglet() {
        if (!ongletMemo) return;
        let l = [];
        try { l = (await Memo.tout('index')).filter(e => !e.viaDep).sort((a, b) => b.date - a.date); } catch (e) { log('mémoire : ' + e.message); }
        ongletMemo.innerHTML = l.length ? '<ul class="wbc-memo-liste">' + l.map(e => '<li><span class="wbc-memo-nom" title="' + esc(e.nom + ' (' + e.code + ')') + '"><b><bdi>' + esc(e.nom) + '</bdi></b> ' +
            esc(e.code) + (e.cert ? ' · ' + esc(t('certOnly')) : '') + '<br><small>' + esc(dateHeure(e.date)) + ' · ' + esc(pct(e.presents, e.ban)) + (e.type === 'dep' ? ' · ' + nb(e.n) + '/' + nb(e.total) : '') + '</small></span>' +
            '<button type="button" class="wbc-btn wbc-btn-neutral" data-memo-ouvrir="' + esc(e.cle) + '" title="' + esc(t('tipMemoOpen')) + '">' + esc(t('memoOpen')) + '</button>' +
            '<button type="button" class="wbc-chip-x" data-memo-suppr="' + esc(e.cle) + '" title="' + esc(t('memoDel')) + '" aria-label="' + esc(t('memoDel')) + '">&#x2715;</button></li>').join('') + '</ul>' +
            '<p style="margin:6px 0 0"><button type="button" class="wbc-btn wbc-btn-neutral" data-memo-vider="1" title="' + esc(t('tipMemoClear')) + '">' + esc(t('memoClear')) + '</button></p>'
            : '<p class="wbc-sb-hint">' + esc(t('memoNone')) + '</p>';
    }
    async function surClicMemoOnglet(ev) {
        const o = ev.target.closest('[data-memo-ouvrir]'), x = ev.target.closest('[data-memo-suppr]'), v = ev.target.closest('[data-memo-vider]');
        if (!o && !x && !v) return false;
        if (v) {
            // Deux clics : effacer tous les balayages ne se fait pas d'un geste.
            if (v.dataset.sur !== '1') { v.dataset.sur = '1'; v.textContent = t('memoClearSure'); setTimeout(() => { v.dataset.sur = ''; v.textContent = t('memoClear'); }, 4000); return true; }
            v.disabled = true;
            v.innerHTML = roue(t('memoClear')) + ' ' + esc(t('memoClear'));
            try { await Memo.vider(); } catch (e) { log('mémoire : ' + e.message); }
            majMemoOnglet();
            return true;
        }
        const cle = (o || x).getAttribute(o ? 'data-memo-ouvrir' : 'data-memo-suppr');
        let e = null;
        try { e = await Memo.lire('index', cle); } catch (er) { log('mémoire : ' + er.message); }
        if (!e) { majMemoOnglet(); return true; }
        if (x) {
            // Un département efface ses centaines de communes : la roue remplace la croix le temps qu'il faut.
            x.disabled = true;
            x.innerHTML = roue(t('memoDel'));
            try {
                if (e.type === 'dep') {
                    for (const c of await Memo.tout('index')) if (c.viaDep === e.code && c.cert === e.cert) { await Memo.effacer('communes', c.cle); await Memo.effacer('index', c.cle); }
                    await Memo.effacer('deps', cle);
                } else await Memo.effacer('communes', cle);
                await Memo.effacer('index', cle);
            } catch (er) { log('mémoire : ' + er.message); }
            majMemoOnglet();
            return true;
        }
        if (jeton) return true;
        ouvrirFenetre(true);
        if (e.type === 'dep') {
            opts.mode = 'dep'; choixDep = e.code; ecrireOpts(); majModes();
            await remplirDeps();
            const sel = $('#wbc-dep'); if (sel) sel.value = e.code;
            cadrerChoix('dep', e.code);
            await ouvrirMemoDep(e.code, e.cert);
        } else {
            opts.mode = 'commune'; choixCommune = { code: e.code, nom: e.nom }; ecrireOpts(); majModes();
            const ch = $('#wbc-cherche'); if (ch) ch.value = e.nom + ' (' + e.code + ')';
            cadrerChoix('commune', e.code);
            await ouvrirMemoCommune(e.code, e.cert);
        }
        return true;
    }

    // =====================================================================
    //  La fenêtre : bouton de carte, construction, gestes
    // =====================================================================

    // Le bouton vit dans la colonne native de WME, sans réclamer de place (voir WRP) : on vérifie
    // seulement qu'il y est toujours, WME la reconstruisant parfois.
    function poserFab() {
        const cont = document.querySelector('.overlay-buttons-container.top') || document.querySelector('.overlay-buttons-container');
        if (!cont) return false;
        if (cont.querySelector('#wbc-fab-wrap')) return true;
        const vieux = document.getElementById('wbc-fab-wrap');
        if (vieux) vieux.remove();
        const wrap = document.createElement('div');
        wrap.id = 'wbc-fab-wrap';
        wrap.innerHTML = '<button type="button" id="wbc-fab-btn" title="' + SCRIPT_NAME + ' — ' + esc(t('tipFab')) + '" aria-label="' + SCRIPT_NAME + ' — ' + esc(t('tipFab')) + '">' + icone(26) + '</button>';
        wrap.querySelector('button').addEventListener('click', ev => {
            ev.stopPropagation();
            if (ovEl && ovEl.classList.contains('open')) fermerFenetre(); else ouvrirFenetre(true);
        });
        const wct = cont.querySelector('#wct-fab-wrap');
        if (wct) cont.insertBefore(wrap, wct); else cont.appendChild(wrap);
        majFab();
        return true;
    }
    const majFab = () => { const b = document.getElementById('wbc-fab-btn'); if (b) b.classList.toggle('actif', !!(ovEl && ovEl.classList.contains('open'))); };

    function htmlFenetre() {
        const mode = (k, lbl, tip) => '<button type="button" class="wbc-mode" role="radio" data-mode="' + k + '" aria-checked="' + (opts.mode === k) + '"' + (tip ? ' title="' + esc(tip) + '"' : '') + '>' + esc(lbl) + '</button>';
        return '<div id="wbc-hdr" title="' + esc(t('dragTip')) + '"><span class="wbc-hdr-title"><span class="wbc-hdr-ico">' + icone(16) + '</span>' +
            SCRIPT_NAME + ' <span class="wbc-hdr-v">v' + esc(VERSION) + '</span></span>' +
            '<span class="wbc-hdr-btns"><button type="button" class="wbc-hdr-btn" data-act="replier"></button>' +
            '<button type="button" class="wbc-hdr-btn" data-act="taille" title="' + esc(t('sizeTip')) + '" aria-label="' + esc(t('sizeTip')) + '">&#x2922;</button>' +
            '<button type="button" class="wbc-hdr-btn" data-act="close" title="' + esc(t('close')) + '" aria-label="' + esc(t('close')) + '">&#x2715;</button></span></div>' +
            // Deux lignes au lieu de cinq : le périmètre et son choix, puis interrupteurs, état et Analyser.
            '<div id="wbc-haut"><div class="wbc-ligne-haut"><div class="wbc-modes" role="radiogroup" aria-label="' + esc(t('modeLbl')) + '">' +
            mode('here', t('modeHere'), t('hereHint')) + mode('commune', t('modeCommune'), t('tipModeCommune')) + mode('dep', t('modeDep'), t('tipModeDep')) + '</div>' +
            '<div class="wbc-choix" data-pour="here"></div>' +
            '<div class="wbc-choix" data-pour="commune"><input type="search" class="wbc-champ" id="wbc-cherche" title="' + esc(t('tipModeCommune')) + '" placeholder="' + esc(t('searchPh')) + '" autocomplete="off" spellcheck="false" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="wbc-sugg" aria-label="' + esc(t('searchPh')) + '">' +
            '<ul class="wbc-sugg" id="wbc-sugg" role="listbox" hidden></ul></div>' +
            '<div class="wbc-choix" data-pour="dep"><select class="wbc-champ" id="wbc-dep" title="' + esc(t('tipModeDep')) + '" aria-label="' + esc(t('depChoose')) + '"><option value="">' + esc(t('depChoose')) + '</option></select></div></div>' +
            // Les interrupteurs sur UNE ligne : Certifiées, puis ceux de la vue affichée (majInterrupteurs).
            '<div class="wbc-switchs"><div class="wbc-toggle-row" title="' + esc(t('certOnlyTip')) + '"><label class="wbc-toggle"><input type="checkbox" id="wbc-cert"' + (opts.certSeules ? ' checked' : '') + '><span class="wbc-toggle-slider"></span></label>' +
            '<label class="wbc-toggle-lbl" for="wbc-cert">' + esc(t('certOnly')) + '</label></div><span id="wbc-switchs-vue"></span>' +
            // La ligne d'état change à chaque étape : elle ne parle PAS au lecteur d'écran ; une zone à part
            // n'annonce que le début, la fin et les erreurs (M23).
            '<span class="wbc-statut" id="wbc-statut" aria-live="off"></span>' +
            '<button type="button" class="wbc-btn wbc-btn-primary" data-act="go" title="' + esc(t('tipAnalyse')) + '">' + esc(t('analyse')) + '</button>' +
            '<button type="button" class="wbc-btn wbc-btn-neutral" data-act="stop" title="' + esc(t('tipStop')) + '" hidden>' + esc(t('stop')) + '</button></div>' +
            '<div id="wbc-deja" hidden></div>' +
            // L'avancement en CASES FIXES (%, temps restant, compteur, commune, étape) : chaque information
            // garde sa place, la ligne ne passe plus de une à deux lignes selon le nom de la commune.
            '<div class="wbc-progres" id="wbc-progres" aria-hidden="true" hidden></div>' +
            '<p class="wbc-arriere" id="wbc-arriere" role="status" title="' + esc(t('bgTabTip')) + '" hidden>&#x26A0;&#xFE0F; ' + esc(t('bgTab')) + '</p>' +
            '<div class="wbc-barre" id="wbc-barre" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-label="' + esc(t('analyse')) + '" hidden><i></i></div>' +
            '<p class="wbc-lecteur" id="wbc-annonce" role="status" aria-live="polite"></p></div>' +
            '<div id="wbc-corps"></div><div id="wbc-resize"></div>' +
            '<input type="file" id="wbc-cmp-fichier" accept=".csv,text/csv" hidden>';
    }

    // Les interrupteurs de la vue affichée, à côté de Certifiées : Écarts et Présentes pour une commune,
    // Polygones pour un département. Réécrits seulement quand ils changent (le focus reste où il est).
    const interrupteur = (id, on, lbl, tip, off, deco) => '<div class="wbc-toggle-row" title="' + esc(tip) + '"><label class="wbc-toggle"><input type="checkbox" id="' + id + '"' +
        (on ? ' checked' : '') + (off ? ' disabled' : '') + '><span class="wbc-toggle-slider"></span></label><label class="wbc-toggle-lbl" for="' + id + '">' + (deco || '') + esc(lbl) + '</label></div>';
    function majInterrupteurs() {
        const e = ovEl && $('#wbc-switchs-vue');
        if (!e) return;
        // Les pastilles des interrupteurs SONT la légende de la carte : rouge manquant, orange en trop, vert présent.
        const h = resultat ? interrupteur('wbc-carte', opts.carte, t('layerSwitch'), t('layerSwitchTip') + ' — ' + t('legMiss') + ', ' + t('legExtra'), false, pastille('manquant') + pastille('trop')) +
                interrupteur('wbc-trouves', opts.trouves, t('showFound'), t('showFoundTip') + ' — ' + t('legFound'), !opts.carte, pastille('present'))
            : resDep ? interrupteur('wbc-carte-dep', opts.carteDep, t('depMap'), t('depMapTip')) : '';
        if (e.dataset.h !== h) { e.innerHTML = h; e.dataset.h = h; }
    }

    function majModes() {
        ovEl.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-checked', String(b.dataset.mode === opts.mode)));
        ovEl.querySelectorAll('.wbc-choix').forEach(c => { c.hidden = c.dataset.pour !== opts.mode; });
        if (opts.mode === 'dep') remplirDeps();
        majBoutons();
    }
    function majBoutons() {
        if (!ovEl) return;
        // Pendant un passage, Analyser disparaît au lieu de pâlir (blanc sur bleu estompé :
        // illisible, 26/09) ; Arrêter prend sa place.
        // Le bandeau « déjà analysé » porte son propre bouton plein : Analyser s'efface le temps de la question.
        const go = $('[data-act="go"]');
        go.hidden = !!jeton || !!deja;
        const cd = communeDuDep();
        go.title = cd ? t('tipAnalyseCom', cd.nom) : t('tipAnalyse');
        $('[data-act="stop"]').hidden = !jeton;
        // Ni l'interrupteur des certifiées ni le périmètre ne changent pendant un passage.
        $('#wbc-cert').disabled = !!jeton;
        ovEl.querySelectorAll('[data-mode]').forEach(b => { b.disabled = !!jeton; });
    }

    async function remplirDeps() {
        const sel = $('#wbc-dep');
        if (sel.options.length > 1) return;
        try {
            const l = await attendre(Geo.listeDepartements());
            sel.insertAdjacentHTML('beforeend', l.map(d => '<option value="' + esc(d.code) + '">' + esc(d.code + ' — ' + d.nom) + '</option>').join(''));
            if (choixDep) sel.value = choixDep;
        } catch (e) { statut(t('errNet', e.message), true); }
    }

    // Recherche de commune : suggestions au fil de la frappe, flèches et Entrée au clavier.
    let rechTimer = null, rechNo = 0, suggs = [];
    function brancherRecherche() {
        const champ = $('#wbc-cherche'), liste = $('#wbc-sugg');
        const fermer = () => { liste.hidden = true; champ.setAttribute('aria-expanded', 'false'); };
        const choisir = c => {
            oublierDeja();
            choixCommune = { code: c.code, nom: c.nom };
            champ.value = c.nom + ' (' + c.code + ')';
            fermer();
            cadrerChoix('commune', c.code);
            if (!jeton) ouvrirMemoCommune(c.code, !!opts.certSeules);
        };
        champ.addEventListener('input', () => {
            oublierDeja();
            choixCommune = null;
            const q = champ.value.trim();
            clearTimeout(rechTimer);
            if (q.length < 2) { fermer(); return; }
            rechTimer = setTimeout(async () => {
                const no = ++rechNo;
                liste.innerHTML = '<li class="wbc-vide">' + roue(t('searching')) + '</li>';
                liste.hidden = false;
                let l = [], erreur = null;
                // Une panne de geo.api.gouv.fr se DIT : elle s'affichait « Aucune commune trouvée »,
                // pour un code postal pourtant valide (audit du 26/09, M9).
                try { l = await Geo.chercher(q); } catch (e) { erreur = messageErreur(e); }
                if (no !== rechNo) return;
                suggs = l;
                champ.removeAttribute('aria-activedescendant');
                liste.innerHTML = erreur ? '<li class="wbc-vide wbc-err">' + esc(erreur) + '</li>'
                    : l.length ? l.map((c, i) => '<li role="option" id="wbc-sug-' + i + '" aria-selected="false" data-code="' + esc(c.code) + '" data-i="' + i + '"><bdi>' + esc(c.nom) + '</bdi> <small>' + esc(c.codeDepartement + ' · ' + c.code + ((c.codesPostaux && c.codesPostaux.length) ? ' · ' + c.codesPostaux[0] : '')) + '</small></li>').join('')
                    : '<li class="wbc-vide">' + esc(t('searchNone')) + '</li>';
                liste.hidden = false;
                champ.setAttribute('aria-expanded', 'true');
            }, 250);
        });
        champ.addEventListener('keydown', ev => {
            const items = [...liste.querySelectorAll('li[data-code]')];
            const i = items.findIndex(x => x.classList.contains('sel'));
            if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
                if (liste.hidden || !items.length) return;
                ev.preventDefault();
                const k = ev.key === 'ArrowDown' ? Math.min(i + 1, items.length - 1) : Math.max(i - 1, 0);
                items.forEach((x, n) => { x.classList.toggle('sel', n === k); x.setAttribute('aria-selected', String(n === k)); });
                // L'option active est annoncée au lecteur d'écran (motif combobox de l'ARIA APG).
                champ.setAttribute('aria-activedescendant', items[k].id);
                items[k].scrollIntoView({ block: 'nearest' });
            } else if (ev.key === 'Enter') {
                ev.preventDefault();
                const sel = i >= 0 ? items[i] : (items.length === 1 ? items[0] : null);
                if (sel) choisir(suggs[+sel.dataset.i]);
                else if (choixCommune) demanderAnalyse();
            } else if (ev.key === 'Escape' && !liste.hidden) { ev.stopPropagation(); fermer(); }
        });
        liste.addEventListener('mousedown', ev => {
            const li = ev.target.closest('li[data-code]');
            if (!li) return;
            ev.preventDefault();
            choisir(suggs[+li.dataset.i]);
        });
        champ.addEventListener('blur', () => setTimeout(fermer, 150));
    }

    // Les touches tapées dans la fenêtre ne partent pas vers les raccourcis de WME (repris de WRP) ;
    // Ctrl, Méta et Alt passent, pour que Ctrl+S et les raccourcis du navigateur restent à WME.
    function gardeTouche(ev) {
        if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
        if (ev.target.closest && ev.target.closest('input, select, textarea')) ev.stopPropagation();
    }

    function surClic(ev) {
        const act = ev.target.closest('[data-act]');
        if (act) {
            const a = act.dataset.act;
            if (a === 'close') fermerFenetre();
            else if (a === 'go') demanderAnalyse();
            else if (a === 'dejaouvrir' || a === 'dejarelancer') repondreDeja(a === 'dejaouvrir');
            else if (a === 'reprise') lancer(true);
            else if (a === 'replier') basculerRepli(!opts.replie);
            else if (a === 'copier') copierCouverture(act);
            else if (a === 'taille') basculerTaille();
            else if (a === 'stop') arreter();
            else if (a === 'csv' && resultat) exporterCommune(resultat);
            else if (a === 'csvdep' && resDep) exporterDepartement(resDep);
            else if (a === 'dep') { resultat = null; dessiner([]); rendre(); }
            else if (a === 'suivant' && resultat) manquantSuivant();
            else if (a === 'voiesuiv' && resultat && droitHn && !hnEnCours) allerVoieSuivante();
            else if (a === 'selvoie' && resultat && vue.ouverte != null) selectionnerVoie(vue.ouverte);
            else if (a === 'hnvoie' && resultat && vue.ouverte != null && droitHn) ajouterHnVoie(vue.ouverte);
            else if (a === 'noms' && resultat) exporterEcarts([resultat], 'ban-wme_noms_' + resultat.commune.code);
            else if (a === 'nomsdep' && resDep) exporterEcarts([...resCommunes.values()], 'ban-wme_noms_dep' + resDep.dep.code);
            else if (a === 'cmp') { const f = $('#wbc-cmp-fichier'); f.value = ''; f.click(); }
            else if (a === 'cmpx') { cmp = null; rendre(); }
            else if (a === 'memowme' || a === 'memorafr' || a === 'memoban') actionMemo(a);
            return;
        }
        const m = ev.target.closest('[data-mode]');
        if (m) { oublierDeja(); opts.mode = m.dataset.mode; ecrireOpts(); majModes(); return; }
        const f = ev.target.closest('[data-filtre]');
        if (f) { vue.filtre = f.dataset.filtre; rendre(); return; }
        const tr = ev.target.closest('[data-tri]');
        if (tr) { const k = tr.dataset.tri; vue.sens = vue.tri === k ? -vue.sens : (k === 'nom' || k === 'wme' ? 1 : -1); vue.tri = k; rendre(); return; }
        const trd = ev.target.closest('[data-tridep]');
        if (trd) { const k = trd.dataset.tridep; vue.sensDep = (vue.triDep || 'ecart') === k ? -(vue.sensDep || -1) : (k === 'nom' ? 1 : -1); vue.triDep = k; rendre(); return; }
        const h1 = ev.target.closest('[data-hn1]');
        if (h1 && resultat) {
            const [i, k] = h1.dataset.hn1.split(':').map(Number);
            if (droitHn && !hnEnCours) { vue.curseur = k; ajouterHnVoie(i, k); }
            return;
        }
        const adr = ev.target.closest('[data-adr]');
        if (adr && resultat) {
            const [i, k] = adr.dataset.adr.split(':').map(Number);
            allerA(i, k);
            return;
        }
        const ex = ev.target.closest('[data-trop],[data-doublon]');
        if (ex && resultat) {
            const x = ex.dataset.trop != null ? resultat.enTrop[+ex.dataset.trop] : resultat.doublons[+ex.dataset.doublon];
            // Mis en évidence PAR-DESSUS les autres points : l'effacer vidait le calque des manquants.
            tropMontre = x;
            majCalque();
            centrerLibre(x.lon, x.lat, 19);
            return;
        }
        const l = ev.target.closest('tr[data-voie]');
        if (l && resultat) { ouvrirVoie(+l.dataset.voie); return; }
        const lc = ev.target.closest('tr[data-commune]');
        if (lc) {
            // Comme un clic sur la carte du département : la commune ouverte est cadrée en entier.
            const l = resDep && resDep.communes.find(x => x.commune.code === lc.dataset.commune);
            ouvrirCommuneDep(lc.dataset.commune).then(() => { if (l && l.commune.bbox) cadrer(l.commune.bbox); });
            return;
        }
    }

    // Centre la carte sur l'adresse k de la voie i, et la marque comme courante dans la liste.
    function allerA(i, k) {
        const a = resultat.voies[i].adresses[k];
        vue.curseur = k;
        rendre();
        centrerLibre(a.lon, a.lat, 19);
        const b = ovEl.querySelector('[data-adr="' + i + ':' + k + '"]');
        if (b) b.focus({ preventScroll: false });
    }

    // « Manquant suivant » : le prochain numéro manquant de la voie ouverte, puis la première voie
    // incomplète qui suit dans le tableau tel qu'il est trié et filtré — la saisie s'enchaîne sans
    // revenir au tableau.
    // Les numéros manquants qu'« Ajouter » peut poser sur cette voie (même pré-contrôle que son bouton).
    const hnPosable = a => !!a && !a.trouve && !a.hnPose && !a.hnEnregistre && !a.suffixe && !!Core.numeroHn(a.brut);
    const posablesHn = v => v.adresses.filter(hnPosable).length;
    // Le nom BAN est-il porté (principal, alternatif, ou RPP prévu par l'aperçu) ? Pré-contrôle du bouton
    // « Ajouter » et du « + » d'une adresse seule ; le nom exact de chaque segment est relu au clic.
    const nomOkHn = v => v.statutNom === 'identique' || v.statutNom === 'alternatif' || !!(v.apercuHn && v.apercuHn.rpp);
    // « Voie suivante » (0.14.00) : parmi les voies du tableau (filtres et recherche compris), celle dont le nom
    // BAN est porté en principal ou en alternatif et qui a le plus de numéros posables — hors voie ouverte et
    // hors voies déjà ouvertes par ce bouton dans cette commune. -1 : aucune.
    function voieSuivante() {
        if (!resultat) return -1;
        const code = resultat.commune.code;
        if (!vue.suivVues || vue.suivVues.code !== code) vue.suivVues = { code, l: new Set() };
        let j = -1, max = 0;
        for (const v of voiesFiltrees(resultat)) {
            const i = resultat.voies.indexOf(v);
            if (i === vue.ouverte || vue.suivVues.l.has(i) || !(v.statutNom === 'identique' || v.statutNom === 'alternatif')) continue;
            const n = posablesHn(v);
            if (n > max) { max = n; j = i; }
        }
        return j;
    }
    function allerVoieSuivante() {
        const j = voieSuivante();
        if (j < 0) { statut(t('nextStreetNone')); return; }
        if (vue.ouverte != null) vue.suivVues.l.add(vue.ouverte);
        vue.hnMsg = null;
        ouvrirVoie(j);
        const tr = ovEl.querySelector('tr[data-voie="' + j + '"]');
        if (tr) tr.scrollIntoView({ block: 'nearest' });
    }

    function manquantSuivant() {
        let i = vue.ouverte;
        if (i == null) return;
        const suivantDans = (idx, apres) => resultat.voies[idx].adresses.findIndex((a, k) => k > apres && !a.trouve);
        let k = suivantDans(i, vue.curseur);
        if (k < 0) {
            const ordre = voiesFiltrees(resultat).map(v => resultat.voies.indexOf(v));
            const pos = ordre.indexOf(i);
            const prochaine = ordre.slice(pos + 1).find(x => resultat.voies[x].manquants.length);
            // Plus aucun manquant après celui-ci dans le tableau : le dire, au lieu d'un bouton sans effet.
            if (prochaine == null) { statut(t('lastMissing')); return; }
            i = prochaine;
            vue.ouverte = i;
            k = suivantDans(i, -1);
            majCalque();
        }
        allerA(i, k);
    }

    // Les segments rattachés à la voie, sélectionnés dans WME. setSelection est TOUT OU RIEN (un id absent
    // du modèle fait tout échouer) : on cadre la voie pour que WME les charge, puis on ne passe que ceux
    // qui le sont, et on dit combien manquent. Aucune action n'entre dans la pile d'annulation.
    async function selectionnerVoie(i) {
        const v = resultat.voies[i], ids = v.segs || [];
        const charges = async () => {
            const oui = [];
            for (const id of ids) { try { if (await sdk.DataModel.Segments.getById({ segmentId: id })) oui.push(id); } catch (e) { } }
            return oui;
        };
        let l = await charges();
        if (l.length < ids.length) {
            await cadrer(v.bbox);
            for (let n = 0; n < 24 && (l = await charges()).length < ids.length; n++) await new Promise(r => setTimeout(r, 250));
        }
        if (!l.length) { statut(t('selSegsNone'), true); return; }
        try { await sdk.Editing.setSelection({ selection: { ids: l, objectType: 'segment' } }); }
        catch (e) { log('sélection : ' + e.message); statut(t('selSegsNone'), true); return; }
        statut(l.length < ids.length ? t('selSegsPart', nb(l.length), nb(ids.length)) : '');
    }

    // ---- Ajout automatique de numéros : L6 SEULEMENT (29/09) -----------------------
    // Voie par voie, jamais pour la commune entière ; sur les seuls segments dont le nom principal EST
    // celui de la BAN (aux accents et à la casse près) et dont la ville est la commune ou « Village
    // (Commune) » ; au plus 150 numéros par heure glissante, comptés à l'enregistrement. Rien n'est enregistré :
    // sdk.Editing.save n'est JAMAIS appelé, l'éditeur relit et enregistre avec WME.
    // Habilitation reprise de WME Naming Auditor : le rang est lu sur DEUX sources et la plus basse
    // l'emporte ; le rang admis n'est écrit qu'en empreinte, et le jeu d'empreintes est recoupé.
    // Ne pas modifier sans l'accord du mainteneur du script.
    const _hx = t => { let x = 0x811c9dc5;
        for (let i = 0; i < t.length; i++) { x ^= t.charCodeAt(i); x = Math.imul(x, 0x01000193) >>> 0; }
        return x >>> 0; };
    const _hz = [0x853f760];
    const _hq = 0x8651976;
    // Le plafond (150 numéros par heure) n'est pas relu ici en clair : le cœur de calcul est SONDÉ,
    // et la sonde entre dans le recoupement ci-dessus. Changer le plafond du cœur seul, ou la sonde
    // seule, éteint l'ajout automatique au lieu de relever le quota (29/09).
    const _hk = [0x96, 0x36ee80];
    function _hc() {
        const m = Date.now(), [a, f] = _hk, pl = n => Array.from({ length: n }, () => m);
        return Core.quotaHn(pl(a), m).reste === 0 && Core.quotaHn(pl(a - 1), m).reste === 1 &&
            Core.quotaHn([m - f + 6e4], m).utilises === 1 && Core.quotaHn([m - f - 6e4], m).utilises === 0 &&
            ((_hz.reduce((x, y) => (x ^ y) >>> 0, 0) ^ a ^ f) >>> 0) === _hq;
    }
    async function _hp() {
        const v = [];
        let nom = '';
        try { const u = await sdk.State.getUserInfo(); if (u && typeof u.rank === 'number') v.push(u.rank); if (u && u.userName) nom = u.userName; } catch (e) { }
        try {
            const w = pw.W.loginManager.user, r = w && (typeof w.rank === 'number' ? w.rank : w.attributes && w.attributes.rank);
            if (typeof r === 'number') v.push(r);
            if (!nom && w) nom = w.userName || (w.attributes && w.attributes.userName) || '';
        } catch (e) { }
        return { n: v.length ? Math.min(...v) : -1, nom };
    }
    let droitHn = false, hnUser = '', hnEnCours = false;
    async function lireDroitHn() {
        const p = await _hp();
        hnUser = p.nom;
        return p.n >= 0 && !!p.nom && _hz.indexOf(_hx('r' + p.n)) >= 0 && _hc();
    }
    // ==WBC-QUOTA==
    // Les entrées de quota des numéros posés (voir Core.quotaHn), par éditeur. Jusqu'en 0.13.06 elles étaient
    // écrites EN CLAIR sous `wbc.hn.<pseudo>` du localStorage : effacer la clé rendait les 150 numéros
    // (constaté le 11/10). Désormais : ① rien de lisible — la liste est
    // brouillée par une clé tirée du pseudo, sous un nom de clé neutre ; ② scellée — une copie retouchée
    // n'est pas ignorée, elle BLOQUE l'ajout une heure ; ③ en trois copies (localStorage, stockage de
    // Tampermonkey, mémoire de la page) dont on garde la RÉUNION : effacer l'une ne rend rien.
    // ⚠️ Limite d'un contrôle dans le navigateur : décourager, pas empêcher (voir tools/banc-quota.js).
    // Ne pas modifier sans l'accord du mainteneur du script.
    const HN_KEY = 'wbc.hn.';
    let quotaMem = null;
    const _qn = () => 'wbc.q.' + _hx('q|' + hnUser).toString(36);
    const _qk = () => { let x = _hx('k|' + hnUser) || 1;
        return () => { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x & 255; }; };
    const _qt = b => _hx(hnUser + '|' + b + '|' + _hq).toString(36);
    function _qf(l) {
        const j = new TextEncoder().encode(JSON.stringify(l)), k = _qk();
        let o = '';
        for (let i = 0; i < j.length; i++) o += String.fromCharCode(j[i] ^ k());
        const b = btoa(o);
        return 'w2.' + _qt(b) + '.' + b;
    }
    // null : copie absente ; false : copie retouchée ou illisible ; sinon la liste.
    function _qo(v) {
        if (v == null || v === '') return null;
        const m = /^w2\.([0-9a-z]+)\.([A-Za-z0-9+/=]*)$/.exec(String(v));
        if (!m || _qt(m[2]) !== m[1]) return false;
        try {
            const o = atob(m[2]), k = _qk(), j = new Uint8Array(o.length);
            for (let i = 0; i < o.length; i++) j[i] = o.charCodeAt(i) ^ k();
            const l = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(j));
            return Array.isArray(l) ? l : false;
        } catch (e) { return false; }
    }
    // Réunion de plusieurs copies : une entrée n'y figure qu'une fois (enregistrée l'emporte sur réservée).
    function _qu(listes) {
        const vus = new Map();
        for (const l of listes) for (const x of l || []) {
            if (typeof x === 'number') { vus.set('n' + x, x); continue; }
            if (!x || typeof x !== 'object' || typeof x.t !== 'number') continue;
            const c = [x.t, x.s, x.n, x.r || 0].join('|'), y = vus.get(c);
            if (!y || (x.e === 1 && y.e !== 1)) vus.set(c, x);
        }
        return [...vus.values()];
    }
    const _lsLire = c => { try { return localStorage.getItem(c); } catch (e) { return null; } };
    const _gmLire = c => { try { return typeof GM_getValue === 'function' ? GM_getValue(c, null) : null; } catch (e) { return null; } };
    const _gmEcrire = (c, v) => { try { if (typeof GM_setValue === 'function') GM_setValue(c, v); } catch (e) { } };
    const lireHorodatages = () => {
        const c = _qn(), listes = [quotaMem || []];
        let faux = false;
        for (const v of [_lsLire(c), _gmLire(c)]) {
            const l = _qo(v);
            if (l === false) faux = true; else if (l) listes.push(l);
        }
        // Reprise de l'ancien format en clair (0.12.00 → 0.13.06), puis effacé.
        let ancien = false;
        try { const a = JSON.parse(_lsLire(HN_KEY + hnUser) || 'null'); if (Array.isArray(a)) { listes.push(a); ancien = true; } } catch (e) { }
        let l = _qu(listes);
        if (faux) {
            const m = Date.now();
            l = l.concat(Array.from({ length: _hk[0] }, (_, i) => m + i / 1e3));
            log('quota : copie retouchée ⇒ ajout bloqué une heure');
        }
        if (faux || ancien) { ecrireHorodatages(l); try { localStorage.removeItem(HN_KEY + hnUser); } catch (e) { } }
        return l;
    };
    const ecrireHorodatages = l => {
        quotaMem = l.slice();
        const c = _qn(), v = _qf(l);
        try { localStorage.setItem(c, v); } catch (e) { }
        _gmEcrire(c, v);
    };
    // ==/WBC-QUOTA==
    // Ce qui compte au quota, c'est ce qui PART À L'ENREGISTREMENT (29/09) : on relit sur
    // le serveur les segments des numéros réservés. Retrouvé ⇒ compté ; absent ⇒ rendu. Au démarrage, une
    // réservation restée d'une page fermée sans enregistrer est tranchée de même.
    // Journal des numéros ENREGISTRÉS par WBC, par commune (heure de l'enregistrement confirmé) : un
    // balayage gardé plus ancien ne les voit pas, et le bandeau « Déjà analysé » le dit (29/09 : la rue de
    // Paniscoule, complète dans WME, restait « manquante » dans le balayage de la veille).
    const HN_LOG = 'wbc.hnlog';
    const lireJournalHn = () => { try { const o = JSON.parse(localStorage.getItem(HN_LOG) || '{}'); return o && typeof o === 'object' && !Array.isArray(o) ? o : {}; } catch (e) { return {}; } };
    function noterEnregistresHn(comptes) {
        if (!comptes.length) return;
        const o = lireJournalHn(), maintenant = Date.now(), lim = maintenant - 90 * 864e5;
        for (const x of comptes) if (x.c) {
            const l = (Array.isArray(o[x.c]) ? o[x.c] : []).filter(y => y > lim);
            l.push(maintenant);
            o[x.c] = l;
        }
        try { localStorage.setItem(HN_LOG, JSON.stringify(o)); } catch (e) { }
    }
    // Numéros enregistrés par WBC depuis un balayage gardé : sa commune, ou les communes de son département.
    function ajoutsDepuis(e) {
        const o = lireJournalHn(), t0 = new Date(e.date).getTime(), code = String(e.code || '');
        if (!code || !Number.isFinite(t0)) return 0;
        let n = 0;
        for (const [c, l] of Object.entries(o)) if (Array.isArray(l) && (e.type === 'dep' ? c.startsWith(code) : c === code)) n += l.filter(y => y > t0).length;
        return n;
    }
    // Les RPP posés par CETTE page (0.13.00). Une entrée de RPP n'est rendue au quota que si elle vient
    // d'ici et que son POI a disparu du modèle : un POI d'une autre page n'est peut-être simplement pas chargé.
    const SESSION_HN = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    // État du POI d'une entrée de RPP, lu dans le modèle de WME : même numéro, catégorie résidentielle, à
    // moins de 15 m de l'adresse BAN (le POI est posé à la position du numéro, donc au point BAN).
    // ⚠️ 0.13.01 (essai du 02/10, impasse de la Plaine) : un POI ENREGISTRÉ a un identifiant « 721326.7409869.43585000 »
    // (chaîne, pas un nombre : `Number()` rend NaN) ; seul le POI en attente a un identifiant négatif. Et juste après
    // l'enregistrement, WME recharge ses POI : un POI introuvable à ce moment n'est PAS disparu ⇒ jamais rendu après un
    // enregistrement (les 5 RPP de l'essai avaient été « rendus » au quota alors qu'ils étaient sur le serveur).
    function etatRppModele(x, apresEnregistrement) {
        let liste;
        try { liste = sdk.DataModel.Venues.getAll(); } catch (e) { return null; }
        const m = Core.normNum(x.n), k = Math.cos(x.lat * Math.PI / 180) * 111320;
        let enAttente = false;
        for (const v of liste || []) {
            if (!v || !v.isResidential || !v.geometry || v.geometry.type !== 'Point') continue;
            const [lon, lat] = v.geometry.coordinates;
            if (Math.hypot((lon - x.lon) * k, (lat - x.lat) * 111320) > 15) continue;
            let num = null;
            try { num = (sdk.DataModel.Venues.getAddress({ venueId: String(v.id) }) || {}).houseNumber; } catch (e) { }
            if (Core.normNum(num) !== m) continue;
            // Un POI pas encore enregistré a un identifiant NÉGATIF (mesuré le 02/10 : -1585101565).
            if (!String(v.id).trim().startsWith('-')) return 'ok';
            enAttente = true;
        }
        if (enAttente) return 'attente';
        return x.p === SESSION_HN && !apresEnregistrement ? 'absent' : null;
    }
    let rapprochement = null;
    async function rapprocherQuota(apresEnregistrement) {
        if (!hnUser) return;
        const attente = lireHorodatages().filter(x => x && typeof x === 'object' && x.e === 0);
        if (!attente.length) return;
        const segs = [...new Set(attente.map(x => x.s))], lus = new Map();
        try {
            for (let k = 0; k < segs.length; k += 250) {
                const lot = segs.slice(k, k + 250);
                const r = await sdk.DataModel.HouseNumbers.fetchHouseNumbers({ segmentIds: lot });
                lot.forEach(id => lus.set(id, []));
                for (const h of r || []) if (lus.has(h.segmentId)) lus.get(h.segmentId).push(h.number);
            }
        } catch (e) { log('quota : relecture impossible — ' + e.message); return; }
        // Relu APRÈS la lecture réseau : un ajout fait entre-temps n'est pas perdu.
        // Les RPP après un enregistrement : laisser WME recharger ses POI avant de les chercher.
        if (apresEnregistrement && lireHorodatages().some(x => x && x.r === 1 && x.e === 0)) await new Promise(r => setTimeout(r, 3000));
        const res = Core.rapprocherHn(lireHorodatages(), lus, x => etatRppModele(x, apresEnregistrement));
        ecrireHorodatages(res.entrees);
        noterEnregistresHn(res.comptes);
        const cle = x => (x.r === 1 ? 'r' : '') + x.s + '|' + Core.normNum(x.n);
        const ok = new Set(res.comptes.map(cle)), rendu = new Set(res.rendus.map(cle));
        let modifs = 0;
        if (resultat) for (const v of resultat.voies) for (const a of v.adresses) {
            if (!a.hnPose || a.hnSeg == null) continue;
            const c = (a.hnRpp ? 'r' : '') + a.hnSeg + '|' + Core.normNum(a.hnNum);
            if (ok.has(c)) {
                a.hnPose = false;
                a.hnEnregistre = true;
                modifs++;
                // Enregistré et relu sur le serveur : l'adresse est désormais DANS WME, sans relancer
                // l'analyse (29/09) — la voie et les totaux de la commune suivent.
                if (!a.trouve) {
                    const type = a.hnRpp ? 'RPP' : 'HN', champ = a.hnRpp ? 'rpp' : 'hn';
                    Object.assign(a, { trouve: type, wlon: a.lon, wlat: a.lat, dm: 0, seg: null, plon: null, plat: null, pd: null });
                    v[champ]++;
                    v.presents++;
                    const k = v.manquants.indexOf(a.brut);
                    if (k >= 0) v.manquants.splice(k, 1);
                    const T = resultat.totaux;
                    T[champ]++;
                    T.presents++;
                    T.manquants--;
                    if (v.presents === v.ban) T.voiesCompletes++;
                }
            }
            else if (rendu.has(c)) { a.hnPose = false; modifs++; }
        }
        log('quota : ' + res.comptes.length + ' numéro(s) enregistré(s) compté(s), ' + res.rendus.length + ' rendu(s)');
        if (modifs && !apresEnregistrement) { rendre(); appliquerVisibilite(); }
        if (apresEnregistrement && (res.comptes.length || res.rendus.length)) {
            const txt = t('ajHnSaved', nb(res.comptes.length), nb(res.rendus.length), nb(Core.quotaHn(res.entrees, Date.now()).reste));
            if (vue.ouverte != null) vue.hnMsg = { i: vue.ouverte, txt, err: false };
            rendre();
            appliquerVisibilite();
            statut(txt);
        }
    }
    const lancerRapprochement = apres => { rapprochement = (rapprochement || Promise.resolve()).then(() => rapprocherQuota(apres)).catch(e => log('quota : ' + e.message)); };
    const heureCourte = ms => new Date(ms).toLocaleTimeString(LOCALES[_lang] || 'en', { hour: '2-digit', minute: '2-digit' });

    function boutonHn(v) {
        const q = Core.quotaHn(lireHorodatages(), Date.now());
        const n = posablesHn(v);
        // Pré-contrôle sur le calcul ; le nom EXACT de chaque segment est relu dans WME au clic.
        // 0.13.00 : le nom BAN en ALTERNATIF suffit aussi (segment hors agglomération : l'adresse y devient un RPP).
        const ap = v.apercuHn;
        const nomOk = nomOkHn(v), k = Math.min(n, q.reste);
        const tip = !nomOk ? t('ajHnNoName') : !q.reste ? t('ajHnQuota', heureCourte(q.libre)) : !n ? t('ajHnNone') : t('ajHnAddTip', nb(q.reste));
        // Comptes séparés numéros / RPP (02/10), d'après l'aperçu lu à l'ouverture de la voie.
        let lib = t('ajHnAdd', nb(k));
        if (ap && ap.rpp) { const kh = Math.min(ap.hn, q.reste), kr = Math.min(ap.rpp, q.reste - kh); lib = t('ajHnAddMix', nb(kh), nb(kr)); }
        return ' <button type="button" class="wbc-btn wbc-btn-neutral" data-act="hnvoie" title="' + esc(tip) + '"' + (nomOk && k && !hnEnCours ? '' : ' disabled') + '>' + esc(lib) + '</button>' +
            // Le quota restant, toujours visible à côté du bouton (29/09).
            ' <span class="wbc-hn-quota' + (q.reste ? '' : ' plein') + '" title="' + esc(t('ajHnQuotaTip')) + '">' + esc(q.reste ? t('ajHnLeft', nb(q.reste)) : t('ajHnFull', heureCourte(q.libre))) + '</span>' +
            boutonVoieSuivante();
    }
    // « Voie suivante » (0.14.00) : un bouton qui saute à la voie où l'ajout a le plus à poser.
    function boutonVoieSuivante() {
        const j = voieSuivante(), n = j < 0 ? 0 : posablesHn(resultat.voies[j]);
        return ' <button type="button" class="wbc-btn wbc-btn-neutral wbc-voie-suiv" data-act="voiesuiv" title="' + esc(j < 0 ? t('nextStreetNone') : t('tipNextStreet')) + '"' +
            (j < 0 || hnEnCours ? ' disabled' : '') + '>' + esc(t('nextStreet', nb(n))) + ' <span class="wbc-fl">&#x25B6;</span></button>';
    }

    // Les segments d'une voie lus dans WME (nom, ville, alternatifs) et les numéros déjà présents, HN et RPP,
    // en attente compris. `cadrerSiBesoin` : cadrer la voie si des segments ne sont pas chargés (au clic) ;
    // sans lui (aperçu à l'ouverture de la voie), on se contente de ce qui est chargé.
    async function lireVoieHn(v, cadrerSiBesoin, zone) {
        let ids = [...new Set((v.segs || []).concat(v.adresses.filter(a => !a.trouve && a.seg != null).map(a => a.seg)))];
        const idsVoie = new Set(ids);
        // 0.13.04 : une passe de ZONE prend aussi les segments chargés à moins de ~100 m de ses adresses. L'analyse
        // ne rattache à une voie que les segments qu'elle a reconnus (un seul au chemin des Baylés, le 02/10) ;
        // planHn trie ensuite par nom, ville et alternatif — un segment voisin d'un autre nom est simplement refusé.
        if (zone && zone.adresses && zone.adresses.length) {
            const dLat = 0.0009, dLon = 0.0009 / Math.cos(zone.lat * Math.PI / 180);
            const lo0 = Math.min(...zone.adresses.map(a => a.lon)) - dLon, lo1 = Math.max(...zone.adresses.map(a => a.lon)) + dLon;
            const la0 = Math.min(...zone.adresses.map(a => a.lat)) - dLat, la1 = Math.max(...zone.adresses.map(a => a.lat)) + dLat;
            try {
                for (const sg of sdk.DataModel.Segments.getAll() || []) {
                    const c = sg && sg.geometry && sg.geometry.coordinates;
                    if (c && c.some(([x, y]) => x >= lo0 && x <= lo1 && y >= la0 && y <= la1)) ids.push(sg.id);
                }
            } catch (e) { log('segments de la zone : ' + e.message); }
            ids = [...new Set(ids)];
        }
        const charges = async () => {
            const l = [];
            for (const id of ids) { try { const s = await sdk.DataModel.Segments.getById({ segmentId: id }); if (s) l.push(s); } catch (e) { } }
            return l;
        };
        let l = await charges();
        if (l.length < ids.length && cadrerSiBesoin) {
            await cadrer(v.bbox);
            for (let n = 0; n < 24 && (l = await charges()).length < ids.length; n++) await new Promise(r => setTimeout(r, 250));
            // 0.13.01 : une voie longue se cadre sous le zoom 16, où WME ne charge pas les rues (mesuré : aucune
            // rue de type 1 au zoom 15) — essai du 02/10, chemin des Baylés, 1,5 km : aucun segment chargé. On se
            // recentre alors au zoom 16 sur la voie : on y gagne au moins sa partie centrale.
            if (l.length < ids.length && (await sdk.Map.getZoomLevel()) < 16) {
                await sdk.Map.setMapCenter({ lonLat: { lon: (v.bbox[0] + v.bbox[2]) / 2, lat: (v.bbox[1] + v.bbox[3]) / 2 }, zoomLevel: 16 });
                for (let n = 0; n < 24 && (l = await charges()).length < ids.length; n++) await new Promise(r => setTimeout(r, 250));
            }
        }
        // Le nom principal et la ville de chaque segment, lus dans WME au moment du clic.
        const segs = [];
        for (const s of l) {
            let nom = '', ville = '';
            try {
                const st = s.primaryStreetId != null ? await sdk.DataModel.Streets.getById({ streetId: s.primaryStreetId }) : null;
                if (st) {
                    nom = st.name || '';
                    const c = st.cityId != null ? await sdk.DataModel.Cities.getById({ cityId: st.cityId }) : null;
                    ville = (c && c.name) || '';
                }
            } catch (e) { }
            // Les noms alternatifs (0.13.00) : « nom BAN / commune » en alternatif sur un principal sans
            // ville = segment hors agglomération, où l'adresse devient un RPP. Le département et le pays
            // servent à l'adresse du POI (updateAddress refuse une adresse sans stateId).
            let alts = [], stateId = null, countryId = null;
            try {
                const ad = sdk.DataModel.Segments.getAddress({ segmentId: s.id }) || {};
                alts = (ad.altStreets || []).map(x => ({ nom: (x.street && x.street.name) || '', ville: (x.city && x.city.name) || '' }));
                stateId = ad.state ? ad.state.id : null;
                countryId = ad.country ? ad.country.id : null;
            } catch (e) { }
            segs.push({ id: s.id, coords: s.geometry && s.geometry.coordinates, nom, ville, alts, stateId, countryId });
        }
        // Les numéros déjà sur ces segments : un numéro présent n'est jamais reposé. fetchHouseNumbers ne
        // rend que les ENREGISTRÉS (mesuré le 29/09 : un numéro posé en attente n'y figure pas) ; ceux en
        // attente se lisent dans le modèle de WME, que le SDK n'expose pas.
        // Par lots de 250 : au-delà de ~500 segments, l'appel est rejeté (limite non documentée, mesurée).
        const existants = [];
        // Sur TOUS les segments de la voie, chargés ou non (essai du 29/09 à Brie : 1 segment chargé sur 2 —
        // un numéro du segment manquant aurait été reposé ; fetchHouseNumbers lit aussi un segment non chargé).
        // Les numéros existants : ceux de la voie. Un segment ajouté par la ZONE ne compte que s'il porte le nom BAN
        // (principal ou alternatif) — sinon le « 5 » d'une autre rue voisine empêcherait de poser le 5 de celle-ci.
        const nomBanV = Core.nomSouple(v.nom);
        const deLaVoie = id => {
            if (idsVoie.has(id)) return true;
            const sg = segs.find(x => x.id === id);
            return !!sg && (Core.nomSouple(sg.nom) === nomBanV || (sg.alts || []).some(x => Core.nomSouple(x.nom) === nomBanV));
        };
        const tous = [...new Set(ids.concat(segs.map(s => s.id)))].filter(deLaVoie);
        for (let k = 0; k < tous.length; k += 250) {
            const lot = await sdk.DataModel.HouseNumbers.fetchHouseNumbers({ segmentIds: tous.slice(k, k + 250) });
            for (const h of lot || []) existants.push(h.number);
        }
        try {
            const dans = new Set(tous);
            for (const h of pw.W.model.segmentHouseNumbers.getObjectArray()) if (dans.has(h.getAttribute('segID'))) existants.push(h.getAttribute('number'));
        } catch (e) { log('numéros en attente : ' + e.message); }
        // Les RPP de cette voie chargés dans WME, en attente compris : un RPP posé depuis le balayage (ici,
        // à la main ou par WNA) n'est pas dans l'analyse, et le reposer ferait un doublon.
        try {
            const nomBan = Core.nomSouple(v.nom);
            for (const p of sdk.DataModel.Venues.getAll() || []) {
                if (!p || !p.isResidential) continue;
                const ad = sdk.DataModel.Venues.getAddress({ venueId: String(p.id) }) || {};
                if (ad.houseNumber && ad.street && Core.nomSouple(ad.street.name) === nomBan) existants.push(ad.houseNumber);
            }
        } catch (e) { log('RPP chargés : ' + e.message); }
        return { segs, existants };
    }

    // Les numéros d'un segment dans le modèle de WME, en attente compris (le SDK ne lit pas un numéro pas encore
    // enregistré : getById rend un objet vide pour son identifiant négatif, mesuré le 02/10).
    function hnsDuSegment(segId) {
        try { return pw.W.model.segmentHouseNumbers.getObjectArray().filter(h => h.getAttribute('segID') === segId); }
        catch (e) { return []; }
    }
    // Hors agglomération (0.13.00) : le numéro qu'on vient de poser devient un RPP, À L'IDENTIQUE du ⚡
    // « Numéro hors agglo » de WNA (WME-Naming-Auditor, convertir en POI résidentiel) : POI créé à la position du
    // numéro, adresse (numéro, nom de l'alternatif, commune), point d'entrée REPRIS du numéro, numéro retiré. Une
    // étape qui échoue défait les précédentes : jamais d'adresse en double ni de POI sans adresse. Mesuré dans
    // WME le 02/10 (Saint-Lizier, impasse de la Plaine n° 2) : un numéro tout juste posé a déjà son point
    // d'entrée calculé, et les 5 actions (numéro, POI, adresse, entrée, retrait) s'annulent proprement.
    // Rend { ok, erreur?, critique? } ; `critique` = la carte est restée dans un état à reprendre à la main.
    function convertirEnRpp(p, avant, seg) {
        const DM = sdk.DataModel;
        const h = hnsDuSegment(p.segmentId).find(x => !avant.has(x.getID()) && Core.normNum(x.getAttribute('number')) === Core.normNum(p.number));
        if (!h) return { ok: false, erreur: 'numéro posé introuvable dans le modèle', critique: t('ajRppCritHn', p.number) };
        const hid = String(h.getID());
        const retirerHn = () => { try { DM.HouseNumbers.deleteHouseNumber({ houseNumberId: hid }); return true; } catch (e) { return false; } };
        const retirerPoi = id => { try { DM.Venues.deleteVenue({ venueId: id }); return true; } catch (e) { return false; } };
        let geom = null, fp = null;
        try { geom = h.getGeometry().coordinates; fp = h.getFractionPoint() && h.getFractionPoint().coordinates; } catch (e) { }
        if (!geom) geom = [p.lon, p.lat];
        // 1. Le POI, à la position du numéro.
        let vid;
        try { vid = String(DM.Venues.addVenue({ category: 'RESIDENTIAL', geometry: { type: 'Point', coordinates: geom } })); }
        catch (e) { return retirerHn() ? { ok: false, erreur: 'POI non créé (' + e.message + '), numéro retiré' } : { ok: false, erreur: 'POI non créé', critique: t('ajRppCritHn', p.number) }; }
        // 2. Son adresse — étape à part : un échec ici laisserait un POI SANS ADRESSE (défaut v2.09 de WNA).
        try {
            DM.Venues.updateAddress({ venueId: vid, addressData: { houseNumber: String(p.number), streetName: p.rpp.rue, cityName: p.rpp.ville,
                stateId: seg && seg.stateId, countryId: seg && seg.countryId } });
        } catch (e) {
            const okPoi = retirerPoi(vid), okHn = retirerHn();
            return { ok: false, erreur: 'adresse du POI refusée (' + e.message + ')', critique: okPoi && okHn ? null : t('ajRppCritPoi', p.number) };
        }
        // 3. Le point d'entrée du numéro : non bloquant (le POI vaut sans), mais dit.
        if (fp) {
            try { DM.Venues.replaceNavigationPoints({ venueId: vid, navigationPoints: [{ point: { type: 'Point', coordinates: fp }, entry: true, exit: true }] }); }
            catch (e) { log('RPP ' + p.number + ' : point d\'entrée non repris — ' + e.message); }
        }
        // 4. Le numéro retiré — sinon l'adresse serait en double : on retire alors le POI.
        if (!retirerHn()) {
            const okPoi = retirerPoi(vid);
            return { ok: false, erreur: 'numéro non retiré', critique: okPoi ? t('ajRppCritHn', p.number) : t('ajRppCritDbl', p.number) };
        }
        return { ok: true };
    }

    // `k` (0.15.00) : l'adresse k SEULE — le « + » d'une pastille ou d'un point de la carte. Mêmes contrôles,
    // même quota, même conversion hors agglo ; la voie entière sert encore à lire les numéros existants.
    async function ajouterHnVoie(i, k) {
        if (hnEnCours) return;
        const v = resultat.voies[i], commune = resultat.commune.nom;
        const seule = k != null ? v.adresses[k] : null;
        if (k != null && !hnPosable(seule)) return;
        const vPlan = seule ? Object.assign({}, v, { adresses: [seule] }) : v;
        // Le droit est relu à chaque clic, pas seulement au démarrage.
        if (!(await lireDroitHn())) { droitHn = false; rendre(); statut(t('ajHnRights'), true); return; }
        const q = Core.quotaHn(lireHorodatages(), Date.now());
        if (!q.reste) { statut(t('ajHnQuota', heureCourte(q.libre)), true); return; }
        hnEnCours = true;
        majArrierePlan(true);
        statut(t('ajHnRunning'));
        let msg = null;
        try {
            let n = 0, nRpp = 0, err = null, admisTotal = 0;
            const critiques = [];
            const horo = q.garder.slice();
            // Une passe : lire ce qui est chargé, planifier, poser. Rend le plan (ses écartés servent au message).
            let sansAlt = 0, sansAltR = 0;
            const msgAlt = () => (sansAlt ? ' ' + t('ajHnSansAlt', v.nom, commune) : '') + (sansAltR ? ' ' + t('ajHnSansAltRoute', v.nom, commune) : '');
            const passe = async (cadrerSiBesoin, zone) => {
                const { segs, existants } = await lireVoieHn(v, cadrerSiBesoin, zone);
                const plan = Core.planHn(vPlan, commune, segs, existants, Core.quotaHn(horo, Date.now()).reste);
                log('numéros ' + v.nom + ' : ' + plan.poses.length + ' à poser, segments admis ' + plan.admis + '/' + segs.length +
                    ' (hors agglo ' + plan.hors + ', autre nom ' + plan.refus.nom + ', autre ville ' + plan.refus.ville + '), écartés ' + JSON.stringify(plan.ecartes));
                admisTotal += plan.admis;
                sansAlt = Math.max(sansAlt, plan.refus.sansAlt || 0);
                sansAltR = Math.max(sansAltR, plan.refus.sansAltRoute || 0);
                const parSeg = new Map(segs.map(x => [x.id, x]));
                for (const p of plan.poses) {
                    // Les numéros de ce segment AVANT la pose : le numéro posé est le seul nouveau (addHouseNumber ne
                    // rend rien — mesuré le 29/09 — et son identifiant provisoire n'est lisible que dans le modèle).
                    const avant = p.rpp ? new Set(hnsDuSegment(p.segmentId).map(h => h.getID())) : null;
                    try { await sdk.DataModel.HouseNumbers.addHouseNumber({ number: p.number, point: { type: 'Point', coordinates: [p.lon, p.lat] }, segmentId: p.segmentId }); }
                    catch (e) {
                        err = e;
                        log('numéro ' + p.number + ' : ' + (e && e.name) + ' — ' + (e && e.message));
                        if (e && e.name === 'InvalidStateError') break;
                        continue;
                    }
                    if (p.rpp) {
                        const r = convertirEnRpp(p, avant, parSeg.get(p.segmentId));
                        if (r.critique) critiques.push(r.critique);
                        if (!r.ok) { err = new Error(r.erreur); log('RPP ' + p.number + ' : ' + r.erreur); continue; }
                        nRpp++;
                        p.adresse.hnRpp = true;
                    } else n++;
                    p.adresse.hnPose = true;
                    horo.push(Object.assign({ t: Date.now(), s: p.segmentId, n: p.number, e: 0, c: resultat.commune.code },
                        p.rpp ? { r: 1, lon: p.lon, lat: p.lat, p: SESSION_HN } : {}));
                    ecrireHorodatages(horo);
                    p.adresse.hnSeg = p.segmentId;
                    p.adresse.hnNum = p.number;
                }
                return plan;
            };
            let plan;
            if (seule) {
                // Une adresse : on ne cadre pas la voie entière, on lit les segments chargés autour d'elle. La carte
                // ne bouge que si l'adresse est hors de la vue ou sous le zoom 16 (WME n'y charge pas les rues).
                let ext = null, zoom = 0;
                try { ext = await sdk.Map.getMapExtent(); zoom = await sdk.Map.getZoomLevel(); } catch (e) { }
                const dedans = ext && seule.lon >= ext[0] && seule.lon <= ext[2] && seule.lat >= ext[1] && seule.lat <= ext[3];
                if (!dedans || zoom < 16) {
                    await sdk.Map.setMapCenter({ lonLat: { lon: seule.lon, lat: seule.lat }, zoomLevel: Math.max(17, zoom) });
                    await new Promise(r => setTimeout(r, 2500));
                }
                plan = await passe(false, { lon: seule.lon, lat: seule.lat, adresses: [seule] });
                if (!n && !nRpp && !err) {
                    const e = plan.ecartes, num = Core.numeroHn(seule.brut);
                    if (!admisTotal) msg = [t('ajHnNoSeg') + msgAlt(), true];
                    else if (e.existe) msg = [t('ajHn1Exists', num), true];
                    else if (e.loin) msg = [t('ajHn1Far', num) + msgAlt(), true];
                    else msg = [t('ajHnNone'), true];
                    return;
                }
            } else plan = await passe(true);
            // 0.13.03 : une voie plus longue que la vue au zoom 16 se parcourt par zones — on se recentre sur chaque
            // groupe d'adresses restées « trop loin » (segment non chargé), on relit, on pose. Une zone sans progrès
            // n'est pas retentée ; le quota arrête tout.
            if (!seule && plan.ecartes.loin && Core.quotaHn(horo, Date.now()).reste) {
                const restantes = () => v.adresses.filter(a => !a.trouve && !a.hnPose && !a.hnEnregistre && !a.suffixe && Core.numeroHn(a.brut));
                const zones = Core.zonesHn(restantes(), 400, 220);
                for (const z of zones) {
                    if (!Core.quotaHn(horo, Date.now()).reste || err && err.name === 'InvalidStateError') break;
                    await sdk.Map.setMapCenter({ lonLat: { lon: z.lon, lat: z.lat }, zoomLevel: Math.max(16, await sdk.Map.getZoomLevel()) });
                    await new Promise(r => setTimeout(r, 2500));
                    const pz = await passe(false, z);
                    log('zone ' + z.lon.toFixed(5) + ',' + z.lat.toFixed(5) + ' (' + z.adresses.length + ' adresses) : ' + pz.poses.length + ' posé(s)');
                }
                plan = { ecartes: Object.assign({}, plan.ecartes, { loin: restantes().filter(a => !a.hnPose).length }) };
                plan.ecartes.existe = 0; plan.ecartes.quota = 0;
            }
            if (!admisTotal) { msg = [t('ajHnNoSeg') + msgAlt(), true]; return; }
            const e = plan.ecartes, ecartes = seule ? 0 : e.existe + e.suffixe + e.format + e.loin + e.quota;
            msg = [(critiques.length ? t('ajRppCrit', critiques.join(' · ')) + ' ' : '') +
                (nRpp && !n ? t('ajHnDoneRpp', nb(nRpp), nb(Core.quotaHn(horo, Date.now()).reste)) : nRpp ? t('ajHnDoneMix', nb(n), nb(nRpp), nb(Core.quotaHn(horo, Date.now()).reste)) : t('ajHnDone', nb(n), nb(Core.quotaHn(horo, Date.now()).reste))) +
                (n + nRpp ? ' ' + t('ajHnSee', n + nRpp) : '') + (ecartes ? ' ' + t('ajHnSkip', nb(ecartes)) : '') +
                (e.loin ? msgAlt() : '') +
                (err ? ' ' + t('ajHnErr', (err && (err.message || err.name)) || '') : ''), (!(n + nRpp) && !!err) || critiques.length > 0];
        } catch (e) { log('ajout de numéros : ' + e.message); msg = [t('ajHnErr', e.message), true]; }
        finally {
            // hnEnCours retombe AVANT le rendu : sinon le bouton reste grisé (vu à l'essai du 29/09).
            hnEnCours = false;
            majArrierePlan();
            v.apercuHn = null;
            apercuHn(i);
            if (msg) vue.hnMsg = { i, txt: msg[0], err: msg[1] };
            rendre();
            appliquerVisibilite();
            if (msg) statut(msg[0], msg[1]);
        }
    }

    // Aperçu à l'ouverture d'une voie (0.13.00) : combien de numéros et combien de RPP partiraient, lu sur les
    // segments déjà chargés, sans rien poser. Faute de segments chargés, le bouton garde le seul total.
    async function apercuHn(i) {
        const v = resultat && resultat.voies[i];
        if (!v || !droitHn || !v.adresses.some(a => !a.trouve && !a.hnPose)) return;
        try {
            const { segs, existants } = await lireVoieHn(v, false);
            const pl = Core.planHn(v, resultat.commune.nom, segs, existants, Infinity);
            v.apercuHn = { hn: pl.poses.filter(p => !p.rpp).length, rpp: pl.poses.filter(p => p.rpp).length };
            if (vue.ouverte === i && !hnEnCours) rendre();
        } catch (e) { log('aperçu ' + v.nom + ' : ' + e.message); }
    }

    function ouvrirVoie(i) {
        vue.curseur = -1;
        vue.ouverte = vue.ouverte === i ? null : i;
        rendre();
        majCalque();
        if (vue.ouverte != null) {
            // L'aperçu après le cadrage : les segments de la voie sont alors chargés.
            Promise.resolve(cadrer(resultat.voies[i].bbox)).then(() => new Promise(r => setTimeout(r, 1200))).then(() => apercuHn(i));
            const tr = ovEl.querySelector('tr[data-voie="' + i + '"]');
            if (tr) tr.focus({ preventScroll: true });
        }
    }

    function construireFenetre() {
        ovEl = document.createElement('div');
        ovEl.id = 'wbc-ov';
        ovEl.dir = _lang === 'he' ? 'rtl' : 'ltr';
        ovEl.tabIndex = -1;
        ovEl.setAttribute('role', 'dialog');
        ovEl.setAttribute('aria-label', SCRIPT_NAME);
        ovEl.innerHTML = htmlFenetre();
        document.body.appendChild(ovEl);
        ovEl.addEventListener('click', surClic);
        ovEl.addEventListener('keydown', gardeTouche);
        // Échap ferme la fenêtre quand le focus y est (la liste de suggestions ouverte se ferme d'abord,
        // son propre gestionnaire arrête l'événement) ; il ne part plus vers la sélection de WME (M13).
        ovEl.addEventListener('keydown', ev => {
            if (ev.key !== 'Escape' || ev.ctrlKey || ev.metaKey || ev.altKey) return;
            ev.preventDefault();
            ev.stopPropagation();
            fermerFenetre();
        });
        // Toucher la fenêtre la passe devant celle d'un autre script au même niveau (WRP est à 9989,
        // la première construite restait dessous : audit M14).
        const auPremierPlan = () => { ovEl.style.zIndex = '9991'; };
        ovEl.addEventListener('mousedown', auPremierPlan, true);
        ovEl.addEventListener('focusin', auPremierPlan);
        ovEl.addEventListener('keydown', ev => {
            // Une ligne s'ouvre aussi au clavier : Entrée ou Espace sur la ligne elle-même.
            if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.matches && ev.target.matches('tr[data-voie], tr[data-commune]')) {
                ev.preventDefault();
                ev.stopPropagation();
                surClic({ target: ev.target });
            }
        });
        ovEl.addEventListener('input', ev => {
            if (ev.target.id !== 'wbc-filtre-txt') return;
            vue.texte = ev.target.value;
            const pos = ev.target.selectionStart;
            rendre();
            const f = $('#wbc-filtre-txt');
            f.focus();
            try { f.setSelectionRange(pos, pos); } catch (e) { }
        });
        ovEl.addEventListener('change', ev => {
            if (ev.target.id === 'wbc-dep' || ev.target.id === 'wbc-cert') oublierDeja();
            if (ev.target.id === 'wbc-dep') { choixDep = ev.target.value; if (choixDep) cadrerChoix('dep', choixDep); if (choixDep && !jeton) ouvrirMemoDep(choixDep, !!opts.certSeules); }
            else if (ev.target.id === 'wbc-deleguee') { vue.deleguee = ev.target.value; vue.ouverte = null; rendre(); majCalque(); }
            else if (ev.target.id === 'wbc-cert') { opts.certSeules = ev.target.checked; ecrireOpts(); }
            else if (ev.target.id === 'wbc-carte') { opts.carte = ev.target.checked; ecrireOpts(); majCalque(); majInterrupteurs(); }
            else if (ev.target.id === 'wbc-trouves') { opts.trouves = ev.target.checked; ecrireOpts(); majCalque(); }
            else if (ev.target.id === 'wbc-carte-dep') { opts.carteDep = ev.target.checked; ecrireOpts(); rendre(); }
            else if (ev.target.id === 'wbc-cmp-fichier' && ev.target.files && ev.target.files[0]) chargerExport(ev.target.files[0]);
        });
        brancherRecherche();
        majModes();
        majBoutons();
        majRepli();
        deplacable(ovEl, $('#wbc-hdr'));
        redimensionnable(ovEl, $('#wbc-resize'));
        window.addEventListener('resize', () => { if (ovEl.classList.contains('open')) placerFenetre(lireGeom()); });
        rendre();
    }

    let retourFocus = null;
    function ouvrirFenetre(prendreFocus) {
        if (!ovEl) return;
        const deja = ovEl.classList.contains('open');
        ovEl.classList.add('open');
        ovEl.style.zIndex = '9991';
        if (!deja) placerFenetre(lireGeom());
        majFab();
        appliquerVisibilite();
        if (prendreFocus && !deja) { retourFocus = document.activeElement; ovEl.focus(); }
    }
    function fermerFenetre() {
        if (!ovEl) return;
        const dedans = ovEl.contains(document.activeElement);
        ovEl.classList.remove('open');
        majFab();
        appliquerVisibilite();
        if (dedans) {
            const cible = retourFocus && document.contains(retourFocus) ? retourFocus : document.getElementById('wbc-fab-btn');
            if (cible) cible.focus();
        }
        retourFocus = null;
    }

    // Les bornes de la carte, MESURÉES à chaque geste (repris de WPEU et WRP) : jamais sur le volet
    // gauche de WME, jamais sur le pied de page, et jamais sur la colonne de boutons de droite.
    // WME Studio, mode flottant : l'en-tête n'est plus une barre au-dessus de la carte, c'est un îlot posé
    // dessus, que l'éditeur peut déplacer. On le mesure pour que la fenêtre ne le recouvre pas (bouton
    // « Enregistrer » compris). Sans Studio, ou en mode Standard, les bornes ne changent pas.
    function sousEnteteStudio(z) {
        if (document.documentElement.dataset.wmeStudioCompact !== 'on') return z;
        const t = document.getElementById('app-head');
        const r = t && t.getBoundingClientRect();
        if (!r || !r.width || !r.height || r.right <= z.gauche || r.left >= z.droite) return z;
        if (r.top + r.height / 2 < window.innerHeight / 2) z.haut = Math.max(z.haut, Math.round(r.bottom) + 6);
        else z.bas = Math.min(z.bas, Math.round(r.top) - 6);
        return z;
    }
    function bornesCarte() {
        const carte = document.getElementById('WazeMap') || document.querySelector('.olMapViewport');
        const pied = document.querySelector('.wz-map-ol-footer');
        const btns = document.querySelector('.overlay-buttons-container.top') || document.querySelector('.overlay-buttons-container');
        const r = carte ? carte.getBoundingClientRect() : { left: 0, top: 40, right: window.innerWidth, bottom: window.innerHeight };
        const rb = btns ? btns.getBoundingClientRect() : null;
        return sousEnteteStudio({
            gauche: Math.round(r.left) + 6,
            haut: Math.round(r.top) + 6,
            droite: Math.round(rb && rb.width ? rb.left - 8 : r.right - 8),
            bas: Math.round(pied ? pied.getBoundingClientRect().top - 6 : r.bottom - 6),
        });
    }
    function bornerFenetre(g, z) {
        const dispoL = z.droite - z.gauche, dispoH = z.bas - z.haut;
        const w = Math.min(Math.max(Math.min(g.w, dispoL), 300), dispoL);
        const h = Math.min(Math.max(Math.min(g.h, dispoH), 220), dispoH);
        return { x: Math.max(z.gauche, Math.min(g.x, z.droite - w)), y: Math.max(z.haut, Math.min(g.y, z.bas - h)), w, h };
    }
    // Repliée, la fenêtre garde sa hauteur dépliée de côté (`data-h`) : la déplacer ne doit pas la
    // ramener, une fois dépliée, à la hauteur du seul en-tête.
    const replie = () => ovEl.classList.contains('replie');
    const poser = g => {
        Object.assign(ovEl.style, { left: g.x + 'px', top: g.y + 'px', width: g.w + 'px' });
        if (replie()) { if (!ovEl.dataset.h) ovEl.dataset.h = String(g.h); }
        else ovEl.style.height = g.h + 'px';
    };
    function placerFenetre(memo) {
        const z = bornesCarte();
        poser(bornerFenetre(memo || { x: z.droite - 520, y: z.haut, w: 520, h: z.bas - z.haut }, z));
    }
    const memoriserGeometrie = () => {
        const r = ovEl.getBoundingClientRect(), h = replie() ? Number(ovEl.dataset.h) || r.height : r.height;
        try { localStorage.setItem(GEOM_KEY, JSON.stringify({ x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(h) })); } catch (e) { }
    };
    // Réduire / déplier (28/09) : repliée, il reste l'en-tête et, pendant un
    // passage, la ligne d'avancement et la barre — on suit un département sans cacher la carte.
    // L'état est gardé d'un chargement à l'autre, comme la géométrie.
    function majRepli() {
        ovEl.classList.toggle('replie', !!opts.replie);
        const b = $('[data-act="replier"]'), tip = t(opts.replie ? 'unfoldTip' : 'foldTip');
        b.innerHTML = opts.replie ? '+' : '&#x2212;';
        b.title = tip;
        b.setAttribute('aria-label', tip);
        b.setAttribute('aria-expanded', String(!opts.replie));
    }
    function basculerRepli(v) {
        if (v === !!opts.replie) return;
        const r = ovEl.getBoundingClientRect();
        if (v) ovEl.dataset.h = String(Math.round(r.height));
        opts.replie = v;
        ecrireOpts();
        majRepli();
        if (!v) {
            // Dépliée là où elle a été posée repliée : la hauteur d'avant, bornée à la carte.
            placerFenetre({ x: r.left, y: r.top, w: r.width, h: Number(ovEl.dataset.h) || r.height });
            delete ovEl.dataset.h;
        }
        memoriserGeometrie();
    }
    // Agrandir / rétablir d'un clic : déplacer et redimensionner ne se faisaient QU'EN GLISSANT
    // (WCAG 2.5.7, audit M23). Agrandie, la fenêtre prend toute la carte libre ; rétablie, sa place par défaut.
    function basculerTaille() {
        basculerRepli(false);
        const z = bornesCarte(), r = ovEl.getBoundingClientRect();
        const pleine = r.width >= (z.droite - z.gauche) - 4;
        placerFenetre(pleine ? null : { x: z.gauche, y: z.haut, w: z.droite - z.gauche, h: z.bas - z.haut });
        memoriserGeometrie();
    }
    function deplacable(el, poignee) {
        poignee.addEventListener('mousedown', e => {
            if (e.button !== 0 || e.target.closest('button')) return;
            e.preventDefault();
            const r = el.getBoundingClientRect(), ox = e.clientX - r.left, oy = e.clientY - r.top;
            const mv = ev => poser(bornerFenetre({ x: ev.clientX - ox, y: ev.clientY - oy, w: el.offsetWidth, h: el.offsetHeight }, bornesCarte()));
            const up = () => { document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up); memoriserGeometrie(); };
            document.addEventListener('mousemove', mv); document.addEventListener('mouseup', up);
        });
        poignee.addEventListener('dblclick', e => {
            if (e.target.closest('button')) return;
            try { localStorage.removeItem(GEOM_KEY); } catch (er) { }
            placerFenetre(null);
        });
    }
    function redimensionnable(el, poignee) {
        poignee.addEventListener('mousedown', e => {
            e.preventDefault(); e.stopPropagation();
            const r = el.getBoundingClientRect(), x0 = e.clientX, y0 = e.clientY;
            const mv = ev => {
                const z = bornesCarte();
                const w = Math.max(300, Math.min(r.width + ev.clientX - x0, z.droite - r.left));
                const h = Math.max(220, Math.min(r.height + ev.clientY - y0, z.bas - r.top));
                poser({ x: r.left, y: r.top, w, h });
            };
            const up = () => { document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up); memoriserGeometrie(); };
            document.addEventListener('mousemove', mv); document.addEventListener('mouseup', up);
        });
    }

    // =====================================================================
    //  Nouvelle version publiée — même mécanique que WCT, WJN, WRP et WDA
    // =====================================================================
    //  La pastille ne s'allume que sur une version PUBLIÉE strictement supérieure à celle qui tourne ;
    //  hors ligne, réponse illisible ou page absente, elle reste éteinte. On lit le .meta.js de
    //  GreasyFork (quelques centaines d'octets), au plus une fois par 24 h.

    const gmScript = () => (typeof GM_info !== 'undefined' && GM_info.script) || {};
    const URL_MAJ = gmScript().updateURL || 'https://update.greasyfork.org/scripts/600088/WME%20BAN%20Coverage.meta.js';
    const URL_INSTALLER = gmScript().downloadURL || 'https://update.greasyfork.org/scripts/600088/WME%20BAN%20Coverage.user.js';
    const VER_RE = /^\d+(\.\d+)*$/;
    const MAJ_KEY = 'wbc.maj.v1', MAJ_DELAI = 864e5;
    let majEnLigne = null;
    // Segment par segment, en nombres : en chaînes, « 0.9.00 » passerait pour plus récent que « 0.14.00 ».
    const majCmp = (a, b) => {
        const pa = String(a).split('.'), pb = String(b).split('.');
        for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
            const x = Number(pa[i]) || 0, y = Number(pb[i]) || 0;
            if (x !== y) return x < y ? -1 : 1;
        }
        return 0;
    };
    function majRendre() {
        const e = document.getElementById('wbc-sb-maj');
        if (e) { e.hidden = !majEnLigne; if (majEnLigne) e.querySelector('span').textContent = t('majBtn', majEnLigne); }
    }
    function verifierMaj() {
        if (!VER_RE.test(VERSION) || typeof GM_xmlhttpRequest !== 'function') return;
        let memo = null;
        try { memo = JSON.parse(localStorage.getItem(MAJ_KEY) || 'null'); } catch (e) { }
        if (memo && Date.now() - memo.t < MAJ_DELAI) {
            if (memo.v && VER_RE.test(memo.v) && majCmp(VERSION, memo.v) < 0) { majEnLigne = memo.v; majRendre(); }
            return;
        }
        const retenir = v => { try { localStorage.setItem(MAJ_KEY, JSON.stringify({ t: Date.now(), v })); } catch (e) { } };
        GM_xmlhttpRequest({
            method: 'GET', url: URL_MAJ, timeout: 10000, nocache: true,
            onload: r => {
                // onload vient AUSSI sur un 404 : la page d'erreur ne doit pas être lue comme un script.
                if (r.status < 200 || r.status >= 300) { retenir(null); return; }
                const m = (r.responseText || '').match(/^\/\/\s*@version\s+(\S+)/m);
                retenir(m && VER_RE.test(m[1]) ? m[1] : null);
                if (!m || !VER_RE.test(m[1]) || majCmp(VERSION, m[1]) >= 0) return;
                majEnLigne = m[1];
                majRendre();
                log('nouvelle version publiée : ' + m[1] + ' (installée : ' + VERSION + ')');
            },
            onerror: () => { }, ontimeout: () => { },
        });
    }

    // =====================================================================
    //  Onglet Scripts
    // =====================================================================

    const AIDE = [
        { id: 'what', t: 'hWhatT', b: 'hWhatB' },
        { id: 'match', t: 'hMatchT', b: 'hMatchB' },
        { id: 'names', t: 'hNamesT', b: 'hNamesB' },
        { id: 'track', t: 'hTrackT', b: 'hTrackB' },
        // Réservée aux L6 : montrée quand le droit est lu (voir lireDroitHn).
        { id: 'hn', t: 'hHnT', b: 'hHnB', l6: true },
        { id: 'memo', t: 'hMemoT', b: 'hMemoB' },
        { id: 'limits', t: 'hLimitsT', b: 'hLimitsB' },
    ];

    function liensPied() {
        const l = [];
        if (URL_DISCUSS) l.push('&#x1F4AC; <a href="' + URL_DISCUSS + '" target="_blank" rel="noopener">' + esc(t('lnkDiscuss')) + '</a>');
        if (URL_GF) l.push('&#x1F517; <a href="' + URL_GF + '" target="_blank" rel="noopener">GreasyFork</a>');
        if (URL_GH) l.push('<a href="' + URL_GH + '" target="_blank" rel="noopener">GitHub</a>');
        return l.join(' &nbsp;&#xB7;&nbsp; ');
    }

    const construireOnglet = () => `
<div id="wbc-sidebar" dir="${_lang === 'he' ? 'rtl' : 'ltr'}">
    <h2><span class="wbc-sb-ico">${icone(18)}</span>${SCRIPT_NAME} <span class="wbc-sb-ver">v${esc(VERSION)}</span></h2>
    <p class="wbc-sb-maj" id="wbc-sb-maj" hidden><span></span> <a href="#" id="wbc-maj">${t('majInstall')}</a></p>
    <p class="wbc-sb-hint">${esc(t('sbHint'))}</p>
    <p style="margin:10px 0 0"><button type="button" class="wbc-btn wbc-btn-primary" id="wbc-ouvrir" title="${esc(t('tipSbOpen'))}">${esc(t('sbOpen'))}</button></p>
    <div class="wbc-sb-sec">&#x1F5FA;&#xFE0F; ${esc(t('sbMap'))}</div>
    <div class="wbc-toggle-row wbc-sb-ligne"><label class="wbc-toggle-lbl" for="wbc-survol">${esc(t('sbHover'))}</label>
        <label class="wbc-toggle"><input type="checkbox" id="wbc-survol"${opts.survol ? ' checked' : ''}><span class="wbc-toggle-slider"></span></label></div>
    <p class="wbc-sb-hint">${esc(t('sbHoverHint'))}</p>
    <p class="wbc-sb-lbl">${esc(t('sbColors'))}</p>
    <div class="wbc-couleurs">
        ${['manquant', 'present', 'trop', 'carte'].map(e => `<label class="wbc-couleur"><input type="color" data-couleur="${e}" value="${couleur(e)}" title="${esc(t(e === 'carte' ? 'tipColMap' : 'tipColPoint'))}"> ${esc(t(e === 'manquant' ? 'legMiss' : e === 'present' ? 'legFound' : e === 'trop' ? 'legExtra' : 'legColMap'))}</label>`).join('')}
    </div>
    <p style="margin:6px 0 0"><button type="button" class="wbc-btn wbc-btn-neutral" id="wbc-couleurs-def" title="${esc(t('tipColorsReset'))}">${esc(t('sbColorsReset'))}</button></p>
    <div class="wbc-sb-sec">&#x1F4BE; ${esc(t('secMemo'))}</div>
    <p class="wbc-sb-hint">${esc(t('memoHint'))}</p>
    <div id="wbc-memo-onglet"></div>
    <div class="wbc-sb-sec">&#x2753; ${esc(t('sbHelp'))}</div>
    ${AIDE.map((s, i) => `
    <div class="wbc-help-section"${s.l6 ? ' data-l6' + (droitHn ? '' : ' hidden') : ''}>
        <button type="button" class="wbc-help-hdr${i === 0 ? ' on' : ''}" data-aide="${s.id}" aria-expanded="${i === 0}" title="${esc(t('tipHelpHdr'))}">${esc(t(s.t))} <span>${i === 0 ? '&#x25BC;' : '&#x25B6;'}</span></button>
        <div class="wbc-help-body" data-corps="${s.id}"${i === 0 ? '' : ' hidden'}>${t(s.b)}</div>
    </div>`).join('')}
    <div class="wbc-sb-links"${liensPied() ? '' : ' hidden'}>${liensPied()}</div>
    <p class="wbc-sb-foot">&#x1F512; ${esc(t('hSafeB'))}</p>
</div>`;

    async function poserOnglet() {
        try {
            const res = await sdk.Sidebar.registerScriptTab();
            res.tabLabel.innerHTML = '<span style="display:inline-flex;vertical-align:middle">' + icone(20) + '</span>';
            res.tabLabel.title = SCRIPT_NAME;
            res.tabLabel.setAttribute('aria-label', SCRIPT_NAME);
            res.tabPane.innerHTML = construireOnglet();
            majRendre();
            // Réglages de la carte : fiche au survol, couleurs des points. Une couleur changée redessine
            // le calque et la légende de la fenêtre, sans recalcul.
            const appliquerCouleurs = () => { ecrireOpts(); majCalque(); majCommunes(); if (resultat || resDep) rendre(); };
            res.tabPane.addEventListener('change', ev => {
                if (ev.target.id === 'wbc-survol') { opts.survol = ev.target.checked; ecrireOpts(); if (!opts.survol) cacherFiche(); }
            });
            // « input » et non « change » : la carte suit le sélecteur de couleur pendant qu'on le règle.
            res.tabPane.addEventListener('input', ev => {
                const e = ev.target.dataset && ev.target.dataset.couleur;
                if (!e || !HEX_RE.test(ev.target.value)) return;
                opts.couleurs = Object.assign({}, opts.couleurs, { [e]: ev.target.value });
                appliquerCouleurs();
            });
            res.tabPane.querySelector('#wbc-couleurs-def').addEventListener('click', () => {
                opts.couleurs = {};
                res.tabPane.querySelectorAll('[data-couleur]').forEach(i => { i.value = couleur(i.dataset.couleur); });
                appliquerCouleurs();
            });
            ongletMemo = res.tabPane.querySelector('#wbc-memo-onglet');
            majMemoOnglet();
            res.tabPane.addEventListener('click', async ev => {
                if (await surClicMemoOnglet(ev)) return;
                if (ev.target.closest('#wbc-maj')) { ev.preventDefault(); window.open(URL_INSTALLER, '_blank', 'noopener'); return; }
                if (ev.target.closest('#wbc-ouvrir')) { ouvrirFenetre(true); return; }
                const h = ev.target.closest('[data-aide]');
                if (!h) return;
                const corps = res.tabPane.querySelector('[data-corps="' + h.getAttribute('data-aide') + '"]');
                const ouvrir = corps.hidden;
                corps.hidden = !ouvrir;
                h.classList.toggle('on', ouvrir);
                h.setAttribute('aria-expanded', String(ouvrir));
                h.querySelector('span').innerHTML = ouvrir ? '&#x25BC;' : '&#x25B6;';
            });
        } catch (e) { log('onglet : ' + e.message); }
    }

    // =====================================================================
    //  INIT
    // =====================================================================

    // ─── VERSION MINIMALE ET INTÉGRITÉ (11/10/2026 ; repris de WJN 0.06.09) ───────
    // Au démarrage, le script lit version-min.json à la racine de son dépôt GitHub. Il NE DÉMARRE PAS :
    //  - si sa version est plus ancienne que `min` (version retirée après une correction) ;
    //  - si son code ne correspond pas à l'empreinte publiée pour sa version (`empreintes`) — copie
    //    modifiée ou abîmée. L'empreinte est un SHA-256 du texte de l'enveloppe _wmeIntegre (fins de
    //    ligne LF), tel que le navigateur l'a chargé : l'en-tête, que GreasyFork réécrit, n'en fait pas partie ;
    //  - si sa version n'est pas publiée (absente de `empreintes`) — sauf pour le mainteneur du script, qui essaie ses
    //    versions avant de les publier.
    // Fichier injoignable ou illisible : le script démarre (une panne de GitHub ne doit pas paralyser
    // les éditeurs). Une version non numérique (copie de travail) n'est jamais déclarée retirée.
    // ⚠️ Tout cela tourne dans le navigateur : il arrête la copie périmée ou bricolée, pas celui qui
    // retire ces lignes ; la vraie barrière reste côté Waze.
    // L'empreinte de la version à publier se calcule avec tools/empreinte.js (même calcul qu'ici).
    const _VM_URL = 'https://raw.githubusercontent.com/DrSlump34/WME-BAN-Coverage/master/version-min.json';
    const _VM_MAJ = 'https://greasyfork.org/scripts/600088';
    const _vmCmp = (a, b) => {
        const x = String(a).split('.').map(Number), y = String(b).split('.').map(Number);
        for (let i = 0; i < Math.max(x.length, y.length); i++) { const d = (x[i] || 0) - (y[i] || 0); if (d) return d < 0 ? -1 : 1; }
        return 0;
    };
    const _vmJson = () => new Promise(res => {
        setTimeout(() => res(null), 7000);   // gestionnaire de scripts qui ne rappelle jamais : on démarre
        try {
            GM_xmlhttpRequest({ method: 'GET', url: _VM_URL + '?t=' + Date.now(), timeout: 6000,
                onload: r => { try { res(r.status === 200 ? JSON.parse(r.responseText) : null); } catch (e) { res(null); } },
                onerror: () => res(null), ontimeout: () => res(null) });
        } catch (e) { res(null); }
    });
    const _vmHx = t => { let x = 0x811c9dc5; for (let i = 0; i < t.length; i++) { x ^= t.charCodeAt(i); x = Math.imul(x, 0x01000193) >>> 0; } return x >>> 0; };
    // Le mainteneur du script essaie ses versions avant de les publier. ⚠️ Le contrôle tourne au DÉBUT du démarrage, souvent
    // AVANT que WME ait chargé le profil : getUserInfo() rend alors un pseudo vide (mesuré le 11/10/2026 —
    // une version non publiée bloquée chez le mainteneur). On attend donc le pseudo jusqu'à 10 s, puis on essaie
    // la session Discuss (même site, mêmes cookies).
    const _vmAuteur = async () => {
        const estAuteur = n => !!n && _vmHx(String(n).toLowerCase()) === 0xc0bef069;
        try {
            const w = (typeof unsafeWindow !== 'undefined' && unsafeWindow.getWmeSdk) ? unsafeWindow : window;
            const sdkVm = w.getWmeSdk({ scriptId: 'wme-ban-coverage-vm', scriptName: String(SCRIPT_NAME) + ' (version)' });
            for (let i = 0; i < 20; i++) {
                let u = null;
                try { u = await sdkVm.State.getUserInfo(); } catch (e) { u = null; }
                if (u && u.userName) return estAuteur(u.userName);
                await new Promise(r => setTimeout(r, 500));
            }
        } catch (e) { /* SDK indisponible : on tente Discuss */ }
        try {
            const w = (typeof unsafeWindow !== 'undefined' && unsafeWindow.fetch) ? unsafeWindow : window;
            const r = await w.fetch('/discuss/session/current.json', { credentials: 'same-origin' });
            const j = r.ok ? await r.json() : null;
            return estAuteur(j && j.current_user && j.current_user.username);
        } catch (e) { return false; }
    };
    const _vmEmpreinte = async src => {
        const t = String(src).replace(/\r\n/g, '\n').split('\n').filter(l => !/^\/\/ @(downloadURL|updateURL)\b/.test(l)).join('\n');
        const h = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t));
        return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, '0')).join('');
    };
    // Rend null (démarrer) ou le motif du refus : 'retiree', 'modifiee', 'inconnue'.
    // L'empreinte calculée est écrite dans la console : c'est le contrôle à faire au moment de publier (voir tools/empreinte.js).
    const _vmVerdict = async () => {
        // Le texte de l'enveloppe du script, tel que le navigateur l'a chargé (indépendant du gestionnaire).
        const src = (() => { try { return _wmeIntegre.toString(); } catch (e) { return ''; } })();
        let h = '';
        if (typeof src === 'string' && src.length) {
            try { h = await _vmEmpreinte(src); console.info('[' + String(SCRIPT_NAME) + ' v' + String(VERSION) + '] empreinte ' + h); } catch (e) { h = ''; }
        }
        // Lisible depuis la page (les journaux d'un script Tampermonkey n'y arrivent pas) : l'empreinte, ou 'sans-source'.
        try { document.documentElement.setAttribute('data-vm-' + _vmHx(_VM_URL).toString(36), h || 'sans-source'); } catch (e) { }
        const j = await _vmJson();
        if (!j || typeof j !== 'object') return null;
        const v = String(VERSION), num = /^\d+(\.\d+)*$/;
        if (num.test(v) && typeof j.min === 'string' && num.test(j.min) && _vmCmp(v, j.min) < 0) return { motif: 'retiree', min: j.min };
        if (!j.empreintes || typeof j.empreintes !== 'object') return null;
        const attendue = j.empreintes[v];
        if (!attendue) return (await _vmAuteur()) ? null : { motif: 'inconnue' };
        if (typeof src !== 'string' || !src.length) return null;
        if (!h) return null;
        return h === String(attendue).toLowerCase() ? null : { motif: 'modifiee' };
    };
    // Les 8 langues du script, sous les mêmes clés que DICO ; la langue est celle de detectLang().
    const _vmBandeau = j => {
        const ident = 'vm-' + _vmHx(_VM_URL).toString(36);
        if (document.getElementById(ident)) return;
        const l = (() => { try { return detectLang(); } catch (e) { return 'en'; } })();
        const n = String(SCRIPT_NAME), v = String(VERSION), m = j.min;
        const T = {
            en: { retiree: `${n} v${v} has been withdrawn: a fixed version is published (v${m} or later). The script will not start until it is updated (Tampermonkey ▸ Check for updates).`,
                  modifiee: `${n} v${v} does not match the published code (modified or damaged copy). The script will not start: reinstall it from its official page.`,
                  inconnue: `${n} v${v} is not a published version. The script will not start: install it from its official page.`,
                  maj: 'Update', page: 'Official page' },
            fr: { retiree: `${n} v${v} est retirée\u00a0: une version corrigée est publiée (v${m} ou plus récente). Le script ne démarre pas tant qu’il n’est pas mis à jour (Tampermonkey ▸ Rechercher des mises à jour).`,
                  modifiee: `${n} v${v} ne correspond pas au code publié (copie modifiée ou abîmée). Le script ne démarre pas\u00a0: réinstallez-le depuis sa page officielle.`,
                  inconnue: `${n} v${v} n’est pas une version publiée. Le script ne démarre pas\u00a0: installez-le depuis sa page officielle.`,
                  maj: 'Mettre à jour', page: 'Page officielle' },
            de: { retiree: `${n} v${v} wurde zurückgezogen: eine korrigierte Version ist veröffentlicht (v${m} oder neuer). Das Skript startet erst nach dem Update (Tampermonkey ▸ Nach Updates suchen).`,
                  modifiee: `${n} v${v} entspricht nicht dem veröffentlichten Code (veränderte oder beschädigte Kopie). Das Skript startet nicht: von der offiziellen Seite neu installieren.`,
                  inconnue: `${n} v${v} ist keine veröffentlichte Version. Das Skript startet nicht: von der offiziellen Seite installieren.`,
                  maj: 'Aktualisieren', page: 'Offizielle Seite' },
            es: { retiree: `${n} v${v} ha sido retirada: hay una versión corregida publicada (v${m} o posterior). El script no se inicia hasta que se actualice (Tampermonkey ▸ Buscar actualizaciones).`,
                  modifiee: `${n} v${v} no coincide con el código publicado (copia modificada o dañada). El script no se inicia: reinstálalo desde su página oficial.`,
                  inconnue: `${n} v${v} no es una versión publicada. El script no se inicia: instálalo desde su página oficial.`,
                  maj: 'Actualizar', page: 'Página oficial' },
            it: { retiree: `${n} v${v} è stata ritirata: è pubblicata una versione corretta (v${m} o successiva). Lo script non si avvia finché non viene aggiornato (Tampermonkey ▸ Cerca aggiornamenti).`,
                  modifiee: `${n} v${v} non corrisponde al codice pubblicato (copia modificata o danneggiata). Lo script non si avvia: reinstallalo dalla sua pagina ufficiale.`,
                  inconnue: `${n} v${v} non è una versione pubblicata. Lo script non si avvia: installalo dalla sua pagina ufficiale.`,
                  maj: 'Aggiorna', page: 'Pagina ufficiale' },
            'pt-BR': { retiree: `${n} v${v} foi retirada: há uma versão corrigida publicada (v${m} ou mais recente). O script não inicia até ser atualizado (Tampermonkey ▸ Verificar atualizações).`,
                  modifiee: `${n} v${v} não corresponde ao código publicado (cópia modificada ou danificada). O script não inicia: reinstale-o pela página oficial.`,
                  inconnue: `${n} v${v} não é uma versão publicada. O script não inicia: instale-o pela página oficial.`,
                  maj: 'Atualizar', page: 'Página oficial' },
            'pt-PT': { retiree: `${n} v${v} foi retirada: há uma versão corrigida publicada (v${m} ou mais recente). O script não arranca enquanto não for atualizado (Tampermonkey ▸ Procurar atualizações).`,
                  modifiee: `${n} v${v} não corresponde ao código publicado (cópia modificada ou danificada). O script não arranca: reinstale-o a partir da página oficial.`,
                  inconnue: `${n} v${v} não é uma versão publicada. O script não arranca: instale-o a partir da página oficial.`,
                  maj: 'Atualizar', page: 'Página oficial' },
            he: { retiree: `${n} v${v} הוסרה: פורסמה גרסה מתוקנת (v${m} ומעלה). הסקריפט לא יופעל עד שיעודכן (Tampermonkey ▸ חיפוש עדכונים).`,
                  modifiee: `${n} v${v} אינו תואם לקוד שפורסם (עותק ששונה או נפגם). הסקריפט לא יופעל: התקינו אותו מחדש מהדף הרשמי.`,
                  inconnue: `${n} v${v} אינה גרסה שפורסמה. הסקריפט לא יופעל: התקינו אותו מהדף הרשמי.`,
                  maj: 'עדכון', page: 'הדף הרשמי' },
        };
        const L = T[l] || T.en;
        const d = document.createElement('div');
        d.id = ident;
        d.dir = l === 'he' ? 'rtl' : 'ltr';
        d.setAttribute('role', 'alert');
        d.style.cssText = 'position:fixed;top:56px;left:50%;transform:translateX(-50%);z-index:100000;max-width:560px;padding:10px 14px;' +
            'background:#ffebee;color:#b71c1c;border:1px solid #c62828;border-radius:8px;font:600 12px/1.5 Rubik,Arial,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.25)';
        const p = document.createElement('div'); p.textContent = L[j.motif] || L.inconnue; d.appendChild(p);
        const a = document.createElement('a'); a.href = _VM_MAJ; a.target = '_blank'; a.rel = 'noopener';
        a.textContent = (j.motif === 'retiree' ? L.maj : L.page) + ' ↗';
        a.style.cssText = 'display:inline-block;margin-top:6px;padding:3px 10px;border-radius:50px;background:#c62828;color:#fff;text-decoration:none';
        const x = document.createElement('button'); x.type = 'button'; x.textContent = '×'; x.setAttribute('aria-label', 'OK');
        x.style.cssText = 'position:absolute;top:2px;inset-inline-end:6px;border:0;background:none;color:#b71c1c;font-size:16px;cursor:pointer';
        x.onclick = () => d.remove();
        d.appendChild(a); d.appendChild(x);
        (document.body || document.documentElement).appendChild(d);
    };
    // Vrai si le script ne doit pas démarrer : le bandeau est posé, et l'appelant s'arrête.
    const _vmBloque = async () => { const j = await _vmVerdict(); if (j) { _vmBandeau(j); return true; } return false; };
    const init = async () => {
        if (await _vmBloque()) return;   // version retirée, copie modifiée ou non publiée : bandeau, rien d’autre
        if (pw.__WBC_LOADED) return;
        pw.__WBC_LOADED = true;

        sdk = pw.getWmeSdk({ scriptId: SCRIPT_ID, scriptName: SCRIPT_NAME, mode: 'async' });
        _lang = detectLang();
        opts = lireOpts();

        const st = document.createElement('style');
        st.textContent = CSS;
        document.head.appendChild(st);

        await poserCalqueCommunes();
        await poserCalque();
        await poserCaseCalque();
        await brancherSurvol();
        construireFenetre();
        poserOnglet();
        poserFab();
        setInterval(poserFab, 2000);
        setInterval(() => {
            if (!ovEl || !ovEl.classList.contains('open')) return;
            const p = document.querySelector('.save-popover-container');
            const vu = !!p && [...p.children].some(c => c.getBoundingClientRect().height > 0);
            ovEl.classList.toggle('wbc-sous', vu);
        }, 500);
        verifierMaj();
        // Depuis 0.13.05, WBC démarre AVANT que WME connaisse l'éditeur (mesuré le 11/10 : WBC à 3,9 s, rang
        // connu à 5,2 s) : les droits lus à ce moment étaient refusés pour toute la session (ni « Ajouter » ni
        // « Copier »). On attend le pseudo et le rang, une minute au plus.
        const attendreEditeur = async () => {
            for (let k = 0; k < 120; k++) { const p = await _hp(); if (p.n >= 0 && p.nom) return; await new Promise(r => setTimeout(r, 500)); }
        };
        const editeurConnu = attendreEditeur();
        editeurConnu.then(lireDroitChamp).then(v => { droitChamp = v; if (v) rendre(); });
        editeurConnu.then(lireDroitHn).then(v => {
            droitHn = v;
            if (!v) return;
            document.querySelectorAll('#wbc-sidebar [data-l6]').forEach(e => { e.hidden = false; });
            rendre();
            lancerRapprochement(false);
            try { sdk.Events.on({ eventName: 'wme-save-finished', eventHandler: r => { if (r && r.success) lancerRapprochement(true); } }); }
            catch (e) { log('événement d\'enregistrement : ' + e.message); }
        });
        try { sdk.Events.on({ eventName: 'wme-map-move-end', eventHandler: () => { if (calqueSuitLaVue) majCalque(); } }); }
        catch (e) { log('événement de déplacement : ' + e.message); }
        log('v' + VERSION + ' prêt — langue ' + _lang);
    };

    const demarrer = () => { init().catch(e => log('démarrage : ' + e.message)); };
    // Démarrage dès que le SDK est prêt, à TOUS les zooms (comme WNA et WZM) : « wme-ready » n'arrive qu'à un zoom
    // éditable (≥ 12), et le script — son bouton de carte compris — restait absent tant qu'on regardait la carte de
    // loin (04/10/2026). Garde : wme-initialized et wme-ready peuvent arriver tous les deux.
    (() => {
        let lance = false;
        const go = () => { if (lance) return; lance = true; clearInterval(minuterie); Promise.resolve(pw.SDK_INITIALIZED).then(demarrer); };
        const pret = () => !!(pw.SDK_INITIALIZED || (pw.W && pw.W.userscripts && pw.W.userscripts.state && pw.W.userscripts.state.isReady));
        const minuterie = setInterval(() => { if (pret()) go(); }, 300);
        if (pret()) go();
        document.addEventListener('wme-initialized', go, { once: true });
        document.addEventListener('wme-ready', go, { once: true });
    })();

})();
