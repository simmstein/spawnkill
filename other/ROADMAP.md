Roadmap - SpawnKill
=====================

### v1.13
- Scroller au dernier post quand on répond
- Possibilité de citer seulement une partie du message
- Réduire la taille des options
- Gestion des onglets dans le panneau de configuration

### coming soon
- Passer le roadmap sur l'issue tracker de Github
- Donner le même avatar aux bannis quand ils postent plusieurs fois
*WarnOnNewPost*
- Websocket plutôt que requêtes Ajax

### Plus tard

#### Bugs :

*InfosPseudo*
- En petit, les avatars des bannis sont invisibles

*Settings*
- Le panneau de paramètrage ne peut pas défiler

*LastPage*
- Bug avec les pass modérateurs : http://www.jeuxvideo.com/forums/1-1000021-2267708-22-0-1-0-script-jvc-spawnkill-avant-respawn.htm#message_2286047

*PemtHiliht*
- Les pemt via mobile ne fonctionnent pas correctement : http://www.jeuxvideo.com/forums/1-50-169394717-2-0-1-0-big-pemt-a-22-22-22.htm

*WarnOnNewPost*
- Problème avec "NaN" quand la connexion n'est pas trouvée


#### Fonctionnalités :
*Général*
- Supporter les forums JV
- Lien pour reporter un bug
- Remplacer les liens vers les topics par le titre du topic
- Ajouter d'autres types d'options pour les plugins (string, text, int, bool, float, color, select, bouton action...)

*AutoUpdate*
- Changelog directement dans les notifications

*InfosPseudo*
- Bouton pour vider le cache

*EmbedMedia*
- Problème avec les liens Youtube incorporants une durée
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
- Recherche Intra Topic


### Optimisation

*Général*
- Optimiser les appels au localStorage : un objet JS pour tous les settings
- Ne boucler qu'une fois sur les messages et déclencher des événements interceptables par les plugins
- Système de priorité pour les appels avec des événements pour lancer d'autres appels

#### Développement :

*Documentation*
- Utilisation des classes Message, Modal, Author, Button
- Mise en file d'exécution du code
- Guideline boutons/actions/animations/...

*Autre*
- Ajouter des tooltips facilement (slidetoggle, lastpage, ...)