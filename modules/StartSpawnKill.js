"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * StartSpawnKill : Module requis de SpawnKill, 
 * permet de mettre en place la structure du script
 */
SK.moduleConstructors.StartSpawnKill = SK.Module.new();

SK.moduleConstructors.StartSpawnKill.prototype.id = "StartSpawnKill";
SK.moduleConstructors.StartSpawnKill.prototype.title = "Module Principal";
SK.moduleConstructors.StartSpawnKill.prototype.description = "Permet de mettre en place la structure générale de SpawnKill.";
SK.moduleConstructors.StartSpawnKill.prototype.required = true;

SK.moduleConstructors.StartSpawnKill.prototype.init = function() {
    this.addModalBackground();
    this.correctSplitPost();
    this.bindPopinEvent();
};

/* Ajoute l'évenement permettant d'ouvrir les images dans des fenêtres modales */
SK.moduleConstructors.StartSpawnKill.prototype.bindPopinEvent = function() {

    setTimeout(function() {

        $("body").on("click", "img[data-popin]", function(event) {

            event.preventDefault();
            var $img = $(this);
            var imgSrc = $img.attr("data-popin");
            var modalTitle = $img.attr("title");
            var $modalImg = $("<img>", { src: imgSrc, alt: $img.attr("alt")});

            var popinImage = function() {

                var buttons = [];

                if(navigator.userAgent.toLowerCase().indexOf("chrome") > -1 &&
                    navigator.userAgent.toLowerCase().indexOf("opr") === -1
                ) {
                    buttons.push(new SK.Button({
                        class: "large",
                        text: "Télécharger",
                        href: imgSrc,
                        download: modalTitle,
                        tooltip: {
                            class: "large",
                            text: "Télécharger l'image",
                            position: "bottom"
                        }
                    }));
                }

                SK.Util.showModal(new SK.Modal({
                    class: "popin-modal",
                    location: "center",
                    title: modalTitle,
                    content: $modalImg,
                    buttons: buttons
                }));

            };

            //On affiche l'écran de chargement de la modale
            SK.Util.showModalLoader();

            //Ouvre une modale au centre de l'écran quand l'image est prête
            SK.Util.preload($modalImg, function() {

                //On contraint la taille de l'image
                $modalImg.css("max-width", Math.min($modalImg.get(0).width,  $(window).width() - 80) + "px");
                $modalImg.css("max-height", Math.min($modalImg.get(0).height,  $(window).height() - 100) + "px");

                popinImage();
            });
        });

    }.bind(this), 1000);
};

/** prépare le terrain pour les modales */
SK.moduleConstructors.StartSpawnKill.prototype.addModalBackground = function() {
    $("body")
        .prepend("<div id='modal-loader'></div>")
        .prepend($("<div>", {
            id: "modal-background",
            click: function() {
                SK.Util.hideModal();
            }
        }));
};


