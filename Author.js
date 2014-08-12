"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/* Représente un auteur de JVC */
SK.Author = function(pseudo) {
    this.pseudo = pseudo;
    this.rank = "";
    this.messageCount = 0;
    this.avatar = "";
    this.gender = "";
    this.profileLink = "";
    this.ban = false;
    this.hasLocalData = false;
    this.messages = [];
};


/* set les données de l'auteur */
SK.Author.prototype.initFromData = function(data) {
    this.rank = data.rank || "";
    this.messageCount = data.messageCount || 0;
    this.avatar = data.avatar || "";
    this.gender = data.gender || "";
    this.profileLink = data.profileLink || "";
    this.ban = data.ban || false;
    this.hasLocalData = data.hasLocalData || false;
};

/* Charge les données de l'auteur à partir d"un élément cdv (issu de l'API JVC) */
SK.Author.prototype.initFromCdv = function($cdv) {

    this.profileLink = "http://www.jeuxvideo.com/profil/" + this.pseudo + ".html";
    
    if($cdv.find("info_pseudo").length > 0 &&
        $cdv.find("nb_messages").length > 0 &&
        $cdv.find("petite_image").length > 0 &&
        $cdv.find("couleur_pseudo").length > 0
    ) {
        this.rank = SK.Author.getRankFromColor($cdv.find("couleur_rang").text());
        this.messageCount = parseInt($cdv.find("nb_messages").text());
        this.avatar = $cdv.find("petite_image").text();
        this.gender = $cdv.find("couleur_pseudo").text() === "#0066CC" ? "male" : "female";
    }
    else {
        this.ban = true;
    }
};



/* Ajoute un message à l'auteur */
SK.Author.prototype.addMessage = function(message) {
    this.messages.push(message);
};

/* Enregistre les données de l'auteur dans le localStorage */
SK.Author.prototype.saveLocalData = function() {

    var data = {
        rank: this.rank,
        messageCount: this.messageCount,
        avatar: this.avatar,
        gender: this.gender,
        profileLink: this.profileLink,
        ban: this.ban,
        hasLocalData: true
    };

    SK.Util.setValue(this.pseudo, data);
};

/* Retourne vrai si on a trouvé des données exploitables en local pour cet auteur */
SK.Author.prototype.loadLocalData = function() {
    var data = SK.Util.getValue(this.pseudo);

    if(data !== null) {
        this.initFromData(data);
        return true;
    }
    else {
        return false;
    }
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
