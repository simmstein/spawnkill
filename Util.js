"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/* Fonctions Utiles */
SK.Util = {
    
    /* Effectue une requête sur l'api de JVC */
    jvc: function(url, callback) {

        GM_xmlhttpRequest({
            url: "http://ws.jeuxvideo.com/" + url,
            method: "GET",
            headers: {
                "Authorization": "Basic YXBwYW5kcjplMzIhY2Rm"
            },
            onload: function(response) {
                callback($($.parseXML(SK.Util.sanitizeXML(response.responseText))));
            }
        });
    },

    /* Montre une fenêtre modale passée en paramètre */
    showModal: function($modal) {
        var $background = $("#modal-background");
        $background.after($modal);
        SK.Util.fetchStyle($modal);

        $background.fadeIn();
        $modal.addClass("active");
    },

    /* Cache une fenêtre modale si elle est ouverte */
    hideModal: function() {
        $("#modal-background").fadeOut();
        $(".modal-box").on("transitionend webkitTransitionEnd", function() {
            $(".modal-box").remove();
        });
        $(".modal-box").removeClass("active");
    },

    /* Ajoute un bouton au post à l'emplacement indiqué en paramètre dans les options (location: "top" (defaut), "right", ou "bottom") */
    addButton: function($msg, buttonOptions) {

        var location = buttonOptions.location || "top";
        delete buttonOptions.location;

        //On récupère ou on crée le conteneur des boutons
        var $buttons = $msg.find(".buttons." + location);
        
        if($buttons.length === 0) {

            $buttons = $("<div>", {
                class: "buttons " + location
            });

            //On place la box .buttons en fonction de l'emplacement
            switch(location) {
                case "top":
                    $msg.find(".pseudo > strong").first().after($buttons);
                    break;
                case "bottom":
                    $msg.find(".ancre").first().append($buttons);
                    break;
                case "right":
                    $msg.find(".date").first().append($buttons);
                    break;
            }

        }

        //On crée le bouton avec les options
        var $button = new SK.Button(buttonOptions);

        $button.hide();
        //TODO: Faire un append avec un positionnement
        $buttons.append($button.fadeIn());

    },

    addCss: function(css) {
        if(typeof GM_addStyle === "function") {
            GM_addStyle(css);
        }
        else {
            $("head").append("<style type='text/css' >" + css + "</style>");
        }
    },

    /* permet de supprimer les caractères spéciaux pour éviter les erreurs de parsing */
    sanitizeXML: function(xmlString) {
        var NOT_SAFE_IN_XML_1_0 = /[^\x09\x0A\x0D\x20-\xFF\x85\xA0-\uD7FF\uE000-\uFDCF\uFDE0-\uFFFD]/gm;
        return xmlString.replace(NOT_SAFE_IN_XML_1_0, "");
    },

    /* Permet de précharger des images */
    preload: function($img) {
        var $preload = $("#preloaded-images");
        if($preload.length === 0) {

            $preload = $("<div>", {
                id: "preloaded-images",
                css: {
                    display: "none"
                }
            });
            $("body").prepend($preload);
        }

        $preload.append($img);
    },

    //Force le navigateur à recalculer le CSS pour les animations
    fetchStyle: function(element) {
            
        if(typeof(window.getComputedStyle) == "function") {

            if(element instanceof jQuery) {
                element = element.get(0);
            }
            /* jshint -W030 */
            window.getComputedStyle(element).left;
        }
    },

    /* Retourne nbspCount espaces insecables */
    _: function(nbspCount) {
        var nbspString = "";
        for(var i = 0; i < nbspCount; i++) {
            nbspString += String.fromCharCode(160);
        }
        return nbspString;
    }
};