SK.moduleConstructors.StartSpawnKill.prototype.correctSplitPost = function() {

    var $splitPost = $(".suite_sujet").parents(".msg");
    $splitPost
        .addClass("not-loading")
        .css({
            "min-height": "0px"
        });
};

 SK.moduleConstructors.StartSpawnKill.prototype.getCss = function() {
    var css = "\
        .msg .post {\
            overflow: visible !important;\
        }\
        #modal-background {\
            display: none;\
            position: fixed;\
            left: 0px;\
            top: 0px;\
            width: 100%;\
            height: 100%;\
            background-color: #EEE;\
            opacity: 0.9;\
            z-index: 2147483647;\
        }\
        #modal-loader {\
            display: none;\
            position: fixed;\
            width: 40px;\
            height: 40px;\
            background-image: url('" + GM_getResourceURL("big-loader") + "');\
            background-repeat: no-repeat;\
            z-index: 2147483648;\
            opacity: 0.3;\
        }\
        .modal-box {\
            position: fixed;\
            left: 50%;\
            padding: 10px;\
            border-bottom: solid 1px #AAA;\
            text-align: left;\
            border-radius: 4px;\
            background-color: #FFF;\
            box-shadow: 0 10px 20px 2px rgba(0, 0, 0, 0.4);\
            z-index: 2147483649;\
            opacity: 0;\
            transition-duration: 400ms;\
        }\
        .modal-box.center {\
            transform: scale(0.4);\
            transition-duration: 400ms;\
        }\
        .modal-box.top {\
            top: -400px;\
            width: 400px;\
            margin-left: -200px;\
            border-radius: 0 0 4px 4px;\
        }\
        .modal-box.notification {\
            left: auto;\
            top: -400px;\
            right: 10px;\
            width: 340px;\
            transition-duration: 600ms;\
        }\
        .modal-box.active {\
            opacity: 1;\
        }\
        .modal-box.center.active {\
            transform: scale(1);\
            opacity: 1;\
        }\
        .modal-box.top.active {\
            top: 0px;\
        }\
        .modal-box.notification.active {\
            top: 10px;\
        }\
        .modal-box h3 {\
            color: #FF7B3B;\
            overflow: visible !important;\
        }\
        .modal-box hr {\
            display: block;\
            height: 0px;\
            position: relative;\
            padding: 0;\
            margin: 0;\
            margin-top: 10px;\
            border: none;\
            border-bottom: solid 1px #DDD;\
        }\
        .modal-box.top hr,\
        .modal-box.notification hr {\
            display: block;\
            width: 420px;\
            height: 0px;\
            position: relative;\
            left: -10px;\
            padding: 0;\
            margin: 0;\
            margin-top: 10px;\
            border: none;\
            border-bottom: solid 1px #DDD;\
        }\
        .modal-box.notification hr {\
            width: 360px;\
        }\
        .popin-modal h3,\
        .popin-modal .content,{\
            text-align: center;\
        }\
        .popin-modal h3 {\
            margin-bottom: 10px;\
        }\
        .popin-modal hr {\
            display: none;\
        }\
        .popin-modal .content {\
            text-align: center;\
        }\
        .sk-button {\
            position: relative;\
            display: inline-block !important;\
            margin-left: 4px;\
            vertical-align: top;\
        }\
        .buttons {\
            display: inline-block;\
            vertical-align: top;\
            -webkit-user-select: none;\
            -moz-user-select: none;\
            user-select: none;\
        }\
        .buttons.right {\
            position: relative;\
            top: -1px;\
        }\
        .buttons.box {\
            width: 100%;\
        }\
        .modal-box.center .buttons.box .sk-button {\
            margin-top: 10px;\
        }\
        .sk-button-content {\
            background-color: #FF7B3B;\
            display: inline-block;\
            vertical-align: top;\
            position: relative;\
            height: 13px;\
            width: 16px;\
            box-sizing: content-box;\
            border: 0;\
            padding: 0;\
            border-bottom: solid 2px #BC3800;\
            color: #FFF !important;\
            border-radius: 2px;\
            cursor: pointer;\
            background-position: 0px -1px;\
            background-repeat: no-repeat;\
        }\
        .sk-button-content:hover {\
            color: #FFF !important;\
        }\
        .sk-button-content:focus {\
            color: #FFF !important;\
            outline: none;\
        }\
        .sk-button-content:active {\
            margin-top: 1px;\
            border-bottom-width: 1px;\
            outline: none;\
        }\
        .sk-button-content.large {\
            height: auto;\
            width: auto;\
            padding: 6px 10px;;\
        }\
        .sk-button-content.minor {\
            background-color: #A3A3A3;\
            border-bottom-color: #525252;\
        }\
        .sk-button-content.transparent {\
            background-color: transparent;\
            border-bottom-color: transparent;\
        }\
        .sk-button.close {\
            float: right;\
            margin-top: 1px;\
        }\
        .sk-button-content.close {\
            width: 18px;\
            height: 18px;\
            background-image: url('" + GM_getResourceURL("close") + "');\
        }\
        .buttons.box .sk-button {\
            float: right;\
            margin-left: 10px;\
        }\
        .tooltip {\
            display: none;\
            position: absolute;\
            padding: 4px;\
            background-color: #222;\
            font-size: 10px;\
            font-weight: normal;\
            text-align: center;\
            color: #FFF;\
            opacity: 0.8;\
            z-index: 100;\
        }\
        .tooltip:after {\
            content: \"\";\
            position: absolute;\
            left: 8px;\
            border: solid 4px transparent;\
        }\
        .tooltip.large:after {\
            left: 28px;\
        }\
        .tooltip.top {\
            top: -27px;\
            left: -4px;\
        }\
        .tooltip.bottom {\
            bottom: -27px;\
        }\
        .tooltip.bottom.large {\
            bottom: -28px;\
        }\
        .tooltip.bottom-right {\
            bottom: -28px;\
            right: 0px;\
        }\
        .tooltip.right {\
            top: -3px;\
            left: 24px;\
        }\
        .tooltip.top:after {\
            bottom: -8px;\
            border-top-color: #222;\
        }\
        .tooltip.bottom:after {\
            top: -8px;\
            border-bottom-color: #222;\
        }\
        .tooltip.bottom-right:after {\
            top: -8px;\
            right: 8px;\
            left: auto;\
            border-bottom-color: #222;\
        }\
        .tooltip.bottom-right.large:after {\
            right: 28px;\
        }\
        .tooltip.right:after {\
            left: -8px;\
            border-right-color: #222;\
        }\
        .sk-button:hover .tooltip {\
            display: block;\
        }\
        .slide-toggle {\
            display: inline-block;\
            vertical-align: middle;\
            box-sizing: content-box;\
            margin: 2px 0;\
            padding: 0;\
            border: none;\
            height: 20px;\
            width: 34px;\
            cursor: pointer;\
        }\
        .slide-toggle input {\
            display: none;\
        }\
        .slide-toggle input + .slide-toggle-style {\
            position: relative;\
            width: 100%;\
            height: 100%;\
            border-radius: 50px;\
            background-color: #A3A3A3;\
            box-shadow: 0 0 2px 0px #555 inset;\
            transition-duration: 300ms;\
        }\
        .slide-toggle input + .slide-toggle-style:after {\
            content: \"\";\
            display: inline-block;\
            position: absolute;\
            left: 2px;\
            top: 2px;\
            height: 16px;\
            width: 16px;\
            border-radius: 50%;\
            background-color: #FFF;\
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2);\
            transition-duration: 300ms;\
        }\
        .slide-toggle :checked + .slide-toggle-style {\
            background-color: #FF7B3B;\
            box-shadow: 0 0 2px 0px #BC3800 inset;\
        }\
        .slide-toggle :checked + .slide-toggle-style:after {\
            left: 16px;\
        }\
        .slide-toggle :disabled + .slide-toggle-style {\
            background-color: #BBB;\
            box-shadow: 0 0 2px 0px #777 inset;\
            opacity: 0.8;\
            cursor: auto;\
        }\
        .slide-toggle :disabled:checked + .slide-toggle-style {\
            background-color: #D17C53;\
            box-shadow: 0 0 2px 0px #A05838 inset;\
            opacity: 0.8;\
            cursor: auto;\
        }\
        .slide-toggle :disabled + .slide-toggle-style:after {\
            background-color: #D1D1D1;\
        }\
      ";

    return css;
 };