# Modèle de données — reverse‑engineered (MemoryStream)

Schéma déduit du code réel : `backend/database.js` (SQLite), tables `places` et `stories`.

---

## Modèle conceptuel / logique (MCD–MLD)

### Entité **places** (lieux)
| Attribut | Type  | Contrainte | Description |
|----------|--------|------------|-------------|
| id       | TEXT  | PK, UUID   | Identifiant unique du lieu (généré côté backend avec `uuid`) |
| name     | TEXT  | —          | Nom du lieu (ex. « Tour Eiffel », « Grand Place ») |
| lat      | REAL  | NOT NULL   | Latitude (ex. 48.8584) |
| lng      | REAL  | NOT NULL   | Longitude (ex. 2.2945) |

### Entité **stories** (histoires)
| Attribut  | Type  | Contrainte | Description |
|-----------|--------|------------|-------------|
| id        | TEXT  | PK, UUID   | Identifiant unique de l’histoire |
| placeId   | TEXT  | NOT NULL, FK → places.id | Référence au lieu ; **ON DELETE CASCADE** (suppression du lieu supprime ses histoires) |
| title     | TEXT  | NOT NULL   | Titre de l’histoire |
| content   | TEXT  | NOT NULL   | Contenu texte (paragraphe(s)) |
| createdAt | TEXT  | NOT NULL   | Date de création au format ISO 8601 (ex. 2024-03-15T10:30:00.000Z) |

### Relation
- **places (1) ——&lt; stories (N)** : un lieu peut avoir plusieurs histoires ; une histoire appartient à un seul lieu.
- Cardinalité : 1–N (côté places) / N–1 (côté stories).

---

## Schéma physique (extrait SQL réel)

```sql
CREATE TABLE places (
  id TEXT PRIMARY KEY,
  name TEXT,
  lat REAL NOT NULL,
  lng REAL NOT NULL
);

CREATE TABLE stories (
  id TEXT PRIMARY KEY,
  placeId TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  FOREIGN KEY (placeId) REFERENCES places(id) ON DELETE CASCADE
);
```

---

## Prompt en français pour générer le schéma (Figma / Canva / outil de diagramme)

Copier-coller le bloc ci‑dessous pour faire générer un diagramme « Modèle de données » ou « MCD / MLD » fidèle au projet.

```
Réalise un schéma de modèle de données (MCD/MLD) en français pour l’application MemoryStream. Style épuré, lisible, type schéma de base de données.

Deux entités (tables) :

1) Entité « places » (lieux)
   - id (TEXT, clé primaire, préciser « UUID »)
   - name (TEXT)
   - lat (REAL, NOT NULL)
   - lng (REAL, NOT NULL)

2) Entité « stories » (histoires)
   - id (TEXT, clé primaire, UUID)
   - placeId (TEXT, NOT NULL, clé étrangère vers places.id)
   - title (TEXT, NOT NULL)
   - content (TEXT, NOT NULL)
   - createdAt (TEXT, NOT NULL, date ISO)

Relation : une flèche ou un trait depuis « places » vers « stories », avec la cardinalité 1 côté places et N côté stories (un lieu peut avoir plusieurs histoires, une histoire appartient à un seul lieu). Indiquer éventuellement « ON DELETE CASCADE » sur la relation (suppression du lieu supprime ses histoires).

Présentation : deux rectangles (ou blocs) côte à côte ou légèrement décalés, avec le nom de l’entité en en-tête (places / stories), puis la liste des attributs avec leurs types et contraintes. Titre du schéma : « Modèle de données — MemoryStream ». Utiliser des libellés en français (clé primaire, clé étrangère, NOT NULL). Pas de surcharge décorative.
```

---

## Variante courte (pour outil IA / génération rapide)

```
Schéma MCD/MLD en français : 2 tables. Table « places » : id (PK, UUID), name, lat (REAL), lng (REAL). Table « stories » : id (PK), placeId (FK vers places, ON DELETE CASCADE), title, content, createdAt. Relation 1-N entre places et stories. Titre : Modèle de données MemoryStream. Style schéma BDD simple et lisible.
```

---

*Reverse‑engineered à partir de `backend/database.js` — projet MemoryStream.*
