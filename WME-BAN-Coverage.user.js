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
// @version      0.28.01
// @description  Compare the French national address base (BAN) with the house numbers and residential places of WME, for a commune or a whole département: figures, statistics, and a street-by-street inventory. Computed live; scans are kept in your browser only, and flagged when the BAN or WME changed since.
// @description:fr Compare la Base Adresse Nationale (BAN) aux numéros et aux points résidentiels de WME, pour une commune ou un département entier : chiffres, statistiques et état des lieux voie par voie. Calculé en direct ; les balayages restent dans votre navigateur, signalés quand la BAN ou WME a changé depuis.
// @description:de Vergleicht die französische Adressdatenbank (BAN) mit den Hausnummern und Wohnorten im WME, für eine Gemeinde oder ein ganzes Département: Zahlen, Statistiken und Bestandsaufnahme Straße für Straße. Live berechnet; die Scans bleiben nur in Ihrem Browser und werden markiert, wenn sich BAN oder WME seitdem geändert haben.
// @description:es Compara la base nacional de direcciones francesa (BAN) con los números y los puntos residenciales de WME, para un municipio o un departamento entero: cifras, estadísticas e inventario calle por calle. Calculado en directo; los barridos se quedan solo en su navegador y se señalan cuando la BAN o WME han cambiado desde entonces.
// @description:it Confronta la base nazionale degli indirizzi francese (BAN) con i numeri civici e i punti residenziali di WME, per un comune o un intero dipartimento: cifre, statistiche e inventario via per via. Calcolato dal vivo; le scansioni restano solo nel tuo browser e sono segnalate quando la BAN o WME sono cambiati da allora.
// @description:pt-BR Compara a base nacional de endereços francesa (BAN) com os números e os pontos residenciais do WME, para um município ou um departamento inteiro: números, estatísticas e inventário rua a rua. Calculado ao vivo; as varreduras ficam somente no seu navegador e são sinalizadas quando a BAN ou o WME mudaram desde então.
// @description:pt Compara a base nacional de moradas francesa (BAN) com os números de porta e os pontos residenciais do WME, para um município ou um departamento inteiro: números, estatísticas e inventário rua a rua. Calculado em direto; os varrimentos ficam apenas no seu navegador e são assinalados quando a BAN ou o WME mudaram desde então.
// @description:he משווה את מאגר הכתובות הלאומי של צרפת (BAN) למספרי הבתים ולנקודות המגורים ב-WME, עבור רשות מקומית או מחוז שלם: מספרים, סטטיסטיקות ומצב קיים רחוב אחר רחוב. מחושב בזמן אמת; הסריקות נשמרות בדפדפן שלך בלבד ומסומנות כאשר ה-BAN או WME השתנו מאז.
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
// @connect      data.geopf.fr
// @connect      api-signalement-prod.osc-secnum-fr1.scalingo.io
// @connect      update.greasyfork.org
// @connect      raw.githubusercontent.com
// @run-at       document-idle
// ==/UserScript==

// La BAN est le référentiel. Rien n'est envoyé ailleurs que vers les sources lues (BAN, Géoplateforme, geo.api.gouv.fr, signalements BAN) ;
// la carte n'est modifiée que sur geste de l'éditeur (le « + » d'une adresse : tout rang ; voie entière, ⇄ et numéro → RPP :
// L6), jamais enregistrée par le script : l'éditeur enregistre avec WME.

(function _wmeIntegre() {
    'use strict';

    // Tampermonkey fait passer chaque lecture de global par un Proxy (lent en boucle chaude) : liés ici en variables locales.
    const Math = globalThis.Math, Number = globalThis.Number, Date = globalThis.Date;

    const SCRIPT_ID = 'wme-ban-coverage';
    const SCRIPT_NAME = 'WME BAN Coverage';
    const VERSION = (typeof GM_info !== 'undefined' && GM_info.script && GM_info.script.version) || 'dev';
    const URL_GF = 'https://greasyfork.org/scripts/600088-wme-ban-coverage';
    const URL_DISCUSS = '';
    const URL_GH = 'https://github.com/DrSlump34/WME-BAN-Coverage';
    const LAYER = 'wbc-adresses';
    const GEOM_KEY = 'wbc.fenetre';
    const OPTS_KEY = 'wbc.opts';

    // Au-delà de ~0,08° de côté, WME rend une zone ALLÉGÉE sans le dire : carreaux de 0,05° sur une grille fixe, réutilisables d'une commune à l'autre.
    const CARREAU = 0.05;
    const CARREAUX_GARDES = 48;
    const PARALLELE = 3;
    const ROAD_TYPES = '1,2,3,4,5,6,7,8,9,10,15,16,17,18,19,20,22';

    const pw = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;

    // Icône sans identifiant interne : plusieurs copies ne se gênent pas.
    const icone = h => '<svg xmlns="http://www.w3.org/2000/svg" width="' + h + '" height="' + h + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M12 2.5 L2 11 H5 V21 H19 V11 H22 Z" fill="#ef6c00" stroke="#ef6c00" stroke-width="1.2" stroke-linejoin="round"/><rect x="6.5" y="13.5" width="4" height="7.5" fill="#fff"/><circle cx="17.5" cy="17.5" r="6" fill="#2e7d32" stroke="#fff" stroke-width="1.6"/><path d="M14.6 17.6 L16.8 19.8 L20.4 15.6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    let sdk = null;
    const log = m => console.log('[WBC] ' + m);
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));


    // Pluriels : n arrive formaté (« 1 234 ») ; en français 0 et 1 sont au singulier, ailleurs seul 1.
    const chiffres = n => String(n).replace(/[^0-9]/g, '');
    const un = n => chiffres(n) === '0' || chiffres(n) === '1';
    const un1 = n => chiffres(n) === '1';

    const DICO = {
        en: {
            sbHint: 'Compares the national address base (BAN) with the house numbers and residential places (RPP) of WME, for a commune or a whole département.',
            sbOpen: 'Open the window',
            sbHelp: 'Help',
            hWhatT: 'What is compared',
            hWhatB: "<p>The <b>BAN</b> is the reference: every address it lists should exist in WME, either as a house number on a segment (HN) or as a residential place (RPP).</p><p><b>Sources</b>, read live: the <b>Base Adresse Nationale</b> (adresse.data.gouv.fr, French State; Licence Ouverte Etalab 2.0; the revision date of each commune is shown); the commune boundaries and lists of <b>geo.api.gouv.fr</b> (Découpage administratif API, INSEE and IGN data, Licence Ouverte Etalab 2.0); the public <b>BAN reports API</b> (signalement.adresse.data.gouv.fr) for the state of reports; and WME from the same servers as the editor. The area does not need to be displayed or loaded. Since 12/11/2026, Waze accredits the BAN for France (display and assisted creation of house numbers, Map Data Attribution page); adding a whole street stays an L6 gesture; one number at a time is open to all ranks; all under quota.</p><p><b>What leaves the browser</b>: to geo.api.gouv.fr, in “Map centre” mode, the map centre ROUNDED to 3 decimals (about 100 m), and your commune searches — no identity, no cookie; to the BAN and the reports API, the municipality code; at startup, GitHub (version-min.json, the minimum version: a withdrawn version does not start) and GreasyFork (new version) are only read. To data.geopf.fr (IGN Géoplateforme), with the WBC box of the Layers menu ticked: the extent of the view, from zoom 18, without cookie. Nothing else; your user name goes to no third party (only to Waze’s own Discuss, for the Copy button).</p><p><b>Report to the BAN</b>: opens the official tool (signalement.adresse.data.gouv.fr) in a new tab, on the street or the number; WBC sends nothing, you fill in and send the form. For a WME number the BAN lacks, the prefilled comment carries the address read in Waze (“Address present in Waze: …”): check, change or clear it before sending.</p><p><b>BAN of the view</b>: with the WBC box of the Layers menu ticked and no analysis shown there, the BAN addresses of the view appear from zoom 18, in grey (read only); circled in green when WME already has the same number on the same street or within 30 m (saved house numbers, residential places). <b>Ctrl+click</b> (Cmd+click on Mac) on the map button: the commune at the centre is analysed, or its recent scan reopened, and shown on the map without opening the window. While the WBC window is open, the WME layers “House numbers” and “Residential” are shown; closing it puts them back as they were.</p>",
            hMatchT: 'When is a number found',
            hMatchB: '<p>A BAN address is found when WME has the same number (suffixes included: <i>bis</i>, <i>ter</i>, letters) less than 150 m away, and:</p><table class="wbc-help-table"><tr><td>1</td><td>on a street with the same name (main or alternate name), or one that differs only by an article (“Avenue Sembrancher” = “Avenue de Sembrancher”; the name gap is still reported);</td></tr><tr><td>2</td><td>or on a segment that carries this street\'s addresses, <b>named or not</b>;</td></tr><tr><td>3</td><td>or less than 30 m from the address.</td></tr></table><p>Rule 1 is tried first everywhere, then 2, then 3. A WME number is used only once.</p>',
            hNamesT: 'The «\u00a0WME street\u00a0» column',
            hNamesB: '<table class="wbc-help-table"><tr><td>&#x2713;</td><td>the segments near the addresses carry the BAN name.</td></tr><tr><td><i>name</i></td><td>they carry another name: the name to check.</td></tr><tr><td><i>no name</i></td><td>they carry no name.</td></tr><tr><td><i>no segment</i></td><td>no segment less than 80 m from the addresses.</td></tr><tr><td>&#x2713; alt</td><td>the BAN name is carried as an <b>alternate</b> name; the main name is shown next to it.</td></tr><tr><td>road no.</td><td>the main name is a road number and the BAN name is missing from the alternate names: add it.</td></tr><tr><td>type</td><td>only the street type differs (Rue / Chemin…).</td></tr><tr><td>article · spelling · partial</td><td>close names: an article, a letter or two, or a shortened form. <i>missing from WME</i>: the street is not in WME, the name shown is the neighbouring one.</td></tr><tr><td>&#x2713; parking</td><td>no named segment, but a parking lot place nearby carries the BAN name: nothing to rename.</td></tr><tr><td>&#x2713; BAN spelling</td><td>same name but for a hyphen or a dot (“Rue Paul-Louis Courier” / “Rue Paul Louis Courier”): nothing to rename.</td></tr></table><p>A missing number shown in orange with <b>≠</b> exists in WME with another suffix (12 b / 12bis): to check. If WME only has the bare number (32 / 32 B), it is placed anyway and the warning stays.</p><p>&#x26A0; marks a BAN name that no segment of the commune carries.</p>',
            hLimitsT: 'Good to know',
            hLimitsB: "<p>A whole département takes a few minutes: the BAN is read commune by commune, WME in squares of about 5 km. The button Stop interrupts it; what is done stays displayed, and failed communes can be retried alone.</p><p>Paris, Marseille and Lyon are read district by district. Scans are kept in this browser only (IndexedDB), never elsewhere, with your preferences (area, switches, window position, point colours); they are flagged when the BAN or WME changed since.</p>",
            hSafeB: "The script changes the map only at an editor’s request: the “+” of one address (a number or an RPP, all ranks); and, for an L6, “Add the house numbers” (street by street: numbers, and RPP at the end of a driveway), “⇄” (one RPP replaced by a number) and “Turn this number into an RPP” — 500 per sliding hour at most, for each editor; it never saves. Its results stay in this browser.",
            remTitle: "You remain responsible for your edits",
            remBody: "<p>WME BAN Coverage <b>proposes</b>: it never saves anything by itself.</p><p>Each house number, RPP or “⇄” conversion reaches WME as a pending edit. Check it on the map, then save it or undo it in WME.</p><p>What you save is your edit, just as if you had made it by hand.</p>",
            remNote: "This reminder is shown once per browser; you can see it again from the script tab.",
            remOk: "I understand",
            remCancel: "Cancel",
            remLink: "See the responsibility reminder again",
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
            renomRelance: n => n + (n > 1 ? ' streets renamed in WME since the scan: the commune’s figures are up to date.' : ' street renamed in WME since the scan: the commune’s figures are up to date.'),
            renomNeuf: n => 'New segment in WME near ' + n + (n > 1 ? ' streets that had none: the commune’s figures are up to date.' : ' street that had none: the commune’s figures are up to date.'),
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
            filterClear: 'Clear the filter',
            filterCount: (n, m) => n + (un1(n) ? ' street of ' : ' streets of ') + m,
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
            sbRppNum: "RPP numbers",
            sbRppNumHint: "Writes its house number under the triangle of each residential place (RPP) loaded in WME, from zoom 17: no need to click it to know which one it is. Display only.",
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
            smallTip: "Small window (original size)",
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
            tipMemoOpen: "Open the window on this scan and fit the map to it.",
            tipMemoClear: "Delete every scan saved in this browser (two clicks).",
            tipSbOpen: "Open the WBC window (like the button on the right of the map).",
            tipColorsReset: "Reset the point colours to their defaults.",
            tipHelpHdr: "Expand or collapse this part of the help.",
            tipFab: "Open or close the window",
            dirZoom: n => 'BAN addresses: zoom in to level ' + n + ' or more',
            dirLoading: 'BAN addresses: reading…',
            dirNone: 'BAN addresses: none in the view',
            dirCount: n => n + (un1(n) ? ' BAN address in the view' : ' BAN addresses in the view'),
            dirCap: (n, m) => n + ' BAN addresses shown out of ' + m + ': zoom in to see them all',
            dirErr: m => 'BAN addresses: reading failed — ' + m,
            dirEdition: d => 'edition of ' + d,
            dirSource: 'Source: Base Adresse Nationale (adresse.data.gouv.fr), served by the IGN Géoplateforme — Licence Ouverte Etalab 2.0. Read only: nothing is written; untick WBC in the Layers menu to hide them.',
            dirFiche: 'BAN, view without analysis',
            dirWme: p => p + ' already in WME',
            dirFicheWme: 'Already in WME (same number, same street or within 30 m)',
            dirFicheAbs: 'Not among the numbers loaded in WME',
            tipFabCtrl: mac => (mac ? 'Cmd' : 'Ctrl') + '+click: show the BAN of the commune at the centre',
            fabBusy: 'Analysing the commune at the centre…',
            fabErr: m => 'Failed: ' + m,
            fabDeja: 'An analysis is already running.',
            tipVoie: "Expand the street (its numbers, missing ones in red) and fit the map to it.",
            tipCommune: "Open this municipality’s details and fit the map to it.",
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
            dejaRelaunchTip: "Runs the full analysis again.",
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
            ponctTag: "BAN spelling",
            tipOrtho: "Spelling differs by a letter or two",
            tipPonct: "The BAN does not spell this name correctly (hyphen, full stop…): the WME name is kept and house numbers are still added",
            partielTag: "partial",
            tipPartiel: "One name is a shortened form of the other",
            absentTag: "missing from WME",
            altTag: "alt",
            parkTag: "parking",
            tipPark: "No named segment: the BAN name is carried by the parking lot place nearby (parking lot roads stay unnamed).",
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
            kFar: n => 'incl. ' + n + ' far from the BAN point',
            kArret: n => n + ' arrival point(s) far off',
            hovArret: d => 'Arrival point ' + d + ' m too far from the address',
            arrT: (n, s) => 'Arrival points far off (' + n + ', beyond ' + s + ' m)',
            arrTip: d => 'The arrival point is ' + d + ' m further than the street next to the WME number: check it in WME',
            sbArret: 'Flag arrival points far off beyond',
            sbArretHint: 'Distance between the WME number and where Waze guides, minus its distance to its street. Applied straight away, no new analysis.',
            tipFar: d => 'Placed ' + d + ' m from the BAN address',
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
            banVoie: 'Report to the BAN',
            banVoieTip: 'Opens the BAN’s official reporting tool on this street, to request a change of its name. Nothing is sent until you submit the form.',
            banNumTip: n => 'Report number ' + n + ' to the BAN: the official tool opens on this address (change or deletion). Nothing is sent until you submit the form.',
            banNoKey: 'No BAN identifier here: the BAN map opens at the right place. Click a number, then the street name if the street is at fault, and “Report a problem”.',
            banOff: m => 'This municipality does not take online reports' + (m ? ': ' + m : '.') + ' The official page opens anyway, with the town hall’s contact address: the rest is done by e-mail.',
            banMap: 'View on the BAN map',
            banMairie: 'Contact the town hall',
            banAmbig: 'Warning: in this new municipality the same BAN key exists in several delegated municipalities; check the address shown before reporting.',
            banTropTip: n => 'Report to the BAN that ' + n + ' is missing: the official tool opens at its position (“missing address” alert). Nothing is sent until you submit the form.',
            sigT: (n, a) => 'BAN reports (' + n + (a ? ', ' + a + ' pending' : '') + ')',
            sigTip: 'Every report sent to the BAN for this municipality (by anyone), with its outcome. A click centres the map.',
            sigVoieT: n => 'BAN reports on this street (' + n + ')',
            sigSt: s => ({ PENDING: 'pending', PROCESSED: 'processed', IGNORED: 'rejected', EXPIRED: 'expired' })[s] || s,
            sigDem: (k, v) => ({ nom: 'name → ' + v, num: 'number → ' + v, voie: 'street → ' + v, del: 'deletion', create: 'creation', missing: 'missing address', autre: 'position or parcels' })[k] || k,
            sigMotif: m => 'reason: ' + m,
            sigDeja: (d, st) => 'Already reported on ' + d + ' (' + st + ').',
            snbT: (v, a) => 'Unnamed streets in the BAN (' + v + ' streets, ' + a + ' addresses)',
            snbTip: 'The municipality published these addresses under a placeholder street name (“Non renseigné”…): nothing can be added in WME until it names the street. One line per BAN street, outside the coverage rate. Report it, or contact the town hall.',
            snbPres: n => 'near “' + n + '” in WME',
            snbNone: 'no named WME street nearby',
            dejaOld: 'Scan made by an earlier version of WBC, whose results differ: run it again.',
            ajHnAdd: n => 'Add the house numbers (' + n + ')',
            nextStreet: n => 'Next street (' + n + ' to add)',
            tipNextStreet: 'Opens the street of the commune where “Add” has the most numbers to place (BAN name as primary or alternate), skipping the streets already opened with this button.',
            nextStreetNone: 'No other street ready: the streets left have their numbers placed, or a name to fix first.',
            ajHnAddTip: r => 'L6 only: places in WME the missing numbers of this street, on the segments whose primary name is the BAN name (accents, case, hyphens and dots tolerated) and whose city is the commune or “Village (Commune)”; an address at the end of a driveway becomes an RPP. At most 500 edits per sliding hour, counted when saved (left: ' + r + '). Nothing is saved: check, then save in WME. Out-of-town addresses become RPP too.',
            ajHnNoName: 'The WME name of this street is not the BAN name: automatic adding needs a primary name identical to the BAN.',
            ajHnNone: 'No number can be added automatically on this street.',
            ajHnLoin: n => 'No number can be added automatically: ' + n + ' address(es) more than 80 m from the street as drawn in WME. Move the segment closer if it is misplaced.',
            ajHnNomEcart: (w, b) => 'No number can be added automatically: the segments of this street are named “' + w + '” in WME, not “' + b + '” as in the BAN. Give them the BAN name.',
            ajHnQuota: h => 'Limit reached (500 numbers per hour): next adding possible at ' + h + '.',
            ajHnRunning: 'Adding the house numbers…',
            bgTab: 'Tab in the background: Chrome slows the work in progress down (up to 3 times longer). Keep this tab in front.',
            bgTabTip: 'Chrome throttles the timers of a hidden tab (one per second, then one per minute after 5 minutes) and lowers its priority. Measured on 29/09/2026: a department took 41 min in the background against 13 min in front.',
            ajHnDone: (n, r) => n + (un1(n) ? ' number placed — check it' : ' numbers placed — check them') + ', then save in WME. Left in the quota: ' + r + '.',
            ajHnDoneMix: (n, r, q) => n + (un1(n) ? ' number' : ' numbers') + ' and ' + r + ' RPP placed — check them, then save in WME. Left in the quota: ' + q + '.',
            ajHnDoneRpp: (r, q) => r + ' RPP placed — ' + (un1(r) ? 'check it' : 'check them') + ', then save in WME. Left in the quota: ' + q + '.',
            ajRppCrit: l => '⚠️ To fix by hand: ' + l + '.',
            ajRppCritPoi: n => 'RPP ' + n + ' left without an address',
            ajHnStopTip: 'Stop the current adding after the placement in progress; what is placed stays, to be checked.',
            ajHnStopping: 'Stop requested…',
            ajHnStopped: 'Stopped at your request.',
            ajHnFail: n => n + (un1(n) ? ' placement failed' : ' placements failed') + ' (details in the console).',
            rhnUnsaved: 'Save (or undo) the pending changes first: WME no longer lets scripts read what is not saved, and “⇄” must neither duplicate a number nor bring back a deleted object.',
            rhnLock: n => 'This RPP is locked at level ' + n + ', above your rank: the conversion will become a suggestion when you save.',
            rhnLockInfo: n => 'The removed RPP was locked at level ' + n + '.',
            rhnSegLock: n => (n ? 'The segment is locked at level ' + n + ', above your rank' : 'WME does not let you edit the house numbers of this segment directly') + ': the conversion will become a suggestion when you save.',
            suggAttente: 'WME did not keep this edit as a suggestion: save (or undo) your pending direct edits first — WME never saves suggestions and direct edits together.',
            suggMixte: 'Not converted: one of the two objects would be a suggestion and the other a direct edit, and WME does not save them together. Ask an editor of sufficient rank.',
            rhnCritRpp: n => 'RPP ' + n + ' removed with no number placed: undo (Ctrl+Z) in WME',
            ajHnSansAlt: (r, c) => 'Some out-of-town segments carry “' + r + '” without a city but lack the alternate “' + r + ' / ' + c + '”: the “+” still places an RPP there; the alternate should still be added.',
            ajHnSansAltRoute: (r, c) => 'Some out-of-town segments have a road number as primary name, without a city, but lack the alternate “' + r + ' / ' + c + '”: the “+” still places an RPP there; the alternate should still be added.',
            rhnT: n => 'RPP of this street (' + n + ')',
            rhnTip: 'Show the RPP on the map. On hover, “⇄” replaces it with a segment number when it is a clear-cut case.',
            rhnConv: 'Replace this RPP with a number',
            rhnConvTip: 'In town, replaces this RPP with a number on the segment — clear-cut cases only (same number already on the street, or access point / position along its own street, as in WME Naming Auditor). Refused if the RPP has a name or a photo. Counts in the quota; nothing is saved.',
            rhnDone: (n, q) => 'RPP no. ' + n + ' replaced with a number on the segment — check it, then save in WME. Left in the quota: ' + q + '.',
            rhnDoneDbl: (n, q) => 'No. ' + n + ' was already on the street: the duplicate RPP is removed — check, then save in WME. Left in the quota: ' + q + '.',
            rhnNotFound: 'RPP not found in WME at this spot (moved, changed or deleted since the analysis?): run the analysis again.',
            rhnNoPlaces: 'No place is loaded in WME: the “Places” layer is probably hidden. Show it, then try again.',
            rhnNamed: 'This RPP has a name: it is not converted (to be checked by hand).',
            rhnPhoto: 'This RPP has a photo: it is not converted (someone went there; to be checked by hand).',
            rhnCity: v => 'This RPP belongs to “' + v + '”, not to the commune: it is not converted.',
            rhnStreet: r => 'This RPP carries the street “' + r + '”, not the BAN name of the street: it is not converted.',
            rhnNoSeg: 'No segment of the street (BAN name as primary name, commune as city) within 80 m: the RPP is probably out of town, it stays.',
            rhnLegit: v => 'The RPP access point opens onto “' + v + '”, not onto its own street: the RPP expresses an offset a segment number cannot, it stays.',
            rhnUnsure: 'Nothing clear-cut (another street just as close, or too far from any street): the RPP stays, to be checked by hand.',
            rhnFormat: n => 'The number “' + n + '” is not written like a segment number: to be checked by hand.',
            rhnErr: m => 'Replacement stopped: ' + m,
            rhnPoseTip: 'Replaced with a number (not saved yet).',
            rhnVersRpp: 'Turn this number into an RPP',
            rhnVersRppTip: 'Removes this number from the segment and creates an RPP in its place (same number, same street), entry point on the nearest unnamed segment or driveway (private road, parking lot road); the RPP is then selected so you can adjust its entry. Counts in the quota; nothing is saved.',
            rhnVersRppDone: (n, q) => 'No. ' + n + ' turned into an RPP — adjust its entry point if needed (it is selected), then save in WME. Left in the quota: ' + q + '.',
            rhnVersRppAbsent: n => 'Number ' + n + ' not found in WME (segment not loaded, or number already removed): nothing changed.',
            rhnVersRppTipPose: 'Turned into an RPP (not saved yet).',
            ajHnSkip: n => n + (un1(n) ? ' address skipped' : ' addresses skipped') + ' (details in the console).',
            ajHnCut: (n, h) => n + (un1(n) ? ' address not placed' : ' addresses not placed') + ': quota reached, adding can resume at ' + h + '.',
            ajHnNoSeg: 'No loaded segment has exactly this name as primary name with the commune as city: nothing was placed.',
            ajHnErr: m => 'Adding stopped: ' + m,
            ajHnRights: '“Add the house numbers” for a whole street is reserved for L6 editors; the “+” of a single number and the ⇄ conversions are open to all ranks.',
            ajHnSee: n => (un1(n) ? 'It is' : 'They are') + ' circled in turquoise on the map.',
            ajHnPoseTip: 'Placed by WBC, not saved yet: click to centre the map on it.',
            ajHnSaved: (c, r, q) => 'Save: ' + c + (un1(c) ? ' number counted' : ' numbers counted') + ', ' + r + ' given back to the quota (removed before saving). Quota left: ' + q + '.',
            ajHnSavedTip: 'Placed by WBC and saved.',
            hHnT: 'Adding house numbers',
            hHnB: '<p><i>Add the house numbers</i> for a whole street: <b>L6</b> editors only. <b>One number at a time</b> and the <b>⇄</b> conversions (number → RPP, RPP → number) are open to <b>all ranks</b>, with the same checks and the same quota; without the right on the segment or the RPP (lock above your rank), WME turns the edit into a suggestion when you save — provided no direct edit is pending, and for a conversion only if both objects are in the same case. In the expanded row of a street, <i>Add the house numbers</i> places its missing addresses in WME — <b>one street at a time</b>, never a whole commune. For a single number: the “+” on its chip (on hover), or a click on its point on the map. WME’s own rights apply: for one number or a conversion, a segment locked above your rank (or outside your editable areas) gives a suggestion when you save; <i>Add the house numbers</i> for a whole street skips such segments, and the message says so.</p><p><b>Conditions</b>: the primary name of the segments is the BAN name (accents, case, apostrophes, spaces, hyphens and dots tolerated; a different spelling is only flagged) and their city is the commune or “Village (Commune)”. Each number goes to the nearest admitted segment (80 m at most); a number already present, even pending in this tab, is never placed again; a different (12 b / 12bis) or numeric suffix is left to the editor, unless WME only has the bare number (32 for 32 B): it is then placed, with a warning.</p><p><b>Nothing is saved</b>: placed numbers are circled in turquoise on the map (even with the window closed) and marked ✚ in the street; check them, then save or undo in WME.</p><p><b>Quota</b>: 500 numbers per sliding hour. A number is reserved when placed, then counted if it is found on the server after saving; removed or changed before, it is given back. Numbers typed by hand never count. Once saved, they become “found” without running the analysis again; an older saved scan says so (“run again”). The &#x271A; badge in the window header shows what is left: orange below 20 %, red below 5 %.</p><p><b>RPP</b>: an address at the end of a driveway (private road or parking lot road within 80 m, its street within 250 m) becomes a residential place (RPP), the street button included. An out-of-town address (segment whose primary name has no city, carrying the BAN name with the commune as an alternate) becomes an RPP, through the street button as with the “+”. The RPP is created at the BAN position, with its address and its entry point on the nearest segment (or driveway); a refused address removes the place. Its lock is the one WME gives by default (no France table sets one for an RPP). RPP count in the quota. An address with no segment carrying the BAN name within 80 m, but near a drivable road of another name, also becomes an RPP: address “BAN name / commune”, entry on that road.</p><p><b>Number → RPP</b>: in the bubble of a number’s map point (saved, or placed by WBC and not saved yet), “⇄ Turn this number into an RPP” removes the number and creates an RPP in its place (same number, same street), entry point on the nearest unnamed segment or driveway (roundabout, private road…); the RPP is then selected so you can adjust its entry. A number placed by WBC only changes kind in the quota; a saved number counts 2.</p><p><b>RPP → number</b>: in the expanded street, the RPP of the street have their own chips; on hover, “⇄” replaces ONE RPP with a number on the segment, in clear-cut cases only (as in WME Naming Auditor): the same number already on the street within 150 m (the RPP is a duplicate and is simply removed), or an access point — failing that, the position — along its own street with no other street within 10 m. An access point opening onto another street proves the RPP is legitimate: it stays. Refused if the RPP has a name or a photo, another city or another street. Also by a click on its point on the map. Same quota; nothing is saved. The RPP lock is read: above your rank, the replacement becomes a suggestion when you save; otherwise the message says it. No change may be waiting to be saved (WME no longer lets scripts read pending changes); a replacement counts 2 in the quota (RPP removed, number placed). Also by selecting the RPP’s triangle in WME (WBC window open).</p><p><b>Stop</b>: while a long street is being filled (the map moves from area to area), the Stop button interrupts the pass; what is placed stays, to be checked. A failed placement is counted in the message. <b>Limit</b>: a number typed by hand and not yet saved is not seen as a duplicate — save before adding on the same street. Two WME tabs open at the same time do not see each other’s pending placements: place from a single tab.</p>',
            ajHnQuotaTip: 'Sliding hour: a number counts for one hour from when it was placed. Only numbers placed by this button and actually saved are counted.',
            ajHnLeft: n => 'Quota: ' + n + ' left this hour',
            ajHnFull: h => 'Quota reached — next adding at ' + h,
            ajHn1: 'Add this number',
            ajHn1Tip: 'Places this single number in WME (all ranks), with the checks of “Add the house numbers” (BAN name, city, segment within 80 m, already present); counts in the quota. Nothing is saved.',
            ajHn1Exists: n => 'Number ' + n + ' is already in WME on this street: nothing placed.',
            ajHn1Rights: 'WME has not identified you as an editor (username and rank unreadable): reload WME, then try again.',
            ajHn1Lock: (n, v) => 'Number ' + n + ' will become a suggestion when you save: ' + (v ? 'its segment is locked at level ' + v + ', above your rank' : 'WME does not let you edit the house numbers of its segment directly') + '; an editor of sufficient rank will approve it.',
            ajHn1Bloque: v => (v ? 'Its segment is locked at level ' + v + ', above your rank' : 'Its segment is outside your editable areas') + ': this number will become a suggestion when you save, to be approved by an editor of sufficient rank.',
            ajHnLockSkip: n => n + (un1(n) ? ' number' : ' numbers') + ' not placed: segment that WME does not let you edit (lock or editable areas).',
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
            hTrackB: '<p><b>Département map</b>: after a département, each commune is coloured by coverage (light = little, dark = much). Hover it for its figures; zoomed out, a click opens it.</p><p><b>Missing number</b>: with its street open, a dotted line goes to the segment that should probably carry it; its id is in the CSV.</p><p><b>Select the segments</b> of a street from its row: its segments are selected in WME.</p><p><b>Progress</b>: the CSV export is also a snapshot. Later, <i>Compare</i> reads it back and gives the change street by street (or commune by commune). Nothing is stored anywhere else.</p><p><b>Gaps (CSV)</b>: the streets to rename, with a WME link each, to fix or to send to the area managers.</p><p><b>Street tools</b>: in the expanded row of a street, icons with a counter — select the segments, add the house numbers, next street, report to the BAN or contact the town hall; the name of each shows on hover.</p><p><b>Commune boundary</b>: the polygon icon next to the exports draws the administrative boundary of the commune on the map; the choice is kept.</p>',
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
            memoWmeProg: (i, n) => 'WME: checking ' + i + '/' + n,
            memoWmeOk: 'WME unchanged',
            memoWmeMaj: d => 'WME edited' + (d ? ' (' + d + ')' : ''),
            memoWmeMajN: n => 'WME edited: ' + n,
            memoUpd: 'Update',
            memoUpdTip: 'Re-reads the BAN and WME for this commune and updates the result, in one step.',
            memoUpdDepTip: 'Checks the BAN and WME of every commune, then scans again those that changed.',
            contourBtn: 'Commune boundary',
            contourTip: 'Shows or hides the administrative boundary of the commune on the map (geo.api.gouv.fr, already read for the analysis).',
            memoTagBan: 'BAN updated since the scan',
            memoTagWme: 'WME edited since the scan',
            secMemo: 'Saved scans',
            memoHint: 'Kept in this browser only. Reopening one shows it at once and checks whether the BAN has changed since.',
            memoNone: 'No saved scan yet.',
            memoOpen: 'Open',
            memoDel: 'Delete this scan',
            memoClear: 'Delete all',
            memoErr: m => 'The scan could not be saved: ' + m,
            hMemoT: 'Saved scans and updates',
            hMemoB: '<p>Every scan is kept in this browser (nothing is sent anywhere). Choosing the same commune or département again, or <i>Open</i> in the Scripts tab, shows it at once with its date. <i>Analyse</i> reminds you too: if the same area was already scanned, its date is shown with <i>Open</i> and <i>Run again</i>. If WBC has added house numbers in that area since, the banner says so and <i>Run again</i> becomes the main button.</p><p><b>Update</b>: for a commune, the BAN and WME are read again and the result is replaced. For a département, the address file of each commune is checked (one request per commune), then WME is re-read, house numbers included (segments, each house number — house numbers have no date in WME — and residential places); the communes that changed are scanned again, the others are kept.</p><p>Communes that changed carry a BAN or WME tag and an orange outline on the map until they are scanned again.</p>',
            memoClearSure: 'Click again to delete all',
        },
        fr: {
            sbHint: 'Compare la Base Adresse Nationale (BAN) aux numéros et aux points résidentiels (RPP) de WME, pour une commune ou un département entier.',
            sbOpen: 'Ouvrir la fenêtre',
            sbHelp: 'Aide',
            hWhatT: 'Ce qui est comparé',
            hWhatB: "<p>La <b>BAN</b> est le référentiel\u00a0: chaque adresse qu’elle recense devrait exister dans WME, en numéro sur un segment (HN) ou en point résidentiel (RPP).</p><p><b>Sources</b>, lues en direct\u00a0: la <b>Base Adresse Nationale</b> (adresse.data.gouv.fr, État français\u00a0; Licence Ouverte Etalab 2.0\u00a0; la date de révision de chaque commune est affichée)\u00a0; les contours et listes de communes de <b>geo.api.gouv.fr</b> (API Découpage administratif, données INSEE et IGN, Licence Ouverte Etalab 2.0)\u00a0; l’<b>API publique des signalements BAN</b> (signalement.adresse.data.gouv.fr) pour l’état des signalements\u00a0; et WME sur les mêmes serveurs que l’éditeur. La zone n’a pas besoin d’être affichée ni chargée. Depuis le 12/11/2026, Waze accrédite la BAN pour la France (affichage et création assistée des numéros de rue, page Map Data Attribution)\u00a0; l’ajout d’une voie entière reste un geste de L6\u00a0; un numéro à la fois est ouvert à tous les rangs\u00a0; le tout sous quota.</p><p><b>Ce qui part du navigateur</b>\u00a0: vers geo.api.gouv.fr, en mode «\u00a0Centre de la carte\u00a0», le centre de la carte ARRONDI à 3 décimales (environ 100\u00a0m), et vos recherches de commune — sans identité ni cookie\u00a0; vers la BAN et l’API des signalements, le code INSEE de la commune\u00a0; au démarrage, GitHub (version-min.json, la version minimale\u00a0: une version retirée ne démarre pas) et GreasyFork (nouvelle version) sont seulement lus. Vers data.geopf.fr (Géoplateforme de l’IGN), case WBC du menu Calques cochée\u00a0: l’emprise de la vue, à partir du zoom 18, sans cookie. Rien d’autre\u00a0; votre pseudo ne part vers aucun tiers (seulement vers le Discuss de Waze, pour le bouton Copier).</p><p><b>Signaler à la BAN</b>\u00a0: ouvre l’outil officiel (signalement.adresse.data.gouv.fr) dans un nouvel onglet, sur la voie ou le numéro\u00a0; WBC n’envoie rien, c’est vous qui remplissez et envoyez le formulaire. Pour un numéro de WME absent de la BAN, le commentaire prérempli porte l’adresse lue dans Waze («\u00a0Adresse présente dans Waze\u00a0: …\u00a0»)\u00a0: relisez-le, modifiez-le ou effacez-le avant d’envoyer.</p><p><b>BAN de la vue</b>\u00a0: case WBC du menu Calques cochée et aucune analyse affichée à cet endroit, les adresses BAN de la vue s’affichent à partir du zoom 18, en gris (lecture seule)\u00a0; cerclées de vert quand WME a déjà le même numéro sur la même voie ou à moins de 30\u00a0m (numéros enregistrés, lieux résidentiels). <b>Ctrl+clic</b> (Cmd+clic sur Mac) sur le bouton de la carte\u00a0: la commune au centre est analysée, ou son balayage récent rouvert, et montrée sur la carte sans ouvrir la fenêtre. Tant que la fenêtre de WBC est ouverte, les calques WME «\u00a0Numéros de rue\u00a0» et «\u00a0Résidentiel\u00a0» sont affichés\u00a0; à sa fermeture, ils reprennent leur état d’avant.</p>",
            hMatchT: 'Quand un numéro est trouvé',
            hMatchB: '<p>Une adresse BAN est trouvée quand WME porte le même numéro (suffixes compris\u00a0: <i>bis</i>, <i>ter</i>, lettres) à moins de 150\u00a0m, et\u00a0:</p><table class="wbc-help-table"><tr><td>1</td><td>sur une voie du même nom (nom principal ou alternatif), ou qui n’en diffère que par un article («\u00a0Avenue Sembrancher\u00a0» = «\u00a0Avenue de Sembrancher\u00a0»\u00a0; l’écart de nom reste signalé)\u00a0;</td></tr><tr><td>2</td><td>ou sur un segment qui porte les adresses de cette voie, <b>nommé ou non</b>\u00a0;</td></tr><tr><td>3</td><td>ou à moins de 30\u00a0m de l\'adresse.</td></tr></table><p>La règle 1 est essayée partout d\'abord, puis la 2, puis la 3. Un numéro WME ne sert qu\'une fois.</p>',
            hNamesT: 'La colonne «\u00a0Voie WME\u00a0»',
            hNamesB: '<table class="wbc-help-table"><tr><td>&#x2713;</td><td>les segments proches des adresses portent le nom de la BAN.</td></tr><tr><td><i>nom</i></td><td>ils portent un autre nom\u00a0: le nom à vérifier.</td></tr><tr><td><i>sans nom</i></td><td>ils ne portent aucun nom.</td></tr><tr><td><i>aucun segment</i></td><td>aucun segment à moins de 80\u00a0m des adresses.</td></tr><tr><td>&#x2713; alt</td><td>le nom de la BAN est porté en nom <b>alternatif</b>\u00a0; le nom principal est affiché à côté.</td></tr><tr><td>n° de route</td><td>le nom principal est un numéro de route et le nom de la BAN manque aux noms alternatifs\u00a0: à ajouter.</td></tr><tr><td>type</td><td>seul le type de voie diffère (Rue / Chemin…).</td></tr><tr><td>article · orthographe · partiel</td><td>noms proches\u00a0: un article, une ou deux lettres, ou une forme abrégée. <i>absente de WME</i>\u00a0: la voie n’existe pas dans WME, le nom montré est celui de la voisine.</td></tr><tr><td>&#x2713; parking</td><td>aucun segment nommé, mais un lieu Parking voisin porte le nom de la BAN\u00a0: rien à renommer.</td></tr><tr><td>&#x2713; graphie BAN</td><td>même nom à un tiret ou un point près («\u00a0Rue Paul-Louis Courier\u00a0» / «\u00a0Rue Paul Louis Courier\u00a0»)\u00a0: rien à renommer.</td></tr></table><p>Un numéro manquant en orange avec <b>≠</b> existe dans WME avec un autre suffixe (12 b / 12bis)\u00a0: à vérifier. Si WME n’a que le numéro seul (32 / 32 B), il se pose quand même et l’avertissement reste.</p><p>&#x26A0; signale un nom de la BAN qu\'aucun segment de la commune ne porte.</p>',
            hLimitsT: 'Bon à savoir',
            hLimitsB: "<p>Un département entier prend quelques minutes\u00a0: la BAN se lit commune par commune, WME par carreaux d’environ 5\u00a0km. Le bouton Arrêter l’interrompt\u00a0; ce qui est fait reste affiché, et les communes en échec se reprennent seules.</p><p>Paris, Marseille et Lyon se lisent arrondissement par arrondissement. Les balayages sont gardés dans ce navigateur seulement (IndexedDB), jamais ailleurs, avec vos préférences (périmètre, interrupteurs, place de la fenêtre, couleurs des points)\u00a0; ils sont signalés quand la BAN ou WME a changé depuis.</p>",
            hSafeB: "Le script ne modifie la carte qu’à la demande d’un éditeur\u00a0: le «\u00a0+\u00a0» d’une adresse (un numéro ou un RPP, tous rangs)\u00a0; et, pour un L6, «\u00a0Ajouter les numéros\u00a0» (voie par voie\u00a0: numéros, et RPP au bout d’une allée), «\u00a0⇄\u00a0» (un RPP remplacé par un numéro) et «\u00a0Transformer ce numéro en RPP\u00a0» — 500 par heure glissante au plus, pour chacun\u00a0; il n’enregistre jamais. Ses résultats restent dans ce navigateur.",
            remTitle: "Vous restez responsable de vos éditions",
            remBody: "<p>WME BAN Coverage <b>propose</b>\u00a0: il n’enregistre jamais rien lui\u2011même.</p><p>Chaque numéro, RPP ou conversion «\u00a0⇄\u00a0» arrive dans WME comme une modification en attente. Relisez-la sur la carte, puis enregistrez-la ou annulez-la dans WME.</p><p>Ce que vous enregistrez est votre édition, comme si vous l’aviez faite à la main.</p>",
            remNote: "Ce rappel s’affiche une fois par navigateur\u00a0; il se revoit depuis l’onglet du script.",
            remOk: "J’ai compris",
            remCancel: "Annuler",
            remLink: "Revoir le rappel de responsabilité",
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
            renomRelance: n => n + (n > 1 ? '\u00a0voies renommées dans WME depuis l’analyse\u00a0: les chiffres de la commune sont à jour.' : '\u00a0voie renommée dans WME depuis l’analyse\u00a0: les chiffres de la commune sont à jour.'),
            renomNeuf: n => 'Segment créé dans WME près de ' + n + (n > 1 ? '\u00a0voies qui n’en avaient aucun\u00a0: les chiffres de la commune sont à jour.' : '\u00a0voie qui n’en avait aucun\u00a0: les chiffres de la commune sont à jour.'),
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
            filterClear: 'Effacer le filtre',
            filterCount: (n, m) => n + (un(n) ? ' voie sur ' : ' voies sur ') + m,
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
            sbRppNum: "Numéro des RPP",
            sbRppNumHint: "Écrit son numéro sous le triangle de chaque lieu résidentiel (RPP) chargé dans WME, à partir du zoom 17\u00a0: plus besoin de cliquer dessus pour savoir lequel c’est. Affichage seulement.",
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
            smallTip: "Petite fenêtre (taille d’origine)",
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
            tipMemoOpen: "Ouvrir la fenêtre sur ce balayage et cadrer la carte dessus.",
            tipMemoClear: "Supprimer tous les balayages gardés dans ce navigateur (en deux clics).",
            tipSbOpen: "Ouvrir la fenêtre de WBC (comme le bouton à droite de la carte).",
            tipColorsReset: "Remettre les couleurs des points par défaut.",
            tipHelpHdr: "Déplier ou replier cette partie de l’aide.",
            tipFab: "Ouvrir ou fermer la fenêtre",
            dirZoom: n => 'Adresses BAN\u00a0: zoomez au niveau ' + n + ' ou plus',
            dirLoading: 'Adresses BAN\u00a0: lecture…',
            dirNone: 'Adresses BAN\u00a0: aucune dans la vue',
            dirCount: n => n + (un(n) ? ' adresse BAN dans la vue' : ' adresses BAN dans la vue'),
            dirCap: (n, m) => n + ' adresses BAN affichées sur ' + m + '\u00a0: zoomez pour toutes les voir',
            dirErr: m => 'Adresses BAN\u00a0: lecture impossible — ' + m,
            dirEdition: d => 'édition du ' + d,
            dirSource: 'Source\u00a0: Base Adresse Nationale (adresse.data.gouv.fr), diffusée par la Géoplateforme de l’IGN — Licence Ouverte Etalab 2.0. Lecture seule\u00a0: rien n’est écrit\u00a0; décochez WBC dans le menu Calques pour les masquer.',
            dirFiche: 'BAN, vue sans analyse',
            dirWme: p => 'dont ' + p + ' déjà dans WME',
            dirFicheWme: 'Déjà dans WME (même numéro, même voie ou à moins de 30\u00a0m)',
            dirFicheAbs: 'Absent des numéros chargés dans WME',
            tipFabCtrl: mac => (mac ? 'Cmd' : 'Ctrl') + '+clic\u00a0: afficher la BAN de la commune au centre',
            fabBusy: 'Analyse de la commune au centre…',
            fabErr: m => 'Échec\u00a0: ' + m,
            fabDeja: 'Une analyse est déjà en cours.',
            tipVoie: "Déplier la voie (ses numéros, les manquants en rouge) et cadrer la carte dessus.",
            tipCommune: "Ouvrir le détail de cette commune et cadrer la carte dessus.",
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
            dejaRelaunchTip: "Relance toute l’analyse.",
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
            ponctTag: "graphie BAN",
            tipOrtho: "L’orthographe diffère d’une ou deux lettres",
            tipPonct: "La BAN n\u2019écrit pas ce nom correctement (trait d\u2019union, point\u2026)\u00a0: le nom WME est gardé, les numéros s\u2019ajoutent quand même",
            partielTag: "partiel",
            tipPartiel: "Un nom est la forme abrégée de l’autre",
            absentTag: "absente de WME",
            altTag: "alt",
            parkTag: "parking",
            tipPark: "Aucun segment nommé\u00a0: le nom de la BAN est porté par le lieu Parking voisin (les voies de parking restent sans nom).",
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
            kFar: n => 'dont ' + n + ' loin de la BAN',
            kArret: n => n + ' point(s) d’arrivée éloigné(s)',
            hovArret: d => 'Point d’arrivée à ' + d + '\u00a0m de trop',
            arrT: (n, s) => 'Points d’arrivée éloignés (' + n + ', au-delà de ' + s + '\u00a0m)',
            arrTip: d => 'Le point d’arrivée est ' + d + '\u00a0m plus loin que la rue voisine du numéro WME\u00a0: le vérifier dans WME',
            sbArret: 'Signaler un point d’arrivée éloigné au-delà de',
            sbArretHint: 'Distance entre le numéro WME et l’endroit où Waze conduit, moins sa distance à sa rue. Appliqué tout de suite, sans nouvelle analyse.',
            tipFar: d => 'Placé à ' + d + '\u00a0m de l’adresse BAN',
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
            banVoie: 'Signaler à la BAN',
            banVoieTip: 'Ouvre l’outil officiel de signalement de la BAN sur cette voie, pour demander la modification de son nom. Rien ne part avant que vous envoyiez le formulaire.',
            banNumTip: n => 'Signaler le ' + n + ' à la BAN\u00a0: l’outil officiel s’ouvre sur cette adresse (modification ou suppression). Rien ne part avant que vous envoyiez le formulaire.',
            banNoKey: 'Pas d’identifiant BAN ici\u00a0: la carte de la BAN s’ouvre au bon endroit. Cliquez un numéro, puis le nom de la voie si c’est elle qui est en cause, et «\u00a0Signaler un problème\u00a0».',
            banOff: m => (m || 'Cette commune ne prend pas les signalements en ligne.') + ' La fiche officielle s’ouvre quand même, avec l’adresse de contact de la mairie\u00a0: la suite se fait par courriel.',
            banMap: 'Voir sur la carte BAN',
            banMairie: 'Contacter la mairie',
            banAmbig: 'Attention\u00a0: dans cette commune nouvelle, la même clé BAN existe dans plusieurs communes déléguées\u00a0; vérifiez l’adresse affichée avant de signaler.',
            banTropTip: n => 'Signaler à la BAN que le ' + n + ' manque\u00a0: l’outil officiel s’ouvre à sa position (alerte «\u00a0adresse manquante\u00a0»). Rien ne part avant que vous envoyiez le formulaire.',
            sigT: (n, a) => 'Signalements à la BAN (' + n + (a ? ', dont ' + a + ' en attente' : '') + ')',
            sigTip: 'Tous les signalements envoyés à la BAN pour cette commune (par quiconque), avec leur suite. Un clic centre la carte.',
            sigVoieT: n => 'Signalements à la BAN sur cette voie (' + n + ')',
            sigSt: s => ({ PENDING: 'en attente', PROCESSED: 'traité', IGNORED: 'refusé', EXPIRED: 'expiré' })[s] || s,
            sigDem: (k, v) => ({ nom: 'nom → ' + v, num: 'numéro → ' + v, voie: 'voie → ' + v, del: 'suppression', create: 'création', missing: 'adresse manquante', autre: 'position ou parcelles' })[k] || k,
            sigMotif: m => 'motif\u00a0: ' + m,
            sigDeja: (d, st) => 'Déjà signalé le ' + d + ' (' + st + ').',
            snbT: (v, a) => 'Voies sans nom dans la BAN (' + v + ' voies, ' + a + ' adresses)',
            snbTip: 'La commune a publié ces adresses sous un nom de remplacement («\u00a0Non renseigné\u00a0»…)\u00a0: rien à poser dans WME tant qu’elle n’a pas nommé la voie. Une ligne par voie BAN, hors du taux de couverture. À signaler, ou à voir avec la mairie.',
            snbPres: n => 'près de «\u00a0' + n + '\u00a0» dans WME',
            snbNone: 'aucune voie nommée de WME à proximité',
            dejaOld: 'Balayage fait par une version précédente de WBC, dont les résultats diffèrent\u00a0: à relancer.',
            ajHnAdd: n => 'Ajouter les numéros (' + n + ')',
            nextStreet: n => 'Voie suivante (' + n + ' à ajouter)',
            tipNextStreet: 'Ouvre la voie de la commune où «\xa0Ajouter\xa0» a le plus de numéros à poser (nom BAN en principal ou en alternatif), en sautant les voies déjà ouvertes par ce bouton.',
            nextStreetNone: 'Plus aucune voie prête\xa0: celles qui restent ont leurs numéros posés, ou un nom à corriger d’abord.',
            ajHnAddTip: r => 'Réservé aux L6\u00a0: pose dans WME les numéros manquants de cette voie, sur les segments dont le nom principal est celui de la BAN (accents, casse, tirets et points tolérés) et dont la ville est la commune ou «\u00a0Village (Commune)\u00a0»\u00a0; une adresse au bout d’une allée devient un RPP. Au plus 500 éditions par heure glissante, comptées à l’enregistrement (reste ' + r + '). Rien n’est enregistré\u00a0: vérifiez, puis enregistrez dans WME. Les adresses hors agglomération deviennent aussi des RPP.',
            ajHnNoName: 'Le nom WME de cette voie n’est pas celui de la BAN\xa0: l’ajout automatique exige un nom principal identique à la BAN.',
            ajHnNone: 'Aucun numéro à ajouter automatiquement sur cette voie.',
            ajHnLoin: n => 'Aucun numéro à ajouter automatiquement\u00a0: ' + n + ' adresse(s) à plus de 80\u00a0m de la voie tracée dans WME. Rapproche le segment s’il est mal placé.',
            ajHnNomEcart: (w, b) => 'Aucun numéro à ajouter automatiquement\u00a0: dans WME, les segments de cette voie s’appellent «\u00a0' + w + '\u00a0», et non «\u00a0' + b + '\u00a0» comme dans la BAN. Donne-leur le nom de la BAN.',
            ajHnQuota: h => 'Quota atteint (500 numéros par heure)\xa0: prochain ajout possible à ' + h + '.',
            ajHnRunning: 'Ajout des numéros…',
            bgTab: 'Onglet passé en arrière-plan\xa0: Chrome ralentit le travail en cours (jusqu’à 3 fois plus long). Gardez cet onglet au premier plan.',
            bgTabTip: 'Chrome bride les minuteries d’un onglet caché (une par seconde, puis une par minute après 5 minutes) et baisse sa priorité. Mesuré le 29/09/2026\xa0: un département en 41\xa0min en arrière-plan, contre 13\xa0min au premier plan.',
            ajHnDone: (n, r) => n + (un(n) ? ' numéro posé — vérifiez-le' : ' numéros posés — vérifiez-les') + ', puis enregistrez dans WME. Reste au quota\xa0: ' + r + '.',
            ajHnDoneMix: (n, r, q) => n + (un(n) ? ' numéro' : ' numéros') + ' et ' + r + ' RPP posés — vérifiez-les, puis enregistrez dans WME. Reste au quota\xa0: ' + q + '.',
            ajHnDoneRpp: (r, q) => r + (un(r) ? ' RPP posé — vérifiez-le' : ' RPP posés — vérifiez-les') + ', puis enregistrez dans WME. Reste au quota\xa0: ' + q + '.',
            ajRppCrit: l => '⚠️ À reprendre à la main\xa0: ' + l + '.',
            ajRppCritPoi: n => 'RPP ' + n + ' resté sans adresse',
            ajHnStopTip: 'Arrêter l’ajout en cours après la pose en cours\u00a0; ce qui est posé reste, à relire.',
            ajHnStopping: 'Arrêt demandé…',
            ajHnStopped: 'Arrêté à votre demande.',
            ajHnFail: n => n + (un(n) ? ' pose en échec' : ' poses en échec') + ' (détail dans la console).',
            rhnUnsaved: 'Enregistrez (ou annulez) d’abord les modifications en attente\u00a0: WME ne laisse plus lire aux scripts ce qui n’est pas enregistré, et «\u00a0⇄\u00a0» ne doit ni doubler un numéro ni reprendre un objet supprimé.',
            rhnLock: n => 'Ce RPP est verrouillé au niveau ' + n + ', au-dessus de votre rang\u00a0: la conversion deviendra une suggestion à l’enregistrement.',
            rhnLockInfo: n => 'Le RPP retiré était verrouillé au niveau ' + n + '.',
            rhnSegLock: n => (n ? 'Le segment est verrouillé au niveau ' + n + ', au-dessus de votre rang' : 'WME ne vous laisse pas modifier directement les numéros de ce segment') + '\u00a0: la conversion deviendra une suggestion à l’enregistrement.',
            suggAttente: 'WME n’a pas gardé cette modification en suggestion\u00a0: enregistrez (ou annulez) d’abord vos modifications directes en attente — WME n’enregistre jamais suggestions et modifications directes ensemble.',
            suggMixte: 'Rien n’est converti\u00a0: l’un des deux objets passerait en suggestion et l’autre en modification directe, et WME ne les enregistre pas ensemble. Demandez à un éditeur de rang suffisant.',
            rhnCritRpp: n => 'RPP ' + n + ' retiré sans numéro posé\u00a0: annulez (Ctrl+Z) dans WME',
            ajHnSansAlt: (r, c) => 'Des segments hors agglomération portent «\xa0' + r + '\xa0» sans ville mais n’ont pas l’alternatif «\xa0' + r + ' / ' + c + '\xa0»\xa0: le «\xa0+\xa0» y pose quand même un RPP, mais l’alternatif reste à ajouter.',
            ajHnSansAltRoute: (r, c) => 'Des segments hors agglomération ont un numéro de route pour nom principal, sans ville, mais pas l’alternatif «\xa0' + r + ' / ' + c + '\xa0»\xa0: le «\xa0+\xa0» y pose quand même un RPP, mais l’alternatif reste à ajouter.',
            rhnT: n => 'RPP de cette voie (' + n + ')',
            rhnTip: 'Montrer le RPP sur la carte. Au survol, «\xa0⇄\xa0» le remplace par un numéro du segment quand l’écart est franc.',
            rhnConv: 'Remplacer ce RPP par un numéro',
            rhnConvTip: 'En agglomération, remplace ce RPP par un numéro sur le segment — en écart franc seulement (même numéro déjà posé sur la rue, ou point d’accès / position le long de sa propre rue, comme WME Naming Auditor). Refusé si le RPP a un nom ou une photo. Compte au quota\xa0; rien n’est enregistré.',
            rhnDone: (n, q) => 'RPP n°\xa0' + n + ' remplacé par un numéro sur le segment — vérifiez-le, puis enregistrez dans WME. Reste au quota\xa0: ' + q + '.',
            rhnDoneDbl: (n, q) => 'Le n°\xa0' + n + ' était déjà posé sur la rue\xa0: le RPP en doublon est retiré — vérifiez, puis enregistrez dans WME. Reste au quota\xa0: ' + q + '.',
            rhnNotFound: 'RPP introuvable dans WME à cet endroit (déplacé, modifié ou supprimé depuis l’analyse\xa0?)\xa0: relancez l’analyse.',
            rhnNoPlaces: 'Aucun lieu n’est chargé dans WME\xa0: le calque «\xa0Lieux\xa0» est sans doute masqué. Affichez-le, puis recommencez.',
            rhnNamed: 'Ce RPP porte un nom\xa0: il n’est pas converti (à voir à la main).',
            rhnPhoto: 'Ce RPP a une photo\xa0: il n’est pas converti (quelqu’un est venu sur place\xa0; à voir à la main).',
            rhnCity: v => 'Ce RPP est rattaché à «\xa0' + v + '\xa0», pas à la commune\xa0: il n’est pas converti.',
            rhnStreet: r => 'Ce RPP porte la rue «\xa0' + r + '\xa0», pas le nom BAN de la voie\xa0: il n’est pas converti.',
            rhnNoSeg: 'Aucun segment de la voie (nom BAN en principal, commune pour ville) à moins de 80\xa0m\xa0: le RPP est sans doute hors agglomération, il reste.',
            rhnLegit: v => 'Le point d’accès du RPP donne sur «\xa0' + v + '\xa0», pas sur sa rue\xa0: le RPP dit un décalage qu’un numéro de segment ne saurait exprimer, il reste.',
            rhnUnsure: 'Rien de net ne permet de trancher (autre voie aussi proche, ou trop loin de toute voie)\xa0: le RPP reste, à voir à la main.',
            rhnFormat: n => 'Le numéro «\xa0' + n + '\xa0» ne s’écrit pas comme un numéro de segment\xa0: à voir à la main.',
            rhnErr: m => 'Remplacement interrompu\xa0: ' + m,
            rhnPoseTip: 'Remplacé par un numéro (pas encore enregistré).',
            rhnVersRpp: 'Transformer ce numéro en RPP',
            rhnVersRppTip: 'Retire ce numéro du segment et crée à sa place un RPP (même numéro, même voie), point d’entrée sur le segment le plus proche sans nom ou sur une allée (chemin privé, voie de parking)\xa0; le RPP est ensuite sélectionné pour ajuster son entrée. Compte au quota\xa0; rien n’est enregistré.',
            rhnVersRppDone: (n, q) => 'N°\xa0' + n + ' transformé en RPP — ajustez son point d’entrée si besoin (il est sélectionné), puis enregistrez dans WME. Reste au quota\xa0: ' + q + '.',
            rhnVersRppAbsent: n => 'Le numéro ' + n + ' est introuvable dans WME (segment non chargé, ou numéro déjà retiré)\xa0: rien n’est changé.',
            rhnVersRppTipPose: 'Transformé en RPP (pas encore enregistré).',
            ajHnSkip: n => n + (un(n) ? ' adresse écartée' : ' adresses écartées') + ' (détail dans la console).',
            ajHnCut: (n, h) => n + (un(n) ? ' adresse non posée' : ' adresses non posées') + '\xa0: quota atteint, reprise possible à ' + h + '.',
            ajHnNoSeg: 'Aucun segment chargé ne porte exactement ce nom en nom principal avec la commune pour ville\xa0: rien n’a été posé.',
            ajHnErr: m => 'Ajout interrompu\xa0: ' + m,
            ajHnRights: '«\u00a0Ajouter les numéros\u00a0» d’une voie entière est réservé aux éditeurs L6\u00a0; le «\u00a0+\u00a0» d’un seul numéro et les conversions «\u00a0⇄\u00a0» sont ouverts à tous les rangs.',
            ajHnSee: n => un(n) ? 'Il est entouré en turquoise sur la carte.' : 'Ils sont entourés en turquoise sur la carte.',
            ajHnPoseTip: 'Posé par WBC, pas encore enregistré\xa0: cliquez pour centrer la carte dessus.',
            ajHnSaved: (c, r, q) => 'Enregistrement\xa0: ' + c + (un(c) ? ' numéro compté' : ' numéros comptés') + ', ' + r + ' rendu(s) au quota (retirés avant l’enregistrement). Reste au quota\xa0: ' + q + '.',
            ajHnSavedTip: 'Posé par WBC et enregistré.',
            hHnT: 'Ajouter les numéros',
            hHnB: '<p><i>Ajouter les numéros</i> d’une voie entière\u00a0: éditeurs <b>L6</b> seulement. <b>Un numéro à la fois</b> et les conversions <b>⇄</b> (numéro → RPP, RPP → numéro) sont ouverts à <b>tous les rangs</b>, avec les mêmes contrôles et le même quota\u00a0; sans droit sur le segment ou le RPP (verrou au-dessus de votre rang), WME en fait une suggestion à l’enregistrement — s’il n’y a pas de modification directe en attente, et pour une conversion seulement si les deux objets sont dans le même cas. Dans la ligne dépliée d’une voie, <i>Ajouter les numéros</i> pose dans WME ses adresses manquantes — <b>voie par voie</b>, jamais pour toute la commune. Pour un seul numéro\u00a0: le «\u00a0+\u00a0» de sa pastille (au survol), ou un clic sur son point de la carte. Les droits de WME s’appliquent\u00a0: pour un seul numéro ou une conversion, un segment verrouillé au-dessus de votre rang (ou hors de vos zones d’édition) donne une suggestion à l’enregistrement\u00a0; <i>Ajouter les numéros</i> d’une voie entière saute ces segments, et le message le dit.</p><p><b>Conditions</b>\u00a0: le nom principal des segments est celui de la BAN (accents, casse, apostrophes, espaces, tirets et points tolérés\u00a0; une graphie différente est seulement signalée) et leur ville est la commune ou «\u00a0Village (Commune)\u00a0». Chaque numéro va au segment admis le plus proche (80\u00a0m au plus)\u00a0; un numéro déjà présent, même en attente dans cet onglet, n’est jamais reposé\u00a0; un suffixe différent (12 b / 12bis) ou chiffré est laissé à l’éditeur, sauf si WME n’a que le numéro seul (32 pour 32 B)\u00a0: il est alors posé, avec un avertissement.</p><p><b>Rien n’est enregistré</b>\u00a0: les numéros posés sont entourés en turquoise sur la carte (même fenêtre fermée) et marqués ✚ dans la voie\u00a0; relisez-les, puis enregistrez ou annulez avec WME.</p><p><b>Quota</b>\u00a0: 500 numéros par heure glissante. Un numéro est réservé à l’ajout, puis compté s’il se retrouve sur le serveur après l’enregistrement\u00a0; retiré ou modifié avant, il est rendu. Les numéros saisis à la main ne comptent jamais. Une fois enregistrés, ils passent en «\u00a0trouvés\u00a0» sans relancer l’analyse\u00a0; un balayage gardé plus ancien le signale («\u00a0relancez\u00a0»). La pastille &#x271A; de l’en-tête de la fenêtre donne ce qui reste\u00a0: orange sous 20\u00a0%, rouge sous 5\u00a0%.</p><p><b>RPP</b>\u00a0: une adresse au bout d’une allée (chemin privé ou voie de parking à moins de 80\u00a0m, sa voie à moins de 250\u00a0m) devient un POI résidentiel (RPP), bouton de la voie compris. Une adresse hors agglomération (segment au nom principal sans ville, qui porte le nom BAN avec la commune en alternatif) devient un RPP, par le bouton de la voie comme par le «\u00a0+\u00a0». Le RPP est créé à la position BAN, avec son adresse et son point d’entrée sur le segment (ou l’allée) le plus proche\u00a0; une adresse refusée retire le POI. Son verrou est celui que WME donne d’office (aucune table France n’en fixe pour un RPP). Les RPP comptent au quota. Une adresse sans aucun segment au nom BAN à moins de 80\u00a0m, mais proche d’une voie roulable d’un autre nom, devient aussi un RPP\u00a0: adresse «\u00a0nom BAN / commune\u00a0», entrée sur cette voie.</p><p><b>Numéro → RPP</b>\u00a0: dans la bulle du point d’un numéro (enregistré, ou posé par WBC et pas encore enregistré), «\u00a0⇄ Transformer ce numéro en RPP\u00a0» retire le numéro et crée à sa place un RPP (même numéro, même voie), point d’entrée sur le segment sans nom ou l’allée le plus proche (rond-point, chemin privé…)\u00a0; le RPP est ensuite sélectionné pour ajuster son entrée. Un numéro posé par WBC change seulement de nature au quota\u00a0; un numéro enregistré compte 2.</p><p><b>RPP → numéro</b>\u00a0: dans la voie dépliée, les RPP de la voie ont leurs pastilles\u00a0; au survol, «\u00a0⇄\u00a0» remplace UN RPP par un numéro sur le segment, en écart franc seulement (comme WME Naming Auditor)\u00a0: même numéro déjà posé sur la rue à moins de 150\u00a0m (le RPP fait doublon et il est simplement retiré), ou point d’accès — à défaut, position — le long de sa propre rue sans autre voie à moins de 10\u00a0m. Un point d’accès qui donne sur une autre voie prouve que le RPP est légitime\u00a0: il reste. Refusé si le RPP a un nom ou une photo, une autre ville ou une autre rue. Aussi par un clic sur son point de la carte. Même quota\u00a0; rien n’est enregistré. Le verrou du RPP est lu\u00a0: au-dessus de votre rang, le remplacement devient une suggestion à l’enregistrement\u00a0; sinon le message le dit. Aucune modification ne doit attendre l’enregistrement (WME ne laisse plus lire aux scripts ce qui est en attente)\u00a0; un remplacement compte 2 au quota (RPP retiré, numéro posé). Aussi en sélectionnant le triangle du RPP dans WME (fenêtre de WBC ouverte).</p><p><b>Arrêter</b>\u00a0: pendant l’ajout d’une voie longue (la carte se déplace de zone en zone), le bouton Arrêter interrompt la passe\u00a0; ce qui est posé reste, à relire. Une pose en échec est comptée dans le message. <b>Limite</b>\u00a0: un numéro tapé à la main et pas encore enregistré n’est pas vu comme doublon — enregistrez avant d’ajouter sur la même voie. Deux onglets WME ouverts en même temps ne voient pas leurs poses en attente l’un de l’autre\u00a0: posez depuis un seul onglet.</p>',
            ajHnQuotaTip: 'Heure glissante\u00a0: un numéro compte pendant une heure à partir de son ajout. Seuls les numéros posés par ce bouton et réellement enregistrés sont comptés.',
            ajHnLeft: n => 'Quota\xa0: ' + n + (un(n) ? ' restant' : ' restants') + ' dans l’heure',
            ajHnFull: h => 'Quota atteint — prochain ajout à ' + h,
            ajHn1: 'Ajouter ce numéro',
            ajHn1Tip: 'Pose ce seul numéro dans WME (tous rangs), avec les contrôles d’«\u00a0Ajouter les numéros\u00a0» (nom BAN, ville, segment à moins de 80\u00a0m, doublon)\u00a0; il compte au quota. Rien n’est enregistré.',
            ajHn1Exists: n => 'Le ' + n + ' est déjà dans WME sur cette voie\xa0: rien n’est posé.',
            ajHn1Rights: 'WME ne vous a pas encore identifié (pseudo et rang illisibles)\u00a0: rechargez WME, puis réessayez.',
            ajHn1Lock: (n, v) => 'Le ' + n + ' deviendra une suggestion à l’enregistrement\u00a0: ' + (v ? 'son segment est verrouillé au niveau ' + v + ', au-dessus de votre rang' : 'WME ne vous laisse pas modifier directement les numéros de son segment') + '\u00a0; un éditeur de rang suffisant la validera.',
            ajHn1Bloque: v => (v ? 'Son segment est verrouillé au niveau ' + v + ', au-dessus de votre rang' : 'Son segment est hors de vos zones d’édition') + '\u00a0: ce numéro deviendra une suggestion à l’enregistrement, à valider par un éditeur de rang suffisant.',
            ajHnLockSkip: n => n + (un(n) ? ' numéro non posé' : ' numéros non posés') + '\u00a0: segment que WME ne vous laisse pas modifier (verrou ou zones d’édition).',
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
            hTrackB: '<p><b>Carte du département</b>\u00a0: après un département, chaque commune est colorée selon sa couverture (clair = peu, foncé = beaucoup). Le survol donne ses chiffres\u00a0; carte dézoomée, un clic l’ouvre.</p><p><b>Numéro manquant</b>\u00a0: voie ouverte, un pointillé mène au segment qui devrait probablement le porter\u00a0; son identifiant est dans le CSV.</p><p><b>Sélectionner les segments</b> d’une voie depuis sa ligne\u00a0: ils sont sélectionnés dans WME.</p><p><b>Avancement</b>\u00a0: l’export CSV sert aussi de relevé. Plus tard, <i>Comparer</i> le relit et donne l’écart voie par voie (ou commune par commune). Rien n’est gardé ailleurs.</p><p><b>Écarts (CSV)</b>\u00a0: les voies à renommer, chacune avec un lien WME, à corriger ou à transmettre aux responsables de la zone.</p><p><b>Outils de la voie</b>\u00a0: dans la ligne dépliée d’une voie, des icônes à compteur — sélectionner les segments, ajouter les numéros, voie suivante, signaler à la BAN ou contacter la mairie\u00a0; le nom de chacune s’affiche au survol.</p><p><b>Contour de la commune</b>\u00a0: l’icône de polygone, à côté des exports, trace sur la carte le contour administratif de la commune\u00a0; le choix est retenu.</p>',
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
            memoWmeProg: (i, n) => 'WME\u00a0: vérification ' + i + '/' + n,
            memoWmeOk: 'WME inchangé',
            memoWmeMaj: d => 'WME modifié' + (d ? ' (' + d + ')' : ''),
            memoWmeMajN: n => 'WME modifié\u00a0: ' + n,
            memoUpd: 'Mettre à jour',
            memoUpdTip: 'Relit la BAN et WME pour cette commune et met le résultat à jour, en un seul geste.',
            memoUpdDepTip: 'Vérifie la BAN et WME de chaque commune, puis relance celles qui ont changé.',
            contourBtn: 'Contour de la commune',
            contourTip: 'Affiche ou masque sur la carte le contour administratif de la commune (geo.api.gouv.fr, déjà lu pour l’analyse).',
            memoTagBan: 'BAN mise à jour depuis le balayage',
            memoTagWme: 'WME modifié depuis le balayage',
            secMemo: 'Balayages gardés',
            memoHint: 'Conservés dans ce navigateur seulement. En rouvrir un l’affiche tout de suite et vérifie si la BAN a changé depuis.',
            memoNone: 'Aucun balayage gardé pour l’instant.',
            memoOpen: 'Ouvrir',
            memoDel: 'Supprimer ce balayage',
            memoClear: 'Tout supprimer',
            memoErr: m => 'Le balayage n’a pas pu être gardé\u00a0: ' + m,
            hMemoT: 'Balayages gardés et mises à jour',
            hMemoB: '<p>Chaque balayage est gardé dans ce navigateur (rien n’est envoyé nulle part). Choisir de nouveau la même commune ou le même département, ou <i>Ouvrir</i> dans l’onglet Scripts, l’affiche tout de suite avec sa date. <i>Analyser</i> le rappelle aussi\u00a0: si le même périmètre a déjà été balayé, sa date s’affiche avec <i>Ouvrir</i> et <i>Relancer</i>. Si WBC a ajouté des numéros dans ce périmètre depuis, le bandeau le dit et <i>Relancer</i> devient le bouton principal.</p><p><b>Mettre à jour</b>\u00a0: pour une commune, la BAN et WME sont relues et le résultat est remplacé. Pour un département, le fichier d’adresses de chaque commune est vérifié (une requête par commune), puis WME est relu, numéros compris (segments, chaque numéro — les numéros n’ont pas de date dans WME — et points résidentiels)\u00a0; les communes qui ont changé sont rebalayées, les autres sont gardées.</p><p>Les communes qui ont changé portent une étiquette BAN ou WME et un contour orange sur la carte, jusqu’à leur nouveau balayage.</p>',
            memoClearSure: 'Cliquer encore pour tout supprimer',
        },
        de: {
            sbHint: 'Vergleicht die nationale Adressdatenbank (BAN) mit den Hausnummern und Wohnorten (RPP) im WME, für eine Gemeinde oder ein ganzes Département.',
            sbOpen: 'Fenster öffnen',
            sbHelp: 'Hilfe',
            hWhatT: 'Was verglichen wird',
            hWhatB: "<p>Die <b>BAN</b> ist die Referenz: jede Adresse, die sie aufführt, sollte im WME vorhanden sein, als Hausnummer an einem Segment (HN) oder als Wohnort (RPP).</p><p><b>Quellen</b>, live gelesen: die <b>Base Adresse Nationale</b> (adresse.data.gouv.fr, französischer Staat; Licence Ouverte Etalab 2.0; das Revisionsdatum jeder Gemeinde wird angezeigt); Gemeindegrenzen und -listen von <b>geo.api.gouv.fr</b> (API Découpage administratif, Daten von INSEE und IGN, Licence Ouverte Etalab 2.0); die öffentliche <b>API der BAN-Meldungen</b> (signalement.adresse.data.gouv.fr) für den Stand der Meldungen; und das WME von denselben Servern wie der Editor. Der Bereich muss weder angezeigt noch geladen sein. Seit dem 12.11.2026 erkennt Waze die BAN für Frankreich an (Anzeige und unterstützte Erstellung von Hausnummern, Seite Map Data Attribution); das Hinzufügen einer ganzen Straße bleibt eine Geste von L6; eine Nummer nach der anderen steht allen Rängen offen; alles im Kontingent.</p><p><b>Was den Browser verlässt</b>: an geo.api.gouv.fr im Modus „Kartenmitte“ die auf 3 Dezimalstellen GERUNDETE Kartenmitte (etwa 100 m) und Ihre Gemeindesuchen — ohne Identität, ohne Cookie; an die BAN und die Meldungs-API der Gemeindecode; beim Start werden GitHub (version-min.json, Mindestversion: eine zurückgezogene Version startet nicht) und GreasyFork (neue Version) nur gelesen. An data.geopf.fr (Géoplateforme des IGN), bei angehakter WBC-Box im Menü Ebenen: der Ausschnitt der Ansicht, ab Zoom 18, ohne Cookie. Sonst nichts; Ihr Benutzername geht an keinen Dritten (nur an das Discuss von Waze, für die Schaltfläche Kopieren).</p><p><b>An die BAN melden</b>: öffnet das offizielle Werkzeug (signalement.adresse.data.gouv.fr) in einem neuen Tab, für die Straße oder die Nummer; WBC sendet nichts, Sie füllen das Formular aus und senden es. Für eine WME-Nummer, die der BAN fehlt, enthält der vorausgefüllte Kommentar die in Waze gelesene Adresse („Adresse présente dans Waze: …“): vor dem Senden prüfen, ändern oder löschen.</p><p><b>BAN der Ansicht</b>: Ist die WBC-Box im Menü Ebenen angehakt und dort keine Analyse angezeigt, erscheinen die BAN-Adressen der Ansicht ab Zoom 18 in Grau (nur lesend); grün umrandet, wenn das WME dieselbe Nummer schon an derselben Straße oder im Umkreis von 30 m hat (gespeicherte Hausnummern, Wohnorte). <b>Strg+Klick</b> (Cmd+Klick auf dem Mac) auf die Kartenschaltfläche: die Gemeinde in der Kartenmitte wird analysiert oder ihr neuer Scan wieder geöffnet und auf der Karte gezeigt, ohne das Fenster zu öffnen. Solange das WBC-Fenster offen ist, werden die WME-Ebenen „Hausnummern“ und „Wohngebäude“ angezeigt; beim Schließen erhalten sie ihren vorherigen Zustand zurück.</p>",
            hMatchT: 'Wann eine Nummer gefunden ist',
            hMatchB: '<p>Eine BAN-Adresse gilt als gefunden, wenn das WME dieselbe Nummer (mit Zusätzen: <i>bis</i>, <i>ter</i>, Buchstaben) in weniger als 150 m trägt, und zwar:</p><table class="wbc-help-table"><tr><td>1</td><td>an einer Straße mit demselben Namen (Haupt- oder Alternativname) oder einem, der sich nur durch einen Artikel unterscheidet („Avenue Sembrancher“ = „Avenue de Sembrancher“; die Namensabweichung wird weiter gemeldet);</td></tr><tr><td>2</td><td>oder an einem Segment, das die Adressen dieser Straße trägt, <b>mit oder ohne Namen</b>;</td></tr><tr><td>3</td><td>oder weniger als 30 m von der Adresse entfernt.</td></tr></table><p>Regel 1 wird überall zuerst versucht, dann 2, dann 3. Eine WME-Nummer zählt nur einmal.</p>',
            hNamesT: 'Die Spalte „WME-Straße“',
            hNamesB: '<table class="wbc-help-table"><tr><td>&#x2713;</td><td>die Segmente bei den Adressen tragen den BAN-Namen.</td></tr><tr><td><i>Name</i></td><td>sie tragen einen anderen Namen: zu prüfen.</td></tr><tr><td><i>ohne Namen</i></td><td>sie tragen keinen Namen.</td></tr><tr><td><i>kein Segment</i></td><td>kein Segment näher als 80 m an den Adressen.</td></tr><tr><td>&#x2713; alt</td><td>der BAN-Name steht als <b>Alternativname</b>; der Hauptname steht daneben.</td></tr><tr><td>Straßennr.</td><td>der Hauptname ist eine Straßennummer und der BAN-Name fehlt bei den Alternativnamen: ergänzen.</td></tr><tr><td>Typ</td><td>nur der Straßentyp unterscheidet sich (Rue / Chemin…).</td></tr><tr><td>Artikel · Schreibung · gekürzt</td><td>ähnliche Namen: ein Artikel, ein, zwei Buchstaben oder eine Kurzform. <i>fehlt im WME</i>: die Straße fehlt, der gezeigte Name ist der der Nachbarstraße.</td></tr><tr><td>&#x2713; Parkplatz</td><td>kein benanntes Segment, aber ein naher Parkplatz-Ort trägt den BAN-Namen: nichts umzubenennen.</td></tr><tr><td>&#x2713; BAN-Schreibung</td><td>gleicher Name bis auf einen Bindestrich oder Punkt („Rue Paul-Louis Courier“ / „Rue Paul Louis Courier“): nichts umzubenennen.</td></tr></table><p>Eine fehlende Nummer in Orange mit <b>≠</b> steht im WME mit anderem Zusatz (12 b / 12bis): prüfen. Hat WME nur die bloße Nummer (32 / 32 B), wird sie trotzdem gesetzt, die Warnung bleibt.</p><p>&#x26A0; markiert einen BAN-Namen, den kein Segment der Gemeinde trägt.</p>',
            hLimitsT: 'Gut zu wissen',
            hLimitsB: "<p>Ein ganzes Département dauert einige Minuten: die BAN wird Gemeinde für Gemeinde gelesen, das WME in Kacheln von etwa 5 km. Die Schaltfläche Anhalten unterbricht; das Erledigte bleibt sichtbar, und fehlgeschlagene Gemeinden lassen sich einzeln wiederholen.</p><p>Paris, Marseille und Lyon werden Bezirk für Bezirk gelesen. Die Scans bleiben nur in diesem Browser (IndexedDB), nie anderswo, zusammen mit Ihren Einstellungen (Bereich, Schalter, Fensterposition, Punktfarben); sie werden markiert, wenn sich BAN oder WME seitdem geändert haben.</p>",
            hSafeB: "Das Skript ändert die Karte nur auf Anforderung eines Editors: das „+“ einer Adresse (eine Nummer oder ein RPP, alle Ränge); und für einen L6 „Hausnummern hinzufügen“ (Straße für Straße: Nummern und RPP am Ende einer Zufahrt), „⇄“ (ein RPP durch eine Nummer ersetzt) und „Diese Nummer in einen RPP umwandeln“ — höchstens 500 pro gleitender Stunde und Editor; es speichert nie. Seine Ergebnisse bleiben in diesem Browser.",
            remTitle: "Sie bleiben für Ihre Bearbeitungen verantwortlich",
            remBody: "<p>WME BAN Coverage <b>schlägt vor</b>: es speichert nie selbst etwas.</p><p>Jede Hausnummer, jeder RPP und jede Umwandlung „⇄“ kommt in WME als ausstehende Änderung an. Prüfen Sie sie auf der Karte, dann speichern Sie sie in WME oder machen Sie sie dort rückgängig.</p><p>Was Sie speichern, ist Ihre Bearbeitung, als hätten Sie sie von Hand gemacht.</p>",
            remNote: "Dieser Hinweis erscheint einmal pro Browser; im Skript-Tab können Sie ihn erneut ansehen.",
            remOk: "Verstanden",
            remCancel: "Abbrechen",
            remLink: "Hinweis zur Verantwortung erneut anzeigen",
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
            renomRelance: n => n + (n > 1 ? ' Straßen seit der Analyse in WME umbenannt: die Zahlen der Gemeinde sind aktualisiert.' : ' Straße seit der Analyse in WME umbenannt: die Zahlen der Gemeinde sind aktualisiert.'),
            renomNeuf: n => 'Neues Segment in WME bei ' + n + (n > 1 ? ' Straßen ohne Segment: die Zahlen der Gemeinde sind aktualisiert.' : ' Straße ohne Segment: die Zahlen der Gemeinde sind aktualisiert.'),
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
            filterClear: 'Filter löschen',
            filterCount: (n, m) => n + (un1(n) ? ' Straße von ' : ' Straßen von ') + m,
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
            sbRppNum: "RPP-Hausnummern",
            sbRppNumHint: "Schreibt die Hausnummer unter das Dreieck jedes in WME geladenen Wohnorts (RPP), ab Zoom 17: kein Klick mehr nötig, um zu wissen, welcher es ist. Nur Anzeige.",
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
            smallTip: "Kleines Fenster (ursprüngliche Größe)",
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
            tipMemoOpen: "Das Fenster mit diesem Durchlauf öffnen und die Karte darauf ausrichten.",
            tipMemoClear: "Alle in diesem Browser gespeicherten Durchläufe löschen (zwei Klicks).",
            tipSbOpen: "Das WBC-Fenster öffnen (wie der Knopf rechts an der Karte).",
            tipColorsReset: "Die Punktfarben auf die Standardwerte zurücksetzen.",
            tipHelpHdr: "Diesen Teil der Hilfe auf- oder zuklappen.",
            tipFab: "Fenster öffnen oder schließen",
            dirZoom: n => 'BAN-Adressen: auf Stufe ' + n + ' oder mehr zoomen',
            dirLoading: 'BAN-Adressen: wird gelesen…',
            dirNone: 'BAN-Adressen: keine in der Ansicht',
            dirCount: n => n + (un1(n) ? ' BAN-Adresse in der Ansicht' : ' BAN-Adressen in der Ansicht'),
            dirCap: (n, m) => n + ' von ' + m + ' BAN-Adressen angezeigt: hineinzoomen, um alle zu sehen',
            dirErr: m => 'BAN-Adressen: Lesen fehlgeschlagen — ' + m,
            dirEdition: d => 'Ausgabe vom ' + d,
            dirSource: 'Quelle: Base Adresse Nationale (adresse.data.gouv.fr), bereitgestellt von der Géoplateforme des IGN — Licence Ouverte Etalab 2.0. Nur lesend: nichts wird geschrieben; WBC im Menü Ebenen abwählen, um sie auszublenden.',
            dirFiche: 'BAN, Ansicht ohne Analyse',
            dirWme: p => 'davon ' + p + ' schon im WME',
            dirFicheWme: 'Schon im WME (gleiche Nummer, gleiche Straße oder im Umkreis von 30 m)',
            dirFicheAbs: 'Nicht unter den im WME geladenen Nummern',
            tipFabCtrl: mac => (mac ? 'Cmd' : 'Strg') + '+Klick: die BAN der Gemeinde in der Kartenmitte anzeigen',
            fabBusy: 'Gemeinde in der Kartenmitte wird analysiert…',
            fabErr: m => 'Fehlgeschlagen: ' + m,
            fabDeja: 'Eine Analyse läuft bereits.',
            tipVoie: "Die Straße aufklappen (ihre Nummern, fehlende in Rot) und die Karte darauf ausrichten.",
            tipCommune: "Die Details dieser Gemeinde öffnen und die Karte darauf ausrichten.",
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
            dejaRelaunchTip: "Startet die ganze Analyse erneut.",
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
            ponctTag: "BAN-Schreibung",
            tipOrtho: "Die Schreibung weicht um ein, zwei Buchstaben ab",
            tipPonct: "Die BAN schreibt diesen Namen nicht korrekt (Bindestrich, Punkt…): der WME-Name bleibt, Hausnummern werden trotzdem hinzugefügt",
            partielTag: "gekürzt",
            tipPartiel: "Ein Name ist die Kurzform des anderen",
            absentTag: "fehlt im WME",
            altTag: "alt",
            parkTag: "Parkplatz",
            tipPark: "Kein benanntes Segment: der BAN-Name steht am nahen Parkplatz-Ort (Parkplatzstraßen bleiben unbenannt).",
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
            kFar: n => 'davon ' + n + ' weit vom BAN-Punkt',
            kArret: n => n + ' entfernte(r) Ankunftspunkt(e)',
            hovArret: d => 'Ankunftspunkt ' + d + ' m zu weit',
            arrT: (n, s) => 'Entfernte Ankunftspunkte (' + n + ', über ' + s + ' m)',
            arrTip: d => 'Der Ankunftspunkt liegt ' + d + ' m weiter als die Straße neben der WME-Nummer: in WME prüfen',
            sbArret: 'Entfernte Ankunftspunkte melden ab',
            sbArretHint: 'Abstand zwischen der WME-Nummer und dem Ort, zu dem Waze führt, abzüglich ihres Abstands zur Straße. Sofort angewendet, ohne neue Analyse.',
            tipFar: d => 'Liegt ' + d + ' m von der BAN-Adresse entfernt',
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
            banVoie: 'An die BAN melden',
            banVoieTip: 'Öffnet das offizielle Meldewerkzeug der BAN für diese Straße, um eine Namensänderung zu beantragen. Nichts wird gesendet, bevor Sie das Formular abschicken.',
            banNumTip: n => 'Nummer ' + n + ' an die BAN melden: das offizielle Werkzeug öffnet sich auf dieser Adresse (Änderung oder Löschung). Nichts wird gesendet, bevor Sie das Formular abschicken.',
            banNoKey: 'Hier keine BAN-Kennung: die BAN-Karte öffnet sich an der richtigen Stelle. Eine Nummer anklicken, dann den Straßennamen, falls die Straße betroffen ist, und „Signaler un problème“.',
            banOff: m => 'Diese Gemeinde nimmt keine Online-Meldungen an' + (m ? ': ' + m : '.') + ' Die offizielle Seite öffnet sich trotzdem, mit der Kontaktadresse des Rathauses: der Rest erfolgt per E-Mail.',
            banMap: 'Auf der BAN-Karte ansehen',
            banMairie: 'Rathaus kontaktieren',
            banAmbig: 'Achtung: in dieser neuen Gemeinde gibt es denselben BAN-Schlüssel in mehreren Ortsteilen; die angezeigte Adresse vor dem Melden prüfen.',
            banTropTip: n => 'Der BAN melden, dass ' + n + ' fehlt: das offizielle Werkzeug öffnet sich an seiner Position (Meldung „fehlende Adresse“). Nichts wird gesendet, bevor Sie das Formular abschicken.',
            sigT: (n, a) => 'Meldungen an die BAN (' + n + (a ? ', davon ' + a + ' offen' : '') + ')',
            sigTip: 'Alle an die BAN gesendeten Meldungen für diese Gemeinde (von allen), mit ihrem Ergebnis. Ein Klick zentriert die Karte.',
            sigVoieT: n => 'Meldungen an die BAN zu dieser Straße (' + n + ')',
            sigSt: s => ({ PENDING: 'offen', PROCESSED: 'bearbeitet', IGNORED: 'abgelehnt', EXPIRED: 'abgelaufen' })[s] || s,
            sigDem: (k, v) => ({ nom: 'Name → ' + v, num: 'Nummer → ' + v, voie: 'Straße → ' + v, del: 'Löschung', create: 'Anlage', missing: 'fehlende Adresse', autre: 'Position oder Flurstücke' })[k] || k,
            sigMotif: m => 'Begründung: ' + m,
            sigDeja: (d, st) => 'Bereits gemeldet am ' + d + ' (' + st + ').',
            snbT: (v, a) => 'Straßen ohne Namen in der BAN (' + v + ' Straßen, ' + a + ' Adressen)',
            snbTip: 'Die Gemeinde hat diese Adressen unter einem Platzhalternamen veröffentlicht („Non renseigné“…): im WME ist nichts zu setzen, solange sie die Straße nicht benennt. Eine Zeile pro BAN-Straße, außerhalb der Abdeckungsquote. Melden oder mit dem Rathaus klären.',
            snbPres: n => 'nahe „' + n + '“ im WME',
            snbNone: 'keine benannte WME-Straße in der Nähe',
            dejaOld: 'Scan einer früheren WBC-Version, deren Ergebnisse abweichen: erneut starten.',
            ajHnAdd: n => 'Hausnummern hinzufügen (' + n + ')',
            nextStreet: n => 'Nächste Straße (' + n + ' hinzuzufügen)',
            tipNextStreet: 'Öffnet die Straße der Gemeinde, in der „Hinzufügen“ die meisten Nummern zu setzen hat (BAN-Name als Haupt- oder Alternativname), und überspringt die mit dieser Schaltfläche bereits geöffneten Straßen.',
            nextStreetNone: 'Keine weitere Straße bereit: Die übrigen haben ihre Nummern, oder ihr Name muss zuerst korrigiert werden.',
            ajHnAddTip: r => 'Nur L6: setzt in WME die fehlenden Nummern dieser Straße, auf den Segmenten, deren Hauptname der BAN-Name ist (Akzente, Groß-/Kleinschreibung, Bindestriche und Punkte toleriert) und deren Stadt die Gemeinde oder „Village (Commune)“ ist; eine Adresse am Ende einer Zufahrt wird ein RPP. Höchstens 500 Bearbeitungen pro gleitender Stunde, beim Speichern gezählt (übrig: ' + r + '). Nichts wird gespeichert: prüfen, dann in WME speichern. Adressen außerorts werden ebenfalls RPP.',
            ajHnNoName: 'Der WME-Name dieser Straße ist nicht der BAN-Name: automatisches Hinzufügen erfordert einen mit der BAN identischen Hauptnamen.',
            ajHnNone: 'Auf dieser Straße kann keine Nummer automatisch hinzugefügt werden.',
            ajHnLoin: n => 'Keine Nummer automatisch hinzuzufügen: ' + n + ' Adresse(n) mehr als 80 m von der in WME gezeichneten Straße entfernt. Rücke das Segment näher, falls es falsch liegt.',
            ajHnNomEcart: (w, b) => 'Keine Nummer automatisch hinzuzufügen: Die Segmente dieser Straße heißen im WME „' + w + '“, nicht „' + b + '“ wie in der BAN. Gib ihnen den BAN-Namen.',
            ajHnQuota: h => 'Kontingent erreicht (500 Nummern pro Stunde): nächstes Hinzufügen um ' + h + ' möglich.',
            ajHnRunning: 'Hausnummern werden hinzugefügt…',
            bgTab: 'Tab im Hintergrund: Chrome verlangsamt die laufende Arbeit (bis zu 3-mal länger). Diesen Tab im Vordergrund lassen.',
            bgTabTip: 'Chrome drosselt die Timer eines verborgenen Tabs (einer pro Sekunde, nach 5 Minuten einer pro Minute) und senkt seine Priorität. Gemessen am 29.09.2026: ein Département 41 Min. im Hintergrund gegen 13 Min. im Vordergrund.',
            ajHnDone: (n, r) => n + (un1(n) ? ' Nummer gesetzt' : ' Nummern gesetzt') + ' — prüfen, dann in WME speichern. Verbleibendes Kontingent: ' + r + '.',
            ajHnDoneMix: (n, r, q) => n + (un1(n) ? ' Nummer' : ' Nummern') + ' und ' + r + ' RPP gesetzt — prüfen, dann in WME speichern. Verbleibendes Kontingent: ' + q + '.',
            ajHnDoneRpp: (r, q) => r + ' RPP gesetzt — prüfen, dann in WME speichern. Verbleibendes Kontingent: ' + q + '.',
            ajRppCrit: l => '⚠️ Von Hand zu korrigieren: ' + l + '.',
            ajRppCritPoi: n => 'RPP ' + n + ' ohne Adresse geblieben',
            ajHnStopTip: 'Das laufende Hinzufügen nach der aktuellen Setzung anhalten; Gesetztes bleibt und ist zu prüfen.',
            ajHnStopping: 'Anhalten angefordert…',
            ajHnStopped: 'Auf Ihren Wunsch angehalten.',
            ajHnFail: n => n + (un1(n) ? ' Setzung fehlgeschlagen' : ' Setzungen fehlgeschlagen') + ' (Details in der Konsole).',
            rhnUnsaved: 'Speichern (oder verwerfen) Sie zuerst die ausstehenden Änderungen: WME lässt Skripte nicht mehr lesen, was nicht gespeichert ist, und „⇄“ darf weder eine Nummer verdoppeln noch ein gelöschtes Objekt zurückholen.',
            rhnLock: n => 'Dieser RPP ist auf Stufe ' + n + ' gesperrt, über Ihrem Rang: die Umwandlung wird beim Speichern zu einem Vorschlag.',
            rhnLockInfo: n => 'Der entfernte RPP war auf Stufe ' + n + ' gesperrt.',
            rhnSegLock: n => (n ? 'Das Segment ist auf Stufe ' + n + ' gesperrt, über Ihrem Rang' : 'WME lässt Sie die Hausnummern dieses Segments nicht direkt bearbeiten') + ': die Umwandlung wird beim Speichern zu einem Vorschlag.',
            suggAttente: 'WME hat diese Änderung nicht als Vorschlag behalten: speichern (oder verwerfen) Sie zuerst Ihre offenen direkten Änderungen — WME speichert Vorschläge und direkte Änderungen nie zusammen.',
            suggMixte: 'Nichts wird umgewandelt: eines der beiden Objekte wäre ein Vorschlag, das andere eine direkte Änderung, und WME speichert sie nicht zusammen. Fragen Sie einen Editor mit ausreichendem Rang.',
            rhnCritRpp: n => 'RPP ' + n + ' entfernt, ohne gesetzte Nummer: im WME rückgängig machen (Strg+Z)',
            ajHnSansAlt: (r, c) => 'Einige Segmente außerorts tragen „' + r + '“ ohne Stadt, aber ohne den Alternativnamen „' + r + ' / ' + c + '“: das „+“ setzt dort trotzdem ein RPP, der Alternativname sollte aber ergänzt werden.',
            ajHnSansAltRoute: (r, c) => 'Einige Segmente außerorts haben eine Straßennummer als Hauptnamen, ohne Stadt, aber nicht den Alternativnamen „' + r + ' / ' + c + '“: das „+“ setzt dort trotzdem ein RPP, der Alternativname sollte aber ergänzt werden.',
            rhnT: n => 'RPP dieser Straße (' + n + ')',
            rhnTip: 'RPP auf der Karte zeigen. Beim Überfahren ersetzt „⇄“ ihn durch eine Segmentnummer, wenn der Fall eindeutig ist.',
            rhnConv: 'Diesen RPP durch eine Nummer ersetzen',
            rhnConvTip: 'Ersetzt innerorts diesen RPP durch eine Nummer am Segment — nur in eindeutigen Fällen (gleiche Nummer schon an der Straße, oder Zugangspunkt / Lage an der eigenen Straße, wie WME Naming Auditor). Abgelehnt, wenn der RPP einen Namen oder ein Foto hat. Zählt zum Kontingent; nichts wird gespeichert.',
            rhnDone: (n, q) => 'RPP Nr. ' + n + ' durch eine Nummer am Segment ersetzt — prüfen, dann in WME speichern. Verbleibendes Kontingent: ' + q + '.',
            rhnDoneDbl: (n, q) => 'Nr. ' + n + ' war schon an der Straße: der doppelte RPP wird entfernt — prüfen, dann in WME speichern. Verbleibendes Kontingent: ' + q + '.',
            rhnNotFound: 'RPP an dieser Stelle in WME nicht gefunden (seit der Analyse verschoben, geändert oder gelöscht?): Analyse neu starten.',
            rhnNoPlaces: 'Im WME ist kein Ort geladen: Die Ebene „Orte“ ist vermutlich ausgeblendet. Einblenden und erneut versuchen.',
            rhnNamed: 'Dieser RPP hat einen Namen: er wird nicht umgewandelt (von Hand prüfen).',
            rhnPhoto: 'Dieser RPP hat ein Foto: er wird nicht umgewandelt (jemand war vor Ort; von Hand prüfen).',
            rhnCity: v => 'Dieser RPP gehört zu „' + v + '“, nicht zur Gemeinde: er wird nicht umgewandelt.',
            rhnStreet: r => 'Dieser RPP trägt die Straße „' + r + '“, nicht den BAN-Namen der Straße: er wird nicht umgewandelt.',
            rhnNoSeg: 'Kein Segment der Straße (BAN-Name als Hauptname, Gemeinde als Stadt) innerhalb von 80 m: der RPP liegt wohl außerorts, er bleibt.',
            rhnLegit: v => 'Der Zugangspunkt des RPP führt auf „' + v + '“, nicht auf seine Straße: der RPP drückt einen Versatz aus, den eine Segmentnummer nicht kann, er bleibt.',
            rhnUnsure: 'Nichts Eindeutiges (andere Straße gleich nah, oder zu weit von jeder Straße): der RPP bleibt, von Hand prüfen.',
            rhnFormat: n => 'Die Nummer „' + n + '“ ist nicht wie eine Segmentnummer geschrieben: von Hand prüfen.',
            rhnErr: m => 'Ersetzen abgebrochen: ' + m,
            rhnPoseTip: 'Durch eine Nummer ersetzt (noch nicht gespeichert).',
            rhnVersRpp: 'Diese Nummer in einen RPP umwandeln',
            rhnVersRppTip: 'Entfernt diese Nummer vom Segment und legt an ihrer Stelle einen RPP an (gleiche Nummer, gleiche Straße), Zugangspunkt am nächsten unbenannten Segment oder an einer Zufahrt (Privatweg, Parkplatzweg); der RPP wird danach ausgewählt, um den Zugang anzupassen. Zählt zum Kontingent; nichts wird gespeichert.',
            rhnVersRppDone: (n, q) => 'Nr. ' + n + ' in einen RPP umgewandelt — Zugangspunkt bei Bedarf anpassen (er ist ausgewählt), dann in WME speichern. Verbleibendes Kontingent: ' + q + '.',
            rhnVersRppAbsent: n => 'Nummer ' + n + ' in WME nicht gefunden (Segment nicht geladen oder Nummer schon entfernt): nichts geändert.',
            rhnVersRppTipPose: 'In einen RPP umgewandelt (noch nicht gespeichert).',
            ajHnSkip: n => n + (un1(n) ? ' Adresse übersprungen' : ' Adressen übersprungen') + ' (Details in der Konsole).',
            ajHnCut: (n, h) => n + (un1(n) ? ' Adresse nicht gesetzt' : ' Adressen nicht gesetzt') + ': Kontingent erreicht, weiter ab ' + h + '.',
            ajHnNoSeg: 'Kein geladenes Segment trägt genau diesen Namen als Hauptnamen mit der Gemeinde als Stadt: nichts wurde gesetzt.',
            ajHnErr: m => 'Hinzufügen abgebrochen: ' + m,
            ajHnRights: '„Hausnummern hinzufügen“ für eine ganze Straße ist L6-Editoren vorbehalten; das „+“ einer einzelnen Nummer und die Umwandlungen „⇄“ stehen allen Rängen offen.',
            ajHnSee: n => (un1(n) ? 'Sie ist' : 'Sie sind') + ' auf der Karte türkis eingekreist.',
            ajHnPoseTip: 'Von WBC gesetzt, noch nicht gespeichert: klicken, um die Karte darauf zu zentrieren.',
            ajHnSaved: (c, r, q) => 'Gespeichert: ' + c + (un1(c) ? ' Nummer gezählt' : ' Nummern gezählt') + ', ' + r + ' dem Kontingent zurückgegeben (vor dem Speichern entfernt). Verbleibendes Kontingent: ' + q + '.',
            ajHnSavedTip: 'Von WBC gesetzt und gespeichert.',
            hHnT: 'Hausnummern hinzufügen',
            hHnB: '<p><i>Hausnummern hinzufügen</i> für eine ganze Straße: nur <b>L6</b>-Editoren. <b>Eine Nummer nach der anderen</b> und die Umwandlungen <b>⇄</b> (Nummer → RPP, RPP → Nummer) stehen <b>allen Rängen</b> offen, mit denselben Prüfungen und demselben Kontingent; ohne Recht auf das Segment oder den RPP (Sperre über Ihrem Rang) macht WME beim Speichern einen Vorschlag daraus — sofern keine direkte Änderung offen ist, und bei einer Umwandlung nur, wenn beide Objekte im selben Fall sind. In der aufgeklappten Zeile einer Straße setzt <i>Hausnummern hinzufügen</i> ihre fehlenden Adressen im WME — <b>Straße für Straße</b>, nie für eine ganze Gemeinde. Für eine einzelne Nummer: das „+“ an ihrem Feld (beim Überfahren) oder ein Klick auf ihren Punkt auf der Karte. Die Rechte des WME gelten: für eine einzelne Nummer oder eine Umwandlung ergibt ein Segment, das über Ihrem Rang gesperrt ist (oder außerhalb Ihrer Bearbeitungsgebiete liegt), beim Speichern einen Vorschlag; <i>Hausnummern hinzufügen</i> für eine ganze Straße überspringt solche Segmente, und die Meldung sagt es.</p><p><b>Bedingungen</b>: der Hauptname der Segmente ist der BAN-Name (Akzente, Groß-/Kleinschreibung, Apostrophe, Leerzeichen, Bindestriche und Punkte werden toleriert; eine abweichende Schreibung wird nur gemeldet) und ihre Stadt ist die Gemeinde oder „Village (Commune)“. Jede Nummer kommt zum nächsten zugelassenen Segment (höchstens 80 m); eine schon vorhandene Nummer, auch ausstehend in diesem Tab, wird nie erneut gesetzt; ein anderer (12 b / 12bis) oder numerischer Zusatz bleibt dem Editor überlassen, außer WME hat nur die bloße Nummer (32 für 32 B): dann wird sie gesetzt, mit einer Warnung.</p><p><b>Nichts wird gespeichert</b>: gesetzte Nummern sind auf der Karte türkis eingekreist (auch bei geschlossenem Fenster) und in der Straße mit ✚ markiert; prüfen, dann im WME speichern oder rückgängig machen.</p><p><b>Kontingent</b>: 500 Nummern pro gleitender Stunde. Eine Nummer wird beim Setzen reserviert und gezählt, wenn sie nach dem Speichern auf dem Server steht; vorher entfernt oder geändert, wird sie zurückgegeben. Von Hand eingegebene Nummern zählen nie. Gespeichert gelten sie als „gefunden“, ohne neue Analyse; ein älterer gespeicherter Scan weist darauf hin („neu starten“). Das Abzeichen &#x271A; im Fensterkopf zeigt den Rest: orange unter 20 %, rot unter 5 %.</p><p><b>RPP</b>: eine Adresse am Ende einer Zufahrt (Privatweg oder Parkplatzweg innerhalb von 80 m, ihre Straße innerhalb von 250 m) wird ein Wohnort (RPP), auch über die Schaltfläche der Straße. Eine Adresse außerorts (Segment, dessen Hauptname keine Stadt hat und das den BAN-Namen mit der Gemeinde als Alternativnamen trägt) wird ein RPP, über die Schaltfläche der Straße wie über das „+“. Der RPP wird an der BAN-Position angelegt, mit seiner Adresse und seinem Zugangspunkt am nächsten Segment (oder an der Zufahrt); eine abgelehnte Adresse entfernt den Ort. Seine Sperre ist die, die WME standardmäßig vergibt (keine Tabelle für Frankreich legt eine für RPP fest). RPP zählen zum Kontingent. Eine Adresse ohne Segment mit dem BAN-Namen innerhalb von 80 m, aber nahe einer befahrbaren Straße anderen Namens, wird ebenfalls zu einem RPP: Adresse „BAN-Name / Gemeinde“, Zufahrt über diese Straße.</p><p><b>Nummer → RPP</b>: in der Blase des Kartenpunkts einer Nummer (gespeichert, oder von WBC gesetzt und noch nicht gespeichert) entfernt „⇄ Diese Nummer in einen RPP umwandeln“ die Nummer und legt an ihrer Stelle einen RPP an (gleiche Nummer, gleiche Straße), Zugangspunkt am nächsten unbenannten Segment oder an der nächsten Zufahrt (Kreisverkehr, Privatweg…); der RPP wird danach ausgewählt, um seinen Zugang anzupassen. Eine von WBC gesetzte Nummer ändert im Kontingent nur ihre Art; eine gespeicherte Nummer zählt 2.</p><p><b>RPP → Nummer</b>: In der aufgeklappten Straße haben die RPP der Straße eigene Felder; beim Überfahren ersetzt „⇄“ EINEN RPP durch eine Nummer am Segment, nur in eindeutigen Fällen (wie WME Naming Auditor): gleiche Nummer schon an der Straße innerhalb von 150 m (der RPP ist doppelt und wird einfach entfernt), oder Zugangspunkt — sonst Lage — an der eigenen Straße ohne andere Straße innerhalb von 10 m. Ein Zugangspunkt zu einer anderen Straße beweist, dass der RPP berechtigt ist: er bleibt. Abgelehnt bei Name oder Foto, anderer Stadt oder anderer Straße. Auch per Klick auf seinen Punkt auf der Karte. Gleiches Kontingent; nichts wird gespeichert. Die Sperre des RPP wird gelesen: über Ihrem Rang wird die Ersetzung beim Speichern zu einem Vorschlag; sonst nennt die Meldung sie. Es darf keine Änderung auf das Speichern warten (WME lässt Skripte Ausstehendes nicht mehr lesen); ein Ersatz zählt 2 zum Kontingent (RPP entfernt, Nummer gesetzt). Auch durch Auswahl des RPP-Dreiecks in WME (WBC-Fenster offen).</p><p><b>Anhalten</b>: während eine lange Straße gefüllt wird (die Karte wandert von Bereich zu Bereich), unterbricht die Schaltfläche Anhalten den Durchgang; Gesetztes bleibt und ist zu prüfen. Eine fehlgeschlagene Setzung wird in der Meldung gezählt. <b>Grenze</b>: eine von Hand eingegebene, noch nicht gespeicherte Nummer wird nicht als Doppel erkannt — vor dem Hinzufügen auf derselben Straße speichern. Zwei gleichzeitig geöffnete WME-Tabs sehen die ausstehenden Einträge des anderen nicht: nur aus einem Tab setzen.</p>',
            ajHnQuotaTip: 'Gleitende Stunde: eine Nummer zählt eine Stunde ab dem Setzen. Gezählt werden nur mit dieser Schaltfläche gesetzte und tatsächlich gespeicherte Nummern.',
            ajHnLeft: n => 'Kontingent: ' + n + ' übrig in dieser Stunde',
            ajHnFull: h => 'Kontingent erreicht — nächstes Hinzufügen um ' + h,
            ajHn1: 'Diese Nummer hinzufügen',
            ajHn1Tip: 'Setzt nur diese Nummer im WME (alle Ränge), mit den Prüfungen von „Hausnummern hinzufügen“ (BAN-Name, Stadt, Segment innerhalb von 80 m, Duplikat); zählt zum Kontingent. Nichts wird gespeichert.',
            ajHn1Exists: n => 'Nummer ' + n + ' ist auf dieser Straße schon im WME: nichts gesetzt.',
            ajHn1Rights: 'WME hat Sie nicht als Editor erkannt (Name und Rang nicht lesbar): WME neu laden und erneut versuchen.',
            ajHn1Lock: (n, v) => 'Nummer ' + n + ' wird beim Speichern zu einem Vorschlag: ' + (v ? 'das Segment ist auf Stufe ' + v + ' gesperrt, über Ihrem Rang' : 'WME lässt Sie die Hausnummern des Segments nicht direkt bearbeiten') + '; ein Editor mit ausreichendem Rang gibt ihn frei.',
            ajHn1Bloque: v => (v ? 'Das Segment ist auf Stufe ' + v + ' gesperrt, über Ihrem Rang' : 'Das Segment liegt außerhalb Ihrer Bearbeitungsgebiete') + ': diese Nummer wird beim Speichern zu einem Vorschlag, den ein Editor mit ausreichendem Rang freigibt.',
            ajHnLockSkip: n => n + (un1(n) ? ' Nummer nicht gesetzt' : ' Nummern nicht gesetzt') + ': Segment, das WME Sie nicht bearbeiten lässt (Sperre oder Bearbeitungsgebiete).',
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
            hTrackB: '<p><b>Département-Karte</b>: nach einem Département ist jede Gemeinde nach ihrer Abdeckung eingefärbt (hell = wenig, dunkel = viel). Beim Überfahren erscheinen ihre Zahlen; herausgezoomt öffnet ein Klick sie.</p><p><b>Fehlende Nummer</b>: bei geöffneter Straße führt eine gepunktete Linie zum Segment, das sie wahrscheinlich tragen sollte; seine ID steht in der CSV.</p><p><b>Segmente auswählen</b> einer Straße aus ihrer Zeile: sie werden im WME ausgewählt.</p><p><b>Fortschritt</b>: der CSV-Export dient auch als Stand. Später liest <i>Vergleichen</i> ihn wieder ein und zeigt die Änderung Straße für Straße (oder Gemeinde für Gemeinde). Nichts wird anderswo gespeichert.</p><p><b>Abweichungen (CSV)</b>: die umzubenennenden Straßen, jede mit einem WME-Link, zum Korrigieren oder zur Weitergabe an die Gebietsverantwortlichen.</p><p><b>Straßenwerkzeuge</b>: In der aufgeklappten Zeile einer Straße Symbole mit Zähler — Segmente auswählen, Hausnummern hinzufügen, nächste Straße, an die BAN melden oder das Rathaus kontaktieren; der Name erscheint beim Überfahren.</p><p><b>Gemeindegrenze</b>: Das Polygon-Symbol neben den Exporten zeichnet die Verwaltungsgrenze der Gemeinde auf die Karte; die Wahl bleibt gespeichert.</p>',
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
            memoWmeProg: (i, n) => 'WME: Prüfung ' + i + '/' + n,
            memoWmeOk: 'WME unverändert',
            memoWmeMaj: d => 'WME bearbeitet' + (d ? ' (' + d + ')' : ''),
            memoWmeMajN: n => 'WME bearbeitet: ' + n,
            memoUpd: 'Aktualisieren',
            memoUpdTip: 'Liest BAN und WME für diese Gemeinde neu und aktualisiert das Ergebnis, in einem Schritt.',
            memoUpdDepTip: 'Prüft BAN und WME jeder Gemeinde und scannt die geänderten erneut.',
            contourBtn: 'Gemeindegrenze',
            contourTip: 'Zeigt oder verbirgt die Verwaltungsgrenze der Gemeinde auf der Karte (geo.api.gouv.fr, für die Analyse bereits gelesen).',
            memoTagBan: 'BAN seit dem Durchlauf aktualisiert',
            memoTagWme: 'WME seit dem Durchlauf bearbeitet',
            secMemo: 'Gespeicherte Durchläufe',
            memoHint: 'Nur in diesem Browser gespeichert. Beim erneuten Öffnen sofort angezeigt, mit Prüfung, ob sich die BAN seitdem geändert hat.',
            memoNone: 'Noch kein gespeicherter Durchlauf.',
            memoOpen: 'Öffnen',
            memoDel: 'Diesen Durchlauf löschen',
            memoClear: 'Alle löschen',
            memoErr: m => 'Der Durchlauf konnte nicht gespeichert werden: ' + m,
            hMemoT: 'Gespeicherte Durchläufe und Aktualisierungen',
            hMemoB: '<p>Jeder Durchlauf wird in diesem Browser gespeichert (nichts wird verschickt). Dieselbe Gemeinde oder dasselbe Département erneut wählen, oder <i>Öffnen</i> im Skripte-Reiter, zeigt ihn sofort mit Datum. Auch <i>Analysieren</i> erinnert daran: Wurde derselbe Bereich schon durchlaufen, erscheint sein Datum mit <i>Öffnen</i> und <i>Neu starten</i>. Hat WBC seitdem Hausnummern in diesem Bereich hinzugefügt, sagt es das Banner, und <i>Neu starten</i> wird zur Hauptschaltfläche.</p><p><b>Aktualisieren</b>: Für eine Gemeinde werden BAN und WME neu gelesen und das Ergebnis ersetzt. Für ein Département wird die Adressdatei jeder Gemeinde geprüft (eine Anfrage pro Gemeinde), dann wird das WME neu gelesen, Hausnummern eingeschlossen (Segmente, jede Hausnummer — Hausnummern haben im WME kein Datum — und Wohnorte); geänderte Gemeinden werden neu gescannt, die anderen bleiben.</p><p>Geänderte Gemeinden tragen eine BAN- oder WME-Markierung und auf der Karte einen orangen Rand, bis sie neu gescannt sind.</p>',
            memoClearSure: 'Zum Löschen aller erneut klicken',
        },
        es: {
            sbHint: 'Compara la base nacional de direcciones (BAN) con los números y los puntos residenciales (RPP) de WME, para un municipio o un departamento entero.',
            sbOpen: 'Abrir la ventana',
            sbHelp: 'Ayuda',
            hWhatT: 'Qué se compara',
            hWhatB: "<p>La <b>BAN</b> es la referencia: cada dirección que recoge debería existir en WME, como número en un segmento (HN) o como punto residencial (RPP).</p><p><b>Fuentes</b>, leídas en directo: la <b>Base Adresse Nationale</b> (adresse.data.gouv.fr, Estado francés; Licence Ouverte Etalab 2.0; se muestra la fecha de revisión de cada municipio); los límites y listas de municipios de <b>geo.api.gouv.fr</b> (API Découpage administratif, datos del INSEE y del IGN, Licence Ouverte Etalab 2.0); la <b>API pública de señalamientos de la BAN</b> (signalement.adresse.data.gouv.fr) para el estado de los señalamientos; y WME en los mismos servidores que el editor. No hace falta mostrar ni cargar la zona. Desde el 12/11/2026, Waze acredita la BAN para Francia (visualización y creación asistida de números de portal, página Map Data Attribution); añadir una calle entera sigue siendo un gesto de L6; un número cada vez está abierto a todos los rangos; todo con cuota.</p><p><b>Lo que sale del navegador</b>: a geo.api.gouv.fr, en modo «Centro del mapa», el centro del mapa REDONDEADO a 3 decimales (unos 100 m) y sus búsquedas de municipio — sin identidad ni cookie; a la BAN y a la API de señalamientos, el código del municipio; al arrancar, GitHub (version-min.json, versión mínima: una versión retirada no arranca) y GreasyFork (versión nueva) solo se leen. A data.geopf.fr (Géoplateforme del IGN), con la casilla WBC del menú Capas marcada: la extensión de la vista, a partir del zoom 18, sin cookie. Nada más; su nombre de usuario no va a ningún tercero (solo al Discuss de Waze, para el botón Copiar).</p><p><b>Señalar a la BAN</b>: abre la herramienta oficial (signalement.adresse.data.gouv.fr) en una pestaña nueva, en la calle o el número; WBC no envía nada, usted rellena y envía el formulario. Para un número de WME que falta en la BAN, el comentario prellenado lleva la dirección leída en Waze («Adresse présente dans Waze: …»): revíselo, cámbielo o bórrelo antes de enviar.</p><p><b>BAN de la vista</b>: con la casilla WBC del menú Capas marcada y ningún análisis mostrado en ese lugar, las direcciones BAN de la vista aparecen a partir del zoom 18, en gris (solo lectura); rodeadas de verde cuando WME ya tiene el mismo número en la misma calle o a menos de 30 m (números guardados, puntos residenciales). <b>Ctrl+clic</b> (Cmd+clic en Mac) en el botón del mapa: el municipio del centro se analiza, o se reabre su barrido reciente, y se muestra en el mapa sin abrir la ventana. Mientras la ventana de WBC está abierta, se muestran las capas de WME «Números de portal» y «Residencial»; al cerrarla, vuelven a su estado anterior.</p>",
            hMatchT: 'Cuándo se encuentra un número',
            hMatchB: '<p>Una dirección BAN se encuentra cuando WME tiene el mismo número (sufijos incluidos: <i>bis</i>, <i>ter</i>, letras) a menos de 150 m, y:</p><table class="wbc-help-table"><tr><td>1</td><td>en una calle con el mismo nombre (principal o alternativo), o que solo difiere en un artículo («Avenue Sembrancher» = «Avenue de Sembrancher»; la diferencia de nombre se sigue señalando);</td></tr><tr><td>2</td><td>o en un segmento que lleva las direcciones de esa calle, <b>con nombre o sin él</b>;</td></tr><tr><td>3</td><td>o a menos de 30 m de la dirección.</td></tr></table><p>La regla 1 se prueba primero en todas partes, luego la 2, luego la 3. Un número de WME solo sirve una vez.</p>',
            hNamesT: 'La columna «Calle WME»',
            hNamesB: '<table class="wbc-help-table"><tr><td>&#x2713;</td><td>los segmentos cercanos a las direcciones llevan el nombre de la BAN.</td></tr><tr><td><i>nombre</i></td><td>llevan otro nombre: el nombre a revisar.</td></tr><tr><td><i>sin nombre</i></td><td>no llevan ningún nombre.</td></tr><tr><td><i>ningún segmento</i></td><td>ningún segmento a menos de 80 m de las direcciones.</td></tr><tr><td>&#x2713; alt</td><td>el nombre de la BAN figura como nombre <b>alternativo</b>; el nombre principal aparece al lado.</td></tr><tr><td>n.º de carretera</td><td>el nombre principal es un número de carretera y el nombre de la BAN falta en los alternativos: añadirlo.</td></tr><tr><td>tipo</td><td>solo difiere el tipo de vía (Rue / Chemin…).</td></tr><tr><td>artículo · ortografía · parcial</td><td>nombres parecidos: un artículo, una o dos letras, o una forma abreviada. <i>ausente de WME</i>: la calle no existe en WME, el nombre mostrado es el de la vecina.</td></tr><tr><td>&#x2713; aparcamiento</td><td>ningún segmento con nombre, pero un lugar Aparcamiento cercano lleva el nombre de la BAN: nada que renombrar.</td></tr><tr><td>&#x2713; grafía BAN</td><td>mismo nombre salvo un guion o un punto («Rue Paul-Louis Courier» / «Rue Paul Louis Courier»): nada que renombrar.</td></tr></table><p>Un número que falta en naranja con <b>≠</b> existe en WME con otro sufijo (12 b / 12bis): revisar. Si WME solo tiene el número sin sufijo (32 / 32 B), se coloca igualmente y el aviso se mantiene.</p><p>&#x26A0; señala un nombre de la BAN que ningún segmento del municipio lleva.</p>',
            hLimitsT: 'Conviene saber',
            hLimitsB: "<p>Un departamento entero tarda unos minutos: la BAN se lee municipio por municipio, WME en cuadros de unos 5 km. El botón Detener lo interrumpe; lo hecho sigue visible y los municipios con error se pueden reintentar solos.</p><p>París, Marsella y Lyon se leen distrito por distrito. Los barridos se guardan solo en este navegador (IndexedDB), nunca en otro sitio, con sus preferencias (ámbito, interruptores, posición de la ventana, colores de los puntos); se señalan cuando la BAN o WME han cambiado desde entonces.</p>",
            hSafeB: "El script solo modifica el mapa a petición de un editor: el «+» de una dirección (un número o un RPP, todos los rangos); y, para un L6, «Añadir los números» (calle por calle: números, y RPP al final de un acceso), «⇄» (un RPP sustituido por un número) y «Convertir este número en RPP» — 500 por hora móvil como máximo, por editor; nunca guarda. Sus resultados se quedan en este navegador.",
            remTitle: "Usted sigue siendo responsable de sus ediciones",
            remBody: "<p>WME BAN Coverage <b>propone</b>: nunca guarda nada por sí mismo.</p><p>Cada número, RPP o conversión «⇄» llega a WME como una edición pendiente. Revísela en el mapa y luego guárdela o deshágala en WME.</p><p>Lo que usted guarda es su edición, como si la hubiera hecho a mano.</p>",
            remNote: "Este aviso se muestra una vez por navegador; puede volver a verlo desde la pestaña del script.",
            remOk: "Entendido",
            remCancel: "Cancelar",
            remLink: "Volver a ver el aviso de responsabilidad",
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
            renomRelance: n => n + (n > 1 ? ' calles renombradas en WME desde el análisis: las cifras del municipio están al día.' : ' calle renombrada en WME desde el análisis: las cifras del municipio están al día.'),
            renomNeuf: n => 'Segmento creado en WME cerca de ' + n + (n > 1 ? ' calles que no tenían ninguno: las cifras del municipio están al día.' : ' calle que no tenía ninguno: las cifras del municipio están al día.'),
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
            filterClear: 'Borrar el filtro',
            filterCount: (n, m) => n + (un1(n) ? ' calle de ' : ' calles de ') + m,
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
            sbRppNum: "Número de los RPP",
            sbRppNumHint: "Escribe su número bajo el triángulo de cada lugar residencial (RPP) cargado en WME, desde el zoom 17: ya no hace falta hacer clic para saber cuál es. Solo visualización.",
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
            smallTip: "Ventana pequeña (tamaño original)",
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
            tipMemoOpen: "Abrir la ventana con este análisis y encuadrar el mapa en él.",
            tipMemoClear: "Borrar todos los análisis guardados en este navegador (dos clics).",
            tipSbOpen: "Abrir la ventana de WBC (como el botón a la derecha del mapa).",
            tipColorsReset: "Restablecer los colores de los puntos por defecto.",
            tipHelpHdr: "Desplegar o plegar esta parte de la ayuda.",
            tipFab: "Abrir o cerrar la ventana",
            dirZoom: n => 'Direcciones BAN: acerque al nivel ' + n + ' o más',
            dirLoading: 'Direcciones BAN: leyendo…',
            dirNone: 'Direcciones BAN: ninguna en la vista',
            dirCount: n => n + (un1(n) ? ' dirección BAN en la vista' : ' direcciones BAN en la vista'),
            dirCap: (n, m) => n + ' direcciones BAN mostradas de ' + m + ': acerque para verlas todas',
            dirErr: m => 'Direcciones BAN: lectura imposible — ' + m,
            dirEdition: d => 'edición del ' + d,
            dirSource: 'Fuente: Base Adresse Nationale (adresse.data.gouv.fr), difundida por la Géoplateforme del IGN — Licence Ouverte Etalab 2.0. Solo lectura: nada se escribe; desmarque WBC en el menú Capas para ocultarlas.',
            dirFiche: 'BAN, vista sin análisis',
            dirWme: p => p + ' ya en WME',
            dirFicheWme: 'Ya en WME (mismo número, misma calle o a menos de 30 m)',
            dirFicheAbs: 'No está entre los números cargados en WME',
            tipFabCtrl: mac => (mac ? 'Cmd' : 'Ctrl') + '+clic: mostrar la BAN del municipio del centro',
            fabBusy: 'Analizando el municipio del centro…',
            fabErr: m => 'Error: ' + m,
            fabDeja: 'Ya hay un análisis en curso.',
            tipVoie: "Desplegar la calle (sus números, los que faltan en rojo) y encuadrar el mapa en ella.",
            tipCommune: "Abrir el detalle de este municipio y encuadrar el mapa en él.",
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
            dejaRelaunchTip: "Vuelve a lanzar todo el análisis.",
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
            ponctTag: "grafía BAN",
            tipOrtho: "La ortografía difiere en una o dos letras",
            tipPonct: "La BAN no escribe bien este nombre (guion, punto…): se conserva el nombre de WME y los números se añaden igualmente",
            partielTag: "parcial",
            tipPartiel: "Un nombre es la forma abreviada del otro",
            absentTag: "ausente de WME",
            altTag: "alt",
            parkTag: "aparcamiento",
            tipPark: "Ningún segmento con nombre: el nombre de la BAN lo lleva el lugar Aparcamiento cercano (las vías de aparcamiento quedan sin nombre).",
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
            kFar: n => 'de ellas ' + n + ' lejos del punto BAN',
            kArret: n => n + ' punto(s) de llegada lejano(s)',
            hovArret: d => 'Punto de llegada ' + d + ' m de más',
            arrT: (n, s) => 'Puntos de llegada lejanos (' + n + ', más allá de ' + s + ' m)',
            arrTip: d => 'El punto de llegada está ' + d + ' m más lejos que la calle junto al número de WME: revisarlo en WME',
            sbArret: 'Señalar un punto de llegada lejano a partir de',
            sbArretHint: 'Distancia entre el número de WME y el lugar al que guía Waze, menos su distancia a su calle. Se aplica al momento, sin nuevo análisis.',
            tipFar: d => 'Situado a ' + d + ' m de la dirección BAN',
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
            banVoie: 'Señalar a la BAN',
            banVoieTip: 'Abre la herramienta oficial de señalamiento de la BAN en esta calle, para pedir un cambio de su nombre. No se envía nada hasta que envíe el formulario.',
            banNumTip: n => 'Señalar el número ' + n + ' a la BAN: la herramienta oficial se abre en esta dirección (modificación o supresión). No se envía nada hasta que envíe el formulario.',
            banNoKey: 'Aquí no hay identificador BAN: el mapa de la BAN se abre en el lugar correcto. Haga clic en un número, luego en el nombre de la calle si es la calle la que falla, y en «Signaler un problème».',
            banOff: m => 'Este municipio no acepta señalamientos en línea' + (m ? ': ' + m : '.') + ' La página oficial se abre igualmente, con la dirección de contacto del ayuntamiento: el resto se hace por correo.',
            banMap: 'Ver en el mapa de la BAN',
            banMairie: 'Contactar con el ayuntamiento',
            banAmbig: 'Atención: en este municipio nuevo la misma clave BAN existe en varios municipios delegados; compruebe la dirección mostrada antes de señalar.',
            banTropTip: n => 'Señalar a la BAN que falta el ' + n + ': la herramienta oficial se abre en su posición (alerta «dirección que falta»). No se envía nada hasta que envíe el formulario.',
            sigT: (n, a) => 'Señalamientos a la BAN (' + n + (a ? ', ' + a + ' pendientes' : '') + ')',
            sigTip: 'Todos los señalamientos enviados a la BAN para este municipio (por cualquiera), con su resultado. Un clic centra el mapa.',
            sigVoieT: n => 'Señalamientos a la BAN en esta calle (' + n + ')',
            sigSt: s => ({ PENDING: 'pendiente', PROCESSED: 'tratado', IGNORED: 'rechazado', EXPIRED: 'caducado' })[s] || s,
            sigDem: (k, v) => ({ nom: 'nombre → ' + v, num: 'número → ' + v, voie: 'calle → ' + v, del: 'supresión', create: 'creación', missing: 'dirección que falta', autre: 'posición o parcelas' })[k] || k,
            sigMotif: m => 'motivo: ' + m,
            sigDeja: (d, st) => 'Ya señalado el ' + d + ' (' + st + ').',
            snbT: (v, a) => 'Calles sin nombre en la BAN (' + v + ' calles, ' + a + ' direcciones)',
            snbTip: 'El municipio publicó estas direcciones con un nombre provisional («Non renseigné»…): no hay nada que poner en WME hasta que nombre la calle. Una línea por calle de la BAN, fuera de la tasa de cobertura. Señalarlo o consultarlo con el ayuntamiento.',
            snbPres: n => 'cerca de «' + n + '» en WME',
            snbNone: 'ninguna calle de WME con nombre cerca',
            dejaOld: 'Análisis hecho por una versión anterior de WBC, con resultados distintos: vuelva a lanzarlo.',
            ajHnAdd: n => 'Añadir los números (' + n + ')',
            nextStreet: n => 'Calle siguiente (' + n + ' por añadir)',
            tipNextStreet: 'Abre la calle del municipio donde «Añadir» tiene más números por colocar (nombre BAN como principal o alternativo), saltando las calles ya abiertas con este botón.',
            nextStreetNone: 'No queda ninguna calle lista: las restantes ya tienen sus números, o primero hay que corregir su nombre.',
            ajHnAddTip: r => 'Solo L6: coloca en WME los números que faltan en esta calle, en los segmentos cuyo nombre principal es el de la BAN (se toleran acentos, mayúsculas, guiones y puntos) y cuya ciudad es el municipio o «Village (Commune)»; una dirección al final de un acceso se convierte en RPP. Como máximo 500 ediciones por hora móvil, contadas al guardar (quedan ' + r + '). No se guarda nada: compruebe y luego guarde en WME. Las direcciones fuera de poblado también se convierten en RPP.',
            ajHnNoName: 'El nombre WME de esta calle no es el de la BAN: la adición automática exige un nombre principal idéntico al de la BAN.',
            ajHnNone: 'Ningún número se puede añadir automáticamente en esta calle.',
            ajHnLoin: n => 'Ningún número se puede añadir automáticamente: ' + n + ' dirección(es) a más de 80 m de la calle dibujada en WME. Acerca el segmento si está mal colocado.',
            ajHnNomEcart: (w, b) => 'Ningún número se puede añadir automáticamente: en WME los segmentos de esta calle se llaman «' + w + '», no «' + b + '» como en la BAN. Dales el nombre de la BAN.',
            ajHnQuota: h => 'Cuota alcanzada (500 números por hora): próxima adición posible a las ' + h + '.',
            ajHnRunning: 'Añadiendo los números…',
            bgTab: 'Pestaña en segundo plano: Chrome ralentiza el trabajo en curso (hasta 3 veces más largo). Mantenga esta pestaña en primer plano.',
            bgTabTip: 'Chrome frena los temporizadores de una pestaña oculta (uno por segundo y, tras 5 minutos, uno por minuto) y baja su prioridad. Medido el 29/09/2026: un departamento en 41 min en segundo plano frente a 13 min en primer plano.',
            ajHnDone: (n, r) => n + (un1(n) ? ' número colocado — compruébelo' : ' números colocados — compruébelos') + ' y luego guarde en WME. Cuota restante: ' + r + '.',
            ajHnDoneMix: (n, r, q) => n + (un1(n) ? ' número' : ' números') + ' y ' + r + ' RPP colocados — compruébelos y luego guarde en WME. Cuota restante: ' + q + '.',
            ajHnDoneRpp: (r, q) => r + (un1(r) ? ' RPP colocado — compruébelo' : ' RPP colocados — compruébelos') + ' y luego guarde en WME. Cuota restante: ' + q + '.',
            ajRppCrit: l => '⚠️ A corregir a mano: ' + l + '.',
            ajRppCritPoi: n => 'RPP ' + n + ' quedado sin dirección',
            ajHnStopTip: 'Detener la adición en curso tras la colocación actual; lo colocado se queda, para revisar.',
            ajHnStopping: 'Detención solicitada…',
            ajHnStopped: 'Detenido a petición suya.',
            ajHnFail: n => n + (un1(n) ? ' colocación fallida' : ' colocaciones fallidas') + ' (detalle en la consola).',
            rhnUnsaved: 'Guarde (o deshaga) primero los cambios pendientes: WME ya no deja a los scripts leer lo que no está guardado, y «⇄» no debe duplicar un número ni recuperar un objeto borrado.',
            rhnLock: n => 'Este RPP está bloqueado en el nivel ' + n + ', por encima de su rango: la conversión se convertirá en una sugerencia al guardar.',
            rhnLockInfo: n => 'El RPP retirado estaba bloqueado en el nivel ' + n + '.',
            rhnSegLock: n => (n ? 'El segmento está bloqueado en el nivel ' + n + ', por encima de su rango' : 'WME no le deja editar directamente los números de este segmento') + ': la conversión se convertirá en una sugerencia al guardar.',
            suggAttente: 'WME no ha guardado esta edición como sugerencia: guarde (o deshaga) primero sus ediciones directas pendientes — WME nunca guarda juntas sugerencias y ediciones directas.',
            suggMixte: 'No se convierte nada: uno de los dos objetos sería una sugerencia y el otro una edición directa, y WME no los guarda juntos. Pida ayuda a un editor de rango suficiente.',
            rhnCritRpp: n => 'RPP ' + n + ' retirado sin número colocado: deshaga (Ctrl+Z) en WME',
            ajHnSansAlt: (r, c) => 'Algunos segmentos fuera de poblado llevan «' + r + '» sin ciudad pero no el alternativo «' + r + ' / ' + c + '»: el «+» coloca igualmente un RPP, pero conviene añadir el alternativo.',
            ajHnSansAltRoute: (r, c) => 'Algunos segmentos fuera de poblado tienen un número de carretera como nombre principal, sin ciudad, pero no el alternativo «' + r + ' / ' + c + '»: el «+» coloca igualmente un RPP, pero conviene añadir el alternativo.',
            rhnT: n => 'RPP de esta calle (' + n + ')',
            rhnTip: 'Mostrar el RPP en el mapa. Al pasar el ratón, «⇄» lo sustituye por un número del segmento cuando el caso es claro.',
            rhnConv: 'Sustituir este RPP por un número',
            rhnConvTip: 'En zona urbana, sustituye este RPP por un número en el segmento — solo en casos claros (mismo número ya en la calle, o punto de acceso / posición junto a su propia calle, como WME Naming Auditor). Rechazado si el RPP tiene nombre o foto. Cuenta en la cuota; no se guarda nada.',
            rhnDone: (n, q) => 'RPP n.º ' + n + ' sustituido por un número en el segmento — compruébelo y luego guarde en WME. Cuota restante: ' + q + '.',
            rhnDoneDbl: (n, q) => 'El n.º ' + n + ' ya estaba en la calle: se retira el RPP duplicado — compruebe y luego guarde en WME. Cuota restante: ' + q + '.',
            rhnNotFound: 'RPP no encontrado en WME en este lugar (¿movido, modificado o borrado desde el análisis?): vuelva a analizar.',
            rhnNoPlaces: 'No hay ningún lugar cargado en WME: la capa «Lugares» probablemente está oculta. Muéstrela y vuelva a intentarlo.',
            rhnNamed: 'Este RPP tiene nombre: no se convierte (a revisar a mano).',
            rhnPhoto: 'Este RPP tiene una foto: no se convierte (alguien estuvo allí; a revisar a mano).',
            rhnCity: v => 'Este RPP pertenece a «' + v + '», no al municipio: no se convierte.',
            rhnStreet: r => 'Este RPP lleva la calle «' + r + '», no el nombre BAN de la calle: no se convierte.',
            rhnNoSeg: 'Ningún segmento de la calle (nombre BAN como principal, municipio como ciudad) a menos de 80 m: el RPP está sin duda fuera de poblado, se queda.',
            rhnLegit: v => 'El punto de acceso del RPP da a «' + v + '», no a su calle: el RPP expresa un desfase que un número de segmento no puede, se queda.',
            rhnUnsure: 'Nada claro (otra calle igual de cerca, o demasiado lejos de toda calle): el RPP se queda, a revisar a mano.',
            rhnFormat: n => 'El número «' + n + '» no se escribe como un número de segmento: a revisar a mano.',
            rhnErr: m => 'Sustitución interrumpida: ' + m,
            rhnPoseTip: 'Sustituido por un número (aún sin guardar).',
            rhnVersRpp: 'Convertir este número en RPP',
            rhnVersRppTip: 'Quita este número del segmento y crea en su lugar un RPP (mismo número, misma calle), con el punto de entrada en el segmento sin nombre más cercano o en un acceso (camino privado, vía de aparcamiento); luego el RPP queda seleccionado para ajustar su entrada. Cuenta en la cuota; no se guarda nada.',
            rhnVersRppDone: (n, q) => 'N.º ' + n + ' convertido en RPP — ajuste su punto de entrada si hace falta (está seleccionado) y luego guarde en WME. Cuota restante: ' + q + '.',
            rhnVersRppAbsent: n => 'El número ' + n + ' no se encuentra en WME (segmento no cargado, o número ya quitado): no se cambia nada.',
            rhnVersRppTipPose: 'Convertido en RPP (aún sin guardar).',
            ajHnSkip: n => n + (un1(n) ? ' dirección descartada' : ' direcciones descartadas') + ' (detalle en la consola).',
            ajHnCut: (n, h) => n + (un1(n) ? ' dirección no colocada' : ' direcciones no colocadas') + ': cuota alcanzada, se podrá seguir a las ' + h + '.',
            ajHnNoSeg: 'Ningún segmento cargado lleva exactamente este nombre como nombre principal con el municipio como ciudad: no se ha colocado nada.',
            ajHnErr: m => 'Adición interrumpida: ' + m,
            ajHnRights: '«Añadir los números» de una calle entera está reservado a los editores L6; el «+» de un solo número y las conversiones «⇄» están abiertos a todos los rangos.',
            ajHnSee: n => (un1(n) ? 'Aparece rodeado' : 'Aparecen rodeados') + ' en turquesa en el mapa.',
            ajHnPoseTip: 'Colocado por WBC, aún sin guardar: haga clic para centrar el mapa en él.',
            ajHnSaved: (c, r, q) => 'Guardado: ' + c + (un1(c) ? ' número contado' : ' números contados') + ', ' + r + ' devueltos a la cuota (retirados antes de guardar). Cuota restante: ' + q + '.',
            ajHnSavedTip: 'Colocado por WBC y guardado.',
            hHnT: 'Añadir los números',
            hHnB: '<p><i>Añadir los números</i> de una calle entera: solo editores <b>L6</b>. <b>Un número cada vez</b> y las conversiones <b>⇄</b> (número → RPP, RPP → número) están abiertos a <b>todos los rangos</b>, con los mismos controles y la misma cuota; sin derecho sobre el segmento o el RPP (bloqueo por encima de su rango), WME lo convierte en una sugerencia al guardar — si no hay ediciones directas pendientes, y en una conversión solo si los dos objetos están en el mismo caso. En la fila desplegada de una calle, <i>Añadir los números</i> coloca en WME sus direcciones que faltan — <b>calle por calle</b>, nunca para todo el municipio. Para un solo número: el «+» de su etiqueta (al pasar el ratón) o un clic en su punto del mapa. Se aplican los derechos de WME: para un solo número o una conversión, un segmento bloqueado por encima de su rango (o fuera de sus zonas de edición) da una sugerencia al guardar; <i>Añadir los números</i> de una calle entera omite esos segmentos, y el mensaje lo dice.</p><p><b>Condiciones</b>: el nombre principal de los segmentos es el de la BAN (se toleran acentos, mayúsculas, apóstrofos, espacios, guiones y puntos; una grafía distinta solo se señala) y su ciudad es el municipio o «Village (Commune)». Cada número va al segmento admitido más cercano (80 m como máximo); un número ya presente, aunque esté pendiente en esta pestaña, nunca se vuelve a colocar; un sufijo distinto (12 b / 12bis) o numérico se deja al editor, salvo si WME solo tiene el número sin sufijo (32 para 32 B): entonces se coloca, con un aviso.</p><p><b>No se guarda nada</b>: los números colocados aparecen rodeados en turquesa en el mapa (incluso con la ventana cerrada) y marcados con ✚ en la calle; revíselos y luego guarde o deshaga en WME.</p><p><b>Cuota</b>: 500 números por hora móvil. Un número se reserva al colocarlo y se cuenta si aparece en el servidor tras guardar; retirado o modificado antes, se devuelve. Los números escritos a mano nunca cuentan. Una vez guardados, pasan a «encontrados» sin volver a analizar; un análisis guardado más antiguo lo indica («relance»). La insignia &#x271A; de la cabecera de la ventana indica lo que queda: naranja por debajo del 20 %, rojo por debajo del 5 %.</p><p><b>RPP</b>: una dirección al final de un acceso (camino privado o vía de aparcamiento a menos de 80 m, su calle a menos de 250 m) se convierte en un lugar residencial (RPP), también con el botón de la calle. Una dirección fuera de poblado (segmento cuyo nombre principal no tiene ciudad y que lleva el nombre BAN con el municipio como alternativo) se convierte en RPP, con el botón de la calle como con el «+». El RPP se crea en la posición BAN, con su dirección y su punto de entrada en el segmento (o el acceso) más cercano; una dirección rechazada retira el lugar. Su bloqueo es el que WME pone por defecto (ninguna tabla de Francia fija uno para un RPP). Los RPP cuentan en la cuota. Una dirección sin ningún segmento con el nombre BAN a menos de 80 m, pero cerca de una vía transitable de otro nombre, también se convierte en RPP: dirección «nombre BAN / municipio», entrada por esa vía.</p><p><b>Número → RPP</b>: en la burbuja del punto de un número (guardado, o colocado por WBC y aún sin guardar), «⇄ Convertir este número en RPP» quita el número y crea en su lugar un RPP (mismo número, misma calle), con el punto de entrada en el segmento sin nombre o el acceso más cercano (rotonda, camino privado…); luego el RPP queda seleccionado para ajustar su entrada. Un número colocado por WBC solo cambia de tipo en la cuota; un número guardado cuenta 2.</p><p><b>RPP → número</b>: en la calle desplegada, los RPP de la calle tienen sus etiquetas; al pasar el ratón, «⇄» sustituye UN RPP por un número en el segmento, solo en casos claros (como WME Naming Auditor): mismo número ya en la calle a menos de 150 m (el RPP está duplicado y simplemente se retira), o punto de acceso — si no, posición — junto a su propia calle sin otra calle a menos de 10 m. Un punto de acceso que da a otra calle prueba que el RPP es legítimo: se queda. Rechazado si el RPP tiene nombre o foto, otra ciudad u otra calle. También con un clic en su punto del mapa. Misma cuota; no se guarda nada. Se lee el bloqueo del RPP: por encima de su rango, la sustitución se convierte en una sugerencia al guardar; si no, el mensaje lo indica. Ningún cambio debe estar pendiente de guardar (WME ya no deja a los scripts leer lo pendiente); una sustitución cuenta 2 en la cuota (RPP retirado, número colocado). También seleccionando el triángulo del RPP en WME (ventana de WBC abierta).</p><p><b>Detener</b>: mientras se rellena una calle larga (el mapa se mueve de zona en zona), el botón Detener interrumpe la pasada; lo colocado se queda, para revisar. Una colocación fallida se cuenta en el mensaje. <b>Límite</b>: un número tecleado a mano y aún no guardado no se ve como duplicado — guarde antes de añadir en la misma calle. Dos pestañas de WME abiertas a la vez no ven los números pendientes de la otra: coloque desde una sola pestaña.</p>',
            ajHnQuotaTip: 'Hora móvil: un número cuenta durante una hora desde que se coloca. Solo se cuentan los números colocados con este botón y guardados de verdad.',
            ajHnLeft: n => 'Cuota: ' + n + (un1(n) ? ' restante' : ' restantes') + ' en esta hora',
            ajHnFull: h => 'Cuota alcanzada — próxima adición a las ' + h,
            ajHn1: 'Añadir este número',
            ajHn1Tip: 'Coloca solo este número en WME (todos los rangos), con los controles de «Añadir los números» (nombre BAN, ciudad, segmento a menos de 80 m, duplicado); cuenta en la cuota. No se guarda nada.',
            ajHn1Exists: n => 'El número ' + n + ' ya está en WME en esta calle: no se coloca nada.',
            ajHn1Rights: 'WME no le ha identificado como editor (nombre y rango ilegibles): recargue WME y vuelva a intentarlo.',
            ajHn1Lock: (n, v) => 'El número ' + n + ' se convertirá en una sugerencia al guardar: ' + (v ? 'su segmento está bloqueado en el nivel ' + v + ', por encima de su rango' : 'WME no le deja modificar directamente los números de su segmento') + '; la validará un editor de rango suficiente.',
            ajHn1Bloque: v => (v ? 'Su segmento está bloqueado en el nivel ' + v + ', por encima de su rango' : 'Su segmento está fuera de sus zonas de edición') + ': este número se convertirá en una sugerencia al guardar, que validará un editor de rango suficiente.',
            ajHnLockSkip: n => n + (un1(n) ? ' número no colocado' : ' números no colocados') + ': segmento que WME no le deja modificar (bloqueo o zonas de edición).',
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
            hTrackB: '<p><b>Mapa del departamento</b>: tras un departamento, cada municipio se colorea según su cobertura (claro = poca, oscuro = mucha). Al pasar el ratón se ven sus cifras; con el mapa alejado, un clic lo abre.</p><p><b>Número que falta</b>: con la calle abierta, una línea de puntos lleva al segmento que probablemente debería llevarlo; su identificador está en el CSV.</p><p><b>Seleccionar los segmentos</b> de una calle desde su fila: quedan seleccionados en WME.</p><p><b>Avance</b>: la exportación CSV sirve también de registro. Más tarde, <i>Comparar</i> la vuelve a leer y da el cambio calle por calle (o municipio por municipio). No se guarda nada en otro sitio.</p><p><b>Diferencias (CSV)</b>: las calles que renombrar, cada una con un enlace WME, para corregir o enviar a los responsables de la zona.</p><p><b>Herramientas de la calle</b>: en la fila desplegada de una calle, iconos con contador — seleccionar los segmentos, añadir los números, calle siguiente, señalar a la BAN o contactar con el ayuntamiento; el nombre de cada uno aparece al pasar el ratón.</p><p><b>Límite del municipio</b>: el icono de polígono, junto a las exportaciones, dibuja en el mapa el límite administrativo del municipio; la elección se conserva.</p>',
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
            memoWmeProg: (i, n) => 'WME: comprobando ' + i + '/' + n,
            memoWmeOk: 'WME sin cambios',
            memoWmeMaj: d => 'WME editado' + (d ? ' (' + d + ')' : ''),
            memoWmeMajN: n => 'WME editado: ' + n,
            memoUpd: 'Actualizar',
            memoUpdTip: 'Vuelve a leer la BAN y WME de este municipio y actualiza el resultado, en un solo paso.',
            memoUpdDepTip: 'Comprueba la BAN y WME de cada municipio y vuelve a analizar los que han cambiado.',
            contourBtn: 'Límite del municipio',
            contourTip: 'Muestra u oculta en el mapa el límite administrativo del municipio (geo.api.gouv.fr, ya leído para el análisis).',
            memoTagBan: 'BAN actualizada desde el análisis',
            memoTagWme: 'WME editado desde el análisis',
            secMemo: 'Análisis guardados',
            memoHint: 'Guardados solo en este navegador. Al reabrir uno se muestra enseguida y se comprueba si la BAN ha cambiado desde entonces.',
            memoNone: 'Ningún análisis guardado todavía.',
            memoOpen: 'Abrir',
            memoDel: 'Borrar este análisis',
            memoClear: 'Borrar todo',
            memoErr: m => 'No se pudo guardar el análisis: ' + m,
            hMemoT: 'Análisis guardados y actualizaciones',
            hMemoB: '<p>Cada análisis se guarda en este navegador (no se envía nada). Elegir de nuevo el mismo municipio o departamento, o <i>Abrir</i> en la pestaña Scripts, lo muestra enseguida con su fecha. <i>Analizar</i> también lo recuerda: si la misma zona ya se analizó, se muestra su fecha con <i>Abrir</i> y <i>Relanzar</i>. Si WBC ha añadido números en esa zona desde entonces, el aviso lo indica y <i>Relanzar</i> pasa a ser el botón principal.</p><p><b>Actualizar</b>: para un municipio, se vuelven a leer la BAN y WME y se sustituye el resultado. Para un departamento, se comprueba el fichero de direcciones de cada municipio (una petición por municipio) y luego se vuelve a leer WME, números incluidos (segmentos, cada número —los números no tienen fecha en WME— y puntos residenciales); los municipios que han cambiado se vuelven a analizar y los demás se conservan.</p><p>Los municipios que han cambiado llevan una etiqueta BAN o WME y un contorno naranja en el mapa hasta su nuevo análisis.</p>',
            memoClearSure: 'Pulse otra vez para borrar todo',
        },
        it: {
            sbHint: 'Confronta la base nazionale degli indirizzi (BAN) con i numeri civici e i punti residenziali (RPP) di WME, per un comune o un intero dipartimento.',
            sbOpen: 'Apri la finestra',
            sbHelp: 'Aiuto',
            hWhatT: 'Cosa viene confrontato',
            hWhatB: "<p>La <b>BAN</b> è il riferimento: ogni indirizzo che elenca dovrebbe esistere in WME, come numero su un segmento (HN) o come punto residenziale (RPP).</p><p><b>Fonti</b>, lette dal vivo: la <b>Base Adresse Nationale</b> (adresse.data.gouv.fr, Stato francese; Licence Ouverte Etalab 2.0; è mostrata la data di revisione di ogni comune); i confini e gli elenchi dei comuni di <b>geo.api.gouv.fr</b> (API Découpage administratif, dati INSEE e IGN, Licence Ouverte Etalab 2.0); l’<b>API pubblica delle segnalazioni BAN</b> (signalement.adresse.data.gouv.fr) per lo stato delle segnalazioni; e WME dagli stessi server dell’editor. La zona non deve essere visualizzata né caricata. Dal 12/11/2026 Waze accredita la BAN per la Francia (visualizzazione e creazione assistita dei numeri civici, pagina Map Data Attribution); l’aggiunta di un’intera via resta un gesto da L6; un numero alla volta è aperto a tutti i livelli; il tutto con quota.</p><p><b>Ciò che esce dal browser</b>: verso geo.api.gouv.fr, in modalità «Centro della mappa», il centro della mappa ARROTONDATO a 3 decimali (circa 100 m) e le tue ricerche di comune — senza identità né cookie; verso la BAN e l’API delle segnalazioni, il codice del comune; all’avvio, GitHub (version-min.json, versione minima: una versione ritirata non si avvia) e GreasyFork (nuova versione) sono solo letti. Verso data.geopf.fr (Géoplateforme dell’IGN), con la casella WBC del menu Livelli spuntata: l’estensione della vista, dallo zoom 18, senza cookie. Nient’altro; il tuo nome utente non va a nessun terzo (solo al Discuss di Waze, per il pulsante Copia).</p><p><b>Segnala alla BAN</b>: apre lo strumento ufficiale (signalement.adresse.data.gouv.fr) in una nuova scheda, sulla via o sul numero; WBC non invia nulla, sei tu a compilare e inviare il modulo. Per un numero di WME assente dalla BAN, il commento precompilato porta l’indirizzo letto in Waze («Adresse présente dans Waze: …»): rileggilo, modificalo o cancellalo prima di inviare.</p><p><b>BAN della vista</b>: con la casella WBC del menu Livelli spuntata e nessuna analisi mostrata in quel punto, gli indirizzi BAN della vista compaiono dallo zoom 18, in grigio (sola lettura); cerchiati di verde quando WME ha già lo stesso numero sulla stessa via o entro 30 m (numeri salvati, punti residenziali). <b>Ctrl+clic</b> (Cmd+clic su Mac) sul pulsante della mappa: il comune al centro viene analizzato, o la sua scansione recente riaperta, e mostrato sulla mappa senza aprire la finestra. Finché la finestra di WBC è aperta, i livelli WME «Numeri civici» e «Residenziale» sono visibili; alla chiusura tornano allo stato precedente.</p>",
            hMatchT: 'Quando un numero è trovato',
            hMatchB: '<p>Un indirizzo BAN è trovato quando WME ha lo stesso numero (suffissi compresi: <i>bis</i>, <i>ter</i>, lettere) a meno di 150 m, e:</p><table class="wbc-help-table"><tr><td>1</td><td>su una via con lo stesso nome (principale o alternativo), o che ne differisce solo per un articolo («Avenue Sembrancher» = «Avenue de Sembrancher»; la differenza di nome resta segnalata);</td></tr><tr><td>2</td><td>oppure su un segmento che porta gli indirizzi di questa via, <b>con o senza nome</b>;</td></tr><tr><td>3</td><td>oppure a meno di 30 m dall\'indirizzo.</td></tr></table><p>La regola 1 è provata ovunque per prima, poi la 2, poi la 3. Un numero WME serve una sola volta.</p>',
            hNamesT: 'La colonna «Via WME»',
            hNamesB: '<table class="wbc-help-table"><tr><td>&#x2713;</td><td>i segmenti vicini agli indirizzi portano il nome della BAN.</td></tr><tr><td><i>nome</i></td><td>portano un altro nome: il nome da verificare.</td></tr><tr><td><i>senza nome</i></td><td>non portano alcun nome.</td></tr><tr><td><i>nessun segmento</i></td><td>nessun segmento a meno di 80 m dagli indirizzi.</td></tr><tr><td>&#x2713; alt</td><td>il nome della BAN è un nome <b>alternativo</b>; il nome principale è mostrato accanto.</td></tr><tr><td>n. strada</td><td>il nome principale è un numero di strada e il nome della BAN manca tra gli alternativi: aggiungerlo.</td></tr><tr><td>tipo</td><td>differisce solo il tipo di via (Rue / Chemin…).</td></tr><tr><td>articolo · ortografia · parziale</td><td>nomi simili: un articolo, una o due lettere, o una forma abbreviata. <i>assente in WME</i>: la via non esiste in WME, il nome mostrato è quello della vicina.</td></tr><tr><td>&#x2713; parcheggio</td><td>nessun segmento con nome, ma un luogo Parcheggio vicino porta il nome della BAN: niente da rinominare.</td></tr><tr><td>&#x2713; grafia BAN</td><td>stesso nome a meno di un trattino o un punto («Rue Paul-Louis Courier» / «Rue Paul Louis Courier»): niente da rinominare.</td></tr></table><p>Un numero mancante in arancione con <b>≠</b> esiste in WME con un altro suffisso (12 b / 12bis): da verificare. Se WME ha solo il numero senza suffisso (32 / 32 B), viene inserito comunque e l’avviso resta.</p><p>&#x26A0; segnala un nome della BAN che nessun segmento del comune porta.</p>',
            hLimitsT: 'Buono a sapersi',
            hLimitsB: "<p>Un intero dipartimento richiede qualche minuto: la BAN si legge comune per comune, WME a riquadri di circa 5 km. Il pulsante Ferma lo interrompe; quanto fatto resta visibile e i comuni in errore si possono riprovare da soli.</p><p>Parigi, Marsiglia e Lione si leggono arrondissement per arrondissement. Le scansioni restano solo in questo browser (IndexedDB), mai altrove, con le tue preferenze (ambito, interruttori, posizione della finestra, colori dei punti); sono segnalate quando la BAN o WME sono cambiati da allora.</p>",
            hSafeB: "Lo script modifica la mappa solo su richiesta di un editor: il «+» di un indirizzo (un numero o un RPP, tutti i livelli); e, per un L6, «Aggiungi i numeri» (via per via: numeri, e RPP in fondo a un accesso), «⇄» (un RPP sostituito da un numero) e «Trasforma questo numero in RPP» — al massimo 500 per ora mobile, per editor; non salva mai. I risultati restano in questo browser.",
            remTitle: "Resta responsabile delle sue modifiche",
            remBody: "<p>WME BAN Coverage <b>propone</b>: non salva mai nulla da solo.</p><p>Ogni numero, RPP o conversione «⇄» arriva in WME come modifica in sospeso. La controlli sulla mappa, poi la salvi o la annulli in WME.</p><p>Ciò che salva è una sua modifica, come se l’avesse fatta a mano.</p>",
            remNote: "Questo promemoria compare una volta per browser; può rivederlo dalla scheda dello script.",
            remOk: "Ho capito",
            remCancel: "Annulla",
            remLink: "Rivedere il promemoria sulla responsabilità",
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
            renomRelance: n => n + (n > 1 ? ' strade rinominate in WME dopo l’analisi: i dati del comune sono aggiornati.' : ' strada rinominata in WME dopo l’analisi: i dati del comune sono aggiornati.'),
            renomNeuf: n => 'Segmento creato in WME vicino a ' + n + (n > 1 ? ' strade che non ne avevano: i dati del comune sono aggiornati.' : ' strada che non ne aveva: i dati del comune sono aggiornati.'),
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
            filterClear: 'Cancella il filtro',
            filterCount: (n, m) => n + (un1(n) ? ' via su ' : ' vie su ') + m,
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
            sbRppNum: "Numero degli RPP",
            sbRppNumHint: "Scrive il numero civico sotto il triangolo di ogni luogo residenziale (RPP) caricato in WME, dallo zoom 17: non serve più cliccarlo per sapere quale sia. Solo visualizzazione.",
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
            smallTip: "Finestra piccola (dimensione originale)",
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
            tipMemoOpen: "Apri la finestra su questa scansione e inquadra la mappa.",
            tipMemoClear: "Elimina tutte le scansioni salvate in questo browser (due clic).",
            tipSbOpen: "Apri la finestra di WBC (come il pulsante a destra della mappa).",
            tipColorsReset: "Ripristina i colori predefiniti dei punti.",
            tipHelpHdr: "Espandi o comprimi questa parte dell’aiuto.",
            tipFab: "Apri o chiudi la finestra",
            dirZoom: n => 'Indirizzi BAN: ingrandisci al livello ' + n + ' o più',
            dirLoading: 'Indirizzi BAN: lettura…',
            dirNone: 'Indirizzi BAN: nessuno nella vista',
            dirCount: n => n + (un1(n) ? ' indirizzo BAN nella vista' : ' indirizzi BAN nella vista'),
            dirCap: (n, m) => n + ' indirizzi BAN mostrati su ' + m + ': ingrandisci per vederli tutti',
            dirErr: m => 'Indirizzi BAN: lettura impossibile — ' + m,
            dirEdition: d => 'edizione del ' + d,
            dirSource: 'Fonte: Base Adresse Nationale (adresse.data.gouv.fr), diffusa dalla Géoplateforme dell’IGN — Licence Ouverte Etalab 2.0. Sola lettura: nulla viene scritto; deseleziona WBC nel menu Livelli per nasconderli.',
            dirFiche: 'BAN, vista senza analisi',
            dirWme: p => 'di cui ' + p + ' già in WME',
            dirFicheWme: 'Già in WME (stesso numero, stessa via o entro 30 m)',
            dirFicheAbs: 'Non presente tra i numeri caricati in WME',
            tipFabCtrl: mac => (mac ? 'Cmd' : 'Ctrl') + '+clic: mostra la BAN del comune al centro',
            fabBusy: 'Analisi del comune al centro…',
            fabErr: m => 'Non riuscito: ' + m,
            fabDeja: 'Un’analisi è già in corso.',
            tipVoie: "Espandi la strada (i suoi numeri, quelli mancanti in rosso) e inquadra la mappa.",
            tipCommune: "Apri il dettaglio di questo comune e inquadra la mappa.",
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
            dejaRelaunchTip: "Rilancia l’intera analisi.",
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
            ponctTag: "grafia BAN",
            tipOrtho: "L’ortografia differisce di una o due lettere",
            tipPonct: "La BAN non scrive correttamente questo nome (trattino, punto…): il nome WME resta e i numeri si aggiungono comunque",
            partielTag: "parziale",
            tipPartiel: "Un nome è la forma abbreviata dell’altro",
            absentTag: "assente in WME",
            altTag: "alt",
            parkTag: "parcheggio",
            tipPark: "Nessun segmento con nome: il nome della BAN è sul luogo Parcheggio vicino (le strade di parcheggio restano senza nome).",
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
            kFar: n => 'di cui ' + n + ' lontani dal punto BAN',
            kArret: n => n + ' punto/i di arrivo lontano/i',
            hovArret: d => 'Punto di arrivo ' + d + ' m di troppo',
            arrT: (n, s) => 'Punti di arrivo lontani (' + n + ', oltre ' + s + ' m)',
            arrTip: d => 'Il punto di arrivo è ' + d + ' m più lontano della strada accanto al numero WME: controllarlo in WME',
            sbArret: 'Segnalare un punto di arrivo lontano oltre',
            sbArretHint: 'Distanza tra il numero WME e il punto in cui Waze porta, meno la sua distanza dalla strada. Applicato subito, senza nuova analisi.',
            tipFar: d => 'Posto a ' + d + ' m dall’indirizzo BAN',
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
            banVoie: 'Segnala alla BAN',
            banVoieTip: 'Apre lo strumento ufficiale di segnalazione della BAN su questa via, per chiedere la modifica del nome. Non viene inviato nulla finché non invii il modulo.',
            banNumTip: n => 'Segnala il numero ' + n + ' alla BAN: lo strumento ufficiale si apre su questo indirizzo (modifica o cancellazione). Non viene inviato nulla finché non invii il modulo.',
            banNoKey: 'Qui nessun identificativo BAN: la mappa della BAN si apre nel punto giusto. Clicca un numero, poi il nome della via se è la via a essere sbagliata, e «Signaler un problème».',
            banOff: m => 'Questo comune non accetta segnalazioni online' + (m ? ': ' + m : '.') + ' La pagina ufficiale si apre comunque, con l’indirizzo di contatto del municipio: il resto si fa per e-mail.',
            banMap: 'Vedi sulla mappa BAN',
            banMairie: 'Contatta il municipio',
            banAmbig: 'Attenzione: in questo comune nuovo la stessa chiave BAN esiste in più comuni delegati; controlla l’indirizzo mostrato prima di segnalare.',
            banTropTip: n => 'Segnala alla BAN che manca il ' + n + ': lo strumento ufficiale si apre nella sua posizione (avviso «indirizzo mancante»). Non viene inviato nulla finché non invii il modulo.',
            sigT: (n, a) => 'Segnalazioni alla BAN (' + n + (a ? ', ' + a + ' in attesa' : '') + ')',
            sigTip: 'Tutte le segnalazioni inviate alla BAN per questo comune (da chiunque), con il loro esito. Un clic centra la mappa.',
            sigVoieT: n => 'Segnalazioni alla BAN su questa via (' + n + ')',
            sigSt: s => ({ PENDING: 'in attesa', PROCESSED: 'trattata', IGNORED: 'respinta', EXPIRED: 'scaduta' })[s] || s,
            sigDem: (k, v) => ({ nom: 'nome → ' + v, num: 'numero → ' + v, voie: 'via → ' + v, del: 'cancellazione', create: 'creazione', missing: 'indirizzo mancante', autre: 'posizione o particelle' })[k] || k,
            sigMotif: m => 'motivo: ' + m,
            sigDeja: (d, st) => 'Già segnalato il ' + d + ' (' + st + ').',
            snbT: (v, a) => 'Vie senza nome nella BAN (' + v + ' vie, ' + a + ' indirizzi)',
            snbTip: 'Il comune ha pubblicato questi indirizzi con un nome provvisorio («Non renseigné»…): nulla da inserire in WME finché non dà un nome alla via. Una riga per via della BAN, fuori dal tasso di copertura. Da segnalare, o da vedere con il municipio.',
            snbPres: n => 'vicino a «' + n + '» in WME',
            snbNone: 'nessuna via di WME con nome nelle vicinanze',
            dejaOld: 'Scansione fatta da una versione precedente di WBC, con risultati diversi: rilanciarla.',
            ajHnAdd: n => 'Aggiungi i numeri (' + n + ')',
            nextStreet: n => 'Via successiva (' + n + ' da aggiungere)',
            tipNextStreet: 'Apre la via del comune in cui «Aggiungi» ha più numeri da inserire (nome BAN come principale o alternativo), saltando le vie già aperte con questo pulsante.',
            nextStreetNone: 'Nessun’altra via pronta: le rimanenti hanno già i numeri, o prima va corretto il nome.',
            ajHnAddTip: r => 'Solo L6: inserisce in WME i numeri mancanti di questa via, sui segmenti il cui nome principale è quello della BAN (accenti, maiuscole, trattini e punti tollerati) e la cui città è il comune o «Village (Commune)»; un indirizzo in fondo a un accesso diventa un RPP. Al massimo 500 modifiche per ora mobile, contate al salvataggio (restano ' + r + '). Niente viene salvato: controlla, poi salva in WME. Anche gli indirizzi fuori centro abitato diventano RPP.',
            ajHnNoName: 'Il nome WME di questa via non è quello della BAN: l’aggiunta automatica richiede un nome principale identico a quello della BAN.',
            ajHnNone: 'Nessun numero può essere aggiunto automaticamente su questa via.',
            ajHnLoin: n => 'Nessun numero da aggiungere automaticamente: ' + n + ' indirizzo/i a più di 80 m dalla via disegnata in WME. Avvicina il segmento se è mal posizionato.',
            ajHnNomEcart: (w, b) => 'Nessun numero da aggiungere automaticamente: in WME i segmenti di questa via si chiamano «' + w + '», non «' + b + '» come nella BAN. Dai loro il nome della BAN.',
            ajHnQuota: h => 'Quota raggiunta (500 numeri all’ora): prossima aggiunta possibile alle ' + h + '.',
            ajHnRunning: 'Aggiunta dei numeri…',
            bgTab: 'Scheda in secondo piano: Chrome rallenta il lavoro in corso (fino a 3 volte più lungo). Tieni questa scheda in primo piano.',
            bgTabTip: 'Chrome rallenta i timer di una scheda nascosta (uno al secondo, poi uno al minuto dopo 5 minuti) e ne abbassa la priorità. Misurato il 29/09/2026: un dipartimento in 41 min in secondo piano contro 13 min in primo piano.',
            ajHnDone: (n, r) => n + (un1(n) ? ' numero inserito — controllalo' : ' numeri inseriti — controllali') + ', poi salva in WME. Quota residua: ' + r + '.',
            ajHnDoneMix: (n, r, q) => n + (un1(n) ? ' numero' : ' numeri') + ' e ' + r + ' RPP inseriti — controllali, poi salva in WME. Quota residua: ' + q + '.',
            ajHnDoneRpp: (r, q) => r + (un1(r) ? ' RPP inserito — controllalo' : ' RPP inseriti — controllali') + ', poi salva in WME. Quota residua: ' + q + '.',
            ajRppCrit: l => '⚠️ Da sistemare a mano: ' + l + '.',
            ajRppCritPoi: n => 'RPP ' + n + ' rimasto senza indirizzo',
            ajHnStopTip: 'Fermare l’aggiunta in corso dopo l’inserimento attuale; quanto inserito resta, da ricontrollare.',
            ajHnStopping: 'Arresto richiesto…',
            ajHnStopped: 'Fermato su tua richiesta.',
            ajHnFail: n => n + (un1(n) ? ' inserimento fallito' : ' inserimenti falliti') + ' (dettagli nella console).',
            rhnUnsaved: 'Salva (o annulla) prima le modifiche in sospeso: WME non lascia più leggere agli script ciò che non è salvato, e «⇄» non deve né duplicare un numero né riprendere un oggetto eliminato.',
            rhnLock: n => 'Questo RPP è bloccato al livello ' + n + ', sopra il tuo livello: la conversione diventerà un suggerimento al salvataggio.',
            rhnLockInfo: n => 'Il RPP rimosso era bloccato al livello ' + n + '.',
            rhnSegLock: n => (n ? 'Il segmento è bloccato al livello ' + n + ', sopra il tuo livello' : 'WME non ti lascia modificare direttamente i numeri di questo segmento') + ': la conversione diventerà un suggerimento al salvataggio.',
            suggAttente: 'WME non ha tenuto questa modifica come suggerimento: salva (o annulla) prima le modifiche dirette in sospeso — WME non salva mai insieme suggerimenti e modifiche dirette.',
            suggMixte: 'Non viene convertito nulla: uno dei due oggetti sarebbe un suggerimento e l’altro una modifica diretta, e WME non li salva insieme. Chiedi a un editor di livello sufficiente.',
            rhnCritRpp: n => 'RPP ' + n + ' rimosso senza numero inserito: annulla (Ctrl+Z) in WME',
            ajHnSansAlt: (r, c) => 'Alcuni segmenti fuori dal centro abitato portano «' + r + '» senza città ma non l’alternativo «' + r + ' / ' + c + '»: il «+» vi inserisce comunque un RPP, ma l’alternativo va aggiunto.',
            ajHnSansAltRoute: (r, c) => 'Alcuni segmenti fuori dal centro abitato hanno un numero di strada come nome principale, senza città, ma non l’alternativo «' + r + ' / ' + c + '»: il «+» vi inserisce comunque un RPP, ma l’alternativo va aggiunto.',
            rhnT: n => 'RPP di questa via (' + n + ')',
            rhnTip: 'Mostra l’RPP sulla mappa. Al passaggio del mouse, «⇄» lo sostituisce con un numero del segmento quando il caso è netto.',
            rhnConv: 'Sostituisci questo RPP con un numero',
            rhnConvTip: 'In centro abitato, sostituisce questo RPP con un numero sul segmento — solo nei casi netti (stesso numero già sulla via, o punto di accesso / posizione lungo la propria via, come WME Naming Auditor). Rifiutato se l’RPP ha un nome o una foto. Conta nella quota; niente viene salvato.',
            rhnDone: (n, q) => 'RPP n. ' + n + ' sostituito con un numero sul segmento — controllalo, poi salva in WME. Quota residua: ' + q + '.',
            rhnDoneDbl: (n, q) => 'Il n. ' + n + ' era già sulla via: l’RPP doppio viene rimosso — controlla, poi salva in WME. Quota residua: ' + q + '.',
            rhnNotFound: 'RPP non trovato in WME in questo punto (spostato, modificato o cancellato dopo l’analisi?): rilancia l’analisi.',
            rhnNoPlaces: 'Nessun luogo caricato in WME: il livello «Luoghi» è probabilmente nascosto. Mostralo, poi riprova.',
            rhnNamed: 'Questo RPP ha un nome: non viene convertito (da vedere a mano).',
            rhnPhoto: 'Questo RPP ha una foto: non viene convertito (qualcuno è venuto sul posto; da vedere a mano).',
            rhnCity: v => 'Questo RPP appartiene a «' + v + '», non al comune: non viene convertito.',
            rhnStreet: r => 'Questo RPP porta la via «' + r + '», non il nome BAN della via: non viene convertito.',
            rhnNoSeg: 'Nessun segmento della via (nome BAN come principale, comune come città) entro 80 m: l’RPP è probabilmente fuori dal centro abitato, resta.',
            rhnLegit: v => 'Il punto di accesso dell’RPP dà su «' + v + '», non sulla sua via: l’RPP esprime uno scarto che un numero di segmento non può, resta.',
            rhnUnsure: 'Niente di netto (un’altra via altrettanto vicina, o troppo lontano da ogni via): l’RPP resta, da vedere a mano.',
            rhnFormat: n => 'Il numero «' + n + '» non si scrive come un numero di segmento: da vedere a mano.',
            rhnErr: m => 'Sostituzione interrotta: ' + m,
            rhnPoseTip: 'Sostituito con un numero (non ancora salvato).',
            rhnVersRpp: 'Trasforma questo numero in RPP',
            rhnVersRppTip: 'Toglie questo numero dal segmento e crea al suo posto un RPP (stesso numero, stessa via), con il punto di ingresso sul segmento senza nome più vicino o su un accesso (strada privata, viabilità di parcheggio); l’RPP viene poi selezionato per regolarne l’ingresso. Conta nella quota; niente viene salvato.',
            rhnVersRppDone: (n, q) => 'N. ' + n + ' trasformato in RPP — regola il punto di ingresso se serve (è selezionato), poi salva in WME. Quota residua: ' + q + '.',
            rhnVersRppAbsent: n => 'Il numero ' + n + ' non si trova in WME (segmento non caricato, o numero già tolto): nulla è cambiato.',
            rhnVersRppTipPose: 'Trasformato in RPP (non ancora salvato).',
            ajHnSkip: n => n + (un1(n) ? ' indirizzo scartato' : ' indirizzi scartati') + ' (dettagli nella console).',
            ajHnCut: (n, h) => n + (un1(n) ? ' indirizzo non inserito' : ' indirizzi non inseriti') + ': quota raggiunta, si potrà riprendere alle ' + h + '.',
            ajHnNoSeg: 'Nessun segmento caricato porta esattamente questo nome come nome principale con il comune come città: non è stato inserito nulla.',
            ajHnErr: m => 'Aggiunta interrotta: ' + m,
            ajHnRights: '«Aggiungi i numeri» di un’intera via è riservato agli editor L6; il «+» di un solo numero e le conversioni «⇄» sono aperti a tutti i livelli.',
            ajHnSee: n => (un1(n) ? 'È cerchiato' : 'Sono cerchiati') + ' in turchese sulla mappa.',
            ajHnPoseTip: 'Inserito da WBC, non ancora salvato: clicca per centrare la mappa.',
            ajHnSaved: (c, r, q) => 'Salvataggio: ' + c + (un1(c) ? ' numero contato' : ' numeri contati') + ', ' + r + ' restituiti alla quota (rimossi prima del salvataggio). Quota residua: ' + q + '.',
            ajHnSavedTip: 'Inserito da WBC e salvato.',
            hHnT: 'Aggiungere i numeri',
            hHnB: '<p><i>Aggiungi i numeri</i> di un’intera via: solo editor <b>L6</b>. <b>Un numero alla volta</b> e le conversioni <b>⇄</b> (numero → RPP, RPP → numero) sono aperti a <b>tutti i livelli</b>, con gli stessi controlli e la stessa quota; senza diritto sul segmento o sul RPP (blocco sopra il tuo livello), WME ne fa un suggerimento al salvataggio — se non ci sono modifiche dirette in sospeso, e per una conversione solo se i due oggetti sono nello stesso caso. Nella riga aperta di una via, <i>Aggiungi i numeri</i> inserisce in WME i suoi indirizzi mancanti — <b>via per via</b>, mai per un intero comune. Per un solo numero: il «+» della sua etichetta (al passaggio del mouse) o un clic sul suo punto sulla mappa. Valgono i diritti di WME: per un solo numero o una conversione, un segmento bloccato sopra il tuo livello (o fuori dalle tue aree di modifica) dà un suggerimento al salvataggio; <i>Aggiungi i numeri</i> di un’intera via salta questi segmenti, e il messaggio lo dice.</p><p><b>Condizioni</b>: il nome principale dei segmenti è quello della BAN (accenti, maiuscole, apostrofi, spazi, trattini e punti tollerati; una grafia diversa è solo segnalata) e la loro città è il comune o «Village (Commune)». Ogni numero va al segmento ammesso più vicino (80 m al massimo); un numero già presente, anche in attesa in questa scheda, non viene mai reinserito; un suffisso diverso (12 b / 12bis) o numerico è lasciato all’editor, salvo se WME ha solo il numero senza suffisso (32 per 32 B): allora viene inserito, con un avviso.</p><p><b>Niente viene salvato</b>: i numeri inseriti sono cerchiati in turchese sulla mappa (anche a finestra chiusa) e segnati con ✚ nella via; controllali, poi salva o annulla in WME.</p><p><b>Quota</b>: 500 numeri per ora mobile. Un numero è riservato quando viene inserito e contato se si trova sul server dopo il salvataggio; rimosso o modificato prima, viene restituito. I numeri inseriti a mano non contano mai. Una volta salvati, risultano «trovati» senza rilanciare l’analisi; un’analisi salvata più vecchia lo segnala («rilancia»). Il badge &#x271A; nell’intestazione della finestra indica quanto resta: arancione sotto il 20 %, rosso sotto il 5 %.</p><p><b>RPP</b>: un indirizzo in fondo a un accesso (strada privata o viabilità di parcheggio entro 80 m, la sua via entro 250 m) diventa un luogo residenziale (RPP), anche con il pulsante della via. Un indirizzo fuori centro abitato (segmento il cui nome principale non ha città e che porta il nome BAN con il comune come alternativo) diventa un RPP, con il pulsante della via come con il «+». L’RPP è creato nella posizione BAN, con il suo indirizzo e il suo punto di ingresso sul segmento (o l’accesso) più vicino; un indirizzo rifiutato rimuove il luogo. Il suo blocco è quello che WME assegna d’ufficio (nessuna tabella per la Francia ne fissa uno per un RPP). Gli RPP contano nella quota. Un indirizzo senza alcun segmento con il nome BAN entro 80 m, ma vicino a una strada percorribile di altro nome, diventa anch’esso un RPP: indirizzo «nome BAN / comune», ingresso da quella strada.</p><p><b>Numero → RPP</b>: nella bolla del punto di un numero (salvato, o inserito da WBC e non ancora salvato), «⇄ Trasforma questo numero in RPP» toglie il numero e crea al suo posto un RPP (stesso numero, stessa via), con il punto di ingresso sul segmento senza nome o sull’accesso più vicino (rotatoria, strada privata…); l’RPP viene poi selezionato per regolarne l’ingresso. Un numero inserito da WBC cambia solo natura nella quota; un numero salvato conta 2.</p><p><b>RPP → numero</b>: nella via aperta, gli RPP della via hanno le loro etichette; al passaggio del mouse, «⇄» sostituisce UN RPP con un numero sul segmento, solo nei casi netti (come WME Naming Auditor): stesso numero già sulla via entro 150 m (l’RPP è doppio e viene semplicemente rimosso), o punto di accesso — altrimenti posizione — lungo la propria via senza altre vie entro 10 m. Un punto di accesso su un’altra via prova che l’RPP è legittimo: resta. Rifiutato se l’RPP ha un nome o una foto, un’altra città o un’altra via. Anche con un clic sul suo punto sulla mappa. Stessa quota; niente viene salvato. Il blocco del RPP viene letto: sopra il tuo grado, la sostituzione diventa un suggerimento al salvataggio; altrimenti il messaggio lo indica. Nessuna modifica deve attendere il salvataggio (WME non lascia più leggere agli script ciò che è in sospeso); una sostituzione conta 2 nella quota (RPP rimosso, numero inserito). Anche selezionando il triangolo dell’RPP in WME (finestra di WBC aperta).</p><p><b>Ferma</b>: mentre si riempie una via lunga (la mappa si sposta di zona in zona), il pulsante Ferma interrompe il passaggio; quanto inserito resta, da ricontrollare. Un inserimento fallito è contato nel messaggio. <b>Limite</b>: un numero digitato a mano e non ancora salvato non è visto come doppione — salva prima di aggiungere sulla stessa via. Due schede di WME aperte insieme non vedono i numeri in attesa l’una dell’altra: inserire da una sola scheda.</p>',
            ajHnQuotaTip: 'Ora mobile: un numero conta per un’ora da quando è inserito. Sono contati solo i numeri inseriti con questo pulsante e salvati davvero.',
            ajHnLeft: n => 'Quota: ' + n + ' rimanenti in quest’ora',
            ajHnFull: h => 'Quota raggiunta — prossima aggiunta alle ' + h,
            ajHn1: 'Aggiungi questo numero',
            ajHn1Tip: 'Inserisce in WME solo questo numero (tutti i livelli), con i controlli di «Aggiungi i numeri» (nome BAN, città, segmento entro 80 m, doppione); conta nella quota. Niente viene salvato.',
            ajHn1Exists: n => 'Il numero ' + n + ' è già in WME su questa via: niente inserito.',
            ajHn1Rights: 'WME non ti ha identificato come editor (nome e livello illeggibili): ricarica WME e riprova.',
            ajHn1Lock: (n, v) => 'Il numero ' + n + ' diventerà un suggerimento al salvataggio: ' + (v ? 'il suo segmento è bloccato al livello ' + v + ', sopra il tuo livello' : 'WME non ti lascia modificare direttamente i numeri del suo segmento') + '; lo approverà un editor di livello sufficiente.',
            ajHn1Bloque: v => (v ? 'Il suo segmento è bloccato al livello ' + v + ', sopra il tuo livello' : 'Il suo segmento è fuori dalle tue aree di modifica') + ': questo numero diventerà un suggerimento al salvataggio, da approvare da un editor di livello sufficiente.',
            ajHnLockSkip: n => n + (un1(n) ? ' numero non inserito' : ' numeri non inseriti') + ': segmento che WME non ti lascia modificare (blocco o aree di modifica).',
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
            hTrackB: '<p><b>Mappa del dipartimento</b>: dopo un dipartimento, ogni comune è colorato secondo la copertura (chiaro = poca, scuro = molta). Al passaggio del mouse compaiono le sue cifre; a mappa rimpicciolita, un clic lo apre.</p><p><b>Numero mancante</b>: con la via aperta, una linea tratteggiata porta al segmento che probabilmente dovrebbe portarlo; il suo identificativo è nel CSV.</p><p><b>Seleziona i segmenti</b> di una via dalla sua riga: vengono selezionati in WME.</p><p><b>Avanzamento</b>: l’esportazione CSV fa anche da rilievo. Più tardi, <i>Confronta</i> la rilegge e dà la variazione via per via (o comune per comune). Nulla viene conservato altrove.</p><p><b>Scarti (CSV)</b>: le vie da rinominare, ciascuna con un link WME, da correggere o inviare ai responsabili della zona.</p><p><b>Strumenti della via</b>: nella riga aperta di una via, icone con contatore — selezionare i segmenti, aggiungere i numeri, via successiva, segnalare alla BAN o contattare il municipio; il nome di ciascuna appare al passaggio del mouse.</p><p><b>Confine del comune</b>: l’icona del poligono, accanto alle esportazioni, traccia sulla mappa il confine amministrativo del comune; la scelta viene ricordata.</p>',
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
            memoWmeProg: (i, n) => 'WME: verifica ' + i + '/' + n,
            memoWmeOk: 'WME invariato',
            memoWmeMaj: d => 'WME modificato' + (d ? ' (' + d + ')' : ''),
            memoWmeMajN: n => 'WME modificato: ' + n,
            memoUpd: 'Aggiorna',
            memoUpdTip: 'Rilegge la BAN e WME per questo comune e aggiorna il risultato, in un solo gesto.',
            memoUpdDepTip: 'Controlla la BAN e WME di ogni comune, poi rianalizza quelli cambiati.',
            contourBtn: 'Confine del comune',
            contourTip: 'Mostra o nasconde sulla mappa il confine amministrativo del comune (geo.api.gouv.fr, già letto per l’analisi).',
            memoTagBan: 'BAN aggiornata dopo la scansione',
            memoTagWme: 'WME modificato dopo la scansione',
            secMemo: 'Scansioni salvate',
            memoHint: 'Conservate solo in questo browser. Riaprirne una la mostra subito e verifica se la BAN è cambiata da allora.',
            memoNone: 'Nessuna scansione salvata.',
            memoOpen: 'Apri',
            memoDel: 'Elimina questa scansione',
            memoClear: 'Elimina tutto',
            memoErr: m => 'Impossibile salvare la scansione: ' + m,
            hMemoT: 'Scansioni salvate e aggiornamenti',
            hMemoB: '<p>Ogni scansione è conservata in questo browser (non viene inviato nulla). Scegliere di nuovo lo stesso comune o dipartimento, o <i>Apri</i> nella scheda Script, la mostra subito con la sua data. Anche <i>Analizza</i> lo ricorda: se la stessa zona è già stata scansionata, compare la sua data con <i>Apri</i> e <i>Rilancia</i>. Se da allora WBC ha aggiunto numeri in quell’area, l’avviso lo dice e <i>Rilancia</i> diventa il pulsante principale.</p><p><b>Aggiorna</b>: per un comune, la BAN e WME vengono rilette e il risultato sostituito. Per un dipartimento, il file degli indirizzi di ogni comune viene controllato (una richiesta per comune), poi WME viene riletto, numeri compresi (segmenti, ogni numero — i numeri non hanno data in WME — e punti residenziali); i comuni cambiati vengono rianalizzati, gli altri restano.</p><p>I comuni cambiati portano un’etichetta BAN o WME e un contorno arancione sulla mappa fino alla nuova analisi.</p>',
            memoClearSure: 'Clicca di nuovo per eliminare tutto',
        },
        'pt-BR': {
            sbHint: 'Compara a base nacional de endereços (BAN) com os números e os pontos residenciais (RPP) do WME, para um município ou um departamento inteiro.',
            sbOpen: 'Abrir a janela',
            sbHelp: 'Ajuda',
            hWhatT: 'O que é comparado',
            hWhatB: "<p>A <b>BAN</b> é a referência: cada endereço que ela lista deveria existir no WME, como número em um segmento (HN) ou como ponto residencial (RPP).</p><p><b>Fontes</b>, lidas ao vivo: a <b>Base Adresse Nationale</b> (adresse.data.gouv.fr, Estado francês; Licence Ouverte Etalab 2.0; a data de revisão de cada município é exibida); os limites e listas de municípios do <b>geo.api.gouv.fr</b> (API Découpage administratif, dados do INSEE e do IGN, Licence Ouverte Etalab 2.0); a <b>API pública de reportes da BAN</b> (signalement.adresse.data.gouv.fr) para o estado dos reportes; e o WME nos mesmos servidores do editor. A área não precisa estar exibida nem carregada. Desde 12/11/2026, o Waze credencia a BAN para a França (exibição e criação assistida de números de casa, página Map Data Attribution); adicionar uma rua inteira continua um gesto de L6; um número por vez está aberto a todos os níveis; tudo com cota.</p><p><b>O que sai do navegador</b>: para o geo.api.gouv.fr, no modo “Centro do mapa”, o centro do mapa ARREDONDADO a 3 casas decimais (cerca de 100 m) e as suas buscas de município — sem identidade nem cookie; para a BAN e a API de reportes, o código do município; na inicialização, o GitHub (version-min.json, versão mínima: uma versão retirada não inicia) e o GreasyFork (nova versão) são apenas lidos. Para o data.geopf.fr (Géoplateforme do IGN), com a caixa WBC do menu Camadas marcada: a extensão da vista, a partir do zoom 18, sem cookie. Nada mais; o seu nome de usuário não vai para nenhum terceiro (só para o Discuss do Waze, para o botão Copiar).</p><p><b>Reportar à BAN</b>: abre a ferramenta oficial (signalement.adresse.data.gouv.fr) em uma nova aba, na rua ou no número; o WBC não envia nada, é você quem preenche e envia o formulário. Para um número do WME ausente da BAN, o comentário pré-preenchido traz o endereço lido no Waze (“Adresse présente dans Waze: …”): revise, altere ou apague antes de enviar.</p><p><b>BAN da vista</b>: com a caixa WBC do menu Camadas marcada e nenhuma análise exibida nesse lugar, os endereços BAN da vista aparecem a partir do zoom 18, em cinza (somente leitura); circulados de verde quando o WME já tem o mesmo número na mesma rua ou a menos de 30 m (números salvos, pontos residenciais). <b>Ctrl+clique</b> (Cmd+clique no Mac) no botão do mapa: o município no centro é analisado, ou a sua varredura recente reaberta, e mostrado no mapa sem abrir a janela. Enquanto a janela do WBC está aberta, as camadas do WME “Números de casa” e “Residencial” ficam visíveis; ao fechá-la, voltam ao estado anterior.</p>",
            hMatchT: 'Quando um número é encontrado',
            hMatchB: '<p>Um endereço da BAN é encontrado quando o WME tem o mesmo número (sufixos incluídos: <i>bis</i>, <i>ter</i>, letras) a menos de 150 m, e:</p><table class="wbc-help-table"><tr><td>1</td><td>em uma rua com o mesmo nome (principal ou alternativo), ou que só difere por um artigo (“Avenue Sembrancher” = “Avenue de Sembrancher”; a diferença de nome continua sinalizada);</td></tr><tr><td>2</td><td>ou em um segmento que leva os endereços dessa rua, <b>com ou sem nome</b>;</td></tr><tr><td>3</td><td>ou a menos de 30 m do endereço.</td></tr></table><p>A regra 1 é tentada primeiro em todo lugar, depois a 2, depois a 3. Um número do WME só serve uma vez.</p>',
            hNamesT: 'A coluna «Rua WME»',
            hNamesB: '<table class="wbc-help-table"><tr><td>&#x2713;</td><td>os segmentos próximos dos endereços têm o nome da BAN.</td></tr><tr><td><i>nome</i></td><td>têm outro nome: o nome a verificar.</td></tr><tr><td><i>sem nome</i></td><td>não têm nome.</td></tr><tr><td><i>nenhum segmento</i></td><td>nenhum segmento a menos de 80 m dos endereços.</td></tr><tr><td>&#x2713; alt</td><td>o nome da BAN está como nome <b>alternativo</b>; o nome principal aparece ao lado.</td></tr><tr><td>nº de rodovia</td><td>o nome principal é um número de rodovia e o nome da BAN falta nos alternativos: adicionar.</td></tr><tr><td>tipo</td><td>só o tipo de via difere (Rue / Chemin…).</td></tr><tr><td>artigo · grafia · parcial</td><td>nomes parecidos: um artigo, uma ou duas letras, ou uma forma abreviada. <i>ausente do WME</i>: a rua não existe no WME, o nome mostrado é o da vizinha.</td></tr><tr><td>&#x2713; estacionamento</td><td>nenhum segmento com nome, mas um local Estacionamento próximo tem o nome da BAN: nada a renomear.</td></tr><tr><td>&#x2713; grafia BAN</td><td>mesmo nome a menos de um hífen ou ponto (“Rue Paul-Louis Courier” / “Rue Paul Louis Courier”): nada a renomear.</td></tr></table><p>Um número faltando em laranja com <b>≠</b> existe no WME com outro sufixo (12 b / 12bis): verificar. Se o WME só tem o número sem sufixo (32 / 32 B), ele é colocado mesmo assim e o aviso continua.</p><p>&#x26A0; indica um nome da BAN que nenhum segmento do município tem.</p>',
            hLimitsT: 'Bom saber',
            hLimitsB: "<p>Um departamento inteiro leva alguns minutos: a BAN é lida município por município, o WME em quadrados de cerca de 5 km. O botão Parar interrompe; o que foi feito continua visível e os municípios com erro podem ser refeitos sozinhos.</p><p>Paris, Marselha e Lyon são lidas distrito por distrito. As varreduras ficam somente neste navegador (IndexedDB), nunca em outro lugar, com as suas preferências (área, interruptores, posição da janela, cores dos pontos); são sinalizadas quando a BAN ou o WME mudaram desde então.</p>",
            hSafeB: "O script só altera o mapa a pedido de um editor: o “+” de um endereço (um número ou um RPP, todos os níveis); e, para um L6, “Adicionar os números” (rua por rua: números, e RPP no fim de um acesso), “⇄” (um RPP substituído por um número) e “Transformar este número em RPP” — no máximo 500 por hora móvel, por editor; nunca salva. Os resultados ficam neste navegador.",
            remTitle: "Você continua responsável pelas suas edições",
            remBody: "<p>O WME BAN Coverage <b>propõe</b>: ele nunca salva nada sozinho.</p><p>Cada número, RPP ou conversão “⇄” chega ao WME como uma edição pendente. Confira no mapa e depois salve ou desfaça no WME.</p><p>O que você salva é a sua edição, como se a tivesse feito à mão.</p>",
            remNote: "Este lembrete aparece uma vez por navegador; você pode revê-lo na aba do script.",
            remOk: "Entendi",
            remCancel: "Cancelar",
            remLink: "Rever o lembrete de responsabilidade",
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
            renomRelance: n => n + (n > 1 ? ' ruas renomeadas no WME desde a análise: os números do município estão atualizados.' : ' rua renomeada no WME desde a análise: os números do município estão atualizados.'),
            renomNeuf: n => 'Segmento criado no WME perto de ' + n + (n > 1 ? ' ruas que não tinham nenhum: os números do município estão atualizados.' : ' rua que não tinha nenhum: os números do município estão atualizados.'),
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
            filterClear: 'Limpar o filtro',
            filterCount: (n, m) => n + (un1(n) ? ' rua de ' : ' ruas de ') + m,
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
            sbRppNum: "Número dos RPP",
            sbRppNumHint: "Escreve o número sob o triângulo de cada lugar residencial (RPP) carregado no WME, a partir do zoom 17: não é mais preciso clicar para saber qual é. Só exibição.",
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
            smallTip: "Janela pequena (tamanho original)",
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
            tipMemoOpen: "Abrir a janela nesta varredura e enquadrar o mapa nela.",
            tipMemoClear: "Apagar todas as varreduras salvas neste navegador (dois cliques).",
            tipSbOpen: "Abrir a janela do WBC (como o botão à direita do mapa).",
            tipColorsReset: "Restaurar as cores padrão dos pontos.",
            tipHelpHdr: "Expandir ou recolher esta parte da ajuda.",
            tipFab: "Abrir ou fechar a janela",
            dirZoom: n => 'Endereços BAN: aproxime ao nível ' + n + ' ou mais',
            dirLoading: 'Endereços BAN: lendo…',
            dirNone: 'Endereços BAN: nenhum na vista',
            dirCount: n => n + (un1(n) ? ' endereço BAN na vista' : ' endereços BAN na vista'),
            dirCap: (n, m) => n + ' endereços BAN exibidos de ' + m + ': aproxime para ver todos',
            dirErr: m => 'Endereços BAN: leitura impossível — ' + m,
            dirEdition: d => 'edição de ' + d,
            dirSource: 'Fonte: Base Adresse Nationale (adresse.data.gouv.fr), difundida pela Géoplateforme do IGN — Licence Ouverte Etalab 2.0. Somente leitura: nada é escrito; desmarque WBC no menu Camadas para ocultá-los.',
            dirFiche: 'BAN, vista sem análise',
            dirWme: p => p + ' já no WME',
            dirFicheWme: 'Já no WME (mesmo número, mesma rua ou a menos de 30 m)',
            dirFicheAbs: 'Não está entre os números carregados no WME',
            tipFabCtrl: mac => (mac ? 'Cmd' : 'Ctrl') + '+clique: mostrar a BAN do município no centro',
            fabBusy: 'Analisando o município no centro…',
            fabErr: m => 'Falhou: ' + m,
            fabDeja: 'Uma análise já está em andamento.',
            tipVoie: "Expandir a via (seus números, os faltantes em vermelho) e enquadrar o mapa nela.",
            tipCommune: "Abrir o detalhe deste município e enquadrar o mapa nele.",
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
            dejaRelaunchTip: "Refaz toda a análise.",
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
            ponctTag: "grafia BAN",
            tipOrtho: "A grafia difere em uma ou duas letras",
            tipPonct: "A BAN não escreve este nome corretamente (hífen, ponto…): o nome do WME é mantido e os números são adicionados mesmo assim",
            partielTag: "parcial",
            tipPartiel: "Um nome é a forma abreviada do outro",
            absentTag: "ausente do WME",
            altTag: "alt",
            parkTag: "estacionamento",
            tipPark: "Nenhum segmento com nome: o nome da BAN está no local Estacionamento próximo (as vias de estacionamento ficam sem nome).",
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
            kFar: n => 'sendo ' + n + ' longe do ponto BAN',
            kArret: n => n + ' ponto(s) de chegada distante(s)',
            hovArret: d => 'Ponto de chegada ' + d + ' m a mais',
            arrT: (n, s) => 'Pontos de chegada distantes (' + n + ', além de ' + s + ' m)',
            arrTip: d => 'O ponto de chegada está ' + d + ' m além da rua ao lado do número do WME: verifique no WME',
            sbArret: 'Sinalizar ponto de chegada distante a partir de',
            sbArretHint: 'Distância entre o número do WME e o local para onde o Waze guia, menos a distância dele até a rua. Aplicado na hora, sem nova análise.',
            tipFar: d => 'Colocado a ' + d + ' m do endereço BAN',
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
            banVoie: 'Reportar à BAN',
            banVoieTip: 'Abre a ferramenta oficial de reporte da BAN nesta rua, para pedir a alteração do nome. Nada é enviado antes de você enviar o formulário.',
            banNumTip: n => 'Reportar o número ' + n + ' à BAN: a ferramenta oficial abre neste endereço (alteração ou exclusão). Nada é enviado antes de você enviar o formulário.',
            banNoKey: 'Sem identificador BAN aqui: o mapa da BAN abre no lugar certo. Clique em um número, depois no nome da rua se for a rua o problema, e em “Signaler un problème”.',
            banOff: m => 'Este município não aceita reportes on-line' + (m ? ': ' + m : '.') + ' A página oficial abre mesmo assim, com o contato da prefeitura: o resto é feito por e-mail.',
            banMap: 'Ver no mapa da BAN',
            banMairie: 'Contatar a prefeitura',
            banAmbig: 'Atenção: neste novo município a mesma chave BAN existe em vários municípios delegados; confira o endereço exibido antes de reportar.',
            banTropTip: n => 'Reportar à BAN que o ' + n + ' está faltando: a ferramenta oficial abre na posição dele (alerta “endereço faltante”). Nada é enviado antes de você enviar o formulário.',
            sigT: (n, a) => 'Reportes à BAN (' + n + (a ? ', ' + a + ' pendentes' : '') + ')',
            sigTip: 'Todos os reportes enviados à BAN para este município (por qualquer pessoa), com o resultado. Um clique centraliza o mapa.',
            sigVoieT: n => 'Reportes à BAN nesta rua (' + n + ')',
            sigSt: s => ({ PENDING: 'pendente', PROCESSED: 'processado', IGNORED: 'recusado', EXPIRED: 'expirado' })[s] || s,
            sigDem: (k, v) => ({ nom: 'nome → ' + v, num: 'número → ' + v, voie: 'rua → ' + v, del: 'exclusão', create: 'criação', missing: 'endereço faltante', autre: 'posição ou lotes' })[k] || k,
            sigMotif: m => 'motivo: ' + m,
            sigDeja: (d, st) => 'Já reportado em ' + d + ' (' + st + ').',
            snbT: (v, a) => 'Ruas sem nome na BAN (' + v + ' ruas, ' + a + ' endereços)',
            snbTip: 'O município publicou esses endereços com um nome provisório (“Non renseigné”…): nada a colocar no WME enquanto ele não nomear a rua. Uma linha por rua da BAN, fora da taxa de cobertura. Reporte ou fale com a prefeitura.',
            snbPres: n => 'perto de “' + n + '” no WME',
            snbNone: 'nenhuma rua com nome no WME por perto',
            dejaOld: 'Análise feita por uma versão anterior do WBC, com resultados diferentes: execute de novo.',
            ajHnAdd: n => 'Adicionar os números (' + n + ')',
            nextStreet: n => 'Próxima rua (' + n + ' a adicionar)',
            tipNextStreet: 'Abre a rua do município onde “Adicionar” tem mais números a colocar (nome da BAN como principal ou alternativo), pulando as ruas já abertas por este botão.',
            nextStreetNone: 'Nenhuma outra rua pronta: as restantes já têm seus números, ou precisam primeiro de correção do nome.',
            ajHnAddTip: r => 'Somente L6: coloca no WME os números que faltam nesta rua, nos segmentos cujo nome principal é o da BAN (acentos, maiúsculas, hífens e pontos tolerados) e cuja cidade é o município ou “Village (Commune)”; um endereço no fim de um acesso vira RPP. No máximo 500 edições por hora móvel, contadas ao salvar (restam ' + r + '). Nada é salvo: confira e depois salve no WME. Os endereços fora da área urbana também viram RPP.',
            ajHnNoName: 'O nome WME desta rua não é o da BAN: a adição automática exige um nome principal idêntico ao da BAN.',
            ajHnNone: 'Nenhum número pode ser adicionado automaticamente nesta rua.',
            ajHnLoin: n => 'Nenhum número a adicionar automaticamente: ' + n + ' endereço(s) a mais de 80 m da rua desenhada no WME. Aproxime o segmento se estiver mal colocado.',
            ajHnNomEcart: (w, b) => 'Nenhum número a adicionar automaticamente: no WME, os segmentos desta rua chamam-se «' + w + '», e não «' + b + '» como na BAN. Dê-lhes o nome da BAN.',
            ajHnQuota: h => 'Cota atingida (500 números por hora): próxima adição possível às ' + h + '.',
            ajHnRunning: 'Adicionando os números…',
            bgTab: 'Aba em segundo plano: o Chrome deixa o trabalho em andamento mais lento (até 3 vezes mais longo). Mantenha esta aba em primeiro plano.',
            bgTabTip: 'O Chrome limita os temporizadores de uma aba oculta (um por segundo, depois um por minuto após 5 minutos) e reduz sua prioridade. Medido em 29/09/2026: um departamento em 41 min em segundo plano contra 13 min em primeiro plano.',
            ajHnDone: (n, r) => n + (un1(n) ? ' número colocado' : ' números colocados') + ' — confira e depois salve no WME. Cota restante: ' + r + '.',
            ajHnDoneMix: (n, r, q) => n + (un1(n) ? ' número' : ' números') + ' e ' + r + ' RPP colocados — confira e depois salve no WME. Cota restante: ' + q + '.',
            ajHnDoneRpp: (r, q) => r + (un1(r) ? ' RPP colocado' : ' RPP colocados') + ' — confira e depois salve no WME. Cota restante: ' + q + '.',
            ajRppCrit: l => '⚠️ A corrigir à mão: ' + l + '.',
            ajRppCritPoi: n => 'RPP ' + n + ' ficou sem endereço',
            ajHnStopTip: 'Parar a adição em curso após a colocação atual; o que foi colocado fica, para revisar.',
            ajHnStopping: 'Parada solicitada…',
            ajHnStopped: 'Parado a seu pedido.',
            ajHnFail: n => n + (un1(n) ? ' colocação falhou' : ' colocações falharam') + ' (detalhes no console).',
            rhnUnsaved: 'Salve (ou desfaça) primeiro as alterações pendentes: o WME não deixa mais os scripts lerem o que não está salvo, e “⇄” não deve duplicar um número nem recuperar um objeto excluído.',
            rhnLock: n => 'Este RPP está bloqueado no nível ' + n + ', acima do seu nível: a conversão virará uma sugestão ao salvar.',
            rhnLockInfo: n => 'O RPP removido estava bloqueado no nível ' + n + '.',
            rhnSegLock: n => (n ? 'O segmento está bloqueado no nível ' + n + ', acima do seu nível' : 'O WME não deixa você editar diretamente os números deste segmento') + ': a conversão virará uma sugestão ao salvar.',
            suggAttente: 'O WME não manteve esta edição como sugestão: salve (ou desfaça) antes as edições diretas pendentes — o WME nunca salva sugestões e edições diretas juntas.',
            suggMixte: 'Nada é convertido: um dos dois objetos viraria sugestão e o outro edição direta, e o WME não os salva juntos. Peça a um editor de nível suficiente.',
            rhnCritRpp: n => 'RPP ' + n + ' removido sem número colocado: desfaça (Ctrl+Z) no WME',
            ajHnSansAlt: (r, c) => 'Alguns segmentos fora da área urbana têm “' + r + '” sem cidade, mas não o alternativo “' + r + ' / ' + c + '”: o “+” coloca mesmo assim um RPP, mas o alternativo ainda deve ser adicionado.',
            ajHnSansAltRoute: (r, c) => 'Alguns segmentos fora da área urbana têm um número de rodovia como nome principal, sem cidade, mas não o alternativo “' + r + ' / ' + c + '”: o “+” coloca mesmo assim um RPP, mas o alternativo ainda deve ser adicionado.',
            rhnT: n => 'RPP desta rua (' + n + ')',
            rhnTip: 'Mostrar o RPP no mapa. Ao passar o mouse, “⇄” o substitui por um número do segmento quando o caso é claro.',
            rhnConv: 'Substituir este RPP por um número',
            rhnConvTip: 'Em área urbana, substitui este RPP por um número no segmento — só em casos claros (mesmo número já na rua, ou ponto de acesso / posição ao longo da própria rua, como o WME Naming Auditor). Recusado se o RPP tiver nome ou foto. Conta na cota; nada é salvo.',
            rhnDone: (n, q) => 'RPP nº ' + n + ' substituído por um número no segmento — confira e depois salve no WME. Cota restante: ' + q + '.',
            rhnDoneDbl: (n, q) => 'O nº ' + n + ' já estava na rua: o RPP duplicado é removido — confira e depois salve no WME. Cota restante: ' + q + '.',
            rhnNotFound: 'RPP não encontrado no WME neste local (movido, alterado ou excluído desde a análise?): rode a análise de novo.',
            rhnNoPlaces: 'Nenhum lugar carregado no WME: a camada “Lugares” provavelmente está oculta. Exiba-a e tente de novo.',
            rhnNamed: 'Este RPP tem nome: não é convertido (verificar à mão).',
            rhnPhoto: 'Este RPP tem foto: não é convertido (alguém esteve no local; verificar à mão).',
            rhnCity: v => 'Este RPP pertence a “' + v + '”, não ao município: não é convertido.',
            rhnStreet: r => 'Este RPP tem a rua “' + r + '”, não o nome BAN da rua: não é convertido.',
            rhnNoSeg: 'Nenhum segmento da rua (nome BAN como principal, município como cidade) a menos de 80 m: o RPP está provavelmente fora da área urbana, fica.',
            rhnLegit: v => 'O ponto de acesso do RPP dá para “' + v + '”, não para a sua rua: o RPP expressa um deslocamento que um número de segmento não consegue, fica.',
            rhnUnsure: 'Nada claro (outra rua tão perto quanto, ou longe demais de qualquer rua): o RPP fica, verificar à mão.',
            rhnFormat: n => 'O número “' + n + '” não se escreve como um número de segmento: verificar à mão.',
            rhnErr: m => 'Substituição interrompida: ' + m,
            rhnPoseTip: 'Substituído por um número (ainda não salvo).',
            rhnVersRpp: 'Transformar este número em RPP',
            rhnVersRppTip: 'Retira este número do segmento e cria em seu lugar um RPP (mesmo número, mesma rua), com o ponto de entrada no segmento sem nome mais próximo ou num acesso (via particular, via de estacionamento); depois o RPP fica selecionado para ajustar a entrada. Conta na cota; nada é salvo.',
            rhnVersRppDone: (n, q) => 'Nº ' + n + ' transformado em RPP — ajuste o ponto de entrada se preciso (ele está selecionado) e depois salve no WME. Cota restante: ' + q + '.',
            rhnVersRppAbsent: n => 'O número ' + n + ' não foi encontrado no WME (segmento não carregado, ou número já retirado): nada mudou.',
            rhnVersRppTipPose: 'Transformado em RPP (ainda não salvo).',
            ajHnSkip: n => n + (un1(n) ? ' endereço ignorado' : ' endereços ignorados') + ' (detalhes no console).',
            ajHnCut: (n, h) => n + (un1(n) ? ' endereço não colocado' : ' endereços não colocados') + ': cota atingida, retomada possível às ' + h + '.',
            ajHnNoSeg: 'Nenhum segmento carregado tem exatamente este nome como nome principal com o município como cidade: nada foi colocado.',
            ajHnErr: m => 'Adição interrompida: ' + m,
            ajHnRights: '“Adicionar os números” de uma rua inteira é reservado aos editores L6; o “+” de um só número e as conversões “⇄” estão abertos a todos os níveis.',
            ajHnSee: n => un1(n) ? 'Ele aparece circulado em turquesa no mapa.' : 'Eles aparecem circulados em turquesa no mapa.',
            ajHnPoseTip: 'Colocado pelo WBC, ainda não salvo: clique para centralizar o mapa nele.',
            ajHnSaved: (c, r, q) => 'Salvamento: ' + c + (un1(c) ? ' número contado' : ' números contados') + ', ' + r + ' devolvidos à cota (removidos antes de salvar). Cota restante: ' + q + '.',
            ajHnSavedTip: 'Colocado pelo WBC e salvo.',
            hHnT: 'Adicionar os números',
            hHnB: '<p><i>Adicionar os números</i> de uma rua inteira: só editores <b>L6</b>. <b>Um número por vez</b> e as conversões <b>⇄</b> (número → RPP, RPP → número) estão abertos a <b>todos os níveis</b>, com as mesmas verificações e a mesma cota; sem direito sobre o segmento ou o RPP (bloqueio acima do seu nível), o WME faz disso uma sugestão ao salvar — se não houver edições diretas pendentes, e numa conversão só se os dois objetos estiverem no mesmo caso. Na linha aberta de uma rua, <i>Adicionar os números</i> coloca no WME os endereços que faltam — <b>rua por rua</b>, nunca para o município inteiro. Para um só número: o “+” da sua etiqueta (ao passar o mouse) ou um clique no seu ponto no mapa. Valem os direitos do WME: para um só número ou uma conversão, um segmento bloqueado acima do seu nível (ou fora das suas áreas de edição) gera uma sugestão ao salvar; <i>Adicionar os números</i> de uma rua inteira pula esses segmentos, e a mensagem diz isso.</p><p><b>Condições</b>: o nome principal dos segmentos é o da BAN (acentos, maiúsculas, apóstrofos, espaços, hífens e pontos tolerados; uma grafia diferente é apenas sinalizada) e a cidade deles é o município ou “Village (Commune)”. Cada número vai para o segmento admitido mais próximo (80 m no máximo); um número já presente, mesmo pendente nesta aba, nunca é colocado de novo; um sufixo diferente (12 b / 12bis) ou numérico fica para o editor, a não ser que o WME só tenha o número sem sufixo (32 para 32 B): ele é então colocado, com um aviso.</p><p><b>Nada é salvo</b>: os números colocados aparecem circulados em turquesa no mapa (mesmo com a janela fechada) e marcados com ✚ na rua; confira e depois salve ou desfaça no WME.</p><p><b>Cota</b>: 500 números por hora móvel. Um número é reservado ao ser colocado e contado se estiver no servidor após salvar; retirado ou alterado antes, ele é devolvido. Números digitados à mão nunca contam. Depois de salvos, passam a «encontrados» sem refazer a análise; uma varredura guardada mais antiga avisa («refaça»). O selo &#x271A; no cabeçalho da janela mostra o que resta: laranja abaixo de 20 %, vermelho abaixo de 5 %.</p><p><b>RPP</b>: um endereço no fim de um acesso (via particular ou via de estacionamento a menos de 80 m, sua rua a menos de 250 m) vira um lugar residencial (RPP), inclusive pelo botão da rua. Um endereço fora da área urbana (segmento cujo nome principal não tem cidade e que leva o nome BAN com o município como alternativo) vira RPP, pelo botão da rua como pelo “+”. O RPP é criado na posição BAN, com seu endereço e seu ponto de entrada no segmento (ou acesso) mais próximo; um endereço recusado remove o lugar. Seu bloqueio é o que o WME dá por padrão (nenhuma tabela da França fixa um para RPP). Os RPP contam na cota. Um endereço sem nenhum segmento com o nome BAN a menos de 80 m, mas perto de uma via trafegável de outro nome, também vira um RPP: endereço “nome BAN / município”, entrada por essa via.</p><p><b>Número → RPP</b>: no balão do ponto de um número (salvo, ou colocado pelo WBC e ainda não salvo), “⇄ Transformar este número em RPP” retira o número e cria em seu lugar um RPP (mesmo número, mesma rua), com o ponto de entrada no segmento sem nome ou acesso mais próximo (rotatória, via particular…); depois o RPP fica selecionado para ajustar a entrada. Um número colocado pelo WBC só muda de tipo na cota; um número salvo conta 2.</p><p><b>RPP → número</b>: na rua aberta, os RPP da rua têm suas etiquetas; ao passar o mouse, “⇄” substitui UM RPP por um número no segmento, só em casos claros (como o WME Naming Auditor): mesmo número já na rua a menos de 150 m (o RPP é duplicado e simplesmente removido), ou ponto de acesso — senão, posição — ao longo da própria rua sem outra rua a menos de 10 m. Um ponto de acesso para outra rua prova que o RPP é legítimo: ele fica. Recusado se o RPP tiver nome ou foto, outra cidade ou outra rua. Também com um clique no seu ponto no mapa. Mesma cota; nada é salvo. O bloqueio do RPP é lido: acima do seu nível, a substituição vira uma sugestão ao salvar; senão a mensagem o indica. Nenhuma alteração pode estar aguardando salvamento (o WME não deixa mais os scripts lerem o que está pendente); uma substituição conta 2 na cota (RPP removido, número colocado). Também selecionando o triângulo do RPP no WME (janela do WBC aberta).</p><p><b>Parar</b>: enquanto uma rua longa é preenchida (o mapa se move de zona em zona), o botão Parar interrompe a passada; o que foi colocado fica, para revisar. Uma colocação que falhou é contada na mensagem. <b>Limite</b>: um número digitado à mão e ainda não salvo não é visto como duplicado — salve antes de adicionar na mesma rua. Duas abas do WME abertas ao mesmo tempo não veem os números pendentes uma da outra: coloque a partir de uma só aba.</p>',
            ajHnQuotaTip: 'Hora móvel: um número conta durante uma hora a partir de quando é colocado. Só contam os números colocados por este botão e realmente salvos.',
            ajHnLeft: n => 'Cota: ' + n + (un1(n) ? ' restante' : ' restantes') + ' nesta hora',
            ajHnFull: h => 'Cota atingida — próxima adição às ' + h,
            ajHn1: 'Adicionar este número',
            ajHn1Tip: 'Coloca só este número no WME (todos os níveis), com as verificações de “Adicionar os números” (nome BAN, cidade, segmento a menos de 80 m, duplicado); conta na cota. Nada é salvo.',
            ajHn1Exists: n => 'O número ' + n + ' já está no WME nesta rua: nada foi colocado.',
            ajHn1Rights: 'O WME não identificou você como editor (nome e nível ilegíveis): recarregue o WME e tente de novo.',
            ajHn1Lock: (n, v) => 'O número ' + n + ' virará uma sugestão ao salvar: ' + (v ? 'o segmento está bloqueado no nível ' + v + ', acima do seu nível' : 'o WME não deixa você editar diretamente os números do segmento') + '; um editor de nível suficiente vai aprová-la.',
            ajHn1Bloque: v => (v ? 'O segmento está bloqueado no nível ' + v + ', acima do seu nível' : 'O segmento está fora das suas áreas de edição') + ': este número virará uma sugestão ao salvar, a ser aprovada por um editor de nível suficiente.',
            ajHnLockSkip: n => n + (un1(n) ? ' número não colocado' : ' números não colocados') + ': segmento que o WME não deixa você editar (bloqueio ou áreas de edição).',
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
            hTrackB: '<p><b>Mapa do departamento</b>: depois de um departamento, cada município é colorido pela cobertura (claro = pouca, escuro = muita). Passando o mouse aparecem seus números; com o mapa afastado, um clique o abre.</p><p><b>Número faltando</b>: com a rua aberta, uma linha pontilhada leva ao segmento que provavelmente deveria levá-lo; seu identificador está no CSV.</p><p><b>Selecionar os segmentos</b> de uma rua pela sua linha: eles ficam selecionados no WME.</p><p><b>Avanço</b>: a exportação CSV serve também de registro. Mais tarde, <i>Comparar</i> a relê e dá a mudança rua por rua (ou município por município). Nada é guardado em outro lugar.</p><p><b>Diferenças (CSV)</b>: as ruas a renomear, cada uma com um link WME, para corrigir ou enviar aos responsáveis da área.</p><p><b>Ferramentas da rua</b>: na linha aberta de uma rua, ícones com contador — selecionar os segmentos, adicionar os números, próxima rua, reportar à BAN ou contatar a prefeitura; o nome de cada um aparece ao passar o mouse.</p><p><b>Limite do município</b>: o ícone de polígono, ao lado das exportações, desenha no mapa o limite administrativo do município; a escolha é lembrada.</p>',
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
            memoWmeProg: (i, n) => 'WME: verificando ' + i + '/' + n,
            memoWmeOk: 'WME sem mudança',
            memoWmeMaj: d => 'WME editado' + (d ? ' (' + d + ')' : ''),
            memoWmeMajN: n => 'WME editado: ' + n,
            memoUpd: 'Atualizar',
            memoUpdTip: 'Relê a BAN e o WME deste município e atualiza o resultado, de uma vez.',
            memoUpdDepTip: 'Verifica a BAN e o WME de cada município e refaz a análise dos que mudaram.',
            contourBtn: 'Limite do município',
            contourTip: 'Mostra ou oculta no mapa o limite administrativo do município (geo.api.gouv.fr, já lido para a análise).',
            memoTagBan: 'BAN atualizada desde a varredura',
            memoTagWme: 'WME editado desde a varredura',
            secMemo: 'Varreduras guardadas',
            memoHint: 'Guardadas só neste navegador. Reabrir uma a mostra na hora e verifica se a BAN mudou desde então.',
            memoNone: 'Nenhuma varredura guardada ainda.',
            memoOpen: 'Abrir',
            memoDel: 'Apagar esta varredura',
            memoClear: 'Apagar tudo',
            memoErr: m => 'Não foi possível guardar a varredura: ' + m,
            hMemoT: 'Varreduras guardadas e atualizações',
            hMemoB: '<p>Cada varredura é guardada neste navegador (nada é enviado). Escolher de novo o mesmo município ou departamento, ou <i>Abrir</i> na aba Scripts, a mostra na hora com sua data. <i>Analisar</i> também avisa: se a mesma área já foi varrida, a data aparece com <i>Abrir</i> e <i>Refazer</i>. Se o WBC adicionou números nessa área desde então, o aviso diz isso e <i>Refazer</i> passa a ser o botão principal.</p><p><b>Atualizar</b>: para um município, a BAN e o WME são relidos e o resultado é substituído. Para um departamento, o arquivo de endereços de cada município é verificado (uma requisição por município), depois o WME é relido, números incluídos (segmentos, cada número — os números não têm data no WME — e pontos residenciais); os municípios que mudaram são analisados de novo, os outros são mantidos.</p><p>Os municípios que mudaram levam uma etiqueta BAN ou WME e um contorno laranja no mapa até a nova análise.</p>',
            memoClearSure: 'Clique de novo para apagar tudo',
        },
        'pt-PT': {
            sbHint: 'Compara a base nacional de moradas (BAN) com os números de porta e os pontos residenciais (RPP) do WME, para um município ou um departamento inteiro.',
            sbOpen: 'Abrir a janela',
            sbHelp: 'Ajuda',
            hWhatT: 'O que é comparado',
            hWhatB: "<p>A <b>BAN</b> é a referência: cada morada que lista deveria existir no WME, como número num segmento (HN) ou como ponto residencial (RPP).</p><p><b>Fontes</b>, lidas em direto: a <b>Base Adresse Nationale</b> (adresse.data.gouv.fr, Estado francês; Licence Ouverte Etalab 2.0; é mostrada a data de revisão de cada município); os limites e listas de municípios do <b>geo.api.gouv.fr</b> (API Découpage administratif, dados do INSEE e do IGN, Licence Ouverte Etalab 2.0); a <b>API pública de comunicações da BAN</b> (signalement.adresse.data.gouv.fr) para o estado das comunicações; e o WME nos mesmos servidores do editor. A zona não precisa de estar visível nem carregada. Desde 12/11/2026, o Waze acredita a BAN para França (apresentação e criação assistida de números de porta, página Map Data Attribution); adicionar uma rua inteira continua a ser um gesto de L6; um número de cada vez está aberto a todos os níveis; tudo com quota.</p><p><b>O que sai do navegador</b>: para o geo.api.gouv.fr, no modo «Centro do mapa», o centro do mapa ARREDONDADO a 3 casas decimais (cerca de 100 m) e as suas pesquisas de município — sem identidade nem cookie; para a BAN e a API de comunicações, o código do município; no arranque, o GitHub (version-min.json, versão mínima: uma versão retirada não arranca) e o GreasyFork (nova versão) são apenas lidos. Para o data.geopf.fr (Géoplateforme do IGN), com a caixa WBC do menu Camadas assinalada: a extensão da vista, a partir do zoom 18, sem cookie. Mais nada; o seu nome de utilizador não vai para nenhum terceiro (só para o Discuss do Waze, para o botão Copiar).</p><p><b>Comunicar à BAN</b>: abre a ferramenta oficial (signalement.adresse.data.gouv.fr) num novo separador, na rua ou no número; o WBC não envia nada, é o próprio que preenche e envia o formulário. Para um número do WME ausente da BAN, o comentário pré-preenchido leva a morada lida no Waze («Adresse présente dans Waze: …»): reveja, altere ou apague antes de enviar.</p><p><b>BAN da vista</b>: com a caixa WBC do menu Camadas assinalada e nenhuma análise mostrada nesse sítio, as moradas BAN da vista aparecem a partir do zoom 18, a cinzento (só leitura); rodeadas de verde quando o WME já tem o mesmo número na mesma rua ou a menos de 30 m (números guardados, pontos residenciais). <b>Ctrl+clique</b> (Cmd+clique no Mac) no botão do mapa: o município ao centro é analisado, ou o seu varrimento recente reaberto, e mostrado no mapa sem abrir a janela. Enquanto a janela do WBC está aberta, as camadas do WME «Números de porta» e «Residencial» ficam visíveis; ao fechá-la, voltam ao estado anterior.</p>",
            hMatchT: 'Quando um número é encontrado',
            hMatchB: '<p>Uma morada da BAN é encontrada quando o WME tem o mesmo número (sufixos incluídos: <i>bis</i>, <i>ter</i>, letras) a menos de 150 m, e:</p><table class="wbc-help-table"><tr><td>1</td><td>numa rua com o mesmo nome (principal ou alternativo), ou que só difere por um artigo («Avenue Sembrancher» = «Avenue de Sembrancher»; a diferença de nome continua assinalada);</td></tr><tr><td>2</td><td>ou num segmento que tem as moradas dessa rua, <b>com ou sem nome</b>;</td></tr><tr><td>3</td><td>ou a menos de 30 m da morada.</td></tr></table><p>A regra 1 é tentada primeiro em todo o lado, depois a 2, depois a 3. Um número do WME só serve uma vez.</p>',
            hNamesT: 'A coluna «Rua WME»',
            hNamesB: '<table class="wbc-help-table"><tr><td>&#x2713;</td><td>os segmentos perto das moradas têm o nome da BAN.</td></tr><tr><td><i>nome</i></td><td>têm outro nome: o nome a verificar.</td></tr><tr><td><i>sem nome</i></td><td>não têm nome.</td></tr><tr><td><i>nenhum segmento</i></td><td>nenhum segmento a menos de 80 m das moradas.</td></tr><tr><td>&#x2713; alt</td><td>o nome da BAN está como nome <b>alternativo</b>; o nome principal aparece ao lado.</td></tr><tr><td>n.º de estrada</td><td>o nome principal é um número de estrada e o nome da BAN falta nos alternativos: acrescentar.</td></tr><tr><td>tipo</td><td>só o tipo de via difere (Rue / Chemin…).</td></tr><tr><td>artigo · grafia · parcial</td><td>nomes parecidos: um artigo, uma ou duas letras, ou uma forma abreviada. <i>ausente do WME</i>: a rua não existe no WME, o nome mostrado é o da vizinha.</td></tr><tr><td>&#x2713; parque</td><td>nenhum segmento com nome, mas um local Parque de estacionamento próximo tem o nome da BAN: nada a renomear.</td></tr><tr><td>&#x2713; grafia BAN</td><td>mesmo nome a menos de um hífen ou ponto («Rue Paul-Louis Courier» / «Rue Paul Louis Courier»): nada a mudar de nome.</td></tr></table><p>Um número em falta a laranja com <b>≠</b> existe no WME com outro sufixo (12 b / 12bis): verificar. Se o WME só tem o número sem sufixo (32 / 32 B), é colocado na mesma e o aviso mantém-se.</p><p>&#x26A0; assinala um nome da BAN que nenhum segmento do município tem.</p>',
            hLimitsT: 'Bom saber',
            hLimitsB: "<p>Um departamento inteiro demora alguns minutos: a BAN é lida município a município, o WME em quadrados de cerca de 5 km. O botão Parar interrompe; o que está feito continua visível e os municípios com erro podem ser repetidos sozinhos.</p><p>Paris, Marselha e Lyon são lidas distrito a distrito. Os varrimentos ficam apenas neste navegador (IndexedDB), nunca noutro lado, com as suas preferências (zona, interruptores, posição da janela, cores dos pontos); são assinalados quando a BAN ou o WME mudaram desde então.</p>",
            hSafeB: "O script só altera o mapa a pedido de um editor: o «+» de uma morada (um número ou um RPP, todos os níveis); e, para um L6, «Adicionar os números» (rua a rua: números, e RPP no fim de um acesso), «⇄» (um RPP substituído por um número) e «Transformar este número em RPP» — no máximo 500 por hora móvel, por editor; nunca guarda. Os resultados ficam neste navegador.",
            remTitle: "Continua responsável pelas suas edições",
            remBody: "<p>O WME BAN Coverage <b>propõe</b>: nunca guarda nada sozinho.</p><p>Cada número, RPP ou conversão «⇄» chega ao WME como uma edição pendente. Verifique-a no mapa e depois guarde-a ou anule-a no WME.</p><p>O que guarda é a sua edição, como se a tivesse feito à mão.</p>",
            remNote: "Este lembrete aparece uma vez por navegador; pode voltar a vê-lo no separador do script.",
            remOk: "Compreendi",
            remCancel: "Cancelar",
            remLink: "Rever o lembrete de responsabilidade",
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
            renomRelance: n => n + (n > 1 ? ' ruas renomeadas no WME desde a análise: os números do município estão atualizados.' : ' rua renomeada no WME desde a análise: os números do município estão atualizados.'),
            renomNeuf: n => 'Segmento criado no WME perto de ' + n + (n > 1 ? ' ruas que não tinham nenhum: os números do município estão atualizados.' : ' rua que não tinha nenhum: os números do município estão atualizados.'),
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
            filterClear: 'Limpar o filtro',
            filterCount: (n, m) => n + (un1(n) ? ' rua de ' : ' ruas de ') + m,
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
            sbRppNum: "Número dos RPP",
            sbRppNumHint: "Escreve o número sob o triângulo de cada lugar residencial (RPP) carregado no WME, a partir do zoom 17: já não é preciso clicar para saber qual é. Só apresentação.",
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
            smallTip: "Janela pequena (tamanho original)",
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
            tipMemoOpen: "Abrir a janela neste varrimento e enquadrar o mapa nele.",
            tipMemoClear: "Apagar todos os varrimentos guardados neste navegador (dois cliques).",
            tipSbOpen: "Abrir a janela do WBC (como o botão à direita do mapa).",
            tipColorsReset: "Repor as cores predefinidas dos pontos.",
            tipHelpHdr: "Expandir ou recolher esta parte da ajuda.",
            tipFab: "Abrir ou fechar a janela",
            dirZoom: n => 'Moradas BAN: aproxime ao nível ' + n + ' ou mais',
            dirLoading: 'Moradas BAN: a ler…',
            dirNone: 'Moradas BAN: nenhuma na vista',
            dirCount: n => n + (un1(n) ? ' morada BAN na vista' : ' moradas BAN na vista'),
            dirCap: (n, m) => n + ' moradas BAN mostradas de ' + m + ': aproxime para ver todas',
            dirErr: m => 'Moradas BAN: leitura impossível — ' + m,
            dirEdition: d => 'edição de ' + d,
            dirSource: 'Fonte: Base Adresse Nationale (adresse.data.gouv.fr), difundida pela Géoplateforme do IGN — Licence Ouverte Etalab 2.0. Só leitura: nada é escrito; desmarque WBC no menu Camadas para as ocultar.',
            dirFiche: 'BAN, vista sem análise',
            dirWme: p => p + ' já no WME',
            dirFicheWme: 'Já no WME (mesmo número, mesma rua ou a menos de 30 m)',
            dirFicheAbs: 'Não está entre os números carregados no WME',
            tipFabCtrl: mac => (mac ? 'Cmd' : 'Ctrl') + '+clique: mostrar a BAN do município ao centro',
            fabBusy: 'A analisar o município ao centro…',
            fabErr: m => 'Falhou: ' + m,
            fabDeja: 'Já há uma análise em curso.',
            tipVoie: "Expandir a via (os seus números, os em falta a vermelho) e enquadrar o mapa nela.",
            tipCommune: "Abrir o detalhe deste município e enquadrar o mapa nele.",
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
            dejaRelaunchTip: "Volta a correr toda a análise.",
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
            ponctTag: "grafia BAN",
            tipOrtho: "A grafia difere numa ou duas letras",
            tipPonct: "A BAN não escreve este nome corretamente (hífen, ponto…): o nome do WME é mantido e os números são adicionados mesmo assim",
            partielTag: "parcial",
            tipPartiel: "Um nome é a forma abreviada do outro",
            absentTag: "ausente do WME",
            altTag: "alt",
            parkTag: "parque",
            tipPark: "Nenhum segmento com nome: o nome da BAN está no local Parque de estacionamento próximo (as vias de parque ficam sem nome).",
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
            kFar: n => 'das quais ' + n + ' longe do ponto BAN',
            kArret: n => n + ' ponto(s) de chegada distante(s)',
            hovArret: d => 'Ponto de chegada ' + d + ' m a mais',
            arrT: (n, s) => 'Pontos de chegada distantes (' + n + ', além de ' + s + ' m)',
            arrTip: d => 'O ponto de chegada está ' + d + ' m para além da rua junto ao número do WME: verifique no WME',
            sbArret: 'Assinalar ponto de chegada distante a partir de',
            sbArretHint: 'Distância entre o número do WME e o local para onde o Waze guia, menos a distância dele à sua rua. Aplicado de imediato, sem nova análise.',
            tipFar: d => 'Colocado a ' + d + ' m da morada BAN',
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
            banVoie: 'Comunicar à BAN',
            banVoieTip: 'Abre a ferramenta oficial de comunicação da BAN nesta rua, para pedir a alteração do nome. Nada é enviado antes de submeter o formulário.',
            banNumTip: n => 'Comunicar o número ' + n + ' à BAN: a ferramenta oficial abre nesta morada (alteração ou eliminação). Nada é enviado antes de submeter o formulário.',
            banNoKey: 'Sem identificador BAN aqui: o mapa da BAN abre no sítio certo. Clique num número, depois no nome da rua se for a rua o problema, e em «Signaler un problème».',
            banOff: m => 'Este município não aceita comunicações online' + (m ? ': ' + m : '.') + ' A página oficial abre na mesma, com o contacto da câmara municipal: o resto faz-se por e-mail.',
            banMap: 'Ver no mapa da BAN',
            banMairie: 'Contactar a câmara municipal',
            banAmbig: 'Atenção: neste novo município a mesma chave BAN existe em vários municípios delegados; verifique a morada apresentada antes de comunicar.',
            banTropTip: n => 'Comunicar à BAN que falta o ' + n + ': a ferramenta oficial abre na sua posição (alerta «morada em falta»). Nada é enviado antes de submeter o formulário.',
            sigT: (n, a) => 'Comunicações à BAN (' + n + (a ? ', ' + a + ' pendentes' : '') + ')',
            sigTip: 'Todas as comunicações enviadas à BAN para este município (por qualquer pessoa), com o resultado. Um clique centra o mapa.',
            sigVoieT: n => 'Comunicações à BAN nesta rua (' + n + ')',
            sigSt: s => ({ PENDING: 'pendente', PROCESSED: 'tratada', IGNORED: 'recusada', EXPIRED: 'expirada' })[s] || s,
            sigDem: (k, v) => ({ nom: 'nome → ' + v, num: 'número → ' + v, voie: 'rua → ' + v, del: 'eliminação', create: 'criação', missing: 'morada em falta', autre: 'posição ou parcelas' })[k] || k,
            sigMotif: m => 'motivo: ' + m,
            sigDeja: (d, st) => 'Já comunicado em ' + d + ' (' + st + ').',
            snbT: (v, a) => 'Ruas sem nome na BAN (' + v + ' ruas, ' + a + ' moradas)',
            snbTip: 'O município publicou estas moradas com um nome provisório («Non renseigné»…): nada a colocar no WME enquanto não der nome à rua. Uma linha por rua da BAN, fora da taxa de cobertura. Comunique, ou trate com a câmara municipal.',
            snbPres: n => 'perto de «' + n + '» no WME',
            snbNone: 'nenhuma rua com nome no WME por perto',
            dejaOld: 'Análise feita por uma versão anterior do WBC, com resultados diferentes: volte a executar.',
            ajHnAdd: n => 'Adicionar os números (' + n + ')',
            nextStreet: n => 'Rua seguinte (' + n + ' a adicionar)',
            tipNextStreet: 'Abre a rua do município onde «Adicionar» tem mais números a colocar (nome da BAN como principal ou alternativo), saltando as ruas já abertas por este botão.',
            nextStreetNone: 'Nenhuma outra rua pronta: as restantes já têm os números, ou precisam primeiro de correção do nome.',
            ajHnAddTip: r => 'Apenas L6: coloca no WME os números em falta nesta rua, nos segmentos cujo nome principal é o da BAN (acentos, maiúsculas, hífenes e pontos tolerados) e cuja cidade é o município ou «Village (Commune)»; uma morada no fim de um acesso passa a RPP. No máximo 500 edições por hora móvel, contadas ao guardar (restam ' + r + '). Nada é guardado: verifique e depois guarde no WME. As moradas fora da localidade também passam a RPP.',
            ajHnNoName: 'O nome WME desta rua não é o da BAN: a adição automática exige um nome principal idêntico ao da BAN.',
            ajHnNone: 'Nenhum número pode ser adicionado automaticamente nesta rua.',
            ajHnLoin: n => 'Nenhum número a adicionar automaticamente: ' + n + ' endereço(s) a mais de 80 m da rua desenhada no WME. Aproxime o segmento se estiver mal colocado.',
            ajHnNomEcart: (w, b) => 'Nenhum número a adicionar automaticamente: no WME, os segmentos desta rua chamam-se «' + w + '», e não «' + b + '» como na BAN. Dê-lhes o nome da BAN.',
            ajHnQuota: h => 'Quota atingida (500 números por hora): próxima adição possível às ' + h + '.',
            ajHnRunning: 'A adicionar os números…',
            bgTab: 'Separador em segundo plano: o Chrome abranda o trabalho em curso (até 3 vezes mais longo). Mantenha este separador em primeiro plano.',
            bgTabTip: 'O Chrome limita os temporizadores de um separador oculto (um por segundo, depois um por minuto após 5 minutos) e baixa a sua prioridade. Medido a 29/09/2026: um departamento em 41 min em segundo plano contra 13 min em primeiro plano.',
            ajHnDone: (n, r) => n + (un1(n) ? ' número colocado' : ' números colocados') + ' — verifique e depois guarde no WME. Quota restante: ' + r + '.',
            ajHnDoneMix: (n, r, q) => n + (un1(n) ? ' número' : ' números') + ' e ' + r + ' RPP colocados — verifique e depois guarde no WME. Quota restante: ' + q + '.',
            ajHnDoneRpp: (r, q) => r + (un1(r) ? ' RPP colocado' : ' RPP colocados') + ' — verifique e depois guarde no WME. Quota restante: ' + q + '.',
            ajRppCrit: l => '⚠️ A corrigir à mão: ' + l + '.',
            ajRppCritPoi: n => 'RPP ' + n + ' ficou sem morada',
            ajHnStopTip: 'Parar a adição em curso após a colocação atual; o que foi colocado fica, para rever.',
            ajHnStopping: 'Paragem pedida…',
            ajHnStopped: 'Parado a seu pedido.',
            ajHnFail: n => n + (un1(n) ? ' colocação falhou' : ' colocações falharam') + ' (detalhes na consola).',
            rhnUnsaved: 'Guarde (ou anule) primeiro as alterações pendentes: o WME já não deixa os scripts lerem o que não está guardado, e «⇄» não deve duplicar um número nem recuperar um objeto eliminado.',
            rhnLock: n => 'Este RPP está bloqueado no nível ' + n + ', acima do seu nível: a conversão passará a sugestão ao guardar.',
            rhnLockInfo: n => 'O RPP retirado estava bloqueado no nível ' + n + '.',
            rhnSegLock: n => (n ? 'O segmento está bloqueado no nível ' + n + ', acima do seu nível' : 'O WME não o deixa editar diretamente os números deste segmento') + ': a conversão passará a sugestão ao guardar.',
            suggAttente: 'O WME não manteve esta edição como sugestão: guarde (ou anule) primeiro as edições diretas pendentes — o WME nunca guarda sugestões e edições diretas juntas.',
            suggMixte: 'Nada é convertido: um dos dois objetos passaria a sugestão e o outro a edição direta, e o WME não os guarda juntos. Peça a um editor de nível suficiente.',
            rhnCritRpp: n => 'RPP ' + n + ' retirado sem número colocado: anule (Ctrl+Z) no WME',
            ajHnSansAlt: (r, c) => 'Alguns segmentos fora da localidade têm «' + r + '» sem cidade, mas não o alternativo «' + r + ' / ' + c + '»: o «+» coloca mesmo assim um RPP, mas o alternativo deve ainda ser adicionado.',
            ajHnSansAltRoute: (r, c) => 'Alguns segmentos fora da localidade têm um número de estrada como nome principal, sem localidade, mas não o alternativo «' + r + ' / ' + c + '»: o «+» coloca mesmo assim um RPP, mas o alternativo deve ainda ser adicionado.',
            rhnT: n => 'RPP desta rua (' + n + ')',
            rhnTip: 'Mostrar o RPP no mapa. Ao passar o rato, «⇄» substitui-o por um número do segmento quando o caso é claro.',
            rhnConv: 'Substituir este RPP por um número',
            rhnConvTip: 'Em localidade, substitui este RPP por um número no segmento — só em casos claros (mesmo número já na rua, ou ponto de acesso / posição ao longo da própria rua, como o WME Naming Auditor). Recusado se o RPP tiver nome ou fotografia. Conta na quota; nada é guardado.',
            rhnDone: (n, q) => 'RPP n.º ' + n + ' substituído por um número no segmento — verifique e depois guarde no WME. Quota restante: ' + q + '.',
            rhnDoneDbl: (n, q) => 'O n.º ' + n + ' já estava na rua: o RPP duplicado é retirado — verifique e depois guarde no WME. Quota restante: ' + q + '.',
            rhnNotFound: 'RPP não encontrado no WME neste local (movido, alterado ou apagado desde a análise?): volte a analisar.',
            rhnNoPlaces: 'Nenhum local carregado no WME: a camada «Locais» está provavelmente oculta. Mostre-a e tente de novo.',
            rhnNamed: 'Este RPP tem nome: não é convertido (verificar à mão).',
            rhnPhoto: 'Este RPP tem fotografia: não é convertido (alguém esteve no local; verificar à mão).',
            rhnCity: v => 'Este RPP pertence a «' + v + '», não ao município: não é convertido.',
            rhnStreet: r => 'Este RPP tem a rua «' + r + '», não o nome BAN da rua: não é convertido.',
            rhnNoSeg: 'Nenhum segmento da rua (nome BAN como principal, município como localidade) a menos de 80 m: o RPP está provavelmente fora da localidade, fica.',
            rhnLegit: v => 'O ponto de acesso do RPP dá para «' + v + '», não para a sua rua: o RPP exprime um desvio que um número de segmento não consegue, fica.',
            rhnUnsure: 'Nada claro (outra rua igualmente perto, ou demasiado longe de qualquer rua): o RPP fica, verificar à mão.',
            rhnFormat: n => 'O número «' + n + '» não se escreve como um número de segmento: verificar à mão.',
            rhnErr: m => 'Substituição interrompida: ' + m,
            rhnPoseTip: 'Substituído por um número (ainda não guardado).',
            rhnVersRpp: 'Transformar este número em RPP',
            rhnVersRppTip: 'Retira este número do segmento e cria no seu lugar um RPP (mesmo número, mesma rua), com o ponto de entrada no segmento sem nome mais próximo ou num acesso (caminho privado, via de estacionamento); depois o RPP fica selecionado para ajustar a entrada. Conta na quota; nada é guardado.',
            rhnVersRppDone: (n, q) => 'N.º ' + n + ' transformado em RPP — ajuste o ponto de entrada se necessário (está selecionado) e depois guarde no WME. Quota restante: ' + q + '.',
            rhnVersRppAbsent: n => 'O número ' + n + ' não foi encontrado no WME (segmento não carregado, ou número já retirado): nada mudou.',
            rhnVersRppTipPose: 'Transformado em RPP (ainda não guardado).',
            ajHnSkip: n => n + (un1(n) ? ' endereço ignorado' : ' endereços ignorados') + ' (detalhes na consola).',
            ajHnCut: (n, h) => n + (un1(n) ? ' morada não colocada' : ' moradas não colocadas') + ': quota atingida, retoma possível às ' + h + '.',
            ajHnNoSeg: 'Nenhum segmento carregado tem exatamente este nome como nome principal com o município como cidade: nada foi colocado.',
            ajHnErr: m => 'Adição interrompida: ' + m,
            ajHnRights: '«Adicionar os números» de uma rua inteira está reservado aos editores L6; o «+» de um só número e as conversões «⇄» estão abertos a todos os níveis.',
            ajHnSee: n => (un1(n) ? 'Aparece rodeado' : 'Aparecem rodeados') + ' a turquesa no mapa.',
            ajHnPoseTip: 'Colocado pelo WBC, ainda não guardado: clique para centrar o mapa nele.',
            ajHnSaved: (c, r, q) => 'Gravação: ' + c + (un1(c) ? ' número contado' : ' números contados') + ', ' + r + ' devolvidos à quota (retirados antes de guardar). Quota restante: ' + q + '.',
            ajHnSavedTip: 'Colocado pelo WBC e guardado.',
            hHnT: 'Adicionar os números',
            hHnB: '<p><i>Adicionar os números</i> de uma rua inteira: só editores <b>L6</b>. <b>Um número de cada vez</b> e as conversões <b>⇄</b> (número → RPP, RPP → número) estão abertos a <b>todos os níveis</b>, com as mesmas verificações e a mesma quota; sem direito sobre o segmento ou o RPP (bloqueio acima do seu nível), o WME faz disso uma sugestão ao guardar — se não houver edições diretas pendentes, e numa conversão só se os dois objetos estiverem no mesmo caso. Na linha aberta de uma rua, <i>Adicionar os números</i> coloca no WME os endereços em falta — <b>rua a rua</b>, nunca para o município inteiro. Para um só número: o «+» da sua etiqueta (ao passar o rato) ou um clique no seu ponto no mapa. Valem os direitos do WME: para um só número ou uma conversão, um segmento bloqueado acima do seu nível (ou fora das suas áreas de edição) dá uma sugestão ao guardar; <i>Adicionar os números</i> de uma rua inteira salta esses segmentos, e a mensagem di-lo.</p><p><b>Condições</b>: o nome principal dos segmentos é o da BAN (acentos, maiúsculas, apóstrofos, espaços, hífenes e pontos tolerados; uma grafia diferente é apenas assinalada) e a sua cidade é o município ou «Village (Commune)». Cada número vai para o segmento admitido mais próximo (80 m no máximo); um número já presente, mesmo pendente neste separador, nunca é colocado de novo; um sufixo diferente (12 b / 12bis) ou numérico fica para o editor, a não ser que o WME só tenha o número sem sufixo (32 para 32 B): é então colocado, com um aviso.</p><p><b>Nada é guardado</b>: os números colocados aparecem rodeados a turquesa no mapa (mesmo com a janela fechada) e marcados com ✚ na rua; verifique e depois guarde ou anule no WME.</p><p><b>Quota</b>: 500 números por hora móvel. Um número é reservado ao ser colocado e contado se estiver no servidor depois de guardar; retirado ou alterado antes, é devolvido. Números escritos à mão nunca contam. Depois de guardados, passam a «encontrados» sem voltar a analisar; uma análise guardada mais antiga avisa («volte a correr»). O selo &#x271A; no cabeçalho da janela mostra o que resta: laranja abaixo de 20 %, vermelho abaixo de 5 %.</p><p><b>RPP</b>: uma morada no fim de um acesso (caminho privado ou via de estacionamento a menos de 80 m, a sua rua a menos de 250 m) passa a ser um lugar residencial (RPP), incluindo pelo botão da rua. Uma morada fora da localidade (segmento cujo nome principal não tem cidade e que tem o nome BAN com o município como alternativo) passa a RPP, pelo botão da rua como pelo «+». O RPP é criado na posição BAN, com a sua morada e o seu ponto de entrada no segmento (ou acesso) mais próximo; uma morada recusada retira o lugar. O seu bloqueio é o que o WME atribui por omissão (nenhuma tabela de França fixa um para RPP). Os RPP contam na quota. Uma morada sem nenhum segmento com o nome BAN a menos de 80 m, mas perto de uma via transitável de outro nome, também se torna um RPP: morada «nome BAN / concelho», entrada por essa via.</p><p><b>Número → RPP</b>: no balão do ponto de um número (guardado, ou colocado pelo WBC e ainda não guardado), «⇄ Transformar este número em RPP» retira o número e cria no seu lugar um RPP (mesmo número, mesma rua), com o ponto de entrada no segmento sem nome ou acesso mais próximo (rotunda, caminho privado…); depois o RPP fica selecionado para ajustar a entrada. Um número colocado pelo WBC só muda de tipo na quota; um número guardado conta 2.</p><p><b>RPP → número</b>: na rua aberta, os RPP da rua têm as suas etiquetas; ao passar o rato, «⇄» substitui UM RPP por um número no segmento, só em casos claros (como o WME Naming Auditor): mesmo número já na rua a menos de 150 m (o RPP é duplicado e é simplesmente retirado), ou ponto de acesso — na falta dele, posição — ao longo da própria rua sem outra rua a menos de 10 m. Um ponto de acesso para outra rua prova que o RPP é legítimo: fica. Recusado se o RPP tiver nome ou fotografia, outra localidade ou outra rua. Também com um clique no seu ponto no mapa. Mesma quota; nada é guardado. O bloqueio do RPP é lido: acima do seu nível, a substituição passa a sugestão ao guardar; caso contrário a mensagem indica-o. Nenhuma alteração pode estar à espera de ser guardada (o WME já não deixa os scripts lerem o que está pendente); uma substituição conta 2 na quota (RPP retirado, número colocado). Também selecionando o triângulo do RPP no WME (janela do WBC aberta).</p><p><b>Parar</b>: enquanto uma rua longa é preenchida (o mapa desloca-se de zona em zona), o botão Parar interrompe a passagem; o que foi colocado fica, para rever. Uma colocação falhada é contada na mensagem. <b>Limite</b>: um número escrito à mão e ainda não guardado não é visto como duplicado — guarde antes de adicionar na mesma rua. Dois separadores do WME abertos ao mesmo tempo não veem os números pendentes um do outro: coloque a partir de um só separador.</p>',
            ajHnQuotaTip: 'Hora móvel: um número conta durante uma hora a partir de quando é colocado. Só contam os números colocados por este botão e realmente guardados.',
            ajHnLeft: n => 'Quota: ' + n + (un1(n) ? ' restante' : ' restantes') + ' nesta hora',
            ajHnFull: h => 'Quota atingida — próxima adição às ' + h,
            ajHn1: 'Adicionar este número',
            ajHn1Tip: 'Coloca apenas este número no WME (todos os níveis), com as verificações de «Adicionar os números» (nome BAN, localidade, segmento a menos de 80 m, duplicado); conta na quota. Nada é guardado.',
            ajHn1Exists: n => 'O número ' + n + ' já está no WME nesta rua: nada foi colocado.',
            ajHn1Rights: 'O WME não o identificou como editor (nome e nível ilegíveis): recarregue o WME e tente novamente.',
            ajHn1Lock: (n, v) => 'O número ' + n + ' passará a sugestão ao guardar: ' + (v ? 'o segmento está bloqueado no nível ' + v + ', acima do seu nível' : 'o WME não o deixa editar diretamente os números do segmento') + '; um editor de nível suficiente vai aprová-la.',
            ajHn1Bloque: v => (v ? 'O segmento está bloqueado no nível ' + v + ', acima do seu nível' : 'O segmento está fora das suas áreas de edição') + ': este número passará a sugestão ao guardar, a aprovar por um editor de nível suficiente.',
            ajHnLockSkip: n => n + (un1(n) ? ' número não colocado' : ' números não colocados') + ': segmento que o WME não o deixa editar (bloqueio ou áreas de edição).',
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
            hTrackB: '<p><b>Mapa do departamento</b>: depois de um departamento, cada município é colorido pela cobertura (claro = pouca, escuro = muita). Ao passar o rato surgem os seus números; com o mapa afastado, um clique abre-o.</p><p><b>Número em falta</b>: com a rua aberta, uma linha pontilhada leva ao segmento que provavelmente o deveria levar; o seu identificador está no CSV.</p><p><b>Selecionar os segmentos</b> de uma rua a partir da sua linha: ficam selecionados no WME.</p><p><b>Avanço</b>: a exportação CSV serve também de registo. Mais tarde, <i>Comparar</i> relê-a e dá a alteração rua a rua (ou município a município). Nada é guardado noutro sítio.</p><p><b>Diferenças (CSV)</b>: as ruas a renomear, cada uma com uma ligação WME, para corrigir ou enviar aos responsáveis da área.</p><p><b>Ferramentas da rua</b>: na linha aberta de uma rua, ícones com contador — selecionar os segmentos, adicionar os números, rua seguinte, comunicar à BAN ou contactar a câmara municipal; o nome de cada um aparece ao passar o rato.</p><p><b>Limite do município</b>: o ícone de polígono, ao lado das exportações, desenha no mapa o limite administrativo do município; a escolha é guardada.</p>',
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
            memoWmeProg: (i, n) => 'WME: a verificar ' + i + '/' + n,
            memoWmeOk: 'WME sem alterações',
            memoWmeMaj: d => 'WME editado' + (d ? ' (' + d + ')' : ''),
            memoWmeMajN: n => 'WME editado: ' + n,
            memoUpd: 'Atualizar',
            memoUpdTip: 'Volta a ler a BAN e o WME deste município e atualiza o resultado, de uma vez.',
            memoUpdDepTip: 'Verifica a BAN e o WME de cada município e volta a analisar os que mudaram.',
            contourBtn: 'Limite do município',
            contourTip: 'Mostra ou oculta no mapa o limite administrativo do município (geo.api.gouv.fr, já lido para a análise).',
            memoTagBan: 'BAN atualizada desde o varrimento',
            memoTagWme: 'WME editado desde o varrimento',
            secMemo: 'Varrimentos guardados',
            memoHint: 'Guardados só neste navegador. Reabrir um mostra-o de imediato e verifica se a BAN mudou desde então.',
            memoNone: 'Nenhum varrimento guardado ainda.',
            memoOpen: 'Abrir',
            memoDel: 'Apagar este varrimento',
            memoClear: 'Apagar tudo',
            memoErr: m => 'Não foi possível guardar o varrimento: ' + m,
            hMemoT: 'Varrimentos guardados e atualizações',
            hMemoB: '<p>Cada varrimento é guardado neste navegador (nada é enviado). Escolher de novo o mesmo município ou departamento, ou <i>Abrir</i> no separador Scripts, mostra-o de imediato com a sua data. <i>Analisar</i> também avisa: se a mesma área já foi analisada, a data aparece com <i>Abrir</i> e <i>Voltar a correr</i>. Se o WBC adicionou números nessa área desde então, o aviso indica-o e <i>Voltar a correr</i> passa a ser o botão principal.</p><p><b>Atualizar</b>: para um município, a BAN e o WME são lidos de novo e o resultado é substituído. Para um departamento, o ficheiro de moradas de cada município é verificado (um pedido por município), depois o WME é lido de novo, números incluídos (segmentos, cada número — os números não têm data no WME — e pontos residenciais); os municípios que mudaram são analisados de novo, os outros são mantidos.</p><p>Os municípios que mudaram têm uma etiqueta BAN ou WME e um contorno laranja no mapa até à nova análise.</p>',
            memoClearSure: 'Clique de novo para apagar tudo',
        },
        he: {
            sbHint: 'משווה את מאגר הכתובות הלאומי (BAN) למספרי הבתים ולנקודות המגורים (RPP) ב-WME, עבור רשות מקומית או מחוז שלם.',
            sbOpen: 'פתיחת החלון',
            sbHelp: 'עזרה',
            hWhatT: 'מה משווים',
            hWhatB: "<p>ה-<b>BAN</b> הוא המקור הקובע: כל כתובת שהוא מונה אמורה להופיע ב-WME, כמספר בית על מקטע (HN) או כנקודת מגורים (RPP).</p><p><b>מקורות</b>, נקראים בזמן אמת: <b>Base Adresse Nationale</b> (adresse.data.gouv.fr, מדינת צרפת; Licence Ouverte Etalab 2.0; תאריך העדכון של כל רשות מוצג); גבולות ורשימות הרשויות של <b>geo.api.gouv.fr</b> (API Découpage administratif, נתוני INSEE ו-IGN, Licence Ouverte Etalab 2.0); <b>ה-API הציבורי של דיווחי ה-BAN</b> (signalement.adresse.data.gouv.fr) למצב הדיווחים; ו-WME מאותם שרתים של העורך. אין צורך להציג או לטעון את האזור. מאז 12/11/2026 Waze מאשר את ה-BAN עבור צרפת (הצגה ויצירה בסיוע של מספרי בתים, דף Map Data Attribution); הוספת רחוב שלם נשארת פעולה של L6; מספר אחד בכל פעם פתוח לכל הדרגות; הכול במסגרת המכסה.</p><p><b>מה יוצא מהדפדפן</b>: אל geo.api.gouv.fr, במצב «מרכז המפה», מרכז המפה מעוגל ל-3 ספרות אחרי הנקודה (כ-100 מ') ואת חיפושי הרשויות — בלי זהות ובלי עוגייה; אל ה-BAN ואל API הדיווחים, קוד הרשות; בהפעלה, GitHub (version-min.json, הגרסה המינימלית: גרסה שהוסרה אינה עולה) ו-GreasyFork (גרסה חדשה) נקראים בלבד. אל data.geopf.fr (Géoplateforme של IGN), כשתיבת WBC בתפריט השכבות מסומנת: גבולות התצוגה, מזום 18, בלי עוגייה. שום דבר אחר; שם המשתמש שלך אינו נשלח לשום צד שלישי (רק ל-Discuss של Waze, עבור כפתור ההעתקה).</p><p><b>דיווח ל-BAN</b>: פותח את הכלי הרשמי (signalement.adresse.data.gouv.fr) בלשונית חדשה, על הרחוב או המספר; WBC אינו שולח דבר, אתה ממלא ושולח את הטופס. למספר ב-WME שחסר ב-BAN, ההערה הממולאת מראש כוללת את הכתובת שנקראה ב-Waze («Adresse présente dans Waze: …»): יש לבדוק, לשנות או למחוק אותה לפני השליחה.</p><p><b>BAN של התצוגה</b>: כשתיבת WBC בתפריט השכבות מסומנת ואין ניתוח מוצג במקום, כתובות ה-BAN של התצוגה מופיעות מזום 18, באפור (קריאה בלבד); מוקפות בירוק כאשר ב-WME כבר יש אותו מספר באותו רחוב או בטווח 30 מ׳ (מספרי בתים שמורים, נקודות מגורים). <b>Ctrl+לחיצה</b> (Cmd+לחיצה ב-Mac) על כפתור המפה: הרשות שבמרכז מנותחת, או שהסריקה האחרונה שלה נפתחת מחדש, ומוצגת במפה בלי לפתוח את החלון. כל עוד חלון WBC פתוח, שכבות WME «מספרי בתים» ו«מגורים» מוצגות; בסגירתו הן חוזרות למצבן הקודם.</p>",
            hMatchT: 'מתי מספר נמצא',
            hMatchB: '<p>כתובת BAN נמצאת כאשר ב-WME יש אותו מספר (כולל סיומות: <i>bis</i>, <i>ter</i>, אותיות) במרחק של פחות מ-150 מ\', ו:</p><table class="wbc-help-table"><tr><td>1</td><td>על רחוב באותו שם (שם ראשי או חלופי), או ששונה ממנו רק במילית יידוע (\u2066«Avenue Sembrancher» = «Avenue de Sembrancher»\u2069; הפער בשם עדיין מדווח);</td></tr><tr><td>2</td><td>או על מקטע שנושא את הכתובות של הרחוב הזה, <b>עם שם או בלי</b>;</td></tr><tr><td>3</td><td>או במרחק של פחות מ-30 מ\' מהכתובת.</td></tr></table><p>כלל 1 נבדק ראשון בכל מקום, אחריו 2, אחריו 3. מספר ב-WME משמש פעם אחת בלבד.</p>',
            hNamesT: 'העמודה «רחוב WME»',
            hNamesB: '<table class="wbc-help-table"><tr><td>&#x2713;</td><td>המקטעים הקרובים לכתובות נושאים את השם של ה-BAN.</td></tr><tr><td><i>שם</i></td><td>הם נושאים שם אחר: השם שיש לבדוק.</td></tr><tr><td><i>ללא שם</i></td><td>הם אינם נושאים שם.</td></tr><tr><td><i>אין מקטע</i></td><td>אין מקטע במרחק של פחות מ-80 מ\' מהכתובות.</td></tr><tr><td>&#x2713; חלופי</td><td>השם מה-BAN מופיע כשם <b>חלופי</b>; השם הראשי מוצג לצידו.</td></tr><tr><td>מס׳ כביש</td><td>השם הראשי הוא מספר כביש ושם ה-BAN חסר בשמות החלופיים: יש להוסיף.</td></tr><tr><td>סוג</td><td>רק סוג הרחוב שונה (Rue / Chemin…).</td></tr><tr><td>מילית · כתיב · חלקי</td><td>שמות דומים: מילית, אות או שתיים, או צורה מקוצרת. <i>חסר ב-WME</i>: הרחוב אינו קיים ב-WME, והשם המוצג הוא של הרחוב השכן.</td></tr><tr><td>&#x2713; חניון</td><td>אין מקטע עם שם, אבל מקום חניון סמוך נושא את שם ה-BAN: אין מה לשנות.</td></tr><tr><td>&#x2713; כתיב BAN</td><td>אותו שם פרט למקף או לנקודה («Rue Paul-Louis Courier» / «Rue Paul Louis Courier»): אין מה לשנות.</td></tr></table><p>מספר חסר בכתום עם <b>≠</b> קיים ב-WME עם סיומת אחרת (12 b / 12bis): יש לבדוק. אם ב-WME יש רק המספר בלי סיומת (32 / 32 B), הוא מוצב בכל זאת והאזהרה נשארת.</p><p>&#x26A0; מסמן שם ב-BAN שאף מקטע ברשות אינו נושא.</p>',
            hLimitsT: 'כדאי לדעת',
            hLimitsB: "<p>מחוז שלם לוקח כמה דקות: ה-BAN נקרא רשות אחר רשות, ו-WME בריבועים של כ-5 ק\"מ. הכפתור עצירה מפסיק את הפעולה; מה שכבר נעשה נשאר מוצג, ואפשר לנסות שוב רק את הרשויות שנכשלו.</p><p>פריז, מרסיי וליון נקראות רובע אחר רובע. הסריקות נשמרות בדפדפן זה בלבד (IndexedDB), אף פעם לא במקום אחר, יחד עם ההעדפות (תחום, מתגים, מיקום החלון, צבעי הנקודות); הן מסומנות כאשר ה-BAN או WME השתנו מאז.</p>",
            hSafeB: "הסקריפט משנה את המפה רק לבקשת עורך: «+» של כתובת אחת (מספר או RPP, כל הדרגות); ולעורך L6: «הוספת המספרים» (רחוב אחר רחוב: מספרים, ו-RPP בסוף דרך גישה), «⇄» (RPP אחד שמוחלף במספר) ו-«הפיכת המספר הזה ל־RPP» — לכל היותר 500 בשעה נעה, לכל עורך; הוא לעולם אינו שומר. התוצאות נשארות בדפדפן זה.",
            remTitle: "האחריות על העריכות נשארת שלכם",
            remBody: "<p><bdi>WME BAN Coverage</bdi> <b>מציע</b>: הוא לעולם אינו שומר דבר בעצמו.</p><p>כל מספר בית, <bdi>RPP</bdi> או המרה «⇄» מגיעים ל-WME כעריכה ממתינה. בדקו אותה על המפה, ואז שמרו אותה או בטלו אותה ב-WME.</p><p>מה שאתם שומרים הוא העריכה שלכם, כאילו עשיתם אותה ביד.</p>",
            remNote: "תזכורת זו מוצגת פעם אחת בכל דפדפן; אפשר לראות אותה שוב מלשונית הסקריפט.",
            remOk: "הבנתי",
            remCancel: "ביטול",
            remLink: "הצגה חוזרת של תזכורת האחריות",
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
            renomRelance: n => n + ' רחובות ששמם שונה ב-WME מאז הניתוח: נתוני היישוב עודכנו.',
            renomNeuf: n => 'מקטע חדש ב-WME ליד ' + n + ' רחובות שלא היה להם מקטע: נתוני היישוב עודכנו.',
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
            filterClear: 'ניקוי הסינון',
            filterCount: (n, m) => n + ' מתוך ' + m,
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
            sbRppNum: "מספרי RPP",
            sbRppNumHint: "כותב את מספר הבית מתחת למשולש של כל מקום מגורים (RPP) שנטען ב-WME, מזום 17: אין צורך ללחוץ כדי לדעת איזה הוא. תצוגה בלבד.",
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
            smallTip: "חלון קטן (גודל מקורי)",
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
            tipMemoOpen: "פתיחת החלון על סריקה זו והתאמת המפה אליה.",
            tipMemoClear: "מחיקת כל הסריקות השמורות בדפדפן זה (שתי לחיצות).",
            tipSbOpen: "פתיחת חלון WBC (כמו הכפתור מימין למפה).",
            tipColorsReset: "איפוס צבעי הנקודות לברירת המחדל.",
            tipHelpHdr: "פתיחה או סגירה של חלק זה בעזרה.",
            tipFab: "פתיחה או סגירה של החלון",
            dirZoom: n => 'כתובות BAN: יש להתקרב לרמה ' + n + ' ומעלה',
            dirLoading: 'כתובות BAN: קורא…',
            dirNone: 'כתובות BAN: אין בתצוגה',
            dirCount: n => n + (un1(n) ? ' כתובת BAN בתצוגה' : ' כתובות BAN בתצוגה'),
            dirCap: (n, m) => 'מוצגות ' + n + ' מתוך ' + m + ' כתובות BAN: יש להתקרב כדי לראות את כולן',
            dirErr: m => 'כתובות BAN: הקריאה נכשלה — ' + m,
            dirEdition: d => 'מהדורה מ-' + d,
            dirSource: 'מקור: Base Adresse Nationale (adresse.data.gouv.fr), מופץ על ידי Géoplateforme של IGN — Licence Ouverte Etalab 2.0. קריאה בלבד: דבר אינו נכתב; יש לבטל את סימון WBC בתפריט השכבות כדי להסתיר.',
            dirFiche: 'BAN, תצוגה ללא ניתוח',
            dirWme: p => p + ' כבר ב-WME',
            dirFicheWme: 'כבר ב-WME (אותו מספר, אותו רחוב או בטווח 30 מ׳)',
            dirFicheAbs: 'לא נמצא בין המספרים שנטענו ב-WME',
            tipFabCtrl: mac => (mac ? 'Cmd' : 'Ctrl') + '+לחיצה: הצגת ה-BAN של הרשות שבמרכז',
            fabBusy: 'מנתח את הרשות שבמרכז…',
            fabErr: m => 'נכשל: ' + m,
            fabDeja: 'ניתוח כבר מתבצע.',
            tipVoie: "פתיחת הרחוב (המספרים שלו, החסרים באדום) והתאמת המפה אליו.",
            tipCommune: "פתיחת פרטי הרשות והתאמת המפה אליה.",
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
            dejaRelaunchTip: "מריץ שוב את כל הניתוח.",
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
            ponctTag: "כתיב BAN",
            tipOrtho: "הכתיב שונה באות או שתיים",
            tipPonct: "ה-BAN לא כותב את השם הזה נכון (מקף, נקודה…): שם ה-WME נשמר והמספרים נוספים בכל זאת",
            partielTag: "חלקי",
            tipPartiel: "שם אחד הוא קיצור של האחר",
            absentTag: "חסר ב-WME",
            altTag: "חלופי",
            parkTag: "חניון",
            tipPark: "אין מקטע עם שם: שם ה-BAN מופיע על מקום החניון הסמוך (דרכי חניון נשארות ללא שם).",
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
            kFar: n => 'מהן ' + n + ' רחוקות מנקודת ה-BAN',
            kArret: n => n + ' נקודות הגעה רחוקות',
            hovArret: d => 'נקודת ההגעה רחוקה ב-' + d + ' מ׳ מדי',
            arrT: (n, s) => 'נקודות הגעה רחוקות (' + n + ', מעל ' + s + ' מ׳)',
            arrTip: d => 'נקודת ההגעה רחוקה ב-' + d + ' מ׳ יותר מהרחוב שליד המספר ב-WME: יש לבדוק ב-WME',
            sbArret: 'סימון נקודת הגעה רחוקה מעל',
            sbArretHint: 'המרחק בין המספר ב-WME למקום שאליו Waze מנחה, פחות המרחק שלו לרחוב. מוחל מיד, ללא ניתוח חדש.',
            tipFar: d => 'ממוקם במרחק ' + d + ' מ׳ מכתובת ה-BAN',
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
            banVoie: 'דיווח ל-BAN',
            banVoieTip: 'פותח את כלי הדיווח הרשמי של ה-BAN על רחוב זה, כדי לבקש שינוי שמו. דבר אינו נשלח לפני שליחת הטופס.',
            banNumTip: n => 'דיווח על מספר ' + n + ' ל-BAN: הכלי הרשמי נפתח על כתובת זו (שינוי או מחיקה). דבר אינו נשלח לפני שליחת הטופס.',
            banNoKey: 'אין כאן מזהה BAN: מפת ה-BAN נפתחת במקום הנכון. יש ללחוץ על מספר, ואז על שם הרחוב אם הרחוב שגוי, ועל "Signaler un problème".',
            banOff: m => 'רשות זו אינה מקבלת דיווחים מקוונים' + (m ? ': ' + m : '.') + ' הדף הרשמי נפתח בכל זאת, עם כתובת הקשר של העירייה: ההמשך נעשה בדוא"ל.',
            banMap: 'צפייה במפת ה-BAN',
            banMairie: 'פנייה לעירייה',
            banAmbig: 'שימו לב: ברשות חדשה זו אותו מפתח BAN קיים בכמה רשויות משנה; יש לבדוק את הכתובת המוצגת לפני הדיווח.',
            banTropTip: n => 'דיווח ל-BAN שמספר ' + n + ' חסר: הכלי הרשמי נפתח במיקומו (התראת "כתובת חסרה"). דבר אינו נשלח לפני שליחת הטופס.',
            sigT: (n, a) => 'דיווחים ל-BAN (' + n + (a ? ', מתוכם ' + a + ' ממתינים' : '') + ')',
            sigTip: 'כל הדיווחים שנשלחו ל-BAN עבור רשות זו (מכל אחד), עם תוצאתם. לחיצה ממרכזת את המפה.',
            sigVoieT: n => 'דיווחים ל-BAN על רחוב זה (' + n + ')',
            sigSt: s => ({ PENDING: 'ממתין', PROCESSED: 'טופל', IGNORED: 'נדחה', EXPIRED: 'פג תוקף' })[s] || s,
            sigDem: (k, v) => ({ nom: 'שם → ' + v, num: 'מספר → ' + v, voie: 'רחוב → ' + v, del: 'מחיקה', create: 'יצירה', missing: 'כתובת חסרה', autre: 'מיקום או חלקות' })[k] || k,
            sigMotif: m => 'סיבה: ' + m,
            sigDeja: (d, st) => 'כבר דווח ב-' + d + ' (' + st + ').',
            snbT: (v, a) => 'רחובות ללא שם ב-BAN (' + v + ' רחובות, ' + a + ' כתובות)',
            snbTip: 'הרשות פרסמה כתובות אלה תחת שם זמני ("Non renseigné"…): אין מה להציב ב-WME עד שתיתן שם לרחוב. שורה לכל רחוב BAN, מחוץ לשיעור הכיסוי. יש לדווח או לפנות לעירייה.',
            snbPres: n => 'ליד "' + n + '" ב-WME',
            snbNone: 'אין רחוב בעל שם ב-WME בקרבת מקום',
            dejaOld: 'סריקה שבוצעה בגרסה קודמת של WBC, שתוצאותיה שונות: יש להפעיל מחדש.',
            ajHnAdd: n => 'הוספת המספרים (' + n + ')',
            nextStreet: n => 'הרחוב הבא (' + n + ' להוספה)',
            tipNextStreet: 'פותח את הרחוב ברשות שבו ל«הוספה» יש הכי הרבה מספרים להציב (שם ה-BAN כשם ראשי או חלופי), ומדלג על רחובות שכבר נפתחו בכפתור זה.',
            nextStreetNone: 'אין עוד רחוב מוכן: לרחובות הנותרים כבר יש מספרים, או שיש לתקן קודם את שמם.',
            ajHnAddTip: r => 'L6 בלבד: מציב ב-WME את המספרים החסרים ברחוב זה, על המקטעים ששמם הראשי הוא שם ה-BAN (סובלנות לניקוד, לאותיות רישיות, למקפים ולנקודות) ושהעיר שלהם היא הרשות או «Village (Commune)»; כתובת בסוף דרך גישה הופכת ל-RPP. לכל היותר 500 עריכות בשעה נעה, נספרות בשמירה (נותרו ' + r + '). דבר אינו נשמר: בדקו ואז שמרו ב-WME. גם כתובות מחוץ לשטח בנוי הופכות ל-RPP.',
            ajHnNoName: 'שם הרחוב ב-WME אינו השם ב-BAN: הוספה אוטומטית דורשת שם ראשי זהה לשם ב-BAN.',
            ajHnNone: 'לא ניתן להוסיף אוטומטית אף מספר ברחוב זה.',
            ajHnLoin: n => 'לא ניתן להוסיף מספרים אוטומטית: ' + n + ' כתובות במרחק של יותר מ-80 מטר מהרחוב כפי שצויר ב-WME. קרבו את המקטע אם הוא ממוקם שלא כראוי.',
            ajHnNomEcart: (w, b) => 'לא ניתן להוסיף מספרים אוטומטית: ב-WME המקטעים של רחוב זה נקראים "' + w + '" ולא "' + b + '" כמו ב-BAN. תנו להם את השם של ה-BAN.',
            ajHnQuota: h => 'המכסה נוצלה (500 מספרים בשעה): ההוספה הבאה אפשרית בשעה ' + h + '.',
            ajHnRunning: 'מוסיף את המספרים…',
            bgTab: 'הלשונית ברקע: Chrome מאט את העבודה הנוכחית (עד פי 3). כדאי להשאיר את הלשונית הזו בחזית.',
            bgTabTip: 'Chrome מגביל את הטיימרים של לשונית מוסתרת (אחד בשנייה, ואחרי 5 דקות אחד בדקה) ומוריד את העדיפות שלה. נמדד ב־29/09/2026: מחוז שלם ב־41 דקות ברקע לעומת 13 דקות בחזית.',
            ajHnDone: (n, r) => (un1(n) ? 'מספר אחד הוצב' : n + ' מספרים הוצבו') + ' — יש לבדוק ואז לשמור ב-WME. יתרת המכסה: ' + r + '.',
            ajHnDoneMix: (n, r, q) => n + ' מספרים ו-' + r + ' RPP הוצבו — יש לבדוק ואז לשמור ב-WME. יתרת המכסה: ' + q + '.',
            ajHnDoneRpp: (r, q) => (un1(r) ? 'RPP אחד הוצב' : r + ' RPP הוצבו') + ' — יש לבדוק ואז לשמור ב-WME. יתרת המכסה: ' + q + '.',
            ajRppCrit: l => '⚠️ לתיקון ידני: ' + l + '.',
            ajRppCritPoi: n => 'RPP ' + n + ' נשאר ללא כתובת',
            ajHnStopTip: 'עצירת ההוספה אחרי ההצבה הנוכחית; מה שהוצב נשאר, לבדיקה.',
            ajHnStopping: 'התבקשה עצירה…',
            ajHnStopped: 'נעצר לבקשתך.',
            ajHnFail: n => n + (un1(n) ? ' הצבה נכשלה' : ' הצבות נכשלו') + ' (פרטים במסוף).',
            rhnUnsaved: 'יש לשמור (או לבטל) קודם את השינויים הממתינים: WME כבר אינו מאפשר לסקריפטים לקרוא את מה שלא נשמר, ו-«⇄» אסור שיכפיל מספר או יחזיר אובייקט שנמחק.',
            rhnLock: n => 'ה־RPP הזה נעול ברמה ' + n + ', מעל הדרגה שלך: ההמרה תהפוך להצעה בשמירה.',
            rhnLockInfo: n => 'ה-RPP שהוסר היה נעול ברמה ' + n + '.',
            rhnSegLock: n => (n ? 'המקטע נעול ברמה ' + n + ', מעל הדרגה שלך' : 'WME לא מאפשר לך לערוך ישירות את מספרי הבתים של מקטע זה') + ': ההמרה תהפוך להצעה בשמירה.',
            suggAttente: 'WME לא שמר את העריכה הזו כהצעה: שמור (או בטל) קודם את העריכות הישירות הממתינות — WME לעולם לא שומר הצעות ועריכות ישירות יחד.',
            suggMixte: 'לא הומר דבר: אחד משני האובייקטים היה הופך להצעה והשני לעריכה ישירה, ו־WME לא שומר אותם יחד. בקש מעורך בדרגה מספקת.',
            rhnCritRpp: n => 'RPP ' + n + ' הוסר בלי שהוצב מספר: יש לבטל (Ctrl+Z) ב-WME',
            ajHnSansAlt: (r, c) => 'חלק מהמקטעים מחוץ ליישוב נושאים את «' + r + '» ללא עיר אך ללא השם החלופי «' + r + ' / ' + c + '»: ה־+ מציב שם בכל זאת RPP, אך עדיין יש להוסיף את השם החלופי.',
            ajHnSansAltRoute: (r, c) => 'לחלק מהמקטעים מחוץ לשטח הבנוי יש מספר כביש כשם ראשי, ללא עיר, אך אין להם השם החלופי „' + r + ' / ' + c + '”: ה־+ מציב שם בכל זאת RPP, אך עדיין יש להוסיף את השם החלופי.',
            rhnT: n => 'RPP ברחוב הזה (' + n + ')',
            rhnTip: 'הצגת ה־RPP במפה. במעבר העכבר, „⇄” מחליף אותו במספר על המקטע כשהמקרה חד־משמעי.',
            rhnConv: 'החלפת ה־RPP הזה במספר',
            rhnConvTip: 'בשטח בנוי, מחליף את ה־RPP הזה במספר על המקטע — רק במקרים חד־משמעיים (אותו מספר כבר ברחוב, או נקודת גישה / מיקום לאורך הרחוב שלו, כמו WME Naming Auditor). נדחה אם ל־RPP יש שם או תמונה. נספר במכסה; דבר אינו נשמר.',
            rhnDone: (n, q) => 'RPP מס׳ ' + n + ' הוחלף במספר על המקטע — יש לבדוק ואז לשמור ב-WME. יתרת המכסה: ' + q + '.',
            rhnDoneDbl: (n, q) => 'מס׳ ' + n + ' כבר היה ברחוב: ה־RPP הכפול הוסר — יש לבדוק ואז לשמור ב-WME. יתרת המכסה: ' + q + '.',
            rhnNotFound: 'ה־RPP לא נמצא ב־WME במקום הזה (הוזז, שונה או נמחק מאז הניתוח?): יש להריץ שוב את הניתוח.',
            rhnNoPlaces: 'לא נטען אף מקום ב־WME: שכבת „מקומות” כנראה מוסתרת. יש להציג אותה ולנסות שוב.',
            rhnNamed: 'ל־RPP הזה יש שם: הוא לא מומר (לבדיקה ידנית).',
            rhnPhoto: 'ל־RPP הזה יש תמונה: הוא לא מומר (מישהו היה במקום; לבדיקה ידנית).',
            rhnCity: v => 'ה־RPP הזה שייך ל„' + v + '”, לא לרשות: הוא לא מומר.',
            rhnStreet: r => 'ה־RPP הזה נושא את הרחוב „' + r + '”, לא את שם ה־BAN של הרחוב: הוא לא מומר.',
            rhnNoSeg: 'אין מקטע של הרחוב (שם BAN כשם ראשי, הרשות כעיר) בטווח 80 מ׳: ה־RPP כנראה מחוץ לשטח הבנוי, הוא נשאר.',
            rhnLegit: v => 'נקודת הגישה של ה־RPP פונה אל „' + v + '”, לא אל הרחוב שלו: ה־RPP מבטא היסט שמספר על מקטע לא יכול לבטא, הוא נשאר.',
            rhnUnsure: 'אין שום דבר חד־משמעי (רחוב אחר קרוב באותה מידה, או רחוק מדי מכל רחוב): ה־RPP נשאר, לבדיקה ידנית.',
            rhnFormat: n => 'המספר „' + n + '” אינו כתוב כמו מספר על מקטע: לבדיקה ידנית.',
            rhnErr: m => 'ההחלפה הופסקה: ' + m,
            rhnPoseTip: 'הוחלף במספר (עדיין לא נשמר).',
            rhnVersRpp: 'הפיכת המספר הזה ל־RPP',
            rhnVersRppTip: 'מסיר את המספר הזה מהמקטע ויוצר במקומו RPP (אותו מספר, אותו רחוב), עם נקודת כניסה על המקטע הקרוב ביותר ללא שם או על דרך גישה (דרך פרטית, דרך חניון); לאחר מכן ה־RPP נבחר כדי לכוונן את הכניסה. נספר במכסה; דבר אינו נשמר.',
            rhnVersRppDone: (n, q) => 'מס׳ ' + n + ' הפך ל־RPP — יש לכוונן את נקודת הכניסה במידת הצורך (הוא נבחר) ואז לשמור ב-WME. יתרת המכסה: ' + q + '.',
            rhnVersRppAbsent: n => 'המספר ' + n + ' לא נמצא ב-WME (המקטע לא נטען, או שהמספר כבר הוסר): דבר לא שונה.',
            rhnVersRppTipPose: 'הפך ל־RPP (עדיין לא נשמר).',
            ajHnSkip: n => (un1(n) ? 'כתובת אחת דולגה' : n + ' כתובות דולגו') + ' (פרטים במסוף).',
            ajHnCut: (n, h) => n + (un1(n) ? ' כתובת לא הוצבה' : ' כתובות לא הוצבו') + ': המכסה נוצלה, ניתן להמשיך בשעה ' + h + '.',
            ajHnNoSeg: 'אף מקטע טעון אינו נושא בדיוק שם זה כשם ראשי עם הרשות כעיר: דבר לא הוצב.',
            ajHnErr: m => 'ההוספה הופסקה: ' + m,
            ajHnRights: '„הוספת המספרים” לרחוב שלם שמורה לעורכי L6; ה־„+” של מספר בודד והמרות «⇄» פתוחים לכל הדרגות.',
            ajHnSee: n => un1(n) ? 'הוא מוקף בטורקיז על המפה.' : 'הם מוקפים בטורקיז על המפה.',
            ajHnPoseTip: 'הוצב על ידי WBC, טרם נשמר: יש ללחוץ כדי למרכז את המפה עליו.',
            ajHnSaved: (c, r, q) => 'שמירה: ' + (un1(c) ? 'מספר אחד נספר' : c + ' מספרים נספרו') + ', ' + r + ' הוחזרו למכסה (הוסרו לפני השמירה). יתרת המכסה: ' + q + '.',
            ajHnSavedTip: 'הוצב על ידי WBC ונשמר.',
            hHnT: 'הוספת המספרים',
            hHnB: '<p><i>הוספת המספרים</i> לרחוב שלם: לעורכי <b>L6</b> בלבד. <b>מספר אחד בכל פעם</b> והמרות <b>⇄</b> (מספר → RPP, RPP → מספר) פתוחים <b>לכל הדרגות</b>, עם אותן בדיקות ואותה מכסה; ללא הרשאה על המקטע או על ה־RPP (נעילה מעל הדרגה שלך), WME הופך את העריכה להצעה בשמירה — אם אין עריכות ישירות ממתינות, ובהמרה רק אם שני האובייקטים באותו מצב. בשורה הפתוחה של רחוב, <i>הוספת המספרים</i> מציבה ב-WME את הכתובות החסרות שלו — <b>רחוב אחר רחוב</b>, לעולם לא לרשות שלמה. למספר בודד: ה־„+” שעל התווית שלו (במעבר העכבר), או לחיצה על הנקודה שלו במפה. הרשאות WME חלות: למספר בודד או להמרה, מקטע הנעול מעל הדרגה שלך (או מחוץ לאזורי העריכה שלך) הופך להצעה בשמירה; <i>הוספת המספרים</i> לרחוב שלם מדלג על מקטעים כאלה, וההודעה אומרת זאת.</p><p><b>תנאים</b>: השם הראשי של המקטעים הוא שם ה-BAN (סובלנות לניקוד, לאותיות רישיות, לגרשים, לרווחים, למקפים ולנקודות; כתיב שונה רק מסומן) והעיר שלהם היא הרשות או «Village (Commune)». כל מספר עובר למקטע המותר הקרוב ביותר (80 מ׳ לכל היותר); מספר שכבר קיים, גם אם ממתין בלשונית זו, לעולם לא מוצב שוב; סיומת שונה (12 b / 12bis) או מספרית נשארת לעורך, אלא אם ב-WME יש רק המספר בלי סיומת (32 עבור 32 B): אז הוא מוצב, עם אזהרה.</p><p><b>דבר אינו נשמר</b>: המספרים שהוצבו מוקפים בטורקיז על המפה (גם כשהחלון סגור) ומסומנים ✚ ברחוב; יש לבדוק אותם ואז לשמור או לבטל ב-WME.</p><p><b>מכסה</b>: 500 מספרים בשעה נעה. מספר נשמר במכסה בעת ההצבה, ונספר אם הוא נמצא בשרת אחרי השמירה; אם הוסר או שונה לפני כן, הוא מוחזר. מספרים שהוקלדו ידנית לעולם אינם נספרים. לאחר השמירה הם עוברים ל«נמצאו» בלי להריץ שוב את הניתוח; סריקה שמורה ישנה יותר מציינת זאת («הרצה מחדש»). התג &#x271A; בכותרת החלון מציג את מה שנותר: כתום מתחת ל-20%, אדום מתחת ל-5%.</p><p><b>RPP</b>: כתובת בסוף דרך גישה (דרך פרטית או דרך חניון במרחק של עד 80 מ׳, והרחוב שלה במרחק של עד 250 מ׳) הופכת למקום מגורים (RPP), גם דרך כפתור הרחוב. כתובת מחוץ לשטח בנוי (מקטע שלשמו הראשי אין עיר ושנושא את שם ה-BAN עם הרשות כשם חלופי) הופכת ל-RPP, דרך כפתור הרחוב כמו דרך «+». ה-RPP נוצר במיקום ה-BAN, עם הכתובת שלו ונקודת הכניסה שלו על המקטע (או דרך הגישה) הקרוב ביותר; כתובת שנדחתה מסירה את המקום. הנעילה שלו היא זו ש-WME נותן כברירת מחדל (אין טבלה לצרפת שקובעת נעילה ל-RPP). RPP נספרים במכסה. כתובת שאין לה מקטע עם שם ה־BAN בטווח 80 מ׳, אך היא קרובה לדרך נסיעה בשם אחר, הופכת גם היא ל־RPP: כתובת „שם BAN / רשות”, כניסה מאותה דרך.</p><p><b>מספר ← RPP</b>: בבועה של נקודת מספר (שמור, או שהוצב על ידי WBC ועדיין לא נשמר), «⇄ הפיכת המספר הזה ל־RPP» מסיר את המספר ויוצר במקומו RPP (אותו מספר, אותו רחוב), עם נקודת כניסה על המקטע ללא שם או דרך הגישה הקרובים ביותר (כיכר, דרך פרטית…); לאחר מכן ה-RPP נבחר כדי לכוונן את הכניסה. מספר שהוצב על ידי WBC רק משנה את סוגו במכסה; מספר שמור נספר כ-2.</p><p><b>RPP ← מספר</b>: ברחוב הפתוח, ל־RPP של הרחוב יש תוויות משלהם; במעבר העכבר, „⇄” מחליף RPP אחד במספר על המקטע, רק במקרים חד־משמעיים (כמו WME Naming Auditor): אותו מספר כבר ברחוב בטווח 150 מ׳ (ה־RPP כפול ופשוט מוסר), או נקודת גישה — ואם אין, המיקום — לאורך הרחוב שלו בלי רחוב אחר בטווח 10 מ׳. נקודת גישה הפונה לרחוב אחר מוכיחה שה־RPP לגיטימי: הוא נשאר. נדחה אם ל־RPP יש שם או תמונה, עיר אחרת או רחוב אחר. גם בלחיצה על הנקודה שלו במפה. אותה מכסה; דבר אינו נשמר. נעילת ה-RPP נקראת: מעל הדרגה שלך, ההחלפה הופכת להצעה בשמירה; אחרת ההודעה מציינת אותה. אסור ששינוי כלשהו ימתין לשמירה (WME כבר אינו מאפשר לסקריפטים לקרוא את מה שממתין); החלפה נספרת 2 במכסה (RPP הוסר, מספר הוצב). גם בבחירת המשולש של ה-RPP ב-WME (חלון WBC פתוח).</p><p><b>עצירה</b>: בזמן מילוי רחוב ארוך (המפה זזה מאזור לאזור), הכפתור עצירה מפסיק את המעבר; מה שהוצב נשאר, לבדיקה. הצבה שנכשלה נספרת בהודעה. <b>מגבלה</b>: מספר שהוקלד ידנית ועדיין לא נשמר אינו מזוהה ככפול — יש לשמור לפני הוספה באותו רחוב. שתי לשוניות WME פתוחות בו־זמנית אינן רואות זו את המספרים הממתינים של זו: הציבו מלשונית אחת בלבד.</p>',
            ajHnQuotaTip: 'שעה נעה: מספר נספר במשך שעה מרגע הצבתו. נספרים רק מספרים שהוצבו בכפתור זה ונשמרו בפועל.',
            ajHnLeft: n => 'מכסה: נותרו ' + n + ' בשעה זו',
            ajHnFull: h => 'המכסה נוצלה — ההוספה הבאה בשעה ' + h,
            ajHn1: 'הוספת המספר הזה',
            ajHn1Tip: 'מציב ב־WME רק את המספר הזה (כל הדרגות), עם הבדיקות של „הוספת המספרים” (שם BAN, עיר, מקטע בטווח 80 מ׳, כפילות); נספר במכסה. דבר אינו נשמר.',
            ajHn1Exists: n => 'המספר ' + n + ' כבר קיים ב־WME ברחוב הזה: לא הוצב דבר.',
            ajHn1Rights: 'WME לא זיהה אותך כעורך (שם ודרגה אינם קריאים): טען מחדש את WME ונסה שוב.',
            ajHn1Lock: (n, v) => 'מספר ' + n + ' יהפוך להצעה בשמירה: ' + (v ? 'המקטע שלו נעול ברמה ' + v + ', מעל הדרגה שלך' : 'WME לא מאפשר לך לערוך ישירות את מספרי הבתים של המקטע') + '; עורך בדרגה מספקת יאשר אותה.',
            ajHn1Bloque: v => (v ? 'המקטע שלו נעול ברמה ' + v + ', מעל הדרגה שלך' : 'המקטע שלו מחוץ לאזורי העריכה שלך') + ': המספר הזה יהפוך להצעה בשמירה, לאישור עורך בדרגה מספקת.',
            ajHnLockSkip: n => n + (un1(n) ? ' מספר לא הוצב' : ' מספרים לא הוצבו') + ': מקטע ש־WME אינו מאפשר לך לערוך (נעילה או אזורי עריכה).',
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
            hTrackB: '<p><b>מפת המחוז</b>: אחרי מחוז, כל רשות צבועה לפי הכיסוי (בהיר = מעט, כהה = הרבה). ריחוף מציג את המספרים; במפה מוקטנת, לחיצה פותחת אותה.</p><p><b>מספר חסר</b>: כשהרחוב פתוח, קו מנוקד מוביל למקטע שכנראה אמור לשאת אותו; המזהה שלו מופיע ב-CSV.</p><p><b>בחירת המקטעים</b> של רחוב מהשורה שלו: הם נבחרים ב-WME.</p><p><b>התקדמות</b>: ייצוא ה-CSV משמש גם כתיעוד. מאוחר יותר, <i>השוואה</i> קורא אותו שוב ומציג את השינוי רחוב אחר רחוב (או רשות אחר רשות). דבר אינו נשמר במקום אחר.</p><p><b>פערים (CSV)</b>: הרחובות לשינוי שם, כל אחד עם קישור WME, לתיקון או לשליחה לאחראי האזור.</p><p><b>כלי הרחוב</b>: בשורה הפתוחה של רחוב, סמלים עם מונה — בחירת המקטעים, הוספת המספרים, הרחוב הבא, דיווח ל-BAN או פנייה לעירייה; שם כל סמל מופיע במעבר העכבר.</p><p><b>גבול הרשות</b>: סמל המצולע, ליד הייצואים, משרטט במפה את הגבול המנהלי של הרשות; הבחירה נשמרת.</p>',
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
            memoWmeProg: (i, n) => 'WME: בבדיקה ' + i + '/' + n,
            memoWmeOk: 'WME ללא שינוי',
            memoWmeMaj: d => 'WME נערך' + (d ? ' (' + d + ')' : ''),
            memoWmeMajN: n => 'WME נערך: ' + n,
            memoUpd: 'עדכון',
            memoUpdTip: 'קורא מחדש את ה-BAN ואת WME עבור רשות זו ומעדכן את התוצאה, בפעולה אחת.',
            memoUpdDepTip: 'בודק את ה-BAN ואת WME של כל רשות, ואז סורק מחדש את אלה שהשתנו.',
            contourBtn: 'גבול הרשות',
            contourTip: 'מציג או מסתיר במפה את הגבול המנהלי של הרשות (geo.api.gouv.fr, שכבר נקרא לצורך הניתוח).',
            memoTagBan: 'BAN עודכן מאז הסריקה',
            memoTagWme: 'WME נערך מאז הסריקה',
            secMemo: 'סריקות שמורות',
            memoHint: 'נשמרות בדפדפן זה בלבד. פתיחה מחדש מציגה מיד ובודקת אם ה-BAN השתנה מאז.',
            memoNone: 'אין עדיין סריקה שמורה.',
            memoOpen: 'פתיחה',
            memoDel: 'מחיקת סריקה זו',
            memoClear: 'מחיקת הכול',
            memoErr: m => 'לא ניתן היה לשמור את הסריקה: ' + m,
            hMemoT: 'סריקות שמורות ועדכונים',
            hMemoB: '<p>כל סריקה נשמרת בדפדפן זה (דבר אינו נשלח). בחירה חוזרת של אותה רשות או אותו מחוז, או <i>פתיחה</i> בלשונית הסקריפטים, מציגה אותה מיד עם התאריך. גם <i>ניתוח</i> מזכיר זאת: אם אותו אזור כבר נסרק, התאריך שלו מוצג עם <i>פתיחה</i> ו<i>הרצה מחדש</i>. אם WBC הוסיף מספרים באזור זה מאז, ההודעה מציינת זאת ו<i>הרצה מחדש</i> הופך לכפתור הראשי.</p><p><b>עדכון</b>: עבור רשות, ה-BAN ו-WME נקראים מחדש והתוצאה מוחלפת. עבור מחוז, קובץ הכתובות של כל רשות נבדק (בקשה אחת לכל רשות), ואז WME נקרא מחדש, כולל מספרי בתים (מקטעים, כל מספר — למספרים אין תאריך ב-WME — ונקודות מגורים); רשויות שהשתנו נסרקות מחדש, והאחרות נשמרות.</p><p>רשויות שהשתנו מסומנות בתווית BAN או WME ובקו מתאר כתום במפה עד לסריקה החדשה.</p>',
            memoClearSure: 'לחיצה נוספת למחיקת הכול',
        },
    };

    // Seul « br » distingue le portugais brésilien ; d'anciens navigateurs rendent « iw » pour l'hébreu.
    const detectLang = () => {
        try {
            const l = (document.documentElement.lang || navigator.language || 'en').toLowerCase();
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
    // Nombres dans la langue du SCRIPT, pas du navigateur.
    const LOCALES = { en: 'en', fr: 'fr-FR', de: 'de-DE', es: 'es-ES', it: 'it-IT', 'pt-BR': 'pt-BR', 'pt-PT': 'pt-PT', he: 'he-IL' };
    let nf = null, pf = null;
    const nb = n => (nf || (nf = new Intl.NumberFormat(LOCALES[_lang] || 'en'))).format(n);
    const pct = (a, b) => (pf || (pf = new Intl.NumberFormat(LOCALES[_lang] || 'en', { style: 'percent', maximumFractionDigits: 1 }))).format(b ? a / b : 0);

    // ==WBC-CORE== — le calcul, sans toucher à la page : le banc l'extrait et le teste sous Node.
    const Core = (() => {
        // 2 < 2 bis < 2 ter < 3 < 10 : numérique d'abord, puis le suffixe.
        const ordreNum = (x, y) => String(x.brut).localeCompare(String(y.brut), 'fr', { numeric: true });
        // Globales des boucles chaudes liées une fois (lentes à travers le bac à sable du gestionnaire de scripts).
        const { Math, Map, Set, Number, String, Date, parseFloat, Infinity, Object, Error, isFinite } = globalThis;

        // La BAN sépare numéro et suffixe (quater/quinquies abrégés qua/qui), WME a un texte libre : les deux ramenés à « 12bis ».
        // Une lettre (« 12b ») reste distincte de « bis ».
        const SUFFIXES = { quater: 'qua', quinquies: 'qui' };
        function normNum(n, suffixe) {
            // Un suffixe CHIFFRÉ (« 5 » + « 3 ») ne se colle pas au numéro : « 5 3 » n'est pas « 53 ».
            const sf = String(suffixe || '').trim();
            if (/^\d/.test(sf)) return normNum(n) + '/' + sf.toLowerCase().replace(/\s+/g, '');
            const s =(String(n == null ? '' : n) + ' ' + (suffixe || '')).toLowerCase()
                .normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[\s\-_.\/]+/g, '');
            const m = /^0*(\d+)([a-z]*)$/.exec(s);
            if (!m) return s || null;
            return m[1] + (SUFFIXES[m[2]] || m[2]);
        }

        // Mêmes abréviations que Draw Borders France, appliquées aux deux côtés.
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

        // Nom principal = numéro de route : convention Waze, le nom d'usage BAN va en alternatif.
        const ROUTE_RE = /^\s*(?:[ADNMCR]|RD|RN|RM|CD|CR|VC|VO)\s?-?\s?\d+\s?[a-z]?(?:\s|$|[-–—(])/i;

        // Le nom sans type de voie ni articles (sur des noms déjà normés).
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

        // Distance d'édition entre deux cœurs de nom, bornée à `max`.
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
            const court = cb.length < cw.length ? cb : cw, long = court === cb ? cw : cb;
            if (court.length >= 6 && long.startsWith(court)) return 'nomPartiel';
            return 'different';
        }

        // Format BAL : colonnes lues par leur NOM, fichier en CRLF, lu ligne à ligne (le tableau complet coûterait ~20 fois sa taille).
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
            // UNE adresse = un @a de uid_adresse (plusieurs lignes = plusieurs positions). La cle_interop ne suffit pas (elle revient entre
            // communes déléguées) ; deux @a de même clé à moins de FUSION_M sont un doublon de la BAN. Sans uid_adresse, repli sur la clé.
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
                const idv = c.uid >= 0 ? (/@v:([^\s"]+)/.exec(r[c.uid] || '') || [])[1] : null;
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
                    // La vraie clé seulement (pas le repli voie|numéro) : elle sert au lien de signalement.
                    cle: c.cle >= 0 ? (r[c.cle] || '').trim() : '',
                    uidA: ida || '', uidV: idv || '',
                });
            }
            // Numéros de réserve 9990-9999 écartés seulement sans voisin 9000-9989 ni 10000-10999 sur la voie (numérotation métrique) ;
            // une série à rebours est gardée.
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

        // Géométrie : WGS84, distances locales en mètres.
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

        // Grille de cases de CASE_M m : segment converti en mètres une fois, rangé dans les cases que ses côtés TRAVERSENT (pas toute sa boîte).
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
        // Avec `nom`, seulement parmi les segments qui le portent.
        function plusProche(g, lon, lat, maxM, m, nom) {
            const [px, py] = m(lon, lat);
            const marque = ++g.passage;
            let best = null, bd = maxM;
            // Échantillons tous les CASE_M/2 : tout point d'un côté est à moins de CASE_M/4 de l'un d'eux, d'où la marge.
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

        // Un numéro BAN est « dans WME » si un numéro identique est à moins de RAYON_M et porte le même nom de voie (1), ou est sur
        // un segment rattaché à la voie (2), ou est à moins de PROCHE_M (3). Couples tranchés pour toute la commune, règle 1 d'abord.
        const SEG_MAX_M = 80;     // au-delà, une adresse BAN n'a « aucun segment proche »
        const RAYON_M = 150;      // un même numéro plus loin est une autre adresse
        const PROCHE_M = 30;
        // Adresse au bout d'une allée : pas de segment de sa voie à SEG_MAX_M, une allée à ALLEE_MAX_M, sa voie à RUE_RPP_M ⇒ RPP à la position BAN.
        const ALLEE_MAX_M = 80, RUE_RPP_M = 250;
        const MARGE_NOM = 0.003;  // ≈ 300 m : un segment du même nom au-delà est un homonyme
        // Point d'arrivée éloigné : EXCÈS = distance marqueur → arrivée moins distance marqueur → sa rue, par paliers de 10 m (30-200) ;
        // le seuil s'applique à l'affichage, sans relancer l'analyse.
        const PALIERS_ARRET = Array.from({ length: 18 }, (_, i) => 30 + 10 * i);
        const histoArret = () => PALIERS_ARRET.map(() => 0);
        const sommeHisto = hs => { const s = histoArret(); for (const h of hs) if (Array.isArray(h)) h.forEach((n, i) => { if (i < s.length) s[i] += n || 0; }); return s; };
        const arretsAuDela = (h, seuil) => { if (!Array.isArray(h)) return 0; const i = Math.max(0, Math.min(PALIERS_ARRET.length - 1, Math.round((Number(seuil) - PALIERS_ARRET[0]) / 10))); return h[i] || 0; };

        function analyser(d) {
            const chrono = {}, top0 = Date.now();
            let topPrec = top0;
            const top = nom => { const n = Date.now(); chrono[nom] = n - topPrec; topPrec = n; };
            const lat0 = d.adresses.length ? d.adresses[0].lat : 46;
            const m = versMetres(lat0);
            const dist = (a, b) => { const [ax, ay] = m(a.lon, a.lat), [bx, by] = m(b.lon, b.lat); return Math.hypot(ax - bx, ay - by); };
            // Distance au numéro WME : la plus courte de son marqueur et de son point d'arrêt (au bout d'une allée, le marqueur est loin).
            const distWme = (a, x) => {
                const d1 = dist(a, x);
                if (!x.arret) return d1;
                const [ax, ay] = m(a.lon, a.lat), [bx, by] = m(x.arret[0], x.arret[1]);
                return Math.min(d1, Math.hypot(ax - bx, ay - by));
            };

            const rues = new Map();
            for (const s of d.streets || []) rues.set(s.id, { nom: s.name || '', norm: normNom(s.name) });
            const parkingsParNom = new Map();
            for (const p of d.parkings || []) {
                const g = p.geometry, n = normNom(p.name);
                if (!n || !g) continue;
                const anneau = g.type === 'Polygon' ? g.coordinates && g.coordinates[0] : g.type === 'Point' ? [g.coordinates] : null;
                if (!anneau || !anneau.length) continue;
                if (!parkingsParNom.has(n)) parkingsParNom.set(n, []);
                parkingsParNom.get(n).push({ anneau, surface: g.type === 'Polygon' });
            }
            const procheDuLieu = (a, p) => {
                if (p.surface && p.anneau.length >= 3 && dansAnneau(a.lon, a.lat, p.anneau)) return true;
                const mm = versMetres(a.lat), [px, py] = mm(a.lon, a.lat);
                if (p.anneau.length === 1) { const [x, y] = mm(p.anneau[0][0], p.anneau[0][1]); return Math.hypot(px - x, py - y) <= SEG_MAX_M; }
                for (let k = 1; k < p.anneau.length; k++) {
                    const [ax, ay] = mm(p.anneau[k - 1][0], p.anneau[k - 1][1]), [bx, by] = mm(p.anneau[k][0], p.anneau[k][1]);
                    if (distSeg(px, py, ax, ay, bx, by) <= SEG_MAX_M) return true;
                }
                return false;
            };
            const segs = [];
            const parId = new Map();
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

            const wme = [];
            for (const h of d.hns || []) {
                const p = h.geometry && h.geometry.coordinates;
                if (!p || h.number == null || h.number === '') continue;
                const s = parId.get(h.segID);
                const fp = h.fractionPoint && h.fractionPoint.coordinates;
                wme.push({ type: 'HN', brut: String(h.number), num: normNum(h.number), lon: p[0], lat: p[1], arret: fp || null, seg: s || null, noms: s ? s.noms : new Set(), rue: s ? s.nom : '', id: h.id });
            }
            for (const v of d.rpps || []) {
                const geo = v.geometry;
                if (!geo || v.houseNumber == null || v.houseNumber === '') continue;
                let p = geo.coordinates;
                if (geo.type === 'Polygon') { const a = p[0]; p = [a.reduce((x, q) => x + q[0], 0) / a.length, a.reduce((x, q) => x + q[1], 0) / a.length]; }
                const r = rues.get(v.streetID);
                const pp = plusProche(g, p[0], p[1], SEG_MAX_M, m);
                const ees = (v.entryExitPoints || []).filter(e => e && e.point && e.point.coordinates);
                const ee = ees.find(e => e.primary) || ees[0];
                wme.push({ type: 'RPP', brut: String(v.houseNumber), num: normNum(v.houseNumber), lon: p[0], lat: p[1], arret: ee ? ee.point.coordinates : null, seg: pp ? pp.seg : null, noms: new Set(r && r.norm ? [r.norm] : []), rue: r ? r.nom : '', id: v.id });
            }
            // Index par numéro puis par case de RAYON_M (clé numérique) : une adresse ne compare qu'aux numéros égaux de son voisinage.
            const kx = 111320 * Math.cos(lat0 * Math.PI / 180);
            const ci = lon => Math.floor(lon * kx / RAYON_M), cj = lat => Math.floor(lat * 110540 / RAYON_M);
            const cleCase = (i, j) => (i + 1048576) * 2097152 + (j + 1048576);
            // Rangé dans la case de son marqueur ET de son point d'arrêt : l'un ou l'autre peut être le seul à portée.
            const ranger = (parCase, k, x) => { const l = parCase.get(k); if (l) l.push(x); else parCase.set(k, [x]); };
            const indexer = (cle, x, idx) => {
                let parCase = idx.get(cle);
                if (!parCase) idx.set(cle, parCase = new Map());
                const k = cleCase(ci(x.lon), cj(x.lat));
                ranger(parCase, k, x);
                if (x.arret) { const k2 = cleCase(ci(x.arret[0]), cj(x.arret[1])); if (k2 !== k) ranger(parCase, k2, x); }
            };
            let passage = 0;
            const autour = (idx, cle, lon, lat) => {
                const parCase = idx.get(cle);
                if (!parCase) return [];
                const i = ci(lon), j = cj(lat), res = [], n = ++passage;
                for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) { const l = parCase.get(cleCase(i + di, j + dj)); if (l) for (const x of l) if (x.passage !== n) { x.passage = n; res.push(x); } }
                return res;
            };
            const parNum = new Map();
            for (const w of wme) indexer(w.num, w, parNum);
            const autourDe = (num, lon, lat) => autour(parNum, num, lon, lat);

            top('numerosWme');
            let emp = d.emprise;
            if (!emp) {
                emp = [Infinity, Infinity, -Infinity, -Infinity];
                for (const a of d.adresses) { emp[0] = Math.min(emp[0], a.lon); emp[1] = Math.min(emp[1], a.lat); emp[2] = Math.max(emp[2], a.lon); emp[3] = Math.max(emp[3], a.lat); }
            }
            const dansEmprise = s => s.coords.some(([x, y]) => x >= emp[0] - MARGE_NOM && x <= emp[2] + MARGE_NOM && y >= emp[1] - MARGE_NOM && y <= emp[3] + MARGE_NOM);
            const nomsBan = new Set(d.adresses.map(a => normNom(a.voie)));
            // Clé « cœur + type » : l'ARTICLE ne distingue pas deux voies, le TYPE si.
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
                const remp = nomRemplacement(a.voie);
                const k = remp ? '\u2205' + (idVoieBan(a.cle) || a.uidV || '?') + '|' + a.deleguee : normNom(a.voie) + '|' + a.deleguee;
                if (!voies.has(k)) voies.set(k, { nom: a.voie, norm: normNom(a.voie), deleguee: a.deleguee, adresses: [], remplacement: remp });
                voies.get(k).adresses.push(a);
            }
            for (const v of voies.values()) {
                v.segs = new Set();
                const votes = new Map();
                let w = Infinity, so = Infinity, e = -Infinity, n = -Infinity;
                for (const a of v.adresses) {
                    w = Math.min(w, a.lon); e = Math.max(e, a.lon); so = Math.min(so, a.lat); n = Math.max(n, a.lat);
                    // Un segment qui porte le nom de la voie l'emporte sur un plus proche qui ne le porte pas.
                    const pn = v.norm ? plusProche(g, a.lon, a.lat, SEG_MAX_M, m, v.norm) : null;
                    const pp = pn || plusProche(g, a.lon, a.lat, SEG_MAX_M, m);
                    a.proche = pp;
                    if (!pp) continue;
                    v.segs.add(pp.seg);
                    const cle = pn ? v.norm : normNom(pp.seg.nom);
                    const vote = votes.get(cle) || { n: 0, nom: pn ? v.nom : pp.seg.nom, enAlt: 0, principaux: new Map() };
                    vote.n++;
                    // Écart de ponctuation seul : le nom WME vaut, avec un avertissement.
                    if (pn && pp.seg.principal === v.norm) {
                        vote.prin = (vote.prin || 0) + 1;
                        if (nomGraphie(pp.seg.nom) !== nomGraphie(v.nom)) { vote.ponct = (vote.ponct || 0) + 1; vote.brut = pp.seg.nom; }
                    }
                    // Nom BAN seulement en alternatif : on retient le principal qui le porte, pour le dire.
                    if (pn && pp.seg.principal !== v.norm) {
                        vote.enAlt++;
                        vote.principaux.set(pp.seg.nom, (vote.principaux.get(pp.seg.nom) || 0) + 1);
                    }
                    votes.set(cle, vote);
                }
                v.bbox = [w, so, e, n];
                // Les variantes d'article valent le nom BAN, sauf si elles sont elles-mêmes une voie BAN.
                v.variantes = new Set((parCoeur.get(cleArticle(v.norm)) || []).filter(nom => nom !== v.norm && !nomsBan.has(nom)));
                for (const nom of [v.norm, ...v.variantes]) for (const s of parNom.get(nom) || []) {
                    if (s.coords.some(([x, y]) => x >= w - MARGE_NOM && x <= e + MARGE_NOM && y >= so - MARGE_NOM && y <= n + MARGE_NOM)) v.segs.add(s);
                }
                const gagnant = [...votes.entries()].sort((x, y) => y[1].n - x[1].n)[0];
                v.nomWme = gagnant ? gagnant[1].nom : null;
                v.nomProche = ([...votes.values()].filter(x => x.nom).sort((x, y) => y.n - x.n)[0] || {}).nom || '';
                v.nomPrincipal = '';
                if (!gagnant) v.statutNom = 'aucun';
                else if (gagnant[0] === v.norm) {
                    const g1 = gagnant[1];
                    if (g1.enAlt * 2 > g1.n) {
                        v.statutNom = 'alternatif';
                        v.nomPrincipal = [...g1.principaux.entries()].sort((x, y) => y[1] - x[1])[0][0];
                    } else {
                        v.statutNom = 'identique';
                        v.graphieBan = g1.ponct && g1.ponct * 2 >= g1.prin ? g1.brut : '';
                    }
                }
                else if (gagnant[0] === '') v.statutNom = 'sansNom';
                else if (ROUTE_RE.test(v.nomWme)) v.statutNom = 'numeroRoute';
                // Nom WME = une AUTRE voie BAN : les numéros tombent sur la voisine, ce n'est pas une variante.
                else if (nomsBan.has(gagnant[0])) v.statutNom = 'different';
                else v.statutNom = ecartNoms(v.norm, gagnant[0]);
                // « Absente de WME » : aucun segment de ce nom dans l'emprise de la COMMUNE (les carreaux lus la débordent).
                v.nomAbsent = !!v.norm && !(parNom.get(v.norm) || []).some(dansEmprise);
                // Place = parking : le nom est porté par le lieu Parking (segments non nommés) à moins de SEG_MAX_M d'une adresse.
                if ((v.statutNom === 'sansNom' || v.statutNom === 'aucun') && v.norm && parkingsParNom.has(v.norm)
                    && parkingsParNom.get(v.norm).some(p => v.adresses.some(a => procheDuLieu(a, p)))) {
                    v.statutNom = 'parking';
                    v.nomAbsent = false;
                }
                // Segments RENDUS (sélection, CSV, permalien) : nom BAN, variante ou nom WME retenu — pas le plus proche de chaque numéro (v.segs).
                const nomsVoie = new Set([v.norm, ...v.variantes]);
                if (gagnant) nomsVoie.add(gagnant[0]);
                const rendus = new Set([...v.segs].filter(s => nomsVoie.has(s.principal) || [...s.noms].some(nom => nomsVoie.has(nom))));
                // Le nom WME retenu près des numéros rattache aussi ses segments, sauf s'il est celui d'une autre voie BAN.
                if (gagnant && gagnant[0] && v.statutNom !== 'different') for (const s of parNom.get(gagnant[0]) || []) {
                    if (s.coords.some(([x, y]) => x >= w - MARGE_NOM && x <= e + MARGE_NOM && y >= so - MARGE_NOM && y <= n + MARGE_NOM)) rendus.add(s);
                }
                v.segsVoie = [...rendus];
            }

            top('voies');
            // Couples tranchés règle par règle, HN avant RPP (le RPP est le doublon), puis au plus près ; chacun ne sert qu'une fois.
            const couples = [];
            const memeNom = (x, v) => x.noms.has(v.norm) || (v.variantes.size > 0 && [...x.noms].some(nom => v.variantes.has(nom)));
            for (const v of voies.values()) {
                for (const a of v.adresses) {
                    a.trouve = null;
                    for (const x of autourDe(a.num, a.lon, a.lat)) {
                        const dm = distWme(a, x);
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
                c.a.wme = c.x;
                c.a.dm = c.dm;
                pris.add(c.x);
            }
            // Même numéro, SUFFIXE différent, même voie : l'adresse reste manquante avec un numéro à vérifier, qui n'est pas « en trop ».
            const base = n => (/^\d+/.exec(n || '') || [''])[0];
            const parBase = new Map();
            for (const x of wme) { if (pris.has(x)) continue; const b = base(x.num); if (b) indexer(b, x, parBase); }
            const baseAutour = (b, lon, lat) => autour(parBase, b, lon, lat);
            const suffixes = new Set();
            for (const v of voies.values()) for (const a of v.adresses) {
                if (a.trouve) continue;
                let meilleur = null, dmin = RAYON_M;
                for (const x of baseAutour(base(a.num), a.lon, a.lat)) {
                    if (suffixes.has(x) || x.num === a.num) continue;
                    const dm = distWme(a, x);
                    if (dm <= dmin && (memeNom(x, v) || (x.seg && v.segs.has(x.seg)))) { meilleur = x; dmin = dm; }
                }
                if (meilleur) { a.suffixe = meilleur.brut; suffixes.add(meilleur); }
            }
            // Même numéro, même voie, entre RAYON_M et LOIN_MAX_M : adresse placée exprès devant la propriété ⇒ TROUVÉE, marquée « loin ».
            const LOIN_MAX_M = 1000;
            const parNumTous = new Map();
            for (const x of wme) {
                if (pris.has(x) || suffixes.has(x)) continue;
                const l = parNumTous.get(x.num);
                if (l) l.push(x); else parNumTous.set(x.num, [x]);
            }
            const contourCommune = d.contour;
            for (const v of voies.values()) for (const a of v.adresses) {
                if (a.trouve || a.suffixe) continue;
                let meilleur = null, dmin = LOIN_MAX_M;
                for (const x of parNumTous.get(a.num) || []) {
                    if (pris.has(x) || !(memeNom(x, v) || (x.seg && v.segs.has(x.seg))) || !dansContour(x.lon, x.lat, contourCommune)) continue;
                    const dm = distWme(a, x);
                    if (dm <= dmin) { meilleur = x; dmin = dm; }
                }
                if (meilleur) {
                    a.trouve = meilleur.type;
                    a.wme = meilleur;
                    a.dm = dmin;
                    a.loin = true;
                    pris.add(meilleur);
                }
            }
            // Excès mesuré depuis le MARQUEUR WME, pas le point BAN ; rue de même nom si elle a des segments, sinon le segment le plus proche.
            for (const v of voies.values()) for (const a of v.adresses) {
                a.ea = null;
                if (!a.trouve || !a.wme || !a.wme.arret) continue;
                const x = a.wme, o = x;
                const [ax, ay] = m(o.lon, o.lat), [bx, by] = m(x.arret[0], x.arret[1]);
                const dArr = Math.hypot(ax - bx, ay - by);
                if (dArr < PALIERS_ARRET[0]) continue;
                const nomX = (x.type === 'HN' && x.seg && x.seg.principal) || [...x.noms][0] || '';
                const aSonNom = !!nomX && (parNom.get(nomX) || []).length > 0;
                const pr = aSonNom ? plusProche(g, o.lon, o.lat, dArr + 1, m, nomX) : plusProche(g, o.lon, o.lat, dArr + 1, m);
                const ea = dArr - (pr ? pr.d : dArr);
                if (ea >= PALIERS_ARRET[0]) a.ea = ea;
            }
            // Numéro WME seul alors qu'une adresse admissible existait : doublon, pas « en trop ».
            top('couples');
            // Doublon seulement par règle 1 ou 2 ; par la seule proximité (règle 3), c'est « en trop ».
            const admissibles = new Set(couples.filter(c => c.regle <= 2).map(c => c.x));
            const dehors = wme.filter(x => !pris.has(x) && !suffixes.has(x) && dansContour(x.lon, x.lat, d.contour));
            const doublons = dehors.filter(x => admissibles.has(x));
            const enTrop = dehors.filter(x => !admissibles.has(x));

            // Non certifiées : rapprochées comme les autres, retirées seulement ici des comptes, voies et manquants.
            const compte = a => !d.certSeules || a.cert;
            // Clé en double (communes déléguées) : l'outil de signalement n'en ouvrira qu'une.
            const nCle = new Map();
            for (const v of voies.values()) for (const a of v.adresses) if (a.cle) nCle.set(a.cle, (nCle.get(a.cle) || 0) + 1);
            const liste = [], sansNomBan = [];
            for (const v of voies.values()) {
                // Le fichier BAN n'est pas trié : ordre croissant des numéros.
                const gardees = v.adresses.filter(compte).sort(ordreNum);
                if (!gardees.length) continue;
                if (v.remplacement) {
                    sansNomBan.push({ nom: v.nom, deleguee: v.deleguee, ban: gardees.length, nomProche: v.nomProche || '',
                        idVoie: voieDeCles(gardees.map(a => a.cle)), uidV: plusFrequent(gardees.map(a => a.uidV)),
                        nums: gardees.map(a => a.brut), lon: gardees[0].lon, lat: gardees[0].lat, bbox: v.bbox });
                    continue;
                }
                const hn = gardees.filter(a => a.trouve === 'HN').length, rpp = gardees.filter(a => a.trouve === 'RPP').length;
                const arretsHist = histoArret();
                for (const a of gardees) if (a.ea != null) PALIERS_ARRET.forEach((p, i) => { if (a.ea >= p) arretsHist[i]++; });
                liste.push({
                    nom: v.nom, deleguee: v.deleguee, nomWme: v.nomWme, nomPrincipal: v.nomPrincipal, statutNom: v.statutNom, graphieBan: v.graphieBan || "", nomAbsent: v.nomAbsent,
                    ban: gardees.length, hn, rpp, presents: hn + rpp,
                    manquants: gardees.filter(a => !a.trouve).map(a => a.brut),
                    suffixes: gardees.filter(a => a.suffixe).length,
                    eloignes: gardees.filter(a => a.loin).length,
                    arretsHist,
                    idVoie: voieDeCles(gardees.map(a => a.cle)),
                    uidV: plusFrequent(gardees.map(a => a.uidV)),
                    adresses: gardees.map(a => ({ brut: a.brut, lon: a.lon, lat: a.lat, trouve: a.trouve, suffixe: a.suffixe || '', loin: !!a.loin, cert: a.cert,
                        cle: a.cle || '', cleDouble: (nCle.get(a.cle) || 0) > 1, uidA: a.uidA || '',
                        wlon: a.trouve ? a.wme.lon : null, wlat: a.trouve ? a.wme.lat : null, dm: a.trouve ? Math.round(a.dm) : null,
                        ea: a.ea != null ? Math.round(a.ea) : null, alon: a.ea != null ? a.wme.arret[0] : null, alat: a.ea != null ? a.wme.arret[1] : null,
                        seg: !a.trouve && a.proche ? a.proche.seg.id : null,
                        plon: !a.trouve && a.proche ? a.proche.fx / kx : null, plat: !a.trouve && a.proche ? a.proche.fy / 110540 : null,
                        pd: !a.trouve && a.proche ? Math.round(a.proche.d) : null })),
                    bbox: v.bbox,
                    segs: v.segsVoie.map(x => x.id),
                });
            }
            const nIdV = new Map();
            for (const v of liste) if (v.idVoie) nIdV.set(v.idVoie, (nIdV.get(v.idVoie) || 0) + 1);
            for (const v of liste) v.idVoieDouble = !!v.idVoie && nIdV.get(v.idVoie) > 1;
            const sortie = x => ({ type: x.type, brut: x.brut, rue: x.rue, lon: x.lon, lat: x.lat });
            const tot = liste.reduce((s, v) => ({ ban: s.ban + v.ban, hn: s.hn + v.hn, rpp: s.rpp + v.rpp, suf: s.suf + v.suffixes, elo: s.elo + v.eloignes }), { ban: 0, hn: 0, rpp: 0, suf: 0, elo: 0 });
            return {
                chrono: Object.assign(chrono, { fin: Date.now() - topPrec, total: Date.now() - top0 }),
                voies: liste,
                sansNomBan: sansNomBan.sort((x, y) => y.ban - x.ban),
                enTrop: enTrop.map(sortie),
                doublons: doublons.map(sortie),
                totaux: {
                    ban: tot.ban, cert: d.adresses.filter(a => a.cert).length, hn: tot.hn, rpp: tot.rpp, presents: tot.hn + tot.rpp,
                    manquants: tot.ban - tot.hn - tot.rpp, enTrop: enTrop.length, doublons: doublons.length, suffixes: tot.suf, eloignes: tot.elo,
                    arretsHist: sommeHisto(liste.map(v => v.arretsHist)),
                    certSeules: !!d.certSeules, ecartees: d.adresses.length - tot.ban - sansNomBan.reduce((x, v) => x + v.ban, 0), adressesBan: d.adresses.length,
                    sansNomBan: sansNomBan.reduce((x, v) => x + v.ban, 0), voiesSansNomBan: sansNomBan.length,
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

        // Export relu : voies retrouvées par nom NORMÉ (l'apostrophe anti-formule n'y change rien).
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

        // Nom « souple » : seuls accents, casse, apostrophes, espaces et ponctuation sont tolérés ; un écart de ponctuation avertit sans bloquer.
        function nomGraphie(s) {
            return String(s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[\u2018\u2019`\u00b4]/g, "'")
                .replace(/\s+/g, ' ').trim().toLowerCase();
        }
        function nomSouple(s) {
            return nomGraphie(s).replace(/[-\u2010\u2011\u2012\u2013\u2014.]/g, ' ').replace(/\s+/g, ' ').trim();
        }
        function villeHnOk(ville, commune) {
            const v = nomSouple(ville), c = nomSouple(commune);
            if (!v || !c) return false;
            if (v === c) return true;
            const m = /^(.+?)\s*\(([^()]+)\)$/.exec(v);
            return !!m && m[2].trim() === c;
        }
        // Ville d'un RPP : « Village (Commune) » devient « Commune » (même règle que getRppStreetId d'Ajout Num/RPP).
        function villeRpp(ville) {
            const m = /^.*?\(\s*([^()]+?)\s*\)\s*$/.exec(String(ville || ''));
            return m ? m[1] : String(ville || '');
        }
        // Suffixe chiffré ou forme inconnue : pas posé, il demande un humain.
        const SUFFIXES_HN = { qua: 'quater', qui: 'quinquies' };
        // BAN suffixée / WME nu : deux numéros, on pose. BAN nue / WME suffixé, ou deux suffixes différents : bloqué (peut-être la même adresse).
        const nu = s => /^\s*0*\d+\s*$/.test(String(s || ''));
        const suffixeBloque = a => !!(a && a.suffixe) && !(nu(a.suffixe) && !nu(a.brut));
        function numeroHn(brut) {
            const m = /^0*(\d+)(?:\s+([a-z]+))?$/i.exec(String(brut || '').trim());
            if (!m || m[1] === '0') return null;
            if (!m[2]) return m[1];
            const sf = m[2].toLowerCase();
            return m[1] + (SUFFIXES_HN[sf] || sf);
        }
        // Quota : au plus HN_MAX par fenêtre glissante. Entrée { t, s, n, e: 0 réservé | 1 enregistré }, réservée à la pose,
        // gardée seulement si le numéro est relu sur le serveur ; un simple horodatage (ancien format) vaut une entrée enregistrée.
        const HN_MAX = 500, HN_FENETRE_MS = 3600 * 1000;
        const heureHn = x => typeof x === 'number' ? x : x && typeof x.t === 'number' ? x.t : NaN;
        function quotaHn(entrees, maintenant) {
            const r = (entrees || []).filter(x => heureHn(x) > maintenant - HN_FENETRE_MS).sort((a, b) => heureHn(a) - heureHn(b));
            const reste = Math.max(0, HN_MAX - r.length);
            return { utilises: r.length, reste, libre: reste ? maintenant : heureHn(r[r.length - HN_MAX]) + HN_FENETRE_MS, garder: r };
        }
        // Couleur de la pastille du quota : orange sous 20 % restants, rouge sous 5 % (et quota plein).
        function niveauQuota(q) {
            const total = q.utilises + q.reste;
            if (!q.reste || q.reste * 20 < total) return 'critique';
            if (q.reste * 5 < total) return 'bas';
            return 'ok';
        }
        // Après enregistrement : entrée réservée retrouvée sur le serveur ⇒ enregistrée, absente ⇒ rendue ; un RPP indécidable reste réservé.
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
        // Plan d'UNE voie : segments au nom principal = nom BAN (souple) et ville = la commune ; chaque manquant va au plus proche à SEG_MAX_M.
        // Hors agglo = principal sans ville + alternatif « nom BAN / commune » (nommage FR, pas une zone) ⇒ RPP ; nommage absent ⇒ refusé.
        // Tous les RPP (allée, hors agglo, voie roulable d'un autre nom) partent en lot comme au « + » ; le lot reste un geste L6 sous quota.
        function planHn(voie, commune, segs, existants, reste, opt) {
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
                sansAlt: segs.filter(s => bonNom(s) && !nomSouple(s.ville) && !horsAgglo(s)).length,
                sansAltRoute: segs.filter(s => ROUTE_RE.test(s.nom || '') && !nomSouple(s.ville) && !horsAgglo(s) && probables.has(s.id)).length,
            };
            const deLaVoie = new Set([...(voie.segs || [])].concat([...probables]));
            const nomsVoie = [...new Set(segs.filter(s => deLaVoie.has(s.id) && !bonNom(s) && !horsAgglo(s) && s.nom).map(s => s.nom))];
            const ecartes = { existe: 0, suffixe: 0, format: 0, loin: 0, quota: 0, dejaPose: 0 };
            const poses = [];
            const vus = new Set((existants || []).map(n => normNum(n)));
            // Dans l'ordre des numéros : quand le quota coupe, pas de trou au milieu de la rue.
            const ordre = (voie.adresses || []).slice().sort((x, y) => (parseInt(x.brut, 10) || 0) - (parseInt(y.brut, 10) || 0) || String(x.brut).localeCompare(String(y.brut)));
            for (const a of ordre) {
                if (a.trouve) continue;
                if (a.hnPose || a.hnEnregistre) { ecartes.dejaPose++; continue; }
                if (suffixeBloque(a)) { ecartes.suffixe++; continue; }
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
                if (!best) {
                    const r = rppAuBoutDeLAllee(a, admis, segs);
                    if (!r) {
                        // Aucun segment au nom BAN à portée, mais une voie roulable d'un autre nom : RPP « nom BAN / commune »
                        // (il porte sa propre adresse), entrée sur cette voie ; en lot comme au « + ».
                        const libre = voieRoulableProche(a, segs);
                        if (!libre) { ecartes.loin++; continue; }
                        if (poses.length >= reste) { ecartes.quota++; continue; }
                        vus.add(cle);
                        poses.push({ number, lon: a.lon, lat: a.lat, segmentId: libre.id, adresse: a, libre: true, entree: pointLePlusProche(a.lon, a.lat, libre.coords),
                            rpp: { rue: voie.nom, ville: villeRpp(commune) } });
                        continue;
                    }
                    if (poses.length >= reste) { ecartes.quota++; continue; }
                    vus.add(cle);
                    const altR = enAgglo.indexOf(r.rue) < 0 ? altBan(r.rue) : null;
                    poses.push({ number, lon: a.lon, lat: a.lat, segmentId: r.rue.id, adresse: a, direct: true, entree: r.entree, allee: r.allee.id,
                        rpp: altR ? { rue: altR.nom, ville: villeRpp(altR.ville) } : { rue: r.rue.nom, ville: villeRpp(r.rue.ville) } });
                    continue;
                }
                const alt = enAgglo.indexOf(best) < 0 ? altBan(best) : null;
                if (poses.length >= reste) { ecartes.quota++; continue; }
                vus.add(cle);
                poses.push({ number, lon: a.lon, lat: a.lat, segmentId: best.id, adresse: a, rpp: alt ? { rue: alt.nom, ville: villeRpp(alt.ville) } : null });
            }
            return { poses, ecartes, admis: admis.length, hors: horsA.length, refus, nomsVoie };
        }
        // Segment où le « + » d'UN numéro poserait (même choix que planHn, doublons non comptés) ; rpp : la pose deviendrait un RPP.
        function segmentProbableHn(voie, a, commune, segs) {
            const p = planHn(Object.assign({}, voie, { adresses: [a] }), commune, segs, [], 1).poses[0];
            return p ? { segmentId: p.segmentId, rpp: !!p.rpp } : null;
        }
        // Numéros existants : segments rattachés à la voie et ceux qui portent le nom BAN — pas le plus proche (`a.seg`), qui peut être d'une rue voisine.
        function segsDesExistants(nomBan, voie, ids, segs) {
            const nb = nomSouple(nomBan), deVoie = new Set(voie || []);
            const parId = new Map((segs || []).map(s => [s.id, s]));
            return [...new Set((ids || []).concat((segs || []).map(s => s.id)))].filter(id => {
                if (deVoie.has(id)) return true;
                const s = parId.get(id);
                return !!s && (nomSouple(s.nom) === nb || (s.alts || []).some(a => nomSouple(a.nom) === nb));
            });
        }
        // Allée : le segment le plus proche est une ALLÉE (17, 20) à moins de ALLEE_MAX_M — une rue sans nom n'en est pas une — et la voie à moins de RUE_RPP_M.
        function rppAuBoutDeLAllee(a, admis, segs) {
            const traceOk = s => s && s.coords && s.coords.length > 1;
            let rue = null, dRue = RUE_RPP_M;
            for (const s of admis) { if (!traceOk(s)) continue; const d = distTrace(a.lon, a.lat, s.coords); if (d <= dRue) { dRue = d; rue = s; } }
            if (!rue) return null;
            let pr = null, dPr = Infinity;
            for (const s of segs || []) { if (!traceOk(s)) continue; const d = distTrace(a.lon, a.lat, s.coords); if (d < dPr) { dPr = d; pr = s; } }
            if (!pr || dPr > ALLEE_MAX_M || admis.indexOf(pr) >= 0) return null;
            if (pr.rt !== 17 && pr.rt !== 20) return null;
            return { rue, allee: pr, entree: pointLePlusProche(a.lon, a.lat, pr.coords), dRue, dAllee: dPr };
        }
        function pointLePlusProche(lon, lat, coords) {
            const m = versMetres(lat), [px, py] = m(lon, lat);
            let best = coords[0], bd = Infinity;
            for (let k = 1; k < coords.length; k++) {
                const A = coords[k - 1], B = coords[k], [ax, ay] = m(A[0], A[1]), [bx, by] = m(B[0], B[1]);
                const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
                const t = l2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l2)) : 0;
                const d = Math.hypot(px - ax - t * dx, py - ay - t * dy);
                if (d < bd) { bd = d; best = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t]; }
            }
            return best;
        }
        // Entrée d'un numéro transformé en RPP : segment roulable le plus proche, autre que le sien, SANS NOM ou allée, à moins de SEG_MAX_M ; sinon null.
        const NON_ROULABLES = new Set([5, 10, 15, 16, 18, 19]);
        // Segment roulable le plus proche d'une adresse, quel que soit son nom, à SEG_MAX_M au plus ; sinon null.
        function voieRoulableProche(a, segs) {
            let choisi = null, dMax = SEG_MAX_M;
            for (const s of segs || []) {
                if (!s || !s.coords || s.coords.length < 2 || NON_ROULABLES.has(s.rt)) continue;
                const d = distTrace(a.lon, a.lat, s.coords);
                if (d <= dMax) { dMax = d; choisi = s; }
            }
            return choisi;
        }
        function entreeRpp(lon, lat, segs, segNum) {
            let choisi = null, dMax = SEG_MAX_M;
            for (const s of segs || []) {
                if (!s || String(s.id) === String(segNum) || !s.coords || s.coords.length < 2 || NON_ROULABLES.has(s.rt)) continue;
                const sansNom = !(s.noms || []).some(n => n && String(n).trim());
                if (!sansNom && s.rt !== 17 && s.rt !== 20) continue;
                const d = distTrace(lon, lat, s.coords);
                if (d <= dMax) { dMax = d; choisi = s; }
            }
            return choisi ? { seg: choisi, entree: pointLePlusProche(lon, lat, choisi.coords), d: dMax } : null;
        }
        // Segments neufs à moins de SEG_MAX_M d'une adresse manquante sans segment.
        function segsPresDesOrphelines(voies, segs) {
            const orph = [];
            (voies || []).forEach((v, i) => { for (const a of v.adresses || []) if (!a.trouve && a.seg == null && typeof a.lon === 'number') orph.push({ a, i }); });
            const ids = new Set(), touchees = new Set();
            if (!orph.length) return { ids, voies: 0 };
            for (const s of segs || []) {
                const c = s && s.coords;
                if (!c || c.length < 2) continue;
                for (const { a, i } of orph) {
                    const m = versMetres(a.lat), [px, py] = m(a.lon, a.lat);
                    for (let k = 1; k < c.length; k++) {
                        const [ax, ay] = m(c[k - 1][0], c[k - 1][1]), [bx, by] = m(c[k][0], c[k][1]);
                        if (distSeg(px, py, ax, ay, bx, by) <= SEG_MAX_M) { ids.add(s.id); touchees.add(i); break; }
                    }
                }
            }
            return { ids, voies: touchees.size };
        }

        // RPP en agglo → numéro (doctrine de WNA, verdictRppAgglo) : un RPP y est souvent légitime ; on ne convertit que l'ÉCART FRANC
        // (doublon, ou accès / à défaut position sur la voie même sans autre voie à RPP_MARGE_VOIE_M). Accès sur une autre voie ⇒ « conforme ».
        const RPP_MARGE_VOIE_M = 10, RPP_PORTEE_VOIE_M = 120, RPP_DOUBLON_M = 150;
        function distTrace(lon, lat, coords) {
            const m = versMetres(lat), [px, py] = m(lon, lat);
            let d = Infinity;
            for (let k = 1; k < coords.length; k++) {
                const [ax, ay] = m(coords[k - 1][0], coords[k - 1][1]), [bx, by] = m(coords[k][0], coords[k][1]);
                d = Math.min(d, distSeg(px, py, ax, ay, bx, by));
            }
            return d;
        }
        // Noms SANS NOM compris : une allée anonyme explique qu'un RPP soit loin de sa rue.
        function voieLaPlusProche(lon, lat, segs) {
            const cand = [];
            for (const sg of segs || []) {
                if (!sg || !sg.coords || sg.coords.length < 2) continue;
                const d = distTrace(lon, lat, sg.coords);
                if (d <= RPP_PORTEE_VOIE_M) cand.push({ d, noms: (sg.noms || []).map(nomSouple).filter(Boolean), libelle: (sg.noms || []).filter(Boolean)[0] || '' });
            }
            if (!cand.length) return { noms: [], libelle: '', dist: Infinity, distAutreVoie: Infinity };
            cand.sort((a, b) => a.d - b.d);
            const best = cand[0], meme = c => c.noms.some(n => best.noms.includes(n)) || (!c.noms.length && !best.noms.length);
            const autre = cand.find(c => !meme(c));
            return { noms: best.noms, libelle: best.libelle, dist: best.d, distAutreVoie: autre ? autre.d : Infinity };
        }
        function verdictRppHn({ rue, acces, pos, doublon }) {
            if (doublon) return { verdict: 'ecart', motif: 'doublon' };
            const r = nomSouple(rue);
            if (!r) return { verdict: 'trancher', motif: 'sansRue' };
            const base = acces || pos, motif = acces ? 'acces' : 'position';
            if (!base || !isFinite(base.dist) || base.dist > RPP_PORTEE_VOIE_M) return { verdict: 'trancher', motif: 'loin' };
            if (base.noms.includes(r)) {
                if (isFinite(base.distAutreVoie) && base.distAutreVoie - base.dist < RPP_MARGE_VOIE_M) return { verdict: 'trancher', motif: 'equidistant' };
                return { verdict: 'ecart', motif };
            }
            // L'accès sur une AUTRE voie prouve le décalage ; la position seule ne dit pas où est l'entrée.
            if (acces && base.noms.length && (!isFinite(base.distAutreVoie) || base.distAutreVoie - base.dist >= RPP_MARGE_VOIE_M))
                return { verdict: 'conforme', motif: 'acces', voie: base.libelle || base.noms[0] };
            return { verdict: 'trancher', motif };
        }

        // Voie LONGUE : au zoom 16 WME ne charge que l'écran ; adresses restantes groupées en zones de demiX × demiY m.
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

        // Mes Signalements : ADRESSE par sa clé d'interopérabilité, VOIE par la clé sans numéro + LOCATION_TO_UPDATE (@a/@v : 404). Hôte au singulier.
        const SIGNALEMENT_URL = 'https://signalement.adresse.data.gouv.fr';
        const CLE_RE = /^((?:\d{2}|2[AB])\d{3}_[0-9a-z]+)_\d{5}(?:_[0-9a-z]+)?$/i;
        // Corse : services BAN en MAJUSCULES pour la voie et la commune (sinon 404 / « pas de BAL »), minuscules pour l'adresse.
        const idVoieBan = cle => { const m = CLE_RE.exec(String(cle || '').trim()); return m ? m[1].replace(/^2[ab]/i, s => s.toUpperCase()) : ''; };
        const inseeCle = cle => idVoieBan(cle).slice(0, 5);
        function lienSignalement(cle, voie) {
            const c = String(cle || '').trim(), id = idVoieBan(c);
            if (!id) return '';
            return SIGNALEMENT_URL + '/#/' + (voie ? id + '?type=LOCATION_TO_UPDATE' : c);
        }
        // Voie BAN à plusieurs identifiants : le plus fréquent, le premier à égalité.
        function voieDeCles(cles) {
            const n = new Map();
            for (const c of cles) { const id = idVoieBan(c); if (id) n.set(id, (n.get(id) || 0) + 1); }
            let best = '', bn = 0;
            for (const [id, k] of n) if (k > bn) { best = id; bn = k; }
            return best;
        }
        function plusFrequent(l) {
            const n = new Map();
            for (const x of l) if (x) n.set(x, (n.get(x) || 0) + 1);
            let best = '', bn = 0;
            for (const [x, k] of n) if (k > bn) { best = x; bn = k; }
            return best;
        }
        // Alerte « adresse manquante » : route /alert (lat, lng, type, comment).
        // Nom de remplacement (« Non Renseigné ») : pas regroupé par nom, sinon une fausse voie de toute la commune.
        const NOM_VIDE_RE = /^(?:non[ -]?renseigne(?:e)?|voie non (?:nommee|renseignee|denommee)|voie sans nom|voie (?:inconnue|provisoire)|sans nom|nom inconnu|inconnue?|a denommer|non (?:denommee?|nommee?)|lieu[- ]?dit non renseigne|n ?r|nc|xx+|\?+|-+)$/;
        function nomRemplacement(nom) {
            const x = String(nom || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[.\u2019']/g, ' ').replace(/\s+/g, ' ').trim();
            return !!x && NOM_VIDE_RE.test(x);
        }
        function lienCarteBan(lon, lat, zoom) {
            if (!Number.isFinite(lon) || !Number.isFinite(lat)) return '';
            return 'https://adresse.data.gouv.fr/carte-base-adresse-nationale#' + lat.toFixed(6) + '_' + lon.toFixed(6) + '_' + (zoom || 18).toFixed(2);
        }
        function lienAlerte(lon, lat, comment) {
            if (!Number.isFinite(lon) || !Number.isFinite(lat)) return '';
            return SIGNALEMENT_URL + '/#/alert?lat=' + lat.toFixed(6) + '&lng=' + lon.toFixed(6) + '&type=MISSING_ADDRESS' + (comment ? '&comment=' + encodeURIComponent(comment) : '');
        }
        // La réponse de la mairie ne rappelle pas la demande : reconstituée ici.
        function resumeSignalement(x) {
            const e = (x && x.existingLocation) || {}, c = (x && x.changesRequested) || {};
            const pt = (x && x.point && x.point.coordinates) || [];
            const suf = v => v ? ' ' + v : '';
            const topo = (e.toponyme && e.toponyme.nom) || '';
            let libelle = '';
            if (e.type === 'NUMERO') libelle = (e.numero != null ? e.numero : '') + suf(e.suffixe) + ' ' + topo;
            else if (e.type === 'VOIE' || e.type === 'TOPONYME') libelle = e.nom || '';
            else if (x && x.type === 'LOCATION_TO_CREATE') libelle = (c.numero != null ? c.numero : '') + suf(c.suffixe) + ' ' + (c.nomVoie || '');
            const demande = [];
            const type = (x && x.type) || '';
            if (type === 'LOCATION_TO_DELETE') demande.push({ k: 'del' });
            else if (type === 'MISSING_ADDRESS') demande.push({ k: 'missing' });
            else if (type === 'LOCATION_TO_CREATE') demande.push({ k: 'create' });
            else {
                if (c.nom && c.nom !== e.nom) demande.push({ k: 'nom', v: c.nom });
                if (e.type === 'NUMERO' && c.numero != null && (String(c.numero) !== String(e.numero) || (c.suffixe || '') !== (e.suffixe || ''))) demande.push({ k: 'num', v: String(c.numero) + suf(c.suffixe) });
                if (e.type === 'NUMERO' && c.nomVoie && topo && c.nomVoie !== topo) demande.push({ k: 'voie', v: c.nomVoie });
                if (!demande.length) demande.push({ k: 'autre' });
            }
            return { id: (x && x.id) || '', date: String((x && x.createdAt) || '').slice(0, 10), statut: (x && x.status) || '', type,
                cible: e.type || '', banId: e.banId || '', voieNom: c.nomVoie || topo || (e.type === 'VOIE' ? e.nom || '' : ''),
                lon: +pt[0], lat: +pt[1], libelle: libelle.trim(), demande,
                comment: String(((x && x.reportKind === 'alert') ? x.comment : c.comment) || '').trim(), motif: String((x && x.rejectionReason) || '').trim() };
        }
        function signalementsVoie(liste, v) {
            const uids = new Set((v.adresses || []).map(a => a.uidA).filter(Boolean));
            const nom = normNom(v.nom);
            return liste.filter(x => (x.cible === 'VOIE' && x.banId && x.banId === v.uidV) || (x.cible === 'NUMERO' && uids.has(x.banId))
                || (x.type === 'LOCATION_TO_CREATE' && x.voieNom && normNom(x.voieNom) === nom));
        }
        function dernierSignalement(liste, banId) {
            if (!banId) return null;
            return liste.filter(x => x.banId === banId).sort((a, b) => b.date.localeCompare(a.date))[0] || null;
        }
        function alerteProche(liste, lon, lat, m) {
            const lim = m || 30, kx = 111320 * Math.cos(lat * Math.PI / 180);
            return liste.filter(x => x.type === 'MISSING_ADDRESS' && Math.hypot((x.lon - lon) * kx, (x.lat - lat) * 110540) <= lim)
                .sort((a, b) => b.date.localeCompare(a.date))[0] || null;
        }
        return { ordreNum, nomRemplacement, lienCarteBan, lienAlerte, resumeSignalement, signalementsVoie, dernierSignalement, alerteProche, lienSignalement, voieDeCles, inseeCle, normNum, normNom, coeurNom, ecartNoms, lireCsv, lireBan, lireExport, dansContour, analyser, PALIERS_ARRET, sommeHisto, arretsAuDela, nomSouple, villeHnOk, villeRpp, numeroHn, distTrace, voieLaPlusProche, verdictRppHn, RPP_DOUBLON_M, quotaHn, niveauQuota, rapprocherHn, planHn, segmentProbableHn, segsDesExistants, zonesHn, pointLePlusProche, entreeRpp, suffixeBloque, segsPresDesOrphelines };
    })();
    // ==/WBC-CORE==


    const Arret = function () { return Object.assign(new Error('arrêt'), { arret: true }); };

    // Erreur réseau : drapeau `reseau` et `source`, jamais reconnue à son texte (traduit).
    const errReseau = (msg, status, source) => Object.assign(new Error(msg), { reseau: true, status, source });
    const errFormat = source => Object.assign(new Error('format'), { format: true, source });
    function messageErreur(e) {
        if (e.format) return t('errFormat', e.source === 'wme' ? 'WME' : e.source === 'ban' ? pays.source : pays.referentiel);
        // Une session WME expirée répond 401 ou 403 : recharger la page, pas « réessayer plus tard ».
        if (e.source === 'wme' && (e.status === 401 || e.status === 403)) return t('errSession');
        if (e.reseau && e.source === 'wme') return t('errWme') + e.message;
        if (e.reseau) return t('errNet', e.message);
        return e.message;
    }

    // BAN et geo.api passent par le gestionnaire de scripts (WME refuse les autres domaines) ; la BAN compressée n'annonce pas sa taille.
    // Refus passager (429, 5xx, coupure) : deux nouvelles tentatives, à 1,5 s puis 4 s ; jamais pour un 404.
    const passager = e => e && e.reseau && (!e.status || e.status === 429 || e.status >= 500);
    async function avecEssais(f) {
        for (const attente of [1500, 4000]) {
            try { return await f(); }
            catch (e) { if (!passager(e)) throw e; log('nouvel essai dans ' + attente + ' ms : ' + e.message); await new Promise(r => setTimeout(r, attente)); }
        }
        return f();
    }
    const gm = (url, surProgres, complet) => avecEssais(() => gmUneFois(url, surProgres, complet));
    const etagDe = h => { const m = /^etag:\s*(.+)$/im.exec(h || ''); return m ? m[1].trim() : ''; };
    // HEAD : l'ETag, stable et identique au GET, dit si le fichier BAN a changé.
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
    // anonyme : ni cookie ni identifiant envoyés avec la requête.
    function gmUneFois(url, surProgres, complet, anonyme) {
        const hote = url.split('/')[2];
        return new Promise((ok, ko) => {
            if (typeof GM_xmlhttpRequest !== 'function') { ko(new Error(t('errGrant'))); return; }
            GM_xmlhttpRequest({
                method: 'GET', url, timeout: 90000, anonymous: !!anonyme,
                onprogress: surProgres ? p => { if (p) surProgres(p.lengthComputable && p.total ? Math.min(1, p.loaded / p.total) : null, p.loaded || 0); } : undefined,
                onload: r => (r.status >= 200 && r.status < 300) ? ok(complet ? { texte: r.responseText, entetes: r.responseHeaders || '' } : r.responseText) : ko(errReseau(hote + ' HTTP ' + r.status, r.status, 'ext')),
                onerror: () => ko(errReseau(hote, 0, 'ext')),
                ontimeout: () => ko(errReseau(hote + ' (timeout)', 0, 'ext')),
            });
        });
    }
    // Réponse non JSON (page d'erreur servie en 200) : défaut de FORMAT.
    // Statut des signalements lu une fois par code et par session ; en échec, le bouton reste actif.
    const SIG_API = 'https://api-signalement-prod.osc-secnum-fr1.scalingo.io';
    const statutsSig = new Map();
    function statutSignalement(insee) {
        if (!insee) return null;
        if (!statutsSig.has(insee)) {
            statutsSig.set(insee, { attente: true });
            gmJson(SIG_API + '/settings/commune-status/' + encodeURIComponent(insee))
                .then(j => statutsSig.set(insee, { off: !!(j && j.disabled), message: (j && j.message) || '' }))
                .catch(e => { statutsSig.set(insee, { erreur: true }); log('signalement : statut ' + insee + ' illisible (' + e.message + ')'); })
                .then(() => { if (resultat) rendre(); });
        }
        return statutsSig.get(insee);
    }
    // Codes : la commune et ceux de ses clés (arrondissements, communes déléguées).
    const sigCommunes = new Map();
    function signalementsCommune(r) {
        const code = r && r.commune && r.commune.code;
        if (!code) return null;
        if (!sigCommunes.has(code)) {
            sigCommunes.set(code, { attente: true });
            const codes = new Set([code]);
            for (const v of r.voies) for (const a of v.adresses) { const i = Core.inseeCle(a.cle); if (i) codes.add(i); }
            (async () => {
                const q = [...codes].slice(0, 40).map(c => 'codeCommunes=' + encodeURIComponent(c)).join('&');
                const liste = [];
                for (let page = 1; page <= 20; page++) {
                    const j = await gmJson(SIG_API + '/reports?' + q + '&limit=100&page=' + page);
                    const d = (j && Array.isArray(j.data)) ? j.data : [];
                    liste.push(...d.map(Core.resumeSignalement));
                    if (d.length < 100 || liste.length >= ((j && j.total) || 0)) break;
                }
                liste.sort((a, b) => b.date.localeCompare(a.date));
                sigCommunes.set(code, { liste });
            })().catch(e => { sigCommunes.set(code, { erreur: true }); log('signalements ' + code + ' : ' + e.message); })
                .then(() => { if (resultat && resultat.commune.code === code) rendre(); });
        }
        return sigCommunes.get(code);
    }
    const sigListe = r => { const sg = signalementsCommune(r); return (sg && sg.liste) || []; };
    const gmJson = async url => { const txt = await gm(url); try { return JSON.parse(txt); } catch (e) { throw errFormat('geo'); } };

    // WBC ne couvre que la France (serveur « row ») : chemin pris tel quel.
    const cheminWme = (cle, repli) => repli;
    const wmeJson = url => avecEssais(() => wmeUneFois(url));
    async function wmeUneFois(url) {
        let r;
        try { r = await pw.fetch(url, { credentials: 'same-origin' }); }
        catch (e) { throw errReseau(e.message, 0, 'wme'); }
        if (!r.ok) throw errReseau('HTTP ' + r.status, r.status, 'wme');
        // Décodé en TEXTE : parcourir depuis le script les objets de `r.json()`, qui appartiennent à la page, est lent.
        const txt = await r.text();
        try { return JSON.parse(txt); } catch (e) { throw errFormat('wme'); }
    }

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


    const bboxDe = poly => {
        const c = poly.coordinates[0];
        const xs = c.map(p => p[0]), ys = c.map(p => p[1]);
        return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
    };
    // Tout ce qui tient au pays passe par l'adaptateur ; seule la France est branchée (source accréditée par Waze requise).
    const PAYS_FR = (() => {
        const BAN_URL = code => 'https://plateforme.adresse.data.gouv.fr/ban/communes/' + code + '/download/csv-bal/adresses';
        const GEO_URL = 'https://geo.api.gouv.fr';
        // Paris, Marseille et Lyon : la BAN n'existe que par arrondissement (le code de la commune rend 404).
        const ARRONDISSEMENTS = {
            '75056': Array.from({ length: 20 }, (_, i) => String(75101 + i)),
            '13055': Array.from({ length: 16 }, (_, i) => String(13201 + i)),
            '69123': Array.from({ length: 9 }, (_, i) => String(69381 + i)),
        };
        const versCommune = c => ({ code: c.code, nom: c.nom, dep: c.codeDepartement || (c.departement && c.departement.code) || '', bbox: c.bbox ? bboxDe(c.bbox) : null, contour: c.contour || null });
        let departements = null;
        const empriseDep = new Map();

        async function adresses(code, avance) {
            const codes = ARRONDISSEMENTS[code] || [code];
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
            adresses.etag = etags.every(x => x) ? etags.join('|') : '';
            adresses.reserve = reserve;
            return adresses;
        }

        return {
            code: 'FR',
            source: 'BAN',
            referentiel: 'geo.api.gouv.fr',
            // Position envoyée à geo.api ARRONDIE à 3 décimales (~100 m), sans identité ni cookie ; déclaré dans l'aide et le README.
            auPoint: async (lon, lat) => {
                const l = await gmJson(GEO_URL + '/communes?lat=' + lat.toFixed(3) + '&lon=' + lon.toFixed(3) + '&fields=nom,code,codeDepartement,bbox,contour');
                return l.length ? versCommune(l[0]) : null;
            },
            parCode: async code => versCommune(await gmJson(GEO_URL + '/communes/' + encodeURIComponent(code) + '?fields=nom,code,codeDepartement,bbox,contour')),
            chercher: async q => {
                const F = '&fields=nom,code,codeDepartement,codesPostaux&limit=10';
                if (/^\d{5}$/.test(q)) {
                    // Code postal et INSEE lus tous deux (une panne ne masque pas l'autre) ; communes d'un code postal toutes, les plus peuplées d'abord.
                    const parPopulation = l => l.sort((x, y) => (y.population || 0) - (x.population || 0));
                    const [ra, rb] = await Promise.allSettled([gmJson(GEO_URL + '/communes?codePostal=' + q + '&fields=nom,code,codeDepartement,codesPostaux,population').then(parPopulation), gmJson(GEO_URL + '/communes?code=' + q + F)]);
                    if (ra.status === 'rejected' && rb.status === 'rejected') throw ra.reason;
                    const a = ra.status === 'fulfilled' ? ra.value : [], b = rb.status === 'fulfilled' ? rb.value : [];
                    const vus = new Set();
                    return b.concat(a).filter(c => !vus.has(c.code) && vus.add(c.code));
                }
                if (/^(2[ab]|\d{2})\d{3}$/i.test(q)) return gmJson(GEO_URL + '/communes?code=' + q.toUpperCase() + F);
                return gmJson(GEO_URL + '/communes?nom=' + encodeURIComponent(q) + '&boost=population' + F);
            },
            groupes: async () => {
                if (!departements) departements = await gmJson(GEO_URL + '/departements?fields=nom,code');
                return departements;
            },
            communesDe: async dep => (await gmJson(GEO_URL + '/departements/' + encodeURIComponent(dep) + '/communes?fields=nom,code,codeDepartement,bbox,contour')).map(versCommune),
            emprise: async (type, code) => {
                if (type === 'commune') {
                    const c = await gmJson(GEO_URL + '/communes/' + encodeURIComponent(code) + '?fields=bbox');
                    return c && c.bbox ? bboxDe(c.bbox) : null;
                }
                if (!empriseDep.has(code)) {
                    const l = await gmJson(GEO_URL + '/departements/' + encodeURIComponent(code) + '/communes?fields=code,bbox');
                    const bs = l.filter(c => c.bbox).map(c => bboxDe(c.bbox));
                    if (bs.length) empriseDep.set(code, [Math.min(...bs.map(x => x[0])), Math.min(...bs.map(x => x[1])), Math.max(...bs.map(x => x[2])), Math.max(...bs.map(x => x[3]))]);
                }
                return empriseDep.get(code) || null;
            },
            adresses,
            empreinte: async code => {
                const l = [];
                for (const c of ARRONDISSEMENTS[code] || [code]) l.push(await gmTete(BAN_URL(c)));
                return l.join('|');
            },
            dateRevision: async code => {
                try {
                    const j = await gmJson('https://plateforme.adresse.data.gouv.fr/api/district/cog/' + encodeURIComponent(code));
                    const d = j && j.response && j.response[0];
                    const x = d && ((d.meta && d.meta.bal && d.meta.bal.dateRevision) || d.lastRecordDate);
                    return x ? Date.parse(x) : null;
                } catch (e) { return null; }
            },
        };
    })();
    const PAYS = { FR: PAYS_FR };
    const pays = PAYS.FR;

    function nouveauCache() { return { carreaux: new Map(), hn: new Map() }; }
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
            // Réponse sans liste de segments : format inconnu, signalé comme tel (sinon tout passerait « manquant »).
            if (!r || !r.segments || !Array.isArray(r.segments.objects)) throw errFormat('wme');
            const v = {
                segments: ((r.segments && r.segments.objects) || []).map(x => ({ id: x.id, geometry: x.geometry, primaryStreetID: x.primaryStreetID, streetIDs: x.streetIDs, hasHNs: x.hasHNs, date: x.updatedOn || x.createdOn || 0 })),
                streets: ((r.streets && r.streets.objects) || []).map(x => ({ id: x.id, name: x.name })),
                parkings: ((r.venues && r.venues.objects) || []).filter(x => x.name && (x.categories || []).includes('PARKING_LOT') && x.geometry)
                    .map(x => ({ id: x.id, name: x.name, geometry: x.geometry })),
                rpps: ((r.venues && r.venues.objects) || []).filter(x => x.residential).map(x => ({ id: x.id, geometry: x.geometry, streetID: x.streetID, houseNumber: x.houseNumber, entryExitPoints: (x.entryExitPoints || []).filter(e => e && e.point).map(e => ({ point: e.point, primary: !!e.primary })), date: x.updatedOn || x.createdOn || 0 })),
            };
            cache.carreaux.set(k, v);
            while (cache.carreaux.size > CARREAUX_GARDES) cache.carreaux.delete(cache.carreaux.keys().next().value);
            return v;
        });
        prog(t('stWme', 0, taches.length), 0);
        const parts = await parPaquets(taches, PARALLELE, jeton, (f, tot) => prog(t('stWme', f, tot), 0.8 * f / tot));
        const segments = new Map(), streets = new Map(), rpps = new Map(), parkings = new Map();
        for (const p of parts) {
            (p.parkings || []).forEach(x => parkings.set(x.id, x));
            p.segments.forEach(x => segments.set(x.id, x));
            p.streets.forEach(x => streets.set(x.id, x));
            p.rpps.forEach(x => rpps.set(x.id, x));
        }
        if (sansNumeros) return { segments: [...segments.values()], streets: [...streets.values()], rpps: [...rpps.values()], parkings: [...parkings.values()], hns: [] };
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
                cache.hn.get(h.segID).push({ id: h.id, segID: h.segID, number: h.number, geometry: h.geometry, fractionPoint: h.fractionPoint || null });
            }
        }), PARALLELE, jeton, finLot);
        const hns = [];
        for (const x of segments.values()) if (x.hasHNs) hns.push(...(cache.hn.get(x.id) || []));
        return { segments: [...segments.values()], streets: [...streets.values()], rpps: [...rpps.values()], parkings: [...parkings.values()], hns };
    }

    const mo = o => new Intl.NumberFormat(LOCALES[_lang] || 'en', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(o / 1048576);
    // 🔴 Onglet caché : Chrome bride setTimeout (~1 s, puis 1 par minute après 5 min) ; on rend la main par MessageChannel, non freiné.
    function ceder() {
        if (!document.hidden) return new Promise(r => setTimeout(r, 40));
        return new Promise(r => { const c = new MessageChannel(); c.port1.onmessage = () => { c.port1.close(); r(); }; c.port2.postMessage(0); });
    }

    async function analyserCommune(com, cache, jeton, prog, banPret, sortie) {
        const t0 = Date.now();
        prog(t('stBan'), 0, true);
        const toutes = await (banPret || pays.adresses(com.code, (f, o) => prog(t('stBanMo', mo(o)), f == null ? 0 : 0.3 * f, f == null)));
        if (sortie) sortie.adresses = toutes;
        if (jeton.stop) throw Arret();
        const adresses = toutes;
        if (!adresses.length) return { commune: com, vide: true, totaux: null };
        // Zone WME = emprise des adresses ET de la commune : sinon un numéro sans adresse BAN voisine ne serait jamais compté « en trop ».
        let w = Infinity, s = Infinity, e = -Infinity, n = -Infinity;
        for (const a of adresses) { w = Math.min(w, a.lon); e = Math.max(e, a.lon); s = Math.min(s, a.lat); n = Math.max(n, a.lat); }
        if (com.bbox) { w = Math.min(w, com.bbox[0]); s = Math.min(s, com.bbox[1]); e = Math.max(e, com.bbox[2]); n = Math.max(n, com.bbox[3]); }
        const M = 0.003;
        const bbox = [w - M, s - M, e + M, n + M];
        const tBan = Date.now() - t0;
        const wme = await lireWme(bbox, cache, jeton, (txt, f) => prog(txt, 0.3 + 0.65 * f));
        const empreinte = empreinteWme(wme, bbox);
        prog(t('stCalc'), 0.97);
        await ceder();
        const tWme = Date.now() - t0 - tBan;
        // Filtre des certifiées figé au LANCEMENT : le changer pendant un département ne mêle pas deux règles.
        const r = Core.analyser({ adresses, contour: com.contour, emprise: com.bbox, certSeules: !!jeton.certSeules, ...wme });
        if (!jeton.departement || r.chrono.total > 300)
            log(com.nom + ' — ' + adresses.length + ' adresses' + (adresses.reserve ? ' (+ ' + adresses.reserve + ' numéros de réserve écartés)' : '') + ', ' + wme.segments.length + ' segments, ' + wme.hns.length + ' HN, ' + wme.rpps.length + ' RPP — BAN ' + tBan + ' ms, WME ' + tWme + ' ms, calcul ' + JSON.stringify(r.chrono));
        r.commune = com;
        r.memo = { date: Date.now(), cert: !!jeton.certSeules, etag: adresses.etag || '', wme: empreinte, bbox };
        return r;
    }


    let calqueOk = false;

    // Carte du département : classes FIXES resserrées vers le bas ; la rampe garde teinte et saturation et vise cinq LUMINANCES
    // (à clarté égale, le jaune est bien plus lumineux que le bleu). Posée sous le calque des points.
    const LAYER_COM = 'wbc-communes';
    const BORNES_COUV = [0.05, 0.10, 0.25, 0.50];
    const libelleClasse = i => [0, 5, 10, 25, 50, 100][i] + '-' + [0, 5, 10, 25, 50, 100][i + 1] + '%';
    const LUMINANCES_COUV = [0.52, 0.29, 0.155, 0.08, 0.038];
    const luminance = hex => {
        const n = parseInt(hex.slice(1), 16);
        const v = [16, 8, 0].map(k => { const x = ((n >> k) & 255) / 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
        return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
    };
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
            const viser = y => { let a = 0, b = 1; for (let k = 0; k < 24; k++) { const m = (a + b) / 2; if (luminance(deTsl(h, sat, m)) < y) a = m; else b = m; } return deTsl(h, sat, (a + b) / 2); };
            rampeMemo = { base, l: LUMINANCES_COUV.map(viser) };
        }
        return rampeMemo.l;
    };
    const ZOOM_CLIC_MAX = 13;
    const ZOOM_ETIQUETTES = 11;
    const classeCouv = T => !T || !T.ban ? -1 : BORNES_COUV.filter(b => T.presents / T.ban >= b).length;
    let calqueComOk = false, communesSig = '';
    // ⚠️ SDK async : opérations sur les calques UNE PAR UNE, sinon vider/ajouter entrelacés doublent les points.
    let fileCalques = Promise.resolve();
    const enFile = travail => { fileCalques = fileCalques.then(travail, travail); return fileCalques; };
    async function poserCalqueCommunes() {
        try {
            const pr = f => (f && f.properties) || {};
            await sdk.Map.addLayer({
                layerName: LAYER_COM,
                styleContext: {
                    fond: ({ feature }) => pr(feature).classe >= 0 ? teintesCouv()[pr(feature).classe] : '#9e9e9e',
                    lisere: () => assombrir(couleur('carte'), 0.3),
                    opa: ({ feature }) => pr(feature).classe >= 0 ? 0.55 : 0.2,
                    lbl: ({ feature, zoomLevel }) => zoomLevel == null || zoomLevel >= ZOOM_ETIQUETTES ? pr(feature).lbl || '' : '',
                    trait: ({ feature }) => pr(feature).maj ? '#fb8c00' : '#ffffff',
                    ep: ({ feature }) => pr(feature).maj ? 3 : 1,
                },
                styleRules: [{ style: { fillColor: '${fond}', fillOpacity: '${opa}', strokeColor: '${trait}', strokeWidth: '${ep}', strokeOpacity: 0.9,
                    label: '${lbl}', fontColor: '#ffffff', fontSize: '11px', fontWeight: 'bold', labelOutlineColor: '${lisere}', labelOutlineWidth: 3, pointerEvents: 'none' } }],
            });
            calqueComOk = true;
        } catch (e) { log('calque des communes : ' + e.message); }
    }
    // Contour administratif de la commune affichée (geo.api.gouv.fr, déjà lu pour l'analyse) : trait seul, ne capte pas les clics.
    const LAYER_CONTOUR = 'wbc-contour';
    let calqueContourOk = false, contourSig = '';
    async function poserCalqueContour() {
        try {
            await sdk.Map.addLayer({ layerName: LAYER_CONTOUR,
                styleRules: [{ style: { fillOpacity: 0, strokeColor: '#4a148c', strokeWidth: 3, strokeOpacity: 0.9, strokeDashstyle: 'dash', pointerEvents: 'none' } }] });
            calqueContourOk = true;
        } catch (e) { log('calque du contour : ' + e.message); }
    }
    function majContour() {
        if (!calqueContourOk) return;
        const c = opts.contour && resultat && resultat.commune && resultat.commune.contour ? resultat.commune : null;
        const sig = c ? c.code : '';
        if (sig === contourSig) return;
        contourSig = sig;
        enFile(async () => {
            try {
                await sdk.Map.removeAllFeaturesFromLayer({ layerName: LAYER_CONTOUR });
                if (!c) return;
                // Le SDK refuse les MultiPolygon : un Polygon par morceau.
                const pgs = c.contour.type === 'MultiPolygon' ? c.contour.coordinates.map(x => ({ type: 'Polygon', coordinates: x })) : [c.contour];
                await sdk.Map.addFeaturesToLayer({ layerName: LAYER_CONTOUR, features: pgs.map((g, k) => ({ type: 'Feature', id: 'wbc-ct' + c.code + '-' + k, geometry: g, properties: {} })) });
            } catch (e) { log('contour : ' + e.message); if (contourSig === sig) contourSig = '?'; }
        });
    }
    const communesVisibles = () => !!(resDep && !resultat && opts.carteDep);
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
            // 🔴 Le SDK refuse les MultiPolygon et rejette alors TOUT le lot : un Polygon par morceau.
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
    const pastille = etat => '<span class="wbc-pt" style="background:' + couleur(etat) + '"></span>';
    const COULEURS_DEF = { manquant: '#e53935', present: '#43a047', trop: '#fb8c00', carte: '#2a78d6', pose: '#00838f' };
    // Adresse BAN de la vue, sans analyse : neutre ; cerclée de la couleur « présent » quand WME a déjà le même numéro (voir marquerPresents).
    const COULEUR_DIRECT = '#546e7a';
    const HEX_RE = /^#[0-9a-f]{6}$/i;
    const couleur = etat => { const c = opts.couleurs && opts.couleurs[etat]; return HEX_RE.test(c || '') ? c : COULEURS_DEF[etat]; };
    function assombrir(hex, f) {
        const n = parseInt(hex.slice(1), 16);
        const c = k => Math.round(((n >> k) & 255) * f).toString(16).padStart(2, '0');
        return '#' + c(16) + c(8) + c(0);
    }
    // Numéros des RPP : calque d'étiquettes seules, lu dans le modèle de WME (RPP chargés à partir du zoom 17, en attente compris).
    const LAYER_RPP = 'wbc-rpp-numeros';
    let calqueRppOk = false, majRppPrevue = null;
    async function poserCalqueRpp() {
        try {
            await sdk.Map.addLayer({
                layerName: LAYER_RPP,
                styleContext: { lbl: ({ feature }) => (feature && feature.properties && feature.properties.lbl) || '' },
                styleRules: [{ style: { pointRadius: 1, fillOpacity: 0, strokeOpacity: 0, label: '${lbl}', fontSize: '11px', fontWeight: 'bold',
                    fontColor: '#4a148c', labelOutlineColor: '#ffffff', labelOutlineWidth: 3, labelYOffset: -16 } }],
            });
            calqueRppOk = true;
        } catch (e) { log('calque des RPP : ' + e.message); }
    }
    function majRpp() {
        if (majRppPrevue) return;
        majRppPrevue = setTimeout(() => { majRppPrevue = null; enFile(dessinerRpp); }, 400);
    }
    async function dessinerRpp() {
        if (!calqueRppOk) return;
        try {
            await sdk.Map.removeAllFeaturesFromLayer({ layerName: LAYER_RPP });
            if (!opts.numRpp || (await sdk.Map.getZoomLevel()) < 17) return;
            const ext = await sdk.Map.getMapExtent();
            const features = [];
            for (const v of (await sdk.DataModel.Venues.getAll()) || []) {
                if (!v || !v.isResidential || !v.geometry || v.geometry.type !== 'Point') continue;
                const [lon, lat] = v.geometry.coordinates;
                if (ext && (lon < ext[0] || lon > ext[2] || lat < ext[1] || lat > ext[3])) continue;
                let num = '';
                try { num = String(((await sdk.DataModel.Venues.getAddress({ venueId: String(v.id) })) || {}).houseNumber || '').trim(); } catch (e) { }
                if (num) features.push({ type: 'Feature', id: 'wbc-rpp-' + v.id, geometry: { type: 'Point', coordinates: [lon, lat] }, properties: { lbl: num } });
            }
            if (features.length) await sdk.Map.addFeaturesToLayer({ layerName: LAYER_RPP, features });
        } catch (e) { log('numéros des RPP : ' + e.message); }
    }

    async function poserCalque() {
        try {
            const texte = { fontSize: '11px', fontWeight: 'bold', labelYOffset: -13, labelOutlineColor: '#ffffff', labelOutlineWidth: 3, label: '${lbl}' };
            const etat = f => (f && f.properties && f.properties.etat) || 'manquant';
            const pt = { fillColor: '${coul}', fillOpacity: 0.95, strokeColor: '#ffffff', strokeWidth: 2, fontColor: '${coulTexte}' };
            await sdk.Map.addLayer({
                layerName: LAYER,
                styleContext: {
                    lbl: ({ feature }) => (feature && feature.properties && feature.properties.lbl) || '',
                    coul: ({ feature }) => couleur(etat(feature) === 'lien' ? 'present' : etat(feature) === 'lienManq' ? 'manquant' : etat(feature)),
                    coulTexte: ({ feature }) => assombrir(couleur(etat(feature)), 0.6),
                },
                styleRules: [
                    { predicate: p => p.etat === 'manquant', style: Object.assign({ pointRadius: 6 }, pt, texte) },
                    { predicate: p => p.etat === 'present', style: Object.assign({ pointRadius: 5 }, pt, texte) },
                    { predicate: p => p.etat === 'trop', style: Object.assign({ pointRadius: 6 }, pt, texte) },
                    { predicate: p => p.etat === 'pose', style: Object.assign({}, texte, { pointRadius: 15, fillColor: '#00e5ff', fillOpacity: 0.3,
                        strokeColor: '#00838f', strokeWidth: 4, strokeOpacity: 1, fontColor: '#006064', labelYOffset: -24 }) },
                    { predicate: p => p.etat === 'lien', style: { strokeColor: '${coul}', strokeWidth: 2, strokeOpacity: 0.9, strokeDashstyle: 'dash' } },
                    { predicate: p => p.etat === 'lienManq', style: { strokeColor: '${coul}', strokeWidth: 2, strokeOpacity: 0.85, strokeDashstyle: 'dot' } },
                    { predicate: p => p.etat === 'lienArret', style: { strokeColor: '#e65100', strokeWidth: 3, strokeOpacity: 0.9, strokeDashstyle: 'solid' } },
                ],
            });
            calqueOk = true;
        } catch (e) { log('calque : ' + e.message); }
        appliquerVisibilite();
    }
    // Les points d'une analyse ne se voient que fenêtre OUVERTE (ou après un Ctrl+clic sur le bouton de carte), sauf les numéros
    // posés en attente. La case du menu Calques est retenue d'une session à l'autre ; l'événement vaut pour tout calque : relire NOTRE case.
    let calqueVisible = false;
    // Commune analysée par Ctrl+clic sur le bouton de carte : ses points se voient fenêtre fermée, jusqu'à la prochaine ouverture de la fenêtre.
    let carteSeule = false;
    const fenetreOuverte = () => !!(ovEl && ovEl.classList.contains('open'));
    const aDesPoses = () => !!resultat && resultat.voies.some(v => v.adresses.some(a => a.hnPose && (!a.trouve || a.rppHn || a.hnVersRpp)));
    const calqueAffiche = () => calqueVisible && (fenetreOuverte() || carteSeule);
    function appliquerVisibilite() {
        const vis = calqueAffiche(), visAdr = calqueVisible && (fenetreOuverte() || carteSeule || aDesPoses());
        enFile(async () => {
            try { await sdk.Map.setLayerVisibility({ layerName: LAYER, visibility: visAdr }); } catch (e) { }
            try { await sdk.Map.setLayerVisibility({ layerName: LAYER_COM, visibility: vis }); } catch (e) { }
            if (calqueContourOk) { try { await sdk.Map.setLayerVisibility({ layerName: LAYER_CONTOUR, visibility: vis }); } catch (e) { } }
        });
        if (!vis) cacherFiche();
        majCalque();
        demanderDirect(true);
    }
    async function poserCaseCalque() {
        try {
            calqueVisible = !!opts.calque;
            await sdk.LayerSwitcher.addLayerCheckbox({ name: SCRIPT_NAME });
            await sdk.LayerSwitcher.setLayerCheckboxChecked({ name: SCRIPT_NAME, isChecked: calqueVisible });
            sdk.Events.on({ eventName: 'wme-layer-checkbox-toggled', eventHandler: async () => {
                let etat;
                try { etat = await sdk.LayerSwitcher.isLayerCheckboxChecked({ name: SCRIPT_NAME }); } catch (e) { return; }
                if (etat === calqueVisible) return;
                calqueVisible = etat;
                opts.calque = etat;
                ecrireOpts();
                appliquerVisibilite();
            } });
        } catch (e) { log('case de calque : ' + e.message); }
        appliquerVisibilite();
    }
    // Une analyse qu'on vient d'afficher ou de demander : la case se coche pour qu'on en voie les points.
    async function cocherCalque() {
        if (calqueVisible) return;
        calqueVisible = true;
        opts.calque = true;
        ecrireOpts();
        try { await sdk.LayerSwitcher.setLayerCheckboxChecked({ name: SCRIPT_NAME, isChecked: true }); } catch (e) { log('case de calque : ' + e.message); }
        appliquerVisibilite();
    }

    // ==WBC-DIRECT== — adresses BAN de la vue, sans analyse (voir tools/banc-direct.js).
    // Case WBC cochée et aucune analyse affichée sur la vue : les adresses de la vue, en lecture seule, lues sur le WFS de la
    // Géoplateforme par EMPRISE (la couche est indexée dans l'espace, pas par commune), à partir du zoom DIRECT_ZOOM.
    // Seule l'emprise part, sans cookie. La vue est lue DIRECT_ATTENTE_MS après le dernier mouvement ; une emprise lue resservira
    // tant qu'elle contient la vue (DIRECT_CACHE_MS) ; une réponse arrivée après un autre mouvement est gardée, jamais dessinée.
    const DIRECT_ZOOM = 18;               // vue de centre-ville dense, marges comprises : ~1 000 adresses, une seule page
    const DIRECT_ATTENTE_MS = 600;
    const DIRECT_MARGE = 0.25;            // de chaque côté : un petit déplacement reste dans l'emprise lue
    const DIRECT_PAGE = 5000;             // plafond de page du serveur ; un COUNT plus grand est ramené à 5 000 sans erreur
    const DIRECT_PAGES = 2;               // au-delà : plafond atteint, signalé
    const DIRECT_DESSIN_MAX = 3000;       // points dessinés au plus (un sur k au-delà, signalé)
    const DIRECT_CACHE_N = 12;
    const DIRECT_CACHE_MS = 10 * 60 * 1000;
    const DIRECT_WFS = 'https://data.geopf.fr/wfs/ows';
    const DIRECT_CHAMPS = 'id,numero,rep,nom_voie,nom_commune,nom_ancienne_commune,certification_commune,geom';
    const CLE_EDITION = 'wbc.banEdition';
    function urlDirect(bb, debut) {
        return DIRECT_WFS + '?' + new URLSearchParams({
            SERVICE: 'WFS', VERSION: '2.0.0', REQUEST: 'GetFeature', TYPENAMES: 'BAN.DATA.GOUV:ban', OUTPUTFORMAT: 'application/json',
            // Forme courte EPSG:4326 = longitude d'abord ; dans l'autre ordre, le serveur rend 0 adresse sans erreur.
            BBOX: bb.map(x => x.toFixed(6)).join(',') + ',EPSG:4326',
            PROPERTYNAME: DIRECT_CHAMPS, COUNT: String(DIRECT_PAGE), STARTINDEX: String(debut),
            // Tri stable : sans lui, l'ordre d'une page à l'autre n'est pas garanti.
            SORTBY: 'id',
        });
    }
    // La vue élargie de DIRECT_MARGE, arrondie vers l'extérieur au millième de degré (~100 m) : des vues voisines demandent la même emprise.
    function emprisePour(ext) {
        const dx = (ext[2] - ext[0]) * DIRECT_MARGE, dy = (ext[3] - ext[1]) * DIRECT_MARGE;
        const bas = x => Math.floor(x * 1000 + 1e-9) / 1000, haut = x => Math.ceil(x * 1000 - 1e-9) / 1000;
        return [bas(ext[0] - dx), bas(ext[1] - dy), haut(ext[2] + dx), haut(ext[3] + dy)];
    }
    const contient = (bb, ext) => bb[0] <= ext[0] && bb[1] <= ext[1] && bb[2] >= ext[2] && bb[3] >= ext[3];
    let cacheDirect = [];                 // { bb, t, res }, le plus récent d'abord
    const enVolDirect = [];               // { bb, p } : une emprise déjà demandée qui contient la vue n'est pas redemandée
    function directEnCache(ext, maintenant) {
        cacheDirect = cacheDirect.filter(c => maintenant - c.t < DIRECT_CACHE_MS);
        return cacheDirect.find(c => contient(c.bb, ext)) || null;
    }
    // JSON attendu avec ses compteurs ; tout autre contenu (page d'erreur servie en 200, exception XML) est un défaut de FORMAT.
    async function pageDirect(bb, debut) {
        const txt = await gmDirect(urlDirect(bb, debut));
        let j;
        try { j = JSON.parse(txt); } catch (e) { throw errFormat('ban'); }
        if (!j || !Array.isArray(j.features) || typeof j.numberMatched !== 'number' || typeof j.numberReturned !== 'number') throw errFormat('ban');
        return j;
    }
    async function lireDirect(bb) {
        const parId = new Map();
        let total = 0, vus = 0;
        for (let k = 0; k < DIRECT_PAGES; k++) {
            const j = await pageDirect(bb, k * DIRECT_PAGE);
            total = j.numberMatched;
            vus += j.numberReturned;
            for (const f of j.features) {
                const p = f && f.properties, c = f && f.geometry && f.geometry.coordinates;
                if (!p || !Array.isArray(c) || typeof c[0] !== 'number' || typeof c[1] !== 'number') throw errFormat('ban');
                // 99999 : voie ou lieu-dit sans numéro, pas une adresse.
                if (String(p.numero) === '99999') continue;
                // Une même adresse peut revenir deux fois : dédoublonnée par id.
                parId.set(p.id, { lon: c[0], lat: c[1], num: String(p.numero || '') + (p.rep ? ' ' + p.rep : ''), n: String(p.numero || ''), rep: String(p.rep || ''), voie: String(p.nom_voie || ''),
                    commune: String(p.nom_commune || ''), ancienne: String(p.nom_ancienne_commune || ''), cert: String(p.certification_commune) === '1' });
            }
            if (!j.numberReturned || vus >= total) break;
        }
        return { adresses: [...parId.values()], total, tronque: vus < total };
    }
    function lireEmprise(ext, bb) {
        const vol = enVolDirect.find(v => contient(v.bb, ext));
        if (vol) return vol.p;
        const p = lireDirect(bb).then(res => {
            cacheDirect.unshift({ bb, t: Date.now(), res });
            if (cacheDirect.length > DIRECT_CACHE_N) cacheDirect.length = DIRECT_CACHE_N;
            return res;
        });
        const v = { bb, p };
        enVolDirect.push(v);
        const retirer = () => { const i = enVolDirect.indexOf(v); if (i >= 0) enVolDirect.splice(i, 1); };
        p.then(retirer, retirer);
        return p;
    }
    // Chaque mouvement ou changement d'état invalide ce qui est en cours ; seul le dernier dessine.
    let generationDirect = 0, minuteurDirect = null;
    function demanderDirect(immediat) {
        const moi = ++generationDirect;
        clearTimeout(minuteurDirect);
        minuteurDirect = setTimeout(() => { majDirect(moi).catch(e => log('BAN de la vue : ' + e.message)); }, immediat ? 0 : DIRECT_ATTENTE_MS);
    }
    async function majDirect(moi) {
        const perime = () => moi !== generationDirect;
        let z = null, ext = null;
        try { z = await sdk.Map.getZoomLevel(); ext = await sdk.Map.getMapExtent(); } catch (e) { }
        if (perime()) return;
        if (!ext || !directVoulu(ext)) { dessinerDirect([]); afficherEtatDirect(null); return; }
        // Un département affiché fenêtre ouverte se regarde de loin : l'invite à zoomer n'y a pas de sens.
        if (z == null || z < DIRECT_ZOOM) { dessinerDirect([]); afficherEtatDirect(!resultat && resDep && fenetreOuverte() ? null : { etat: 'zoom' }); return; }
        lireEditionBan();
        const c = directEnCache(ext, Date.now());
        let res = c && c.res;
        if (!res) {
            afficherEtatDirect({ etat: 'lecture' });
            try { res = await lireEmprise(ext, emprisePour(ext)); }
            catch (e) { if (perime()) return; dessinerDirect([]); afficherEtatDirect({ etat: 'erreur', erreur: e }); return; }
            if (perime()) return;
        }
        let pts = res.adresses.filter(a => a.lon >= ext[0] && a.lon <= ext[2] && a.lat >= ext[1] && a.lat <= ext[3]);
        const dansVue = pts.length;
        if (dansVue > DIRECT_DESSIN_MAX) { const k = Math.ceil(dansVue / DIRECT_DESSIN_MAX); pts = pts.filter((a, i) => i % k === 0); }
        // Lecture de WME en échec : les points restent gris, sans rien affirmer.
        pts.forEach(a => { a.dansWme = undefined; });
        let presents = null;
        if (pts.length) { try { presents = await marquerPresents(pts, ext); } catch (e) { pts.forEach(a => { a.dansWme = undefined; }); log('BAN de la vue, numéros de WME : ' + e.message); } }
        if (perime()) return;
        dessinerDirect(pts);
        afficherEtatDirect(res.tronque ? { etat: 'plafond', n: res.adresses.length, total: res.total, p: presents }
            : pts.length < dansVue ? { etat: 'plafond', n: pts.length, total: dansVue, p: presents }
                : { etat: dansVue ? 'ok' : 'vide', n: dansVue, p: presents });
    }
    // Date d'édition de la couche, lue au plus une fois par jour (GetCapabilities restreint à la BAN, ~120 Ko).
    let editionBan = '', editionDemandee = false;
    function lireEditionBan() {
        if (editionDemandee) return;
        editionDemandee = true;
        try { const m = JSON.parse(localStorage.getItem(CLE_EDITION) || 'null'); if (m && m.date && Date.now() - m.t < 864e5) { editionBan = m.date; return; } } catch (e) { }
        gmDirect(DIRECT_WFS + '?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetCapabilities&NAMESPACE=BAN.DATA.GOUV').then(x => {
            const m = /BAN\.DATA\.GOUV:ban<\/Name>[\s\S]{0,400}?dition (\d{4}-\d{2}-\d{2})/.exec(x || '');
            if (!m) return;
            editionBan = m[1];
            try { localStorage.setItem(CLE_EDITION, JSON.stringify({ date: editionBan, t: Date.now() })); } catch (e) { }
            if (etatDirectVu) afficherEtatDirect(etatDirectVu);
        }).catch(e => log('édition de la BAN : ' + e.message));
    }
    // Déjà dans WME : même numéro (normNum) ET même nom de voie (principal ou alternatif du segment, rue du RPP),
    // ou à moins de DIRECT_PROCHE_M quel que soit le nom — les règles 1 et 3 de l'analyse. Lu sur ce que WME a chargé autour
    // de la vue : numéros ENREGISTRÉS des segments (fetchHouseNumbers relit le serveur ; un numéro tapé et pas encore enregistré
    // n'y est pas : il compte après l'enregistrement) et RPP du modèle, en attente compris. Aucune requête vers un tiers.
    const DIRECT_PROCHE_M = 30;
    const DIRECT_RAYON_M = 150;           // même nom mais plus loin : une autre adresse
    const DIRECT_AUTOUR = 0.0014;         // ~150 m autour de la vue : un numéro dont le marqueur déborde est vu
    const hnDirect = new Map();           // segment → [{ num, pt }] enregistrés ; vidé à chaque enregistrement
    const DIRECT_RELIRE_MS = 4000;       // 2e relecture après un enregistrement
    let relireDirect = null;
    async function numerosWme(ext) {
        const dLat = DIRECT_AUTOUR, dLon = dLat / Math.cos((ext[1] + ext[3]) / 2 * Math.PI / 180);
        const dans = (x, y) => x >= ext[0] - dLon && x <= ext[2] + dLon && y >= ext[1] - dLat && y <= ext[3] + dLat;
        const segs = ((await sdk.DataModel.Segments.getAll()) || []).filter(sg => { const c = sg && sg.geometry && sg.geometry.coordinates; return !!c && c.some(([x, y]) => dans(x, y)); });
        if (hnDirect.size > 20000) hnDirect.clear();
        // Par lots de 250 : au-delà de ~500 segments, l'appel est rejeté.
        const aLire = segs.map(sg => sg.id).filter(id => !hnDirect.has(id));
        for (let k = 0; k < aLire.length; k += 250) {
            const lot = aLire.slice(k, k + 250);
            const r = await sdk.DataModel.HouseNumbers.fetchHouseNumbers({ segmentIds: lot });
            lot.forEach(id => hnDirect.set(id, []));
            for (const h of r || []) if (hnDirect.has(h.segmentId)) hnDirect.get(h.segmentId).push({ num: Core.normNum(h.number), pt: (h.geometry && h.geometry.coordinates) || null });
        }
        const out = [];
        for (const sg of segs) {
            const l = hnDirect.get(sg.id) || [];
            if (!l.length) continue;
            const noms = new Set();
            try {
                const ad = (await sdk.DataModel.Segments.getAddress({ segmentId: sg.id })) || {};
                if (ad.street && ad.street.name) noms.add(Core.normNom(ad.street.name));
                for (const x of ad.altStreets || []) if (x && x.street && x.street.name) noms.add(Core.normNom(x.street.name));
            } catch (e) { }
            for (const h of l) out.push({ num: h.num, noms, pt: h.pt });
        }
        for (const v of (await sdk.DataModel.Venues.getAll()) || []) {
            if (!v || !v.isResidential || !v.geometry) continue;
            let pt = v.geometry.coordinates;
            if (v.geometry.type === 'Polygon') { const a = pt[0]; pt = [a.reduce((x, q) => x + q[0], 0) / a.length, a.reduce((x, q) => x + q[1], 0) / a.length]; }
            if (!pt || !dans(pt[0], pt[1])) continue;
            let ad = null;
            try { ad = await sdk.DataModel.Venues.getAddress({ venueId: String(v.id) }); } catch (e) { }
            if (!ad || !ad.houseNumber) continue;
            out.push({ num: Core.normNum(ad.houseNumber), noms: new Set(ad.street && ad.street.name ? [Core.normNom(ad.street.name)] : []), pt });
        }
        return out;
    }
    async function marquerPresents(pts, ext) {
        const parNum = new Map();
        for (const w of await numerosWme(ext)) { if (!w.num) continue; const l = parNum.get(w.num); if (l) l.push(w); else parNum.set(w.num, [w]); }
        // Comme l'analyse : couples tranchés règle par règle (nom d'abord), puis au plus près ; un numéro de WME ne sert qu'UNE fois
        // (sinon un « 5 » à l'angle de deux rues cerclerait les deux « 5 » de la BAN).
        const couples = [];
        for (const a of pts) {
            a.dansWme = false;
            const k = Math.cos(a.lat * Math.PI / 180) * 111320, nom = Core.normNom(a.voie);
            for (const w of parNum.get(Core.normNum(a.n, a.rep)) || []) {
                const dm = w.pt ? Math.hypot((w.pt[0] - a.lon) * k, (w.pt[1] - a.lat) * 111320) : Infinity;
                const regle = !!nom && w.noms.has(nom) && (!w.pt || dm <= DIRECT_RAYON_M) ? 1 : dm <= DIRECT_PROCHE_M ? 3 : 0;
                if (regle) couples.push({ a, w, regle, dm });
            }
        }
        couples.sort((p, q) => p.regle - q.regle || p.dm - q.dm);
        const pris = new Set();
        let n = 0;
        for (const c of couples) {
            if (c.a.dansWme || pris.has(c.w)) continue;
            c.a.dansWme = true;
            pris.add(c.w);
            n++;
        }
        return n;
    }
    // ==/WBC-DIRECT==

    // L'emprise d'un résultat : celle de la commune, à défaut celle de ses adresses.
    const empriseRes = new WeakMap();
    function empriseResultat(r) {
        if (!empriseRes.has(r)) {
            let b = r.commune && Array.isArray(r.commune.bbox) ? r.commune.bbox : null;
            if (!b) {
                b = [Infinity, Infinity, -Infinity, -Infinity];
                for (const v of r.voies) for (const a of v.adresses) { b[0] = Math.min(b[0], a.lon); b[1] = Math.min(b[1], a.lat); b[2] = Math.max(b[2], a.lon); b[3] = Math.max(b[3], a.lat); }
                if (!(b[0] <= b[2])) b = null;
            }
            empriseRes.set(r, b);
        }
        return empriseRes.get(r);
    }
    // L'affichage d'une analyse prime : pas d'adresses de la vue là où ses points se voient (pas de doublon).
    function analyseCouvre(ext) {
        if (!resultat || !calqueVisible || !(fenetreOuverte() || carteSeule || aDesPoses())) return false;
        const b = empriseResultat(resultat);
        return !!b && b[0] <= ext[2] && b[2] >= ext[0] && b[1] <= ext[3] && b[3] >= ext[1];
    }
    const directVoulu = ext => calqueVisible && !analyseCouvre(ext);
    const gmDirect = url => avecEssais(() => gmUneFois(url, null, false, true));
    const LAYER_DIRECT = 'wbc-ban-vue';
    let calqueDirectOk = false, pointsDirect = [];
    async function poserCalqueDirect() {
        // Déjà dans WME : gris clair cerclé de la couleur « présent » ; le gris reste celui de la BAN sans analyse.
        const gris = { pointRadius: 5, fillColor: COULEUR_DIRECT, fillOpacity: 0.95, strokeColor: '#ffffff', strokeWidth: 2,
            label: '${lbl}', fontSize: '11px', fontWeight: 'bold', fontColor: assombrir(COULEUR_DIRECT, 0.6), labelYOffset: -13,
            labelOutlineColor: '#ffffff', labelOutlineWidth: 3, pointerEvents: 'none' };
        try {
            await sdk.Map.addLayer({
                layerName: LAYER_DIRECT,
                styleContext: { lbl: ({ feature }) => (feature && feature.properties && feature.properties.lbl) || '' },
                styleRules: [{ predicate: p => !p.ok, style: gris }, { predicate: p => !!p.ok, style: Object.assign({}, gris, {
                    pointRadius: 6, fillColor: '#cfd8dc', strokeColor: couleur('present'), strokeWidth: 3 }) }],
            });
            calqueDirectOk = true;
        } catch (e) { log('calque de la BAN de la vue : ' + e.message); }
    }
    let dernierDirect = null;
    function dessinerDirect(adresses) {
        pointsDirect = adresses.map(a => ({ lon: a.lon, lat: a.lat, direct: a }));
        if (!calqueDirectOk || (!adresses.length && dernierDirect === 0)) return;
        dernierDirect = adresses.length;
        enFile(async () => {
            try {
                await sdk.Map.removeAllFeaturesFromLayer({ layerName: LAYER_DIRECT });
                if (adresses.length) await sdk.Map.addFeaturesToLayer({ layerName: LAYER_DIRECT,
                    features: adresses.map((a, i) => ({ type: 'Feature', id: 'wbc-v' + i, geometry: { type: 'Point', coordinates: [a.lon, a.lat] }, properties: { lbl: a.num, ok: a.dansWme ? 1 : 0 } })) });
            } catch (e) { log('BAN de la vue : ' + e.message); }
        });
    }
    // Ce que montre le calque, en une ligne en haut de la carte : zoom insuffisant, lecture, nombre, plafond, erreur.
    let badgeDirect = null, etatDirectVu = null;
    const dateIso = d => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d || ''); return m ? dateCourte(new Date(+m[1], +m[2] - 1, +m[3]).getTime()) : ''; };
    async function afficherEtatDirect(e) {
        etatDirectVu = e;
        if (!e) { if (badgeDirect) badgeDirect.hidden = true; return; }
        if (!badgeDirect || !document.contains(badgeDirect)) {
            let vueEl = null;
            try { vueEl = await sdk.Map.getMapViewportElement(); } catch (x) { }
            if (!vueEl || etatDirectVu !== e) return;
            if (!badgeDirect) {
                badgeDirect = document.createElement('div');
                badgeDirect.id = 'wbc-direct';
                badgeDirect.setAttribute('role', 'status');
            }
            vueEl.appendChild(badgeDirect);
        }
        const ed = dateIso(editionBan);
        const txt = e.etat === 'zoom' ? t('dirZoom', DIRECT_ZOOM) : e.etat === 'lecture' ? t('dirLoading') : e.etat === 'vide' ? t('dirNone')
            : e.etat === 'plafond' ? t('dirCap', nb(e.n), nb(e.total)) : e.etat === 'erreur' ? t('dirErr', messageErreur(e.erreur)) : t('dirCount', nb(e.n));
        badgeDirect.dir = _lang === 'he' ? 'rtl' : 'ltr';
        badgeDirect.textContent = txt + (typeof e.p === 'number' && (e.etat === 'ok' || e.etat === 'plafond') ? ', ' + t('dirWme', nb(e.p)) : '')
            + (ed && e.etat !== 'erreur' && e.etat !== 'zoom' ? ' · ' + t('dirEdition', ed) : '');
        badgeDirect.title = t('dirSource');
        badgeDirect.classList.toggle('erreur', e.etat === 'erreur' || e.etat === 'plafond');
        badgeDirect.hidden = false;
        placerBadgeDirect();
    }
    // Sous la barre du haut de la carte (commune, droits de zone) : posé à top 8 px, il la recouvrait (MisterLogik, 16/11).
    // Au chargement de WME la barre est encore VIDE (0 px) et se remplit après : mesurée à chaque affichage ET suivie par un
    // ResizeObserver, jamais moins de 40 px (mesuré le 16/11 : 0 px au premier affichage, 31 px quelques secondes après).
    let suiviBarre = null;
    function placerBadgeDirect() {
        if (!badgeDirect) return;
        try {
            const barre = document.getElementById('topbar-container'), vue = badgeDirect.parentElement;
            const bas = barre && vue ? barre.getBoundingClientRect().bottom - vue.getBoundingClientRect().top : NaN;
            badgeDirect.style.top = (bas >= 0 && bas < 200 ? Math.max(40, Math.round(bas + 6)) : 40) + 'px';
            const RO = window.ResizeObserver;
            if (barre && !suiviBarre && typeof RO === 'function') { suiviBarre = new RO(() => placerBadgeDirect()); suiviBarre.observe(barre); }
        } catch (x) { }
    }

    // Survol calculé à la main : sdk.Events.trackLayerEvents casse la sélection au cadre de WME (Ctrl+Maj+glisser).
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
            if (a.trouve) lignes.push(etiq('present', t('hovFound', a.trouve)) + (a.loin ? ' · ' + esc(t('tipFar', nb(a.dm))) : a.dm != null ? ' · ' + esc(t('hovDist', nb(a.dm))) : ''));
            if (a.trouve && arretLoin(a)) lignes.push('<span class="wbc-f-etat arret">' + esc(t('hovArret', nb(a.ea))) + '</span>');
            else if (a.hnPose) lignes.push('<span class="wbc-f-etat pose">' + esc(t('ajHnPoseTip')) + '</span>');
            else if (a.suffixe) lignes.push(etiq('suffixe', t('tipSuf', a.suffixe)));
            else if (!a.trouve) lignes.push(etiq('manquant', t('hovMissing')));
            if (!a.trouve && a.seg != null) lignes.push(esc(t('hovProbSeg', a.seg, nb(a.pd))));
            lignes.push(esc(t(a.cert ? 'hovCert' : 'hovNotCert')));
            if (v.statutNom !== 'identique' && v.nomWme) lignes.push(esc(t('hovWmeStreet', v.nomWme)));
        } else if (p.direct) {
            const d = p.direct, ed = dateIso(editionBan);
            lignes.push('<b><bdi>' + esc(d.num + ' ' + d.voie) + '</bdi></b>');
            lignes.push('<bdi>' + esc(d.commune) + (d.ancienne && d.ancienne !== d.commune ? ' (' + esc(d.ancienne) + ')' : '') + '</bdi>');
            if (d.dansWme === true) lignes.push(pastille('present') + '<span class="wbc-f-etat present">' + esc(t('dirFicheWme')) + '</span>');
            else if (d.dansWme === false) lignes.push(esc(t('dirFicheAbs')));
            lignes.push(esc(t(d.cert ? 'hovCert' : 'hovNotCert')));
            lignes.push('<small>' + esc(t('dirFiche')) + (ed ? ' · ' + esc(t('dirEdition', ed)) : '') + '</small>');
        }
        return lignes.join('<br>');
    }
    function cacherFiche() { if (fiche) fiche.hidden = true; }
    // Mouvement traité après un plus récent (SDK async) : abandonné.
    let generationSurvol = 0;
    // Le SDK prend des pixels d'ÉCRAN (clientX/clientY), sans soustraire la position de la carte.
    async function pointSous(x, y, liste) {
        const ll = await sdk.Map.getLonLatFromPixel({ x, y }), ll2 = await sdk.Map.getLonLatFromPixel({ x: x + SURVOL_PX, y });
        if (!ll || !ll2) return { ll: null, best: null };
        const kx = Math.cos(ll.lat * Math.PI / 180);
        let best = null, bd = Math.pow((ll2.lon - ll.lon) * kx, 2);
        for (const p of liste || pointsVus) {
            if (!p.ad && !p.trop && !p.direct) continue;
            const d = Math.pow((p.lon - ll.lon) * kx, 2) + Math.pow(p.lat - ll.lat, 2);
            if (d <= bd) { bd = d; best = p; }
        }
        return { ll, best };
    }
    // clic : la fiche d'une adresse de la vue s'ouvre aussi au clic, même survol coupé.
    async function surSurvol(ev, clic) {
        const direct = pointsDirect.length > 0, analyse = calqueAffiche() && (pointsVus.length > 0 || communesVisibles());
        if ((!opts.survol && !clic) || (!analyse && !direct)) { cacherFiche(); return; }
        if (bulleAdr) { cacherFiche(); return; }
        const generation = ++generationSurvol;
        let sous;
        try { sous = await pointSous(ev.clientX, ev.clientY, analyse ? (clic ? [] : pointsVus).concat(pointsDirect) : pointsDirect); } catch (e) { cacherFiche(); return; }
        if (generation !== generationSurvol) return;
        const { ll, best } = sous;
        if (!ll) { cacherFiche(); return; }
        let html = best ? htmlFiche(best) : null;
        if (!html && clic) { cacherFiche(); return; }
        if (!html && analyse) { const c = communeSous(ll); if (c) html = htmlFicheCommune(c); }
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
        const w = fiche.offsetWidth, h = fiche.offsetHeight;
        fiche.style.left = Math.max(4, Math.min(ev.clientX + 14, window.innerWidth - w - 4)) + 'px';
        fiche.style.top = Math.max(4, Math.min(ev.clientY - h - 10, window.innerHeight - h - 4)) + 'px';
    }
    // La bulle SUIT son point : sélectionner un RPP ouvre le panneau de WME, qui décale la carte et signale un déplacement sans mouvement.
    let bulle = null, bulleAdr = null, bulleLL = null, bulleXY = null, bulleZ = null;
    function fermerBulle() { if (bulle) bulle.hidden = true; bulleAdr = null; bulleLL = null; bulleXY = null; bulleZ = null; }
    const zoomCarte = () => Promise.resolve().then(() => sdk.Map.getZoomLevel()).catch(() => null);
    const pixelDe = ll => Promise.resolve().then(() => sdk.Map.getPixelFromLonLat({ lonLat: ll })).then(p => p ? [p.x, p.y] : null, () => null);
    // Mêmes contrôles, dans le même ordre, que convertirRppVoie.
    async function precontrolerRpp(a, v, i, k) {
        const r = await trouverRpp(a);
        if (!r || r.aucunLieu || !bulle || bulle.hidden || !resultat) return;
        const b = bulle.querySelector('[data-rpphn1="' + i + ':' + k + '"]');
        if (!b) return;
        const rang = (await _hp()).n;
        const motif = r.nom ? t('rhnNamed') : r.photos ? t('rhnPhoto')
            : !Core.villeHnOk(r.ville, resultat.commune.nom) ? t('rhnCity', r.ville || '—')
            : Core.nomSouple(r.rue) !== Core.nomSouple(v.nom) ? t('rhnStreet', r.rue || '—') : '';
        // RPP verrouillé au-dessus du rang : la conversion reste possible, WME en fera une suggestion à l'enregistrement.
        const note = !motif && r.verrou != null && rang >= 0 && r.verrou > rang ? t('rhnLock', r.verrou + 1) : '';
        if (!(motif || note) || !bulle.contains(b)) return;
        if (motif) b.disabled = true;
        b.title = motif || note;
        let d = bulle.querySelector('.wbc-bulle-raison');
        if (!d) { d = document.createElement('div'); d.className = 'wbc-bulle-raison'; b.parentNode.appendChild(d); }
        d.textContent = motif || note;
    }
    // Même choix de segment que le clic (passe de zone d'ajouterHnVoie), parmi les segments chargés à ~100 m ; rien n'est demandé au serveur.
    // nomSeul : bouton grisé par le seul nom WME de la voie ; rouvert si la pose partirait en RPP (qui porte sa propre adresse).
    async function precontrolerHn1(a, v, i, k, nomSeul) {
        const sel = '[data-hn1="' + i + ':' + k + '"]';
        if (!bulle || !bulle.querySelector(sel)) return;
        const dLat = 0.0009, dLon = 0.0009 / Math.cos(a.lat * Math.PI / 180);
        const pres = s => { const c = s.geometry && s.geometry.coordinates; return !!c && c.length > 1 && Math.min(...c.map(q => q[0])) <= a.lon + dLon && Math.max(...c.map(q => q[0])) >= a.lon - dLon && Math.min(...c.map(q => q[1])) <= a.lat + dLat && Math.max(...c.map(q => q[1])) >= a.lat - dLat; };
        const l = (await segmentsCharges(await idsVoieHn(v, { lon: a.lon, lat: a.lat, adresses: [a] }))).filter(pres);
        const segs = await decrireSegsHn(l);
        const b = bulle && !bulle.hidden ? bulle.querySelector(sel) : null;
        if (!b) return;
        if (nomSeul) {
            const pr = resultat ? Core.segmentProbableHn(v, a, resultat.commune.nom, segs) : null;
            if (!pr || !pr.rpp || hnEnCours) return;
            b.disabled = false;
            b.title = t('ajHn1Tip');
            const d = bulle.querySelector('.wbc-bulle-raison');
            if (d) d.remove();
            return;
        }
        // Sans droit direct : WME fera de la pose une suggestion à l'enregistrement (décision du mainteneur, 18/11/2026) ; le bouton reste actif.
        const bl = await blocageHn1(v, a, segs);
        if (!bl || b.disabled) return;
        const motif = motifHn1(bl);
        b.title = motif;
        let d = bulle.querySelector('.wbc-bulle-raison');
        if (!d) { d = document.createElement('div'); d.className = 'wbc-bulle-raison'; b.parentNode.appendChild(d); }
        d.textContent = motif;
    }
    let avis = null, avisMinuteur = null;
    function montrerAvis(txt, ou) {
        if (!avis) {
            avis = document.createElement('div');
            avis.id = 'wbc-avis';
            avis.setAttribute('role', 'alert');
            avis.addEventListener('click', () => { avis.hidden = true; });
            document.body.appendChild(avis);
        }
        avis.dir = _lang === 'he' ? 'rtl' : 'ltr';
        avis.textContent = '⚠️ ' + txt;
        avis.title = t('close');
        avis.hidden = false;
        const w = avis.offsetWidth, h = avis.offsetHeight;
        avis.style.left = Math.max(4, Math.min(ou.x, window.innerWidth - w - 4)) + 'px';
        avis.style.top = Math.max(4, Math.min(ou.y, window.innerHeight - h - 4)) + 'px';
        clearTimeout(avisMinuteur);
        avisMinuteur = setTimeout(() => { avis.hidden = true; }, 12000);
    }
    async function bulleBougee() {
        const ll = bulleLL, avant = await bulleXY, z0 = await bulleZ;
        if (!ll || ll !== bulleLL) return;
        const apres = await pixelDe(ll), z = await zoomCarte();
        if (ll !== bulleLL) return;
        if (!avant || !apres || z !== z0) { fermerBulle(); return; }
        const dx = apres[0] - avant[0], dy = apres[1] - avant[1];
        if (!dx && !dy) return;
        bulleXY = Promise.resolve(apres);
        const w = bulle.offsetWidth, h = bulle.offsetHeight;
        bulle.style.left = Math.max(4, Math.min(parseFloat(bulle.style.left) + dx, window.innerWidth - w - 4)) + 'px';
        bulle.style.top = Math.max(4, Math.min(parseFloat(bulle.style.top) + dy, window.innerHeight - h - 4)) + 'px';
    }
    function ouvrirBulle(p, cx, cy) {
        const v = p.voie, i = resultat ? resultat.voies.indexOf(v) : -1, k = i < 0 ? -1 : v.adresses.indexOf(p.ad);
        if (k < 0) return false;
        const q = Core.quotaHn(lireHorodatages(), Date.now()), rpp = droitGeste('conv') && rppConvertible(p.ad);
        const versRpp = droitGeste('conv') && !rpp && !hnPosable(p.ad) && hnConvertible(p.ad);
        if (!rpp && !versRpp && !hnPosable(p.ad)) return false;
        const raison = versRpp ? (p.ad.trouve && q.reste < 2 ? t('ajHnQuota', heureCourte(q.libre)) : '') :
            !(rpp ? v.statutNom === 'identique' : nomOkHn(v)) ? t('ajHnNoName') : !q.reste ? t('ajHnQuota', heureCourte(q.libre)) : '';
        if (!bulle) {
            bulle = document.createElement('div');
            bulle.id = 'wbc-bulle';
            bulle.setAttribute('role', 'dialog');
            document.body.appendChild(bulle);
            bulle.addEventListener('click', ev => {
                if (ev.target.closest('[data-bulle-fermer]')) { fermerBulle(); return; }
                const b = ev.target.closest('[data-hn1], [data-rpphn1], [data-hnrpp1]');
                if (!b || b.disabled || !resultat || !droitGeste(b.dataset.hn1 ? 'hn1' : 'conv') || hnEnCours) return;
                const [bi, bk] = (b.dataset.hn1 || b.dataset.rpphn1 || b.dataset.hnrpp1).split(':').map(Number);
                const ou = { x: parseFloat(bulle.style.left) || 0, y: parseFloat(bulle.style.top) || 0 };
                vue.hnMsg = null;
                fermerBulle();
                const action = b.dataset.hnrpp1 ? convertirHnRpp(bi, bk)
                    : b.dataset.rpphn1 ? (vue.curseurRpp = bi + ':' + bk, convertirRppVoie(bi, bk))
                    : (vue.curseur = bk, ajouterHnVoie(bi, bk));
                Promise.resolve(action).then(() => { const m = vue.hnMsg; if (m && m.i === bi && m.err) montrerAvis(m.txt, ou); }, () => { });
            });
        }
        bulle.dir = _lang === 'he' ? 'rtl' : 'ltr';
        const lbl = rpp ? t('rhnConv') : versRpp ? t('rhnVersRpp') : t('ajHn1');
        bulle.setAttribute('aria-label', lbl + ' ' + p.ad.brut);
        bulle.innerHTML = '<button type="button" class="wbc-bulle-x" data-bulle-fermer title="' + esc(t('close')) + '" aria-label="' + esc(t('close')) + '">&#x2715;</button>' + htmlFiche(p) +
            '<div class="wbc-bulle-act"><button type="button" class="wbc-bulle-btn' + (rpp || versRpp ? ' rpp' : '') + '" ' + (rpp ? 'data-rpphn1' : versRpp ? 'data-hnrpp1' : 'data-hn1') + '="' + i + ':' + k + '" title="' + esc(raison || t(rpp ? 'rhnConvTip' : versRpp ? 'rhnVersRppTip' : 'ajHn1Tip')) + '"' + (raison || hnEnCours ? ' disabled' : '') + '>' + (rpp || versRpp ? '&#x21C4; ' : '+ ') + esc(lbl) + '</button>' +
            (raison ? '<div class="wbc-bulle-raison">' + esc(raison) + '</div>' : '') + '</div>';
        if (rpp && !raison) precontrolerRpp(p.ad, v, i, k);
        else if (!versRpp && (!raison || raison === t('ajHnNoName'))) precontrolerHn1(p.ad, v, i, k, !!raison).catch(e => log('droit du segment : ' + e.message));
        bulle.hidden = false;
        bulleAdr = [i, k];
        const ll = { lon: p.lon, lat: p.lat };
        bulleLL = ll; bulleXY = pixelDe(ll); bulleZ = zoomCarte();
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
            // setTimeout et non requestAnimationFrame, suspendu dans un onglet en arrière-plan.
            dernier = ev;
            if (prevu) return;
            prevu = setTimeout(() => { prevu = null; surSurvol({ currentTarget: vueEl, clientX: dernier.clientX, clientY: dernier.clientY }).catch(e => log('survol : ' + e.message)); }, 30);
        }, { passive: true });
        vueEl.addEventListener('mouseleave', cacherFiche);
        vueEl.addEventListener('mousedown', cacherFiche);
        let bas = null;
        vueEl.addEventListener('mousedown', ev => { bas = ev.button === 0 ? [ev.clientX, ev.clientY] : null; }, true);
        vueEl.addEventListener('mousedown', fermerBulle);
        vueEl.addEventListener('mouseup', async ev => {
            if (!bas || ev.button !== 0 || Math.hypot(ev.clientX - bas[0], ev.clientY - bas[1]) > 4) return;
            if (pointsDirect.length) surSurvol({ clientX: ev.clientX, clientY: ev.clientY }, true).catch(e => log('fiche : ' + e.message));
            if (!calqueAffiche()) return;
            if (droitGeste('hn1') && resultat && pointsVus.length) {
                let sous = null;
                try { sous = await pointSous(ev.clientX, ev.clientY); } catch (e) { }
                if (sous && sous.best && sous.best.ad && (hnPosable(sous.best.ad) || rppConvertible(sous.best.ad) || hnConvertible(sous.best.ad)) && ouvrirBulle(sous.best, ev.clientX, ev.clientY)) return;
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
        try { sdk.Events.on({ eventName: 'wme-map-move', eventHandler: () => { cacherFiche(); bulleBougee(); } }); } catch (e) { }
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
    // WME ne charge pas les rues sous le zoom 16 ni les RPP sous le 17. Point visible : la carte ne se déplace pas,
    // sous le zoom 17 elle zoome en gardant le point à la même place à l'écran ; point hors de la vue : recentrage.
    async function assurerVue(lon, lat) {
        let ext = null, zoom = 0, c = null;
        try { ext = await sdk.Map.getMapExtent(); zoom = await sdk.Map.getZoomLevel(); c = await sdk.Map.getMapCenter(); } catch (e) { }
        const dedans = !!ext && lon >= ext[0] && lon <= ext[2] && lat >= ext[1] && lat <= ext[3];
        if (dedans && zoom >= 17) return false;
        const k = Math.pow(2, zoom - 17);
        const lonLat = dedans && c ? { lon: lon + (c.lon - lon) * k, lat: lat + (c.lat - lat) * k } : { lon, lat };
        await sdk.Map.setMapCenter({ lonLat, zoomLevel: Math.max(17, zoom) });
        await new Promise(r => setTimeout(r, 2500));
        return true;
    }
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
    // Fonction PURE (tools/banc-cadrage.js), en Mercator : en degrés le zoom tomberait faux. Zoom entier (WME arrondit).
    function cadrageVisible(bbox, zone, ext, zoom, zMin, zMax) {
        const R = 6378137, rad = Math.PI / 180;
        const mx = lon => R * lon * rad, my = lat => R * Math.log(Math.tan(Math.PI / 4 + Math.max(-85, Math.min(85, lat)) * rad / 2));
        const lonDe = x => x / R / rad, latDe = y => (2 * Math.atan(Math.exp(y / R)) - Math.PI / 2) / rad;
        const rc = zone.rc, W = rc.right - rc.left, H = rc.bottom - rc.top;
        const lv = Math.max(zone.d - zone.g, 50), hv = Math.max(zone.b - zone.h, 50);
        // Mètres Mercator par pixel au zoom actuel.
        const uAct = (mx(ext[2]) - mx(ext[0])) / W;
        const x0 = mx(bbox[0]), x1 = mx(bbox[2]), y0 = my(bbox[1]), y1 = my(bbox[3]);
        const uVoulu = Math.max((x1 - x0) / lv, (y1 - y0) / hv, 1e-3) * 1.16;
        const z = Math.max(zMin, Math.min(zMax, zoom + Math.floor(Math.log2(uAct / uVoulu))));
        const u = uAct * Math.pow(2, zoom - z);
        // L'axe Y de l'écran descend, le Mercator monte.
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
    let cadrageNo = 0;
    async function cadrerChoix(type, code) {
        const no = ++cadrageNo;
        try {
            const b = await attendre(pays.emprise(type, code));
            if (b && no === cadrageNo) cadrer(b);
        } catch (e) { log('cadrage : ' + e.message); }
    }


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
#wbc-fab-btn { position: relative; }
#wbc-fab-btn.wbc-occupe svg { animation: wbc-roue 1.1s linear infinite; }
#wbc-fab-btn.wbc-echec::after { content: '!'; position: absolute; top: -3px; inset-inline-end: -3px; width: 15px; height: 15px; border-radius: 50%;
    background: #c62828; color: #fff; font: 700 11px/15px Rubik, Arial, sans-serif; text-align: center; box-shadow: 0 0 0 2px #fff; }
@keyframes wbc-pouls { 50% { opacity: .35; } }
@media (prefers-reduced-motion: reduce) { #wbc-fab-btn.wbc-occupe svg { animation: wbc-pouls 1.6s ease-in-out infinite; } }
#wbc-direct { position: absolute; top: 40px; inset-inline-start: 8px; z-index: 1000; max-width: calc(100% - 140px); padding: 3px 10px;
    border-radius: 50px; background: rgba(255,255,255,.94); color: #37474f; font: 600 11.5px/1.4 Rubik, 'Open Sans', sans-serif;
    box-shadow: 0 1px 4px rgba(0,0,0,.3); pointer-events: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#wbc-direct.erreur { background: #fff3e0; color: #8a2e00; }
#wbc-direct[hidden] { display: none; }
#wbc-fab-btn:focus-visible { outline: 2px solid var(--wbc-blue); outline-offset: 2px; }

/* WME Studio, thème sombre : ses variables, avec repli. */
html:is([data-wme-studio-theme="dark"],[data-wme-studio-theme="black"]) #wbc-sidebar { color: var(--wme-studio-text, #e8eaed); }
html:is([data-wme-studio-theme="dark"],[data-wme-studio-theme="black"]) #wbc-sidebar :is(p,td,th,li,label,b,strong,bdi,dd,dt):not([class]) { color: inherit; }
html:is([data-wme-studio-theme="dark"],[data-wme-studio-theme="black"]) #wbc-sidebar :is([class*="hint"],[class*="note"],[class*="-ver"],[class*="foot"],[class*="links"],[class*="meta"],[class*="-lbl"]) { color: var(--wme-studio-text-secondary, #b6c0ca); }
html:is([data-wme-studio-theme="dark"],[data-wme-studio-theme="black"]) #wbc-sidebar :is(h2,[class*="-sec"]:not(button),[class*="sb-on"]) { color: #64b5f6; }
html:is([data-wme-studio-theme="dark"],[data-wme-studio-theme="black"]) #wbc-sidebar :is([class*="btn-neutral"],[class*="btn-sec"],[class*="chip"],[class*="help-hdr"],[class*="aide-h"],[class*="hist-row"],kbd,select,input:not([type=checkbox]):not([type=radio])) { background: var(--wme-studio-input, #3a3f44); color: var(--wme-studio-text, #e8eaed); border-color: var(--wme-studio-border, #4a5056); }
html:is([data-wme-studio-theme="dark"],[data-wme-studio-theme="black"]) #wbc-sidebar :is([class*="help-hdr"],[class*="aide-h"]).on { background: var(--wme-studio-hover, #454b52); color: var(--wme-studio-text, #e8eaed); }
html:is([data-wme-studio-theme="dark"],[data-wme-studio-theme="black"]) #wbc-sidebar :is([class*="help-body"],[class*="aide-c"]) { color: var(--wme-studio-text, #e8eaed); }
#wbc-sidebar { padding: 10px 12px; font-family: 'Rubik','Open Sans',sans-serif; font-size: 12px; color: var(--wbc-text); }
#wbc-sidebar h2 { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; color: #1976d2; margin: 0 0 8px; }
#wbc-sidebar h2 .wbc-sb-ico { display: inline-flex; }
#wbc-sidebar h2 .wbc-sb-ver { font-size: 11px; font-weight: 400; color: #566372; }
.wbc-sb-hint { font-size: 11px; color: var(--wbc-text2); line-height: 1.6; margin: 0; }
.wbc-sb-sec { font-size: 11px; font-weight: 700; color: #1976d2; text-transform: uppercase; letter-spacing: .05em; margin: 14px 0 6px; }
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
.wbc-sb-foot { margin-top: 10px; font-size: 11px; color: #566372; line-height: 1.6; }
.wbc-sb-foot a { color: var(--wbc-blue-dk); }
/* Rappel de responsabilité : modale sur le body, au-dessus de la fenêtre, des bulles et des avis ; en-tête de la fenêtre. */
#wbc-rappel { position: fixed; inset: 0; z-index: 10070; display: flex; align-items: center; justify-content: center; padding: 16px; box-sizing: border-box; background: rgba(38,50,56,.28); }
#wbc-rappel .wbc-rp { width: 380px; max-width: 100%; max-height: 100%; overflow: auto; box-sizing: border-box; background: #fff; border: 1px solid var(--wbc-border);
    border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,.22), 0 2px 8px rgba(0,0,0,.12); font-family: 'Rubik','Open Sans',sans-serif; font-size: 12px; line-height: 1.5; color: var(--wbc-text); outline: none; }
#wbc-rappel .wbc-rp-tete { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 7px 10px 7px 12px;
    background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%); color: #fff; }
#wbc-rappel .wbc-rp-titre { white-space: normal; gap: 6px; }
/* Bulle commune aux scripts de la collection (référence : WME Magic Wand) : icône sans pastille, pilules de 1,6 d'interligne. */
/* Pastille blanche de l'en-tête (22 px) gardée : la maison orange se lit mal sur le bleu. L'écart vient du titre. */
#wbc-rappel .wbc-hdr-ico { margin: 0; }
#wbc-rappel .wbc-btn { display: inline-block; min-height: 0; line-height: 1.6; }
#wbc-rappel .wbc-btn:hover { filter: none; }
#wbc-rappel .wbc-btn-primary:hover { background: var(--wbc-blue-dk); }
#wbc-rappel .wbc-btn-neutral:hover { background: #cfd8e2; }
#wbc-rappel .wbc-rp-tete :focus-visible { outline: 2px solid #fff; outline-offset: 1px; }
.wbc-rp-corps { padding: 10px 12px 2px; }
.wbc-rp-corps p { margin: 0 0 7px; }
.wbc-rp-corps .wbc-rp-note { font-size: 11px; color: var(--wbc-text2); }
.wbc-rp-boutons { display: flex; justify-content: flex-end; gap: 6px; padding: 0 12px 10px; }
.wbc-rp-boutons :focus-visible { outline: 2px solid var(--wbc-blue); outline-offset: 1px; }
.wbc-sb-ligne { justify-content: space-between; margin: 0 0 4px; }
.wbc-toggle input:disabled + .wbc-toggle-slider { opacity: .45; cursor: not-allowed; }
.wbc-toggle-row:has(input:disabled) .wbc-toggle-lbl { color: var(--wbc-text2); }
#wbc-sidebar[dir="rtl"] .wbc-toggle input:checked + .wbc-toggle-slider:before { transform: translateX(-16px); }
.wbc-sb-lbl { margin: 10px 0 4px; font-size: 12px; font-weight: 600; }
.wbc-sb-select { box-sizing: border-box; width: 100%; height: 26px; margin: 0; padding: 2px 6px; font: 12px Rubik, sans-serif; color: #2d3748; border: 1px solid #c8d0da; border-radius: 6px; background: #fff; }
.wbc-couleurs { display: flex; flex-wrap: wrap; gap: 6px 14px; }
.wbc-couleur { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; cursor: pointer; }
.wbc-couleur input[type="color"] { width: 26px; height: 24px; padding: 0; border: 1px solid var(--wbc-border); border-radius: 6px; background: #fff; cursor: pointer; }
#wbc-sidebar :focus-visible, #wbc-ov :focus-visible { outline: 2px solid var(--wbc-blue); outline-offset: 1px; }

.wbc-btn { display: inline-flex; align-items: center; gap: 5px; height: auto; min-height: 24px; padding: 3px 10px; margin: 0;
    border: none; border-radius: 50px; font: 600 11px 'Rubik','Open Sans',sans-serif; cursor: pointer; white-space: nowrap; }
.wbc-btn-primary { background: var(--wbc-blue-btn); color: #fff; }
.wbc-btn-neutral { background: #dde3ea; color: var(--wbc-text); }
.wbc-btn:hover { filter: brightness(1.08); }
.wbc-btn[hidden] { display: none; }
.wbc-btn[disabled] { opacity: .5; cursor: not-allowed; }

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
/* Focus blanc : un contour bleu serait invisible sur l'en-tête bleu. */
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
/* Sélection lisible sans la couleur (WCAG 1.4.1). */
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
.wbc-sugg li.wbc-vide { color: #566372; font-style: italic; cursor: default; }
.wbc-sugg small { color: var(--wbc-text2); }
.wbc-row { display: flex; align-items: center; gap: 6px; margin-top: 8px; min-width: 0; }
.wbc-statut { flex: 1; min-width: 0; font-size: 11px; color: var(--wbc-text2); text-align: end; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.wbc-statut.erreur { color: #c62828; white-space: normal; }
.wbc-progres { display: grid; grid-template-columns: 3.4em minmax(0, 1fr) 11em; gap: 6px; margin-top: 6px; font-size: 11px; color: var(--wbc-text2);
    white-space: nowrap; font-variant-numeric: tabular-nums; }
.wbc-progres.dep { grid-template-columns: 3.4em 4.6em 4.8em minmax(0, 1fr) 11em; }
.wbc-progres[hidden] { display: none; }
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
.wbc-table-dep th.num, .wbc-table-dep td.num { width: 54px; }
.wbc-legende-dep { gap: 3px 8px; }
.wbc-legende-dep > span { display: inline-flex; align-items: center; white-space: nowrap; }
.wbc-barre { height: 6px; margin-top: 6px; border-radius: 3px; background: #e3eaf1; overflow: hidden; }
.wbc-barre[hidden] { display: none; }
.wbc-barre > i { display: block; height: 100%; width: 0; background: var(--wbc-blue); transition: width .2s; }
/* Animée par transform : une marge animée se figerait quand le fil principal calcule. 233 % de 30 % = 70 % de la barre. */
.wbc-barre.en-cours > i { width: 30% !important; transition: none; animation: wbc-en-cours 1.1s ease-in-out infinite alternate; }
@keyframes wbc-en-cours { from { transform: translateX(0); } to { transform: translateX(233%); } }
#wbc-ov[dir="rtl"] .wbc-barre.en-cours > i { animation-name: wbc-en-cours-rtl; }
@keyframes wbc-en-cours-rtl { from { transform: translateX(0); } to { transform: translateX(-233%); } }
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
/* !important : bat la hauteur posée en ligne par le glisser, sinon replier ne rétrécit rien. */
#wbc-ov.replie { height: auto !important; min-height: 0; }
#wbc-ov.replie #wbc-corps, #wbc-ov.replie #wbc-resize, #wbc-ov.replie .wbc-ligne-haut, #wbc-ov.replie .wbc-switchs, #wbc-ov.replie #wbc-deja { display: none; }
#wbc-ov.replie #wbc-haut { padding-top: 0; border-bottom: 0; }
#wbc-ov.replie #wbc-haut:not(:has(> #wbc-progres:not([hidden]), > #wbc-barre:not([hidden]))) { display: none; }
#wbc-deja .wbc-memo { margin: 6px 0 0; }

.wbc-titre { display: flex; align-items: baseline; gap: 6px; margin: 0 0 8px; font-size: 14px; font-weight: 700; color: var(--wbc-text); }
.wbc-titre small { font-size: 11px; font-weight: 400; color: var(--wbc-text2); }
.wbc-retour { display: inline-block; margin: 0 0 6px; padding: 0; border: none; background: none; height: auto; min-height: 0;
    color: var(--wbc-blue-dk); font: 600 11px 'Rubik','Open Sans',sans-serif; cursor: pointer; }
.wbc-retour:hover { text-decoration: underline; }
.wbc-kpis { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 5px; }
.wbc-kpi { padding: 3px 7px; border: 1px solid var(--wbc-border); border-radius: 7px; background: var(--wbc-bg); min-width: 0; }
.wbc-kpi b { display: block; font-size: 14px; line-height: 1.2; font-weight: 700; font-variant-numeric: tabular-nums; }
.wbc-kpi span { display: block; font-size: 10px; line-height: 1.3; color: var(--wbc-text2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.wbc-cov-l { display: flex; align-items: center; gap: 8px; margin: 6px 0 6px; font-size: 11px; color: var(--wbc-text2); }
.wbc-cov-l b { font-size: 13px; color: var(--wbc-text); font-variant-numeric: tabular-nums; }
.wbc-cov-l .wbc-cov { flex: 1; margin: 0; }
.wbc-hdr-quota { align-self: center; padding: 2px 8px; border-radius: 10px; background: #fff; color: #0d47a1; font-size: 11px; font-weight: 700; line-height: 16px; white-space: nowrap; cursor: default; }
.wbc-hdr-quota.bas { background: #ffb74d; color: #3e2723; }
.wbc-hdr-quota.critique { background: #c62828; color: #fff; }
.wbc-hdr-quota[hidden] { display: none; }
.wbc-titre-l { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; margin: 0 0 6px; }
.wbc-titre-l .wbc-titre { margin: 0; flex: 1 1 auto; min-width: 0; }
.wbc-actions { display: flex; flex-wrap: wrap; gap: 4px; }
.wbc-actions .wbc-btn { padding: 2px 8px; font-size: 10.5px; }
.wbc-n { font-weight: 400; opacity: .75; font-variant-numeric: tabular-nums; }
.wbc-ligne-haut { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.wbc-ligne-haut .wbc-choix { flex: 1 1 150px; margin-top: 0; min-width: 0; }
.wbc-ligne-haut .wbc-choix[data-pour="here"] { display: none; }
.wbc-switchs .wbc-statut { flex: 1 1 0; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; text-align: end; }
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
/* -10px = la marge haute de #wbc-corps. */
#wbc-corps tr.wbc-l { scroll-margin-top: 86px; }
#wbc-corps > .wbc-outils { position: sticky; top: -10px; z-index: 2; background: #fff; padding: 6px 0; margin: 2px 0 4px; box-shadow: 0 1px 0 var(--wbc-border); }
.wbc-filtres { display: flex; flex-wrap: wrap; gap: 4px; }
.wbc-rech { flex: 1 1 100%; display: flex; align-items: center; gap: 6px; }
.wbc-rech input.wbc-champ { flex: 1 1 auto; width: auto !important; }
.wbc-rech.actif input.wbc-champ { border-color: var(--wbc-blue); background: #fff; }
.wbc-loupe { flex: 0 0 auto; font-size: 13px; line-height: 1; }
.wbc-rech-x { flex: 0 0 auto; height: 26px; padding: 0 9px; border: 1px solid var(--wbc-border); border-radius: 8px; background: #fff; color: var(--wbc-text); font-size: 12px; cursor: pointer; }
.wbc-rech-x:hover, .wbc-rech-x:focus-visible { border-color: var(--wbc-blue); color: var(--wbc-blue); }
.wbc-rech-n { flex: 0 0 auto; font-size: 11px; color: var(--wbc-text2); white-space: nowrap; }
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
/* Violet : l'orange est réservé aux numéros EN TROP. */
.wbc-num.suffixe { border-color: #ce93d8; background: #f3e5f5; color: #6a1b9a; }
.wbc-num.pose { border-color: #006064; background: #00838f; color: #fff; }
.wbc-num.pose:hover { background: #006064; }
.wbc-f-etat.pose { color: #006064; font-weight: 700; }
.wbc-hn-msg { margin: 0 0 6px; padding: 5px 8px; border-radius: 6px; background: #e0f7fa; color: #004d57; font-size: 11px; line-height: 1.45; }
.wbc-hn-msg.erreur { background: #ffebee; color: #b71c1c; }
/* Sous la fenêtre d'enregistrement de WME (niveau 9) quand la fenêtre est en repli sur <body>. */
#wbc-ov.wbc-sous { z-index: 8 !important; }
.wbc-num.enregistre { border-color: #a5d6a7; background: #e8f5e9; color: #1b5e20; }
.wbc-num.rpp { border-color: #9fa8da; background: #e8eaf6; color: #283593; }
.wbc-num.rpp:hover { background: #c5cae9; }
.wbc-num.arret { border-color: #ffb74d; background: #fff3e0; color: #8a3200; }
.wbc-num.arret:hover { background: #ffe0b2; }
.wbc-legende { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; margin: -2px 0 6px; font-size: 11px; color: var(--wbc-text2); }
.wbc-pt { display: inline-block; width: 10px; height: 10px; margin-inline-end: 4px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 0 1px #9aa5b1; vertical-align: -1px; }
.wbc-pt.manquant { background: #e53935; }
.wbc-pt.present { background: #43a047; }
.wbc-pt.trop { background: #fb8c00; }
.wbc-num.courant { outline: 2px solid var(--wbc-blue-dk); outline-offset: 1px; }
.wbc-copier { display: inline-flex; align-items: center; gap: 5px; }
.wbc-ico-copie { flex: none; }
/* Jamais « ✚ », qui marque déjà un numéro POSÉ. */
.wbc-num-g { position: relative; display: inline-flex; }
.wbc-num { position: relative; }
.wbc-num-etat { position: absolute; top: -6px; inset-inline-start: -6px; width: 14px; height: 14px; border: 1px solid #fff; border-radius: 50%; background: #006064; color: #fff;
    font-size: 9px; font-weight: 700; line-height: 14px; text-align: center; pointer-events: none; }
.wbc-num.enregistre .wbc-num-etat { background: #2e7d32; }
.wbc-num-plus { position: absolute; top: -6px; inset-inline-end: -6px; z-index: 1; display: flex; align-items: center; justify-content: center;
    width: 17px; height: 17px; min-height: 0; margin: 0; padding: 0; border: 1px solid #fff; border-radius: 50%; background: #00838f; color: #fff;
    font: 700 13px/1 'Rubik','Open Sans',sans-serif; cursor: pointer; opacity: 0; pointer-events: none; box-shadow: 0 1px 3px rgba(0,0,0,.3); }
/* Caché, il ne capte pas la souris (il recouvrirait le « + » voisin) ; le clavier l'atteint toujours. */
.wbc-num-g:hover .wbc-num-plus, .wbc-num-g:focus-within .wbc-num-plus, .wbc-num-g.courant .wbc-num-plus { opacity: 1; pointer-events: auto; }
.wbc-num-plus:hover { background: #006064; }
.wbc-num-plus:focus-visible { outline: 2px solid var(--wbc-blue-dk); outline-offset: 1px; }
/* Sans droit direct sur le segment : la pose deviendra une suggestion de WME à l'enregistrement (bord pointillé, couleur ambre). */
.wbc-num-plus.sugg, .wbc-num-plus.sugg:hover { border: 1px dashed #fff; background: #ef6c00; }
.wbc-num-plus.wbc-num-ban { top: auto; bottom: -6px; background: #000091; font-size: 10px; }
.wbc-num-plus.wbc-num-ban:hover { background: #1212ff; }
.wbc-sig-l { display: flex; flex-wrap: wrap; gap: 4px; align-items: baseline; margin-bottom: 5px; font-size: 11px; list-style: none; }
.wbc-sig-voie { margin: 0 0 6px; padding: 0; }
.wbc-sig-st { padding: 0 6px; border-radius: 50px; background: #eceff1; color: #37474f; font-weight: 600; white-space: nowrap; }
.wbc-sig-st.pending { background: #fff3e0; color: #8a4b00; }
.wbc-sig-st.processed { background: #e8f5e9; color: #1b5e20; }
.wbc-sig-st.ignored { background: #ffebee; color: #b71c1c; }
.wbc-sig-c { color: var(--wbc-text2); font-style: italic; }
.wbc-sig-m { color: #b71c1c; }
.wbc-num.sig { background: #eceff1; border-color: #cfd8dc; color: #263238; }
.wbc-num.sig:hover { background: #dfe6ea; }
.wbc-tag { display: inline-block; padding: 0 6px; border-radius: 50px; background: #eceff1; color: #37474f; font-size: 10px; font-weight: 600; cursor: help; white-space: nowrap; }
.wbc-principal { color: var(--wbc-text2); font-size: 11px; }
.wbc-suivant { margin-inline-start: 6px; padding: 1px 8px; font-size: 10.5px; vertical-align: middle; }
.wbc-outils select.wbc-champ { flex: 0 1 180px; width: auto !important; }
.wbc-cov-mini { display: inline-block; width: 38px; height: 6px; margin-inline-end: 4px; border-radius: 3px; background: #e3eaf1; vertical-align: middle; overflow: hidden; }
.wbc-cov-mini > i { display: block; height: 100%; background: var(--wbc-blue); }
.wbc-pt.carre { width: 12px; height: 12px; border-radius: 2px; border: 0; box-shadow: none; vertical-align: -2px; }
.wbc-pt.gris { background: #9e9e9e; opacity: .5; }
/* Une règle des champs de la fenêtre l'emporterait sur l'attribut hidden. */
#wbc-cmp-fichier { display: none !important; }
.wbc-cmp { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; margin: 6px 0 0; padding: 5px 8px; border: 1px solid #90caf9; border-radius: 8px;
    background: #e3f2fd; color: #0d47a1; font-size: 11px; }
.wbc-cmp span { flex: 1 1 200px; min-width: 0; }
.wbc-delta { color: var(--wbc-text2); }
.wbc-delta.plus { color: #1b5e20; font-weight: 700; }
.wbc-delta.moins { color: #c62828; font-weight: 700; }
.wbc-voie-outils { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin: 6px 0 8px; }
.wbc-ibtn { position: relative; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; width: 32px; height: 28px; min-height: 0; padding: 0; margin: 0;
    border: none; border-radius: 6px; cursor: pointer; }
.wbc-ibtn:hover { filter: brightness(1.08); }
.wbc-ibtn[disabled] { opacity: .5; cursor: not-allowed; }
.wbc-ibtn.on { background: var(--wbc-blue-btn); color: #fff; }
#wbc-ov .wbc-ibtn:focus-visible { outline: 2px solid var(--wbc-blue-dk); outline-offset: 1px; }
.wbc-ibtn-n { position: absolute; top: -7px; inset-inline-end: -7px; min-width: 16px; height: 16px; padding: 0 4px; box-sizing: border-box; border-radius: 8px;
    background: #d32f2f; color: #fff; font-size: 10px; font-weight: 700; line-height: 16px; text-align: center; pointer-events: none; }
.wbc-ibtn[disabled] .wbc-ibtn-n { background: #78909c; }
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

/* Sur le body, jamais dans un conteneur positionné de WME (elle passerait sous la carte). */
#wbc-fiche { position: fixed; z-index: 10050; max-width: 300px; padding: 6px 9px; pointer-events: none;
    background: #fff; border: 1px solid var(--wbc-border); border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,.2);
    font: 11px/1.55 'Rubik','Open Sans',sans-serif; color: var(--wbc-text); }
#wbc-fiche[hidden] { display: none; }
#wbc-fiche b { font-size: 12px; }
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
#wbc-avis { position: fixed; z-index: 10052; max-width: 320px; padding: 8px 10px; border: 1px solid #b23c00; border-radius: 8px; background: #fff3e0;
    color: #8a2e00; font: 500 12px/1.4 'Rubik','Open Sans',sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,.25); cursor: pointer; }
#wbc-avis[hidden] { display: none; }
.wbc-f-etat { display: inline-block; margin-top: 2px; padding: 0 7px; border-radius: 50px; font-weight: 600; }
.wbc-f-etat.manquant { background: #ffebee; color: #c62828; }
.wbc-f-etat.present { background: #e8f5e9; color: #2e7d32; }
.wbc-f-etat.trop { background: #fff3e0; color: #b23c00; }
.wbc-f-etat.arret { background: #fff3e0; color: #8a3200; }
.wbc-f-etat.suffixe { background: #f3e5f5; color: #6a1b9a; }
`;


    let ovEl = null;
    const OPTS_DEF = () => ({ mode: 'here', carte: false, trouves: false, certSeules: false, survol: true, couleurs: {}, carteDep: true, replie: false, seuilArret: 80, numRpp: true, calque: false, contour: false });
    let opts = OPTS_DEF();
    let choixCommune = null;          // {code, nom, dep} choisi dans la recherche
    let choixDep = '';
    let jeton = null;
    let deja = null;                  // le balayage gardé proposé avant d'analyser ({e, cert, cible, ban, banDate})
    let resultat = null;
    let resDep = null;
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
    function barre(frac, enCours) {
        const b = $('#wbc-barre');
        b.hidden = frac == null;
        b.classList.toggle('en-cours', !!enCours);
        if (frac != null) b.firstElementChild.style.width = Math.round(frac * 100) + '%';
        if (jeton && frac != null && !enCours) titreAvancement(frac);
        if (frac != null && !enCours) b.setAttribute('aria-valuenow', String(Math.round(frac * 100)));
        else b.removeAttribute('aria-valuenow');
    }
    const annoncer = txt => { const a = ovEl && $('#wbc-annonce'); if (a) a.textContent = txt; };
    let titreOrigine = null, arrierePlanVu = false, masqueArriere = null;
    // hnEnCours est déclaré plus bas : un visibilitychange reçu avant sa déclaration ne doit pas lever d'erreur.
    const travailEnCours = () => { try { return !!jeton || hnEnCours; } catch (e) { return !!jeton; } };
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
    // Fonction fléchée : passé tel quel, l'événement arriverait dans `debut` et effacerait le bandeau au retour.
    document.addEventListener('visibilitychange', () => majArrierePlan());
    let attentes = 0;
    async function attendre(p) {
        attentes++;
        if (!jeton && ovEl) barre(0, true);
        try { return await p; }
        finally { if (--attentes === 0 && !jeton && ovEl) barre(null); }
    }
    const roue = tip => '<span class="wbc-roue" role="img" title="' + esc(tip) + '" aria-label="' + esc(tip) + '"></span>';


    // Rend { ok, fin } : fin est le bilan ou le motif de l'échec affiché dans la fenêtre.
    async function lancer(reprise, tache, certImpose) {
        if (jeton) return null;
        // Une reprise garde le filtre des certifiées du passage qu'elle complète.
        const cert = certImpose != null ? !!certImpose : reprise && resDep ? !!resDep.certSeules : !!opts.certSeules;
        const j = jeton = { stop: false, certSeules: cert, departement: !!reprise || (!tache && opts.mode === 'dep') };
        const t0 = Date.now();
        majBoutons();
        majArrierePlan(true);
        barre(0, true);
        annoncer(t('analyse') + '…');
        if (j.departement) cocherCalque();
        let fin = '', ok = false;
        try {
            // Web Lock tenu pendant le passage : Chrome ne gèle pas un onglet qui en détient un.
            const passage = () => tache ? tache(j) : (reprise || opts.mode === 'dep') ? lancerDepartement(j, reprise) : lancerCommune(j);
            if (navigator.locks && navigator.locks.request) await navigator.locks.request('wme-ban-coverage-analyse', passage);
            else await passage();
            const s = new Intl.NumberFormat(LOCALES[_lang] || 'en', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format((Date.now() - t0) / 1000);
            fin = j.echecs ? t('stDoneErr', s, nb(j.echecs)) : t('stDone', s);
            statut(fin, !!j.echecs);
            ok = true;
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
            rendre();
        }
        return { ok, fin };
    }
    const arreter = () => { if (jeton) jeton.stop = true; };

    // Rang WME 0-indexé (5 = L6) ; statut de Champ lu dans les groupes Discuss avec la session de l'éditeur.
    // Habilitation en empreintes : ne pas modifier sans accord du mainteneur du script.
    let droitChamp = false;
    const _cx = t => { let x = 0x811c9dc5; for (let i = 0; i < t.length; i++) { x ^= t.charCodeAt(i); x = Math.imul(x, 0x01000193) >>> 0; } return x >>> 0; };
    const _cz = [0x853f760, 0xb53fc19, 0x851b8c9, 0x4631c6b8, 0x3e2070ff];
    const _cq = 0x734005f7;
    const _cok = j => j.some(x => _cz.indexOf(_cx(x)) >= 0) && ((_cz.reduce((a, b) => (a ^ b) >>> 0, 0) >>> 0) === _cq);
    async function lireDroitChamp() {
        let u = null;
        try { u = await sdk.State.getUserInfo(); } catch (e) { }
        const rang = u && u.rank != null ? u.rank : null;
        const j = [];
        if (rang != null) j.push('r' + rang);
        if (u && u.isStaff) j.push('s1');
        if (_cok(j)) return true;
        const nom = u && u.userName;
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

    let demande = false;
    async function demanderAnalyse() {
        if (jeton || deja || demande) return;
        demande = true;
        const cert = !!opts.certSeules;
        try {
            const { e, cible } = await attendre((async () => {
                let code = null, cible = null, e = null;
                const cd = communeDuDep();
                if (cd) { cible = cd; code = cd.code; }
                else if (opts.mode === 'dep') code = choixDep;
                else if (opts.mode === 'commune') code = choixCommune && choixCommune.code;
                else {
                    // Le passage reprend CETTE commune : la carte a pu bouger pendant la question.
                    statut(t('stLocate'));
                    try { const c = await sdk.Map.getMapCenter(); cible = await pays.auPoint(c.lon, c.lat); } catch (er) { cible = null; }
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
    const communeDuDep = () => opts.mode === 'dep' && resultat && resDep && resDep.dep.code === choixDep &&
        resDep.communes.some(l => l.commune.code === resultat.commune.code) ? resultat.commune : null;
    const lancerSans = cible => cible ? lancer(null, j => lancerCommune(j, cible)) : lancer();
    async function verifierBanDeja(d) {
        let r = null;
        try { r = await Memo.lire('communes', d.e.cle); } catch (er) { log('mémoire : ' + er.message); }
        let v = 'aucune', date = null;
        if (r && r.memo && r.memo.etag && !r.memo.etag.split('|').some(x => !x)) {
            try {
                v = (await pays.empreinte(d.e.code)) === r.memo.etag ? 'ok' : 'maj';
                if (v === 'maj') date = await pays.dateRevision(d.e.code);
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
        const a = document.activeElement;
        const vieux = e.type === 'commune' && !memoAJour(e);
        const ajouts = ajoutsDepuis(e) || (vieux ? 1 : 0);
        const garde = a && el.contains(a) ? a.dataset.act : (!a || a === document.body || ovEl.contains(a)) ? (ajouts ? 'dejarelancer' : 'dejaouvrir') : null;
        const quand = e.type === 'dep' ? t('dejaDep', dateHeure(e.date), nb(e.n), nb(e.total)) : t('dejaCommune', dateHeure(e.date));
        const ban = e.type !== 'commune' || d.ban === 'aucune' ? '' : d.ban == null ? banAttente()
            : d.ban === 'ok' ? bout('ok', t('memoBanOk')) : d.ban === 'maj' ? bout('maj', t('memoBanMaj', d.banDate ? dateCourte(d.banDate) : '')) : bout('maj', t('memoBanErr'));
        el.innerHTML = '<div class="wbc-memo wbc-deja">' + bout('date', quand) + bout('', (e.nom ? e.nom + ' · ' : '') + pct(e.presents, e.ban)) +
            (e.viaDep ? bout('', t('dejaViaDep', e.viaDep)) : '') + ban + (vieux ? bout('maj', t('dejaOld')) : ajouts ? bout('maj', t('dejaHnDepuis', nb(ajouts))) : '') +
            '<span class="wbc-memo-btns">' + (vieux ? '' : '<button type="button" class="wbc-btn ' + (ajouts ? 'wbc-btn-neutral' : 'wbc-btn-primary') + '" data-act="dejaouvrir" title="' + esc(t('dejaOpenTip')) + '">' + esc(t('memoOpen')) + '</button>') +
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
        const go = $('[data-act="go"]');
        if (go && !go.hidden) go.focus();
    }

    // `local` : { adresses, cache } d'un calcul gardé — seuls les carreaux retirés du cache sont relus.
    async function lancerCommune(j, cible, local) {
        let com;
        if (cible) com = cible;
        else if (opts.mode === 'here') {
            statut(t('stLocate'));
            const c = await sdk.Map.getMapCenter();
            com = await pays.auPoint(c.lon, c.lat);
            if (!com) throw new Error(t('errNoCommune'));
        } else {
            if (!choixCommune) throw new Error(t('errPick'));
            statut(t('stLocate'));
            com = await pays.parCode(choixCommune.code);
        }
        if (j.stop) throw Arret();
        statut('');
        const cache = local ? local.cache : nouveauCache(), sortie = {};
        const r = await analyserCommune(com, cache, j, (txt, f, enCours) => { barre(f, enCours); progres({ pct: enCours ? '' : pct(f, 1), nom: com.nom, etape: txt }); },
            local ? local.adresses : null, sortie);
        if (r.vide) throw new Error(t('errBan'));
        calculGarde = { res: r, adresses: sortie.adresses, cache };
        r.verif = {};
        const ligneDep = resDep && resDep.certSeules === !!j.certSeules ? resDep.communes.find(x => x.commune.code === com.code) : null;
        await garderCommune(r, ligneDep ? resDep.dep.code : '');
        if (ligneDep) { ligneDep.totaux = r.totaux; ligneDep.memo = r.memo; ligneDep.etat = 'ok'; ligneDep.erreur = ''; ligneDep.verif = r.verif; await garderDep(); }
        resCommunes.set(com.code, r);
        montrerCommune(r);
    }

    async function lancerDepartement(j, reprise) {
        let lignes;
        if (reprise && resDep) {
            lignes = Array.isArray(reprise) ? reprise : resDep.communes.filter(c => c.etat === 'erreur');
            lignes.forEach(l => { l.etat = 'attente'; l.erreur = ''; l.verif = {}; });
        } else {
            if (!choixDep) throw new Error(t('errPickDep'));
            statut(t('stLocate'));
            const deps = await pays.groupes();
            const dep = deps.find(d => d.code === choixDep) || { code: choixDep, nom: choixDep };
            const liste = await pays.communesDe(dep.code);
            // Ordre spatial en serpentin : des communes successives réutilisent les carreaux WME.
            const centre = c => c.bbox ? [(c.bbox[0] + c.bbox[2]) / 2, (c.bbox[1] + c.bbox[3]) / 2] : [0, 0];
            liste.sort((a, b) => {
                const [xa, ya] = centre(a), [xb, yb] = centre(b);
                const ba = Math.floor(ya / CARREAU), bb = Math.floor(yb / CARREAU);
                if (ba !== bb) return bb - ba;
                return ba % 2 ? xb - xa : xa - xb;
            });
            resCommunes.clear();
            resDep = { dep, certSeules: !!j.certSeules, communes: liste.map(c => ({ commune: c, totaux: null, etat: 'attente' })) };
            lignes = resDep.communes;
            demanderDirect(true);
        }
        const communes = lignes.map(l => l.commune);
        let sauvegardes = Promise.resolve();
        const finDepartement = async () => { await sauvegardes; resDep.date = Date.now(); await garderDep(); };
        j.finDep = () => finDepartement();
        statut('');
        resultat = null;
        rendre();
        const cache = nouveauCache();
        const lireBan = k => { const p = pays.adresses(communes[k].code, () => { }); p.catch(() => { }); return p; };
        let suivante = null;
        const debut = Date.now();
        let reste = '';
        for (let i = 0; i < communes.length; i++) {
            if (j.stop) throw Arret();
            const c = communes[i], ligne = lignes[i];
            const banPret = suivante || lireBan(i);
            suivante = i + 1 < communes.length ? lireBan(i + 1) : null;
            if (i >= 3) {
                const min = (Date.now() - debut) / i * (communes.length - i) / 60000;
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
        await finDepartement();
        if (!resultat) rendreDep(true);
    }


    // Corps reconstruit en entier : focus et défilement sont rendus après coup.
    const ATTRS_FOCUS = ['data-filtre', 'data-tri', 'data-tridep', 'data-voie', 'data-commune', 'data-adr', 'data-hn1', 'data-rpphn', 'data-rppgo', 'data-arretgo', 'data-act', 'data-trop', 'data-doublon'];
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
        majBoutons();
        const f = corps.querySelector('#wbc-filtre-txt');
        if (f) f.value = vue.texte;
        corps.scrollTop = haut;
        majQuotaHdr();
        majContour();
        if (cible) {
            const e = corps.querySelector(cible);
            if (e) { e.focus({ preventScroll: true }); if (curseur != null) try { e.setSelectionRange(curseur, curseur); } catch (x) { } }
        }
    }
    let rendreDepTimer = null;
    function rendreDep(force) {
        clearTimeout(rendreDepTimer);
        const corps = ovEl && $('#wbc-corps');
        if (!force && corps && corps.matches(':hover')) { rendreDepTimer = setTimeout(() => rendreDep(false), 1500); return; }
        if (force) { rendre(); return; }
        rendreDepTimer = setTimeout(() => { if (!resultat) rendre(); }, 1500);
    }

    let cmp = null;                   // {date, data} : l'export chargé (Core.lireExport)
    const signe = d => (d > 0 ? '+' : d < 0 ? '\u2212' : '\u00b1') + nb(Math.abs(d));
    const dateCourte = ms => new Intl.DateTimeFormat(LOCALES[_lang] || 'en', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(ms);
    // Comparaison à un export chargé à la main (« Comparer ») ; le balayage gardé n'est plus comparé (0.27.00).
    const cmpCommune = r => cmp && cmp.data.type === 'commune' && r && cmp.data.code === r.commune.code ? cmp : null;
    const cmpDep = () => cmp && cmp.data.type === 'dep' && resDep && !resultat ? cmp : null;
    function ligneCmp(c, T) {
        const A = c.data.totaux;
        return '<p class="wbc-cmp"><span>' + esc(t('cmpLine', dateCourte(c.date), signe(T.presents - A.presents), signe(T.manquants - A.manquants), signe((T.enTrop || 0) - A.enTrop))) +
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

    const kpi = (val, lbl, cls, sous) => '<div class="wbc-kpi' + (cls ? ' ' + cls : '') + '" title="' + esc(lbl + (sous ? ' — ' + sous : '')) + '"><b>' + val + '</b><span>' + esc(lbl) + '</span>' + (sous ? '<span>' + esc(sous) + '</span>' : '') + '</div>';

    // Numéros en trop ou en double : aucune voie BAN, donc aucune déléguée (« — »).
    function seuilArret() { const s = Math.round(Number(opts.seuilArret) / 10) * 10; return s >= 30 && s <= 200 ? s : 80; }
    function arretLoin(a) { return a.ea != null && a.ea >= seuilArret() && a.alon != null; }
    function totauxVus(r) {
        if (!vue.deleguee) return r.totaux;
        const vs = r.voies.filter(v => v.deleguee === vue.deleguee);
        const s = k => vs.reduce((x, v) => x + v[k], 0);
        const nbStatut = st => vs.filter(v => v.statutNom === st).length;
        return Object.assign({}, r.totaux, {
            ban: s('ban'), hn: s('hn'), rpp: s('rpp'), presents: s('presents'), manquants: s('ban') - s('presents'), suffixes: s('suffixes'), eloignes: vs.reduce((x, v) => x + (v.eloignes || 0), 0),
            arretsHist: Core.sommeHisto(vs.map(v => v.arretsHist)),
            cert: vs.reduce((x, v) => x + v.adresses.filter(a => a.cert).length, 0), enTrop: null, doublons: null,
            voies: vs.length, voiesCompletes: vs.filter(v => v.presents === v.ban).length,
            voiesSansNom: nbStatut('sansNom'), voiesAutreNom: nbStatut('different'), voiesSansSegment: nbStatut('aucun'),
            voiesAlt: nbStatut('alternatif'), voiesRoute: nbStatut('numeroRoute'),
            voiesProche: vs.filter(v => ['autreType', 'autreArticle', 'orthographe', 'nomPartiel'].includes(v.statutNom)).length,
        });
    }

    function htmlKpis(T) {
        const c = pct(T.presents, T.ban);
        return '<div class="wbc-kpis">' +
            kpi(nb(T.ban), t('kBan'), '', t('kCert', nb(T.cert))) +
            kpi(nb(T.presents), t('kWme'), '', t('kHnRpp', nb(T.hn), nb(T.rpp)) + (T.eloignes ? ' · ' + t('kFar', nb(T.eloignes)) : '') +
                (Core.arretsAuDela(T.arretsHist, seuilArret()) ? ' · ' + t('kArret', nb(Core.arretsAuDela(T.arretsHist, seuilArret()))) : '')) +
            kpi(nb(T.manquants), t('kMiss'), T.manquants ? 'ko' : 'ok', T.suffixes ? t('kSuf', nb(T.suffixes)) : '') +
            (T.enTrop == null ? kpi('—', t('kExtra'), '', t('delNote'))
                : kpi(nb(T.enTrop), t('kExtra'), T.enTrop ? 'warn' : '', T.doublons ? t('kDup', nb(T.doublons)) : '')) +
            '</div><div class="wbc-cov-l" title="' + esc(t('kCov')) + '"><b>' + esc(c) + '</b><span class="wbc-cov" role="img" aria-label="' + esc(t('kCov') + ' ' + c) + '"><i style="width:' +
            (T.ban ? (100 * T.presents / T.ban).toFixed(1) : 0) + '%"></i></span><span class="wbc-cov-lbl">' + esc(t('kCov')) + '</span></div>' +
            '';
    }
    // Quota : une seule pastille, dans l'en-tête de la fenêtre (toujours visible), relue à chaque rendu et toutes les 15 s.
    function majQuotaHdr() {
        const el = ovEl && ovEl.querySelector('#wbc-hdr-quota');
        if (!el) return;
        if (!droitGeste('hn1')) { el.hidden = true; return; }
        const q = Core.quotaHn(lireHorodatages(), Date.now());
        const txt = q.reste ? t('ajHnLeft', nb(q.reste)) : t('ajHnFull', heureCourte(q.libre));
        el.className = 'wbc-hdr-quota ' + Core.niveauQuota(q);
        el.textContent = '\u271A\u00a0' + (q.reste ? nb(q.reste) : heureCourte(q.libre));
        el.title = txt + ' — ' + t('ajHnQuotaTip');
        el.setAttribute('aria-label', txt);
        el.hidden = false;
    }

    function voiesFiltrees(r) {
        const q = Core.normNom(vue.texte);
        let l = r.voies.filter(v => {
            if (vue.filtre === 'todo' && v.presents >= v.ban) return false;
            if (vue.filtre === 'done' && v.presents < v.ban) return false;
            // « Nom à vérifier » : tout sauf le nom BAN porté en principal ou en alternatif.
            if (vue.filtre === 'name' && (v.statutNom === 'identique' || v.statutNom === 'alternatif' || v.statutNom === 'parking')) return false;
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
        if (v.statutNom === 'identique' && v.graphieBan) h = '<span class="wbc-nom-ok">&#x2713;</span>' + tag(t('ponctTag'), t('tipPonct')) + ' <bdi class="wbc-principal">' + esc(v.graphieBan) + '</bdi>';
        else if (v.statutNom === 'identique') h = '<span class="wbc-nom-ok" title="' + esc(t('tipSame')) + '">&#x2713;</span>';
        else if (v.statutNom === 'alternatif') h = '<span class="wbc-nom-ok">&#x2713;</span>' + tag(t('altTag'), t('tipAlt', v.nomPrincipal)) + ' <bdi class="wbc-principal">' + esc(v.nomPrincipal) + '</bdi>';
        else if (v.statutNom === 'numeroRoute') h = '<span class="wbc-nom-diff"><bdi>' + esc(v.nomWme) + '</bdi></span>' + tag(t('routeTag'), t('tipRoute'));
        else if (v.statutNom === 'autreType') h = '<span class="wbc-nom-diff"><bdi>' + esc(v.nomWme) + '</bdi></span>' + tag(t('typeTag'), t('tipType'));
        else if (v.statutNom === 'autreArticle') h = '<span class="wbc-nom-diff"><bdi>' + esc(v.nomWme) + '</bdi></span>' + tag(t('articleTag'), t('tipArticle'));
        else if (v.statutNom === 'orthographe') h = '<span class="wbc-nom-diff"><bdi>' + esc(v.nomWme) + '</bdi></span>' + tag(t('orthoTag'), t('tipOrtho'));
        else if (v.statutNom === 'nomPartiel') h = '<span class="wbc-nom-diff"><bdi>' + esc(v.nomWme) + '</bdi></span>' + tag(t('partielTag'), t('tipPartiel'));
        // Autre nom ET nom BAN absent de la commune : la voie manque dans WME ; le nom montré est celui de la rue voisine.
        else if (v.statutNom === 'different' && v.nomAbsent) h = tag(t('absentTag'), t('tipAbsent')) + ' <bdi class="wbc-principal" title="' + esc(t('tipOther')) + '">' + esc(v.nomWme) + '</bdi>';
        else if (v.statutNom === 'parking') h = '<span class="wbc-nom-ok">&#x2713;</span>' + tag(t('parkTag'), t('tipPark'));
        else if (v.statutNom === 'sansNom') h = '<span class="wbc-nom-vide">' + esc(t('nameNone')) + '</span>';
        else if (v.statutNom === 'aucun') h = '<span class="wbc-nom-aucun">' + esc(t('nameNoSeg')) + '</span>';
        else h = '<span class="wbc-nom-diff" title="' + esc(t('tipOther')) + '"><bdi>' + esc(v.nomWme) + '</bdi></span>';
        if (v.nomAbsent && !(v.statutNom === 'different')) h += ' <span class="wbc-absent" title="' + esc(t('tipAbsent')) + '" aria-label="' + esc(t('tipAbsent')) + '">&#x26A0;</span>';
        return h;
    }

    const th = (cle, lbl, num) => '<th scope="col"' + (num ? ' class="num"' : '') + (vue.tri === cle ? ' aria-sort="' + (vue.sens > 0 ? 'ascending' : 'descending') + '"' : '') + '><button type="button" class="wbc-th" data-tri="' + cle + '" title="' + esc(t('tipSort')) + '">' + esc(lbl) + '</button></th>';

    // « ⇄ » : verdict d'écart franc décidé au clic, sur ce que WME montre (convertirRppVoie) ; voie au nom BAN exact seulement.
    function htmlRpps(v, i) {
        const liste = v.adresses.map((a, k) => ({ a, k })).filter(x => x.a.trouve === 'RPP' && x.a.wlon != null);
        if (!liste.length) return '';
        const conv = v.statutNom === 'identique' && !hnEnCours && Core.quotaHn(lireHorodatages(), Date.now()).reste > 0;
        return '<h4>' + esc(t('rhnT', nb(liste.length))) + '</h4><div class="wbc-nums">' + liste.map(({ a, k }) => {
            const courant = vue.curseurRpp === i + ':' + k ? ' courant' : '';
            const num = '<button type="button" class="wbc-num rpp' + (a.rppHn ? ' pose' : '') + courant + '" data-rppgo="' + i + ':' + k + '" title="' + esc((a.rppHn ? t('rhnPoseTip') : t('rhnTip')) + (a.loin ? ' — ' + t('tipFar', nb(a.dm)) : '')) + '"' + (a.rppHn ? ' aria-label="' + esc(a.brut + ' — ' + t('rhnPoseTip')) + '"' : '') + '>' + esc(a.brut) + (a.loin ? ' · ' + esc(nb(a.dm)) + '\u00a0m' : '') + (a.rppHn ? '<span class="wbc-num-etat" aria-hidden="true">&#x271A;</span>' : '') + '</button>';
            return '<span class="wbc-num-g' + courant + '">' + num + (conv && !a.rppHn ? '<button type="button" class="wbc-num-plus rpp" data-rpphn="' + i + ':' + k + '" title="' + esc(t('rhnConv') + ' — ' + t('rhnConvTip')) + '" aria-label="' + esc(t('rhnConv') + ' ' + a.brut) + '">&#x21C4;</button>' : '') + '</span>';
        }).join('') + '</div>';
    }
    function htmlArrets(v, i) {
        const liste = v.adresses.map((a, k) => ({ a, k })).filter(x => x.a.trouve && arretLoin(x.a));
        if (!liste.length) return '';
        return '<h4>' + esc(t('arrT', nb(liste.length), nb(seuilArret()))) + '</h4><div class="wbc-nums">' + liste.map(({ a, k }) =>
            '<button type="button" class="wbc-num arret" data-arretgo="' + i + ':' + k + '" title="' + esc(t('arrTip', nb(a.ea))) + '">' +
            esc(a.brut) + ' · +' + esc(nb(a.ea)) + '\u00a0m</button>').join('') + '</div>';
    }
    function htmlNums(v, i) {
        const plus = droitGeste('hn1') && !hnEnCours && nomOkHn(v) && Core.quotaHn(lireHorodatages(), Date.now()).reste > 0;
        return '<div class="wbc-nums">' + v.adresses.map((a, k) => {
            if (a.trouve) return '';
            const p = plus && hnPosable(a);
            const tip = a.hnVersRpp ? t('rhnVersRppTipPose') : a.hnPose ? t('ajHnPoseTip') : a.hnEnregistre ? t('ajHnSavedTip') : a.suffixe ? t('tipSuf', a.suffixe) + (p ? ' — ' + t('tipGoAdd') : '') : p ? t('tipGoAdd') : t('tipGo');
            const num = '<button type="button" class="wbc-num' + (a.hnPose ? ' pose' : a.hnEnregistre ? ' enregistre' : a.suffixe ? ' suffixe' : '') + (vue.curseur === k ? ' courant' : '') + '" data-adr="' + i + ':' + k + '" title="' + esc(tip) + '"' + (a.hnPose || a.hnEnregistre ? ' aria-label="' + esc(a.brut + ' — ' + tip) + '"' : '') + '>' + esc(a.brut) + (a.suffixe ? ' ≠ ' + esc(a.suffixe) : '') +
                (a.hnPose ? '<span class="wbc-num-etat" aria-hidden="true">&#x271A;</span>' : a.hnEnregistre ? '<span class="wbc-num-etat" aria-hidden="true">&#x2713;</span>' : '') + '</button>';
            // Segment probable non modifiable : « + » grisé, motif en infobulle ; il reste focalisable pour que l'infobulle se lise.
            const bl = p && a.hn1Bloque;
            const plusB = !p ? '' : '<button type="button" class="wbc-num-plus' + (bl ? ' sugg' : '') + '" data-hn1="' + i + ':' + k + '" title="' + esc(bl ? motifHn1(bl) : t('ajHn1') + ' — ' + t('ajHn1Tip')) + '" aria-label="' + esc(t('ajHn1') + ' ' + a.brut + (bl ? ' — ' + motifHn1(bl) : '')) + '">+</button>';
            const banB = boutonBanNum(a, i, k);
            // Même conteneur avec ou sans « + » : une pose ne déplace pas les pastilles voisines.
            return '<span class="wbc-num-g' + (vue.curseur === k ? ' courant' : '') + '">' + num + plusB + banB + '</span>';
        }).join('') + '</div>';
    }
    const dejaTxt = x => x ? ' ' + t('sigDeja', dateCourte(Date.parse(x.date)), t('sigSt', x.statut)) : '';
    // Jamais grisé : sans identifiant, la carte BAN ; commune qui refuse, la fiche officielle (contact de la mairie).
    const premierPoint = v => (v.adresses || []).find(a => Number.isFinite(a.lon) && Number.isFinite(a.lat)) || null;
    // Boutons d'outils de la voie : icône + pastille de compteur (masquée à zéro) ; libellé complet en infobulle et en nom accessible.
    const ICONES_OUTILS = {
        select: '<path d="M3.5 2l9 5.6-4 1.1 2.4 4.4-1.8 1-2.4-4.4-3.2 2.8z" fill="currentColor"/>',
        add: '<path d="M4.5 4.5v7M1 8h7M11.5 4.5v7M8 8h7" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" fill="none"/>',
        next: '<path d="M2.5 3l7.5 5-7.5 5z" fill="currentColor"/><rect x="11" y="3" width="2.4" height="10" rx=".6" fill="currentColor"/>',
        mail: '<rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M2 4.5l6 4.6 6-4.6" stroke="currentColor" stroke-width="1.5" fill="none"/>',
        flag: '<path d="M3.5 14.5V2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M4 2.5h8.5l-2 3 2 3H4z" fill="currentColor"/>',
        map: '<path d="M1.5 3.8l4-1.6 5 1.6 4-1.6v10l-4 1.6-5-1.6-4 1.6z M5.5 2.2v10 M10.5 3.8v10" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" fill="none"/>',
        contour: '<path d="M2.5 5l5-3 6 3.5-1.5 7-7.5 1.5z" stroke="currentColor" stroke-width="1.6" stroke-dasharray="2.4 1.6" stroke-linejoin="round" fill="none"/>',
    };
    function boutonOutil(act, ico, libelle, aide, n, inactif, actif) {
        const titre = aide ? libelle + ' — ' + aide : libelle;
        return '<button type="button" class="wbc-ibtn wbc-btn-neutral' + (actif ? ' on' : '') + '" data-act="' + act + '" title="' + esc(titre) + '" aria-label="' + esc(libelle) + '"' +
            (actif != null ? ' aria-pressed="' + !!actif + '"' : '') + (inactif ? ' disabled' : '') + '>' +
            '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">' + ICONES_OUTILS[ico] + '</svg>' +
            (n ? '<span class="wbc-ibtn-n" aria-hidden="true">' + esc(nb(n)) + '</span>' : '') + '</button>';
    }
    function boutonBanVoie(v) {
        const id = v.idVoie || '', st = statutSignalement(id.slice(0, 5)), p = premierPoint(v);
        if (!id && !p) return '';
        const off = !!(id && st && st.off);
        const lib = !id ? t('banMap') : off ? t('banMairie') : t('banVoie');
        const tip = !id ? t('banNoKey') : off ? t('banOff', st.message) : t('banVoieTip') + (v.idVoieDouble ? ' ' + t('banAmbig') : '') + dejaTxt(resultat && Core.dernierSignalement(sigListe(resultat), v.uidV));
        return boutonOutil('banvoie', !id ? 'map' : off ? 'mail' : 'flag', lib, tip, 0, false);
    }
    function boutonBanNum(a, i, k) {
        const avecCle = !!Core.lienSignalement(a.cle);
        if (!avecCle && !Core.lienCarteBan(a.lon, a.lat)) return '';
        const st = avecCle ? statutSignalement(Core.inseeCle(a.cle)) : null;
        const tip = !avecCle ? t('banNoKey') : st && st.off ? t('banOff', st.message)
            : t('banNumTip', a.brut) + (a.cleDouble ? ' ' + t('banAmbig') : '') + dejaTxt(resultat && Core.dernierSignalement(sigListe(resultat), a.uidA));
        return '<button type="button" class="wbc-num-plus wbc-num-ban" data-banadr="' + i + ':' + k + '" title="' + esc(tip) + '" aria-label="' + esc(t('banVoie') + ' ' + a.brut) + '">&#x2691;</button>';
    }
    function ligneSig(x, k) {
        const dem = x.demande.map(d => t('sigDem', d.k, d.v)).join(' · ');
        return '<li class="wbc-sig-l"><span class="wbc-sig-st ' + esc(x.statut.toLowerCase()) + '">' + esc(dateCourte(Date.parse(x.date)) + ' · ' + t('sigSt', x.statut)) + '</span>' +
            '<button type="button" class="wbc-num sig" data-sig="' + k + '"' + (Number.isFinite(x.lon) ? '' : ' disabled') + '><bdi>' + esc(x.libelle || t('sigDem', x.demande[0].k)) + '</bdi></button>' +
            '<span>' + esc(dem) + '</span>' + (x.comment ? '<span class="wbc-sig-c">«\u00a0' + esc(x.comment.length > 200 ? x.comment.slice(0, 199) + '…' : x.comment) + '\u00a0»</span>' : '') +
            (x.motif ? '<span class="wbc-sig-m">' + esc(t('sigMotif', x.motif)) + '</span>' : '') + '</li>';
    }
    function htmlSansNomBan(r) {
        const l = r.sansNomBan || [];
        if (!l.length) return '';
        const nAdr = l.reduce((x, v) => x + v.ban, 0);
        return '<details class="wbc-extra wbc-snb"><summary title="' + esc(t('snbTip')) + '">' + esc(t('snbT', nb(l.length), nb(nAdr))) + '</summary><ul>' + l.map((v, k) => {
            const st = v.idVoie ? statutSignalement(v.idVoie.slice(0, 5)) : null, off = !!(st && st.off);
            const lib = !v.idVoie ? t('banMap') : off ? t('banMairie') : t('banVoie');
            const tip = !v.idVoie ? t('banNoKey') : off ? t('banOff', st.message) : t('banVoieTip');
            const nums = v.nums.slice(0, 6).join(', ') + (v.nums.length > 6 ? '…' : '');
            return '<li><span><bdi>' + esc(v.nom) + '</bdi> <small>' + esc(v.idVoie || '') + '</small></span>' +
                '<button type="button" class="wbc-num sig" data-snb="' + k + '" title="' + esc(t('tipGo')) + '">' + esc(nb(v.ban) + ' · ' + nums) + '</button>' +
                '<span class="wbc-sig-c">' + esc(v.nomProche ? t('snbPres', v.nomProche) : t('snbNone')) + '</span>' +
                '<button type="button" class="wbc-btn wbc-btn-neutral wbc-suivant" data-snbsig="' + k + '" title="' + esc(tip) + '">' + esc(lib) + '</button></li>';
        }).join('') + '</ul></details>';
    }
    function htmlSigCommune(r) {
        const l = sigListe(r);
        if (!l.length) return '';
        const att = l.filter(x => x.statut === 'PENDING').length;
        return '<details class="wbc-extra wbc-sig"><summary title="' + esc(t('sigTip')) + '">' + esc(t('sigT', nb(l.length), att ? nb(att) : '')) + '</summary><ul>' + l.map(ligneSig).join('') + '</ul></details>';
    }
    function htmlSigVoie(v, r) {
        const l = sigListe(r), m = Core.signalementsVoie(l, v);
        if (!m.length) return '';
        return '<h4>' + esc(t('sigVoieT', nb(m.length))) + '</h4><ul class="wbc-sig-voie">' + m.map(x => ligneSig(x, l.indexOf(x))).join('') + '</ul>';
    }
    function htmlCommune(r) {
        const T = totauxVus(r), c = r.commune;
        const vs = r.voies.filter(v => !vue.deleguee || v.deleguee === vue.deleguee);
        const nF = { todo: vs.filter(v => v.presents < v.ban).length, name: vs.filter(v => v.statutNom !== 'identique' && v.statutNom !== 'alternatif' && v.statutNom !== 'parking').length,
            done: vs.filter(v => v.presents >= v.ban).length, all: vs.length };
        const detailNoms = [T.voiesAlt ? t('vAlt', nb(T.voiesAlt)) : '', T.voiesSansNom ? t('vNoName', nb(T.voiesSansNom)) : '', T.voiesAutreNom ? t('vOtherName', nb(T.voiesAutreNom)) : '',
            T.voiesRoute ? t('vRoute', nb(T.voiesRoute)) : '', T.voiesProche ? t('vType', nb(T.voiesProche)) : '', T.voiesSansSegment ? t('vNoSeg', nb(T.voiesSansSegment)) : ''].filter(x => x).join(' · ');
        const filtre = (k, lbl, tip) => '<button type="button" class="wbc-mode" role="radio" data-filtre="' + k + '" aria-checked="' + (vue.filtre === k) + '"' + (tip ? ' title="' + esc(tip) + '"' : '') + '>' +
            esc(lbl) + ' <span class="wbc-n">' + nb(nF[k]) + '</span></button>';
        const voies = voiesFiltrees(r);
        let h = (resDep ? '<button type="button" class="wbc-retour" data-act="dep" title="' + esc(t('tipDepBack')) + '"><span class="wbc-fl">&#x2190;</span> ' + esc(t('depBack')) + '</button>' : '') +
            '<div class="wbc-titre-l"><h3 class="wbc-titre"><bdi>' + esc(c.nom) + '</bdi> <small>' + esc(c.code) + '</small></h3><span class="wbc-actions">' +
            '<button type="button" class="wbc-btn wbc-btn-neutral" data-act="csv" title="' + esc(t('tipCsv')) + '">' + esc(t('exportCsv')) + '</button>' +
            '<button type="button" class="wbc-btn wbc-btn-neutral" data-act="noms" title="' + esc(t('namesCsvTip')) + '">' + esc(t('namesCsv')) + '</button>' + boutonCmp() +
            boutonOutil('contour', 'contour', t('contourBtn'), t('contourTip'), 0, !c.contour, !!opts.contour) + '</span></div>' + htmlMemoCommune(r) +
            (T.certSeules ? '<p class="wbc-ligne">' + esc(t('certNote', nb(T.ecartees))) + '</p>' : '') +
            (T.certSeules && !T.ban ? '<p class="wbc-vide wbc-err">' + esc(t('noCert', nb(T.adressesBan))) + '</p>' : '') +
            htmlKpis(T) + (cmpCommune(r) ? ligneCmp(cmpCommune(r), r.totaux) : '') +
            '<p class="wbc-note" id="wbc-calque-note" hidden></p>' +
            '<div class="wbc-outils"><div class="wbc-filtres" role="radiogroup">' + filtre('todo', t('fTodo'), t('voiesLine', nb(T.voiesCompletes), nb(T.voies))) +
            filtre('name', t('fName'), detailNoms) + filtre('done', t('fDone'), t('tipFDone')) + filtre('all', t('fAll'), t('tipFAll')) + '</div>' +
            selectDeleguee(r) +
            '<div class="wbc-rech' + (vue.texte ? ' actif' : '') + '"><span class="wbc-loupe" aria-hidden="true">&#x1F50D;</span>' +
            '<input type="search" class="wbc-champ" id="wbc-filtre-txt" placeholder="' + esc(t('filterPh')) + '" aria-label="' + esc(t('filterPh')) + '" autocomplete="off" spellcheck="false">' +
            (vue.texte ? '<button type="button" class="wbc-rech-x" data-act="filtrex" title="' + esc(t('filterClear')) + '" aria-label="' + esc(t('filterClear')) + '">&#x2715;</button>' +
                '<span class="wbc-rech-n">' + esc(t('filterCount', nb(voies.length), nb(nF[vue.filtre]))) + '</span>' : '') + '</div></div>';
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
                if (ouvert) h += '<tr class="wbc-detail"><td colspan="' + nCol + '"><p class="wbc-voie-outils">' + boutonOutil('selvoie', 'select', t('selSegs', nb((v.segs || []).length)), t('selSegsTip'), (v.segs || []).length, !(v.segs || []).length) +
                    (droitGeste('voie') ? boutonHn(v) : '') + boutonBanVoie(v) + '</p>' +
                    (droitGeste('hn1') && vue.hnMsg && vue.hnMsg.i === i ? '<p class="wbc-hn-msg' + (vue.hnMsg.err ? ' erreur' : '') + '" role="status">' + esc(vue.hnMsg.txt) + '</p>' : '') + '<h4>' + esc(t('missingT')) +
                    (v.manquants.length ? ' <button type="button" class="wbc-btn wbc-btn-neutral wbc-suivant" data-act="suivant" title="' + esc(t('tipNext')) + '">' + esc(t('nextMissing')) + ' <span class="wbc-fl">&#x25B6;</span></button>' : '') + '</h4>' +
                    (v.manquants.length ? htmlNums(v, i)
                        : '<p class="wbc-note">' + esc(t('noneMissing')) + '</p>') + (droitGeste('conv') ? htmlRpps(v, i) : '') + htmlArrets(v, i) + htmlSigVoie(v, r) + '</td></tr>';
            }
            h += '</tbody></table>';
        }
        const extras = htmlExtras(r.enTrop, 'trop', t('extraT', nb(r.enTrop.length))) + htmlExtras(r.doublons, 'doublon', t('dupT', nb(r.doublons.length))) + htmlSansNomBan(r) + htmlSigCommune(r);
        if (extras) h += '<div class="wbc-extras">' + extras + '</div>';
        return h;
    }

    function selectDeleguee(r) {
        const dels = [...new Set(r.voies.map(v => v.deleguee).filter(Boolean))].sort((a, b) => a.localeCompare(b, LOCALES[_lang]));
        if (!dels.length) return '';
        return '<select class="wbc-champ wbc-del-sel" id="wbc-deleguee" aria-label="' + esc(t('delAll')) + '"><option value="">' + esc(t('delAll')) + '</option>' +
            dels.map(d => '<option value="' + esc(d) + '"' + (vue.deleguee === d ? ' selected' : '') + '>' + esc(d) + '</option>').join('') + '</select>';
    }

    function boutonBanTrop(x, k) {
        if (!resultat || !Core.lienAlerte(x.lon, x.lat)) return '';
        const st = statutSignalement(resultat.commune.code);
        const tip = st && st.off ? t('banOff', st.message) : t('banTropTip', x.brut + (x.rue ? ' ' + x.rue : '')) + dejaTxt(Core.alerteProche(sigListe(resultat), x.lon, x.lat));
        return '<button type="button" class="wbc-num-plus wbc-num-ban" data-bantrop="' + k + '" title="' + esc(tip) + '" aria-label="' + esc(t('banVoie') + ' ' + x.brut) + '">&#x2691;</button>';
    }
    function htmlExtras(liste, cle, titre) {
        if (!liste.length) return '';
        const parRue = new Map();
        liste.forEach((x, k) => { const r = x.rue || '∅'; if (!parRue.has(r)) parRue.set(r, []); parRue.get(r).push(k); });
        const rues = [...parRue.keys()].sort((a, b) => a.localeCompare(b, LOCALES[_lang]));
        return '<details class="wbc-extra"><summary>' + esc(titre) + '</summary><ul>' + rues.map(r =>
            '<li><span><bdi>' + (r === '∅' ? '<i>' + esc(t('nameNone')) + '</i>' : esc(r)) + '</bdi></span>' +
            parRue.get(r).map(k => { const b = '<button type="button" class="wbc-num trop" data-' + cle + '="' + k + '" title="' + esc(t(liste[k].type === 'HN' ? 'tipHN' : 'tipRPP')) + '">' + esc(liste[k].brut) + '</button>';
                const f = cle === 'trop' ? boutonBanTrop(liste[k], k) : '';
                return f ? '<span class="wbc-num-g">' + b + f + '</span>' : b; }).join('') + '</li>').join('') +
            '</ul></details>';
    }

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
            // Repli : sélection d'un champ caché (presse-papiers refusé hors geste, ou navigateur ancien).
            try {
                const z = document.createElement('textarea');
                z.value = txt; z.style.position = 'fixed'; z.style.opacity = '0';
                document.body.appendChild(z); z.select(); ok = document.execCommand('copy'); z.remove();
            } catch (e2) { ok = false; }
        }
        bouton.textContent = ok ? '✓ ' + t('copyDone') : t('copyFail');
        annoncer(ok ? t('copyDone') : t('copyFail'));
        setTimeout(() => { if (bouton.isConnected) bouton.innerHTML = LIB_COPIER; }, 2000);
    }
    // Icône dessinée : « ⧉ » manque à bien des polices.
    const LIB_COPIER = '<svg class="wbc-ico-copie" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true" focusable="false">' +
        '<rect x="5.5" y="5.5" width="8.5" height="8.5" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
        '<path d="M10.5 3.2V3a1.5 1.5 0 0 0-1.5-1.5H3A1.5 1.5 0 0 0 1.5 3v6A1.5 1.5 0 0 0 3 10.5h.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg> Discord';
    const boutonCopier = () => droitChamp && !jeton ? '<button type="button" class="wbc-btn wbc-btn-neutral wbc-copier" data-act="copier" title="' + esc(t('copyTip')) + '" aria-label="' + esc(t('copyBtn') + ' — Discord') + '">' + LIB_COPIER + '</button>' : '';

    function htmlDepartement(d) {
        const ok = d.communes.filter(c => c.totaux);
        const T = ok.reduce((s, c) => {
            for (const k of ['ban', 'cert', 'hn', 'rpp', 'presents', 'manquants', 'enTrop', 'doublons', 'suffixes', 'eloignes']) s[k] += c.totaux[k] || 0;
            return s;
        }, { ban: 0, cert: 0, hn: 0, rpp: 0, presents: 0, manquants: 0, enTrop: 0, doublons: 0, suffixes: 0, eloignes: 0 });
        T.arretsHist = Core.sommeHisto(ok.map(c => c.totaux.arretsHist));
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
        if (r && r.voies) for (const v of r.voies) if (v.adresses) v.adresses.sort(Core.ordreNum);
        const autre = !resultat || !r || resultat.commune.code !== r.commune.code;
        resultat = r;
        vue.ouverte = null;
        vue.texte = '';
        vue.deleguee = '';
        vue.curseur = -1;
        tropMontre = null;
        rendre();
        majCalque();
        // cocherCalque() ne fait rien si la case est déjà cochée : la BAN de la vue est alors relue ici (sinon son bandeau,
        // « zoomez au niveau 18 » posé pendant l'analyse, restait jusqu'au prochain mouvement de la carte).
        if (autre && r && !calqueVisible) cocherCalque(); else demanderDirect(true);
        $('#wbc-corps').scrollTop = 0;
        if (calculGarde && calculGarde.res !== r) calculGarde = null;
        releverSignatures(false).catch(e => log('renommage : ' + e.message));
    }

    // Voies renommées : signature (principal + alternatifs) des segments de la commune, relevée sur l'état ENREGISTRÉ (le modèle
    // du SDK contient l'en-attente) ; une signature changée après enregistrement relance toute la commune.
    let renom = { res: null, sig: new Map() };
    let calculGarde = null;
    // Un segment est rendu par tout carreau qu'il traverse : une copie ancienne dans un autre carreau l'emporterait à la fusion.
    async function carreauxDesSegments(ids) {
        const cles = new Set();
        for (const id of ids) {
            let s = null;
            try { s = await sdk.DataModel.Segments.getById({ segmentId: id }); } catch (e) { }
            const c = s && s.geometry && s.geometry.coordinates;
            if (!c || !c.length) continue;
            let w = Infinity, so = Infinity, e = -Infinity, n = -Infinity;
            for (const [x, y] of c) { w = Math.min(w, x); e = Math.max(e, x); so = Math.min(so, y); n = Math.max(n, y); }
            for (let i = Math.floor(w / CARREAU); i <= Math.floor(e / CARREAU); i++)
                for (let j = Math.floor(so / CARREAU); j <= Math.floor(n / CARREAU); j++) cles.add(i + ':' + j);
        }
        return cles;
    }
    function segsSuivis(r) {
        const s = new Set();
        for (const v of r.voies || []) {
            for (const id of v.segs || []) s.add(id);
            for (const a of v.adresses || []) if (a.seg != null) s.add(a.seg);
        }
        return s;
    }
    const sigSeg = s => String(s.primaryStreetId) + '|' + (s.alternateStreetIds || []).slice().sort((x, y) => x - y).join(',');
    async function signaturesChargees(r, ids) {
        const suivis = segsSuivis(r), m = new Map();
        let l = [];
        if (ids) {
            for (const id of ids) {
                if (!suivis.has(id)) continue;
                try { const s = await sdk.DataModel.Segments.getById({ segmentId: id }); if (s) l.push(s); } catch (e) { }
            }
        } else {
            try { l = (await sdk.DataModel.Segments.getAll()) || []; } catch (e) { log('renommage : ' + e.message); }
        }
        for (const s of l) if (s && suivis.has(s.id)) m.set(s.id, sigSeg(s));
        return m;
    }
    // `charges` : segments arrivés du serveur (état enregistré, même si d'autres modifications attendent).
    async function releverSignatures(charges) {
        const r = resultat;
        if (!r || !r.voies) return;
        if (renom.res !== r) renom = { res: r, sig: new Map() };
        // Référence relevée une seule fois par commune : sinon un segment créé puis enregistré y entrerait avant d'être comparé.
        if (!charges && (segsVus.code !== (r.commune && r.commune.code) || !segsVus.init)) await releverSegsVus(r);
        if (!charges) {
            let attente = 1;
            try { attente = await sdk.Editing.getUnsavedChangesCount(); } catch (e) { }
            if (attente) return;
        }
        const m = await signaturesChargees(r, charges || null);
        if (renom.res !== r) return;
        for (const [id, sg] of m) if (!renom.sig.has(id)) renom.sig.set(id, sg);
    }
    // Segment enregistré (id positif) jamais vu, à moins de 80 m d'une adresse sans segment : relance la commune comme un renommage.
    let segsVus = { code: null, ids: new Set() };
    async function segsNeufsPresDesOrphelines(r) {
        const code = r.commune && r.commune.code;
        if (segsVus.code !== code) segsVus = { code, ids: new Set() };
        let l = [];
        try { l = (await sdk.DataModel.Segments.getAll()) || []; } catch (e) { log('segments neufs : ' + e.message); }
        const neufs = [];
        for (const s of l) {
            if (!s || segsVus.ids.has(s.id)) continue;
            if (!(s.id > 0)) continue; // pas encore enregistré
            segsVus.ids.add(s.id);
            const c = s.geometry && s.geometry.coordinates;
            if (c && c.length >= 2) neufs.push({ id: s.id, coords: c });
        }
        if (!segsVus.init) { segsVus.init = true; return { ids: new Set(), voies: 0 }; }
        return Core.segsPresDesOrphelines(r.voies, neufs);
    }
    async function releverSegsVus(r) {
        const code = r && r.commune && r.commune.code;
        if (!code) return;
        if (segsVus.code !== code) segsVus = { code, ids: new Set() };
        let l = [];
        try { l = (await sdk.DataModel.Segments.getAll()) || []; } catch (e) { return; }
        for (const s of l) if (s && s.id > 0) segsVus.ids.add(s.id);
        segsVus.init = true;
    }
    async function verifierRenommages() {
        const r = resultat;
        if (!r || renom.res !== r || jeton) return;
        const m = await signaturesChargees(r, null);
        if (resultat !== r || renom.res !== r || jeton) return;
        const changes = new Set();
        for (const [id, sg] of m) {
            const avant = renom.sig.get(id);
            if (avant != null && avant !== sg) changes.add(id);
            renom.sig.set(id, sg);
        }
        const neufs = await segsNeufsPresDesOrphelines(r);
        if (resultat !== r || renom.res !== r || jeton) return;
        for (const id of neufs.ids) changes.add(id);
        if (!changes.size) return;
        const n = neufs.voies + (r.voies || []).filter(v => (v.segs || []).some(id => changes.has(id)) ||
            (v.adresses || []).some(a => a.seg != null && changes.has(a.seg))).length;
        // Recalcul LOCAL : BAN gardée, seuls les carreaux des segments changés sont relus ; sans calcul gardé, analyse complète.
        const g = calculGarde && calculGarde.res === r && calculGarde.adresses ? calculGarde : null;
        if (g) {
            // Les carreaux des poses de WBC sont relus aussi, sinon le recalcul les repasserait « manquants ».
            const depuis = (r.memo && r.memo.date) || 0, segs = new Set(changes), cles = new Set();
            for (const x of lireHorodatages() || []) {
                if (!x || typeof x !== 'object' || !(x.t >= depuis)) continue;
                if (x.s != null) segs.add(x.s);
                if (typeof x.lon === 'number' && typeof x.lat === 'number') cles.add(Math.floor(x.lon / CARREAU) + ':' + Math.floor(x.lat / CARREAU));
            }
            for (const k of await carreauxDesSegments(segs)) cles.add(k);
            for (const k of cles) g.cache.carreaux.delete(k);
            for (const id of segs) g.cache.hn.delete(id);
        }
        log('renommage : ' + changes.size + ' segment(s) changé(s), ' + n + ' voie(s) — ' + r.commune.nom + (g ? ' recalculée en local' : ' réanalysée'));
        const t0 = Date.now();
        await lancer(null, j => lancerCommune(j, r.commune, g ? { adresses: g.adresses, cache: g.cache } : null), !!(r.memo && r.memo.cert));
        log('renommage : ' + (Date.now() - t0) + ' ms');
        if (resultat && resultat !== r && resultat.commune.code === r.commune.code)
            statut(neufs.ids.size && neufs.ids.size === changes.size ? t('renomNeuf', Math.max(neufs.voies, 1)) : t('renomRelance', Math.max(n, 1)));
    }

    const MAX_POINTS = 3000;
    let calqueSuitLaVue = false;
    let tropMontre = null;
    // SDK async : un calcul plus tardif peut finir plus tôt, seul le dernier dessine.
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
            // Après un Ctrl+clic sur le bouton de carte, fenêtre fermée : manquants, trouvés et en trop, sans réglage à faire.
            if (opts.carte || carteSeule) {
                let tous = [];
                voies.forEach(v => v.adresses.forEach(a => { if (!a.trouve && !a.hnPose) tous.push({ lon: a.lon, lat: a.lat, etat: 'manquant', lbl: a.brut, ad: a, voie: v }); }));
                if (opts.trouves || carteSeule) voies.forEach(v => v.adresses.forEach(a => { if (a.trouve) tous.push({ lon: a.lon, lat: a.lat, etat: 'present', lbl: a.brut, ad: a, voie: v }); }));
                if (!vue.deleguee) resultat.enTrop.forEach(x => tous.push({ lon: x.lon, lat: x.lat, etat: 'trop', lbl: x.brut, trop: x }));
                if (tous.length > MAX_POINTS) {
                    // Trop de points : un sur k RÉPARTI sur la vue (couper la fin viderait des rues entières), et on le dit.
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
                // Tracés avant les points, pour passer dessous.
                v.adresses.forEach(a => { if (a.trouve && a.wlon != null) pts.unshift({ ligne: [[a.lon, a.lat], [a.wlon, a.wlat]], etat: 'lien' }); });
                v.adresses.forEach(a => { if (!a.trouve && !a.hnPose && a.plon != null) pts.unshift({ ligne: [[a.lon, a.lat], [a.plon, a.plat]], etat: 'lienManq' }); });
                v.adresses.forEach(a => { if (a.trouve && arretLoin(a)) pts.unshift({ ligne: [[a.wlon, a.wlat], [a.alon, a.alat]], etat: 'lienArret' }); });
                v.adresses.forEach(a => { if ((a.trouve && !((opts.carte || carteSeule) && (opts.trouves || carteSeule))) || (!a.trouve && !a.hnPose && !(opts.carte || carteSeule))) pts.push({ lon: a.lon, lat: a.lat, etat: a.trouve ? 'present' : 'manquant', lbl: a.brut, ad: a, voie: v }); });
            }
            if (tropMontre) pts.push({ lon: tropMontre.lon, lat: tropMontre.lat, etat: 'trop', lbl: tropMontre.brut, trop: tropMontre });
            voies.forEach(w => w.adresses.forEach(a => { if (a.hnPose && (!a.trouve || a.rppHn || a.hnVersRpp)) pts.push({ lon: a.lon, lat: a.lat, etat: 'pose', lbl: a.brut, ad: a, voie: w }); }));
        }
        if (generation !== generationCalque) return;
        const n = ovEl && ovEl.querySelector('#wbc-calque-note');
        if (n) { n.textContent = note; n.hidden = !note; }
        dessiner(fenetreOuverte() || carteSeule ? pts : pts.filter(p => p.etat === 'pose'));
    }


    // Cellule commençant par = + - @ : FORMULE pour un tableur (CWE-1236), neutralisée par une apostrophe.
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
    const ecartDeNom = v => !(v.statutNom === 'identique' || v.statutNom === 'alternatif' || v.statutNom === 'parking') || v.nomAbsent;
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

    // IndexedDB : tables `communes`, `deps`, `index` ; clé = code + filtre des certifiées.
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
    // FORMAT du résultat gardé : à relever à chaque changement du CALCUL (un format antérieur n'est pas rouvert tel quel).
    const MEMO_FMT = 2;
    const memoAJour = o => !!o && o.fmt === MEMO_FMT;
    const dateHeure = ms => new Intl.DateTimeFormat(LOCALES[_lang] || 'en', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(ms);

    async function garderCommune(r, viaDep) {
        if (!r || !r.memo) return;
        const cle = cleMemo(r.commune.code, r.memo.cert);
        try {
            await Memo.ecrire('communes', cle, Object.assign({}, r, { verif: undefined, fmt: MEMO_FMT }));
            await Memo.ecrire('index', cle, { cle, type: 'commune', code: r.commune.code, nom: r.commune.nom, cert: r.memo.cert, date: r.memo.date,
                ban: r.totaux.ban, presents: r.totaux.presents, viaDep: viaDep || '', fmt: MEMO_FMT });
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

    const ouvrirMemoCommune = (code, cert) => attendre(ouvrirMemoCommuneBrut(code, cert));
    async function ouvrirMemoCommuneBrut(code, cert) {
        let r = null;
        try { r = await Memo.lire('communes', cleMemo(code, cert)); } catch (e) { log('mémoire : ' + e.message); }
        if (!r || !r.memo) return false;
        if (!memoAJour(r)) { lancer(null, j => lancerCommune(j, r.commune), !!r.memo.cert); return true; }
        r.verif = {};
        resCommunes.set(code, r);
        cmp = null;
        montrerCommune(r);
        verifierBan([r]);
        return true;
    }
    const ouvrirMemoDep = (code, cert) => attendre(ouvrirMemoDepBrut(code, cert));
    async function ouvrirMemoDepBrut(code, cert) {
        let d = null;
        try { d = await Memo.lire('deps', cleMemo(code, cert)); } catch (e) { log('mémoire : ' + e.message); }
        if (!d) return false;
        resCommunes.clear();
        resDep = { dep: d.dep, certSeules: d.certSeules, date: d.date, communes: d.communes.map(l => Object.assign(l, { verif: {} })) };
        resultat = null;
        cocherCalque();
        demanderDirect(true);
        cmp = null;
        dessiner([]);
        rendre();
        return true;
    }
    const ouvrirCommuneDep = code => attendre(ouvrirCommuneDepBrut(code));
    async function ouvrirCommuneDepBrut(code) {
        if (resCommunes.has(code)) { montrerCommune(resCommunes.get(code)); return; }
        const l = resDep && resDep.communes.find(x => x.commune.code === code);
        if (!l || !l.memo) return;
        let r = null;
        try { r = await Memo.lire('communes', cleMemo(code, resDep.certSeules)); } catch (e) { log('mémoire : ' + e.message); }
        if (!r) return;
        if (!memoAJour(r)) { lancer(null, j => lancerCommune(j, l.commune), !!resDep.certSeules); return; }
        r.verif = l.verif || (l.verif = {});
        resCommunes.set(code, r);
        montrerCommune(r);
    }

    let verifBan = null;
    let rendreMemoTimer = null;
    const rendreBientot = () => { if (!rendreMemoTimer) rendreMemoTimer = setTimeout(() => { rendreMemoTimer = null; rendre(); }, 600); };
    async function verifierBan(objs) {
        const cibles = objs.filter(o => o.memo && o.memo.etag && !o.memo.etag.split('|').some(x => !x));
        if (!cibles.length) return;
        const moi = verifBan = { i: 0, n: cibles.length };
        rendre();
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
                    const e = await pays.empreinte(o.commune.code);
                    o.verif.ban = e === o.memo.etag ? 'ok' : 'maj';
                    if (o.verif.ban === 'maj') o.verif.banDate = await pays.dateRevision(o.commune.code);
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

    // 🔴 Un HN n'a pas de date et l'ajouter ne change pas celle de son segment : numéros comparés un par un, résumés en empreinte.
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
            const pareil = !!a && ['segN', 'segMax', 'hn', 'rppN', 'rppMax', 'hnN', 'hnSig'].every(k => a[k] === undefined || e[k] === a[k]);
            o.verif.wme = pareil ? 'ok' : 'maj';
            const recent = Math.max(e.segMax, e.rppMax);
            o.verif.wmeDate = !pareil && recent > (o.memo.date || 0) ? recent : null;
            rendreBientot();
        }
    }

    const bout = (cls, txt) => '<span class="' + cls + '">' + esc(txt) + '</span>';
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
            (jeton ? '' : '<span class="wbc-memo-btns"><button type="button" class="wbc-btn wbc-btn-neutral" data-act="memomaj" title="' + esc(t('memoUpdTip')) + '">' + esc(t('memoUpd')) + '</button></span>') + '</div>';
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
            (jeton || verifBan ? '' : '<span class="wbc-memo-btns"><button type="button" class="wbc-btn wbc-btn-neutral" data-act="memomaj" title="' + esc(t('memoUpdDepTip')) + '">' + esc(t('memoUpd')) + '</button></span>') + '</div>';
    }
    // « Mettre à jour » : une commune est relancée (BAN et WME relus) ; un département est vérifié (BAN puis WME) et ses communes signalées relancées.
    async function mettreAJour() {
        if (jeton) return;
        if (resultat && resultat.memo) { await lancer(null, j => lancerCommune(j, resultat.commune), resultat.memo.cert); return; }
        const dep = resDep;
        if (!dep || resultat) return;
        const objs = dep.communes.filter(l => l.memo);
        if (!objs.length) return;
        // Chaque étape vérifie que le même département est toujours affiché : une autre analyse lancée pendant la
        // vérification BAN (qui ne bloque pas « Analyser ») ou une commune ouverte entre-temps arrêtent l'enchaînement.
        const meme = () => resDep === dep && !resultat && !jeton;
        if (!verifBan) await verifierBan(objs);
        if (!meme()) return;
        const r = await lancer(null, j => verifierWme(j, objs), dep.certSeules);
        if (!r || !r.ok || !meme()) return;
        const l = dep.communes.filter(x => x.verif && (x.verif.ban === 'maj' || x.verif.wme === 'maj'));
        if (l.length) await lancer(l, null, dep.certSeules);
    }
    function actionMemo(a) {
        if (a === 'memomaj') mettreAJour().catch(e => log('mise à jour : ' + e.message));
    }

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


    // >>> DSX-DOCK 1.0.4 — rangement partagé des boutons de carte des scripts de DrSlump34.
    // Copie IDENTIQUE dans chaque script (source : Projets/DSX-Dock/dsx-dock.js ; contrôle :
    // node Projets/DSX-Dock/verifier-copies.js). Ne pas modifier ici : modifier la source, puis recopier.
    //
    // Chaque script pose son bouton dans la colonne de droite de WME, et à sept ils débordaient sur la
    // règle, Street View et le zoom (constaté le 31/10/2026). Ce module garde visibles les boutons qui
    // tiennent, et range les autres derrière un bouton « ⋯ » qui les montre dans un panneau.
    //  - Il ne parle que par le DOM : les scripts tournent chacun dans leur bac à sable.
    //  - Un bouton se déclare par ses attributs : data-dsx-dock (identifiant), data-dsx-nom (libellé),
    //    data-dsx-actif="1" quand son script est en cours d'usage (jamais rangé alors).
    //  - Le module de la version la plus récente range ; les autres se taisent (attributs sur <html>).
    //  - Le VRAI élément est déplacé, jamais recréé : ses écouteurs suivent.
    //  - Priorité pour rester visible : actif, puis épinglé (📌 dans le panneau), puis ordre d'arrivée.
    const dsxDock = (() => {
        const V = '1.0.4';
        const cmp = (a, b) => {
            const x = String(a).split('.').map(Number), y = String(b).split('.').map(Number);
            for (let i = 0; i < 3; i++) { const d = (x[i] || 0) - (y[i] || 0); if (d) return d < 0 ? -1 : 1; }
            return 0;
        };
        const moi = Math.random().toString(36).slice(2);
        const proprio = () => document.documentElement.getAttribute('data-dsx-dock-proprio') === moi;
        const CLE_EPINGLES = 'dsx.dock.epingles';
        const lireEpingles = () => { try { const a = JSON.parse(localStorage.getItem(CLE_EPINGLES) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } };
        const ecrireEpingles = a => { try { localStorage.setItem(CLE_EPINGLES, JSON.stringify(a)); } catch (e) { } };
        const langue = () => { const l = String(document.documentElement.lang || navigator.language || 'en').toLowerCase(); return l.startsWith('pt') ? (l.includes('br') ? 'pt-BR' : 'pt') : (l.startsWith('iw') ? 'he' : l.slice(0, 2)); };
        const TXT = {
            en: { plus: n => n + ' more script button' + (n > 1 ? 's' : ''), titre: 'Other script buttons', epingler: 'Keep in the column', desepingler: 'Stop keeping in the column', aide: 'Right-click a button in the column to pin or unpin it.' },
            fr: { plus: n => n + ' autre' + (n > 1 ? 's' : '') + ' bouton' + (n > 1 ? 's' : '') + ' de script', titre: 'Autres boutons de scripts', epingler: 'Garder dans la colonne', desepingler: 'Ne plus garder dans la colonne', aide: 'Clic droit sur un bouton de la colonne pour l\'épingler ou le désépingler.' },
            de: { plus: n => n + ' weitere Skript-Schaltfläche' + (n > 1 ? 'n' : ''), titre: 'Weitere Skript-Schaltflächen', epingler: 'In der Leiste behalten', desepingler: 'Nicht mehr in der Leiste behalten', aide: 'Rechtsklick auf eine Schaltfläche der Leiste, um sie anzuheften oder zu lösen.' },
            es: { plus: n => n + ' botón' + (n > 1 ? 'es' : '') + ' de script más', titre: 'Otros botones de scripts', epingler: 'Mantener en la columna', desepingler: 'Dejar de mantener en la columna', aide: 'Clic derecho en un botón de la columna para anclarlo o desanclarlo.' },
            it: { plus: n => n > 1 ? 'Altri ' + n + ' pulsanti di script' : 'Un altro pulsante di script', titre: 'Altri pulsanti di script', epingler: 'Tieni nella colonna', desepingler: 'Non tenere più nella colonna', aide: 'Clic destro su un pulsante della colonna per agganciarlo o sganciarlo.' },
            'pt-BR': { plus: n => 'Mais ' + n + ' botão' + (n > 1 ? 'ões' : '') + ' de script', titre: 'Outros botões de scripts', epingler: 'Manter na coluna', desepingler: 'Deixar de manter na coluna', aide: 'Clique com o botão direito num botão da coluna para fixá-lo ou desafixá-lo.' },
            pt: { plus: n => 'Mais ' + n + ' botão' + (n > 1 ? 'ões' : '') + ' de script', titre: 'Outros botões de scripts', epingler: 'Manter na coluna', desepingler: 'Deixar de manter na coluna', aide: 'Clique com o botão direito num botão da coluna para o fixar ou desafixar.' },
            he: { plus: n => n > 1 ? 'עוד ' + n + ' כפתורי סקריפטים' : 'עוד כפתור סקריפט אחד', titre: 'כפתורי סקריפטים נוספים', epingler: 'להשאיר בעמודה', desepingler: 'להפסיק להשאיר בעמודה', aide: 'לחיצה ימנית על כפתור בעמודה מצמידה אותו או מבטלת את ההצמדה.' },
        };
        const tx = () => TXT[langue()] || TXT.en;

        const STYLE = `
/* Certains scripts imposent un order CSS a leur bouton (PEU 100, WNA 99) : inscrits, c'est le dock qui
   decide de leur rang, et « ⋯ » reste le dernier de la colonne. Dans le panneau aussi : chaque ligne est
   une rangee flexible, et le bouton de PEU s'y affichait APRES son nom (signale par l'auteur, 31/10). */
.overlay-buttons-container [data-dsx-dock], #dsx-panneau [data-dsx-dock] { order: 0 !important; }
.overlay-buttons-container #dsx-plus { order: 1000 !important; }
.overlay-buttons-container [data-dsx-epingle="1"] { position: relative; }
.overlay-buttons-container [data-dsx-epingle="1"]::after { content: '\\1F4CC'; position: absolute; top: -5px; left: -5px; font-size: 13px; line-height: 1; pointer-events: none; }
#dsx-plus { position: relative; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; min-height: 0; margin: 0; padding: 0; border: none; border-radius: 50%; background: #fff; color: #37474f; font: 700 20px/1 Rubik, 'Open Sans', sans-serif; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,.3); }
#dsx-plus:hover, #dsx-plus[aria-expanded="true"] { box-shadow: 0 3px 10px rgba(0,0,0,.4); background: #e3f2fd; }
#dsx-plus:focus-visible { outline: 2px solid #1976d2; outline-offset: 2px; }
#dsx-plus[hidden] { display: none !important; }
#dsx-plus .dsx-compte { position: absolute; top: -4px; right: -4px; min-width: 18px; height: 18px; box-sizing: border-box; padding: 0 4px; border: 2px solid #fff; border-radius: 50px; background: #1976d2; color: #fff; font: 700 10px/14px Rubik, sans-serif; }
#dsx-panneau { position: fixed; z-index: 10040; min-width: 220px; max-height: calc(100vh - 16px); overflow: auto; box-sizing: border-box; padding: 8px; background: #fff; border: 1px solid #dde3ea; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,.22), 0 2px 8px rgba(0,0,0,.12); font: 12px Rubik, 'Open Sans', sans-serif; color: #2d3748; }
#dsx-panneau[hidden] { display: none !important; }
#dsx-panneau .dsx-titre { margin: 0 4px 6px; font-size: 11px; font-weight: 700; color: #1976d2; text-transform: uppercase; letter-spacing: .05em; }
#dsx-panneau .dsx-ligne { display: flex; align-items: center; gap: 8px; padding: 4px; border-radius: 8px; }
#dsx-panneau .dsx-ligne:hover { background: #f5f7f9; }
#dsx-panneau .dsx-ligne > :first-child { flex-shrink: 0; margin: 0 !important; }
#dsx-panneau .dsx-nom { flex: 1; min-width: 0; padding: 0; border: none; background: none; text-align: start; font: 600 12px Rubik, 'Open Sans', sans-serif; color: inherit; cursor: pointer; }
#dsx-panneau .dsx-epingle { width: 26px; height: 26px; min-height: 0; padding: 0; border: none; border-radius: 50%; background: none; cursor: pointer; opacity: .45; font-size: 13px; }
#dsx-panneau .dsx-epingle[aria-pressed="true"], #dsx-panneau .dsx-epingle:hover { opacity: 1; background: #e3f2fd; }
#dsx-panneau :focus-visible { outline: 2px solid #1976d2; outline-offset: 1px; }
#dsx-panneau .dsx-aide { margin: 6px 4px 0; font-size: 11px; color: #566372; }
html:is([data-wme-studio-theme="dark"],[data-wme-studio-theme="black"]) #dsx-panneau { background: var(--wme-studio-surface, #2b2f33); color: var(--wme-studio-text, #e8eaed); border-color: var(--wme-studio-border, #4a5056); }
html:is([data-wme-studio-theme="dark"],[data-wme-studio-theme="black"]) #dsx-panneau .dsx-ligne:hover { background: var(--wme-studio-hover, #454b52); }
html:is([data-wme-studio-theme="dark"],[data-wme-studio-theme="black"]) #dsx-panneau .dsx-aide { color: var(--wme-studio-text-secondary, #b6c0ca); }
/* Anneau de focus lisible sur fond sombre (#1976d2 n'y faisait que 2,93:1). */
html:is([data-wme-studio-theme="dark"],[data-wme-studio-theme="black"]) :is(#dsx-panneau :focus-visible, #dsx-plus:focus-visible) { outline-color: #64b5f6; }
html:is([data-wme-studio-theme="dark"],[data-wme-studio-theme="black"]) #dsx-panneau .dsx-titre { color: #64b5f6; }
`;

        let ordre = 0;
        let enCours = false;

        function plus(haut) {
            let b = document.getElementById('dsx-plus');
            if (!b) {
                b = document.createElement('button');
                b.id = 'dsx-plus';
                b.type = 'button';
                b.setAttribute('aria-haspopup', 'true');
                b.setAttribute('aria-expanded', 'false');
                b.setAttribute('aria-controls', 'dsx-panneau');
                b.innerHTML = '&#x22EF;<span class="dsx-compte"></span>';
                b.addEventListener('click', ev => { ev.stopPropagation(); basculerPanneau(); });
            }
            if (b.parentElement !== haut) haut.appendChild(b);
            return b;
        }

        function panneau() {
            let p = document.getElementById('dsx-panneau');
            if (!p) {
                p = document.createElement('div');
                p.id = 'dsx-panneau';
                p.setAttribute('role', 'dialog');
                p.hidden = true;
                p.innerHTML = '<p class="dsx-titre"></p><div class="dsx-liste"></div><p class="dsx-aide"></p>';
                p.addEventListener('click', ev => {
                    const ep = ev.target.closest('.dsx-epingle');
                    const ligne = ev.target.closest('.dsx-ligne');
                    if (!ligne) return;
                    const el = ligne.firstElementChild;
                    if (ep) {
                        const id = el.getAttribute('data-dsx-dock');
                        const a = lireEpingles();
                        ecrireEpingles(a.includes(id) ? a.filter(x => x !== id) : a.concat([id]));
                        planifier();
                        return;
                    }
                    if (ev.target.closest('.dsx-nom')) {
                        // Le libellé déclenche le vrai bouton du script, puis le panneau se ferme.
                        const cible = el.matches('button') ? el : (el.querySelector('button') || el);
                        fermerPanneau();
                        cible.click();
                    }
                });
                document.body.appendChild(p);
                // Un bouton rangé qui devient actif doit revenir dans la colonne.
                new MutationObserver(() => { if (!enCours) planifier(); }).observe(p, { attributes: true, attributeFilter: ['data-dsx-actif'], subtree: true });
            }
            if (p.getAttribute('data-dsx-v') !== V && proprio()) mettreANiveau(p);
            return p;
        }

        // Le panneau est partagé : il a pu être créé par la copie PLUS ANCIENNE d'un autre script, chargé
        // avant (mesuré le 31/10 : un panneau de la 1.0.3 sous un rangement 1.0.4). On lui ajoute ce que la
        // version apporte, sans rien doubler de ce qu'il a déjà (son écouteur de clic reste le sien).
        function mettreANiveau(p) {
            p.setAttribute('data-dsx-v', V);
            const titre = p.querySelector('.dsx-titre');
            if (titre) { titre.id = 'dsx-titre'; p.setAttribute('aria-labelledby', 'dsx-titre'); }
            // Le bouton rangé lui-même : le panneau se ferme AVANT son action, en phase de capture — le
            // script peut arrêter la propagation de son clic, et le panneau restait alors ouvert.
            p.addEventListener('click', ev => {
                const ligne = ev.target.closest('.dsx-ligne');
                if (ligne && ligne.firstElementChild && ligne.firstElementChild.contains(ev.target)) fermerPanneau();
            }, true);
        }

        function placerPanneau() {
            const p = document.getElementById('dsx-panneau'), b = document.getElementById('dsx-plus');
            if (!p || p.hidden || !b) return;
            const r = b.getBoundingClientRect();
            const rtl = getComputedStyle(document.body).direction === 'rtl';
            const w = p.offsetWidth, h = p.offsetHeight;
            const x = rtl ? r.right + 8 : r.left - 8 - w;
            const y = Math.max(8, Math.min(r.top, window.innerHeight - h - 8));
            p.style.left = Math.max(8, x) + 'px';
            p.style.top = y + 'px';
        }

        function basculerPanneau() { const p = panneau(); if (p.hidden) ouvrirPanneau(); else fermerPanneau(); }
        function ouvrirPanneau() {
            const p = panneau();
            p.hidden = false;
            const b = document.getElementById('dsx-plus');
            if (b) b.setAttribute('aria-expanded', 'true');
            placerPanneau();
            const premier = p.querySelector('.dsx-nom');
            if (premier) premier.focus();
        }
        function fermerPanneau() {
            const p = document.getElementById('dsx-panneau');
            if (!p || p.hidden) return;
            // Le focus était dans le panneau : il revient à « ⋯ », pas au <body>.
            const avaitFocus = p.contains(document.activeElement);
            p.hidden = true;
            const b = document.getElementById('dsx-plus');
            if (b) { b.setAttribute('aria-expanded', 'false'); if (avaitFocus && !b.hidden) b.focus(); }
        }

        // Le calcul : la place entre le haut de la colonne et la colonne du bas (règle, zoom), moins
        // ce qu'occupent les boutons qui ne sont pas les nôtres ; le pas d'un bouton vient de la mesure.
        function ranger() {
            if (!proprio() || enCours) return;
            const haut = document.querySelector('.overlay-buttons-container.top') || document.querySelector('.overlay-buttons-container');
            if (!haut) return;
            enCours = true;
            try {
                // La feuille est celle du module qui range : un script plus ancien chargé avant avait posé
                // la sienne, et la 1.0.4 rangeait avec la feuille de la 1.0.3 (épingle invisible, mesuré le 31/10).
                let st = document.getElementById('dsx-style');
                if (!st) { st = document.createElement('style'); st.id = 'dsx-style'; document.head.appendChild(st); }
                if (st.getAttribute('data-dsx-v') !== V) { st.textContent = STYLE; st.setAttribute('data-dsx-v', V); }
                const p = panneau(), liste = p.querySelector('.dsx-liste');
                const t = tx();
                p.querySelector('.dsx-titre').textContent = t.titre;
                p.querySelector('.dsx-aide').textContent = t.aide;
                // Un script qui a repris (ou reconstruit) son bouton laisse une ligne vide : on la retire.
                for (const l of [...liste.children]) if (!l.firstElementChild || !l.firstElementChild.hasAttribute('data-dsx-dock')) l.remove();
                const items = [...document.querySelectorAll('[data-dsx-dock]')].filter(el => el.id !== 'dsx-plus');
                for (const el of items) if (!el.hasAttribute('data-dsx-ordre')) el.setAttribute('data-dsx-ordre', String(Date.now() * 100 + (ordre++ % 100)));
                const rang = el => Number(el.getAttribute('data-dsx-ordre')) || 0;
                items.sort((a, b) => rang(a) - rang(b));
                const epingles = lireEpingles();
                const prio = el => el.getAttribute('data-dsx-actif') === '1' ? 0 : (epingles.includes(el.getAttribute('data-dsx-dock')) ? 1 : 2);
                // L'épingle se voit sur le bouton, dans la colonne comme dans le panneau.
                for (const el of items) {
                    const v = epingles.includes(el.getAttribute('data-dsx-dock')) ? '1' : '0';
                    if (el.getAttribute('data-dsx-epingle') !== v) el.setAttribute('data-dsx-epingle', v);
                }

                const cs = getComputedStyle(haut);
                const ecart = parseFloat(cs.rowGap) || parseFloat(cs.gap) || 12;
                const rh = haut.getBoundingClientRect();
                const bas = document.querySelector('.overlay-buttons-container.bottom');
                const rb = bas && bas.getBoundingClientRect();
                const limite = (rb && rb.height && rb.top > rh.top + 40 ? rb.top : window.innerHeight) - 8;
                let occupe = 0;
                for (const c of haut.children) {
                    if (c.id === 'dsx-plus' || c.hasAttribute('data-dsx-dock')) continue;
                    const r = c.getBoundingClientRect();
                    if (r.height) occupe += r.height + ecart;
                }
                const pas = 40 + ecart;
                const place = Math.max(0, Math.floor((limite - rh.top - occupe + ecart) / pas));
                let visibles;
                if (items.length <= place) visibles = new Set(items);
                else {
                    const n = Math.max(0, place - 1);      // une place pour « ⋯ »
                    const choix = items.slice().sort((a, b) => prio(a) - prio(b) || rang(a) - rang(b));
                    visibles = new Set(choix.filter((el, i) => i < n || prio(el) === 0));
                }
                // Appliquer en ne déplaçant que ce qui doit bouger (les déplacements réveillent les
                // observateurs des scripts).
                const b = plus(haut);
                for (const el of items) {
                    if (visibles.has(el)) {
                        const ligne = el.parentElement && el.parentElement.classList.contains('dsx-ligne') ? el.parentElement : null;
                        if (el.parentElement !== haut) haut.insertBefore(el, b);
                        if (ligne) ligne.remove();
                    } else if (!(el.parentElement && el.parentElement.classList.contains('dsx-ligne'))) {
                        const ligne = document.createElement('div');
                        ligne.className = 'dsx-ligne';
                        ligne.appendChild(el);
                        ligne.insertAdjacentHTML('beforeend', '<button type="button" class="dsx-nom"></button><button type="button" class="dsx-epingle">&#x1F4CC;</button>');
                        liste.appendChild(ligne);
                    }
                }
                // Lignes dans l'ordre d'arrivée, libellés et état des épingles à jour.
                for (const el of items.filter(x => !visibles.has(x))) {
                    const ligne = el.parentElement;
                    liste.appendChild(ligne);
                    ligne.querySelector('.dsx-nom').textContent = el.getAttribute('data-dsx-nom') || el.getAttribute('data-dsx-dock');
                    const ep = ligne.querySelector('.dsx-epingle');
                    const on = epingles.includes(el.getAttribute('data-dsx-dock'));
                    ep.setAttribute('aria-pressed', String(on));
                    ep.title = on ? t.desepingler : t.epingler;
                    ep.setAttribute('aria-label', ep.title);
                }
                const caches = items.length - visibles.size;
                b.hidden = caches === 0;
                if (b.nextElementSibling) haut.appendChild(b);
                b.querySelector('.dsx-compte').textContent = String(caches);
                b.title = t.plus(caches);
                b.setAttribute('aria-label', b.title);
                if (!caches) fermerPanneau(); else placerPanneau();
            } finally {
                // Les mutations faites ici reviennent par l'observateur : on les laisse passer.
                setTimeout(() => { enCours = false; }, 0);
            }
        }

        let prevu = false;
        function planifier() {
            if (prevu) return;
            prevu = true;
            setTimeout(() => { prevu = false; ranger(); }, 60);
        }

        let observe = null;
        function brancher() {
            const haut = document.querySelector('.overlay-buttons-container.top') || document.querySelector('.overlay-buttons-container');
            if (!haut || observe === haut) return;
            observe = haut;
            new MutationObserver(() => { if (!enCours) planifier(); }).observe(haut, { childList: true, attributes: true, attributeFilter: ['data-dsx-actif', 'data-dsx-dock'], subtree: true });
        }

        // La mise en route attend la PREMIÈRE inscription d'un bouton : charger le script ne touche à rien
        // (ni écouteur, ni minuterie, ni attribut sur <html>) tant qu'il ne pose pas de bouton. Le banc de
        // démarrage de WCT évalue le script sans DOM complet, et il avait raison de le refuser.
        let demarre = false;
        function demarrer() {
            if (demarre) return;
            demarre = true;
            const html = document.documentElement;
            if (!html.getAttribute('data-dsx-dock-v') || cmp(V, html.getAttribute('data-dsx-dock-v')) > 0) {
                html.setAttribute('data-dsx-dock-v', V);
                html.setAttribute('data-dsx-dock-proprio', moi);
            }
            window.addEventListener('resize', planifier);
            // En capture : les copies plus anciennes ferment aussi sur Échap, sans rendre le focus ; la nôtre passe avant.
            window.addEventListener('keydown', ev => { if (ev.key === 'Escape') fermerPanneau(); }, true);
            document.addEventListener('click', ev => {
                const p = document.getElementById('dsx-panneau');
                if (p && !p.hidden && !p.contains(ev.target) && ev.target.id !== 'dsx-plus') fermerPanneau();
            }, true);
            // Clic droit sur un bouton de la colonne : on l'épingle, ou on le désépingle. Il n'agissait que
            // sur un bouton DÉJÀ épinglé : ailleurs, le menu du navigateur s'ouvrait (signalé par l'auteur,
            // 31/10/2026).
            document.addEventListener('contextmenu', ev => {
                const el = ev.target.closest && ev.target.closest('.overlay-buttons-container [data-dsx-dock]');
                if (!el || !proprio()) return;
                ev.preventDefault();
                const id = el.getAttribute('data-dsx-dock');
                const a = lireEpingles();
                ecrireEpingles(a.includes(id) ? a.filter(x => x !== id) : a.concat([id]));
                planifier();
            });
            // WME reconstruit parfois sa colonne : on se rebranche, et on range.
            setInterval(() => { brancher(); if (proprio()) planifier(); }, 2000);
        }

        return {
            // À appeler après avoir posé (ou reposé) son bouton dans la colonne.
            inscrire: (el, id, nom) => {
                demarrer();
                el.setAttribute('data-dsx-dock', id);
                el.setAttribute('data-dsx-nom', nom);
                brancher();
                planifier();
            },
            // Un script en cours d'usage garde son bouton visible.
            actif: (el, oui) => {
                if (!el) return;
                demarrer();
                const v = oui ? '1' : '0';
                // Rien si l'état ne change pas : un script peut le redire deux fois par seconde (WCT).
                if (el.getAttribute('data-dsx-actif') === v) return;
                el.setAttribute('data-dsx-actif', v);
                planifier();
            },
        };
    })();
    // <<< DSX-DOCK

    // WME reconstruit parfois sa colonne de boutons : on vérifie que le bouton y est toujours.
    function poserFab() {
        const cont = document.querySelector('.overlay-buttons-container.top') || document.querySelector('.overlay-buttons-container');
        if (!cont) return false;
        // ⚠️ Rangé par DSX-Dock dans « ⋯ », le bouton est à sa place : ne pas le recréer.
        const deja = document.getElementById('wbc-fab-wrap');
        if (deja && (deja.parentElement === cont || deja.closest('#dsx-panneau'))) return true;
        const vieux = document.getElementById('wbc-fab-wrap');
        if (vieux) vieux.remove();
        const wrap = document.createElement('div');
        wrap.id = 'wbc-fab-wrap';
        wrap.innerHTML = '<button type="button" id="wbc-fab-btn" title="' + SCRIPT_NAME + ' — ' + esc(t('tipFab')) + '" aria-label="' + SCRIPT_NAME + ' — ' + esc(t('tipFab')) + '">' + icone(26) + '</button>';
        const btn = wrap.querySelector('button');
        // En capture, avant le clic simple : Ctrl+clic (Cmd+clic sur Mac, où Ctrl+clic est un clic droit) ne touche pas à la fenêtre.
        btn.addEventListener('click', ev => {
            if (!(ev.ctrlKey || ev.metaKey)) return;
            ev.preventDefault();
            ev.stopImmediatePropagation();
            analyserAuCentre();
        }, true);
        btn.addEventListener('keydown', ev => {
            if (ev.key !== 'Enter' || !(ev.ctrlKey || ev.metaKey)) return;
            ev.preventDefault();
            ev.stopPropagation();
            analyserAuCentre();
        });
        btn.addEventListener('click', ev => {
            ev.stopPropagation();
            if (fabEtat && fabEtat.erreur) { fabEtat = null; majFabEtat(); }
            if (ovEl && ovEl.classList.contains('open')) fermerFenetre(); else ouvrirFenetre(true);
        });
        const wct = cont.querySelector('#wct-fab-wrap');
        if (wct) cont.insertBefore(wrap, wct); else cont.appendChild(wrap);
        dsxDock.inscrire(wrap, SCRIPT_ID, SCRIPT_NAME);
        majFab();
        return true;
    }
    const majFab = () => {
        const b = document.getElementById('wbc-fab-btn'), ouv = !!(ovEl && ovEl.classList.contains('open'));
        if (b) b.classList.toggle('actif', ouv);
        dsxDock.actif(document.getElementById('wbc-fab-wrap'), ouv || !!(fabEtat && fabEtat.occupe));
        majFabEtat();
    };

    // ==WBC-CENTRE== — Ctrl+clic (Cmd+clic sur Mac) ou Ctrl+Entrée sur le bouton de carte (voir tools/banc-direct.js).
    // La commune au centre de la carte, comme « Centre de la carte » puis « Analyser », fenêtre fermée : un balayage gardé à jour
    // et récent est rouvert comme par « Ouvrir », sinon la commune est analysée ; ses points s'affichent, case du calque cochée.
    // Le bouton tourne pendant le travail ; un nouveau Ctrl+clic ne relance rien ; un échec laisse un signe et son motif.
    const MAC = /Mac|iPhone|iPad/.test((navigator.platform || '') + ' ' + (navigator.userAgent || ''));
    const MEMO_RECENT_MS = 7 * 864e5;
    let fabEtat = null;                   // null, { occupe: true } ou { erreur: motif }
    function majFabEtat() {
        const b = document.getElementById('wbc-fab-btn');
        if (!b) return;
        const occupe = !!(fabEtat && fabEtat.occupe), err = fabEtat && fabEtat.erreur;
        b.classList.toggle('wbc-occupe', occupe);
        b.classList.toggle('wbc-echec', !!err);
        if (occupe) b.setAttribute('aria-busy', 'true'); else b.removeAttribute('aria-busy');
        const tip = SCRIPT_NAME + ' — ' + (occupe ? t('fabBusy') : err ? t('fabErr', err) : t('tipFab') + ' · ' + t('tipFabCtrl', MAC));
        b.title = tip;
        b.setAttribute('aria-label', tip);
    }
    function posFab() {
        const b = document.getElementById('wbc-fab-btn'), r = b ? b.getBoundingClientRect() : null;
        return r ? { x: r.left - 330, y: r.top } : { x: window.innerWidth - 340, y: 80 };
    }
    async function analyserAuCentre() {
        if (fabEtat && fabEtat.occupe) return;
        if (jeton || demande) { montrerAvis(t('fabDeja'), posFab()); return; }
        fabEtat = { occupe: true };
        majFab();
        let motif = '';
        try {
            const cert = !!opts.certSeules;
            const c = await sdk.Map.getMapCenter();
            const cible = await pays.auPoint(c.lon, c.lat);
            if (!cible) throw new Error(t('errNoCommune'));
            let e = null;
            try { e = await Memo.lire('index', cleMemo(cible.code, cert)); } catch (x) { log('mémoire : ' + x.message); }
            const recent = !!e && e.type === 'commune' && memoAJour(e) && !ajoutsDepuis(e) && Date.now() - e.date < MEMO_RECENT_MS;
            if (!(recent && await ouvrirMemoCommune(cible.code, cert))) {
                const r = await lancer(null, j => lancerCommune(j, cible), cert);
                if (!r) throw new Error(t('fabDeja'));
                if (!r.ok) throw new Error(r.fin);
            }
            if (!resultat || resultat.commune.code !== cible.code) throw new Error(t('errNoCommune'));
            carteSeule = !fenetreOuverte();
            await cocherCalque();
            appliquerVisibilite();
        } catch (e) {
            motif = e && (e.reseau || e.format) ? messageErreur(e) : (e && e.message) || String(e);
            log('commune au centre : ' + motif);
        }
        fabEtat = motif ? { erreur: motif } : null;
        majFab();
        if (motif) montrerAvis(motif, posFab());
    }
    // ==/WBC-CENTRE==

    function htmlFenetre() {
        const mode = (k, lbl, tip) => '<button type="button" class="wbc-mode" role="radio" data-mode="' + k + '" aria-checked="' + (opts.mode === k) + '"' + (tip ? ' title="' + esc(tip) + '"' : '') + '>' + esc(lbl) + '</button>';
        return '<div id="wbc-hdr" title="' + esc(t('dragTip')) + '"><span class="wbc-hdr-title"><span class="wbc-hdr-ico">' + icone(16) + '</span>' +
            SCRIPT_NAME + ' <span class="wbc-hdr-v">v' + esc(VERSION) + '</span></span>' +
            '<span class="wbc-hdr-btns"><span id="wbc-hdr-quota" class="wbc-hdr-quota" hidden></span><button type="button" class="wbc-hdr-btn" data-act="replier"></button>' +
            '<button type="button" class="wbc-hdr-btn" data-act="petite" title="' + esc(t('smallTip')) + '" aria-label="' + esc(t('smallTip')) + '"><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M4.5 1v3.5H1M7.5 1v3.5H11M4.5 11V7.5H1M7.5 11V7.5H11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
            '<button type="button" class="wbc-hdr-btn" data-act="taille" title="' + esc(t('sizeTip')) + '" aria-label="' + esc(t('sizeTip')) + '">&#x2922;</button>' +
            '<button type="button" class="wbc-hdr-btn" data-act="close" title="' + esc(t('close')) + '" aria-label="' + esc(t('close')) + '">&#x2715;</button></span></div>' +
            '<div id="wbc-haut"><div class="wbc-ligne-haut"><div class="wbc-modes" role="radiogroup" aria-label="' + esc(t('modeLbl')) + '">' +
            mode('here', t('modeHere'), t('hereHint')) + mode('commune', t('modeCommune'), t('tipModeCommune')) + mode('dep', t('modeDep'), t('tipModeDep')) + '</div>' +
            '<div class="wbc-choix" data-pour="here"></div>' +
            '<div class="wbc-choix" data-pour="commune"><input type="search" class="wbc-champ" id="wbc-cherche" title="' + esc(t('tipModeCommune')) + '" placeholder="' + esc(t('searchPh')) + '" autocomplete="off" spellcheck="false" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="wbc-sugg" aria-label="' + esc(t('searchPh')) + '">' +
            '<ul class="wbc-sugg" id="wbc-sugg" role="listbox" hidden></ul></div>' +
            '<div class="wbc-choix" data-pour="dep"><select class="wbc-champ" id="wbc-dep" title="' + esc(t('tipModeDep')) + '" aria-label="' + esc(t('depChoose')) + '"><option value="">' + esc(t('depChoose')) + '</option></select></div></div>' +
            '<div class="wbc-switchs"><div class="wbc-toggle-row" title="' + esc(t('certOnlyTip')) + '"><label class="wbc-toggle"><input type="checkbox" id="wbc-cert"' + (opts.certSeules ? ' checked' : '') + '><span class="wbc-toggle-slider"></span></label>' +
            '<label class="wbc-toggle-lbl" for="wbc-cert">' + esc(t('certOnly')) + '</label></div><span id="wbc-switchs-vue"></span>' +
            // La ligne d'état ne parle pas au lecteur d'écran : une zone à part n'annonce que le début, la fin et les erreurs.
            '<span class="wbc-statut" id="wbc-statut" aria-live="off"></span>' +
            '<button type="button" class="wbc-btn wbc-btn-primary" data-act="go" title="' + esc(t('tipAnalyse')) + '">' + esc(t('analyse')) + '</button>' +
            '<button type="button" class="wbc-btn wbc-btn-neutral" data-act="stop" title="' + esc(t('tipStop')) + '" hidden>' + esc(t('stop')) + '</button></div>' +
            '<div id="wbc-deja" hidden></div>' +
            '<div class="wbc-progres" id="wbc-progres" aria-hidden="true" hidden></div>' +
            '<p class="wbc-arriere" id="wbc-arriere" role="status" title="' + esc(t('bgTabTip')) + '" hidden>&#x26A0;&#xFE0F; ' + esc(t('bgTab')) + '</p>' +
            '<div class="wbc-barre" id="wbc-barre" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-label="' + esc(t('analyse')) + '" hidden><i></i></div>' +
            '<p class="wbc-lecteur" id="wbc-annonce" role="status" aria-live="polite"></p></div>' +
            '<div id="wbc-corps"></div><div id="wbc-resize"></div>' +
            '<input type="file" id="wbc-cmp-fichier" accept=".csv,text/csv" hidden>';
    }

    const interrupteur = (id, on, lbl, tip, off, deco) => '<div class="wbc-toggle-row" title="' + esc(tip) + '"><label class="wbc-toggle"><input type="checkbox" id="' + id + '"' +
        (on ? ' checked' : '') + (off ? ' disabled' : '') + '><span class="wbc-toggle-slider"></span></label><label class="wbc-toggle-lbl" for="' + id + '">' + (deco || '') + esc(lbl) + '</label></div>';
    function majInterrupteurs() {
        const e = ovEl && $('#wbc-switchs-vue');
        if (!e) return;
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
        const go = $('[data-act="go"]');
        go.hidden = !!jeton || !!deja;
        const cd = communeDuDep();
        go.title = cd ? t('tipAnalyseCom', cd.nom) : t('tipAnalyse');
        $('[data-act="stop"]').hidden = !jeton;
        $('#wbc-cert').disabled = !!jeton;
        ovEl.querySelectorAll('[data-mode]').forEach(b => { b.disabled = !!jeton; });
    }

    async function remplirDeps() {
        const sel = $('#wbc-dep');
        if (sel.options.length > 1) return;
        try {
            const l = await attendre(pays.groupes());
            sel.insertAdjacentHTML('beforeend', l.map(d => '<option value="' + esc(d.code) + '">' + esc(d.code + ' — ' + d.nom) + '</option>').join(''));
            if (choixDep) sel.value = choixDep;
        } catch (e) { statut(t('errNet', e.message), true); }
    }

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
                try { l = await pays.chercher(q); } catch (e) { erreur = messageErreur(e); }
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

    // Les touches tapées dans la fenêtre ne partent pas vers les raccourcis de WME ; Ctrl, Méta et Alt passent.
    function gardeTouche(ev) {
        if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
        if (ev.target.closest && ev.target.closest('input, select, textarea')) ev.stopPropagation();
    }

    function ouvrirSignalement(cle, voie) {
        const url = Core.lienSignalement(cle, voie);
        if (url) window.open(url, '_blank', 'noopener');
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
            else if (a === 'petite') petiteFenetre();
            else if (a === 'stop') arreter();
            else if (a === 'csv' && resultat) exporterCommune(resultat);
            else if (a === 'csvdep' && resDep) exporterDepartement(resDep);
            else if (a === 'dep') { resultat = null; dessiner([]); rendre(); }
            else if (a === 'suivant' && resultat) manquantSuivant();
            else if (a === 'voiesuiv' && resultat && droitGeste('voie') && !hnEnCours) allerVoieSuivante();
            else if (a === 'selvoie' && resultat && vue.ouverte != null) selectionnerVoie(vue.ouverte);
            else if (a === 'banvoie' && resultat && vue.ouverte != null) {
                const v = resultat.voies[vue.ouverte], p = premierPoint(v);
                if (v.idVoie) ouvrirSignalement(v.idVoie + '_00000', true);
                else if (p) window.open(Core.lienCarteBan(p.lon, p.lat, 18), '_blank', 'noopener');
            }
            else if (a === 'hnvoie' && resultat && vue.ouverte != null && droitGeste('voie')) ajouterHnVoie(vue.ouverte);
            else if (a === 'contour') { opts.contour = !opts.contour; ecrireOpts(); rendre(); }
            else if (a === 'hnstop' && hnEnCours) { hnStop = true; act.disabled = true; statut(t('ajHnStopping')); }
            else if (a === 'noms' && resultat) exporterEcarts([resultat], 'ban-wme_noms_' + resultat.commune.code);
            else if (a === 'nomsdep' && resDep) exporterEcarts([...resCommunes.values()], 'ban-wme_noms_dep' + resDep.dep.code);
            else if (a === 'cmp') { const f = $('#wbc-cmp-fichier'); f.value = ''; f.click(); }
            else if (a === 'cmpx') { cmp = null; rendre(); }
            else if (a === 'filtrex') { vue.texte = ''; rendre(); const f = $('#wbc-filtre-txt'); if (f) f.focus(); }
            else if (a === 'memomaj') actionMemo(a);
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
        const rh = ev.target.closest('[data-rpphn]');
        if (rh && resultat) {
            const [i, k] = rh.dataset.rpphn.split(':').map(Number);
            if (droitGeste('conv') && !hnEnCours) { vue.curseurRpp = i + ':' + k; convertirRppVoie(i, k); }
            return;
        }
        const rg = ev.target.closest('[data-rppgo]');
        if (rg && resultat) {
            const [i, k] = rg.dataset.rppgo.split(':').map(Number), a = resultat.voies[i].adresses[k];
            vue.curseurRpp = i + ':' + k;
            rendre();
            centrerLibre(a.wlon, a.wlat, 19);
            return;
        }
        const bt = ev.target.closest('[data-bantrop]');
        if (bt && resultat) {
            const x = resultat.enTrop[+bt.dataset.bantrop];
            const url = x && Core.lienAlerte(x.lon, x.lat, 'Adresse présente dans Waze\u00a0: ' + x.brut + (x.rue ? ' ' + x.rue : ''));
            if (url) window.open(url, '_blank', 'noopener');
            return;
        }
        const ag = ev.target.closest('[data-arretgo]');
        if (ag && resultat) {
            const [i, k] = ag.dataset.arretgo.split(':').map(Number), a = resultat.voies[i] && resultat.voies[i].adresses[k];
            if (a && a.alon != null) centrerLibre((a.wlon + a.alon) / 2, (a.wlat + a.alat) / 2, 18);
            return;
        }
        const snb = ev.target.closest('[data-snb]');
        if (snb && resultat) {
            const v = (resultat.sansNomBan || [])[+snb.dataset.snb];
            if (v && Number.isFinite(v.lon)) centrerLibre(v.lon, v.lat, 18);
            return;
        }
        const snbs = ev.target.closest('[data-snbsig]');
        if (snbs && resultat) {
            const v = (resultat.sansNomBan || [])[+snbs.dataset.snbsig];
            if (v && v.idVoie) ouvrirSignalement(v.idVoie + '_00000', true);
            else if (v && Core.lienCarteBan(v.lon, v.lat)) window.open(Core.lienCarteBan(v.lon, v.lat, 18), '_blank', 'noopener');
            return;
        }
        const sg = ev.target.closest('[data-sig]');
        if (sg && resultat) {
            const x = sigListe(resultat)[+sg.dataset.sig];
            if (x && Number.isFinite(x.lon)) centrerLibre(x.lon, x.lat, 19);
            return;
        }
        const bn = ev.target.closest('[data-banadr]');
        if (bn && resultat) {
            const [i, k] = bn.dataset.banadr.split(':').map(Number);
            const ad = resultat.voies[i].adresses[k];
            if (Core.lienSignalement(ad.cle)) ouvrirSignalement(ad.cle, false);
            else if (Core.lienCarteBan(ad.lon, ad.lat)) window.open(Core.lienCarteBan(ad.lon, ad.lat, 19), '_blank', 'noopener');
            return;
        }
        const h1 = ev.target.closest('[data-hn1]');
        if (h1 && resultat) {
            const [i, k] = h1.dataset.hn1.split(':').map(Number);
            if (droitGeste('hn1') && !hnEnCours) { vue.curseur = k; ajouterHnVoie(i, k); }
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
            tropMontre = x;
            majCalque();
            centrerLibre(x.lon, x.lat, 19);
            return;
        }
        const l = ev.target.closest('tr[data-voie]');
        if (l && resultat) { ouvrirVoie(+l.dataset.voie); return; }
        const lc = ev.target.closest('tr[data-commune]');
        if (lc) {
            const l = resDep && resDep.communes.find(x => x.commune.code === lc.dataset.commune);
            ouvrirCommuneDep(lc.dataset.commune).then(() => { if (l && l.commune.bbox) cadrer(l.commune.bbox); });
            return;
        }
    }

    function allerA(i, k) {
        const a = resultat.voies[i].adresses[k];
        vue.curseur = k;
        rendre();
        centrerLibre(a.lon, a.lat, 19);
        const b = ovEl.querySelector('[data-adr="' + i + ':' + k + '"]');
        if (b) b.focus({ preventScroll: false });
    }

    const hnPosable = a => !!a && !a.trouve && !a.hnPose && !a.hnEnregistre && !Core.suffixeBloque(a) && !!Core.numeroHn(a.brut);
    const rppConvertible = a => !!a && a.trouve === 'RPP' && !a.rppHn && a.wlon != null;
    const posablesHn = v => v.adresses.filter(hnPosable).length;
    const nomOkHn = v => v.statutNom === 'identique' || v.statutNom === 'alternatif' || !!(v.apercuHn && v.apercuHn.rpp);
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
            if (prochaine == null) { statut(t('lastMissing')); return; }
            i = prochaine;
            vue.ouverte = i;
            k = suivantDans(i, -1);
            majCalque();
        }
        allerA(i, k);
    }

    // setSelection est TOUT OU RIEN (un id absent du modèle fait tout échouer) : on ne passe que les segments chargés.
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

    // Ajout de numéros : 500 par heure glissante pour tous ; sdk.Editing.save n'est JAMAIS appelé.
    // Voie entière : habilitation en empreintes recoupées ; un seul numéro (« + ») et conversions ⇄ : tout éditeur connecté
    // (décision du mainteneur, 18/11/2026 : sans droit sur le segment ou le RPP, WME fait de la modification une suggestion à l'enregistrement).
    // Ne pas modifier sans l'accord du mainteneur du script.
    const _hx = t => { let x = 0x811c9dc5;
        for (let i = 0; i < t.length; i++) { x ^= t.charCodeAt(i); x = Math.imul(x, 0x01000193) >>> 0; }
        return x >>> 0; };
    const _hz = [0x853f760];
    const _hq = 0x8651814;
    const _hk = [0x1f4, 0x36ee80];
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
        return { n: v.length ? Math.min(...v) : -1, nom };
    }
    let droitHn = false, droitHn1 = false, hnUser = '', hnEnCours = false, hnStop = false;
    async function lireDroitHn() {
        const p = await _hp();
        hnUser = p.nom;
        return p.n >= 0 && !!p.nom && _hz.indexOf(_hx('r' + p.n)) >= 0 && _hc();
    }
    // Un seul numéro : éditeur connecté (pseudo et rang lus) ; mêmes contrôles et même quota que la voie entière.
    async function lireDroitHn1() {
        const p = await _hp();
        hnUser = p.nom;
        return p.n >= 0 && !!p.nom && _hc();
    }
    // Gestes unitaires 'hn1' (« + » d'un seul numéro) et 'conv' (⇄) : tout éditeur connecté ; voie entière et voie suivante : habilitation.
    const unitaire = g => g === 'hn1' || g === 'conv';
    const droitGeste = g => unitaire(g) ? droitHn1 : droitHn;
    async function lireDroitGeste(g) {
        const ok = unitaire(g) ? await lireDroitHn1() : await lireDroitHn();
        if (!ok) { if (unitaire(g)) droitHn1 = false; else droitHn = false; }
        return ok;
    }
    async function lireDroits() {
        droitHn1 = await lireDroitHn1();
        droitHn = droitHn1 && await lireDroitHn();
    }
    // ==WBC-QUOTA== — entrées de quota par éditeur (voir tools/banc-quota.js). Ne pas modifier sans l'accord du mainteneur du script.
    const HN_KEY = 'wbc.hn.';
    let quotaMem = null;
    const _qn = () => 'wbc.q.' + _hx('q|' + hnUser).toString(36);
    const _qk = () => { let x = _hx('k|' + hnUser) || 1;
        return () => { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x & 255; }; };
    const _qt = b => _hx(hnUser + '|' + b + '|' + _hq).toString(36);
    // Copie scellée avec l'empreinte du plafond précédent : reprise et rescellée (sinon tenue pour falsifiée).
    const _HQ_PREC = 0x8651976;
    const _qtP = b => _hx(hnUser + '|' + b + '|' + _HQ_PREC).toString(36);
    const _qPrec = v => { const m = /^w2\.([0-9a-z]+)\.([A-Za-z0-9+/=]*)$/.exec(String(v == null ? '' : v));
        return !!m && _qt(m[2]) !== m[1] && _qtP(m[2]) === m[1]; };
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
        if (!m || (_qt(m[2]) !== m[1] && _qtP(m[2]) !== m[1])) return false;
        try {
            const o = atob(m[2]), k = _qk(), j = new Uint8Array(o.length);
            for (let i = 0; i < o.length; i++) j[i] = o.charCodeAt(i) ^ k();
            const l = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(j));
            return Array.isArray(l) ? l : false;
        } catch (e) { return false; }
    }
    // Réunion des copies : une entrée une fois, enregistrée l'emporte sur réservée.
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
        let faux = false, prec = false;
        for (const v of [_lsLire(c), _gmLire(c)]) {
            const l = _qo(v);
            if (l === false) faux = true; else if (l) { listes.push(l); if (_qPrec(v)) prec = true; }
        }
        let ancien = false;
        try { const a = JSON.parse(_lsLire(HN_KEY + hnUser) || 'null'); if (Array.isArray(a)) { listes.push(a); ancien = true; } } catch (e) { }
        let l = _qu(listes);
        if (faux) {
            const m = Date.now();
            l = l.concat(Array.from({ length: _hk[0] }, (_, i) => m + i / 1e3));
            log('quota : copie retouchée ⇒ ajout bloqué une heure');
        }
        if (faux || ancien || prec) { ecrireHorodatages(l); try { localStorage.removeItem(HN_KEY + hnUser); } catch (e) { } }
        return l;
    };
    const ecrireHorodatages = l => {
        quotaMem = l.slice();
        const c = _qn(), v = _qf(l);
        try { localStorage.setItem(c, v); } catch (e) { }
        _gmEcrire(c, v);
    };
    // ==/WBC-QUOTA==
    // Compte au quota ce qui PART À L'ENREGISTREMENT : numéros réservés relus sur le serveur, retrouvés ⇒ comptés, absents ⇒ rendus.
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
    function ajoutsDepuis(e) {
        const o = lireJournalHn(), t0 = new Date(e.date).getTime(), code = String(e.code || '');
        if (!code || !Number.isFinite(t0)) return 0;
        let n = 0;
        for (const [c, l] of Object.entries(o)) if (Array.isArray(l) && (e.type === 'dep' ? c.startsWith(code) : c === code)) n += l.filter(y => y > t0).length;
        return n;
    }
    // Entrée de RPP rendue seulement si elle vient de CETTE page et que son POI a disparu (ailleurs, il n'est peut-être pas chargé).
    const SESSION_HN = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    // ⚠️ POI enregistré : identifiant en chaîne (« 721326.7409869.43585000 ») ; en attente : négatif. Juste après l'enregistrement,
    // WME recharge ses POI : un POI introuvable n'est PAS disparu. Lus d'avance : le rappel de Core.rapprocherHn est synchrone.
    async function lireRppModele(entrees) {
        let liste;
        try { liste = await sdk.DataModel.Venues.getAll(); } catch (e) { return null; }
        const pres = (v, x) => { const k = Math.cos(x.lat * Math.PI / 180) * 111320, [lon, lat] = v.geometry.coordinates; return Math.hypot((lon - x.lon) * k, (lat - x.lat) * 111320) <= 15; };
        const out = [];
        for (const v of liste || []) {
            if (!v || !v.isResidential || !v.geometry || v.geometry.type !== 'Point' || !entrees.some(x => pres(v, x))) continue;
            let num = null;
            try { num = ((await sdk.DataModel.Venues.getAddress({ venueId: String(v.id) })) || {}).houseNumber; } catch (e) { }
            out.push({ id: v.id, geometry: v.geometry, num });
        }
        return out;
    }
    function etatRppModele(x, apresEnregistrement, liste) {
        if (!liste) return null;
        const m = Core.normNum(x.n), k = Math.cos(x.lat * Math.PI / 180) * 111320;
        let enAttente = false;
        for (const v of liste) {
            const [lon, lat] = v.geometry.coordinates;
            if (Math.hypot((lon - x.lon) * k, (lat - x.lat) * 111320) > 15) continue;
            const num = v.num;
            if (Core.normNum(num) !== m) continue;
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
        // Après un enregistrement, laisser WME recharger ses POI avant de les chercher.
        if (apresEnregistrement && lireHorodatages().some(x => x && x.r === 1 && x.e === 0)) await new Promise(r => setTimeout(r, 3000));
        const rppAttente = lireHorodatages().filter(x => x && typeof x === 'object' && x.r === 1 && x.e === 0);
        const modele = rppAttente.length ? await lireRppModele(rppAttente) : [];
        const res = Core.rapprocherHn(lireHorodatages(), lus, x => etatRppModele(x, apresEnregistrement, modele));
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
                if (a.hnVersRpp && a.trouve === 'HN') {
                    a.hnVersRpp = false;
                    Object.assign(a, { trouve: 'RPP', wlon: a.hnLon != null ? a.hnLon : a.wlon, wlat: a.hnLat != null ? a.hnLat : a.wlat });
                    v.hn--; v.rpp++;
                    resultat.totaux.hn--; resultat.totaux.rpp++;
                }
                else if (a.rppHn) {
                    a.rppHn = false;
                    Object.assign(a, { trouve: 'HN', wlon: a.lon, wlat: a.lat, dm: 0 });
                    v.rpp--; v.hn++;
                    resultat.totaux.rpp--; resultat.totaux.hn++;
                }
                else if (!a.trouve) {
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
            else if (rendu.has(c)) { a.hnPose = false; a.rppHn = false; a.hnVersRpp = false; modifs++; }
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
        const ap = v.apercuHn;
        const nomOk = nomOkHn(v);
        const k = ap ? Math.min(ap.hn + (ap.allee || 0) + (ap.rpp || 0), q.reste) : Math.min(n, q.reste);
        const tip = !nomOk ? t('ajHnNoName') : !q.reste ? t('ajHnQuota', heureCourte(q.libre)) : !k ? (ap && ap.nomEcart ? t('ajHnNomEcart', ap.nomEcart, v.nom) : ap && ap.loin ? t('ajHnLoin', nb(ap.loin)) : t('ajHnNone')) : t('ajHnAddTip', nb(q.reste));
        const lib = t('ajHnAdd', nb(k));
        return boutonOutil('hnvoie', 'add', lib, tip, k, !(nomOk && k && !hnEnCours)) +
            (hnEnCours ? ' <button type="button" class="wbc-btn wbc-btn-neutral" data-act="hnstop" title="' + esc(t('ajHnStopTip')) + '">' + esc(t('stop')) + '</button>' : '') +
            boutonVoieSuivante();
    }
    function boutonVoieSuivante() {
        const j = voieSuivante(), n = j < 0 ? 0 : posablesHn(resultat.voies[j]);
        return boutonOutil('voiesuiv', 'next', t('nextStreet', nb(n)), j < 0 ? t('nextStreetNone') : t('tipNextStreet'), n, j < 0 || hnEnCours);
    }

    // Segments candidats d'une voie : les siens, les plus proches de ses adresses manquantes, et en passe de ZONE
    // les segments chargés à ~100 m des adresses (planHn refuse ceux d'un autre nom).
    async function idsVoieHn(v, zone) {
        let ids = [...new Set((v.segs || []).concat(v.adresses.filter(a => !a.trouve && a.seg != null).map(a => a.seg)))];
        if (zone && zone.adresses && zone.adresses.length) {
            const dLat = 0.0009, dLon = 0.0009 / Math.cos(zone.lat * Math.PI / 180);
            const lo0 = Math.min(...zone.adresses.map(a => a.lon)) - dLon, lo1 = Math.max(...zone.adresses.map(a => a.lon)) + dLon;
            const la0 = Math.min(...zone.adresses.map(a => a.lat)) - dLat, la1 = Math.max(...zone.adresses.map(a => a.lat)) + dLat;
            try {
                for (const sg of (await sdk.DataModel.Segments.getAll()) || []) {
                    const c = sg && sg.geometry && sg.geometry.coordinates;
                    if (c && c.some(([x, y]) => x >= lo0 && x <= lo1 && y >= la0 && y <= la1)) ids.push(sg.id);
                }
            } catch (e) { log('segments de la zone : ' + e.message); }
            ids = [...new Set(ids)];
        }
        return ids;
    }
    const segmentsCharges = async ids => {
        const l = [];
        for (const id of ids) { try { const s = await sdk.DataModel.Segments.getById({ segmentId: id }); if (s) l.push(s); } catch (e) { } }
        return l;
    };
    // Nom, ville, noms alternatifs, verrou : tout est lu dans le modèle de WME, sans requête.
    async function decrireSegsHn(l) {
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
            // updateAddress refuse une adresse sans stateId : département et pays lus avec les noms.
            let alts = [], stateId = null, countryId = null;
            try {
                const ad = (await sdk.DataModel.Segments.getAddress({ segmentId: s.id })) || {};
                alts = (ad.altStreets || []).map(x => ({ nom: (x.street && x.street.name) || '', ville: (x.city && x.city.name) || '' }));
                stateId = ad.state ? ad.state.id : null;
                countryId = ad.country ? ad.country.id : null;
            } catch (e) { }
            segs.push({ id: s.id, coords: s.geometry && s.geometry.coordinates, nom, ville, alts, stateId, countryId, rt: s.roadType,
                verrou: typeof s.lockRank === 'number' ? s.lockRank : null });
        }
        return segs;
    }

    async function lireVoieHn(v, cadrerSiBesoin, zone) {
        const ids = await idsVoieHn(v, zone);
        const charges = () => segmentsCharges(ids);
        let l = await charges();
        if (l.length < ids.length && cadrerSiBesoin) {
            await cadrer(v.bbox);
            for (let n = 0; n < 24 && (l = await charges()).length < ids.length; n++) await new Promise(r => setTimeout(r, 250));
            // Sous le zoom 16 WME ne charge pas les rues : une voie trop longue se recentre au zoom 16.
            if (l.length < ids.length && (await sdk.Map.getZoomLevel()) < 16) {
                await sdk.Map.setMapCenter({ lonLat: { lon: (v.bbox[0] + v.bbox[2]) / 2, lat: (v.bbox[1] + v.bbox[3]) / 2 }, zoomLevel: 16 });
                for (let n = 0; n < 24 && (l = await charges()).length < ids.length; n++) await new Promise(r => setTimeout(r, 250));
            }
        }
        const segs = await decrireSegsHn(l);
        // fetchHouseNumbers ne rend que les ENREGISTRÉS : on y ajoute les poses de WBC en attente (un numéro tapé à la main en attente n'est pas vu).
        // Par lots de 250 : au-delà de ~500 segments, l'appel est rejeté (limite non documentée).
        const existants = [];
        // fetchHouseNumbers lit aussi les segments non chargés. Hors de la voie, un segment ne compte que s'il porte le nom BAN.
        const tous = Core.segsDesExistants(v.nom, v.segs, ids, segs);
        for (let k = 0; k < tous.length; k += 250) {
            const lot = await sdk.DataModel.HouseNumbers.fetchHouseNumbers({ segmentIds: tous.slice(k, k + 250) });
            for (const h of lot || []) existants.push(h.number);
        }
        try {
            const dans = new Set(tous);
            // Seules les poses de CETTE page comptent comme présentes : une réservation d'une autre page peut ne plus exister dans WME.
            for (const x of lireHorodatages()) if (x && typeof x === 'object' && x.e !== 1 && (x.p == null || x.p === SESSION_HN) && dans.has(x.s) && x.n != null) existants.push(String(x.n));
        } catch (e) { log('numéros en attente : ' + e.message); }
        // RPP en attente compris : un RPP posé depuis le balayage n'est pas dans l'analyse, le reposer ferait un doublon.
        try {
            const nomBan = Core.nomSouple(v.nom);
            for (const p of (await sdk.DataModel.Venues.getAll()) || []) {
                if (!p || !p.isResidential) continue;
                const ad = (await sdk.DataModel.Venues.getAddress({ venueId: String(p.id) })) || {};
                if (ad.houseNumber && ad.street && Core.nomSouple(ad.street.name) === nomBan) existants.push(ad.houseNumber);
            }
        } catch (e) { log('RPP chargés : ' + e.message); }
        return { segs, existants, attendus: ids.length, charges: l.length };
    }

    // Échec d'une étape : sdk.Editing.undo jusqu'au nombre de modifications d'avant le geste (filet après les retraits explicites).
    async function defaireJusqua(n0) {
        if (typeof n0 !== 'number') return false;
        try {
            for (let k = 0; k < 8; k++) {
                const n = await sdk.Editing.getUnsavedChangesCount();
                if (n <= n0) return n === n0;
                await sdk.Editing.undo();
            }
            return (await sdk.Editing.getUnsavedChangesCount()) === n0;
        } catch (e) { log('annulation : ' + e.message); return false; }
    }
    const enAttente = async () => { try { return await sdk.Editing.getUnsavedChangesCount(); } catch (e) { return null; } };

    // ==WBC-RAPPEL== — rappel de responsabilité (voir tools/banc-rappel.js).
    // Montré avant la PREMIÈRE écriture du script dans ce navigateur : le script propose, l'éditeur relit puis
    // enregistre ou annule dans WME, et répond de ce qu'il enregistre. Accepté, il est retenu dans localStorage ;
    // sans stockage, pour la page seulement (il revient donc à chaque session). Fermé sans « J'ai compris » :
    // l'écriture prévue n'a pas lieu. Chaque geste qui écrit attend rappelAccepte() juste avant d'écrire.
    const CLE_RAPPEL = 'wbc.rappel.v1';
    let rappelVu = false;
    let rappelOuvert = false;
    function rappelRetenu() {
        if (rappelVu) return true;
        try { return localStorage.getItem(CLE_RAPPEL) === '1'; } catch (e) { return false; }
    }
    function retenirRappel() {
        rappelVu = true;
        try { localStorage.setItem(CLE_RAPPEL, '1'); } catch (e) { /* retenu pour la page seulement */ }
    }
    // true : l'écriture peut avoir lieu. Une demande arrivée pendant que la bulle est ouverte est refusée :
    // seul le geste qui l'a ouverte reprend après acceptation.
    function rappelAccepte() {
        if (rappelRetenu()) return Promise.resolve(true);
        if (rappelOuvert) return Promise.resolve(false);
        rappelOuvert = true;
        return new Promise(fin => afficherRappel(ok => {
            rappelOuvert = false;
            if (ok) retenirRappel();
            fin(!!ok);
        }));
    }
    // Le lien de l'onglet : la même bulle, sans écriture en attente.
    function revoirRappel() {
        if (rappelOuvert) return;
        rappelOuvert = true;
        afficherRappel(ok => { rappelOuvert = false; if (ok) retenirRappel(); });
    }
    // ==/WBC-RAPPEL==

    // La bulle du rappel : modale, sur le body, au-dessus de la carte et de la fenêtre.
    // fin(true) : « J'ai compris » ; fin(false) : ✕, « Annuler », Échap ou clic hors de la bulle.
    // Les touches ne vont pas plus loin que la bulle : ni raccourcis de WME, ni Entrée d'un champ de la fenêtre.
    function afficherRappel(fin) {
        const ancien = document.getElementById('wbc-rappel');
        if (ancien) ancien.remove();
        const avant = document.activeElement;
        const fond = document.createElement('div');
        fond.id = 'wbc-rappel';
        fond.dir = _lang === 'he' ? 'rtl' : 'ltr';
        fond.innerHTML =
            '<div class="wbc-rp" role="dialog" aria-modal="true" aria-labelledby="wbc-rp-t" aria-describedby="wbc-rp-c" tabindex="-1">' +
            '<div class="wbc-rp-tete"><span class="wbc-hdr-title wbc-rp-titre" id="wbc-rp-t"><span class="wbc-hdr-ico">' + icone(16) + '</span>' + esc(t('remTitle')) + '</span>' +
            '<button type="button" class="wbc-hdr-btn" data-wbc-rp="non" title="' + esc(t('remCancel')) + '" aria-label="' + esc(t('remCancel')) + '">&#x2715;</button></div>' +
            '<div class="wbc-rp-corps" id="wbc-rp-c">' + t('remBody') + '<p class="wbc-rp-note">' + esc(t('remNote')) + '</p></div>' +
            '<div class="wbc-rp-boutons"><button type="button" class="wbc-btn wbc-btn-neutral" data-wbc-rp="non">' + esc(t('remCancel')) + '</button>' +
            '<button type="button" class="wbc-btn wbc-btn-primary" data-wbc-rp="oui">' + esc(t('remOk')) + '</button></div></div>';
        let fini = false;
        const fermer = ok => {
            if (fini) return;
            fini = true;
            fond.remove();
            try { if (avant && avant.focus && document.contains(avant)) avant.focus(); } catch (e) { }
            fin(ok);
        };
        fond.addEventListener('click', ev => {
            const b = ev.target.closest('[data-wbc-rp]');
            if (b) fermer(b.getAttribute('data-wbc-rp') === 'oui');
        });
        // Un clic posé hors de la bulle (appui ET relâché sur le fond) la ferme sans accepter.
        let appuiFond = false;
        fond.addEventListener('pointerdown', ev => { appuiFond = ev.target === fond; });
        fond.addEventListener('pointerup', ev => { if (appuiFond && ev.target === fond) fermer(false); appuiFond = false; });
        fond.addEventListener('keydown', ev => {
            ev.stopPropagation();
            if (ev.key === 'Escape') { ev.preventDefault(); fermer(false); return; }
            if (ev.key !== 'Tab') return;
            const btns = [...fond.querySelectorAll('button')];
            const i = btns.indexOf(document.activeElement);
            const j = ev.shiftKey ? (i <= 0 ? btns.length - 1 : i - 1) : (i < 0 || i === btns.length - 1 ? 0 : i + 1);
            ev.preventDefault();
            btns[j].focus();
        });
        document.body.appendChild(fond);
        // La bulle elle-même prend le focus : le lecteur d'écran lit titre et texte, et une Entrée tapée
        // dans la foulée n'accepte rien.
        fond.querySelector('.wbc-rp').focus();
    }

    // RPP créé d'emblée (POI résidentiel à la position BAN, entrée sur le segment ou l'allée) ; verrou laissé à WME (aucun lockRank).
    async function creerRppDirect(p, seg) {
        const DM = sdk.DataModel;
        const n0 = await enAttente();
        let vid;
        try { vid = String(await DM.Venues.addVenue({ category: 'RESIDENTIAL', geometry: { type: 'Point', coordinates: [p.lon, p.lat] } })); }
        catch (e) { return { ok: false, erreur: 'POI non créé (' + e.message + ')' }; }
        try {
            await DM.Venues.updateAddress({ venueId: vid, addressData: { houseNumber: String(p.number), streetName: p.rpp.rue, cityName: p.rpp.ville,
                stateId: seg && seg.stateId, countryId: seg && seg.countryId } });
        } catch (e) {
            // Jamais de POI sans adresse : retiré, ou à défaut le geste est défait dans la pile d'annulation.
            let okPoi = false;
            try { await DM.Venues.deleteVenue({ venueId: vid }); okPoi = true; } catch (e2) { okPoi = await defaireJusqua(n0); }
            return { ok: false, erreur: 'adresse du POI refusée (' + e.message + ')', critique: okPoi ? null : t('ajRppCritPoi', p.number), reste: !okPoi };
        }
        const entree = p.entree || (seg && seg.coords && seg.coords.length > 1 ? Core.pointLePlusProche(p.lon, p.lat, seg.coords) : null);
        if (entree) {
            try { await DM.Venues.replaceNavigationPoints({ venueId: vid, navigationPoints: [{ point: { type: 'Point', coordinates: entree }, entry: true, exit: true }] }); }
            catch (e) { log('RPP ' + p.number + ' : point d\'entrée non posé — ' + e.message); }
        }
        return { ok: true, id: vid };
    }

    // ==WBC-DROITSEG== — droit sur le segment d'un « + », lu d'avance pour le griser (voir tools/banc-droit-segment.js).
    // Droit de WME sur les numéros du segment (verrou au-dessus du rang, hors des zones d'édition) : sans lui, WME retire
    // la pose aussitôt, ou la range en suggestion, sans erreur pour le script. Indéterminé (segment non chargé) : WME tranche.
    // Le clic relit toujours hnPermis, sans cache.
    async function hnPermis(segmentId) {
        try { return (await sdk.DataModel.Segments.hasPermissions({ segmentId, permission: 'EDIT_HOUSE_NUMBERS' })) !== false; }
        catch (e) { return true; }
    }
    // État par segment : null = modifiable ou indéterminé ; { niveau } = refusé, niveau du verrou s'il dépasse le rang,
    // sinon null (zones d'édition). Lu dans le modèle de WME, sans requête ; vidé quand WME charge, modifie ou enregistre des segments.
    const droitSegCache = new Map();
    const viderDroitSeg = () => { droitSegCache.clear(); };
    function blocageSegHn(segmentId) {
        const c = String(segmentId);
        if (!droitSegCache.has(c)) droitSegCache.set(c, (async () => {
            if (await hnPermis(segmentId)) return null;
            let verrou = null;
            try { const s = await sdk.DataModel.Segments.getById({ segmentId }); if (s && typeof s.lockRank === 'number') verrou = s.lockRank; } catch (e) { }
            const rang = (await _hp()).n;
            return { niveau: verrou != null && rang >= 0 && verrou > rang ? verrou + 1 : null };
        })());
        return droitSegCache.get(c);
    }
    // Blocage du « + » d'une adresse : seul le segment probable compte ; une pose qui deviendrait un RPP n'est pas grisée.
    async function blocageHn1(v, a, segs) {
        if (!resultat) return null;
        const p = Core.segmentProbableHn(v, a, resultat.commune.nom, segs);
        return p && !p.rpp ? blocageSegHn(p.segmentId) : null;
    }
    const motifHn1 = b => t('ajHn1Bloque', b.niveau);
    // Niveau (1-7) du verrou d'un segment s'il dépasse le rang, sinon null (refus pour une autre raison : zones d'édition).
    async function niveauVerrouSeg(segmentId) {
        let v = null;
        try { const sg = await sdk.DataModel.Segments.getById({ segmentId: Number(segmentId) }); if (sg && typeof sg.lockRank === 'number') v = sg.lockRank; } catch (e) { }
        const rang = (await _hp()).n;
        return v != null && rang >= 0 && v > rang ? v + 1 : null;
    }
    // ==/WBC-DROITSEG==

    async function ajouterHnVoie(i, k) {
        if (hnEnCours) return;
        const v = resultat.voies[i], commune = resultat.commune.nom;
        const seule = k != null ? v.adresses[k] : null;
        if (k != null && !hnPosable(seule)) return;
        const vPlan = seule ? Object.assign({}, v, { adresses: [seule] }) : v;
        // Le droit est relu à chaque clic, pas seulement au démarrage.
        if (!(await lireDroitGeste(seule ? 'hn1' : 'voie'))) { rendre(); statut(t(seule ? 'ajHn1Rights' : 'ajHnRights'), true); return; }
        const q = Core.quotaHn(lireHorodatages(), Date.now());
        if (!q.reste) { statut(t('ajHnQuota', heureCourte(q.libre)), true); return; }
        hnEnCours = true;
        hnStop = false;
        majArrierePlan(true);
        rendre();
        statut(t('ajHnRunning'));
        let msg = null;
        try {
            let n = 0, nRpp = 0, nEchec = 0, err = null, admisTotal = 0, nVerrou = 0, niveauVerrou = null, sugg = null, suggRetiree = false;
            const critiques = [];
            const horo = q.garder.slice();
            // Une pose restée sur la carte est inscrite au quota, même quand l'étape suivante a échoué.
            const inscrire = (p, rpp) => {
                horo.push(Object.assign({ t: Date.now(), s: p.segmentId, n: p.number, e: 0, c: resultat.commune.code },
                    rpp ? { r: 1, lon: p.lon, lat: p.lat, p: SESSION_HN } : { p: SESSION_HN }));
                ecrireHorodatages(horo);
            };
            let sansAlt = 0, sansAltR = 0;
            // Rappel de responsabilité fermé sans l'accepter, à la première écriture : rien n'a été écrit, le geste s'arrête sans bilan.
            let refusRappel = false;
            const msgAlt =() => (sansAlt ? ' ' + t('ajHnSansAlt', v.nom, commune) : '') + (sansAltR ? ' ' + t('ajHnSansAltRoute', v.nom, commune) : '');
            const passe = async (cadrerSiBesoin, zone) => {
                const { segs, existants } = await lireVoieHn(v, cadrerSiBesoin, zone);
                const plan = Core.planHn(vPlan, commune, segs, existants, Core.quotaHn(horo, Date.now()).reste, { lot: !seule });
                log('numéros ' + v.nom + ' : ' + plan.poses.length + ' à poser, segments admis ' + plan.admis + '/' + segs.length +
                    ' (hors agglo ' + plan.hors + ', autre nom ' + plan.refus.nom + ', autre ville ' + plan.refus.ville + '), écartés ' + JSON.stringify(plan.ecartes));
                admisTotal += plan.admis;
                sansAlt = Math.max(sansAlt, plan.refus.sansAlt || 0);
                sansAltR = Math.max(sansAltR, plan.refus.sansAltRoute || 0);
                const parSeg = new Map(segs.map(x => [x.id, x]));
                for (const p of plan.poses) {
                    if (hnStop) break;
                    if (p.rpp) {
                        if (!await rappelAccepte()) { refusRappel = true; break; }
                        const r = await creerRppDirect(p, parSeg.get(p.segmentId));
                        if (r.critique) critiques.push(r.critique);
                        if (r.reste) inscrire(p, true);
                        if (!r.ok) { nEchec++; err = new Error(r.erreur); log('RPP ' + p.number + (p.direct ? ' (allée)' : '') + ' : ' + r.erreur); continue; }
                        log('RPP ' + p.number + ' ' + p.rpp.rue + (p.direct ? ' : au bout de l\'allée ' + p.allee + ', entrée sur l\'allée' : p.libre ? ' : aucun segment au nom BAN, entrée sur le segment ' + p.segmentId : ' : hors agglomération'));
                        nRpp++;
                        p.adresse.hnRpp = true;
                        inscrire(p, true);
                    } else {
                        if (!(await hnPermis(p.segmentId))) {
                            const sg = parSeg.get(p.segmentId), rang = (await _hp()).n;
                            // Niveau cité seulement s'il dépasse le rang ; sinon le refus vient des zones d'édition.
                            const niv = sg && sg.verrou != null && rang >= 0 && sg.verrou > rang ? sg.verrou + 1 : null;
                            droitSegCache.delete(String(p.segmentId));
                            log('numéro ' + p.number + ' : segment ' + p.segmentId + ' non modifiable (verrou ' + (sg && sg.verrou != null ? sg.verrou + 1 : '?') + ')' + (seule ? ', posé : suggestion à l\'enregistrement' : ''));
                            if (!seule) { nVerrou++; if (niv) niveauVerrou = niv; continue; }
                            // Un seul numéro : WME en fera une suggestion à l'enregistrement (décision du mainteneur, 18/11/2026).
                            seule.hn1Seg = p.segmentId; seule.hn1Bloque = { niveau: niv };
                            sugg = { niveau: niv };
                        }
                        if (!await rappelAccepte()) { refusRappel = true; break; }
                        const nA = hnAjout.n, avant = sugg ? await enAttente() : null;
                        try { await sdk.DataModel.HouseNumbers.addHouseNumber({ number: p.number, point: { type: 'Point', coordinates: [p.lon, p.lat] }, segmentId: p.segmentId }); }
                        catch (e) {
                            err = e;
                            nEchec++;
                            log('numéro ' + p.number + ' : ' + (e && e.name) + ' — ' + (e && e.message));
                            if (e && e.name === 'InvalidStateError') break;
                            continue;
                        }
                        if (sugg) {
                            // Suggestion : WME la retire s'il y a une édition directe en attente (elles ne s'enregistrent pas ensemble).
                            await new Promise(r => setTimeout(r, 400));
                            const apres = await enAttente();
                            if (avant == null || apres == null || apres <= avant) { suggRetiree = true; sugg = null; log('numéro ' + p.number + ' : suggestion retirée par WME'); continue; }
                        }
                        n++;
                        inscrire(p, false);
                        p.adresse.hnId = hnAjout.n > nA ? hnAjout.id : null;
                    }
                    p.adresse.hnPose = true;
                    p.adresse.hnSeg = p.segmentId;
                    p.adresse.hnNum = p.number;
                }
                return plan;
            };
            let plan;
            if (seule) {
                await assurerVue(seule.lon, seule.lat);
                plan = await passe(false, { lon: seule.lon, lat: seule.lat, adresses: [seule] });
                if (refusRappel) { statut(''); return; }
                if (!n && !nRpp && !err) {
                    const e = plan.ecartes, num = Core.numeroHn(seule.brut);
                    if (suggRetiree) msg = [t('suggAttente'), true];
                    else if (!admisTotal) msg = [t('ajHnNoSeg') + msgAlt(), true];
                    else if (e.existe) msg = [t('ajHn1Exists', num), true];
                    else if (e.loin) msg = [t('ajHn1Far', num) + msgAlt(), true];
                    else msg = [t('ajHnNone'), true];
                    return;
                }
            } else plan = await passe(true);
            if (refusRappel) { statut(''); return; }
            // Une voie plus longue que la vue se parcourt par zones ; une zone sans progrès n'est pas retentée.
            if (!seule && plan.ecartes.loin && Core.quotaHn(horo, Date.now()).reste && !hnStop) {
                const restantes = () => v.adresses.filter(a => !a.trouve && !a.hnPose && !a.hnEnregistre && !Core.suffixeBloque(a) && Core.numeroHn(a.brut));
                const zones = Core.zonesHn(restantes(), 400, 220);
                for (const z of zones) {
                    if (hnStop || !Core.quotaHn(horo, Date.now()).reste || err && err.name === 'InvalidStateError') break;
                    await sdk.Map.setMapCenter({ lonLat: { lon: z.lon, lat: z.lat }, zoomLevel: Math.max(16, await sdk.Map.getZoomLevel()) });
                    await new Promise(r => setTimeout(r, 2500));
                    if (hnStop) break;
                    const pz = await passe(false, z);
                    if (refusRappel) { statut(''); return; }
                    log('zone ' + z.lon.toFixed(5) + ',' + z.lat.toFixed(5) + ' (' + z.adresses.length + ' adresses) : ' + pz.poses.length + ' posé(s)');
                }
                plan = { ecartes: Object.assign({}, plan.ecartes, { loin: restantes().filter(a => !a.hnPose).length }) };
                plan.ecartes.existe = 0; plan.ecartes.quota = 0;
            }
            // Sans segment admis, une pose a pu partir en RPP « nom BAN / commune » : le bilan de la pose l'emporte alors.
            if (!admisTotal && !(n + nRpp)) { msg = [t('ajHnNoSeg') + msgAlt(), true]; return; }
            const e = plan.ecartes, ecartes = seule ? 0 : e.existe + e.suffixe + e.format + e.loin;
            const coupe = !seule && e.quota ? ' ' + t('ajHnCut', nb(e.quota), heureCourte(Core.quotaHn(horo, Date.now()).libre)) : '';
            msg = [(critiques.length ? t('ajRppCrit', critiques.join(' · ')) + ' ' : '') +
                (nRpp && !n ? t('ajHnDoneRpp', nb(nRpp), nb(Core.quotaHn(horo, Date.now()).reste)) : nRpp ? t('ajHnDoneMix', nb(n), nb(nRpp), nb(Core.quotaHn(horo, Date.now()).reste)) : t('ajHnDone', nb(n), nb(Core.quotaHn(horo, Date.now()).reste))) +
                (n + nRpp ? ' ' + t('ajHnSee', n + nRpp) : '') + (sugg && n ? ' ' + t('ajHn1Lock', Core.numeroHn(seule.brut), sugg.niveau) : '') + (hnStop ? ' ' + t('ajHnStopped') : '') + coupe +
                (ecartes ? ' ' + t('ajHnSkip', nb(ecartes)) : '') +
                (nEchec ? ' ' + t('ajHnFail', nb(nEchec)) : '') + (nVerrou ? ' ' + t('ajHnLockSkip', nb(nVerrou)) : '') +
                (e.loin ? msgAlt() : '') +
                (err ? ' ' + t('ajHnErr', (err && (err.message || err.name)) || '') : ''), (!(n + nRpp) && (!!err || nVerrou > 0)) || critiques.length > 0];
        } catch (e) { log('ajout de numéros : ' + e.message); msg = [t('ajHnErr', e.message), true]; }
        finally {
            // hnEnCours retombe AVANT le rendu : sinon le bouton resterait grisé.
            hnEnCours = false;
            hnStop = false;
            majArrierePlan();
            v.apercuHn = null;
            apercuHn(i);
            if (msg) vue.hnMsg = { i, txt: msg[0], err: msg[1] };
            rendre();
            appliquerVisibilite();
            if (msg) statut(msg[0], msg[1]);
        }
    }

    // ⚠️ Le SDK rend encore un objet supprimé non enregistré : « ⇄ » exige qu'AUCUNE modification n'attende.
    const rppRetires = new Set();
    // addHouseNumber ne rend rien : l'identifiant vient de « wme-data-model-objects-added », AVANT la résolution de la promesse.
    const hnAjout = { n: 0, id: null };
    async function trouverRpp(a) {
        let liste = [];
        try { liste = (await sdk.DataModel.Venues.getAll()) || []; } catch (e) { return null; }
        // Aucun lieu chargé du tout : le calque « Lieux » de WME est masqué (WME ne charge alors aucun POI).
        if (!liste.length) return { aucunLieu: true };
        const m = Core.normNum(a.brut), k = Math.cos(a.wlat * Math.PI / 180) * 111320;
        for (const p of liste) {
            if (!p || !p.isResidential || !p.geometry || rppRetires.has(String(p.id))) continue;
            let pos = p.geometry.coordinates;
            if (p.geometry.type === 'Polygon') { const r = pos[0]; pos = [r.reduce((x, q) => x + q[0], 0) / r.length, r.reduce((x, q) => x + q[1], 0) / r.length]; }
            if (Math.hypot((pos[0] - a.wlon) * k, (pos[1] - a.wlat) * 110540) > 10) continue;
            let ad = null;
            try { ad = await sdk.DataModel.Venues.getAddress({ venueId: String(p.id) }); } catch (e) { continue; }
            if (!ad || Core.normNum(ad.houseNumber) !== m) continue;
            const nav = (p.navigationPoints || []).find(x => x && x.isEntry !== false && x.point) || (p.navigationPoints || [])[0];
            return { id: String(p.id), nom: (p.name || '').trim(), photos: (p.images || []).length, num: ad.houseNumber,
                verrou: typeof p.lockRank === 'number' ? p.lockRank : null,
                rue: (ad.street && ad.street.name) || '', ville: (ad.city && ad.city.name) || '', pos,
                acces: nav && nav.point && nav.point.coordinates ? nav.point.coordinates : null };
        }
        return null;
    }
    async function segmentsAutour(lon, lat) {
        const dLat = 400 / 110540, dLon = 400 / (111320 * Math.cos(lat * Math.PI / 180)), out = [];
        let liste = [];
        try { liste = (await sdk.DataModel.Segments.getAll()) || []; } catch (e) { return out; }
        for (const sg of liste) {
            const c = sg && sg.geometry && sg.geometry.coordinates;
            if (!c || c.length < 2 || !c.some(([x, y]) => Math.abs(x - lon) <= dLon && Math.abs(y - lat) <= dLat)) continue;
            let noms = [];
            try {
                const ad = (await sdk.DataModel.Segments.getAddress({ segmentId: sg.id })) || {};
                noms = [ad.street && ad.street.name].concat((ad.altStreets || []).map(x => x.street && x.street.name)).filter(Boolean);
            } catch (e) { }
            out.push({ id: sg.id, coords: c, noms, rt: sg.roadType });
        }
        return out;
    }
    // RPP → numéro, en écart franc seulement : refusé tant qu'une modification attend (le SDK cache numéros et suppressions en attente) ;
    // un remplacement compte 2 au quota, un doublon retiré 1 ; une étape qui échoue défait tout le geste.
    async function convertirRppVoie(i, k) {
        if (hnEnCours) return;
        const v = resultat.voies[i], a = v && v.adresses[k], commune = resultat.commune.nom;
        if (!a || a.trouve !== 'RPP' || a.rppHn || a.wlon == null) return;
        if (!(await lireDroitGeste('conv'))) { rendre(); statut(t('ajHnRights'), true); return; }
        const q = Core.quotaHn(lireHorodatages(), Date.now());
        if (!q.reste) { statut(t('ajHnQuota', heureCourte(q.libre)), true); return; }
        const n0 = await enAttente();
        if (n0 !== 0) { statut(t('rhnUnsaved'), true); return; }
        hnEnCours = true;
        majArrierePlan(true);
        statut(t('ajHnRunning'));
        let msg = null;
        try {
            await assurerVue(a.wlon, a.wlat);
            const rpp = await trouverRpp(a);
            if (!rpp) { msg = [t('rhnNotFound'), true]; return; }
            if (rpp.aucunLieu) { msg = [t('rhnNoPlaces'), true]; return; }
            if (rpp.nom) { msg = [t('rhnNamed'), true]; return; }
            if (rpp.photos) { msg = [t('rhnPhoto'), true]; return; }
            if (!Core.villeHnOk(rpp.ville, commune)) { msg = [t('rhnCity', rpp.ville || '—'), true]; return; }
            const rang = (await _hp()).n;
            // Sans droit direct (RPP ou segment verrouillé au-dessus du rang) : WME fera de la conversion une suggestion à l'enregistrement.
            const suggRpp = rpp.verrou != null && rang >= 0 && rpp.verrou > rang ? rpp.verrou + 1 : 0;
            if (Core.nomSouple(rpp.rue) !== Core.nomSouple(v.nom)) { msg = [t('rhnStreet', rpp.rue || '—'), true]; return; }
            const number = Core.numeroHn(rpp.num);
            if (!number) { msg = [t('rhnFormat', rpp.num), true]; return; }
            const [lon, lat] = rpp.pos;
            const { segs } = await lireVoieHn(v, false, { lon, lat, adresses: [{ lon, lat }] });
            const nomBan = Core.nomSouple(v.nom);
            const admis = segs.filter(sg => Core.nomSouple(sg.nom) === nomBan && Core.villeHnOk(sg.ville, commune) && sg.coords && sg.coords.length > 1);
            let cible = null, dc = 80;
            for (const sg of admis) { const d = Core.distTrace(lon, lat, sg.coords); if (d <= dc) { dc = d; cible = sg; } }
            if (!cible) { msg = [t('rhnNoSeg'), true]; return; }
            let doublon = null;
            const kx = Math.cos(lat * Math.PI / 180) * 111320, dist = c => Math.hypot((c[0] - lon) * kx, (c[1] - lat) * 110540);
            const noter = (seg, c) => { const d = dist(c); if (d <= Core.RPP_DOUBLON_M && (!doublon || d < doublon.dist)) doublon = { dist: d, seg }; };
            const ids = admis.map(sg => sg.id);
            for (let n = 0; n < ids.length; n += 250) {
                const lot = await sdk.DataModel.HouseNumbers.fetchHouseNumbers({ segmentIds: ids.slice(n, n + 250) });
                for (const h of lot || []) if (Core.normNum(h.number) === Core.normNum(number) && h.geometry) noter(h.segmentId, h.geometry.coordinates);
            }
            const autour = await segmentsAutour(lon, lat);
            const acces = rpp.acces ? Core.voieLaPlusProche(rpp.acces[0], rpp.acces[1], autour) : null;
            const pos = Core.voieLaPlusProche(lon, lat, autour);
            const vd = Core.verdictRppHn({ rue: rpp.rue, acces, pos, doublon });
            log('RPP ' + number + ' ' + v.nom + ' : ' + vd.verdict + ' (' + vd.motif + ')' + (doublon ? ', doublon à ' + Math.round(doublon.dist) + ' m' : '') +
                ', segment ' + cible.id + ' à ' + Math.round(dc) + ' m' + [['accès', acces], ['position', pos]].filter(x => x[1]).map(([lib, x]) =>
                    ' ; ' + lib + ' : « ' + (x.noms.join(' | ') || 'sans nom') + ' » à ' + Math.round(x.dist) + ' m, autre voie à ' + (Number.isFinite(x.distAutreVoie) ? Math.round(x.distAutreVoie) + ' m' : '—')).join(''));
            if (vd.verdict === 'conforme') { msg = [t('rhnLegit', vd.voie), true]; return; }
            if (vd.verdict !== 'ecart') { msg = [t('rhnUnsure'), true]; return; }
            const suggSeg = !doublon && !(await hnPermis(cible.id)) ? { n: await niveauVerrouSeg(cible.id) } : null;
            // WME n'enregistre pas ensemble une suggestion et une modification directe : un geste « mixte » est refusé d'avance.
            if (!doublon && !!suggRpp !== !!suggSeg) { msg = [t('suggMixte'), true]; return; }
            if (!doublon && q.reste < 2) { msg = [t('ajHnQuota', heureCourte(Core.quotaHn(q.garder.concat([Date.now()]), Date.now()).libre)), true]; return; }
            if (!await rappelAccepte()) { statut(''); return; }
            const DM = sdk.DataModel;
            let seg = cible.id;
            if (doublon) {
                seg = doublon.seg;
                await DM.Venues.deleteVenue({ venueId: rpp.id });
            } else {
                // Le RPP d'abord : c'est l'étape que WME refuse le plus souvent (verrou, droits).
                await DM.Venues.deleteVenue({ venueId: rpp.id });
                const avant = suggSeg ? await enAttente() : null;
                try {
                    await DM.HouseNumbers.addHouseNumber({ number, point: { type: 'Point', coordinates: [lon, lat] }, segmentId: cible.id });
                    if (suggSeg) {
                        await new Promise(r => setTimeout(r, 400));
                        const apres = await enAttente();
                        if (avant == null || apres == null || apres <= avant) throw new Error(t('suggAttente'));
                    }
                }
                catch (e) {
                    const defait = await defaireJusqua(n0);
                    if (!defait) { const hz = q.garder.slice(); hz.push({ t: Date.now(), s: cible.id, n: number, e: 0, c: resultat.commune.code, p: SESSION_HN }); ecrireHorodatages(hz); }
                    throw new Error('numéro non posé (' + e.message + ')' + (defait ? ', RPP remis' : ' — ' + t('rhnCritRpp', number)));
                }
            }
            rppRetires.add(rpp.id);
            const horo = q.garder.slice();
            horo.push({ t: Date.now(), s: seg, n: number, e: 0, c: resultat.commune.code, p: SESSION_HN });
            if (!doublon) horo.push({ t: Date.now() + 1, s: seg, n: number, e: 0, c: resultat.commune.code, p: SESSION_HN });
            ecrireHorodatages(horo);
            Object.assign(a, { rppHn: true, hnPose: true, hnSeg: seg, hnNum: number });
            const reste = nb(Core.quotaHn(horo, Date.now()).reste);
            msg = [(doublon ? t('rhnDoneDbl', number, reste) : t('rhnDone', number, reste)) + (suggRpp ? ' ' + t('rhnLock', suggRpp) : rpp.verrou ? ' ' + t('rhnLockInfo', rpp.verrou + 1) : '') + (suggSeg ? ' ' + t('rhnSegLock', suggSeg.n) : '') + ' ' + t('ajHnSee', 1), false];
        } catch (e) { log('RPP → numéro : ' + e.message); msg = [t('rhnErr', e.message), true]; }
        finally {
            hnEnCours = false;
            majArrierePlan();
            if (msg) vue.hnMsg = { i, txt: msg[0], err: msg[1] };
            rendre();
            appliquerVisibilite();
            if (msg) statut(msg[0], msg[1]);
        }
    }

    // Numéro → RPP : entrée par Core.entreeRpp, RPP SÉLECTIONNÉ pour que l'éditeur ajuste ; une étape refusée défait tout le geste.
    // Quota : un numéro de WBC en attente change de nature ; un numéro enregistré compte 2.
    const hnConvertible = a => !!a && !a.hnVersRpp && !a.rppHn && !a.hnRpp && !!Core.numeroHn(a.brut) &&
        ((a.trouve === 'HN' && a.wlon != null) || (!a.trouve && a.hnPose && a.hnId != null && a.hnSeg != null));
    async function convertirHnRpp(i, k) {
        if (hnEnCours) return;
        const v = resultat.voies[i], a = v && v.adresses[k], commune = resultat.commune.nom, code = resultat.commune.code;
        if (!hnConvertible(a)) return;
        if (!(await lireDroitGeste('conv'))) { rendre(); statut(t('ajHnRights'), true); return; }
        const enAtt = !a.trouve;
        const q = Core.quotaHn(lireHorodatages(), Date.now());
        if (!enAtt && q.reste < 2) { statut(t('ajHnQuota', heureCourte(Core.quotaHn(q.garder.concat([Date.now()]), Date.now()).libre)), true); return; }
        hnEnCours = true;
        majArrierePlan(true);
        statut(t('ajHnRunning'));
        let msg = null;
        const n0 = await enAttente();
        try {
            const lon0 = enAtt ? a.lon : a.wlon, lat0 = enAtt ? a.lat : a.wlat;
            await assurerVue(lon0, lat0);
            const autour = await segmentsAutour(lon0, lat0);
            let hn = null;
            if (enAtt) hn = { id: String(a.hnId), seg: a.hnSeg, number: a.hnNum, pos: [a.lon, a.lat] };
            else {
                const kx = Math.cos(lat0 * Math.PI / 180) * 111320, m = Core.normNum(a.brut);
                let bd = 10;
                const ids = autour.map(s => s.id);
                for (let n = 0; n < ids.length; n += 250) {
                    const lot = await sdk.DataModel.HouseNumbers.fetchHouseNumbers({ segmentIds: ids.slice(n, n + 250) });
                    for (const h of lot || []) {
                        if (!h || !h.geometry || Core.normNum(h.number) !== m) continue;
                        const c = h.geometry.coordinates, d = Math.hypot((c[0] - lon0) * kx, (c[1] - lat0) * 110540);
                        if (d <= bd) { bd = d; hn = { id: String(h.id), seg: h.segmentId, number: h.number, pos: c }; }
                    }
                }
            }
            if (!hn) { msg = [t('rhnVersRppAbsent', a.brut), true]; return; }
            const suggSeg = !(await hnPermis(hn.seg)) ? { n: await niveauVerrouSeg(hn.seg) } : null;
            // Le numéro serait retiré en suggestion et le RPP créé en direct : WME ne les enregistre pas ensemble.
            if (suggSeg) { msg = [t('suggMixte'), true]; return; }
            let sad = null;
            try { sad = (await sdk.DataModel.Segments.getAddress({ segmentId: Number(hn.seg) })) || null; } catch (e) { }
            const rues = sad ? [sad.street ? { st: sad.street, ci: sad.city } : null].concat((sad.altStreets || []).map(x => ({ st: x.street, ci: x.city }))).filter(x => x && x.st && x.st.name) : [];
            const rue = rues.find(x => Core.nomSouple(x.st.name) === Core.nomSouple(v.nom)) || rues[0];
            if (!rue) { msg = [t('rhnVersRppAbsent', a.brut), true]; return; }
            const ville = Core.villeRpp((rue.ci && rue.ci.name) || '') || commune;
            const segNum = autour.find(s => String(s.id) === String(hn.seg));
            const choix = Core.entreeRpp(hn.pos[0], hn.pos[1], autour, hn.seg);
            const entree = choix ? choix.entree : segNum ? Core.pointLePlusProche(hn.pos[0], hn.pos[1], segNum.coords) : null;
            log('numéro ' + hn.number + ' ' + v.nom + ' → RPP : entrée ' + (choix ? 'sur le segment ' + choix.seg.id + ' (' + (choix.seg.noms.join(' | ') || 'sans nom') + ', type ' + choix.seg.rt + ') à ' + Math.round(choix.d) + ' m' : 'sur le segment du numéro'));
            if (!await rappelAccepte()) { statut(''); return; }
            const DM = sdk.DataModel;
            await DM.HouseNumbers.deleteHouseNumber({ houseNumberId: hn.id });
            const r = await creerRppDirect({ number: hn.number, lon: hn.pos[0], lat: hn.pos[1], entree, rpp: { rue: rue.st.name, ville } },
                { stateId: sad && sad.state ? sad.state.id : null, countryId: sad && sad.country ? sad.country.id : null, coords: segNum ? segNum.coords : null });
            if (!r.ok) {
                const defait = await defaireJusqua(n0);
                throw new Error(r.erreur + (defait ? ', numéro remis' : ''));
            }
            const horo = lireHorodatages().slice();
            const entreeRppQ = { t: Date.now(), s: hn.seg, n: hn.number, e: 0, c: code, r: 1, lon: hn.pos[0], lat: hn.pos[1], p: SESSION_HN };
            if (enAtt) {
                const j = horo.findIndex(x => x && typeof x === 'object' && x.e === 0 && x.r !== 1 && x.s === hn.seg && Core.normNum(x.n) === Core.normNum(hn.number));
                if (j >= 0) horo[j] = Object.assign(entreeRppQ, { t: horo[j].t }); else horo.push(entreeRppQ);
            } else {
                horo.push({ t: Date.now(), s: hn.seg, n: hn.number, e: 1, c: code });
                horo.push(Object.assign(entreeRppQ, { t: Date.now() + 1 }));
            }
            ecrireHorodatages(horo);
            Object.assign(a, { hnVersRpp: true, hnRpp: true, hnPose: true, hnSeg: hn.seg, hnNum: hn.number, hnId: null, hnLon: hn.pos[0], hnLat: hn.pos[1] });
            try { await sdk.Editing.setSelection({ selection: { ids: [String(r.id)], objectType: 'venue' } }); } catch (e) { log('sélection du RPP : ' + e.message); }
            msg = [t('rhnVersRppDone', hn.number, nb(Core.quotaHn(horo, Date.now()).reste)), false];
        } catch (e) { log('numéro → RPP : ' + e.message); msg = [t('rhnErr', e.message), true]; }
        finally {
            hnEnCours = false;
            majArrierePlan();
            if (msg) vue.hnMsg = { i, txt: msg[0], err: msg[1] };
            rendre();
            appliquerVisibilite();
            if (msg) statut(msg[0], msg[1]);
        }
    }

    // 🔴 L'aperçu suit le cadrage de 1,2 s : voie pas entièrement chargée ⇒ pas d'aperçu (il vaudrait 0), nouvel essai plus tard.
    async function apercuHn(i, essai) {
        const v = resultat && resultat.voies[i];
        if (!v || !droitGeste('hn1') || !v.adresses.some(a => !a.trouve && !a.hnPose)) return;
        try {
            const { segs, existants, attendus, charges } = await lireVoieHn(v, false);
            if (charges < attendus) {
                v.apercuHn = null;
                const n = essai || 0;
                if (n < 8 && vue.ouverte === i) setTimeout(() => { if (vue.ouverte === i) apercuHn(i, n + 1); }, 1500);
                if (vue.ouverte === i && !hnEnCours) rendre();
                return;
            }
            const pl = Core.planHn(v, resultat.commune.nom, segs, existants, Infinity);
            await noterBlocagesHn1(pl.poses);
            v.apercuHn = { hn: pl.poses.filter(p => !p.rpp).length, allee: pl.poses.filter(p => p.rpp && p.direct).length, rpp: pl.poses.filter(p => p.rpp && !p.direct).length, loin: pl.ecartes.loin, nomEcart: !pl.admis && pl.nomsVoie.length ? pl.nomsVoie[0] : '' };
            if (vue.ouverte === i && !hnEnCours) rendre();
        } catch (e) { log('aperçu ' + v.nom + ' : ' + e.message); }
    }

    // Pastilles de la voie ouverte : le segment de chaque pose prévue est relu (cache par segment).
    async function noterBlocagesHn1(poses) {
        let change = false;
        for (const p of poses) {
            const seg = p.rpp ? null : p.segmentId, b = seg == null ? null : await blocageSegHn(seg);
            p.adresse.hn1Seg = seg;
            if (JSON.stringify(p.adresse.hn1Bloque || null) !== JSON.stringify(b)) { p.adresse.hn1Bloque = b; change = true; }
        }
        return change;
    }
    // Segments chargés ou modifiés, enregistrement : cache vidé, pastilles de la voie ouverte relues (400 ms après le dernier).
    let blocagesMinuteur = null;
    function blocagesPerimes() {
        viderDroitSeg();
        clearTimeout(blocagesMinuteur);
        blocagesMinuteur = setTimeout(async () => {
            const i = vue.ouverte, v = resultat && i != null ? resultat.voies[i] : null;
            if (!v || hnEnCours) return;
            let change = false;
            for (const a of v.adresses) {
                if (a.hn1Seg == null) continue;
                const b = await blocageSegHn(a.hn1Seg);
                if (JSON.stringify(a.hn1Bloque || null) !== JSON.stringify(b)) { a.hn1Bloque = b; change = true; }
            }
            if (change && vue.ouverte === i && !hnEnCours) rendre();
        }, 400);
    }

    let suiviJeton = 0;
    async function suivreSelection() {
        if (!ovEl || !ovEl.classList.contains('open') || !resultat || hnEnCours) return;
        const j = ++suiviJeton;
        let sel = null;
        try { sel = await sdk.Editing.getSelection(); } catch (e) { return; }
        if (j !== suiviJeton || !resultat || !sel || !sel.ids || !sel.ids.length) return;
        if (sel.objectType === 'venue') { if (sel.ids.length === 1) await bulleDuRpp(String(sel.ids[0]), j); return; }
        if (sel.objectType !== 'segment') return;
        const id = String(sel.ids[0]);
        let i = resultat.voies.findIndex(v => (v.segs || []).some(s => String(s) === id));
        if (i < 0) {
            let nom = '';
            try {
                const s = await sdk.DataModel.Segments.getById({ segmentId: Number(id) });
                const st = s && s.primaryStreetId != null ? await sdk.DataModel.Streets.getById({ streetId: s.primaryStreetId }) : null;
                nom = (st && st.name) || '';
            } catch (e) { }
            if (j !== suiviJeton || !resultat || !nom) return;
            const k = Core.normNom(nom);
            i = resultat.voies.findIndex(v => Core.normNom(v.nom) === k && (!vue.deleguee || v.deleguee === vue.deleguee));
        }
        if (i < 0 || vue.ouverte === i) return;
        if (!voiesFiltrees(resultat).includes(resultat.voies[i])) { vue.texte = ''; vue.filtre = 'all'; }
        vue.curseur = -1;
        vue.ouverte = i;
        rendre();
        majCalque();
        const tr = ovEl.querySelector('tr[data-voie="' + i + '"]');
        if (tr) tr.scrollIntoView({ block: 'start' });
        setTimeout(() => { if (vue.ouverte === i) apercuHn(i); }, 300);
    }

    async function bulleDuRpp(id, j) {
        if (!droitGeste('conv')) return;
        let v = null, ad = null;
        try { v = await sdk.DataModel.Venues.getById({ venueId: id }); ad = await sdk.DataModel.Venues.getAddress({ venueId: id }); } catch (e) { return; }
        if (j !== suiviJeton || !resultat || !v || !v.isResidential || !v.geometry || v.geometry.type !== 'Point' || !ad || !ad.houseNumber) return;
        const [lon, lat] = v.geometry.coordinates, kx = Math.cos(lat * Math.PI / 180) * 111320, m = Core.normNum(ad.houseNumber);
        let cible = null, dmin = 10;
        for (const voie of resultat.voies) for (const a of voie.adresses) {
            if (!rppConvertible(a) || Core.normNum(a.brut) !== m) continue;
            const d = Math.hypot((a.wlon - lon) * kx, (a.wlat - lat) * 110540);
            if (d <= dmin) { dmin = d; cible = { voie, ad: a }; }
        }
        if (!cible) return;
        // Le panneau de sélection de WME décale la carte en s'ouvrant : on attend qu'il soit posé.
        await new Promise(r => setTimeout(r, 600));
        if (j !== suiviJeton) return;
        let px = null, rc = null;
        try { px = await sdk.Map.getPixelFromLonLat({ lonLat: { lon, lat } }); rc = (await sdk.Map.getMapViewportElement()).getBoundingClientRect(); } catch (e) { return; }
        if (!px || !rc) return;
        ouvrirBulle({ voie: cible.voie, ad: cible.ad, lon, lat }, rc.left + px.x, rc.top + px.y);
    }

    function ouvrirVoie(i) {
        vue.curseur = -1;
        vue.ouverte = vue.ouverte === i ? null : i;
        rendre();
        majCalque();
        if (vue.ouverte != null) {
            Promise.resolve(cadrer(resultat.voies[i].bbox)).then(() => new Promise(r => setTimeout(r, 1200))).then(() => apercuHn(i));
            const tr = ovEl.querySelector('tr[data-voie="' + i + '"]');
            if (tr) tr.focus({ preventScroll: true });
        }
    }

    // Dans .edit-area-main (niveau 1) : sur <body>, aucun z-index ne passe sous le panneau « Calques » sans passer sous la carte.
    const zoneCarte = () => document.querySelector('div.edit-area-main');
    const zFenetre = () => (ovEl && ovEl.parentElement === document.body ? '9991' : '1');
    function poserFenetre() {
        const z = zoneCarte();
        if (z && ovEl.parentElement !== z) z.appendChild(ovEl);
        else if (!z && !ovEl.isConnected) document.body.appendChild(ovEl);
        ovEl.style.zIndex = zFenetre();
    }
    function construireFenetre() {
        ovEl = document.createElement('div');
        ovEl.id = 'wbc-ov';
        ovEl.dir = _lang === 'he' ? 'rtl' : 'ltr';
        ovEl.tabIndex = -1;
        ovEl.setAttribute('role', 'dialog');
        ovEl.setAttribute('aria-label', SCRIPT_NAME);
        ovEl.innerHTML = htmlFenetre();
        poserFenetre();
        ovEl.addEventListener('click', surClic);
        ovEl.addEventListener('keydown', gardeTouche);
        ovEl.addEventListener('keydown', ev => {
            if (ev.key !== 'Escape' || ev.ctrlKey || ev.metaKey || ev.altKey) return;
            ev.preventDefault();
            ev.stopPropagation();
            fermerFenetre();
        });
        const auPremierPlan = () => { ovEl.style.zIndex = zFenetre(); };
        ovEl.addEventListener('mousedown', auPremierPlan, true);
        ovEl.addEventListener('focusin', auPremierPlan);
        ovEl.addEventListener('keydown', ev => {
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
    // Fenêtre ouverte : les calques WME des numéros de rue et des lieux résidentiels sont affichés ; à la fermeture,
    // seuls ceux que WBC a cochés sont décochés (un réglage changé entre-temps par l'éditeur est laissé tel quel).
    const CALQUES_WME = ['layer-switcher-group_places', 'layer-switcher-item_residential_places', 'layer-switcher-item_house_numbers'];
    let calquesCoches = null;
    function afficherCalquesWme() {
        if (calquesCoches) return;
        calquesCoches = [];
        for (const id of CALQUES_WME) {
            const el = document.getElementById(id);
            if (!el || el.checked) continue;
            try { el.click(); if (el.checked) calquesCoches.push(id); } catch (e) { log('calque ' + id + ' : ' + e.message); }
        }
    }
    function rendreCalquesWme() {
        if (!calquesCoches) return;
        for (const id of calquesCoches.slice().reverse()) {
            const el = document.getElementById(id);
            if (el && el.checked) { try { el.click(); } catch (e) { log('calque ' + id + ' : ' + e.message); } }
        }
        calquesCoches = null;
    }
    window.addEventListener('pagehide', rendreCalquesWme);
    function ouvrirFenetre(prendreFocus) {
        if (!ovEl) return;
        const deja = ovEl.classList.contains('open');
        ovEl.classList.add('open');
        if (!deja) afficherCalquesWme();
        carteSeule = false;
        poserFenetre();
        if (!deja) placerFenetre(lireGeom());
        majFab();
        appliquerVisibilite();
        if (prendreFocus && !deja) { retourFocus = document.activeElement; ovEl.focus(); }
    }
    function fermerFenetre() {
        if (!ovEl) return;
        const dedans = ovEl.contains(document.activeElement);
        ovEl.classList.remove('open');
        rendreCalquesWme();
        majFab();
        appliquerVisibilite();
        if (dedans) {
            const cible = retourFocus && document.contains(retourFocus) ? retourFocus : document.getElementById('wbc-fab-btn');
            if (cible) cible.focus();
        }
        retourFocus = null;
    }

    // Bornes MESURÉES à chaque geste, y compris l'en-tête flottant de WME Studio (îlot déplaçable).
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
            placerFenetre({ x: r.left, y: r.top, w: r.width, h: Number(ovEl.dataset.h) || r.height });
            delete ovEl.dataset.h;
        }
        memoriserGeometrie();
    }
    function basculerTaille() {
        basculerRepli(false);
        const z = bornesCarte(), r = ovEl.getBoundingClientRect();
        const pleine = r.width >= (z.droite - z.gauche) - 4;
        placerFenetre(pleine ? null : { x: z.gauche, y: z.haut, w: z.droite - z.gauche, h: z.bas - z.haut });
        memoriserGeometrie();
    }
    function petiteFenetre() {
        basculerRepli(false);
        placerFenetre(null);
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

    // Nouvelle version : .meta.js de GreasyFork, au plus une fois par 24 h ; pastille éteinte au moindre doute.

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


    const AIDE = [
        { id: 'what', t: 'hWhatT', b: 'hWhatB' },
        { id: 'match', t: 'hMatchT', b: 'hMatchB' },
        { id: 'names', t: 'hNamesT', b: 'hNamesB' },
        { id: 'track', t: 'hTrackT', b: 'hTrackB' },
        { id: 'hn', t: 'hHnT', b: 'hHnB', hn: true },
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
    <div class="wbc-toggle-row wbc-sb-ligne"><label class="wbc-toggle-lbl" for="wbc-numrpp">${esc(t('sbRppNum'))}</label>
        <label class="wbc-toggle"><input type="checkbox" id="wbc-numrpp"${opts.numRpp ? ' checked' : ''}><span class="wbc-toggle-slider"></span></label></div>
    <p class="wbc-sb-hint">${esc(t('sbRppNumHint'))}</p>
    <p class="wbc-sb-lbl"><label for="wbc-arret">${esc(t('sbArret'))}</label></p>
    <select class="wbc-champ wbc-sb-select" id="wbc-arret">${Core.PALIERS_ARRET.map(p => `<option value="${p}"${p === seuilArret() ? ' selected' : ''}>${esc(nb(p))}\u00a0m</option>`).join('')}</select>
    <p class="wbc-sb-hint">${esc(t('sbArretHint'))}</p>
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
    <div class="wbc-help-section"${s.hn ? ' data-hn' + (droitGeste('hn1') ? '' : ' hidden') : ''}>
        <button type="button" class="wbc-help-hdr${i === 0 ? ' on' : ''}" data-aide="${s.id}" aria-expanded="${i === 0}" title="${esc(t('tipHelpHdr'))}">${esc(t(s.t))} <span>${i === 0 ? '&#x25BC;' : '&#x25B6;'}</span></button>
        <div class="wbc-help-body" data-corps="${s.id}"${i === 0 ? '' : ' hidden'}>${t(s.b)}</div>
    </div>`).join('')}
    <div class="wbc-sb-links"${liensPied() ? '' : ' hidden'}>${liensPied()}</div>
    <p class="wbc-sb-foot">&#x1F512; ${esc(t('hSafeB'))} <a href="#" id="wbc-rappel-revoir">${esc(t('remLink'))}</a></p>
</div>`;

    async function poserOnglet() {
        try {
            const res = await sdk.Sidebar.registerScriptTab();
            res.tabLabel.innerHTML = '<span style="display:inline-flex;vertical-align:middle">' + icone(20) + '</span>';
            res.tabLabel.title = SCRIPT_NAME;
            res.tabLabel.setAttribute('aria-label', SCRIPT_NAME);
            res.tabPane.innerHTML = construireOnglet();
            majRendre();
            const appliquerCouleurs = () => { ecrireOpts(); majCalque(); majCommunes(); if (resultat || resDep) rendre(); };
            res.tabPane.addEventListener('change', ev => {
                if (ev.target.id === 'wbc-survol') { opts.survol = ev.target.checked; ecrireOpts(); if (!opts.survol) cacherFiche(); }
                if (ev.target.id === 'wbc-numrpp') { opts.numRpp = ev.target.checked; ecrireOpts(); majRpp(); }
                if (ev.target.id === 'wbc-arret') { opts.seuilArret = Number(ev.target.value) || 80; ecrireOpts(); majCalque(); if (resultat || resDep) rendre(); }
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
                if (ev.target.closest('#wbc-rappel-revoir')) { ev.preventDefault(); revoirRappel(); return; }
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


    // ─── VERSION MINIMALE ET INTÉGRITÉ ───
    // version-min.json : version retirée ou code non publié ⇒ pas de démarrage ; fichier injoignable ⇒ démarrage.
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
    // ⚠️ Au démarrage, getUserInfo() rend souvent un pseudo vide (profil pas chargé) : attente jusqu'à 10 s, puis session Discuss.
    const _vmAuteur = async () => {
        const estAuteur = n => !!n && _vmHx(String(n).toLowerCase()) === 0xc0bef069;
        try {
            const w = (typeof unsafeWindow !== 'undefined' && unsafeWindow.getWmeSdk) ? unsafeWindow : window;
            const sdkVm = w.getWmeSdk({ scriptId: 'wme-ban-coverage-vm', scriptName: String(SCRIPT_NAME) + ' (version)', mode: 'async' });
            for (let i = 0; i < 20; i++) {
                let u = null;
                try { u = await sdkVm.State.getUserInfo(); } catch (e) { u = null; }
                if (u && u.userName) return estAuteur(u.userName);
                await new Promise(r => setTimeout(r, 500));
            }
        } catch (e) { }
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
    const _vmVerdict = async () => {
        const src = (() => { try { return _wmeIntegre.toString(); } catch (e) { return ''; } })();
        let h = '';
        if (typeof src === 'string' && src.length) {
            try { h = await _vmEmpreinte(src); console.info('[' + String(SCRIPT_NAME) + ' v' + String(VERSION) + '] empreinte ' + h); } catch (e) { h = ''; }
        }
        // Lisible depuis la page : les journaux d'un script Tampermonkey n'y arrivent pas.
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
    const _vmBandeau = j => {
        const ident = 'vm-' + _vmHx(_VM_URL).toString(36);
        if (document.getElementById(ident)) return;
        const l = (() => { try { return detectLang(); } catch (e) { return 'en'; } })();
        const n = String(SCRIPT_NAME), v = String(VERSION), m = j.min;
        const T = {
            en: { retiree: `${n} v${v} has been withdrawn: a fixed version is published (v${m} or later). The script will not start until it is updated (Tampermonkey ▸ Check for updates).`,
                  modifiee: `${n} v${v} does not match the published code (modified or damaged copy). The script will not start: reinstall it from its official page.`,
                  inconnue: `${n} v${v} is not a published version. The script will not start: install it from its official page.`,
                  maj: 'Update', page: 'Official page', fermer: 'Close' },
            fr: { retiree: `${n} v${v} est retirée\u00a0: une version corrigée est publiée (v${m} ou plus récente). Le script ne démarre pas tant qu’il n’est pas mis à jour (Tampermonkey ▸ Rechercher des mises à jour).`,
                  modifiee: `${n} v${v} ne correspond pas au code publié (copie modifiée ou abîmée). Le script ne démarre pas\u00a0: réinstallez-le depuis sa page officielle.`,
                  inconnue: `${n} v${v} n’est pas une version publiée. Le script ne démarre pas\u00a0: installez-le depuis sa page officielle.`,
                  maj: 'Mettre à jour', page: 'Page officielle', fermer: 'Fermer' },
            de: { retiree: `${n} v${v} wurde zurückgezogen: eine korrigierte Version ist veröffentlicht (v${m} oder neuer). Das Skript startet erst nach dem Update (Tampermonkey ▸ Nach Updates suchen).`,
                  modifiee: `${n} v${v} entspricht nicht dem veröffentlichten Code (veränderte oder beschädigte Kopie). Das Skript startet nicht: von der offiziellen Seite neu installieren.`,
                  inconnue: `${n} v${v} ist keine veröffentlichte Version. Das Skript startet nicht: von der offiziellen Seite installieren.`,
                  maj: 'Aktualisieren', page: 'Offizielle Seite', fermer: 'Schließen' },
            es: { retiree: `${n} v${v} ha sido retirada: hay una versión corregida publicada (v${m} o posterior). El script no se inicia hasta que se actualice (Tampermonkey ▸ Buscar actualizaciones).`,
                  modifiee: `${n} v${v} no coincide con el código publicado (copia modificada o dañada). El script no se inicia: reinstálelo desde su página oficial.`,
                  inconnue: `${n} v${v} no es una versión publicada. El script no se inicia: instálelo desde su página oficial.`,
                  maj: 'Actualizar', page: 'Página oficial', fermer: 'Cerrar' },
            it: { retiree: `${n} v${v} è stata ritirata: è pubblicata una versione corretta (v${m} o successiva). Lo script non si avvia finché non viene aggiornato (Tampermonkey ▸ Cerca aggiornamenti).`,
                  modifiee: `${n} v${v} non corrisponde al codice pubblicato (copia modificata o danneggiata). Lo script non si avvia: reinstallalo dalla sua pagina ufficiale.`,
                  inconnue: `${n} v${v} non è una versione pubblicata. Lo script non si avvia: installalo dalla sua pagina ufficiale.`,
                  maj: 'Aggiorna', page: 'Pagina ufficiale', fermer: 'Chiudi' },
            'pt-BR': { retiree: `${n} v${v} foi retirada: há uma versão corrigida publicada (v${m} ou mais recente). O script não inicia até ser atualizado (Tampermonkey ▸ Verificar atualizações).`,
                  modifiee: `${n} v${v} não corresponde ao código publicado (cópia modificada ou danificada). O script não inicia: reinstale-o pela página oficial.`,
                  inconnue: `${n} v${v} não é uma versão publicada. O script não inicia: instale-o pela página oficial.`,
                  maj: 'Atualizar', page: 'Página oficial', fermer: 'Fechar' },
            'pt-PT': { retiree: `${n} v${v} foi retirada: há uma versão corrigida publicada (v${m} ou mais recente). O script não arranca enquanto não for atualizado (Tampermonkey ▸ Procurar atualizações).`,
                  modifiee: `${n} v${v} não corresponde ao código publicado (cópia modificada ou danificada). O script não arranca: reinstale-o a partir da página oficial.`,
                  inconnue: `${n} v${v} não é uma versão publicada. O script não arranca: instale-o a partir da página oficial.`,
                  maj: 'Atualizar', page: 'Página oficial', fermer: 'Fechar' },
            he: { retiree: `${n} v${v} הוסרה: פורסמה גרסה מתוקנת (v${m} ומעלה). הסקריפט לא יופעל עד שיעודכן (Tampermonkey ▸ חיפוש עדכונים).`,
                  modifiee: `${n} v${v} אינו תואם לקוד שפורסם (עותק ששונה או נפגם). הסקריפט לא יופעל: התקינו אותו מחדש מהדף הרשמי.`,
                  inconnue: `${n} v${v} אינה גרסה שפורסמה. הסקריפט לא יופעל: התקינו אותו מהדף הרשמי.`,
                  maj: 'עדכון', page: 'הדף הרשמי', fermer: 'סגירה' },
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
        const x = document.createElement('button'); x.type = 'button'; x.textContent = '×'; x.setAttribute('aria-label', L.fermer || 'Close');
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
        await poserCalqueContour();
        await poserCalque();
        await poserCalqueRpp();
        await poserCalqueDirect();
        for (const ev of ['wme-map-move-end', 'wme-map-zoom-changed'])
            try { sdk.Events.on({ eventName: ev, eventHandler: () => demanderDirect() }); } catch (e) { log('BAN de la vue (' + ev + ') : ' + e.message); }
        try {
            sdk.Events.on({ eventName: 'wme-map-move-end', eventHandler: majRpp });
            sdk.Events.on({ eventName: 'wme-save-finished', eventHandler: majRpp });
            // Un numéro qu'on vient d'enregistrer n'était pas dans la relecture d'avant : relire, pour le voir cerclé. Le serveur
            // peut répondre avant d'avoir pris l'ajout en compte, et la relecture est gardée jusqu'à l'enregistrement suivant :
            // relire tout de suite, puis encore après DIRECT_RELIRE_MS (Glenan56, 16/11).
            sdk.Events.on({ eventName: 'wme-save-finished', eventHandler: () => {
                hnDirect.clear(); demanderDirect(true);
                clearTimeout(relireDirect);
                relireDirect = setTimeout(() => { hnDirect.clear(); demanderDirect(true); }, DIRECT_RELIRE_MS);
            } });
            await sdk.Events.trackDataModelEvents({ dataModelName: 'venues' });
            for (const ev of ['wme-data-model-objects-added', 'wme-data-model-objects-changed', 'wme-data-model-objects-removed'])
                sdk.Events.on({ eventName: ev, eventHandler: e => { if (e && e.dataModelName === 'venues') { majRpp(); demanderDirect(); } } });
        } catch (e) { log('événements des RPP : ' + e.message); }
        majRpp();
        await poserCaseCalque();
        await brancherSurvol();
        construireFenetre();
        poserOnglet();
        poserFab();
        setInterval(poserFab, 2000);
        // Le quota se libère avec le temps (heure glissante) : pastille relue même sans geste.
        setInterval(() => { if (ovEl && ovEl.classList.contains('open')) majQuotaHdr(); }, 15000);
        setInterval(() => {
            if (!ovEl || !ovEl.classList.contains('open')) return;
            const p = document.querySelector('.save-popover-container');
            const vu = !!p && [...p.children].some(c => c.getBoundingClientRect().height > 0);
            ovEl.classList.toggle('wbc-sous', vu);
        }, 500);
        verifierMaj();
        // WBC démarre souvent avant que WME connaisse l'éditeur : pseudo et rang attendus une minute au plus.
        const attendreEditeur = async () => {
            for (let k = 0; k < 120; k++) { const p = await _hp(); if (p.n >= 0 && p.nom) return; await new Promise(r => setTimeout(r, 500)); }
        };
        const editeurConnu = attendreEditeur();
        editeurConnu.then(lireDroitChamp).then(v => { droitChamp = v; if (v) rendre(); });
        editeurConnu.then(lireDroits).then(() => {
            if (!droitGeste('hn1')) return;
            document.querySelectorAll('#wbc-sidebar [data-hn]').forEach(e => { e.hidden = false; });
            rendre();
            lancerRapprochement(false);
            try { sdk.Events.on({ eventName: 'wme-save-finished', eventHandler: r => { if (r && r.success) lancerRapprochement(true); } }); }
            catch (e) { log('événement d\'enregistrement : ' + e.message); }
        });
        try { sdk.Events.on({ eventName: 'wme-map-move-end', eventHandler: () => { if (calqueSuitLaVue) majCalque(); } }); }
        catch (e) { log('événement de déplacement : ' + e.message); }
        try { sdk.Events.on({ eventName: 'wme-selection-changed', eventHandler: () => { suivreSelection().catch(e => log('suivi de sélection : ' + e.message)); } }); }
        catch (e) { log('événement de sélection : ' + e.message); }
        // La relecture attend après l'enregistrement : WME met son modèle à jour avec la réponse du serveur.
        try { sdk.Events.on({ eventName: 'wme-save-finished', eventHandler: r => { if (r && r.success) setTimeout(() => { verifierRenommages().catch(e => log('renommage : ' + e.message)); }, 1500); } }); }
        catch (e) { log('événement d\'enregistrement (renommage) : ' + e.message); }
        try { sdk.Events.on({ eventName: 'wme-map-move-end', eventHandler: () => { releverSignatures(false).catch(e => log('renommage : ' + e.message)); } }); }
        catch (e) { log('événement de déplacement (renommage) : ' + e.message); }
        // « wme-data-model-objects-added » ne se déclenche qu'avec trackDataModelEvents.
        try {
            await sdk.Events.trackDataModelEvents({ dataModelName: 'segments' });
            sdk.Events.on({ eventName: 'wme-data-model-objects-added', eventHandler: e => {
                if (e && e.dataModelName === 'segments' && e.objectIds && e.objectIds.length) releverSignatures(e.objectIds).catch(x => log('renommage : ' + x.message));
                // BAN de la vue : au chargement, la 1re passe part avant les segments (« dont 0 déjà dans WME ») ; relire quand ils arrivent.
                if (e && e.dataModelName === 'segments' && e.objectIds && e.objectIds.length && pointsDirect.length) demanderDirect();
            } });
        } catch (e) { log('chargement des segments (renommage) : ' + e.message); }
        try {
            for (const ev of ['wme-data-model-objects-added', 'wme-data-model-objects-changed', 'wme-data-model-objects-removed'])
                sdk.Events.on({ eventName: ev, eventHandler: e => { if (e && e.dataModelName === 'segments') blocagesPerimes(); } });
            sdk.Events.on({ eventName: 'wme-save-finished', eventHandler: blocagesPerimes });
        } catch (e) { log('droits des segments : ' + e.message); }
        try {
            await sdk.Events.trackDataModelEvents({ dataModelName: 'segmentHouseNumbers' });
            sdk.Events.on({ eventName: 'wme-data-model-objects-added', eventHandler: e => {
                if (e && e.dataModelName === 'segmentHouseNumbers' && e.objectIds && e.objectIds.length) { hnAjout.n += e.objectIds.length; hnAjout.id = e.objectIds[e.objectIds.length - 1]; }
            } });
        } catch (e) { log('numéros ajoutés : ' + e.message); }
        log('v' + VERSION + ' prêt — langue ' + _lang);
    };

    const demarrer = () => { init().catch(e => log('démarrage : ' + e.message)); };
    // « wme-ready » n'arrive qu'à un zoom éditable (≥ 12) : démarrage dès le SDK prêt ; wme-initialized et wme-ready peuvent arriver tous deux.
    (() => {
        let lance = false;
        const go = () => { if (lance) return; lance = true; clearInterval(minuterie); Promise.resolve(pw.SDK_INITIALIZED).then(demarrer); };
        const pret = () => !!pw.SDK_INITIALIZED;
        const minuterie = setInterval(() => { if (pret()) go(); }, 300);
        if (pret()) go();
        document.addEventListener('wme-initialized', go, { once: true });
        document.addEventListener('wme-ready', go, { once: true });
    })();

})();
