Roadmap - SpawnKill
=====================

### v1.11.4
- Correction d'un bug avec la réponse rapide quand un topic était locké.
- Affichage des plugins dans la preview du message
- Ajouter une option de choix pour la position du rang
- Correction d'un bug avec "aujourd'hui" dans les citations Turboforum
- (Dev) Ajout d'autres types de paramètres dans le panneau de configuration

### v1.12
- Ajouter d'autres types d'options pour les plugins (string, text, int, bool, float, color, select, bouton action...)
- Ajouter option type de citations
- Possibilité de citer seulement une partie du message
- Plusieurs tailles d'avatars

### Plus tard

#### Fonctionnalités :
*Général*
- Supporter les forums JV
- Affichage des plugins dans la preview du message
- Lien pour reporter un bug
- Bouton rafraichir : scroll en bas du topic
- Remplacer les liens vers les topics par le titre du topic

*AutoUpdate*
- Changelog directement dans les notifications

*InfosPseudo*
- Bouton pour vider le cache

*EmbedMedia*
- Datapopin sur les liens des images pour dissocier les miniatures et les popins
- Option pour afficher les images en miniatures
- Ajouter option durée validité cache, options avancées ?
- StrawPoll
- SoundCloud

*Settings*
- Ajouter un lien vers les screenshots de la fonctionnalité dans le panneau de config
- Ajouter une preview des fonctionnalités (depuis ajax du site)
- Ajouter des conditions/dépendances aux options
- Réduire la taille des options

*Shortcuts*
- Ajout de raccourcis claviers

*Autre*
- Liens sécurisés (griser les liens qui ressemblent à Noelshack mais n'en sont pas)
- Hilight des posts de l'auteur
- Topics préférés
- Bookmark dernière page d'un topic
- Ajouter un lien vers les citations de ce message
- Possibilité d'afficher plus de 15 topics par page
- Scroller au post quand on répond
- Surligner les PEMT
- Recherche Intra Topic


### Optimisation

*Général*
- Optimiser les appels au localStorage : un objet JS pour tous les settings
- Ne boucler qu'une fois sur les messages et déclencher des événements interceptables par les plugins
- Système de priorité pour les appels avec des événements pour lancer d'autres appels

*WarnOnNewPost*
- Websocket plutôt que requêtes Ajax

#### Bugs :

*API*
- Retourner une chaîne vide en cas d'erreur et ne pas mettre en cache le résultat de l'appel

*Settings*
- Le panneau de paramètrage ne peut pas défiler

*LastPage*
- Bug avec les pass modérateurs : http://www.jeuxvideo.com/forums/1-1000021-2267708-22-0-1-0-script-jvc-spawnkill-avant-respawn.htm#message_2286047


#### Développement :

*Documentation*
- Utilisation des classes Message, Modal, Author, Button
- Mise en file d'exécution du code
- Guideline boutons/actions/animations/...

*Autre*
- Ajouter des tooltips facilement (slidetoggle, lastpage, ...)