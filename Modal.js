"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * Représente une fenêtre modale de SpawnKill, options possibles :
 * title (string) : Titre de la modale
 * content (string | jQuery Element) : Contenu HTML de la modale
 * buttons (Array<SK.Button>) : Tableau de boutons à ajouter à la modale
 */
SK.Modal = function(options) {

    var $modal = $("<div>", {
        class: "modal-box",
        html:
            "<h3>" + options.title + "</h3>" +
            "<hr>" +
            "<div class='content' ></div>" +
            "<div class='box buttons'></div>" 
    });

    $modal.find(".content").append(options.content);

    //On ajoute les boutons à la modale
    var $buttons = $modal.find(".box.buttons");
    for(var key in options.buttons) {
        $buttons.prepend(options.buttons[key]);
    }

    return $modal;
};