"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * Quote : Plugin de citation
 * 
 * TODO :
 * - Ajouter du CSS aux citations
 * - Embellir les citations de citations
 * - Ajouter un lien vers le message dans les citations
 * - Permettre la citation du texte sélectionné
 * - Si réponse déjà focus, ajoute la citation à l'endroit du cursuer
 */
SK.moduleConstructors.Quote = SK.Module.new();

SK.moduleConstructors.Quote.prototype.id = "Quote";
SK.moduleConstructors.Quote.prototype.title = "Citations";
SK.moduleConstructors.Quote.prototype.description = "Permet de citer un message de manière propre simplement en cliquant sur un bouton \"citer\".";

SK.moduleConstructors.Quote.prototype.init = function() {

    //On transforme les citations en Html
    if(this.getSetting("htmlQuote")) {
        this.initQuoteTypes();
        this.htmlizeAllQuotes();
    }

    if(this.getSetting("quoteButton")) {
        //Si une citation est prévue, on l'affiche
        var quoteMessage = SK.Util.getValue("responseContent");

        if(quoteMessage) {
            this.citeMessage(quoteMessage);
            SK.Util.deleteValue("responseContent");
        }

        //On veut que le bouton soit inséré après le lien
        this.addQuoteButtons();
    }
};

/* Ajoute les boutons de citation dans l'entete du poste
* si la boîte de réponse est présente dans la page */
SK.moduleConstructors.Quote.prototype.addQuoteButtons = function() {

    var self = this;

    //On passe les fonctions dans la file pour éviter de bloquer l'UI
    var queueQuoteButton = function($msg) {

        self.queueFunction(function() {
            SK.Util.addButton($msg, {
                class: "quote",
                location: "bottom",
                index: 100,
                tooltip: {
                    text: "Citer ce message",
                },
                click: function() {

                    var citationBlock = self.createCitationBlock(new SK.Message($msg));

                    //Si QuickResponse n'est pas activé et qu'on est sur la page de lecture,
                    //le bouton de citation dirige vers la page de réponse en remplissant
                    //le formulaire de réponse
                    if(!SK.modules.QuickResponse.activated &&
                        window.location.href.match(/http:\/\/www\.jeuxvideo\.com\/forums\/1/))
                    {
                        SK.Util.setValue("responseContent", citationBlock);
                        window.location.href = $(".bt_repondre").attr("href");
                    }
                    else {
                        self.citeMessage(citationBlock);
                    }
                }
            });
        }, this);
    };

    $(".msg").each(function() {
        queueQuoteButton($(this));
    });
};

/* Ajoute le texte passé en paramètre à la fin de la réponse. */
SK.moduleConstructors.Quote.prototype.addToResponse = function(text) {

    var currentResponse = $("#newmessage").val();

    //On supprime le message d'avertissement, s'il existe 
    if(currentResponse.indexOf("Ne postez pas d\'insultes") === 0) {
        currentResponse = "";
    }

    //On passe une ligne si la réponse n'est pas vide
    if(currentResponse.trim() !== "") {
        text = "\n" + text;

        //On en passe deux s'il n'y a pas de passage à la ligne à la fin
        if(currentResponse.slice(-1) !== "\n") {
            text = "\n" + text;
        }
    }

    $("#newmessage").val(currentResponse + text);
};

/* Crée un bloc de citation à partir du Message passées en paramètre */
SK.moduleConstructors.Quote.prototype.createCitationBlock = function(message) {

    var lines = message.text.split("\n");

    switch(this.getSetting("quoteType")) {

        case "spawnkill" :
            $.each(lines, function(i, line) {
                lines[i] = "┊ " + line;
            }.bind(this));
            lines.splice(0, 0, "┊");
            lines.splice(0, 0, "┊ " + message.permalink);
            lines.splice(0, 0, "┊ " + message.authorPseudo + ", le " + message.date + " à " + message.time);
            lines.splice(0, 0, "╭");
            //Fin de la citation
            lines.push("╰");
            //On passe une ligne après la citation
            lines.push("\n");
            break;

        case "turboforum" :
            $.each(lines, function(i, line) {
                lines[i] = "| " + line;
            }.bind(this));
            lines.splice(0, 0, "| " + message.permalink);
            lines.splice(0, 0, "| " + message.authorPseudo + " " + SK.Util._(1) + "-" + SK.Util._(1) + " le " + message.date);
            lines.push("");
            lines.push("> ");
            break;

        case "jvcmaster" :
            if(lines.length > 0) {
                lines[0] = "« " + lines[0];
                lines[lines.length - 1] = lines[lines.length - 1] + " »";
            }

            $.each(lines, function(i, line) {
                lines[i] = "| " + line;
            }.bind(this));

            lines.splice(0, 0, "| Ecrit par « " + message.authorPseudo + " », " + message.date + " à " + message.time);
            lines.splice(0, 0, "| " + message.permalink);
            lines.push("");
            lines.push("> ");
            break;
    }

    //On n'autorise pas les sauts de ligne consécutifs dans les citations
    var quote = lines.join("\n");

    return quote;
};

