"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * AutoUpdate : Prévient l'utilisateur quand une nouvelle version du script est disponible.
 */
SK.moduleConstructors.AutoUpdate = SK.Module.new();

SK.moduleConstructors.AutoUpdate.prototype.id = "AutoUpdate";
SK.moduleConstructors.AutoUpdate.prototype.title = "Alerte quand une mise à jour est disponible";
SK.moduleConstructors.AutoUpdate.prototype.description = "Affiche une alerte en haut à droite de l'écran quand une mise à jour de SpawnKill est disponible";
SK.moduleConstructors.AutoUpdate.prototype.required = false;

/**
 * Initialise le module, fonction appelée quand le module est chargé
 */
SK.moduleConstructors.AutoUpdate.prototype.init = function() {

	//On décale légérement la récupération pour ne pas retarder le chargement de la page
	setTimeout(function() {

		this.getLastRelease(function(release) {

			//Si la version courante n'est pas la dernière et que la notification 
			//n'a pas déjà été vue au cours de la dernière heure, on affiche une notification
			if(release.tag_name !== SK.VERSION) {

				var updateSeen = SK.Util.getValue("update.seen");

				//Si aucune noification n'a été vue ou que le délai est dépassé
				if(!updateSeen || (SK.Util.timestamp() - updateSeen) > 3600) {
					this.showUpdateModal(release);
				}
			}
		}.bind(this));

	}.bind(this), 1500);
};


/*
 * Récupérer la dernière release de SpawnKill sur Github
 * Et appelle la fonction de callback avec cette release.
 */
SK.moduleConstructors.AutoUpdate.prototype.getLastRelease = function(callback) {

	callback = callback || function() {};
	//On appelle l'API Github
	GM_xmlhttpRequest({
	    url: "http://dl.spixel.fr/greasemonkey/jvc-spawnkill/server/api-github.php?action=releases",
	    method: "GET",
	    headers: {
	        "Authorization": "Basic YXBwYW5kcjplMzIhY2Rm"
	    },
	    onload: function(response) {
	        callback(JSON.parse(response.responseText)[0]);
	    }
	});
};

/**
 * Affiche la fenêtre modale de mise à jour.
 */
SK.moduleConstructors.AutoUpdate.prototype.showUpdateModal = function(release) {

	var self = this;

	var modalContent = "\
		<h4>" + release.name + "<span class='spawnkill-version' >" + release.tag_name + "</span></h4>\
	";

	var pseudoRandomString = new Array(16 + 1).join((Math.random().toString(36) + "00000000000000000").slice(2, 18)).slice(0, 10);

	var $downloadButton = new SK.Button({
	    class: "large",
	    text: "Installer",
	    href: "https://github.com/dorian-marchal/spawnkill/raw/master/jvc-spawnkill.user.js?nocache&" + pseudoRandomString + ".user.js",
	    target: "_blank",
	    tooltip: {
	        class: "large bottom-right",
	        text: "Installer la mise à jour",
	        position: "bottom"
	    }
	});

	var $changelogButton = new SK.Button({
	    class: "large minor",
	    text: "Changelog",
	    href: "https://github.com/dorian-marchal/spawnkill/releases/latest",
	    target: "_blank",
	    tooltip: {
	        class: "large bottom-right",
	        text: "Voir les nouveautés de cette version",
	        position: "bottom"
	    }
	});

	var $modal = new SK.Modal({
		class: "update",
	    location: "notification",
	    title: "Mise à jour de SpawnKill disponible",
	    content: modalContent,
	    buttons: [ $changelogButton, $downloadButton ],
	    closeButtonAction: function() {
	    	self.dissmisUpdateNotification();
	    }
	});

	SK.Util.showModal($modal);
};

/** Supprime la modale et enregistre que l'utilisateur a vu la notification dans le localStorage */
SK.moduleConstructors.AutoUpdate.prototype.dissmisUpdateNotification = function() {
	SK.Util.setValue("update.seen", SK.Util.timestamp());
	SK.Util.hideModal();
};

/**
 * Retourne le CSS à injecter si le plugin est activé.
 * Par défaut, aucun CSS n'est injecté.
 */
SK.moduleConstructors.AutoUpdate.prototype.getCss = function() {

	var css = "\
		.modal-box.update h4 {\
			font-size: 1.2em;\
			font-weight: normal;\
			margin: 10px 0px 20px;\
		}\
		.modal-box.update .spawnkill-version {\
			color: #A3A3A3;\
			float: right;\
		}\
	";
    return css;
};

SK.moduleConstructors.AutoUpdate.prototype.settings = {};