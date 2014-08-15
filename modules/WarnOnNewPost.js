"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * WarnOnNewPost : Permet de savoir quand un nouveau message a été posté dans un topic sans recharger la page
 */
SK.moduleConstructors.WarnOnNewPost = SK.Module.new();

SK.moduleConstructors.WarnOnNewPost.prototype.id = "WarnOnNewPost";
SK.moduleConstructors.WarnOnNewPost.prototype.title = "Indiquer les nouveaux posts";
SK.moduleConstructors.WarnOnNewPost.prototype.description = "Indique le nombre de nouveaux messages postés depuis que la page a chargé dans le titre de l'onglet";

/**
 * Initialise le module, fonction appelée quand le module est chargé
 */
SK.moduleConstructors.WarnOnNewPost.prototype.init = function() {
    //Méthode du modules
    this.uneMethodeExemple();
};

SK.moduleConstructors.WarnOnNewPost.prototype.uneMethodeExemple = function() {
    //Ma méthode
};

SK.moduleConstructors.WarnOnNewPost.prototype.shouldBeActivated = function() {
    return true;
};