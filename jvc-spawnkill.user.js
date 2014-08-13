// ==UserScript==
// @name        JVC SpawnKill
// @description JVC SpawnKill est un plugin pour jeuxvideo.com ajoutant des fonctionnalités comme les avatars, les citations ou les signatures.        
// @author      Spixel_
// @namespace   http://www.spixel.fr
// @include     http://*.jeuxvideo.com*
// @version     1.7.0.1
// @require     jquery-1.11.1.min.js?v1.7.0.1
// @require     jquery-plugins.js?v1.7.0.1
// @require     base.js?v1.7.0.1
// @require     Util.js?v1.7.0.1
// @require     Message.js?v1.7.0.1
// @require     Author.js?v1.7.0.1
// @require     Button.js?v1.7.0.1
// @require     SlideToggle.js?v1.7.0.1
// @require     Modal.js?v1.7.0.1
// @require     modules/Module.js?v1.7.0.1
// @require     modules/StartSpawnKill.js?v1.7.0.1
// @require     modules/Settings.js?v1.7.0.1
// @require     modules/QuickResponse.js?v1.7.0.1
// @require     modules/Quote.js?v1.7.0.1
// @require     modules/InfosPseudo.js?v1.7.0.1
// @require     modules/HilightNewTopic.js?v1.7.0.1
// @require     modules/LastPage.js?v1.7.0.1
// @require     modules/YouTube.js?v1.7.0.1
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
// @resource    link-gray   images/link-gray.png
// @resource    calendar    images/calendar.png
// @resource    clock       images/clock.png
// @resource    settings    images/settings.png
// @resource    loader      images/loader.gif
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceURL
// @grant       GM_setClipboard
// @run-at document-start
// ==/UserScript==

/*
Roadmap :

    v1.7
    - Nettoyage du changelog dans le code (CHANGELOG.MD)
    - Remplacer le lien avatar vers un agrandissement de l'avatar.
    - Affichage des photos/vidéos/sondages dans les posts
    - Popup pour voir les images/vidéos en grand
    - Ajouter une option de choix pour la position du rang
    - Décalage du bouton prévenir admin
    - Prendre en compte les mecs bannis
    - Ajouter le pseudo du mec dans le XML

    v1.8
    - Ajouter un AutoUpdater
    - Faire des icones pour améliorer les citations
    - Affichage des plugins dans la preview du message
    - Affichage de la version en grisé à droite dans les settings

    v1.9
    - Faire la distinction entre les bans définitifs et les ban tempo
    - Bugs avec "aujourd'hui" dans les citations Turboforum

    v1.9.1
    - Ajouter d'autres types d'options pour les plugins (string, text, int, bool, float, color, select,...)
    - Ajouter option type de citations
    - Possibilité de citer seulement une partie du message
    - Ajouter un helper pour les regex de pages
    - Plusieurs tailles d'avatars
    - Afficher la description des modules dans le panneau de configuration

    
    Fonctionnalités :
        - Prévenir en cas de nouveau message (+ notifications)
        - Bookmark dernière page d'un topic
        - Ajouter un lien vers les citations de ce message
        - Ajouter un lien vers les screenshots de la fonctionnalité dans le panneau de config
        - Ajouter une preview des fonctionnalités (depuis ajax du site)
        - Possibilité d'afficher plus de 15 topics par page
        - Ajouter des conditions/dépendances aux options
        - Ajout de raccourcis claviers
        - Pouvoir réellement collectionner les triangles poupres / hexagones oranges ou rectangles dorés scintillants
    
    Bugs :
        - Le panneau de paramètrage ne peut pas défiler
        - Corriger taille de popups sur mac
        - Lorsqu'on reload à la création d'un message, il disparait.
        - Faire fonctionner le plugin sur Opera
    
    Guide :
        - Utilisation des classes Message, Modal, Author, Button
        - Mise en file du code
        - Guideline boutons/actions/animations/...

    Autre :
        - Ajouter option durée validité cache, options avancées ?
        - Ajouter le système de files au guide
        - Ajout d'un module de structure des données, de dépendances et de hooks pour les plugins
        - Réduire la taille des options
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

    var initModule = function(module) {
        module.internal_init();
    };

    if($("#footer").length > 0) {

        clearInterval(checkDomReady);
        
        //On initialise les modules actifs
        for(var key in SK.modules) {
            if(SK.modules[key].activated) {
                initModule(SK.modules[key]);
            }
        }
    }

}, 50);
