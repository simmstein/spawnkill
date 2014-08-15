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

    this.userSettings = {};

    //On récupère le paramètre optin
    this.userSettings.optinEmbed = this.getSetting("optinEmbed");

    //Et les paramètres de chaque type de media pour éviter les appels trop fréquents au localStorage
    this.userSettings.embedVideos = this.getSetting("embedVideos");
    this.userSettings.embedImages = this.getSetting("embedImages");
    this.userSettings.embedRecords = this.getSetting("embedRecords");
    this.userSettings.embedSurveys = this.getSetting("embedSurveys");

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

    //Images
    this.mediaTypes.push(new SK.moduleConstructors.EmbedMedia.MediaType({

        id: "image",
        settingId: "embedImages",

        regex: /^(?:(http:\/\/www\.hapshack\.com\/\?v=)|(http:\/\/www\.noelshack\.com\/([\d]{4})-([\d]{2})-))?(.*.(jpe?g|png|gif))$/,

        addHideButton: true,
        showButtonText: "Afficher les images",
        hideButtonText: "Masquer les images",

        getEmbeddedMedia: function($a, match) {

            var imageLink = match[0];

            //Prise en compte des images Noelshack
            if(typeof match[2] != "undefined") {
                imageLink = "http://image.noelshack.com/fichiers/" + match[3] + "/" + match[4] + "/" + match[5];
            }

            //Prise en compte d'Hapshack
            else if(typeof match[1] != "undefined") {
                imageLink = "http://www.hapshack.com/images/" + match[5];
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

    //Youtube
    this.mediaTypes.push(new SK.moduleConstructors.EmbedMedia.MediaType({

        id: "youtube",
        settingId: "embedVideos",

        // http://stackoverflow.com/questions/3452546/javascript-regex-how-to-get-youtube-video-id-from-url
        /* $1: youtubeId */
        regex: /^https?:\/\/(?:www\.)youtu.*(?:.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,

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

    //Pixule
    this.mediaTypes.push(new SK.moduleConstructors.EmbedMedia.MediaType({

        id: "pixule",
        settingId: "embedSurveys",

        regex: /^http:\/\/www\.pixule\.com\/([\d]*).*$/,

        addHideButton: true,
        showButtonText: "Afficher les sondages Pixule",
        hideButtonText: "Masquer les sondages Pixule",

        getEmbeddedMedia: function($a, match) {

            //On ne remplace pas les sondages dans les citations
            if($a.parents(".quote-message").length > 0) {
                return null;
            }
            else {
                var pixuleId = match[1];
                var sondageLink = "http://www.pixule.com/widget" + pixuleId;

                var $el = $("<iframe>", {
                   src: sondageLink,
                   "data-key": pixuleId,
                   width: 370,
                   height: 365,
                   frameborder: 0,
                   scrolling: "no",
                   allowtransparency: "true",
                });

                return $el;
            }
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
                var sondageWidth = Math.min(400, $a.parents(".post").width() - 5);
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

    //DailyMotion
    this.mediaTypes.push(new SK.moduleConstructors.EmbedMedia.MediaType({

        id: "dailymotion",
        settingId: "embedVideos",

        regex: /^http:\/\/www\.dailymotion\.com\/video\/([^_]*)/,

        addHideButton: true,
        showButtonText: "Afficher les vidéos DailyMotion",
        hideButtonText: "Masquer les vidéos DailyMotion",

        getEmbeddedMedia: function($a, match) {
            var dailymotionId = match[1];
            var dailymotionLink = "http://www.dailymotion.com/embed/video/" + dailymotionId;
            var ratio = 16 / 9;
            var videoWidth = $a.closest(".quote-message, .post").width() - 5;
            var videoHeight = videoWidth / ratio;

            var $el = $("<iframe>", {
               src: dailymotionLink,
               width: videoWidth,
               height: videoHeight,
               allowfullscreen: 1,
               frameborder: 0,
            });

            return $el;
        }

    }));

    //Vimeo
    this.mediaTypes.push(new SK.moduleConstructors.EmbedMedia.MediaType({

        id: "vimeo",
        settingId: "embedVideos",

        regex: /^http:\/\/vimeo.com\/(\d*)/,

        addHideButton: true,
        showButtonText: "Afficher les vidéos Vimeo",
        hideButtonText: "Masquer les vidéos Vimeo",

        getEmbeddedMedia: function($a, match) {
            var vimeoId = match[1];
            var vimeoLink = "http://player.vimeo.com/video/" + vimeoId + "?title=0&byline=0&portrait=0&color=20B9EB";
            var ratio = 16 / 9;
            var videoWidth = $a.closest(".quote-message, .post").width() - 5;
            var videoHeight = videoWidth / ratio;

            var $el = $("<iframe>", {
               src: vimeoLink,
               width: videoWidth,
               height: videoHeight,
               allowfullscreen: 1,
               frameborder: 0,
            });

            return $el;
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
    var addToggleMediaButton = function($msg, mediaType, actionShow) {

        var dataAction = actionShow ? "show" : "hide";
        var tooltipText = actionShow ? mediaType.showButtonText : mediaType.hideButtonText;

        SK.Util.addButton($msg, {
            location: "right",
            "data-media-id": mediaType.id,
            "data-action": dataAction,
            tooltip: {
                text: tooltipText,
                position: "top"
            },
            click: function() {
                var $button = $(this);
                var mediaId = $button.attr("data-media-id");
                var show = $button.attr("data-action") === "show";

                //On change l'état du bouton
                if(show) {
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

                //On enregistre l'état dans le localStorage
                SK.Util.setValue($msg.attr("id") + "." + mediaId +".show", show);

            }
        });
    };
        
    /**
     * Lie un contenu au lien s'il match un type de media
     */
    var queueCheckLinkForMedia = function($msg, $a) {

        self.queueFunction(function() {

            var messageId = $msg.attr("id");

            for(var i in self.mediaTypes) {

                var mediaType = self.mediaTypes[i];

                //On intégre seulement les medias activés
                if(self.userSettings[mediaType.settingId]) {

                    var matchMedia = $a.attr("href").match(mediaType.regex);

                    // Vrai si le media doit être affiché au chargement, on récupère les infos dans le localStorage
                    var showMedia = SK.Util.getValue(messageId + "." + mediaType.id +".show");

                    if(showMedia === null) {
                        showMedia = !self.userSettings.optinEmbed;
                    }

                    if (matchMedia) {
                        
                        //On remplace le lien par l'élément du media
                        var $mediaElement = mediaType.getEmbeddedMedia($a, matchMedia);

                        if($mediaElement !== null) {

                            $a.after($mediaElement);
                            $mediaElement.addClass(mediaType.id + "-media-element");
                            $a.addClass(mediaType.id + "-media-link");

                            if(showMedia) {
                                $a.hide();
                            }
                            else {
                                $mediaElement.hide();
                            }

                            //Si besoin, on ajoute une seule fois  un bouton pour masquer/afficher le media
                            if(mediaType.addHideButton && $msg.find("[data-media-id='" + mediaType.id + "']").length === 0) {
                                addToggleMediaButton($msg, mediaType, !showMedia);
                            }
                        }

                        break;
                    }
                }
            }

        }, this);

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

            //Et on cherche chaque type de media
            queueCheckLinkForMedia($msg, $(a));
            
        });
    });
};

SK.moduleConstructors.EmbedMedia.prototype.shouldBeActivated = function() {
    return window.location.href.match(/http:\/\/www\.jeuxvideo\.com\/forums\/(1|3)/);
};

SK.moduleConstructors.EmbedMedia.prototype.settings = {
    optinEmbed: {
        title: "Masquer par défaut",
        description: "Cache le contenu par défaut, il faut d'abord clicker sur le bouton pour le faire apparaître.",
        default: false,
    },
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
        [data-media-id='image'] {\
            background-color: #FFB82B;\
            border-bottom-color: #C48B21;\
            background-image: url('" + GM_getResourceURL("image") + "');\
            background-position: 0px -1px;\
        }\
        [data-media-id='youtube'] {\
            background-color: #E62117;\
            border-bottom-color: #9B140F;\
            background-image: url('" + GM_getResourceURL("youtube") + "');\
            background-position: 0px -1px;\
        }\
        [data-media-id='vimeo'] {\
            background-color: #20B9EB;\
            border-bottom-color: #167E9E;\
            background-image: url('" + GM_getResourceURL("vimeo") + "');\
            background-position: 0px -1px;\
        }\
        [data-media-id='dailymotion'] {\
            background-color: #0072AF;\
            border-bottom-color: #002438;\
            background-image: url('" + GM_getResourceURL("dailymotion") + "');\
            background-position: 0px -1px;\
        }\
        [data-media-id='pixule'] {\
            background-color: #B9E04E;\
            border-bottom-color: #809B36;\
            background-image: url('" + GM_getResourceURL("sondageio") + "');\
            background-position: 0px 0px;\
        }\
        [data-media-id='vocaroo'] {\
            background-color: #B1DB69;\
            border-bottom-color: #789346;\
            background-image: url('" + GM_getResourceURL("vocaroo") + "');\
            background-position: 0px -1px;\
        }\
        [data-media-id='sondageio'] {\
            background-color: #FF7B3B;\
            border-bottom: solid 2px #BC3800;\
            background-image: url('" + GM_getResourceURL("sondageio") + "');\
            background-position: 0px 0px;\
        }\
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
        .youtube-media-element,\
        .vimeo-media-element,\
        .dailymotion-media-element {\
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