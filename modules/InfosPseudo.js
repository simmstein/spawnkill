"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/*
- TODO
- Ne pas récupérer plusieurs fois les données d'une même personne
*/
SK.moduleConstructors.InfosPseudo = SK.Module.new();

SK.moduleConstructors.InfosPseudo.prototype.title = "Avatars et autres infos";
SK.moduleConstructors.InfosPseudo.prototype.description = "Affiche les avatars des membres à gauche des posts ainsi que leur rangs et leur sexe. Ajoute aussi des boutons pour envoyer un MP ou copier le lien permanent.";

/* Taille des avatars en pixels */
SK.moduleConstructors.InfosPseudo.prototype.avatarSize = 60;

SK.moduleConstructors.InfosPseudo.prototype.init = function() {
    this.addPostInfos();
};

/** Ajoute les infos à tous les posts */
SK.moduleConstructors.InfosPseudo.prototype.addPostInfos = function() {

    var self = this;

    //:not(.lecture_msg) evite les MP
    if($("#col1:not(.lecture_msg) .msg").length > 0) {

        //Auteurs dont on n'a pas les données
        var toLoadAuthors = [];
        var toLoadAuthorPseudos = [];

        //Auteurs sur la page
        var authors = {};
        
        //On parcourt tous les messages
        $(".msg .pseudo").each(function() {

            var $msg = $(this).parents(".msg").first();
            
            //On crée le Message
            var message = new SK.Message($msg);

            if(self.getSetting("enableAvatar")) {

                self.addAvatarPlaceholder(message);
            }

            //On crée l'auteur correspondant
            if(typeof authors[message.authorPseudo] === "undefined") {
                authors[message.authorPseudo] = new SK.Author(message.authorPseudo);
                authors[message.authorPseudo].loadLocalData();
            }
            var author = authors[message.authorPseudo];
            author.addMessage(message);


            //Et on l'ajoute au message
            message.setAuthor(author);


            //On affiche les données des auteurs qu'on a en localStorage
            if(author.hasLocalData) {
                self.showMessageInfos(message);
            }
            else {

                //On conserve les auteurs dont on n'a pas les données
                if(toLoadAuthorPseudos.indexOf(message.authorPseudo) === -1) {
                    toLoadAuthors.push(author);
                    toLoadAuthorPseudos.push(message.authorPseudo);
                }
            }

        });

        //On récupère les infos des auteurs périmées ou qu'on n'a pas encore dans le localStorage
        if(toLoadAuthorPseudos.length > 0) {
            SK.Util.jvcs(toLoadAuthorPseudos, function($jvcs) {
                $jvcs.find("author").each(function() {
                    var pseudo = $(this).attr("pseudo");
                    var $cdv = $(this).find("cdv");
                    var author = authors[pseudo];
                    author.initFromCdv($cdv);
                    //On enregistre les données dans le localStorage
                    author.saveLocalData();

                    for(var message in author.messages) {
                        self.showMessageInfos(author.messages[message]);
                    }
                });
            });
        }
    }
};

/** Affiche les infos du post et de l'auteur au message */
SK.moduleConstructors.InfosPseudo.prototype.showMessageInfos = function(message) {

    var self = this;
    SK.Util.queue.add(function() {
        if(self.getSetting("enableAvatar")) {
            self.addAvatar(message);
        }
        if(self.getSetting("enableRank")) {
            self.addRank(message);
        }
        self.addPostButtons(message);
    }, this);
};


