"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/* Représente un post JVC (.msg) */
SK.Message = function($msg) {

    this.$msg = $msg;
    this.text = this.initText();
    this.author = this.initAuthor();
    this.date = this.initDate();
    this.permalink = this.initPermalink();
};

/* Récupère le texte présent dans le post $(.msg) passé en paramètre 
* Note : remplace les images par leur attribut alt */
SK.Message.prototype.initText = function() {

    var $message = this.$msg.find(".post").clone();

    $message.find("img").each(function() {
        $(this).replaceWith($(this).attr("alt"));
    });

    return $message.text().trim();
};

//À implémenter :
/* Retourne le permalien du post $(.msg) passé en paramètre */
SK.Message.prototype.initPermalink = function() {
    return "";
};

/* Retourne l'auteur du post $(.msg) passé en paramètre */
SK.Message.prototype.initAuthor = function() {
    return this.$msg.find(".pseudo > strong").html().trim();            
};

/* Retourne la date du post $(.msg) passé en paramètre */
SK.Message.prototype.initDate = function() {
    var $dateBloc = this.$msg.find(".date");
    var dateString = $dateBloc.text().trim();

    var match = dateString.match(/Posté (via mobile )?le([^:]*[^\s]*)/);
    return match[2].trim();
};