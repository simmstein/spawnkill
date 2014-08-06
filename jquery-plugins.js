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

$.fn.spin = function(opts, color) {

  return this.each(function() {
    var $this = $(this),
      data = $this.data();

    if (data.spinner) {
      data.spinner.stop();
      delete data.spinner;
    }
    if (opts !== false) {
      opts = $.extend(
        { color: color || $this.css("color") },
        $.fn.spin.presets[opts] || opts
      );
      data.spinner = new Spinner(opts).spin(this);
    }
  });
};

$.fn.spin.presets = {
  tiny: {
    lines: 10,
    length: 3,
    width: 2,
    radius: 5,
    color: "#888"
  }
};