Roadmap - SpawnKill
=====================

### v1.11.3
- Affichage des plugins dans la preview du message
- Ajouter d'autres types de paramètres dans la config
- Ajouter une option de choix pour la position du rang
- Bugs avec "aujourd'hui" dans les citations Turboforum
- Faire la distinction entre les bans définitifs et les ban tempo
- Corriger problème redicrecting at avec le lien HTML de github release

### v1.12
- Ajouter d'autres types d'options pour les plugins (string, text, int, bool, float, color, select, bouton action...)
- Ajouter option type de citations
- Possibilité de citer seulement une partie du message
- Ajouter un helper pour les regex de pages
- Plusieurs tailles d'avatars
- Afficher la description des modules dans le panneau de configuration



### Plus tard

#### Fonctionnalités :
*Général*
- Affichage des plugins dans la preview du message
- Lien pour reporter un bug

*AutoUpdate*
- Changelog directement dans les notifications

*InfosPseudo*
- Bouton pour vider le cache

*EmbedMedia*
- Datapopin sur les liens des images pour dissocier les miniatures et les popins
- Option pour afficher les images en miniatures
- Ajouter option durée validité cache, options avancées ?

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


### Optimisation

*Général*
- Optimiser les appels au localStorage : un objet JS pour tous les settings
- Ne boucler qu'une fois sur les messages et déclencher des événements interceptables par les plugins

*WarnOnNewPost*
- Websocket plutôt que requêtes Ajax

#### Bugs :
*EmbedMedia*
- La CDV n'est pas clicmolettable sur Chrome

*API*
- Retourner une chaîne vide en cas d'erreur et ne pas mettre en cache le résultat de l'appel

*Settings*
- Le panneau de paramètrage ne peut pas défiler


#### Développement :

*Documentation*
- Utilisation des classes Message, Modal, Author, Button
- Mise en file d'exécution du code
- Guideline boutons/actions/animations/...

*Autre*
- Ajouter des tooltips facilement (slidetoggle, lastpage, ...)