"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * StartSpawnKill : Module requis de SpawnKill, 
 * permet de mettre en place la structure du script
 */
SK.moduleConstructors.StartSpawnKill = SK.Module.new();

SK.moduleConstructors.StartSpawnKill.prototype.title = "Module Principal";
SK.moduleConstructors.StartSpawnKill.prototype.description = "Permet de mettre en place la structure générale de SpawnKill.";
SK.moduleConstructors.StartSpawnKill.prototype.required = true;

SK.moduleConstructors.StartSpawnKill.prototype.init = function() {
    this.addModalBackground();
};

/** prépare le terrain pour les modales */
SK.moduleConstructors.StartSpawnKill.prototype.addModalBackground = function() {
    $("body").prepend($("<div>", {
        id: "modal-background",
        click: function() {
            SK.Util.hideModal();
        }
    }));
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
        .modal-box {\
            position: fixed;\
            left: 50%;\
            top: -400px;\
            width: 400px;\
            padding: 10px;\
            margin-left: -200px;\
            border-bottom: solid 1px #AAA;\
            text-align: left;\
            border-radius: 0 0 4px 4px;\
            background-color: #FFF;\
            box-shadow: 0 10px 20px 2px rgba(0, 0, 0, 0.4);\
            z-index: 2147483649;\
            opacity: 0;\
            transition-duration: 400ms;\
        }\
        .modal-box.active {\
            opacity: 1;\
            top: 0px;\
        }\
        .modal-box h3 {\
            color: #FF7B3B;\
        }\
        .modal-box hr {\
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
        .sk-button {\
            position: relative;\
            display: inline-block !important;\
            margin-left: 4px;\
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
        }\
        .sk-button-content:hover {\
            color: #FFF !important;\
        }\
        .sk-button-content:focus {\
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