"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/* Représente un auteur de JVC */
SK.Author = function($msg) {
    this.$msg = $msg;
    this.$avatar = null;
    this.pseudo = "";
    this.rank = "";
    this.messageCount = 0;
    this.avatar = "";
    this.gender = "";
    this.profileLink = "";
    this.listeners = [];
};

/* Charge les données de l'auteur en Ajax */
SK.Author.prototype.init = function() {
    var self = this;

    self.loaded = false;
    self.pseudo = self.$msg.find("strong").html().trim();
    self.profileLink = "http://www.jeuxvideo.com/profil/" + self.pseudo + ".html";
    
    // Chargement de l'ancien avatar dans le cache
    self.avatar = localStorage.getItem("SK." + self.pseudo + ".avatar") || '';

    SK.Util.jvc("profil/" + self.pseudo + ".xml", function($xml) {


        if($xml.find("info_pseudo").length > 0 &&
            $xml.find("nb_messages").length > 0 &&
            $xml.find("petite_image").length > 0 &&
            $xml.find("couleur_pseudo").length > 0
        ) {
            self.rank = SK.Author.getRankFromColor($xml.find("couleur_rang").text());
            self.messageCount = parseInt($xml.find("nb_messages").text());
            self.avatar = $xml.find("petite_image").text();
            localStorage.setItem("SK." + self.pseudo + ".avatar", self.avatar); // Sauvegarde du nouvel avatar
            self.gender = $xml.find("couleur_pseudo").text() === "#0066CC" ? "male" : "female";
            self.loaded = true;
        }

        for (var i in self.listeners) {
            self.listeners[i](self);
        }
    });
};

/* Ajoute une fonction qui sera appelée quand les données seront chargées */
SK.Author.prototype.addListener = function(listener) {
    this.listeners.push(listener);
};

SK.Author.getRankFromColor = function(hexString) {

    var rank = "";

    switch(hexString) {
        case "#CDAF69" :
            rank = "carton";
            break;
        case "#E7AD87" :
            rank = "bronze";
            break;
        case "#CCCCCC" :
            rank = "argent";
            break;
        case "#F3D15C" :
            rank = "or";
            break;
        case "#E5727A" :
            rank = "rubis";
            break;
        case "#3C54C6" :
            rank = "saphir";
            break;
        case "#3D9F6A" :
            rank = "emeraude";
            break;
        case "#C7EBF9" :
            rank = "diamant";
            break;
    }

    return rank;
};
