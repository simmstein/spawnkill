"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * Test : module de test
 * 
 */
SK.moduleConstructors.Test = SK.Module.new();

SK.moduleConstructors.Test.prototype.id = "Test";
SK.moduleConstructors.Test.prototype.title = "Module de test";
SK.moduleConstructors.Test.prototype.description = "Permet de développer plus facilement";

SK.moduleConstructors.Test.prototype.init = function() {
    this.initQuoteTypes();
    this.htmlizeAllQuotes();
};

/**
 * Retourne un bloc de citation html à partir des infos passées en paramètre
 */
SK.moduleConstructors.Test.prototype.citationToHtml = function(pseudo, jour, mois, annee, heure, permalien, message) {
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
SK.moduleConstructors.Test.QuoteType = function(options) {
    this.regex = options.regex;
    this.replaceCallback = options.replaceCallback;
};

/**
 * Tous les types de citations pris en compte par le plugin
 * pour le passge à l'HTML
 */
SK.moduleConstructors.Test.prototype.quoteTypes = [];

/**
 * Prépare les styles de citations supportés
 */
SK.moduleConstructors.Test.prototype.initQuoteTypes = function() {

    var self = this;

    self.quoteTypes.push(new SK.moduleConstructors.Test.QuoteType({
        id: "beatrice",
        /* $1: pseudo, $2: jour, $3: mois, $4: année, $5: heure, $6: message, $7: permalien */
        regex: /# (.*)\n^# Posté le (\d{1,2}) ([^\s]*) (\d{4}) à (\d{2}:\d{2}:\d{2})\n((?:.|[\n\r])*?)\n^# *<a(?:.*?)href="(http[^"]*)".*[\s]*/gm,

        replaceCallback: function(match, pseudo, jour, mois, annee, heure, message, permalien) {

            //On retire les # au début du message
            message = self.cleanUpMessage(message, "#");
            return self.citationToHtml(pseudo, jour, mois, annee, heure, permalien, message);

        }
    }));

    self.quoteTypes.push(new SK.moduleConstructors.Test.QuoteType({
        id: "spawnkill",
        /* $1: pseudo, $2: jour, $3: mois, $4: année, $5: heure, $6: permalien, $7: message (à épurer en retirant le cadre) */
        regex: /╭(?:┄┄┄)* ([^,]*), le (\d{1,2}) ([^\s]*) (\d{4}) à (\d{2}:\d{2}:\d{2})\n^ *┊ *<a(?:.*?)href="(http[^"]*)".*\n *┊┄┄┄\n((?:.|[\n\r])*?)\n^ *╰┄┄┄[\s]*/gm,

        replaceCallback: function(match, pseudo, jour, mois, annee, heure, permalien, message) {

            //On retire les | au début du message
            message = self.cleanUpMessage(message, "┊");
            return self.citationToHtml(pseudo, jour, mois, annee, heure, permalien, message);
        }
    }));

    self.quoteTypes.push(new SK.moduleConstructors.Test.QuoteType({
        id: "turboforum",
        /* $1: pseudo, $2: jour, $3: mois, $4: année, $5: permalien (peut être vide), $6: message (à épurer en retirant le cadre), pas d'heure */
        regex: /\| ([^\s]*)(?:(?:&nbsp;)|[\s])*-(?:(?:&nbsp;)|[\s])*le (\d{1,2}) ([^\s]*) (\d{4})[ ]*(?:\n\| <a(?:.*?)href="(http[^"]*)".*)*\n((?:(?:\n*^\|.*)*)*)(?:(?:[\s]*)&gt; )*/gm,

        replaceCallback: function(match, pseudo, jour, mois, annee, permalien, message) {

            //On retire les | au début du message
            message = self.cleanUpMessage(message, "|");
            return self.citationToHtml(pseudo, jour, mois, annee, "", permalien, message);
        }
    }));

    self.quoteTypes.push(new SK.moduleConstructors.Test.QuoteType({
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
SK.moduleConstructors.Test.prototype.cleanUpMessage = function(message, separator) {
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
SK.moduleConstructors.Test.prototype.htmlizeQuote = function(postText) {

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
SK.moduleConstructors.Test.prototype.htmlizeAllQuotes = function() {

    var self = this;

    //On remplace les citations textes par de l'Html dans tous les posts
    $(".post").each(function() {

        //On retire les <br> pour le parsing, on les ajoutera par la suite
        var postText = $(this).html().replace(/\n/g, "").replace(/[ ]*<br>/g, "\n");

        //On converti les citations en html
        postText = self.htmlizeQuote(postText);

        //On remet les <br>
        $(this).html(postText.replace(/\n/g, "<br>"));
    });
};


SK.moduleConstructors.Test.prototype.shouldBeActivated = function() {
    return true;
};

SK.moduleConstructors.Test.prototype.getCss = function() {
    var css = "";

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