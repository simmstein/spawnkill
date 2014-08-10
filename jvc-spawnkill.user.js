// ==UserScript==
// @name        JVC SpawnKill
// @description JVC SpawnKill est un plugin pour jeuxvideo.com ajoutant des fonctionnalités comme les avatars, les citations ou les signatures.        
// @author      Spixel_
// @namespace   http://www.spixel.fr
// @include     http://*.jeuxvideo.com*
// @version     1.6.1.1
// @require     jquery-1.11.1.min.js?v1.6.1.1
// @require     spin.min.js?v1.6.1.1
// @require     jquery-plugins.js?v1.6.1.1
// @require     base.js?v1.6.1.1
// @require     Util.js?v1.6.1.1
// @require     Message.js?v1.6.1.1
// @require     Author.js?v1.6.1.1
// @require     Button.js?v1.6.1.1
// @require     SlideToggle.js?v1.6.1.1
// @require     Modal.js?v1.6.1.1
// @require     modules/Module.js?v1.6.1.1
// @require     modules/StartSpawnKill.js?v1.6.1.1
// @require     modules/Settings.js?v1.6.1.1
// @require     modules/QuickResponse.js?v1.6.1.1
// @require     modules/Quote.js?v1.6.1.1
// @require     modules/InfosPseudo.js?v1.6.1.1
// @require     modules/HilightNewTopic.js?v1.6.1.1
// @require     modules/LastPage.js?v1.6.1.1
// @resource    banImage    images/ban.png
// @resource    newTopic    images/topic_new.gif
// @resource    carton      images/carton.png
// @resource    bronze      images/bronze.png
// @resource    argent      images/argent.png
// @resource    or          images/or.png
// @resource    rubis       images/rubis.png
// @resource    emeraude    images/emeraude.png
// @resource    diamant     images/diamant.png
// @resource    saphir      images/saphir.png
// @resource    female      images/female.png
// @resource    male        images/male.png
// @resource    unknown     images/unknown.png
// @resource    plus        images/plus.png
// @resource    minus       images/minus.png
// @resource    link        images/link.png
// @resource    quote       images/quote.png
// @resource    mp          images/mp.png
// @resource    alert       images/alert.png
// @resource    settings    images/settings.png
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceURL
// @grant       GM_setClipboard
// @run-at document-start
// ==/UserScript==

