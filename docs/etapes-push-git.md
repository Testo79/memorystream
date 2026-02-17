# Étapes suivies pour pousser le projet sur Git

Ce document décrit les étapes effectuées pour initialiser le dépôt Git et préparer le premier push vers un dépôt distant (GitHub, GitLab, etc.).

---

## 1. Vérification du projet

- **État initial :** le dossier `memorystream` n’était pas encore un dépôt Git.
- **Fichier `.gitignore` :** déjà présent. Il exclut notamment :
  - `node_modules/`
  - `.env` et variantes
  - fichiers base de données `*.db`, `*.sqlite`
  - `dist/`, `build/`
  - dossiers IDE (`.vscode/`, `.idea/`)
  - logs et fichiers temporaires

---

## 2. Initialisation du dépôt Git

```bash
cd c:\Users\testo\Desktop\memorystream
git init
```

**Résultat :** création du dossier `.git` et du dépôt local.

---

## 3. Ajout des fichiers (staging)

```bash
git add .
```

**Effet :** tous les fichiers du projet (sauf ceux listés dans `.gitignore`) sont ajoutés à l’index (zone de préparation pour le prochain commit).

---

## 4. Premier commit

```bash
git commit -m "Initial commit: MemoryStream - carte, lieux, histoires, API Express, SQLite"
```

**Résultat :** premier commit enregistré en local avec un message descriptif. La branche par défaut créée est `master`.

---

## 5. Lien avec le dépôt distant et push

### 5.1 Dépôt distant utilisé

- **URL :** https://github.com/Testo79/memorystream  
- Dépôt créé vide sur GitHub.

### 5.2 Liaison du dépôt local au dépôt distant

```bash
git remote add origin https://github.com/Testo79/memorystream.git
```

**Effectué :** le remote `origin` pointe vers ce dépôt.

### 5.3 Push effectué

```bash
git push -u origin master
```

**Résultat :** le code a été poussé sur https://github.com/Testo79/memorystream. La branche `master` suit `origin/master`. Les prochains push se font avec `git push`.

---

## Récapitulatif des commandes (ordre d’exécution)

| Étape | Commande | Statut |
|-------|----------|--------|
| 1 | `cd c:\Users\testo\Desktop\memorystream` | ✅ |
| 2 | `git init` | ✅ |
| 3 | `git add .` | ✅ |
| 4 | `git commit -m "Initial commit: MemoryStream - carte, lieux, histoires, API Express, SQLite"` | ✅ |
| 5 | Créer le dépôt vide sur GitHub | ✅ (https://github.com/Testo79/memorystream) |
| 6 | `git remote add origin https://github.com/Testo79/memorystream.git` | ✅ |
| 7 | `git push -u origin master` | ✅ |

---

*Document généré pour le projet MemoryStream.*
