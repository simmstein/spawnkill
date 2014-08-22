"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * NouveauModule : Description du module
 */
SK.moduleConstructors.NouveauModule = SK.Module.new();

SK.moduleConstructors.NouveauModule.prototype.id = "NouveauModule";
SK.moduleConstructors.NouveauModule.prototype.title = "Titre du nouveau module";
SK.moduleConstructors.NouveauModule.prototype.description = "Description du nouveau module";
SK.moduleConstructors.NouveauModule.prototype.required = false;

/**
 * Initialise le module, fonction appelée quand le module est chargé
 */
var url = document.URL;
var regexp = /\?refresh=1/;
SK.moduleConstructors.NouveauModule.prototype.init = function() {
    //Modification du bouton Refresh
    if (this.isRefreshed()) {
        $(".bt_rafraichir").attr("href", document.URL);
    }
    else {
        $(".bt_rafraichir").attr("href", document.URL + "?refresh=1");
    }

    //Teste si la requête est un rafraichissement
    if (this.isRefreshed()) {
        //Scrolle jusqu'au dernier message
        window.scrollTo(0,$(".msg").last().position().top);
    }  
};

SK.moduleConstructors.NouveauModule.prototype.isRefreshed = function() {
    if (regexp.test(url)) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * Méthode testant si un Module doit être activé.
 * peut-être redéfinie.
 * Par défaut le module est toujours activé
 */
SK.moduleConstructors.NouveauModule.prototype.shouldBeActivated = function() {
    return true;
};

/**
 * Retourne le CSS à injecter si le plugin est activé.
 * Par défaut, aucun CSS n'est injecté.
 */
SK.moduleConstructors.NouveauModule.prototype.getCss = function() {

	var css = "";

    return css;
};

/**
 * Options configurables du plugin.
 * Ces options apparaitront dans le panneau de configuration de SpawnKill
 */ 
SK.moduleConstructors.NouveauModule.prototype.settings = {};