/** Ajoute les différents boutons et remplace ceux par défaut */
SK.moduleConstructors.InfosPseudo.prototype.addPostButtons = function(message) {

    var permalink = message.permalink;
    var avertirUrl = message.alertUrl;
    var profileUrl = "http://www.jeuxvideo.com/profil/" + message.authorPseudo + ".html";
    var mpUrl = "http://www.jeuxvideo.com/messages-prives/nouveau.php?all_dest=" + message.authorPseudo;

    //Bouton CDV
    SK.Util.addButton(message, {
        class: (message.author.gender && this.getSetting("enableSex")) ? message.author.gender : "unknown",
        href: profileUrl,
        tooltip: {
            text: "Voir la carte de visite"
        },
        click: function(event) {
            event.preventDefault();
            window.open(profileUrl, "profil", "width=800,height=570,scrollbars=no,status=no");
        }
    });

    //Bouton Avertir
    if(this.getSetting("enableAlert")) {
        SK.Util.addButton(message, {
            class: "alert",
            location: "right",
            href: avertirUrl,
            tooltip: {
                text: "Avertir un administrateur"
            },
            click: function(event) {
                event.preventDefault();
                window.open(avertirUrl, "avertir", "width=700,height=470,scrollbars=no,status=no");
            }
        });
    }

    //Bouton MP
    if(this.getSetting("enableMP")) {
        SK.Util.addButton(message, {
            class: "mp",
            href: mpUrl,
            tooltip: {
                text: "Envoyer un MP"
            },
            click: function(event) {
                event.preventDefault();
                var win = window.open(mpUrl, "_blank");
                win.focus();
            }
        });
    }

    //Bouton permalien
    if(this.getSetting("enablePermalink")) {
        SK.Util.addButton(message, {
            class: "link",
            location: "bottom",
            href: permalink,
            tooltip: {
                text: "Copier le permalien"
            },
            click: function(event) {
                event.preventDefault();
                GM_setClipboard(permalink);
            }
        });
    }

    //Supprimer boutons par défaut
    message.$msg.find("[target='avertir'], .ancre > a:first, [target='profil']").remove();
};

/** Préparer une place pour l'avatar de l'auteur */
SK.moduleConstructors.InfosPseudo.prototype.addAvatarPlaceholder = function(message) {

    //On ajoute déjà le wrapper de l'avatar
    var $avatarWrapper = $("<div />", {
        class: "avatar-wrapper",
    });

    //Lien vers la CDV
    var $avatar = $("<a />", {
        class: "avatar"
    });

    $avatarWrapper.append($avatar);
    message.$msg.append($avatarWrapper);
};

/* Ajoute le rang de l'auteur */
SK.moduleConstructors.InfosPseudo.prototype.addRank = function(message) {

    if(message.author.rank !== "") {

        var rankString = "Rang " + message.author.rank.charAt(0).toUpperCase() + message.author.rank.slice(1);

        if(this.getSetting("enableAvatar")) {
            
            var $rank = $("<span />", {
                class: "rank " + message.author.rank,
                title: rankString
            });
            var $avatarWrapper = message.$msg.find(".avatar-wrapper");
            $avatarWrapper.append($rank.hide().fadeIn());
        }
        else {
            SK.Util.addButton(message.$msg, {
                class: "rank " + message.author.rank,
                tooltip: {
                    text: rankString
                }
            });
        }

    }
};

/** Remplace le loader de l'avatar du post par l'image de l'auteur */
SK.moduleConstructors.InfosPseudo.prototype.addAvatar = function(message) {

    var $avatarWrapper = message.$msg.find(".avatar-wrapper");
    var $avatar = $avatarWrapper.find(".avatar");

    //Si l'auteur est banni
    if(message.author.ban) {

        //L'utilisateur est sûrement banni
        message.author.avatar = GM_getResourceURL("banImage");
        $avatar.addClass("ban");
        message.$msg.addClass("not-loading");
    }

    var $avatarImg = $("<img />", {
        title: message.authorPseudo,
        alt: message.authorPseudo
    });

    $avatarImg.hide();

    $avatarImg.on("load", function() {
        $avatar
            .attr("href", message.author.profileLink)
            .append($avatarImg);
        $avatarImg.fadeIn(function() {
            message.$msg.addClass("not-loading");
        });
        this.calculateAvatarDimensions($avatarImg);
    }.bind(this));

    //On met seulement src pour que l'event onload soit en place avant
    $avatarImg.attr("src", message.author.avatar); 

    //Permet de régler les problèmes de cache sur certains navigateurs
    if(this.complete) {
        $(this).trigger("load");  
    }
};

