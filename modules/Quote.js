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

SK.moduleConstructors.Quote.prototype.title = "Citations";
SK.moduleConstructors.Quote.prototype.description = "Permet de citer un message de manière propre simplement en cliquant sur un bouton \"citer\".";

//Longueur maximum d'une ligne (approximatif), les lignes plus longues sont tronquées. 0 = pas de limite
SK.moduleConstructors.Quote.prototype.maxLength = 0;
//Longueur de l'indentation de la citation
SK.moduleConstructors.Quote.prototype.indentationBefore = 0;

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

        this.addCitationButtons();
    }
};

/* Ajoute les boutons de citation dans l'entete du poste
* si la boîte de réponse est présente dans la page */
SK.moduleConstructors.Quote.prototype.addCitationButtons = function() {

    var self = this;

    $(".msg").each(function() {

        SK.Util.addButton($(this), {
            class: "quote",
            location: "bottom",
            tooltip: {
                text: "Citer ce message",
            },
            click: function() {

                var citationBlock = self.createCitationBlock(new SK.Message($(this).parents(".msg")));

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

    if(this.maxLength !== 0) {
        //On parcourt toutes les lignes du message
        for(var i = 0; i < lines.length; i++) {
            if(lines[i].length > this.maxLength) {

                //On passe les liens à la ligne
                var httpIndex = lines[i].indexOf("http");

                if(httpIndex > 1) { // > 1 et pas !== -1 pour éviter une boucle infini
                    lines.splice(i, 0, lines[i].substr(0, httpIndex));
                    lines.splice(i + 1, 1, lines[i + 1].substr(httpIndex));
                } 

                //On coupe les lignes trop longues au niveau des espaces (pour éviter de tronquer les mots)
                var cutIndex = lines[i].substr(this.maxLength).indexOf(" ");

                //S'il n'y a pas d'espaces dans la chaine, on ne la coupe pas
                if(cutIndex !== -1) {
                    lines.splice(i, 0, lines[i].substr(0, this.maxLength + cutIndex));
                    lines.splice(i + 1, 1, lines[i + 1].substr(this.maxLength + cutIndex));
                }
            }
        }
    }

    //Ajout de décoration/indentation à gauche des lignes
    $.each(lines, function(i, line) {
        lines[i] = SK.Util._(this.indentationBefore) + "┊ " + line;
    }.bind(this));

    //Message descriptif de la citation
    lines.splice(0, 0, SK.Util._(this.indentationBefore) + "┊");
    lines.splice(0, 0, SK.Util._(this.indentationBefore) + "┊ " + message.permalink);
    lines.splice(0, 0, SK.Util._(this.indentationBefore) + "┊ " + message.author + ", le " + message.date);
    lines.splice(0, 0, SK.Util._(this.indentationBefore) + "╭");
    //Fin de la citation
    lines.push(SK.Util._(this.indentationBefore) + "╰");
    //On passe une ligne après la citation
    lines.push("\n");

    //On n'autorise pas les sauts de ligne consécutifs dans les citations
    var quote = lines.join("\n")/*.replace("\n\n\n", "\n")*/;

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
        heure = "<div class='quote-hour' >à " + heure + "</div>";
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
        /* $1: pseudo, $2: jour, $3: mois, $4: année, $5: permalien (peut être vide), $6: message (à épurer en retirant le cadre), pas d'heure */
        regex: /\| ([^\s]*)(?:(?:&nbsp;)|[\s])*-(?:(?:&nbsp;)|[\s])*le (\d{1,2}) ([^\s]*) (\d{4})[ ]*(?:\n\| <a(?:.*?)href="(http[^"]*)".*)*\n((?:(?:\n*^\|.*)*)*)(?:(?:[\s]*)&gt; )*/gm,

        replaceCallback: function(match, pseudo, jour, mois, annee, permalien, message) {

            //On retire les | au début du message
            message = self.cleanUpMessage(message, "|");
            return self.citationToHtml(pseudo, jour, mois, annee, "", permalien, message);
        }
    }));

    self.quoteTypes.push(new SK.moduleConstructors.Quote.QuoteType({
        id: "jvcmaster",
        /* $1: permalien (peut être vide), $2: pseudo, $3: jour, $4: mois, $5: année, $6: heure, $7: message (à épurer en retirant le cadre) */
        regex: /(?:(?: *\| *<a(?:.*?)href="(http[^"]*)".*\n))* *\| Ecrit par « ([^\s]*) »(?:[^\d]*)(\d{1,2}) ([^\s]*) (\d{4}) à (\d{2}:\d{2}):\d{2}\n((?:\n? *\|.*)*)(?:(?:[\s]*)&gt; *)?/gm,

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

    //On remplace les citations textes par de l'Html dans tous les posts
    $(".post").each(function() {

        //On retire les <br> pour le parsing, on les ajoutera par la suite
        var postText = $(this).html().replace(/\n/g, "").replace(/[ ]*<br>/g, "\n");

        //On converti les citations en html
        postText = self.htmlizeQuote(postText);

        //On remet les <br>
        $(this).html(postText.replace(/\n/g, "\n<br>"));
    });
};

/* Options modifiables du plugin */ 
SK.moduleConstructors.Quote.prototype.settings = {
    htmlQuote: {
        title: "Formatage des citations",
        description: "Améliore le style des citations pour qu'elles se détachent plus du message.",
        default: true,
    },
    quoteButton: {
        title: "Bouton de citation",
        description: "Ajoute un bouton de citation permettant de répondre à un post.",
        default: true,
    }
};

SK.moduleConstructors.Quote.prototype.shouldBeActivated = function() {
    /* On affiche le bloc de citation sur la page réponse et les pages de lecture */
    return (
            window.location.href.match(/http:\/\/www\.jeuxvideo\.com\/forums\/3/) || 
            window.location.href.match(/http:\/\/www\.jeuxvideo\.com\/forums\/1/)
        );
};

SK.moduleConstructors.Quote.prototype.getCss = function() {
    var css = "";

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
                border-left: solid 3px #FF7B3B;\
                margin-bottom: 10px;\
                color: #444;\
            }\
            .quote-bloc::after {\
                content: \"\";\
                display: block;\
                width: 0px;\
                height: 0px;\
                position: absolute;\
                top: 30px;\
                left: -3px;\
                border: solid 7px transparent;\
                border-left-color: #FF7B3B;\
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
                color: #FF7B3B;\
            }\
            .quote-date {\
                float: right;\
                display: inline-block;\
                position: relative;\
                top: 1px;\
                font-size: 0.9em;\
            }\
            .quote-hour {\
                float: right;\
                display: inline-block;\
                position: relative;\
                top: 1px;\
                padding-left: 4px;\
                font-size: 0.9em;\
            }\
            .quote-link {\
                float: right;\
                display: inline-block;\
            }\
            .quote-message {\
                padding: 5px;\
                padding-left: 10px;\
            }\
            .quote-bloc .sk-button {\
                float: right;\
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