/*
Changelog :

    v1.6.1.1
    - Correction mineure du CSS de QuickResponse
    - Préparation de la mise en cache des avatars

    v1.6.1
    - Désormais, les rangs s'affichent même si les avatars ne sont pas activés
    - Possibilité de citer un post sans la QuickResponse
    - Ajout des citations et liens permanents sur la page de réponse
    - Correction d'un bug qui empêchait parfois la sauvegarde des paramètres sous Chrome
    
    v1.6
    - Ajout du plugin LastPage
    - Passage à Github

    v1.5
    - Légère correction des citations pour améliorer l'affichage sur mobile
    - Ajout du panneau de configuration du script

    v1.4.1
    - Correction des citations de posts "via mobile"

    v1.4
    - Ajout des rangs dans les posts
    - Ajout d'un bouton de MP
    - Ajout d'un bouton pour copier le permalien du message
    - Ajout du sexe de l'utilisateur dans le bouton CDV
    - Amélioration du style général des boutons

    v1.3.1
    - Décalage du formulaire QuickResponse sous la pagination
    - Correction du décalage du message de split des topics

    v1.3
    - Ajout du plugin de mise en avant des nouveaux topics

    v1.2
    - Ajout de la réponse rapide
    - Ajout d'un lien vers la CDV sur l'avatar
    - Correction d'un bug avec les avatars quand il y avait des caractères spéciaux dans la CDV
    - Correction du bug qui faisait apparaître le bouton de citation dans la barre de connexion
    - Correction d'un bug qui faisait que les avatars étaient parfois bugués sur Chrome

    v1.1.2
    - Création d'une page web pour le plugin
    - Amélioration du style des avatars
    - Ajout d'un avatar pour les bannis
    - Amélioration du scrolling des citations
    - Bouton de citation plus petit


Bugs connus :
    Majeurs :
        - Pas de bloc .ancre en mode réponse classique sur le forum (docn pas de boutons.bottom)
        - Les citations de citations s'affichent mal
        - Citations moches sur mobile
        - Ralentissements importants sous Firefox au chargement des avatars
            -> Correctif : ne faire qu'une seule requête HTTP
        
    Mineur :
        - Décalage des posts au chargement des boutons
        - les avatars ne s'affichent pas dans la prévisualisation du message
        - ne fonctionne pas sous Opera
        - Les citations ne fonctionnent pas dans les MP
        - Conflits avec Turboforum
        - Lorsqu'on reload à la création d'un message, il disparait.
        - les boutons ne chargent pas en même temps

Roadmap :

    v1.6.2
    OK - Revoir le style des citations
    OK - Afficher un style particulier pour les citations
    OK - Prendre en compte les citations de JVC Master/TurboForum
    - Passer le code dans Quote
    - Commenter le code
    - Modifier Quote pour les citations de citations
    - Compiler les quotes dans un objet

    v1.6.3
    - Ajouter l'option d'afficher ou non les citations en HTML
    - Ajouter option type de citations

    v1.6.4
    - Ajout d'un cache pour les données de l'auteur (Correctif apporté par, merci :) )
    - Correction des lenteurs sous Firefox

    v1.7
    - Ajouter un AutoUpdater

    v1.7.1
    - Possibilité de citer seulement une partie du message
    - Ajouter un helper pour les regex de pages
    - Plusieurs tailles d'avatars
    - Afficher la description des modules dans le panneau de configuration

    v1.8
    - Ajouter une box pour les images/vidéos/sondages
    
    Fonctionnalités :
        - Ajouter un lien vers les citations de ce message
        - Ajouter d'autres types d'options pour les plugins (string, text, int, bool, float, color, select,...)
        - Ajouter une option de choix pour la position du rang
        - Ajouter un lien vers les screenshots de la fonctionnalité dans le panneau de config
        - Ajouter une preview des fonctionnalités (depuis ajax du site)
        - Possibilité d'afficher plus de 15 topics par page
        - Pouvoir réellement collectionner les triangles poupres / hexagones oranges ou rectangles dorés scintillants
        - Permettre de déplacer les rangs
        - Ajouter des conditions aux options
        - Ajout de raccourcis claviers
        - Mettre en cache toutes les infos de l'utilisateur
        - Choix entre plusieurs citations
        - Faire la distinction entre les bans définitifs et les ban tempo
        - Système de dépendances dans les configs
    
    Bugs :
        - Corriger la déformation de la liste des sujets quand pseudo trop long
        - Le panneau de paramètrage ne peut pas défiler
        - Faire fonctionner le plugin sur Opera
        - Corriger taille de popups sur mac
    
    Autre :
        - Création d'une branche dev sur github et hébergement du projet
        - Corriger l'affichage des citations pour les mobiles
        - Réduire la taille des options
        - Affichage de la version en grisé à droite dans les settings
        - Mettre un Message dans auteur au lieu d'un $msg, renommer $msg en $el ou l'inverse
        - Ajouter des tooltips facilement (slidetoggle, lastpage, ...)
        - Ajout de hooks au chargement des données

Fonctionnement du versioning :
    - Incrémentation de la première partie : nouveau fonctionnement
    - Incrémentation de la seconde partie : Ajout d'une fonctionnalité
    - Incrémentation de la troisième partie : Amélioration d'une fonctionnalité
    - Incrémentation de la dernière partie : Correction de bugs ou changement mineurs

*/
"use strict";
/* jshint unused: false */
/* jshint multistr: true */
/* jshint newcap: false */

//Permet de débugger sans GreaseMonkey
if($.isNotFunction(GM_xmlhttpRequest)) {
    var debug = true;
}

var modulesStyle = "";

//On charge seulement les modules nécessaires
for(var key in SK.moduleConstructors) {

    var moduleName = key;
    var module = new SK.moduleConstructors[key]();
    var moduleSettings = SK.Util.getValue(moduleName);
    //On prépare le chargement du module
    SK.modules[moduleName] = module;

    //On récupère les préférences courantes des options du module
    for(var settingKey in module.settings) {
        var setting = module.settings[settingKey];
        var settingLabel = settingKey;
        var settingValue = SK.Util.getValue(moduleName + "." + settingLabel);

        //Si la préférence n'est pas enregistrée, on prend la valeur par défaut
        if(settingValue === null) {
            settingValue = setting.default;
        }

        //On enregistre la préférence dans le module
        setting.value = settingValue;
    }

    //Si le module est requis, qu'il n'y a pas de préférences ou que la préférence est à faux
    if(module.required || moduleSettings === null || moduleSettings) {

        //On charge le CSS du module
        modulesStyle += module.internal_getCss();

        //On indique que le module est chargé
        module.activated = true;
    }
    else {
        module.activated = false;
    }

}

//On ajoute le style de tous les modules actifs
SK.Util.addCss(modulesStyle);


//document.ready ne fonctionne pas sur GM.
//Pour vérifier que le DOM est chargé, on vérifie que le footer est présent.
var checkDomReady = setInterval(function() {

    if($("#footer").length > 0) {

        clearInterval(checkDomReady);
        
        //On initialise les modules actifs
        for(var key in SK.modules) {
            if(SK.modules[key].activated) {
                SK.modules[key].internal_init();
            }
        }

    }

}, 100);