/** Calcule et redimensionne (en CSS) l'avatar passé en parametre */
SK.moduleConstructors.InfosPseudo.prototype.calculateAvatarDimensions = function($avatarImg) {

    var imageDimensions = {
        w: $avatarImg.width(),
        h: $avatarImg.height()
    };

    if(imageDimensions.h > imageDimensions.w) {
        $avatarImg.css({
            width: this.avatarSize + "px",
        });
    }
    else {
        $avatarImg.css({
            height: this.avatarSize + "px",
        });

        //On execute l'opération en deux fois, car les dimensions changent dynamiquement
        $avatarImg.css({
            left: (this.avatarSize - $avatarImg.width()) / 2
        });
    }
};

SK.moduleConstructors.InfosPseudo.prototype.shouldBeActivated = function() {
    return (window.location.href.match(/http:\/\/www\.jeuxvideo\.com\/forums\/(1|3)/));
};

/* Options modifiables du plugin */ 
SK.moduleConstructors.InfosPseudo.prototype.settings = {
    enableAvatar: {
        title: "Affichage des avatars",
        description: "Affiche les avatars à gauche des posts à la lecture d'un topic.",
        default: true,
    },
    enableRank: {
        title: "Affichage des rangs",
        description: "Affiche le rang de l'auteur sur les posts à la lecture d'un topic.",
        default: true,
    },
    enableMP: {
        title: "Bouton de MP",
        description: "Permet d'envoyer un MP à un utilisateur directement depuis un post.",
        default: true,
    },
    enableSex: {
        title: "Affichage du sexe de l'auteur",
        description: "Affiche une photo de la... Hmm...Pardon. Change le style du bouton de CDV d'un auteur en fonction de son sexe.",
        default: true,
    },
    enablePermalink: {
        title: "Bouton Permalien",
        description: "Ajoute un bouton permettant de copier directement le permalien d'un post.",
        default: true,
    },
    enableAlert: {
        title: "Bouton d'avertissement",
        description: "Ajoute un bouton permettant d'avertir un adminstrateur.",
        default: true,
    }
};

