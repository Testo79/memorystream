# 3. Architecture Technique (1–2 pages)

**Objectif :** Présenter les choix techniques de façon pragmatique (pas d’architecture « émergente » sur 3 semaines).

---

## Stack technique

| Couche | Technologies |
|--------|--------------|
| **Frontend** | React 18, Vite 5, Leaflet / react-leaflet, GSAP, Axios |
| **Backend** | Node.js, Express 4 |
| **Base de données** | SQLite3 (fichier `memorystream.db`) |
| **Outils** | UUID (génération d’identifiants), dotenv (variables d’environnement), CORS, express-rate-limit |

**Bibliothèques principales :**
- **Frontend :** React (UI), Vite (build et dev), Leaflet/react-leaflet (carte interactive), GSAP (animations), Axios (appels API).
- **Backend :** Express (API REST), sqlite3 (accès BDD), uuid, cors, express-rate-limit (sécurité), dotenv.

---

## Justification des choix

- **React + Vite :** Écosystème connu, temps de build court, bon pour un sprint court ; compétences équipe supposées sur React.
- **Node.js + Express :** Même langage (JavaScript) côté front et back, API REST simple à mettre en place, déploiement et hébergement faciles.
- **SQLite :** Pas de serveur BDD à installer, fichier unique, suffisant pour le volume de données (lieux et histoires) et pour une démo / MVP.
- **Leaflet :** Cartographie gratuite, OpenStreetMap, adaptée à l’affichage de lieux et marqueurs.
- **Rate limiting + CORS :** Limitation des abus et contrôle des origines autorisées pour l’API.

---

## Architecture globale

Un seul schéma suffit : **Client → API REST → Base de données**.

```
┌─────────────────────────────────────────────────────────────────┐
│  CLIENT (navigateur)                                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  React + Vite  │  Leaflet (carte)  │  Axios  │  GSAP       │  │
│  │  Port 3000     │  /api → proxy → Backend                    │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP (JSON)  /api/places, /api/stories
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  BACKEND (Node.js)                                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Express  │  CORS  │  rate-limit  │  routes places/stories  │  │
│  │  Port 4000                                                   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    │ sqlite3
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  BASE DE DONNÉES                                                 │
│  SQLite (fichier memorystream.db)                                │
│  Tables : places, stories                                        │
└─────────────────────────────────────────────────────────────────┘
```

En résumé : **Client React (Vite) → API Express → SQLite**. Le front fait un proxy vers le backend (Vite `proxy` vers `localhost:4000`).

---

## Modèle de données (schéma BDD simplifié)

**MCD / MLD basique :**

- **places** (lieux sur la carte)  
  - `id` (TEXT, PK), `name` (TEXT), `lat` (REAL), `lng` (REAL).

- **stories** (histoires liées à un lieu)  
  - `id` (TEXT, PK), `placeId` (TEXT, FK → places.id, ON DELETE CASCADE), `title` (TEXT), `content` (TEXT), `createdAt` (TEXT ISO).

Relation : **1 lieu → N histoires** (une story appartient à un seul lieu).

```
┌──────────────────┐         ┌──────────────────┐
│     places       │         │     stories      │
├──────────────────┤         ├──────────────────┤
│ id (PK)          │───┐     │ id (PK)          │
│ name             │   │     │ placeId (FK)     │◄──┘
│ lat              │   └────►│ title            │
│ lng              │         │ content          │
└──────────────────┘         │ createdAt        │
                              └──────────────────┘
```

---

## UI / UX

- **Carte :** Carte Leaflet en plein écran avec marqueurs pour les lieux ; clic sur un lieu ouvre un panneau (drawer).
- **Panneau latéral (drawer) :** Liste des histoires du lieu sélectionné ; clic sur une histoire affiche son contenu (titre + texte).
- **Formulaires :** Création de lieu (nom + position sur la carte) et création d’histoire (titre + contenu) pour un lieu.
- **Animations :** GSAP pour les transitions du drawer et améliorer la fluidité de l’interface.

Quelques maquettes Figma ou wireframes peuvent être ajoutées ici pour illustrer les écrans (carte, drawer, formulaires) sans surcharger le document.

---

*Document généré à partir du projet MemoryStream — Sprint 1.*
