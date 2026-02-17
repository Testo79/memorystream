# Déploiement / exécution — MemoryStream

Ce guide permet de **voir le projet tourner** soit en local, soit en ligne via un hébergeur.

---

## Option A — Voir l’app en local (recommandé pour un aperçu rapide)

### 1) Lancer le backend (API)

Dans un terminal :

```bash
cd c:\Users\testo\Desktop\memorystream\backend
npm install
npm run dev
```

Le backend démarre sur `http://localhost:4000` (endpoint `GET /health`).

### 2) Lancer le frontend (Vite)

Dans un **2ᵉ terminal** :

```bash
cd c:\Users\testo\Desktop\memorystream\frontend
npm install
npm run dev
```

Ouvre ensuite `http://localhost:3000`.  
En dev, le frontend appelle l’API via le **proxy Vite** (`/api` → `localhost:4000`).

---

## Option B — Mode “production” en local (1 seule URL)

Cette option simule un déploiement classique : **le backend sert le build du frontend**.

### 1) Builder le frontend

```bash
cd c:\Users\testo\Desktop\memorystream\frontend
npm install
npm run build
```

### 2) Lancer le backend en production

```bash
cd c:\Users\testo\Desktop\memorystream\backend
npm install
$env:NODE_ENV="production"
npm start
```

Ouvre ensuite `http://localhost:4000` (tu dois voir l’UI).  
L’API reste disponible sur `http://localhost:4000/api/...`.

---

## Option C — Déployer en ligne (simple : 1 service)

Le code est prêt pour un déploiement “monolithique” : **un seul service Node** qui :
- expose l’API Express sur `/api/...`
- sert le frontend build (Vite) sur `/`

### Exemple avec Render (Web Service)

1. Sur Render, crée un **Web Service** depuis ton repo GitHub `Testo79/memorystream`.
2. Configure :
   - **Build command** :
     ```bash
     cd frontend && npm ci && npm run build && cd .. && cd backend && npm ci
     ```
   - **Start command** :
     ```bash
     node backend/server.js
     ```
   - **Environment variables** :
     - `NODE_ENV=production`
     - (Render fournit `PORT` automatiquement)
3. Déploie. L’URL Render affichera directement l’app.

---

## Notes importantes

- **SQLite en ligne** : la base est un fichier local (SQLite). Selon l’hébergeur, le disque peut être éphémère (reset). Pour une démo c’est OK ; pour persister, il faut un disque persistant ou passer à une BDD managée.
- **API URL** : par défaut le frontend utilise `/api` (same-origin). Si tu fais un déploiement séparé front/back, définis :
  - `VITE_API_BASE_URL=https://<backend-host>/api`