SK.moduleConstructors.InfosPseudo.prototype.getCss = function() {

    var css = "";

    //Seulement si les avatars sont affichés
    if(this.getSetting("enableAvatar")) {
        css += "\
            .msg ul {\
                margin-left: 78px;\
            }\
            .msg ul li.suite_sujet {\
                margin-left: -78px;\
            }\
            .msg {\
                min-height: 78px;\
            }\
            .msg .avatar-wrapper {\
                display: block;\
                position: absolute;\
                    left: 9px;\
                    top: 9px;\
                width: 60px;\
                height: 60px;\
            }\
            .msg .avatar {\
                position: relative;\
                display: block;\
                width: 100%;\
                height: 100%;\
                overflow: hidden;\
                box-shadow: 0px 2px 3px -2px rgba(0, 0, 0, 0.8);\
                cursor: pointer;\
                z-index: 100;\
            }\
            .msg:not(.not-loading)::after {\
                content: \"\";\
                display: block;\
                width: 60px;\
                height: 60px;\
                position: absolute;\
                    top: 9px;\
                    left: 9px;\
                background-color: #FFF;\
                box-shadow: 0px 2px 3px -2px rgba(0, 0, 0, 0.8);\
                background-image: url('" + GM_getResourceURL("loader") + "');\
                background-repeat: no-repeat;\
                background-position: 22px;\
                z-index: 10;\
            }\
            .msg .avatar.ban {\
                box-shadow: none;\
            }\
            .msg .avatar img {\
                position: relative;\
            }\
            .rank {\
                position: absolute;\
                    bottom: 0px;\
                    right: 0px;\
                display: block;\
                width: 16px;\
                height: 16px;\
                background-repeat: no-repeat;\
            }\
            .rank.argent {\
                background-image: url('" + GM_getResourceURL("argent") + "');\
                background-color: #A7A9AC;\
            }\
            .rank.carton {\
                background-image: url('" + GM_getResourceURL("carton") + "');\
                background-color: #C49A6C;\
            }\
            .rank.bronze {\
                background-image: url('" + GM_getResourceURL("bronze") + "');\
                background-color: #C57E16;\
            }\
            .rank.diamant {\
                background-image: url('" + GM_getResourceURL("diamant") + "');\
                background-color: #27AAE1;\
            }\
            .rank.emeraude {\
                background-image: url('" + GM_getResourceURL("emeraude") + "');\
                background-color: #39B54A;\
            }\
            .rank.or {\
                background-image: url('" + GM_getResourceURL("or") + "');\
                background-color: #DBB71D;\
            }\
            .rank.rubis {\
                background-image: url('" + GM_getResourceURL("rubis") + "');\
                background-color: #BE1E2D;\
            }\
            .rank.saphir {\
                background-image: url('" + GM_getResourceURL("saphir") + "');\
                background-color: #4D57BC;\
            }\
        ";
    }

    css += "\
        .msg [src='http://image.jeuxvideo.com/pics/forums/bt_forum_profil.gif'],\
        .msg [alt='Avertir un administrateur'],\
        .ancre > a:first-child {\
          display: none !important;\
        }\
        .msg {\
            position: relative;\
        }\
        .msg li.ancre {\
            min-height: 15px;\
        }\
        .sk-button-content.mp {\
            background-image: url('" + GM_getResourceURL("mp") + "');\
            background-color: #FCCB0C;\
            border-bottom-color: #C6860F;\
        }\
        .sk-button-content.minus {\
            background-image: url('" + GM_getResourceURL("minus") + "');\
        }\
        .sk-button-content.plus {\
            background-image: url('" + GM_getResourceURL("plus") + "');\
        }\
        .sk-button-content.link {\
            background-image: url('" + GM_getResourceURL("link") + "');\
            background-color: #A3A3A3;\
            border-bottom-color: #525252;\
        }\
        .sk-button-content.male {\
            background-image: url('" + GM_getResourceURL("male") + "');\
            background-color: #348DCC;\
            border-bottom-color: #1C4F72;\
        }\
        .sk-button-content.female {\
            background-image: url('" + GM_getResourceURL("female") + "');\
            background-position: -1px -1px;\
            background-color: #D674AE;\
            border-bottom-color: #A44C80;\
        }\
        .sk-button-content.unknown {\
            background-image: url('" + GM_getResourceURL("unknown") + "');\
            background-position: 0px -1px;\
            background-color: #6EBD1A;\
            border-bottom-color: #4D8412;\
        }\
        .sk-button-content.alert {\
            background-image: url('" + GM_getResourceURL("alert") + "');\
            background-color: #FE2711;\
            border-bottom-color: #A0170B;\
        }\
        .sk-button-content.rank {\
            border: none !important;\
            height: 15px !important;\
            cursor: default;\
        }\
        .sk-button-content.rank:active {\
            margin-top: 0px !important;\
            border-bottom: none !important;\
        }\
        .sk-button-content.rank.argent {\
            background-image: url('" + GM_getResourceURL("argent") + "');\
            background-color: #A7A9AC;\
        }\
        .sk-button-content.rank.carton {\
            background-image: url('" + GM_getResourceURL("carton") + "');\
            background-color: #C49A6C;\
        }\
        .sk-button-content.rank.bronze {\
            background-image: url('" + GM_getResourceURL("bronze") + "');\
            background-color: #C57E16;\
        }\
        .sk-button-content.rank.diamant {\
            background-image: url('" + GM_getResourceURL("diamant") + "');\
            background-color: #27AAE1;\
        }\
        .sk-button-content.rank.emeraude {\
            background-image: url('" + GM_getResourceURL("emeraude") + "');\
            background-color: #39B54A;\
        }\
        .sk-button-content.rank.or {\
            background-image: url('" + GM_getResourceURL("or") + "');\
            background-color: #DBB71D;\
        }\
        .sk-button-content.rank.rubis {\
            background-image: url('" + GM_getResourceURL("rubis") + "');\
            background-color: #BE1E2D;\
        }\
        .sk-button-content.rank.saphir {\
            background-image: url('" + GM_getResourceURL("saphir") + "');\
            background-color: #4D57BC;\
        }\
    ";

    return css;

};