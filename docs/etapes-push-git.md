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

**Résultat :** premier commit enregistré en local avec un message descriptif.

---

## 5. Étapes à faire de ton côté pour pousser sur un dépôt distant

### 5.1 Créer un dépôt distant

- Va sur **GitHub** (github.com) ou **GitLab** (gitlab.com).
- Crée un **nouveau dépôt** (repository) **vide** (sans README, sans .gitignore).
- Note l’URL du dépôt, par exemple :
  - `https://github.com/TON_USERNAME/memorystream.git`
  - ou `git@github.com:TON_USERNAME/memorystream.git` (SSH)

### 5.2 Lier le dépôt local au dépôt distant

```bash
git remote add origin URL_DU_DEPOT
```

Exemple :

```bash
git remote add origin https://github.com/TON_USERNAME/memorystream.git
```

### 5.3 Choisir le nom de la branche principale (optionnel)

Si le dépôt distant attend une branche nommée `main` :

```bash
git branch -M main
```

### 5.4 Pousser le code vers le dépôt distant

```bash
git push -u origin main
```

(Remplace `main` par `master` si ta branche s’appelle `master`.)

**Résultat :** le code est envoyé sur GitHub/GitLab. Les prochains push pourront se faire avec simplement `git push`.

---

## Récapitulatif des commandes (ordre d’exécution)

| Étape | Commande |
|-------|----------|
| 1 | `cd c:\Users\testo\Desktop\memorystream` |
| 2 | `git init` |
| 3 | `git add .` |
| 4 | `git commit -m "Initial commit: MemoryStream - carte, lieux, histoires, API Express, SQLite"` |
| 5 | Créer le dépôt vide sur GitHub/GitLab |
| 6 | `git remote add origin URL_DU_DEPOT` |
| 7 | `git branch -M main` (si besoin) |
| 8 | `git push -u origin main` |

---

*Document généré pour le projet MemoryStream.*
