"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * PemtHighlight: Met en valeur les posts simultanés
 * TODO:
 *  -Embellir la mise en valeur
 */

SK.moduleConstructors.PemtHighlight = SK.Module.new();

SK.moduleConstructors.PemtHighlight.prototype.id = "PemtHighlight";
SK.moduleConstructors.PemtHighlight.prototype.title = "PemtHighlight";
SK.moduleConstructors.PemtHighlight.prototype.description = "Met en valeur les posts simultanés";
SK.moduleConstructors.PemtHighlight.prototype.required = false;

/**
 * Initialise le module, fonction appelée quand le module est chargé
 */
SK.moduleConstructors.PemtHighlight.prototype.init = function() {
    //Crée un tableau contenant les dates du topic
    var dates = $('.date').text().replace(/via mobile/g,"").split("Posté le");
    var results = [];
    //Boucle de test de PEMT
    for (var i = 0; i < dates.length; i++) {
        //Si la date est similaire à celle du post suivant
        if (dates[i] == dates[i+1]) {
            //Alors on l'ajoute au tableau des PEMT
            results.push(dates[i]);
        }
    }
    //Si le tableau des PEMT n'est pas vide
    if (0 < results.length) {
        //Pour chaque PEMT
	    for (var i = 0; i < results.length; i++) {
            //On récupère toutes les dates du topic
	        $('.date').filter(function() {
                var re = new RegExp(results[i]);
                //Et on teste si certaines ont la date d'un PEMT
		        if (re.test($(this).text())) {
                    //Si oui, on colorie le message en orange
		            $(this).addClass("pemt-highlight");
		        }
	        });
	    }
    }   
};

SK.moduleConstructors.PemtHighlight.prototype.uneMethodeExemple = function() {
    //Ma méthode
};

/**
 * Méthode testant si un Module doit être activé.
 * peut-être redéfinie.
 * Par défaut le module est toujours activé
 */
SK.moduleConstructors.PemtHighlight.prototype.shouldBeActivated = function() {
    return SK.Util.currentPageIn([ "topic-read" ]);
};

/**
 * Retourne le CSS à injecter si le plugin est activé.
 * Par défaut, aucun CSS n'est injecté.
 */
SK.moduleConstructors.PemtHighlight.prototype.getCss = function() {

	var css = "\
        .pemt-highlight {\
            color: orange\
        };
    ";

    return css;
};

/**
 * Options configurables du plugin.
 * Ces options apparaitront dans le panneau de configuration de SpawnKill
 */ 
SK.moduleConstructors.PemtHighlight.prototype.settings = {};
