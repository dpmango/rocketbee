'use strict';

// set dalay on scroll event to prevent huge memory leaks

(function ($) {
  var uniqueCntr = 0;
  $.fn.scrolled = function (waitTime, fn) {
    if (typeof waitTime === "function") {
      fn = waitTime;
      waitTime = 50;
    }
    var tag = "scrollTimer" + uniqueCntr++;
    this.scroll(function () {
      var self = $(this);
      var timer = self.data(tag);
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(function () {
        self.removeData(tag);
        fn.call(self[0]);
      }, waitTime);
      self.data(tag, timer);
    });
  };
})(jQuery);

// set dalay on resize event to prevent huge memory leaks
(function ($) {
  var uniqueCntr = 0;
  $.fn.resized = function (waitTime, fn) {
    if (typeof waitTime === "function") {
      fn = waitTime;
      waitTime = 50;
    }
    var tag = "scrollTimer" + uniqueCntr++;
    this.resize(function () {
      var self = $(this);
      var timer = self.data(tag);
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(function () {
        self.removeData(tag);
        fn.call(self[0]);
      }, waitTime);
      self.data(tag, timer);
    });
  };
})(jQuery);

// READY FUNCTION

$(document).ready(function () {

  // we have only one window and document - cache it
  var _window = $(window);
  var _document = $(document);

  // Prevent # behavior
  $('[href="#"]').click(function (e) {
    e.preventDefault();
  });

  // Smoth scroll
  $('a[href^="#section"]').click(function (e) {
    var el = $(this).attr('href');
    $('body, html').animate({
      scrollTop: $(el).offset().top }, 1000);
    return false;
  });

  // HAMBRUGER
  $('.js-toggleMobileMenu').on('click', function () {
    $(this).toggleClass('is-active');
    $('.navi-mobile').toggleClass('is-active');
  });

  ///////
  // UI
  ///////
  // -- select
  $('.ui-select').on('click', function (e) {
    $(this).toggleClass('active');
    triggerAutocompleateFocus($(this).find('input'));
  });

  $('.ui-select__drop span').on('click', function (e) {
    var currentValue = $(this).data('select');
    $(this).closest('.ui-select').find('label').text(currentValue);
    $(this).closest('.ui-select').find('label').addClass('selected');
    $('.ui-select').removeClass('ui-select--error');

    // paste  value
    $(this).closest('.ui-select').find('input[type="hidden"]').val(currentValue);
  });

  _document.click(function (e) {
    var _value = $('.ui-select');

    if (!_value.is(e.target) && _value.has(e.target).length === 0) {
      _value.removeClass('active');
    }
  });

  // dimox styler
  $('.js-styler__select').styler({});

  // AutoCompleate
  var options = {
    url: "json/cities.json",
    getValue: "name",
    list: {
      match: {
        enabled: true
      },
      maxNumberOfElements: 8
    },
    template: {
      type: "custom",
      method: function method(value, item) {
        return "<span>" + value + ",<span>" + item.country + "</span></span>";
      }
    }
  };

  $(".js-cityFromCompleate").easyAutocomplete(options);
  $(".js-cityToCompleate").easyAutocomplete(options);

  function triggerAutocompleateFocus(target) {
    var e = jQuery.Event("keyup", { keyCode: 65, which: 65 });
    target.focus();
    target.attr('value', '');
    target.triggerHandler(e);
    target.trigger('change');
  }

  // FOOTER REVEAL
  var bodyMargin = 0;
  _window.resized(100, function () {
    revealFooter();
  });

  function revealFooter() {
    var footerContainerHeight = $('.footer').outerHeight();
    $('body').css('margin-bottom', footerContainerHeight);
    bodyMargin = footerContainerHeight;
  };

  revealFooter();

  // owl
  $('#owlNews').owlCarousel({
    loop: false,
    nav: false,
    responsiveRefreshRate: 100,
    margin: 20,
    responsive: {
      0: {
        items: 1,
        dots: true
      },
      450: {
        items: 2,
        dots: true
      },
      768: {
        items: 3,
        dots: false,
        margin: 40
      }
    }
  });

  $('#owlTestimonials').owlCarousel({
    loop: true,
    center: true,
    nav: true,
    responsiveRefreshRate: 100,
    margin: 0,
    responsive: {
      0: {
        items: 1,
        dots: true,
        autoWidth: false
      },
      768: {
        autoWidth: true
      },
      992: {
        items: 1,
        dots: false,
        autoWidth: true
      }
    }
  });

  // CUSTOM NAV
  $('.owl-carousel__custom-nav .ico').on('click', function () {
    var target = $(this).parent().data('nav');

    var controlType = $(this).data('control');

    if (controlType == 'prev') {
      $('#' + target).find('.owl-prev').click();
    } else if (controlType == 'next') {
      $('#' + target).find('.owl-next').click();
    }
  });

  // Magnific Popup
  $('.popup-with-zoom-anim').magnificPopup({
    type: 'inline',
    fixedContentPos: false,
    fixedBgPos: true,
    overflowY: 'auto',
    closeBtnInside: true,
    preloader: false,
    midClick: true,
    removalDelay: 300,
    mainClass: 'my-mfp-zoom-in'
  });

  // MASK
  // $(".js-phoneMask").mask("0 (000) 000-0000");


  ///////////////
  // BACKOFFICE
  //////////////

  // DISABLE MEDIA QUERIES
  if ($('.app').is('.non-responsive')) {
    $('meta[name="viewport"]').prop('content', 'width=1200');
  }

  // TRIGGER USER DROPDOWN
  $('.header__user__trigger').on('click', function () {
    $(this).parent().toggleClass('is-active');
  });
  _document.click(function (e) {
    var _value = $('.header__user');
    if (!_value.is(e.target) && _value.has(e.target).length === 0) {
      _value.removeClass('is-active');
    }
  });

  // TRIGGER API KEY
  $('.backoffice__shop__apikey__trigger').on('click', function () {
    $(this).closest('.backoffice__shop__apikey').toggleClass('active');

    if ($(this).find('span').text() == 'API ключ') {
      $(this).find('span').text('скрыть');
    } else {
      $(this).find('span').text('API ключ');
    }
  });

  // TABLE
  $('#check_all').change(function () {
    var checkboxes = $(this).closest('.table').find(':checkbox');
    if ($(this).is(':checked')) {
      checkboxes.prop('checked', true);
    } else {
      checkboxes.prop('checked', false);
    }
  });

  $('.table__row').on('click', function () {
    var checkbox = $(this).find(':checkbox');
    console.log(checkbox);

    if (checkbox.is(':checked')) {
      checkbox.prop('checked', false);
    } else {
      checkbox.prop('checked', true);
    }
  });

  // STICKY FILTER
  // _window.on('scroll', function(){
  //   var stickyEl = $('.backoffice__sticky');
  //   var stickyElPos = stickyEl.offset().top;
  //   var windowHeight = _document.height();
  //   var stopPoint = windowHeight - bodyMargin;
  //
  //   if ( stickyElPos >= stopPoint){
  //     stickyEl.addClass('backoffice__sticky--stop');
  //   } else {
  //     stickyEl.removeClass('backoffice__sticky--stop');
  //   }
  // });
});