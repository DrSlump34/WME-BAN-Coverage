# WME BAN Coverage (WBC)

Userscript pour le Waze Map Editor (WME). Pour une **commune** ou un **département entier**, WBC compare la
**Base Adresse Nationale (BAN)** aux numéros de WME, posés sur les segments (HN) ou en lieux résidentiels (RPP),
et rend les chiffres, les statistiques et un **état des lieux voie par voie** : ce qui manque, ce qui est en trop,
ce qui est mal écrit et les voies dont le nom ne correspond pas.

- **Installer** : [GreasyFork](https://greasyfork.org/scripts/600088) (Tampermonkey le met ensuite à jour seul).
- **Questions et retours** : [Discuss](https://www.waze.com/discuss/t/415956) ou la
  [page de retours de GreasyFork](https://greasyfork.org/scripts/600088-wme-ban-coverage/feedback).
- **Licence** : MIT ([LICENSE](LICENSE)).

## Sources

| Source | Producteur | Licence |
|---|---|---|
| Base Adresse Nationale — `plateforme.adresse.data.gouv.fr` | État français (adresse.data.gouv.fr) | Licence Ouverte Etalab 2.0 |
| API Découpage administratif — `geo.api.gouv.fr` | État français (INSEE, IGN) | Licence Ouverte Etalab 2.0 |
| BAN de la vue — `data.geopf.fr` (Géoplateforme de l'IGN) | IGN | Licence Ouverte Etalab 2.0 |
| Signalements BAN — API publique de `signalement.adresse.data.gouv.fr` | État français | données publiques du service |

La BAN est accréditée par Waze pour la France depuis le 12/11/2026 (affichage et création assistée des numéros de
rue). La date de révision de la base adresse de la commune est affichée sous son nom quand la commune la publie.

## Ce qui part du navigateur

| Vers | Ce qui part |
|---|---|
| `geo.api.gouv.fr` | le centre de la carte arrondi à 3 décimales (≈ 100 m), en mode « Centre de la carte » ; vos recherches de commune |
| `plateforme.adresse.data.gouv.fr`, API des signalements | le code INSEE de la commune |
| `data.geopf.fr` | l'emprise de la vue, arrondie, quand la BAN de la vue est affichée (zoom ≥ 18) |
| `raw.githubusercontent.com`, `update.greasyfork.org` | rien : lecture de la version minimale et de la dernière version, une fois par jour au plus |
| `www.waze.com` (WME et Discuss, même site) | votre session, à Waze seulement |

Toutes les requêtes vers des sites tiers partent **sans cookie ni identité**. Votre pseudo n'est jamais envoyé à un
tiers. « Signaler à la BAN » n'envoie rien : il ouvre l'outil officiel, c'est vous qui remplissez et envoyez.

## Ce qui reste dans le navigateur

Les balayages gardés (IndexedDB, effaçables depuis l'onglet Scripts), les préférences et la place de la fenêtre
(localStorage), et le compteur du quota (localStorage et stockage de Tampermonkey). Rien de cela ne quitte le poste.

## Écrire sur la carte — jamais d'enregistrement

WBC **propose** des écritures ; il n'enregistre jamais. Chaque geste arrive dans WME comme une modification en
attente : vous la relisez, puis vous enregistrez ou annulez.

- **Tous rangs** : « + » (poser un numéro ou un RPP), « ⇄ » (numéro ↔ RPP), « ↻ » (réécrire un numéro mal écrit
  ou mal placé). Sur un segment verrouillé au-dessus de votre rang, la pose part en suggestion.
- **L6** : « Ajouter les numéros » et « Corriger les numéros » d'une voie entière.
- **Quota** : 500 éditions par heure glissante, par éditeur (« ↻ » hors quota).
- Un rappel de responsabilité s'affiche à la première écriture.

## Contrôle d'intégrité

Une version retirée, ou une copie modifiée du script, ne démarre pas : un contrôle compare l'empreinte du code à
celles des versions publiées, pour protéger la carte sur laquelle le script écrit.

## Navigateurs

Le script s'installe avec Tampermonkey. La fenêtre détachable (⧉, pour un second écran) n'existe que sous Chrome et
Edge ; les raccourcis de WME n'y fonctionnent pas.

---

## English

**WME BAN Coverage** compares the French national address base (BAN) with the house numbers and residential places
of WME, for a municipality or a whole département: figures, statistics and a street-by-street inventory.
Install it from [GreasyFork](https://greasyfork.org/scripts/600088); questions on
[Discuss](https://www.waze.com/discuss/t/415956).

- Data sources: BAN, geo.api.gouv.fr and IGN Géoplateforme (Licence Ouverte Etalab 2.0). The BAN is accredited by
  Waze for France since 12 November 2026.
- Requests to third-party sites carry no cookie and no identity; your username is never sent to a third party.
- The script suggests edits but never saves: every edit is a pending change you review, then save or undo in WME.
  Single edits (« + », « ⇄ », « ↻ ») are open to all ranks; whole-street edits are L6 only; at most 500 edits per
  rolling hour per editor.
- A withdrawn version, or a modified copy, does not start: an integrity check compares the code's fingerprint with
  those of the published versions.
- MIT licence.
