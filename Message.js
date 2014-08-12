"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/* Représente un post JVC (.msg) */
SK.Message = function($msg) {

    this.$msg = $msg;
    this.text = this.initText();
    this.authorPseudo = this.initAuthorPseudo();
    this.date = this.initDate();
    this.permalink = this.initPermalink();
    this.alertUrl = this.initAlertUrl();
    this.author = null;
};

/* Récupère le texte présent dans le post $(.msg) passé en paramètre 
* Note : remplace les images par leur attribut alt */
SK.Message.prototype.initText = function() {

    var $message = this.$msg.find(".post").clone();

    //On supprime les éventuelles citations
    $message.find(".quote-bloc").remove();

    $message.find("img").each(function() {
        $(this).replaceWith($(this).attr("alt"));
    });

    return $message.text().trim();
};

/* Retourne le permalien du post */
SK.Message.prototype.initPermalink = function() {

    return location.protocol + "//" + location.host + location.pathname + "#" + this.$msg.attr("id");
};

SK.Message.prototype.initAlertUrl = function() {

    return this.$msg.find("[target=avertir]").first().attr("href");
};

/* Retourne le pseudo de l'auteur du post  */
SK.Message.prototype.initAuthorPseudo = function() {
    return this.$msg.find(".pseudo > strong").html().trim();            
};

/* Retourne la date du post  */
SK.Message.prototype.initDate = function() {
    var $dateBloc = this.$msg.find(".date");
    var dateString = $dateBloc.text().trim();

    var match = dateString.match(/Posté (via mobile )?le([^:]*[^\s]*)/);
    return match[2].trim();
};

SK.Message.prototype.setAuthor = function(author) {
    this.author = author;
};