// Custom Scripts for Array Template //

jQuery(function ($) {
  "use strict";

  // get the value of the bottom of the #main element by adding the offset of that element plus its height, set it as a variable
  var mainbottom = $("#main").offset().top;

  // on scroll,
  $(window).on("scroll", function () {
    // we round here to reduce a little workload
    stop = Math.round($(window).scrollTop());
    if (stop > mainbottom) {
      $(".navbar").addClass("past-main");
      $(".navbar").addClass("effect-main");
    } else {
      $(".navbar").removeClass("past-main");
    }
  });

  // Collapse navbar on click

  $(document).on("click.nav", ".navbar-collapse.in", function (e) {
    if ($(e.target).is("a")) {
      $(this).removeClass("in").addClass("collapse");
    }
  });

  $(window).on("load", function () {
    setTimeout(function () {
      $("#loading").fadeOut("slow", function () {});
    }, 3000);
  });
});
