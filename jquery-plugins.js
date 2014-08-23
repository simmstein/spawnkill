"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/* Focus sur l'élément sans scroll */
$.fn.focusWithoutScrolling = function() {
  var x = window.scrollX, y = window.scrollY;
  this.focus();
  window.scrollTo(x, y);
  return this;

};

/* Scroll à l'élément concerné avec une animation, appelle le callback à la fin du scroll */
$.fn.scrollThere = function(delay, callback) {

    delay = delay || 300;

    $("html, body").animate({
        scrollTop: $(this).offset().top
    }, delay, function() {
        if(typeof callback === "function") {
            callback();
        }
    });

    return this;
};