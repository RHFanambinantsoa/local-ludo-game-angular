## Ludo Game Angular

# Description

Ce projet est un jeu de Ludo développé en Angular.
Il est entièrement frontend et stocke les données localement (LocalStorage).
Le site est prévu pour être déployé sur Netlify.

## Installation / Développement local

# Cloner le projet :

git clone https://github.com/RHFanambinantsoa/local-ludo-game-angular.git
cd local-ludo-game-angular

# Installer les dépendances :

npm install

# Lancer le serveur Angular :

ng serve

# Ouvrir dans le navigateur :

http://localhost:4200

# Build pour Netlify

# Ajouter le fichier \_redirects à la racine du projet Angular :

src/\_redirects

# Contenu du fichier \_redirects :

/\* /index.html 200

# Ajouter \_redirects dans angular.json → section build → options → assets :

"assets": [
"src/favicon.ico",
"src/assets",
"src/_redirects"
]

# Build de production :

ng build --configuration production

# Publier sur Netlify : utiliser le publish directory :

dist/ludo-game

# Explication \_redirects (Netlify)

Ce fichier permet à Angular (SPA) de gérer toutes les routes côté client.
Sans lui, si l’utilisateur recharge une page autre que la racine, Netlify renverra 404.

La ligne /\* /index.html 200 signifie :
/\* → toutes les routes
/index.html → servir toujours le fichier index.html
200 → code HTTP OK, même si la route n’existe pas physiquement

# Important :

Ne pas mettre de commentaires dans le fichier \_redirects.
Placer ce fichier à la racine du projet Angular et l’ajouter dans assets dans angular.json.

# Déploiement

Le projet est prévu pour un déploiement Netlify.

# Branches :

main → version stable / production
dev → développement / tests

À chaque push sur GitHub, Netlify rebuild automatiquement le projet.

# Fonctionnalités

    Jouer au Ludo à 2-4 joueurs

    Déplacement des pions

    Sauvegarde automatique dans LocalStorage

    Interface responsive
