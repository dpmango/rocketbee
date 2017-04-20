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
  var startWindowScroll = 0;
  $('.popup-with-zoom-anim').magnificPopup({
    type: 'inline',
    fixedContentPos: true,
    fixedBgPos: true,
    overflowY: 'auto',
    closeBtnInside: true,
    preloader: false,
    midClick: true,
    removalDelay: 300,
    mainClass: 'my-mfp-zoom-in',
    callbacks: {
      beforeOpen: function beforeOpen() {
        // $('html').addClass('mfp-helper');
        startWindowScroll = $(window).scrollTop();
      },
      open: function open() {
        if ($('.mfp-content').height() < $(window).height()) {
          $('body').on('touchmove', function (e) {
            e.preventDefault();
          });
        }
      },
      close: function close() {
        // $('html').removeClass('mfp-helper');
        $(window).scrollTop(startWindowScroll);
        $('body').off('touchmove');
      }
    }
  });

  // MASK
  // $(".js-phoneMask").mask("0 (000) 000-0000");

  // TABS
  $('.tab__title').on('click', function () {
    var currentTab = $(this).data('tab');

    $('.tab__title').each(function (i, val) {
      if ($(val).data('tab') == currentTab) {
        $(val).addClass('active');
      } else {
        $(val).removeClass('active');
      }
    });

    $('.tab__content').each(function (i, val) {
      if ($(val).data('tab') == currentTab) {
        $(val).addClass('active');
      } else {
        $(val).removeClass('active');
      }
    });
  });

  ///////////////
  // BACKOFFICE
  //////////////

  // DISABLE MEDIA QUERIES
  if ($('.app').is('.non-responsive')) {
    $('meta[name="viewport"]').prop('content', 'width=1020');
  }
  if ($('.app').is('.developer')) {
    $('meta[name="viewport"]').prop('content', 'width=1400');
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

    if (checkbox.is(':checked')) {
      checkbox.prop('checked', false);
    } else {
      checkbox.prop('checked', true);
    }
    checkbox.trigger('change');
  });

  // SHOW XML
  $('.backoffice__show-xml a').on('click', function () {
    $(this).closest('.row').find('.backoffice__settings__yellow-bg--code').toggleClass('visible');

    if ($(this).text() == 'Показать XML-код заказа') {
      $(this).text('Скрыть XML-код заказа');
    } else {
      $(this).text('Показать XML-код заказа');
    }
  });

  // DEVELOPER

  $('.js-developer-filter').on('click', function () {
    $('.developer-overlay').addClass('active');
    $('.developer-filter__content').addClass('active');
  });

  $('.developer-overlay').on('click', function () {
    $('.developer-overlay').removeClass('active');
    $('.developer-filter__content').removeClass('active');
  });

  $('.table-dev__col.checkbox').on('click', function (e) {
    var checkbox = $(this).find(':checkbox');

    if (checkbox.is(':checked')) {
      checkbox.prop('checked', false);
    } else {
      checkbox.prop('checked', true);
    }
    checkbox.trigger('change');

    return false;
  });

  // STICKY FILTER
  _window.scrolled(10, function () {
    var stickyEl = $('.backoffice__sticky');
    var windowBottomScroll = _window.scrollTop() + _window.height();
    var stopPoint = _document.height() - bodyMargin;

    if (windowBottomScroll >= stopPoint) {
      stickyEl.addClass('backoffice__sticky--stop');
    } else if (windowBottomScroll < stopPoint) {
      stickyEl.removeClass('backoffice__sticky--stop');
    }
  });
});