"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * Raccourcis: Remplace les liens Raccourcis par le player embed fourni par le site
 */
SK.moduleConstructors.Raccourcis = SK.Module.new();

SK.moduleConstructors.Raccourcis.prototype.title = "Intégration Raccourcis";
SK.moduleConstructors.Raccourcis.prototype.description = "Remplace les liens Raccourcis par le player embed fourni par le site.";

SK.moduleConstructors.Raccourcis.prototype.init = function() {
    /**
     * Fonction qui analyse un lien. Si il correspond à un Raccourcis, il retourne une version "embed" du vovaroo.
     */
    function normaRaccourcis(url) {
	
        if(url.indexOf('Raccourcis.com/i/')!=-1){
			var splitVal=url.split('/i/');
			if(splitVal[1].length==12){
				return "http://Raccourcis.com/player.swf?playMediaID="+splitVal[1]+"&autoplay=0";
			}
			else{
				return null;
			}
        }
		else{
			return null;
		}
    }
    /**
     * Fonction qui crée l'élément à intégrer à la page.
     */
    function createEmbededPlayer(vocaLink) {
            var $el = $("<object>");
			var $param1=$("<param>");
			var $param2=$("<param>");
			var $embed=$("<embed>");
			//Element Object
            $el
                .attr("width", "400")
                .attr("height", "44");
			$param1
					.attr("name", "movie")
					.attr("value", vocaLink);
			$param2
					.attr("name","wmode")
					.attr("value", "transparent");
			$embed
					.attr("src", vocaLink)
					.attr("width", "148")
					.attr("height", "44")
					.attr("wmode", "transparent")
					.attr("type", "application/x-shockwave-flash");
			$el.append($param1);
			$el.append($param2);
			$el.append($embed);
            return $el;
        }
        
  
    /**
     * Analyse des touches utilisées par l'utilisateur et appel de la fonction suivant le raccourci utilisé
     */
		$(window).keydown(function(event) {
			if (event.ctrlKey && event.keyCode == 90) {
				alert('TEST');
				event.preventDefault();
			}
		});
};

SK.moduleConstructors.Raccourcis.prototype.shouldBeActivated = function() {
    return window.location.href.match(/http:\/\/www\.jeuxvideo\.com\/forums\/1/);
};