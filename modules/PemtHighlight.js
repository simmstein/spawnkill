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
SK.moduleConstructors.NouveauModule.prototype.required = true;

/**
 * Initialise le module, fonction appelée quand le module est chargé
 */
SK.moduleConstructors.NouveauModule.prototype.init = function() {
    var dates = $('.date').text().replace(/via mobile/g,"").split("Posté le");
    var results = [];
    for (var i = 0; i < dates.length; i++) {
        if (dates[i] == dates[i+1]) {
            results.push(dates[i]);
        }
    }
    if (0 < results.length) {
	for (var i = 0; i < results.length; i++) {
	    $('.date').filter(function() {
                var re = new RegExp(results[i]);
		if (re.test($(this).text())) {
		    $(this).parents('.msg').css("background","orange");
		}
	    });
	}
    }   
};

SK.moduleConstructors.NouveauModule.prototype.uneMethodeExemple = function() {
    //Ma méthode
};

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