/* Crée une citation dans la réponse à partir du texte passé en paramètre
 * et scroll vers la boîte de réponse. */
SK.moduleConstructors.Quote.prototype.citeMessage = function(citationBlock) {
    this.addToResponse(citationBlock);

    var $responseBox = $("#newmessage");

    //Scrolling vers la réponse
    $responseBox.scrollThere();

    //Focus sur la réponse
    $responseBox.focusWithoutScrolling();
    
    //On force le curseur à la fin du textarea
    var response = $responseBox.val();
    $responseBox.val("");
    $responseBox.val(response);

    //Scroll tout en bas du textarea
    $responseBox.scrollTop($responseBox[0].scrollHeight - $responseBox.height());

};

/**
 * Retourne un bloc de citation html à partir des infos passées en paramètre
 */
SK.moduleConstructors.Quote.prototype.citationToHtml = function(pseudo, jour, mois, annee, heure, permalien, message) {

    //CDV de l'auteur cité
    var profileUrl = "http://www.jeuxvideo.com/profil/" + pseudo + ".html";

    if(heure !== "") {
        heure = "<div class='quote-hour' >" + heure + "</div>";
    }
    var $quote = $("<div class='quote-bloc' >" +
            "<div class='quote-header' >" +
                "<a class='quote-pseudo' href='" + profileUrl + "' >" + pseudo + "</a>" +
                heure +
                "<div class='quote-date' >" + jour + " " + mois + " " + annee + "</div>" +
            "</div>" +
            "<hr>" +
            "<div class='quote-message' >" +
                message + 
            "</div>" +
        "</div>");

    //Permlien vers le message
    if(permalien !== "") {
        $quote.find(".quote-pseudo").first().after(new SK.Button({
            class: "link-gray",
            href: permalien,
            tooltip: {
                text: "Lien vers ce message",
                position: "right"
            },
            wrapper: {
                class: "quote-link"
            }
        }));
    }

    //Popup CDV de l'auteur
    $quote.find(".quote-pseudo").first().on("click", function(event) {
        event.preventDefault();
        window.open(profileUrl, "profil", "width=800,height=570,scrollbars=no,status=no");
    });

    return $quote[0].outerHTML;
};

/* options : {
    id: nom du type de la citation
    regex: regex de reconnaissance du type de citation 
    replaceCallback: callback appelé avec post.replace(regex, replaceCallback)
}*/
SK.moduleConstructors.Quote.QuoteType = function(options) {
    this.regex = options.regex;
    this.replaceCallback = options.replaceCallback;
};

/**
 * Tous les types de citations pris en compte par le plugin
 * pour le passge à l'HTML
 */
SK.moduleConstructors.Quote.prototype.quoteTypes = [];

/**
 * Prépare les styles de citations supportés
 */
