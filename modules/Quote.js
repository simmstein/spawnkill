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

//Longueur maximum d'une ligne (approximatif), les lignes plus longues sont tronquées
SK.moduleConstructors.Quote.prototype.maxLength = 50;
//Longueur de l'indentation de la citation
SK.moduleConstructors.Quote.prototype.indentationBefore = 2;

SK.moduleConstructors.Quote.prototype.init = function() {
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
                self.citeMessage(new SK.Message($(this).parents(".msg")));
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

    //On parcourt toutes les lignes du message
    for(var i = 0; i < lines.length; i++) {
        if(lines[i].length > this.maxLength) {

            //On passe les liens à la ligne
            var httpIndex = lines[i].indexOf("http");

            if(httpIndex > 1) { // > 0 et pas !== -1 pour éviter une boucle infini
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

    //Ajout de décoration/indentation à gauche des lignes
    $.each(lines, function(i, line) {
        lines[i] = SK.Util._(this.indentationBefore) + "┆ " + SK.Util._(1) + " " + line;
    }.bind(this));

    //Message descriptif de la citation
    lines.splice(0, 0, SK.Util._(this.indentationBefore) + "╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄");
    lines.splice(0, 0, SK.Util._(this.indentationBefore + 5) + message.author + ", le " + message.date + " :");
    //Fin de la citation
    lines.push(SK.Util._(this.indentationBefore) + "╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄");
    //On passe une ligne après la citation
    lines.push("\n");

    //On n'autorise pas les sauts de ligne consécutifs dans les citations
    var quote = lines.join("\n").replace("\n\n\n", "\n");

    return quote;
};

/* Crée une citation dans la réponse à partir du texte passé en paramètre
 * et scroll vers la boîte de réponse. */
SK.moduleConstructors.Quote.prototype.citeMessage = function(message) {
    this.addToResponse(this.createCitationBlock(message));

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

SK.moduleConstructors.Quote.prototype.shouldBeActivated = function() {
    /* On affiche le bloc de citation sur la page réponse
        ou sur les pages de lecture quand QuickResponse est activé */
    return (
            window.location.href.match(/http:\/\/www\.jeuxvideo\.com\/forums\/3/) || 
            (
                SK.modules.QuickResponse.activated &&
                window.location.href.match(/http:\/\/www\.jeuxvideo\.com\/forums\/1/)
            )
        );
};

SK.moduleConstructors.Quote.prototype.getCss = function() {
    var css = "\
        .sk-button-content.quote {\
            background-image: url('" + GM_getResourceURL("quote") + "');\
            background-position: -1px -1px;\
        }\
    ";
    return css;
};