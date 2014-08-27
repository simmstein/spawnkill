"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * DeblanWallModule : Permet d"afficher un wall posté sur le service de colorisation syntaxique de Deblan
 */
SK.moduleConstructors.DeblanWallModule = SK.Module.new();

SK.moduleConstructors.DeblanWallModule.prototype.title = "Deblan - Wall";
SK.moduleConstructors.DeblanWallModule.prototype.description = "Permet d'afficher un wall posté sur le service de colorisation syntaxique de Deblan";

SK.moduleConstructors.DeblanWallModule.prototype.init = function() {
    this.addCss();
    this.getDeblanLinks().each(this.linkHandler);

    if (this.getSetting("replaceLink")) {
        $(".deblan-wall-button").trigger("click");
    }
};

SK.moduleConstructors.DeblanWallModule.prototype.getDeblanLinks = function() {
    var links = [];

    $(".post a").each(function() {
        if ($(this).attr("href").match(/https:\/\/wall\.deblan\.org\/x/)) {
            links.push($(this));
        }
    });

    return $(links);
};

SK.moduleConstructors.DeblanWallModule.prototype.linkHandler = function() {
    var $link = $(this);

    var $button = $("<button>")
        .attr("data-active", "no")
        .addClass("sk-button-content")
        .addClass("deblan-wall-button")
        .html("+");

    var $code = $("<div>")
        .addClass("quote-bloc")
        .addClass("deblan-wall-code")
        .append($("<div>").addClass("quote-message"))
        .hide()
        .attr({
            "data-url": $link.attr("href"),
            "data-loaded": "no"
        });

    $button
        .insertAfter($link)
        .on("click", function() {
            var isActive = $(this).data("active") === "yes";

            $code.trigger(isActive ? "hide" : "show");

            $button
                .html(isActive ? "+" : "-")
                .data("active", isActive ? "no" : "yes");
        });

    $code
        .insertAfter($button)
        .on("hide", function() {
            $code.hide();
        })
        .on("show", function() {
            if ($(this).attr("data-loaded") !== "yes") {
                GM_xmlhttpRequest({
                    url: $code.attr("data-url"),
                    method: "GET",
                    onload: function(response) {
                        var $data = $(response.responseText);

                        $code
                            .show()
                            .attr("data-loaded", "yes")
                            .children().html($data.find("#wall").html());
                    }
                });
            } else {
                $code.show();
            }
        });
};

SK.moduleConstructors.DeblanWallModule.prototype.addCss = function() {
    $("body").append(
        $("<style>").html(this.getCss())
    );
}

SK.moduleConstructors.DeblanWallModule.prototype.shouldBeActivated = function() {
    return window.location.href.match(/http:\/\/www\.jeuxvideo\.com\/forums\/1/);
};

SK.moduleConstructors.DeblanWallModule.prototype.getCss = function() {
    var css = "\
        .msg .post .quote-message a span {\
            position: inherit; letter-spacing: 0;\
        }\
        .deblan-wall-button {\
            margin-left: 3px;\
        }\
        .deblan-wall-code {\
            margin-top: 3px\
        }\
    ";

    return css;
};

SK.moduleConstructors.DeblanWallModule.prototype.settings = {
    replaceLink: {
        title: "Afficher automatiquement le code associé au lien",
        description: "Afficher automatiquement le code associé au lien",
        default: false,
    }
};
