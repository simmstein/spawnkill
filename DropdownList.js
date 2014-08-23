"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * Représente une dropdownlist de SpawnKill, options possibles :
 * value (string) : valeur par défaut
 * values Object : Liste de valeurs de la forme { value: "Label", value2: "Label 2" }
 * select : Options jQuery du select
 * + options habituelles d'un objet jQuery
 */
SK.DropdownList = function(options) {

    options = options || {};
    var defaultValue = options.value || false;
    delete options.value;
    var values = options.values || {};
    delete options.values;
    var selectOptions = options.select || {};
    delete options.select;

    var $dropdown = $("<span>", options);
    $dropdown.addClass("sk-dropdown");

    var $select = $("<select>", selectOptions);

    $select.addClass("sk-dropdown-select");

    //On ajoute les options
    for(var value in values) {

        var $option = $("<option>", {
            value: value,
            text: values[value]
        });

        $select.append($option);

        //On sélectionne la valeur par défaut
        if(defaultValue === value) {
            $option.prop("selected", true);
        }
    }

    $dropdown.append($select);
        
    return $dropdown;
    
};