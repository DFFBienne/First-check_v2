# ⚡ Protocole Premières Vérifications — SBB CFF FFS

Application web mobile (PWA-ready) pour remplir et générer le protocole de **premières vérifications par l'installateur électricien** selon les normes SBB CFF FFS.

> Fonctionne **100% hors ligne** — aucun serveur requis. Ouvrir le fichier HTML directement dans un navigateur mobile (Android / iOS) ou desktop.

---

## 📋 Fonctionnalités

### Formulaire mobile
- Interface optimisée **smartphone** (Android & iOS)
- Saisie de tous les champs du protocole officiel SBB :
  - Identification de l'installation (nom, adresse, N° tableau, objet, compteur, C/C)
  - Paramètres de mesure (tension, instrument, N° inventaire, facteur Icc)
  - **Circuits / Groupes** : jusqu'à 18 circuits avec tous les champs de mesure
  - Vérifications visuelles (8 points OK/NOK avec toggles)
  - Remarques générales
  - Identification de l'installateur avec **signature tactile**

### Circuits — champs disponibles
| Champ | Type |
|-------|------|
| N° groupe | Texte libre |
| Désignation | Texte libre |
| Type câble | Texte libre |
| Nbre × section | Texte libre |
| Type courbe | Libre + suggestions : B, C, D, K, Z |
| I nom (A) | Libre + suggestions : 2A à 125A |
| Icc max/min L-PE / L-N | Numérique |
| R iso. (Mohm) | Numérique |
| Contin. PE Rlo (ohm) | Numérique |
| DDR : I nom, I delta (mA), Temps (ms) | Numérique / libre |
| Champ tournant | OK / NOK / N/A |
| Chute tension % | Numérique |

### Sauvegarde automatique
- Sauvegarde automatique dans le **localStorage** du navigateur après chaque modification
- Restauration automatique des données à la réouverture
- Indicateur d'état (sauvegardé / non sauvegardé)

### Export / Import
- **Export JSON** : télécharge toutes les données saisies dans un fichier `.json` nommé automatiquement
- **Import JSON** : charge un fichier précédemment exporté et restaure intégralement le formulaire
- La signature et la langue sélectionnée sont incluses dans l'export

### Signature tactile
- Zone de signature dessinable au **doigt** sur écran tactile ou à la souris
- Aperçu de la signature dans le formulaire
- Intégrée dans le PDF généré

### Génération PDF
- PDF **A4 paysage** fidèle au formulaire officiel SBB CFF FFS
- Logo SBB intégré dans l'en-tête
- Tableau principal avec en-têtes groupés et séparateurs
- Zone vérifications visuelles (OK en vert / NOK en rouge)
- Zone paramètres de mesure et remarques
- Zone installateur avec signature dessinée
- Date au format **JJ.MM.AAAA**
- Génération 100% côté navigateur via **pdf-lib** (fonctionne sur Android)

### Multilingue
Sélecteur de langue intégré dans l'en-tête :
- 🇫🇷 **Français**
- 🇩🇪 **Deutsch**
- 🇮🇹 **Italiano**

La langue sélectionnée s'applique à l'interface **et** au PDF généré.

---

## 🚀 Utilisation

### Sur Android / iOS
1. Télécharger le fichier `protocole_verification_SBB.html`
2. Le transférer sur le téléphone (email, Google Drive, WhatsApp…)
3. Ouvrir avec **Chrome** ou **Safari**
4. Remplir le formulaire
5. Appuyer sur **Générer PDF** → le PDF se télécharge automatiquement

### Sur desktop (Windows / Mac / Linux)
1. Ouvrir `protocole_verification_SBB.html` dans n'importe quel navigateur moderne
2. Remplir le formulaire
3. Cliquer sur **Générer PDF**

> ⚠️ Aucune installation, aucun serveur, aucune connexion internet requise.

---

## 📁 Structure du projet

```
protocole_verification_SBB.html   ← Application complète (fichier unique)
README.md                          ← Ce fichier
```

L'application est un **fichier HTML autonome** qui embarque :
- Tout le CSS (interface mobile)
- Tout le JavaScript (logique, sauvegarde, PDF)
- La librairie **pdf-lib** (chargée via CDN unpkg.com)
- Le logo SBB CFF FFS encodé en **base64**

---

## 🛠️ Technologies

| Technologie | Usage |
|-------------|-------|
| HTML5 / CSS3 | Interface mobile responsive |
| JavaScript ES2020 | Logique applicative |
| [pdf-lib v1.17.1](https://pdf-lib.js.org/) | Génération PDF côté navigateur |
| localStorage | Sauvegarde persistante |
| Canvas API | Pad de signature tactile |
| DataList HTML5 | Suggestions sur champs libres |

---

## 📐 Structure du PDF généré

```
┌─────────────────────────────────────────────────────────┐
│  HEADER  [Titre + Nom installation]        [Logo] [Page] │
├─────────────────────────────────────────────────────────┤
│  BANDEAU INFO  [Objet] [Tableau] [Compteur] [C/C gen/abo]│
├──────┬──────────────────────────────────────────────────┤
│  En-têtes groupés : Groupe | Cana. | Coupe | Mesures | DDR
├──────┼──────┬──────┬───────┬───────┬────┬────┬──────────┤
│  N°  │ Desig│ Type │ ...   │  Icc  │Riso│Rlo │ DDR │... │
├──────┼──────┼──────┼───────┼───────┼────┼────┼──────────┤
│  1   │      │      │       │       │    │    │     │    │
│  ... │      │      │       │       │    │    │     │    │
│  18  │      │      │       │       │    │    │     │    │
├──────────────┬──────────────────────┬───────────────────┤
│ Vérifications│ Paramètres & Remarques│ Installateur + Sig│
│  visuelles   │                      │                   │
└──────────────┴──────────────────────┴───────────────────┘
```

---

## ⚙️ Limites

- Maximum **18 circuits** par protocole (correspond aux lignes du tableau A4)
- La signature est exportée en PNG embarqué dans le PDF
- Les caractères spéciaux (Ω, Σ…) ne sont pas supportés par Helvetica standard dans pdf-lib — remplacés par `Mohm` / `ohm`
- Nécessite une connexion internet **uniquement** pour le premier chargement de pdf-lib (CDN) — peut être rendu 100% offline en téléchargeant et embarquant pdf-lib localement

---

## 🔒 Confidentialité

- Aucune donnée n'est transmise à un serveur
- Toutes les données restent dans le navigateur (localStorage)
- Le PDF est généré localement sur l'appareil

---

## 📄 Licence

Usage interne SBB CFF FFS — document de travail pour les installateurs électriciens.

---

*Développé pour une utilisation terrain sur smartphone Android.*
