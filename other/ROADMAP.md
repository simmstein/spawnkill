Roadmap - SpawnKill
=====================

### v1.10
- Ajout d'un avertissement quand de nouveaux messages sont postés dans un topic dans le titre de l'onglet
- Ajout de regex pour les pages
- Mise en cache des données côté serveur (pendant 12 heures)
- Correction d'un bug avec l'intégration Pixule : http://www.jeuxvideo.com/forums/1-50-168545013-1-0-1-0-le-starter-le-plus-nul.htm

### v1.10.1
- Remplacer le lien avatar vers un agrandissement de l'avatar.
- Popup pour voir les images/vidéos en grand
- Ajouter une option de choix pour la position du rang

### v1.10.2
- Ajouter une option de choix pour la position du rang
- Ajouter les types de paramètres dans la config
- Ajout de fenêtres modales centrées
- Affichage de l'avatar dans une popin centrée

### v1.11
- Ajouter un AutoUpdater
- Faire des icones pour améliorer les citations
- Affichage des plugins dans la preview du message
- Affichage de la version en grisé à droite dans les settings

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
