Roadmap - SpawnKill
=====================

v1.11.2
- Ajout d'un son à la réception d'un post (peut être désactivé dans les paramètres)
- Ouverture des CDV dans des fenêtres modales

### v1.11.2
- Affichage des plugins dans la preview du message
- Affichage de la version en grisé à droite dans les settings
- Ajouter d'autres types de paramètres dans la config
- Ajouter une option de choix pour la position du rang

### v1.12
- Faire la distinction entre les bans définitifs et les ban tempo
- Bugs avec "aujourd'hui" dans les citations Turboforum

### v1.12.1
- Ajouter d'autres types d'options pour les plugins (string, text, int, bool, float, color, select, bouton action...)
- Ajouter option type de citations
- Possibilité de citer seulement une partie du message
- Ajouter un helper pour les regex de pages
- Plusieurs tailles d'avatars
- Afficher la description des modules dans le panneau de configuration

### Plus tard
#### Fonctionnalités :
Général :
	- Affichage des plugins dans la preview du message

AutoUpdate :
	- Changelog directement dans les notifications

InfosPseudo
	- Recharger les avatars problèmatiques
	- vider le cache

Optimisation :
	- Optimiser les appels au localStorage : un objet JS pour tous les settings

- Liens sécurisés
- Lien pour reporter un bug
- Datapopin sur les liens des images pour dissocier les miniatures et les popins
- Afficher les images en miniatures
- Nombre de posts manqués dans le favicon
- Hilight des posts de l'auteur
- Topics préférés
- Prévenir en cas de nouveau message (+ notifications)
- Bookmark dernière page d'un topic
- Ajouter un lien vers les citations de ce message
- Ajouter un lien vers les screenshots de la fonctionnalité dans le panneau de config
- Ajouter une preview des fonctionnalités (depuis ajax du site)
- Possibilité d'afficher plus de 15 topics par page
- Ajouter des conditions/dépendances aux options
- Ajout de raccourcis claviers
- Pouvoir réellement collectionner les triangles poupres / hexagones oranges ou rectangles dorés scintillants

#### Bugs :
- Le panneau de paramètrage ne peut pas défiler
- Corriger taille de popups sur mac
- Lorsqu'on reload à la création d'un message, il disparait.
- Faire fonctionner le plugin sur Opera

#### Guide :
- Utilisation des classes Message, Modal, Author, Button
- Mise en file d'exécution du code
- Guideline boutons/actions/animations/...

#### Autre :
- Passer à Vanilla JS
- Scroller au post quand on répond
- Ajouter option durée validité cache, options avancées ?
- Ajout d'un module de structure des données, de dépendances et de hooks pour les plugins
- Réduire la taille des options
- Ajouter des tooltips facilement (slidetoggle, lastpage, ...)
- Ajout de hooks au chargement des données
- Réduire les appels au localStorage
