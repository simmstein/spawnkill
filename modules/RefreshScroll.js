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

/**
 * Initialise le module, fonction appelée quand le module est chargé
 */
SK.moduleConstructors.RefreshScroll.prototype.init = function() {

    setTimeout(function() {

        var $refreshButton = $(".bt_rafraichir");
        var refreshUrl = document.URL;

        //Modification du bouton Refresh
        if (!this.isRefreshed()) {
            refreshUrl += "?refresh=1";
        }
        
        $refreshButton.attr("href", refreshUrl);

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
    return regexp.test(document.URL);
};

/**
 * Méthode testant si un Module doit être activé.
 * peut-être redéfinie.
 * Par défaut le module est toujours activé
 */
SK.moduleConstructors.RefreshScroll.prototype.shouldBeActivated = function() {
    return SK.Util.currentPageIn([ "topic-read" ]);
};