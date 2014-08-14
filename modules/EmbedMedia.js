"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * EmbedMedia : Remplace les liens vers une vidéo YouTube par la vidéo elle-même.
 */
SK.moduleConstructors.EmbedMedia = SK.Module.new();

SK.moduleConstructors.EmbedMedia.prototype.id = "EmbedMedia";
SK.moduleConstructors.EmbedMedia.prototype.title = "Intégration de contenus";
SK.moduleConstructors.EmbedMedia.prototype.description = "Remplace les liens vers les images, vidéos, sondages ou vocaroo par le contenu lui-même.";

SK.moduleConstructors.EmbedMedia.prototype.init = function() {
    this.initMediaTypes();

    //Si htmlQuote est activé, on a besoin que les citations soient chargées pour calculer la taille des vidéos
    var mustWaitQuote = SK.modules.Quote.activated && SK.modules.Quote.getSetting("htmlQuote");
    SK.Util.bindOrExecute(mustWaitQuote, "htmlQuoteLoaded", function() {
        this.embedMedia();
    }.bind(this));

};

/* options : {
    id: nom du type de media
    regex: regex de reconnaissance du lien
    addHideButton: si vrai, un bouton pour cacher le media sera affiché
    hideButtonText: texte au survol du bouton de masquage
    showButtonText: texte au survol du bouton d'affichage
    settingId: id du paramètre gérant le media
    getEmbeddedMedia: callback appelé avec getEmbeddedMedia($a, link.match(regex)), retourne l'élément jQuery qui remplace le lien
}*/
SK.moduleConstructors.EmbedMedia.MediaType = function(options) {
    this.id = options.id;
    this.regex = options.regex;
    this.addHideButton = options.addHideButton;
    this.hideButtonText = options.hideButtonText;
    this.showButtonText = options.showButtonText;
    this.settingId = options.settingId;
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

    //Youtube
    this.mediaTypes.push(new SK.moduleConstructors.EmbedMedia.MediaType({

        id: "youtube",
        settingId: "embedVideos",

        // http://stackoverflow.com/questions/3452546/javascript-regex-how-to-get-youtube-video-id-from-url
        /* $1: youtubeId */
        regex: /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,

        addHideButton: true,
        showButtonText: "Afficher les vidéos Youtube",
        hideButtonText: "Masquer les vidéos Youtube",

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
                var ratio = 16 / 9;
                var videoWidth = $a.closest(".quote-message, .post").width() - 5;
                var videoHeight = videoWidth / ratio;

                var $el = $("<iframe>", {
                   src: youtubeLink,
                   width: videoWidth,
                   height: videoHeight,
                   allowfullscreen: 1,
                   frameborder: 0,
                });

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

    //Images
    this.mediaTypes.push(new SK.moduleConstructors.EmbedMedia.MediaType({

        id: "image",
        settingId: "embedImages",

        regex: /^(http:\/\/www\.noelshack\.com\/([\d]{4})-([\d]{2})-)?(.*.(jpe?g|png|gif))$/,

        addHideButton: true,
        showButtonText: "Afficher les images",
        hideButtonText: "Masquer les images",

        getEmbeddedMedia: function($a, match) {

            var imageLink = match[0];

            //Prise en compte des images Noelshack
            if(typeof match[1] != "undefined") {
                imageLink = "http://image.noelshack.com/fichiers/" + match[2] + "/" + match[3] + "/" + match[4];
            }
            var $el = $("<a>", {
                href: imageLink,
                target: "_blank"
            });

            $el.html($("<img>", {
                src: imageLink
            }));

            return $el;
        }

    }));

    //Vocaroo
    this.mediaTypes.push(new SK.moduleConstructors.EmbedMedia.MediaType({

        id: "vocaroo",
        settingId: "embedRecords",

        regex: /^http:\/\/vocaroo\.com\/i\/(.*)$/,

        addHideButton: true,
        showButtonText: "Afficher les Vocaroos",
        hideButtonText: "Masquer les Vocaroos",

        getEmbeddedMedia: function($a, match) {

            var vocarooId = match[1];
            var $el = $("\
                <object width='148' height='44'>\
                    <param name='movie' value='http://vocaroo.com/player.swf?playMediaID=" + vocarooId + "&autoplay=0'></param>\
                    <param name='wmode' value='transparent'></param>\
                    <embed src='http://vocaroo.com/player.swf?playMediaID=" + vocarooId + "&autoplay=0' width='148' height='44'\
                        wmode='transparent' type='application/x-shockwave-flash'>\
                    </embed>\
                </object>\
            ");
            return $el;
        }

    }));

    //Sondage.io
    this.mediaTypes.push(new SK.moduleConstructors.EmbedMedia.MediaType({

        id: "sondageio",
        settingId: "embedSurveys",

        regex: /^http:\/\/sondage\.io\/([\d]*).*$/,

        addHideButton: true,
        showButtonText: "Afficher les sondages Sondage.io",
        hideButtonText: "Masquer les sondages Sondage.io",

        getEmbeddedMedia: function($a, match) {


            //On ne remplace pas les sondages dans les citations
            if($a.parents(".quote-message").length > 0) {
                return null;
            }
            else {
                var sondageLink = match[0];
                var sondageWidth = $a.parents(".post").width() - 5;
                var sondageHeight = 300;

                var $el = $("<iframe>", {
                   src: sondageLink,
                   width: sondageWidth,
                   height: sondageHeight,
                   frameborder: 0,
                });

                return $el;
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

                //On intégre seulement les medias activés
                if(self.getSetting(mediaType.settingId)) {

                    var matchMedia = $a.attr("href").match(mediaType.regex);

                    if (matchMedia) {
                        
                        //On remplace le lien par l'élément du media
                        var $mediaElement = mediaType.getEmbeddedMedia($a, matchMedia);

                        if($mediaElement !== null) {

                            $a.after($mediaElement);
                            $mediaElement.addClass(mediaType.id + "-media-element");
                            $a.addClass(mediaType.id + "-media-link");
                            $a.hide();

                            //Si besoin, on ajouteune seule fois  un bouton pour masquer/afficher le media
                            if(mediaType.addHideButton && $msg.find("[data-media-id='" + mediaType.id + "']").length === 0) {
                                addToggleMediaButton($msg, mediaType);
                            }
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

SK.moduleConstructors.EmbedMedia.prototype.settings = {
    embedVideos: {
        title: "Intégration des vidéos",
        description: "Intégre les vidéos Youtube, DailyMotion et Vimeo aux posts.",
        default: true,
    },
    embedImages: {
        title: "Intégration des images",
        description: "Intégre les images PNG, JPG et GIF aux posts.",
        default: true,
    },
    embedSurveys: {
        title: "Intégration des sondages",
        description: "Intégre les sondages Pixule et Sondage.io aux posts.",
        default: true,
    },
    embedRecords: {
        title: "Intégration des Vocaroos",
        description: "Intégre les enregistrement Vocaroo aux posts.",
        default: true,
    }
};

SK.moduleConstructors.EmbedMedia.prototype.getCss = function() {
    var css = "\
        .sk-button-content[data-action=show] {\
            background-color: #A3A3A3;\
            border-bottom-color: #525252;\
        }\
        .sondageio-media-element {\
            margin: 5px;\
            margin-left: 0px;\
            border: solid 1px #CCC;\
            border-radius: 5px;\
        }\
        .youtube-media-element {\
            margin: 5px;\
            margin-left: 0px;\
        }\
        .image-media-element {\
            display: block;\
            width: calc(100% - 5px);\
            margin: 5px;\
            margin-left: 0px;\
        }\
        .image-media-element img {\
            max-width: 100%;\
        }\
    ";

    return css;
};