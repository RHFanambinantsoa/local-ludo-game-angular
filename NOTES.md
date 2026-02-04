# Notes et apprentissages - Ludo Angular

ici je vais noter les choses que j'ai appris, les problèmes rencontrer, ce qui a été interéssant à savoir dans le developpement de ce projet

## 1. Déploiement Netlify

- Ajouter `_redirects` dans `src/` pour gérer toutes les routes Angular
- Ajouter `_redirects` dans `angular.json` → assets
- Publish directory = dist/ludo-game
- Build command = ng build --configuration production
- Importance de la branche main pour Netlify

## 2. Angular

- Utilisation de LocalStorage pour sauvegarder les pions
- Configuration des assets dans angular.json
- Structure du projet Angular pour un SPA

## 3. Git

- Workflow branche dev → main → Netlify
- Commandes utiles :
  - `git branch` : Liste toutes les branches
  - `git branch -m master dev` : Change le nom de la branche master en dev
  - `git checkout main` : Change la branche sur laquelle on travaille.
  - `git merge dev` : Fusionne les changements de la branche dev dans la branche actuelle (main).
  - `git merge dev --allow-unrelated-histories` :

    --allow-unrelated-histories sert uniquement la première fois que Git fusionne deux branches qui n’ont aucun historique commun.
    Une fois que la fusion est faite et commitée, Git considère que les deux branches partagent un historique commun, donc les merges suivants se font normalement

  - `git push origin main` : Envoie la branche main locale vers GitHub (le dépôt distant).

## 4. Problèmes rencontrés

- 404 sur Netlify à cause des routes Angular
- Colon expected dans angular.json → problème de syntaxe JSON

## 5. Idées futures

- Ajouter un système de score
- Créer un portfolio pour héberger le projet
- Ajouter un mode multijoueur
