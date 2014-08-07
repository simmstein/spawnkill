"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * QuickResponse : Ajoute le formulaire de réponse en bas de toutes les pages
 * 
 * TODO :
 * - Réactiver Noelshack
 */
SK.moduleConstructors.QuickResponse = SK.Module.new();

SK.moduleConstructors.QuickResponse.prototype.title = "Réponse Rapide";
SK.moduleConstructors.QuickResponse.prototype.description = "Permet de répondre à un topic sans avoir à cliquer sur \"Répondre\". Le formulaire de réponse est présent sur toutes les pages.";

SK.moduleConstructors.QuickResponse.prototype.init = function() {
    this.addResponseForm();
    this.addAnchor();
};

/* Ajoute le formulaire de réponse en base de la page, si nécessaire */
SK.moduleConstructors.QuickResponse.prototype.addResponseForm = function() {
    var $quickResponseForm = $("<div />", {
        id : "quickResponseForm"
    });

    GM_xmlhttpRequest({
        url: $(".bt_repondre").first().attr("href"),
        method: "GET",
        onload: function(response) {
            var data = response.responseText;

            $quickResponseForm.hide();
            $quickResponseForm.html($(data.replace(/<p class="lien_base">\n.*\n<\/p>/, "")).find(".bloc_forum:last, form[name=post2]"));
            $quickResponseForm.find('#boutons_repondre').css('background', 'none');
            $quickResponseForm.find('#boutons_repondre').css('padding-bottom', '0');
            $quickResponseForm.fadeIn();
        }
    });

    $(".bloc_forum").after($quickResponseForm);
};

/* Transforme le lien "Répondre" en ancre vers le formulaire. */
SK.moduleConstructors.QuickResponse.prototype.addAnchor = function() {
    $(".bt_repondre").on("click", function(event) {
        event.preventDefault();
        $("#newmessage")
            .scrollThere()
            .focus();
    });
};

SK.moduleConstructors.QuickResponse.prototype.shouldBeActivated = function() {
    return (window.location.href.match(/http:\/\/www\.jeuxvideo\.com\/forums\/1/) && $(".bt_repondre").length > 0);
};
