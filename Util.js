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

    /**
     * Wrapper de l'API JVC permettant de faire des requpetes simplifiées via un serveur distant.
     * requestAction (string) : Type de requête à exécuter : "pseudos" ou "topic"
     * data (mix) : données de la requête
     *    pseudos : [ "pseudo1",  "pseudo2", "pseudo3"]
     *    topic : la chaine d'id du topic. Ce qui est entre paraenthèses dans l'url suivante :
     *       http://www.jeuxvideo.com/forums/1-(51-65175198)-7-0-1-0-script-jvc-spawnkill-avant-respawn.htm
     * callback : fonction appelée avec un objet jQuery contenant les infos récupérées
     */
    api: function(requestAction, data, callback) {

        var url = "http://dl.spixel.fr/greasemonkey/jvc-spawnkill/server/api-jvc.php?action=" + requestAction + "&data=" + encodeURIComponent(JSON.stringify(data));

        GM_xmlhttpRequest({
            url: url,
            method: "GET",
            onload: function(response) {
                callback($($.parseXML(SK.Util.sanitizeXML(response.responseText))));
            }
        });
    },

    /**
     * Retourne vrai si l'utilisateur est sur l'une des pages passée en paramètre.
     * pages (array<string>) : Liste des pages ("topic-list", "topic-read", "topic-form" ou "topic-response")
     */
    currentPageIn: function(pages) {
        var regex = "http:\\/\\/www\\.jeuxvideo\\.com\\/forums\\/";

        for(var i in pages) {
            switch(pages[i]) {
                case "topic-list" :
                    pages[i] = 0;
                    break;
                case "topic-read" :
                    pages[i] = 1;
                    break;
                case "topic-form" :
                    pages[i] = 2;
                    break;
                case "topic-response" :
                    pages[i] = 3;
                    break;
            }
        }

        regex += "(" + pages.join("|") +")";
        
        return window.location.href.match(regex);
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

    /**
     * Ajoute un bouton au post à l'emplacement indiqué en paramètre
     * dans les options 
     *    location: "top" (defaut), "right", ou "bottom"
     *    index (int): position du bouton (de gauche à droite).
     */
    addButton: function($msg, buttonOptions) {

        var location = buttonOptions.location || "top";
        delete buttonOptions.location;
        var index = buttonOptions.index || 0;
        delete buttonOptions.index;

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
                    //Si le li .ancre n'existe pas, on la crée
                    var $ancre = $msg.find(".ancre").first();

                    if($ancre.length === 0) {
                        $ancre = $("<li>", {
                            class: "ancre"
                        });
                        $msg.find(".post").after($ancre);
                    }

                    $ancre.append($buttons);
                    break;
                case "right":
                    $msg.find(".date").first().append($buttons);
                    break;
            }

        }

        //On crée le bouton avec les options
        var $button = new SK.Button(buttonOptions);

        $button.hide()
               .attr("data-index", index);

        //On append le bouton à l'index choisi
        var $existingButtons = $buttons.find(".sk-button");

        if($existingButtons.length === 0) {
            $buttons.append($button.fadeIn());
        }
        else {
            $existingButtons.each(function() {
                var $existingButton = $(this);
                var buttonIndex = parseInt($existingButton.attr("data-index"));
                if(buttonIndex <= index) {
                    $existingButton.after($button.fadeIn());
                }
                else {
                    $existingButton.before($button.fadeIn());
                }
            });
        }


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

    setValue: function(key, value) {
        key = "SK." + key;
        localStorage.setItem(key, JSON.stringify(value));
    },

    /* Retourne null si la donnée n'existe pas */
    getValue: function(key) {
        key = "SK." + key;
        return JSON.parse(localStorage.getItem(key));
    },

    deleteValue: function(key) {
        key = "SK." + key;
        localStorage.removeItem(key);
    },

    /* Retourne nbspCount espaces insecables */
    _: function(nbspCount) {
        var nbspString = "";
        for(var i = 0; i < nbspCount; i++) {
            nbspString += String.fromCharCode(160);
        }
        return nbspString;
    },

    /** Dispatch un evenement sur <body> */
    dispatch: function(eventName) {
        $("body").get(0).dispatchEvent(new Event(eventName));
    },

    /** Bind une fonction à un événement si la condition est vraie, sinon exécute la fonction */
    bindOrExecute: function(condition, event, fn) {
        if(condition) {
            $("body").on(event, fn);
        }
        else {
           fn();
        }
    }

};