SK.moduleConstructors.Quote.prototype.initQuoteTypes = function() {

    var self = this;

    self.quoteTypes.push(new SK.moduleConstructors.Quote.QuoteType({
        id: "beatrice",
        /* $1: pseudo, $2: jour, $3: mois, $4: année, $5: heure, $6: message, $7: permalien */
        regex: /# (.*)\n^# Posté le (\d{1,2}) ([^\s]*) (\d{4}) à (\d{2}:\d{2}):\d{2}\n((?:.|[\n\r])*?)\n^# *<a(?:.*?)href="(http[^"]*)".*[\s]*/gm,

        replaceCallback: function(match, pseudo, jour, mois, annee, heure, message, permalien) {

            //On retire les # au début du message
            message = self.cleanUpMessage(message, "#");
            return self.citationToHtml(pseudo, jour, mois, annee, heure, permalien, message);

        }
    }));

    self.quoteTypes.push(new SK.moduleConstructors.Quote.QuoteType({
        id: "spawnkill",
        /* $1: pseudo, $2: jour, $3: mois, $4: année, $5: heure, $6: permalien, $7: message (à épurer en retirant le cadre) */
        regex: /╭(?:┄┄┄)?(?:\n *┊)? ([^,]*), le (\d{1,2}) ([^\s]*) (\d{4}) à (\d{2}:\d{2}):\d{2}\n^ *┊ *<a(?:.*?)href="(http[^"]*)".*\n *┊(?:┄┄┄)?\n((?:.|[\n\r])*?)\n^ *╰(?:┄┄┄)?[\s]*/gm,

        replaceCallback: function(match, pseudo, jour, mois, annee, heure, permalien, message) {

            //On retire les | au début du message
            message = self.cleanUpMessage(message, "┊");
            return self.citationToHtml(pseudo, jour, mois, annee, heure, permalien, message);
        }
    }));

    self.quoteTypes.push(new SK.moduleConstructors.Quote.QuoteType({
        id: "turboforum",
        /* $1: pseudo, $2: jour (peut être vide), $3: mois (peut être vide), $4: année (peut être vide),
         * $5: heure (peut être vide), $6: permalien (peut être vide), $6: message (à épurer en retirant le cadre), pas d'heure */
        regex: /\| ([^\s]*)(?:(?:&nbsp;)|[\s])*-(?:(?:&nbsp;)|[\s])*(?:(?:le (\d{1,2}) ([^\s]*) (\d{4}))|(?:aujourd’hui à (\d{2}:\d{2})))[ ]*(?:\n\| <a(?:.*?)href="(http[^"]*)".*)*\n((?:(?:\n*^\|.*)*)*)(?:(?:[\s]*)&gt; )*/gm,

        replaceCallback: function(match, pseudo, jour, mois, annee, heure, permalien, message) {

            //On retire les | au début du message
            message = self.cleanUpMessage(message, "|");
            return self.citationToHtml(pseudo, jour, mois, annee, heure, permalien, message);
        }
    }));

    self.quoteTypes.push(new SK.moduleConstructors.Quote.QuoteType({
        id: "jvcmaster",
        /* $1: permalien (peut être vide), $2: pseudo, $3: jour, $4: mois, $5: année, $6: heure, $7: message (à épurer en retirant le cadre) */
        regex: /(?:(?: *\| *<a(?:.*?)href="(http[^"]*)".*\n))* *\| Ecrit par « ([^\s]*) »(?:[^\d]*)(\d{1,2}) ([^\s]*) (\d{4}) à (\d{2}:\d{2}):\d{2}\n((?:\n? *\|.*)*)(?:(?:[\s]*)(?:&gt;)? *)?/gm,

        replaceCallback: function(match, permalien, pseudo, jour, mois, annee, heure, message) {

            //On retire les | au début du message
            message = self.cleanUpMessage(message, "|");
            return self.citationToHtml(pseudo, jour, mois, annee, heure, permalien, message);
        }
    }));
};


/**
 * Retire les séparateurs et les guillemets des citations récupérées.
 */
