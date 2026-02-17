# MemoryStream - Sprint 1

**MemoryStream** est une application web permettant de découvrir des histoires, souvenirs et anecdotes liés à des lieux réels via une carte interactive. Transformez les lieux du quotidien en archives vivantes de mémoire humaine, culturelle et émotionnelle.

## 📋 Périmètre Sprint 1

Ce Sprint 1 est un **MVP de consultation** (lecture seule) avec :
- ✅ Carte interactive avec Leaflet + OpenStreetMap
- ✅ Affichage de pins représentant des lieux avec histoires
- ✅ Consultation des histoires par lieu
- ✅ Géolocalisation de l'utilisateur
- ✅ Chargement dynamique des données selon la zone visible
- ✅ Animations GSAP (drawer)

**Non inclus dans Sprint 1** : création de compte, création d'histoires, upload d'images, administration, recherche textuelle.

## 🛠️ Stack Technique

### Backend
- **Node.js** + **Express** - API REST
- **SQLite** - Base de données locale
- **express-rate-limit** - Rate limiting (60 req/min)
- **uuid** - Génération d'identifiants uniques

### Frontend
- **React** + **Vite** - Interface utilisateur moderne
- **Leaflet** + **react-leaflet** - Carte interactive
- **OpenStreetMap** - Tuiles de carte
- **GSAP** - Animations fluides
- **Axios** - Requêtes HTTP

## 📁 Structure du Projet

```
MemoryStream/
├── backend/
│   ├── routes/
│   │   ├── places.js          # Routes pour les lieux
│   │   └── stories.js         # Routes pour les histoires
│   ├── middleware/
│   │   └── validation.js      # Validation bbox
│   ├── database.js            # Configuration SQLite + seeds
│   ├── server.js              # Serveur Express principal
│   ├── package.json
│   ├── .env
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Map.jsx        # Carte Leaflet
│   │   │   ├── Drawer.jsx     # Panneau latéral
│   │   │   ├── StoryList.jsx  # Liste des histoires
│   │   │   └── StoryDetail.jsx # Détail d'une histoire
│   │   ├── hooks/
│   │   │   ├── useGeolocation.js
│   │   │   └── useDebounce.js
│   │   ├── services/
│   │   │   └── api.js         # Client API
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js         # Config Vite + proxy
│   ├── package.json
│   └── index.html
│
└── README.md
```

## 🚀 Installation et Démarrage

### Prérequis
- **Node.js** (v18 ou supérieur)
- **npm** (ou yarn/pnpm)

### 1. Installation Backend

```bash
cd backend
npm install
```

### 2. Installation Frontend

```bash
cd frontend
npm install
```

### 3. Démarrage de l'Application

**Terminal 1 - Backend (port 4000):**
```bash
cd backend
npm start
```

Le backend démarre sur `http://localhost:4000` et génère automatiquement les données de démonstration si la base est vide (10 lieux + 28 histoires autour de Lille).

**Terminal 2 - Frontend (port 3000):**
```bash
cd frontend
npm run dev
```

Le frontend démarre sur `http://localhost:3000` et utilise un proxy Vite pour éviter les problèmes CORS.

### 4. Accès à l'Application

Ouvrez votre navigateur et accédez à : **http://localhost:3000**

## 🌐 API Endpoints

### GET /api/places
Récupère les lieux dans une bounding box avec le nombre d'histoires.

**Paramètres** (query) :
- `minLat` : Latitude minimale (entre -90 et 90)
- `minLng` : Longitude minimale (entre -180 et 180)
- `maxLat` : Latitude maximale (entre -90 et 90)
- `maxLng` : Longitude maximale (entre -180 et 180)

**Réponse** :
```json
[
  {
    "id": "uuid",
    "name": "Grand Place",
    "lat": 50.6367,
    "lng": 3.0633,
    "storyCount": 3
  }
]
```

### GET /api/places/:placeId/stories
Récupère la liste des histoires pour un lieu spécifique.

**Réponse** :
```json
[
  {
    "id": "uuid",
    "title": "Le premier marché de Noël",
    "createdAt": "2023-12-15T10:30:00.000Z"
  }
]
```

### GET /api/stories/:storyId
Récupère le contenu complet d'une histoire.

