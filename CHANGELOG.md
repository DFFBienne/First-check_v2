# Changelog — Protocole Premières Vérifications SBB CFF FFS

---

## V1.0.9 — 2026-04-20

### Corrigé
- **Checkbox "Signé"** : lors de l'import d'un fichier JSON, les cases signature des circuits importés sont désormais **décochées par défaut**. L'installateur doit cocher explicitement pour apposer sa signature sur le terrain.

---

## V1.0.8 — 2026-04-20

### Corrigé
- **PDF — Colonne Collaborateur** : le nom, le prénom et la signature n'apparaissaient plus dans le PDF généré. Cause : `pdf-generator.js` contenait un bloc `SIGNATURE PAD` dupliqué qui réinitialisait `sigData = null` à chaque génération, écrasant la signature globale. Bloc supprimé.
- **PDF — En-tête colonne Collaborateur** : suppression du sous-titre "Nom / Prénom" dans la ligne d'en-tête de la colonne — la colonne Collaborateur n'affiche plus de label secondaire.

---

## V1.0.7 — 2026-04-20

### Ajouté
- **Checkbox "Signé" par circuit** : chaque circuit dispose d'une case à cocher verte *"Signé (reprendre nom & signature)"* en bas de sa fiche.
  - ☑ **Cochée** : au moment de la génération PDF ou de l'export JSON, la colonne Collaborateur reprend le nom/prénom et la signature dessinée en bas du formulaire.
  - ☐ **Non cochée** : la colonne Collaborateur utilise les données `collab_nom`/`collab_sig` stockées dans le JSON importé (ou reste vide si le circuit n'a jamais été signé).
- **Export JSON** : les champs `collab_nom` et `collab_sig` sont désormais inclus par circuit dans le fichier exporté.
- **Import JSON** : les données de signature par circuit sont restaurées depuis le fichier ; la checkbox reste décochée par défaut.
- **i18n** : libellé `lblSigned` ajouté en FR / DE / IT.

### Corrigé
- Ordre de restauration à l'import : `sigData` (signature globale) est maintenant restauré **avant** la création des circuits, garantissant que les circuits sans signature propre héritent correctement du global si nécessaire.

---

## V1.0.6 — 2026-04-20

### Corrigé
- **PDF — Case blanche colonne Collaborateur** : la boucle de rendu du rowB (en-têtes de colonnes) s'arrêtait à la colonne 17 — la colonne 18 (Collaborateur) n'était pas peinte en bleu. Boucle étendue à 19.
- **PDF — Signature dans colonne Collaborateur** : remplacement de la ligne de signature par l'image PNG de la signature dessinée, identique à la zone Installateur en bas de page.
- **PDF — `buildPDFBlob` non défini** : `await doc.embedPng()` dans un `.forEach()` provoquait une erreur silencieuse. La boucle `circuits.forEach` a été convertie en `for` classique pour supporter `await`.

---

## V1.0.5 — 2026-04-20

### Ajouté
- **Colonne Collaborateur** dans le tableau PDF : ajout d'une 19e colonne après "Rem.", affichant le nom/prénom de l'installateur et sa signature pour chaque circuit renseigné.
- **Colonne Remarque restaurée** : la colonne Rem. (col 17) conservée après l'ajout du Collaborateur (col 18).
- **PDF — Séparateurs** : ligne blanche de séparation de groupe ajoutée à gauche et à droite de la colonne Rem.

### Corrigé
- **`buildPDFBlob` non défini** : la fonction était définie dans la version standalone mais absente du repo multi-fichiers. `pdf-generator.js` remanié pour n'exposer que `buildPDFBlob()` retournant `{blob, filename}`, conformément au contrat attendu par `app.js`.
- Suppression du code dupliqué (signature pad, `generatePDF`) présent en doublon dans `pdf-generator.js`.

---

## V1.0.4 — antérieur

### Base fonctionnelle
- Formulaire mobile PWA (Android / iOS / Desktop), fonctionnement 100% hors ligne.
- Identification de l'installation : nom, adresse, N° tableau, objet, compteur, C/C général et abonné.
- Paramètres de mesure : tension réseau, instrument, N° inventaire, facteur Icc.
- Jusqu'à **18 circuits / groupes** avec tous les champs : canalisation, coupe-surintensité, mesures Icc, R iso., Rlo, DDR, champ tournant, chute tension, remarque par circuit.
- **8 vérifications visuelles** avec toggles OK/NOK.
- Remarques générales.
- Section Installateur électricien : nom/prénom, lieu, date, **signature tactile**.
- Sauvegarde automatique dans `localStorage` avec indicateur d'état.
- Export JSON (nommé automatiquement) et Import JSON (remplacement total ou fusion des circuits).
- Génération PDF A4 paysage via `pdf-lib` : en-tête avec logo SBB, bandeau info, tableau avec en-têtes groupés colorés, zone basse (vérifications visuelles, paramètres, installateur + signature), date au format JJ.MM.AAAA.
- Interface multilingue : 🇫🇷 Français / 🇩🇪 Deutsch / 🇮🇹 Italiano.
- Service Worker avec notification de mise à jour (bandeau "Mettre à jour").
- Web Share API pour partager le PDF ou le JSON via les applications natives (WhatsApp, Drive, etc.).
- Aide-mémoire types de câbles (modal).
- Suggestions sur les champs Type courbe, I nom, I delta.
