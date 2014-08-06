"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * Représente un toggle ON/OFF de SpawnKill, options possibles :
 * value : valeur par défaut
 * options d'un objet jQuery
 */
SK.SlideToggle = function(options) {

    options = options || {};
    var defaultValue = options.value || false;
    delete options.value;
    var checkboxOptions = options.checkbox || {};
    delete options.checkbox;

    var $toggle = $("<label>", options);
    $toggle.addClass("slide-toggle");

    var $checkbox = $("<input>", checkboxOptions);
    $checkbox
        .attr("type", "checkbox")
        .prop("checked", defaultValue);

    var $slide = $("<div>", {
        class: "slide-toggle-style"
    });

    $toggle.append($checkbox);
    $toggle.append($slide);
        
    return $toggle;
    
};