"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * Test : module de test
 * 
 */
SK.moduleConstructors.Test = SK.Module.new();

SK.moduleConstructors.Test.prototype.title = "Module de test";
SK.moduleConstructors.Test.prototype.description = "Permet de développer plus facilement";

SK.moduleConstructors.Test.prototype.init = function() {
    this.test();
};

/*
$1 : pseudo
$2 : jour
$3 : mois
$4 : année
$5 : heure
$6 : message
$7 : permalien
*/
var beatriceRegex = /# (.*)\n^# Posté le (\d{1,2}) ([^\s]*) (\d{4}) à (\d{2}:\d{2}:\d{2})\n((?:.|[\n\r])*?)\n^# *<a(?:.*?)href="(http[^"]*)".*[\s]*/gm;
var replaceBeatrice = function(match, pseudo, jour, mois, annee, heure, message, permalien) {

    //On retire les # au début du message
    message = cleanUpMessage(message, "#");

    return getFormattedQuote(pseudo, jour, mois, annee, heure, permalien, message);

};


/*
$1 : pseudo
$2 : jour
$3 : mois
$4 : année
$5 : heure
$6 : permalien
$7 : message (à épurer en retirant le cadre)
*/
var spawnkillRegex = /╭(?:┄┄┄)* ([^,]*), le (\d{1,2}) ([^\s]*) (\d{4}) à (\d{2}:\d{2}:\d{2})\n^ *┊ *<a(?:.*?)href="(http[^"]*)".*\n *┊┄┄┄\n((?:.|[\n\r])*?)\n^ *╰┄┄┄[\s]*/gm;
var replaceSpawnkill = function(match, pseudo, jour, mois, annee, heure, permalien, message) {

    //On retire les | au début du message
    message = cleanUpMessage(message, "┊");

    return getFormattedQuote(pseudo, jour, mois, annee, heure, permalien, message);
};


/*
$1 : permalien (peut être vide)
$2 : pseudo
$3 : jour
$4 : mois
$5 : année
$6 : heure
$7 : message (à épurer en retirant le cadre)
*/
var jvcmasterRegex = /(?:(?: *\| *<a(?:.*?)href="(http[^"]*)".*\n))* *\| Ecrit par « ([^\s]*) »(?:[^\d]*)(\d{1,2}) ([^\s]*) (\d{4}) à (\d{2}:\d{2}:\d{2})\n((?:\n? *\|.*)*)(?:(?:[\s]*)&gt; *)?/gm;
var replaceJvcmaster = function(match, permalien, pseudo, jour, mois, annee, heure, message) {

    //On retire les | au début du message
    message = cleanUpMessage(message, "|");

    return getFormattedQuote(pseudo, jour, mois, annee, heure, permalien, message);
};


/*
$1 : pseudo
$2 : jour
$3 : mois
$4 : année
$5 : permalien (peut être vide)
$6 : message (à épurer en retirant le cadre)
pas d'heure
*/
var turboforumRegex = /\| ([^\s]*)(?:(?:&nbsp;)|[\s])*-(?:(?:&nbsp;)|[\s])*le (\d{1,2}) ([^\s]*) (\d{4})[ ]*(?:\n\| <a(?:.*?)href="(http[^"]*)".*)*\n((?:(?:\n*^\|.*)*)*)(?:(?:[\s]*)&gt; )*/gm;
var replaceTurboforum = function(match, pseudo, jour, mois, annee, permalien, message) {

    //On retire les | au début du message
    message = cleanUpMessage(message, "|");

    return getFormattedQuote(pseudo, jour, mois, annee, "", permalien, message);
};

var getFormattedQuote = function(pseudo, jour, mois, annee, heure, permalien, message) {
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

var cleanUpMessage = function(message, separator) {
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

SK.moduleConstructors.Test.prototype.replaceQuotes = function(postText) {

    var newPostText = "";
    newPostText = postText.replace(beatriceRegex, replaceBeatrice);
    newPostText = newPostText.replace(spawnkillRegex, replaceSpawnkill);
    newPostText = newPostText.replace(jvcmasterRegex, replaceJvcmaster);
    newPostText = newPostText.replace(turboforumRegex, replaceTurboforum);

    if(postText === newPostText) {
        console.log(newPostText);
        return newPostText;
    }
    else {
        return this.replaceQuotes(newPostText);
    }
};

SK.moduleConstructors.Test.prototype.test = function() {

    var self = this;

    $(".post").each(function() {
        //On retire les <br> pour le parsing, on les ajoutera par la suite
        var postText = $(this).html().replace(/\n/g, "").replace(/[ ]*<br>/g, "\n");
        
        //On converti les citations en html
        postText = self.replaceQuotes(postText);

        //On supprime les lignes avant et après le emssage et on remet les <br>
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