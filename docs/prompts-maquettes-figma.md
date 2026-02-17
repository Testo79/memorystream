# Prompts maquettes Figma — MemoryStream (reverse‑engineered)

Prompts pour reproduire fidèlement l’interface du projet dans Figma. Basés sur les composants et styles réels (Map, Drawer, StoryList, CreatePlaceForm, CreateStoryForm, StoryDetail).

---

## Style global à réutiliser

- **Police :** Inter (ou Segoe UI / sans-serif propre).
- **Couleurs principales :** Bleu principal `#4a90e2` / `#357abd`, violet gradient header `#667eea` → `#764ba2`, bouton géoloc idem. Bouton annuler gris `#f5f5f5`, texte `#333`. Erreurs `#fee` fond, `#c33` texte.
- **Cartes / panneaux :** Coins 12px, bordures `#e2e8f0` ou `#e5e7eb`, fonds dégradés légers (ex. `#f8fafc` → `#f1f5f9`).
- **Boutons principaux :** border-radius 8px ou 50px pour les boutons flottants, font-weight 600.

---

## 1. Écran principal — Carte plein écran

**Prompt :**

```
Maquette Figma, application web MemoryStream, écran unique plein écran (100vh). Carte type OpenStreetMap en fond, occupant tout l’espace. Aucun en-tête global, pas de barre de navigation.

En haut à gauche : bouton arrondi (pill, border-radius 50px), dégradé bleu #4a90e2 → #357abd, texte blanc « + Créer un lieu », police 1rem font-weight 600, padding 12px 24px, ombre légère.

En haut à droite : bouton arrondi (pill), dégradé violet #667eea → #764ba2, texte blanc « 📍 Me localiser », même style.

Sur la carte : plusieurs marqueurs (pins) rouges pour les lieux ; optionnel un marqueur bleu pour « Votre position ». Popup type Leaflet : titre du lieu en gras, en dessous « X histoires » en gris.

Fond typo Inter, couleurs sobres. Desktop 1440×900 ou 1920×1080.
```

---

## 2. Carte + drawer ouvert — Liste des histoires

**Prompt :**

```
Maquette Figma MemoryStream. Gauche : même carte plein écran (réduite visuellement). Droite : panneau fixe (drawer) largeur 450px, fond blanc, ombre portée gauche -4px 0 20px rgba(0,0,0,0.15).

En-tête du drawer : bandeau dégradé violet #667eea → #764ba2, texte blanc. À gauche titre h2 « Tour Eiffel » (ou nom du lieu), 1.5rem font-weight 700. À droite bouton rond blanc semi-transparent (36×36px) avec « ✕ » pour fermer.

Zone contenu (drawer-content) fond blanc, padding 24px. En haut une ligne : à gauche texte gris « 3 histoires à découvrir », à droite bouton bleu #4a90e2 « + Ajouter une histoire », border-radius 8px, 10px 20px.

En dessous : 3 cartes (story-card) empilées verticalement, gap 1rem. Chaque carte : fond dégradé #f8fafc → #f1f5f9, bordure #e2e8f0, border-radius 12px, padding 1.25rem. Titre histoire (h3) 1.125rem font-weight 600 couleur #1e293b. Date en dessous 0.875rem #64748b. En bas à droite lien « Lire l’histoire → » 0.875rem font-weight 600 couleur #667eea.

Scroll possible dans le contenu. Style Inter, cohérent avec le projet.
```

---

## 3. Drawer — Vue détail d’une histoire

**Prompt :**

```
Maquette Figma MemoryStream. Même drawer à droite (450px, fond blanc, ombre). En-tête violet dégradé #667eea → #764ba2 avec titre de l’histoire (ex. « Un moment inoubliable ») en blanc et bouton fermer ✕.

Contenu : bouton « ← Retour aux histoires », style outline (bordure #e5e7eb, texte #667eea, padding 10px 20px, border-radius 8px, font-weight 600).

En dessous bloc (story-detail-content) fond blanc/dégradé léger, border 1px #e2e8f0, border-radius 12px, padding 1.5rem. Meta : date en italique 0.875rem #64748b, bordure bas #e5e7eb. Corps : paragraphe 1rem #334155, line-height 1.8, pas d’image.

Style sobre, Inter, cohérent avec la liste d’histoires.
```

---

## 4. Modal — Formulaire « Créer un lieu »

**Prompt :**

```
Maquette Figma MemoryStream. Overlay fond semi-transparent rgba(0,0,0,0.3) plein écran. Au centre : carte (modal) blanche max-width 400px, border-radius 12px, box-shadow 0 4px 12px rgba(0,0,0,0.1), padding 20px.

Titre h3 « Créer un nouveau lieu », 1.2rem #333. Ligne sous le titre : « 📍 48.858370, 2.294481 » (exemple coordonnées), 0.85rem #666.

Formulaire : label « Nom du lieu * » en 0.9rem font-weight 600 #555. Input texte pleine largeur, padding 12px, bordure 2px #e0e0e0, border-radius 8px, placeholder « Ex: Place de la République ». Au focus bordure #4a90e2.

En bas deux boutons alignés à droite, gap 12px : « Annuler » fond #f5f5f5 #333 ; « Créer le lieu » fond #4a90e2 blanc, border-radius 8px, padding 12px 24px font-weight 600.

Police Inter, style épuré.
```

---

## 5. Drawer — Formulaire « Ajouter une histoire »

**Prompt :**

```
Maquette Figma MemoryStream. À l’intérieur du même drawer droit (fond blanc, padding 24px), pas de bandeau violet pour cette vue. Titre h3 « Ajouter une histoire à [Nom du lieu] », 1.2rem #333, marge bas 20px.

Deux champs. Label « Titre * » puis input (bordure #e0e0e0, focus #4a90e2), placeholder « Ex: Mon premier jour ici ». Label « Histoire * » puis textarea 6 lignes, min-height 120px, même style, placeholder « Racontez votre histoire… ».

Boutons en bas à droite : « Annuler » #f5f5f5, « Créer l’histoire » #4a90e2 blanc. Optionnel bloc erreur fond #fee texte #c33. Style identique au formulaire « Créer un lieu », police Inter.
```

---

## 6. État vide — Aucune histoire

**Prompt :**

```
Maquette Figma MemoryStream. Drawer ouvert avec en-tête violet (nom du lieu). Dans le contenu : texte centré « Aucune histoire disponible pour ce lieu. » en gris #9ca3af, 1rem. En dessous bouton « + Ajouter la première histoire » bleu #4a90e2, style identique à « + Ajouter une histoire ». Padding zone vide 40px 20px.
```

---

## 7. Bouton mode création activé + toast

**Prompt :**

```
Maquette Figma MemoryStream. Même carte en fond. Bouton en haut à gauche : état actif « ✕ Annuler », dégradé rouge #ef4444 → #dc2626 (au lieu du bleu), même forme pill et ombre. En bas au centre : toast notification fond #10b981 (succès) ou #3b82f6 (info), texte blanc, padding 12px 24px, border-radius 8px, ex. « ✅ Lieu créé avec succès ! ».
```

---

## 8. Responsive mobile (optionnel)

**Prompt :**

```
Maquette Figma MemoryStream, format mobile 375×812. Carte en fond. Boutons « + Créer un lieu » et « 📍 Me localiser » plus petits (10px 20px, 0.9rem), position top 10px. Drawer en overlay pleine largeur (100 %) au lieu de 450px, même en-tête violet et même contenu (liste d’histoires ou détail). Style identique, touch-friendly.
```

---

*Ces prompts décrivent l’interface réelle du projet (composants React et CSS) pour des maquettes Figma fidèles.*
