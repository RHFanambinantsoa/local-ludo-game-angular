# Notes et apprentissages - Ludo Angular

ici je vais noter les choses que j'ai appris, les problèmes rencontrer, ce qui a été interéssant à savoir dans le developpement de ce projet

## 1. Déploiement Netlify : Checklist déploiement Angular → Netlify

### \_redirects :

Créer un fichier dans src/\_redirects

### Explication \_redirects (Netlify)

Ce fichier permet à Angular (SPA) de gérer toutes les routes côté client.
Sans lui, si l’utilisateur recharge une page autre que la racine, Netlify renverra 404.

La ligne /\* /index.html 200 signifie :
/\* → toutes les routes
/index.html → servir toujours le fichier index.html
200 → code HTTP OK, même si la route n’existe pas physiquement

### Ajouter \_redirects dans angular.json → section build → options → assets :

dans la section build pas test

"assets": [
"src/favicon.ico",
"src/assets",
"src/_redirects"
]

### Build production :

ng build --configuration production

### Vérifie où Angular met les fichiers :

index.html et \_redirects doivent être dans le dossier final du build

Pour ce projet, c’est :

dist/ludo-game/browser/

### Netlify : Configuration à faire sur Netlify

Dans Deploy Seeting --> build seeting

- Build command : ng build --configuration production
- Publish directory : dist/ludo-game/browser (attention à ce chemin !
  les deux fichiers index.html et \_redirects doivent être dans le root de ce dossier et pas dans un quelconque dossier)
- Trigger deploy → site rebuild automatiquement

Dans Deploy Seeting --> branches and deploy context

- Production branch : main
  c'est la branche main qu'ond deploie
- Branch deploys :Deploy all branches pushed to the repository
- Deploy Previews: Any pull request against your production branch / branch deploy branches
  à chaque push dans le branche main ça fait un nouveau build

### Test final :

- Ouvrir le lien Netlify
- Recharger la page
  et Boom → plus de 404

---

## 2. Angular

- Utilisation de LocalStorage pour sauvegarder les pions

- Configuration des assets dans angular.json
  "assets": [
  {
  "glob": "**/*",
  "input": "public"
  }
  ],
  glob → indique quels fichiers copier depuis le dossier input
  "\*_/_" = tous les fichiers et sous-dossiers récursivement
  input → dossier source dans ton projet
  public → Angular va prendre tous les fichiers dans src/public

- Structure du projet Angular pour un SPA

### angular Material

Angular Material compare type + valeur (===)
[value]="1" = nombre 1
value="1" = string "1"

---

## 3. Ce que j'ai appris sur Git

- Workflow branche dev → main → Netlify
- Commandes utiles :
  - `git branch` : Liste toutes les branches
  - `git branch -m master dev` : Change le nom de la branche master en dev
  - `git checkout main` : Change la branche sur laquelle on travaille.
  - `git merge dev` : Fusionne les changements de la branche dev dans la branche actuelle (main).
  - `git merge dev --allow-unrelated-histories` :

    --allow-unrelated-histories sert uniquement la première fois que Git fusionne deux branches qui n’ont aucun historique commun.
    Une fois que la fusion est faite et commitée, Git considère que les deux branches partagent un historique commun, donc les merges suivants se font normalement

  - `git add .` : Ajoute tous les changements
  - `git commit -m "Fix redirects for Netlify"` : fait un commit (normalement je sais déjà ça)
  - `git push origin main` : Envoie la branche main locale vers GitHub (le dépôt distant).

---

## 4. Problèmes rencontrés et storyTime

### the fucking erreur 404 sur Netlify à cause de ce foutu publish directory

- ça m'a pris des heures à résoudres. j'ai pensé que le problème venait de mes chemins dans assests de angular.json mais en fait pas du tout. c'était le chemin dans netlify qui n'était pas correcte.
- chatGPT n'a pas beaucoup aidé non plus.
- j'ai du aller sur le support de netlify, demander à l'IA de netlify (merci petite, tu m'as beaucoup aidé)

---

## 5. Idées futures

- Ajouter un système de score
- Ajouter un mode multijoueur
