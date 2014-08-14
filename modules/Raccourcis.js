"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * Raccourcis: Ajoute des raccourcis aux forums
 */
SK.moduleConstructors.Raccourcis = SK.Module.new();

SK.moduleConstructors.Raccourcis.prototype.title = "Intégration Raccourcis";
SK.moduleConstructors.Raccourcis.prototype.description = "Ajoute des raccourcis clavier";

SK.moduleConstructors.Raccourcis.prototype.init = function() {
	/**
	*Fonction de passage à la page précedente
	*/
	function pPrecedente(){
		var path=window.location.href;
		var splitLoca=path.split('-');
		if(splitLoca[3]>1){
			splitLoca[3]=parseInt(splitLoca[3])-1;
			splitLoca[3]=splitLoca[3].toString();
			var nbSegment=splitLoca.length;
			var urlFinale="";
			for(var i=0;i<nbSegment;i++)
			{	if(i!=nbSegment-1){
					urlFinale+=splitLoca[i]+"-";
				}
				else{
					urlFinale+=splitLoca[i];
				}
			}
			window.location.href=urlFinale;
		}
	}
	/**
	*Fonction de passage à la page suivante
	*/
	function pSuivante(){
		var path=window.location.href;
		var splitLoca=path.split('-');
		var nbPageMax="";
		
		//Permet de récupérer le nombre de page sur les gros topics
		if($('.pagination').eq(0).find('a').eq($('.pagination').eq(0).find('a').length-1)[0].innerHTML!="»"){
			nbPageMax=parseInt($('.pagination').eq(0).find('a').eq($('.pagination').eq(0).find('a').length-1)[0].innerHTML);
		}
		else{
			nbPageMax=parseInt($('.pagination').eq(0).find('a').eq($('.pagination').eq(0).find('a').length-2)[0].innerHTML);
		}
		
		if(splitLoca[3]<nbPageMax){
			splitLoca[3]=parseInt(splitLoca[3])+1;
			splitLoca[3]=splitLoca[3].toString();
			var nbSegment=splitLoca.length;
			var urlFinale="";
			for(var i=0;i<nbSegment;i++)
			{	if(i!=nbSegment-1){
					urlFinale+=splitLoca[i]+"-";
				}
				else{
					urlFinale+=splitLoca[i];
				}
			}
			window.location.href=urlFinale;
		}
	}
    
        
  
    /**
     * Analyse des touches utilisées par l'utilisateur et appel de la fonction suivant le raccourci utilisé
     */
		$(window).keydown(function(event) {
			console.log(event.keyCode);
			//Ctrl + fleche gauche -> page précedente
			if (event.ctrlKey && event.keyCode == 37) {
				pPrecedente();
				event.preventDefault();
			}
			//Ctrl + fleche doite -> page suivante
			if (event.ctrlKey && event.keyCode == 39) {
				pSuivante();
				event.preventDefault();
			}
		});
};

SK.moduleConstructors.Raccourcis.prototype.shouldBeActivated = function() {
    return window.location.href.match(/http:\/\/www\.jeuxvideo\.com\/forums\/1/);
};