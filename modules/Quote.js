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
    this.initQuoteTypes();
    this.htmlizeAllQuotes();

    //Si une citation est prévue, on l'affiche
    var quoteMessage = SK.Util.getValue("responseContent");

    if(quoteMessage) {
        this.citeMessage(quoteMessage);
        SK.Util.deleteValue("responseContent");
    }
    this.addCitationButtons();
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
    var quote = "<div class='quote-bloc' >" +
            "<div class='quote-pseudo' >" + pseudo + "</div>" +
            "<div class='quote-date' >" + jour + " " + mois + " " + annee + "</div>" +
            "<div class='quote-hour' >" + heure + "</div>" +
            "<div class='quote-link' >" + permalien + "</div>" +
            "<div class='quote-message' >" +
                message + 
            "</div>" +
        "</div>";

    return quote;
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
        regex: /# (.*)\n^# Posté le (\d{1,2}) ([^\s]*) (\d{4}) à (\d{2}:\d{2}:\d{2})\n((?:.|[\n\r])*?)\n^# *<a(?:.*?)href="(http[^"]*)".*[\s]*/gm,

        replaceCallback: function(match, pseudo, jour, mois, annee, heure, message, permalien) {

            //On retire les # au début du message
            message = self.cleanUpMessage(message, "#");
            return self.citationToHtml(pseudo, jour, mois, annee, heure, permalien, message);

        }
    }));

    self.quoteTypes.push(new SK.moduleConstructors.Quote.QuoteType({
        id: "spawnkill",
        /* $1: pseudo, $2: jour, $3: mois, $4: année, $5: heure, $6: permalien, $7: message (à épurer en retirant le cadre) */
        regex: /╭(?:┄┄┄)?(?:\n *┊)? ([^,]*), le (\d{1,2}) ([^\s]*) (\d{4}) à (\d{2}:\d{2}:\d{2})\n^ *┊ *<a(?:.*?)href="(http[^"]*)".*\n *┊(?:┄┄┄)?\n((?:.|[\n\r])*?)\n^ *╰(?:┄┄┄)?[\s]*/gm,

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
        regex: /(?:(?: *\| *<a(?:.*?)href="(http[^"]*)".*\n))* *\| Ecrit par « ([^\s]*) »(?:[^\d]*)(\d{1,2}) ([^\s]*) (\d{4}) à (\d{2}:\d{2}:\d{2})\n((?:\n? *\|.*)*)(?:(?:[\s]*)&gt; *)?/gm,

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

SK.moduleConstructors.Quote.prototype.shouldBeActivated = function() {
    /* On affiche le bloc de citation sur la page réponse et les pages de lecture */
    return (
            window.location.href.match(/http:\/\/www\.jeuxvideo\.com\/forums\/3/) || 
            window.location.href.match(/http:\/\/www\.jeuxvideo\.com\/forums\/1/)
        );
};

SK.moduleConstructors.Quote.prototype.getCss = function() {
    var css = "\
        .sk-button-content.quote {\
            background-image: url('" + GM_getResourceURL("quote") + "');\
            background-position: -1px -1px;\
        }\
    ";

    css += "\
        .quote-bloc {\
          background-color: #CCC;\
          padding: 5px;\
          border: solid 1px #AAA;\
          opacity: 0.9;\
          box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.5);\
          margin-bottom: 10px;\
        }\
        .quote-pseudo {\
          background-color: #CEF;\
          border: solid 1px #ACD;\
          padding: 2px;\
        }\
        .quote-date {\
          background-color: #FEC;\
          border: solid 1px #DCA;\
          padding: 2px;\
        }\
        .quote-hour {\
          background-color: #ECF;\
          border: solid 1px #CAD;\
          padding: 2px;\
        }\
        .quote-link {\
          background-color: #CFE;\
          border: solid 1px #ADC;\
          padding: 2px;\
          margin-bottom: 5px;\
        }\
    ";

    return css;
};