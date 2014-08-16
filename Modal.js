"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * Représente une fenêtre modale de SpawnKill, options possibles :
 * title (string) : Titre de la modale
 * content (string | jQuery Element) : Contenu HTML de la modale
 * buttons (Array<SK.Button>) : Tableau de boutons à ajouter à la modale
 * location (string) : Position de la modale "top" (defaut) ou "center"
 * + options jQuery
 */
SK.Modal = function(options) {

    var title = options.title || "";
    delete options.title;
    var buttons = options.buttons.length > 0 ? options.buttons : [];
    delete options.buttons;
    var content = options.content || "";
    delete options.content;
    var location = options.location || "top";
    delete options.location;

    var $title = title ? "<h3>" + title + "</h3><hr>" : "";

    var $modal = $("<div>", options);
    $modal.addClass("modal-box " + location);
    $modal.html(
        $title +
        "<div class='content' ></div>" +
        "<div class='box buttons'></div>"
    );

    $modal.find(".content").append(content);

    //On ajoute les boutons à la modale
    var $buttons = $modal.find(".box.buttons");
    for(var key in buttons) {
        $buttons.prepend(buttons[key]);
    }
    
    //Si la modale doit être centrée, on récupère ses dimensions
    if(location === "center") {

        $modal.hide();
        $("#footer").append($modal);
        
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();

        //On récupère ses dimensions pour mettre à jour sa position
        $modal.css({
            left: (windowWidth / 2 - $modal.outerWidth() / 2) + "px",
            top: (windowHeight / 2 - $modal.outerHeight() / 2) + "px"
        });

        $modal.detach();
        $modal.show();
    }



    return $modal;
};