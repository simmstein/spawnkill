"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * Refresh: plugin du bouton de rafraichissement 
 */
SK.moduleConstructors.RefreshScroll = SK.Module.new();

SK.moduleConstructors.RefreshScroll.prototype.id = "RefreshScroll";
SK.moduleConstructors.RefreshScroll.prototype.title = "Scrolling du bouton de rafraichissement";
SK.moduleConstructors.RefreshScroll.prototype.description = "Le bouton de rafraichissement scrolle en bas de la page";
SK.moduleConstructors.RefreshScroll.prototype.required = true;

/**
 * Initialise le module, fonction appelée quand le module est chargé
 */
SK.moduleConstructors.RefreshScroll.prototype.init = function() {
    setTimeout(function() {
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
    }.bind(this),1500);
};

SK.moduleConstructors.RefreshScroll.prototype.isRefreshed = function() {
    //Cette regexp teste si l'url contient ?refresh=1
    var regexp = /\?refresh=1/;

    //Teste si la requête vient du bouton Rafraichir
    if (regexp.test(document.URL)) {
        return true;
    }
    else {
        return false;
    }
};

/**
 * Méthode testant si un Module doit être activé.
 * peut-être redéfinie.
 * Par défaut le module est toujours activé
 */
SK.moduleConstructors.RefreshScroll.prototype.shouldBeActivated = function() {
    return SK.Util.currentPageIn([ "topic-read" ]);
};

/**
 * Retourne le CSS à injecter si le plugin est activé.
 * Par défaut, aucun CSS n'est injecté.
 */
SK.moduleConstructors.RefreshScroll.prototype.getCss = function() {

	var css = "";

    return css;
};

/**
 * Options configurables du plugin.
 * Ces options apparaitront dans le panneau de configuration de SpawnKill
 */ 
SK.moduleConstructors.RefreshScroll.prototype.settings = {};