**Réponse** :
```json
{
  "id": "uuid",
  "title": "Le premier marché de Noël",
  "content": "En décembre 2015, j'ai découvert...",
  "createdAt": "2023-12-15T10:30:00.000Z",
  "placeId": "uuid"
}
```

### GET /health
Health check du serveur.

## 🔒 Sécurité

- ✅ **Validation stricte** : Les paramètres de bounding box sont validés (lat ∈ [-90, 90], lng ∈ [-180, 180], min < max)
- ✅ **Requêtes préparées** : Toutes les requêtes SQL utilisent des prepared statements pour éviter les injections
- ✅ **Rate limiting** : 60 requêtes par minute par IP
- ✅ **Gestion d'erreurs** : Messages clairs sans stacktrace côté client
- ✅ **CORS** : Géré via proxy Vite en développement
- ✅ **Variables d'environnement** : `.env` non commité, `.env.example` fourni

## 🎨 Fonctionnalités Clés

### Carte Interactive
- Centrée par défaut sur **Lille** (50.6292° N, 3.0573° E)
- Zoom et déplacement libres
- Pins colorés pour chaque lieu
- Chargement dynamique avec **debouncing 400ms**

### Consultation des Histoires
- Clic sur un pin → ouverture du drawer avec liste des histoires
- Clic sur une histoire → affichage du contenu complet
- Navigation fluide entre liste et détail

### Géolocalisation
- Bouton "📍 Me localiser"
- Demande de permission navigateur
- Centrage automatique de la carte sur la position utilisateur
- Toast non-bloquant en cas de refus
- **L'app fonctionne normalement sans géolocalisation**

### Animations
- Animation GSAP smooth du drawer (slide in/out)
- Transitions fluides entre les vues
- Design responsive mobile-friendly

## 📊 Données de Démonstration

Au premier démarrage, le backend génère automatiquement :
- **10 lieux** autour de Lille (Grand Place, Vieux-Lille, Citadelle, etc.)
- **28 histoires** réalistes et authentiques
- Les données persistent entre les redémarrages

## 📱 Responsive Design

L'interface s'adapte automatiquement aux différentes tailles d'écran :
- Desktop : drawer latéral de 450px
- Mobile : drawer plein écran
- Boutons et typography adaptés

## 🧪 Tests Manuels

### Backend
```bash
# Test endpoint places
curl "http://localhost:4000/api/places?minLat=50.6&minLng=3.0&maxLat=50.7&maxLng=3.1"

# Test validation bbox (doit retourner 400)
curl "http://localhost:4000/api/places?minLat=100&minLng=3.0&maxLat=50.7&maxLng=3.1"

# Test health
curl "http://localhost:4000/health"
```

### Frontend (Navigateur)
1. ✅ La carte s'affiche centrée sur Lille
2. ✅ Les pins apparaissent sur la carte
3. ✅ Zoom/déplacement fonctionne
4. ✅ Les pins se mettent à jour lors du déplacement
5. ✅ Clic sur pin → drawer s'ouvre avec liste d'histoires
6. ✅ Clic sur histoire → contenu complet affiché
7. ✅ Bouton "Me localiser" → demande permission
8. ✅ Permission accordée → carte se centre
9. ✅ Permission refusée → toast + app continue
10. ✅ Responsive sur mobile

## 📝 Notes Techniques

### Proxy Vite
Le frontend utilise un proxy Vite pour éviter les problèmes CORS :
- Requêtes frontend : `/api/*`
- Proxy automatique vers : `http://localhost:4000/api/*`

### Seed Data
Les données de démonstration sont générées **uniquement si la base SQLite est vide**. Pour réinitialiser :
```bash
cd backend
rm memorystream.db
npm start
```

## 🎯 Critères d'Acceptation Sprint 1

- ✅ Carte affichée et navigable
- ✅ Pins chargés et mis à jour dynamiquement
- ✅ Clic pin affiche liste histoires
- ✅ Clic histoire affiche contenu
- ✅ Bouton géolocalisation fonctionne
- ✅ Refus GPS n'empêche pas utilisation
- ✅ API valide bbox + rate limiting actif
- ✅ UI responsive mobile

## 📄 Licence

MIT

---

**Développé pour le projet Master - Sprint 1 MemoryStream**
