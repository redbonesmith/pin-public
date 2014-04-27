// Generated by CoffeeScript 1.4.0
(function() {
  var add_error_message, clear_all_error_messages, disableMiddleMouseButtonScrolling, disableNormalScroll, disable_scroll, dragging_header_background, enable_scroll, get_more_items, otherX, otherY, prepare_form_to_send, removeRePin, simplify_url, validate_edit_pin_form, x, y;

  removeRePin = function(e, y) {
    var result;
    result = window.confirm("Are you sure you want to remove this picture ?");
    if (result) {
      return $.get("/remove-from-own-getlist", {
        pinid: e,
        repinid: y
      }, function(response) {
        var id;
        if (response.error) {
          alert("An error occured, please refresh the page and try again later");
        } else {
          id = "#horz-pin" + e;
          $(id).fadeOut();
        }
      });
    }
  };

  $("#save_thumbnail_edit").click(function() {
    location.reload(true);
  });

  $("#set_as_profile_pic").click(function() {
    var picid;
    picid = $(".modal .active img").attr("picid");
    return $.get("/setprofilepic/" + picid, function(response) {
      location.reload(true);
    });
  });

  dragging_header_background = false;

  x = 0;

  y = 0;

  otherX = 0;

  otherY = 0;

  $("#header_background").mousedown(function(e) {
    var _ref;
    _ref = void 0;
    x = e.pageX;
    y = e.pageY;
    _ref = $(this).css("background-position").split(" ");
    otherX = _ref[0];
    otherY = _ref[1];
    return dragging_header_background = true;
  });

  $("body").mouseup(function() {
    var tempX, tempY, _ref;
    tempX = void 0;
    tempY = void 0;
    _ref = void 0;
    if (dragging_header_background) {
      dragging_header_background = false;
      _ref = $("#header_background").css("background-position").split(" ");
      otherX = _ref[0];
      otherY = _ref[1];
      tempX = parseInt(otherX.slice(0, +(otherX.length - 2) + 1 || 9e9));
      tempY = parseInt(otherY.slice(0, +(otherY.length - 2) + 1 || 9e9));
      return $.post("/changebgpos", {
        x: tempX,
        y: tempY
      });
    }
  });

  $("#header_background").mousemove(function(e) {
    var tempY, upload;
    tempY = void 0;
    if (dragging_header_background) {
      upload = false;
      tempY = parseInt(otherY.slice(0, +(otherY.length - 2) + 1 || 9e9));
      if (tempY + (e.pageY - y) < 0) {
        return $(this).css("background-position", otherX + " " + (tempY + (e.pageY - y)) + "px");
      }
    }
  });

  $("#switch5_wrapper").mouseover(function() {
    return $("#menu5").show();
  });

  $("#switch5_wrapper").mouseout(function() {
    return $("#menu5").hide();
  });

  $("#myTab a").click(function(e) {
    e.preventDefault();
    $(this).tab("show");
  });

  $('.editPinModal').on('submit', event, function() {
    var form;
    form = $(this);
    if (validate_edit_pin_form(form)) {
      prepare_form_to_send(form);
      return true;
    }
    return false;
  });

  validate_edit_pin_form = function(form) {
    var is_ok;
    is_ok = true;
    clear_all_error_messages(form);
    if (form.find('#link').val() === '' && form.find('#product_url').val() === '') {
      add_error_message(form.find('#link'), 'Provide a link');
      add_error_message(form.find('#product_url'), 'Provide a link');
      is_ok = false;
    }
    if (form.find('#board_id').val() === '' && form.find('#board_name').val() === '') {
      add_error_message(form.find('#layer_add_new_board'), 'Select a board or create a new one');
      is_ok = false;
    }
    if (form.find('#title').val() === '') {
      add_error_message(form.find('#title'), 'Provide a title');
      is_ok = false;
    }
    if (form.find('input[name="price_range"]:checked').val() === void 0) {
      add_error_message(form.find('#price_range'), 'Select a price range');
      is_ok = false;
    }
    if (form.find('input[name="category_check"]:checked').val() === void 0) {
      add_error_message(form.find('#categories'), 'Select a category');
      is_ok = false;
    }
    return is_ok;
  };

  prepare_form_to_send = function(form) {
    var categories_list, _i, _len, _ref;
    categories_list = '';
    _ref = form.find('input[name="category_check"]:checked');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      x = _ref[_i];
      if (categories_list !== '') {
        categories_list = categories_list + ',';
      }
      categories_list = categories_list + x.value;
    }
    return form.find('input[name="categories"]').val(categories_list);
  };

  add_error_message = function(item, message) {
    return item.after('<div class="red">' + message + '</div>');
  };

  clear_all_error_messages = function(form) {
    return form.find('div.red').remove();
  };

  $('#profile_lists_tabs').tabs();

  $.offsetctrl = Array();

  $.loading = Array();

  $.column = Array();

  $.pin_template = _.template($('#pin_template').html());

  $.current_board = $('.profile_list_subtab:first').attr('boardid');

  $('.profile_list_subtab').on('click', function(event) {
    var boardid, loading;
    boardid = $(this).attr('boardid');
    loading = $.loading[boardid];
    if (loading === true) {
      return;
    }
    $.current_board = boardid;
    get_more_items();
  });

  get_more_items = function() {
    var boardid, offset;
    boardid = $.current_board;
    $.loading[boardid] = true;
    offset = $.offsetctrl[boardid];
    if (offset === void 0) {
      offset = 0;
      $.offsetctrl[boardid] = 0;
    } else {
      offset += 1;
      $.offsetctrl[boardid] += 1;
    }
    $.getJSON('/lists/' + boardid + '/items/?offset=' + offset, function(data) {
      var column, html_text, pin, selector, _i, _len;
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        pin = data[_i];
        column = $.column[boardid];
        if (column === void 0) {
          column = 1;
          $.column[boardid] = 1;
        }
        pin['simplifiedurl'] = simplify_url(pin['link']);
        if (pin['tags'] !== null) {
          pin['taglist'] = pin['tags'].split(' ');
        }
        html_text = $.pin_template(pin);
        selector = '#column_' + boardid + '_' + column;
        $(selector).append(html_text);
        if ($.column[boardid] === 5) {
          $.column[boardid] = 1;
        } else {
          $.column[boardid] += 1;
        }
      }
      $.loading[boardid] = false;
    });
  };

  simplify_url = function(url) {
    var first_slash_position, simplified;
    simplified = url;
    if (simplified.indexOf('http:') === 0) {
      simplified = simplified.substring(6, simplified.length - 1);
    }
    if (simplified.indexOf('https:') === 0) {
      simplified = simplified.substring(7, simplified.length - 1);
    }
    if (simplified.indexOf('//') === 0) {
      simplified = simplified.substring(2, simplified.length - 1);
    }
    if (simplified.indexOf('/') === 0) {
      simplified = simplified.substring(1, simplified.length - 1);
    }
    first_slash_position = simplified.indexOf('/');
    if (first_slash_position > 0) {
      simplified = simplified.substring(0, first_slash_position);
    }
    return simplified;
  };

  $(window).scroll(function() {
    var doc_height, height, sensitivity, top;
    top = $(window).scrollTop();
    height = $(window).innerHeight();
    doc_height = $(document).height();
    sensitivity = 600;
    if (top + height + sensitivity > doc_height) {
      get_more_items();
    }
  });

  $(document).on('click', '.category_pin_image', function(event) {
    var pinid;
    event.preventDefault();
    pinid = $(this).attr('pinid');
    $.get('/p/' + pinid + '?embed=true', function(data) {
      var current_position;
      $('#show_pin_layer_content').html(data);
      current_position = $('#show_pin_layer_content').position();
      current_position.top = $(window).scrollTop();
      $('#show_pin_layer_content').css(current_position);
      $('#show_pin_layer').width($(window).width());
      $('#show_pin_layer').height($(window).height());
      $('#show_pin_layer').show();
      disable_scroll();
    });
  });

  $('#show_pin_layer').on('click', function(event) {
    event.preventDefault();
    $(this).hide();
    enable_scroll();
  });

  $('#show_pin_layer_content').on('click', function(event) {
    event.stopPropagation();
    event.stopInmediatePropagation();
  });

  disable_scroll = function() {
    $(document).on('mousedown', disableMiddleMouseButtonScrolling);
    $(document).on('mousewheel DOMMouseScroll wheel', disableNormalScroll);
    $(window).on('scroll', disableNormalScroll);
    return $.oldScrollTop = $(document).scrollTop();
  };

  enable_scroll = function() {
    $(document).off('mousedown', disableMiddleMouseButtonScrolling);
    $(document).off('mousewheel DOMMouseScroll wheel', disableNormalScroll);
    return $(window).off('scroll', disableNormalScroll);
  };

  disableMiddleMouseButtonScrolling = function(e) {
    if (e.which === 2) {
      if (e.target.id !== 'show_pin_layer') {
        $('html, body').scrollTop($.oldScrollTop);
        return true;
      }
      e.preventDefault();
    }
    return false;
  };

  disableNormalScroll = function(e) {
    if (e.target.id !== 'show_pin_layer') {
      $('html, body').scrollTop($.oldScrollTop);
      return true;
    }
    e.preventDefault();
    $('html, body').scrollTop($.oldScrollTop);
    return false;
  };

  get_more_items();

  jQuery(function() {
    return $.ajaxSetup({
      cache: false
    });
  });

}).call(this);
