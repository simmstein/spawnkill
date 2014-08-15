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

SK.moduleConstructors.WarnOnNewPost.prototype.init = function() {
    //Timeout de 2 secondes pour éviter que le script retarde le chargement de la page
    setTimeout(function() {
    	this.getCurrentTopicInfos();
    }.bind(this), 2000);
};

SK.moduleConstructors.WarnOnNewPost.prototype.getCurrentTopicInfos = function(callback) {
    //Ma méthode

    callback();
};

SK.moduleConstructors.WarnOnNewPost.prototype.shouldBeActivated = function() {
    return true;
};