SK.moduleConstructors.Quote.prototype.cleanUpMessage = function(message, separator) {
    //On "nettoie" le message en retirant les séparateurs et les guillemets
    var lines = message.split("\n");

    for(var i in lines) {

        //Suppression des séparateurs
        var regex = new RegExp("^ *\\" + separator + " *");
        lines[i] = lines[i].replace(regex, "");

        //Suppression des guillemets
        lines[i] = lines[i].replace(/^ *« */, "");

        //Si les citations ne sont pas imbriquées, on supprime le »
        if(!lines[i].match(/^ *[\||#|┊] *.*/)) {
            lines[i] = lines[i].replace(/ *» *$/, "");
        }
    }

    return lines.join("\n");
};

/** Remplace les citations textes par du HTML dans le texte passé en paramètre */
SK.moduleConstructors.Quote.prototype.htmlizeQuote = function(postText) {
    
    var newPostText = postText;
    
    for(var i in this.quoteTypes) {
        newPostText = newPostText.replace(this.quoteTypes[i].regex, this.quoteTypes[i].replaceCallback);
    }

    //Si aucun remplacement n'a été fait, on a terminé.
    if(postText === newPostText) {
        return newPostText;
    }
    //Sinon, on cherche des citations un niveau plus bas
    else {
        return this.htmlizeQuote(newPostText);
    }
};

/** 
 * Transforme toutes les citations textes de la page en Html
 */
SK.moduleConstructors.Quote.prototype.htmlizeAllQuotes = function() {

    var self = this;
    var $posts = $(".post");
    var postCount = $posts.length;

    //On remplace les citations textes par de l'Html dans tous les posts

    $posts.each(function(i, post) {

        var $post = $(post);
        self.queueFunction(function() {
            //On retire les <br> pour le parsing, on les ajoutera par la suite
            var postText = $post.html().replace(/\n/g, "").replace(/[ ]*<br>/g, "\n");

            //On converti les citations en html
            postText = self.htmlizeQuote(postText);

            //On remet les <br>
            $post.html(postText.replace(/\n/g, "\n<br>"));

            if(i === postCount - 1) {
                SK.Util.dispatch("htmlQuoteLoaded");
            }
        }, this);
    });
};

/* Options modifiables du plugin */ 
SK.moduleConstructors.Quote.prototype.settings = {
    htmlQuote: {
        title: "Formatage des citations",
        description: "Améliore le style des citations pour qu'elles se détachent plus du message.",
        type: "boolean",
        default: true,
    },
    quoteButton: {
        title: "Bouton de citation",
        description: "Ajoute un bouton de citation permettant de répondre à un post.",
        type: "boolean",
        default: true,
    },
    quoteType: {
        title: "Type de citation",
        description: "Choix du type de citation en mode texte (citations que verront ceux qui n'ont pas SpawnKill).",
        type: "select",
        options: { spawnkill: "SpawnKill", turboforum: "JVC TurboForum", jvcmaster: "JVC Master" },
        default: "spawnkill",
    }
};

SK.moduleConstructors.Quote.prototype.shouldBeActivated = function() {
    /* On affiche le bloc de citation sur la page réponse et les pages de lecture */
    return SK.Util.currentPageIn([ "topic-read", "topic-response", "post-preview" ]);
};

SK.moduleConstructors.Quote.prototype.getCss = function() {
    var css = "";

    var mainColor = SK.modules.StartSpawnKill.mainColor;

    if(this.getSetting("quoteButton")) {
        css += "\
            .sk-button-content.quote {\
                background-image: url('" + GM_getResourceURL("quote") + "');\
                background-position: -1px -1px;\
            }\
        ";
    }

    if(this.getSetting("htmlQuote")) {
        css += "\
            .quote-bloc {\
                position: relative;\
                background-color: #FFF;\
                box-shadow: 1px 1px 3px -0px rgba(0, 0, 0, 0.3);\
                border-left: solid 3px " + mainColor + ";\
                margin-bottom: 10px;\
                color: #444;\
            }\
            .quote-bloc::after {\
                content: \"\";\
                display: block;\
                width: 0px;\
                height: 0px;\
                position: absolute;\
                top: 28px;\
                left: -3px;\
                border: solid 7px transparent;\
                border-left-color: " + mainColor + ";\
            }\
            .quote-header {\
                padding: 3px 10px;\
                padding-right: 5px;\
            }\
            .quote-bloc hr {\
                display: block;\
                border: none;\
                border-bottom: solid 1px #E0E0E0;\
                margin: 0 5px;\
                margin-left: 10px;\
                height: 0px;\
            }\
            .quote-pseudo {\
                display: inline-block;\
                font-weight: bold;\
                color: #444;\
            }\
            .quote-pseudo:hover {\
                color: " + mainColor + ";\
            }\
            .quote-date {\
                float: right;\
                display: inline-block;\
                position: relative;\
                top: 1px;\
                padding-left: 18px;\
                font-size: 0.9em;\
                background-image: url('" + GM_getResourceURL("calendar") + "');\
                background-position: 1px -1px;\
                background-repeat: no-repeat;\
            }\
            .quote-hour {\
                float: right;\
                display: inline-block;\
                position: relative;\
                top: 1px;\
                padding-left: 26px;\
                font-size: 0.9em;\
                background-image: url('" + GM_getResourceURL("clock") + "');\
                background-position: 10px -1px;\
                background-repeat: no-repeat;\
            }\
            .quote-message {\
                padding: 5px;\
                padding-left: 10px;\
            }\
            .quote-bloc .sk-button.quote-link {\
                float: right;\
                margin-left: 8px;\
            }\
            .sk-button-content.link-gray {\
                background-image: url('" + GM_getResourceURL("link-gray") + "');\
                background-color: transparent;\
                border-bottom-color: transparent;\
            }\
        ";
    }

    return css;
};