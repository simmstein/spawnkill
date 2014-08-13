"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * EmbedMedia : Remplace les liens vers une vidéo YouTube par la vidéo elle-même.
 */
SK.moduleConstructors.EmbedMedia = SK.Module.new();

SK.moduleConstructors.EmbedMedia.prototype.title = "Intégration de contenus";
SK.moduleConstructors.EmbedMedia.prototype.description = "Remplace les liens vers les images, vidéos, sondages ou vocaroo par le contenu lui-même.";

SK.moduleConstructors.EmbedMedia.prototype.init = function() {
    this.initMediaTypes();
    this.embedMedia();
};

/* options : {
    id: nom du type de media
    regex: regex de reconnaissance du lien
    getEmbeddedMedia: callback appelé avec getEmbeddedMedia($a, link.match(regex)), retourne l'élément jQuery qui remplace le lien
    addHideButton: si vrai, un bouton pour cacher le media sera affiché
}*/
SK.moduleConstructors.EmbedMedia.MediaType = function(options) {
    this.id = options.id;
    this.regex = options.regex;
    this.addHideButton = options.addHideButton;
    this.hideButtonText = options.hideButtonText;
    this.showButtonText = options.showButtonText;
    this.getEmbeddedMedia = options.getEmbeddedMedia;
};

/**
 * Tous les types de media pris en compte par le plugin
 */
SK.moduleConstructors.EmbedMedia.prototype.mediaTypes = [];

/**
 * Prépare les styles de media supportés
 */
SK.moduleConstructors.EmbedMedia.prototype.initMediaTypes = function() {

    this.mediaTypes.push(new SK.moduleConstructors.EmbedMedia.MediaType({

        id: "youtube",
        // http://stackoverflow.com/questions/3452546/javascript-regex-how-to-get-youtube-video-id-from-url
        /* $1: youtubeId */
        regex: /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,

        addHideButton: true,
        showButtonText: "Afficher les videos Youtube de ce post",
        hideButtonText: "Masquer les videos Youtube de ce post",

        getEmbeddedMedia: function($a, match) {

            /**
             * Retourne une version "embed" du lien, sinon null.
             */
            var getEmbedUrl = function(youtubeId) {
                return "http://www.youtube.com/embed/" + youtubeId;
            };

            /**
             * Fonction qui crée l'élément à intégrer à la page.
             */
            var createVideoElement = function (youtubeLink) {
                var $el = $("<iframe>");
                var ratio = 16 / 9;
                var videoWidth = $(".msg .post").width() - 10;
                var videoHeight = videoWidth / ratio;

                $el.attr("src", youtubeLink)
                   .attr("width", videoWidth)
                   .attr("height", videoHeight)
                   .attr("allowfullscreen", 1)
                   .attr("frameborder", 0)
                   .css("margin", "5px");
                return $el;
            };

            if (match[1].length === 11) {
                var youtubeLink = getEmbedUrl(match[1]);
                return createVideoElement(youtubeLink);
            }
            else {
                return null;
            }
        }

    }));

};

/**
 * Parcourt tous les liens des posts à la recherche de contenu à intégrer.
 */
SK.moduleConstructors.EmbedMedia.prototype.embedMedia = function() {

    var self = this;
    
    /**
     * Fonction qui ajoute le bouton afficher/masquer les media d'un post.
     */
    var addToggleMediaButton = function($msg, mediaType) {

        SK.Util.addButton($msg, {
            location: "right",
            "data-media-id": mediaType.id,
            "data-action": "hide",
            tooltip: {
                text: mediaType.hideButtonText,
                position: "top"
            },
            click: function() {
                var $button = $(this);
                var mediaId = $button.attr("data-media-id");

                //On change l'état du bouton
                if($button.attr("data-action") === "show") {
                    $button.attr("data-action", "hide")
                           .siblings(".tooltip").html(mediaType.hideButtonText);
                }
                else {
                    $button.attr("data-action", "show")
                           .siblings(".tooltip").html(mediaType.showButtonText);
                }

                //On affiche/cache les medias
                $msg.find("." + mediaId + "-media-element").toggle();
                $msg.find("." + mediaId + "-media-link").toggle();

            }
        });
    };
        
        
    /**
     * Parcourt des posts à la recherche de medias à intégrer,
     * remplacement des liens pas l'intégration du media correspondant
     *  et ajout d'un bouton masquer/afficher au post si nécessaire.
     */
    $(".msg").each(function(id, msg) {
        var $msg = $(msg);

        //On parcourt tous les liens du post
        $msg.find(".post a").each(function(id, a) {

            var $a = $(a);

            //Et on cherche chaque type de media
            for(var i in self.mediaTypes) {
                var mediaType = self.mediaTypes[i];

                var matchMedia = $a.attr("href").match(mediaType.regex);

                if (matchMedia) {
                    
                    //On remplace le lien par l'élément du media
                    var $mediaElement = mediaType.getEmbeddedMedia($a, matchMedia);

                    if($mediaElement !== null) {

                        $a.after($mediaElement);
                        $mediaElement.addClass(mediaType.id + "-media-element");
                        $a.addClass(mediaType.id + "-media-link");
                        $a.hide();

                        //Si besoin, on ajoute un bouton pour maquer/afficher le media
                        if(mediaType.addHideButton) {
                            addToggleMediaButton($msg, mediaType);
                        }
                    }
                }
            }
        });
    });
};

SK.moduleConstructors.EmbedMedia.prototype.shouldBeActivated = function() {
    return window.location.href.match(/http:\/\/www\.jeuxvideo\.com\/forums\/(1|3)/);
};

SK.moduleConstructors.EmbedMedia.prototype.getCss = function() {
    var css = "\
        .sk-button-content[data-action=show] {\
            background-color: #A3A3A3;\
            border-bottom-color: #525252;\
        }\
    ";

    return css;
};