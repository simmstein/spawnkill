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

    //Evite les MP
    if($("#col1:not(.lecture_msg) .msg").length > 0) {

        //On parcourt tous les messages
        $(".msg .pseudo").each(function() {

            var $msg = $(this).parents(".msg").first();
            
            //Crée l'auteur                
            var author = new SK.Author($msg);

            if(self.getSetting("enableAvatar")) {
                self.addAvatarPlaceholder($msg);
            }

            //Appelée quand la récupération des  données de l'auteur est terminée
            author.addListener(function() {
                if(self.getSetting("enableAvatar")) {
                    self.addAvatar(author);
                }
                if(self.getSetting("enableRank")) {
                    self.addRank(author);
                }
                self.addPostButtons(author);
            });

            //Lance la requête sur l'API
            author.init();

        });
    }
};

/** Ajoute les différents boutons et remplace ceux par défaut */
SK.moduleConstructors.InfosPseudo.prototype.addPostButtons = function(author) {

    var permalink = author.$msg.find(".ancre a").first().attr("href");
    var avertirUrl = author.$msg.find("[target=avertir]").first().attr("href");
    var profileUrl = "http://www.jeuxvideo.com/profil/" + author.pseudo + ".html";
    var mpUrl = "http://www.jeuxvideo.com/messages-prives/nouveau.php?all_dest=" + author.pseudo;

    // <a  target="avertir" rel="nofollow" title="Avertir un administrateur" href="http://www.jeuxvideo.com/cgi-bin/jvforums/avertir_moderateur.cgi?mode=1&amp;forum=36&amp;topic=22319326&amp;hash_mdr=0&amp;numero=22333737&amp;page=4&amp;t=1406898519&amp;k=3b25bdfddc8c430e9cd30c2c7af54bfe" onclick="window.open('','avertir','width=700,height=470,scrollbars=no,status=no')">

    //Bouton CDV
    SK.Util.addButton(author.$msg, {
        class: (author.gender && this.getSetting("enableSex")) ? author.gender : "unknown",
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
        SK.Util.addButton(author.$msg, {
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
        SK.Util.addButton(author.$msg, {
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
        SK.Util.addButton(author.$msg, {
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
    author.$msg.find("[target='avertir'], .ancre > a:first, [target='profil']").remove();
};

/** Préparer une place pour l'avatar de l'auteur */
SK.moduleConstructors.InfosPseudo.prototype.addAvatarPlaceholder = function($msg) {

    //On ajoute déjà le wrapper de l'avatar
    var $avatarWrapper = $("<div />", {
        class: "avatar-wrapper",
    });

    //Lien vers la CDV
    var $avatar = $("<a />", {
        class: "avatar",
        css: {
            "background-color": "#FFF"
        }
    });

    $avatarWrapper.append($avatar);
    $msg.append($avatarWrapper);

    //On affiche un loader en attendant les données
    $avatar.spin("tiny");
};

/* Ajoute le rang de l'auteur */
SK.moduleConstructors.InfosPseudo.prototype.addRank = function(author) {

    if(author.rank !== "") {

        var rankString = "Rang " + author.rank.charAt(0).toUpperCase() + author.rank.slice(1);

        if(this.getSetting("enableAvatar")) {
            
            var $rank = $("<span />", {
                class: "rank " + author.rank,
                title: rankString
            });
            var $avatarWrapper = author.$msg.find(".avatar-wrapper");
            $avatarWrapper.append($rank.hide().fadeIn());
        }
        else {
            SK.Util.addButton(author.$msg, {
                class: "rank " + author.rank,
                tooltip: {
                    text: rankString
                }
            });
        }

    }
};

/** Remplace le loader de l'avatar du post par l'image de l'auteur */
SK.moduleConstructors.InfosPseudo.prototype.addAvatar = function(author) {

    var $avatarWrapper = author.$msg.find(".avatar-wrapper");
    var $avatar = $avatarWrapper.find(".avatar");
    //Si on n'a pas réussi à récupérer les infos de l'auteur
    if(!author.loaded) {

        //L'utilisateur est sûrement banni
        author.avatar = GM_getResourceURL("banImage");
        $avatar
            .addClass("ban")
            .css({
                "background-color": "transparent"
            });
    }

    var $avatarImg = $("<img />", {
        title: author.pseudo,
        alt: author.pseudo
    });

    $avatarImg.hide();

    $avatarImg.on("load", function() {
        $avatar
            .attr("href", author.profileLink)
            .spin(false)
            .append($avatarImg);
        $avatarImg.fadeIn();
        this.calculateAvatarDimensions($avatarImg);
    }.bind(this));

    //On met seulement src pour que l'event onload soit en place avant
    $avatarImg.attr("src", author.avatar); 

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
                display: block;\
                width: 100%;\
                height: 100%;\
                overflow: hidden;\
                box-shadow: 0px 2px 3px -2px rgba(0, 0, 0, 0.8);\
                cursor: pointer;\
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