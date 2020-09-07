function product_makePage() {
  $('body').removeClass('login-page-bg-color');
  product_header();
  product_body();
}

function product_header() {
  $('#navbar').show();
  //insertHeaderbar(0,0,0,'displayEnquirySearchForm();');
  $('#scrollerContentDiv').css('background-color', '#FFFFFF');
  //insertSideLbar();
}

var paginated = false;
var category = 0;
var colType = 'D';
var pageno = 1;

function product_body(prod_seq) {

  if (!paginated) {
    $("#scrollerContentDiv").scroll(function () {
      if ($("#prod_list:visible").length > 0) {
        //console.log(($(this)[0].scrollHeight - $(this).scrollTop() === (Math.round($(this).outerHeight()))))
        if (($(this)[0].scrollHeight - $(this).scrollTop() === (Math.round($(this).outerHeight())))) {
          showProducts(category, pageno + 1)
        }
      }
    });
  }
  showProducts();
}

var fetching = false;

function showProducts(cat, page) {
  if (fetching) {
    return;
  }
  setTimeout(function () {
    fetching = false;
  }, 5000);

  cat = cat || 0;
  page = page || 1;

  colType = STUDENT_DETAILS.app_info['appcol_status'] != 'S' ? 'D' : 'S';
  category = cat;
  pageno = page;

  //console.log(category, pageno)
  var catid = category;

  if (pageno == 1) {
    $('#scrollerContentDiv').html('');
  }

  closeSlideBar();
  $.post(HOST_NAME + '/my/mobile_services/prodProcessRequest', {
        cmd: "getProductList",
        pageno: pageno,
        seq: CENTER_SEQ,
        category: category
      },
      function (response) {
        fetching = false;
        if (parseResponse(response)) {
          if ($.trim(response) != '') {
            var data = $.parseJSON(response);
            var quotationList = JSON.parse(getLocalStorage('quotationList', '{}'));
            //console.log(data);
            var html = pageno == 1 && catid == '0' ? getBannerHtml() : '';
            var colclass = colType == 'D' ? 'col-6' : 'col-12';
            $.each(data, function (i, data) {
              if (data.profilepic == '') {
                return;
              }

              var inStorage = quotationList[data.product_seq] ? true : false;
              html += '<div id="product_' + data.product_seq + '" class="prod prod-listing curptr py-2 ' + colclass + '" onclick="displayProduct(' + data.product_seq + ');">\
                            <div id="prod_' + data.product_seq + '" class="hidden">' + JSON.stringify(data) + '</div>\
                            <div class=" prodimg  px-2 text-center"><div class="m-auto" style="background-image: url(\'' + HOST_NAME + data.profilepic + '\');"></div></div>\
                            <div class="font-12 title mt-1 font-weight-bold">' + data.name + '</div>\
                            <div class=" text-muted desc font-12">' + data.description + '</div>\
                            <div class="font-12 mt-1 text-danger title font-weight-bold ' + (data.sell_price == '0' ? 'hidden' : '') + '">' + STUDENT_DETAILS.app_info['currency'] + ' ' + data.sell_price + '</div>';
              html += STUDENT_DETAILS.app_info['add_quot'] != 'A' ? '' : ' <div id="add_cart_' + data.product_seq + '" data-prodseq="' + data.product_seq + '" class="text-muted add_cart_' + data.product_seq + ' mt-1 mb-2 d-flex add-cart justify-content-center font-12 ' + (STUDENT_DETAILS.app_info['add_quot'] == 'A' ? '' : 'hidden') + '">\
                              <button type="button"  class="btn cntrl btn-info btn-wide btn-sm minus align-self-center ' + (inStorage ? '' : 'hidden') + ' p-1 px-2">-</button>\
                              <span class="align-self-center cntrl text-secondary ' + (inStorage ? '' : 'hidden') + ' px-2"><input type="number" class="qty qty-' + data.product_seq + '" value="' + (inStorage ? quotationList[data.product_seq] : '') + '" size="4" style="width: 40px;" /></span>\
                              <button type="button" class="btn cntrl btn-info btn-sm btn-wide ' + (inStorage ? '' : 'hidden') + ' plus align-self-center p-1 px-2">+</button>\
                              <span class="align-self-center add-cart-btn btn btn-sm plus btn-info p-0 px-1  ' + (inStorage ? 'hidden' : '') + '">Add to cart</span>\
                            </div>';
              html += '  </div>';
            });

            if (pageno == 1) {
              html = html == '' ? '<p class="text-center mt-0">No products found.</p>' : html;
              $('#scrollerContentDiv').html('<div id="prod_list" class="">' + html + '</div>');
              $('.carousel').carousel();
            } else {
              $('#prod_list').append(html);
            }

            $(".prod-listing:not(.initialised) .plus, .prod-listing:not(.initialised) .minus").click(function (e) {
              e.preventDefault();
              e.stopPropagation();
              updateQty(e);
            });

            $(".prod-listing:not(.initialised) .qty").keyup(function (e) {
              updateQty(e);
              e.preventDefault();
              e.stopPropagation();
            });

            $(".prod-listing:not(.initialised) .qty").click(function (e) {
              e.preventDefault();
              e.stopPropagation();
            });

            $(".prod-listing:not(.initialised) .qty").change(function (e) {
              e.preventDefault();
              e.stopPropagation();
              updateQty(e);
            });

            $('.prod-listing:not(.initialised)').addClass('initialised');
          }
        }
      });
}

function updateQty(e) {
  var prod_seq = $(e.target).hasClass('qty') ? $(e.target).parent().parent().data('prodseq') : $(e.target).parent().data('prodseq');
  var quotationList = JSON.parse(getLocalStorage('quotationList', '{}'));
  var qty = $.trim($('#add_cart_' + prod_seq + ' .qty').val());
  qty = parseInt(qty) == qty ? parseFloat(qty) : 0;

  if ($(e.target).hasClass('qty')) {
    if (parseFloat(qty) == qty) {
      quotationList[prod_seq] = qty;
      setLocalStorage('quotationList', JSON.stringify(quotationList));
    } else {
      quotationList[prod_seq] = 0;
      setLocalStorage('quotationList', JSON.stringify(quotationList));
    }
    return;
  }

  var increase = $(e.target).hasClass('plus') ? true : false;
  if (increase && $('#product_' + prod_seq + ' .add-cart-btn:visible').length > 0) {
    $('.qty-' + prod_seq + '').val(1);
    $('.add_cart_' + prod_seq + ' .add-cart-btn:visible').addClass('hidden');
    $('.add_cart_' + prod_seq + ' .cntrl').removeClass('hidden');
    qty = 1;
  } else if (!increase && qty <= 1) {
    $('.qty-' + prod_seq + '').val(0);
    $('.add_cart_' + prod_seq + ' .cntrl').addClass('hidden');
    $('.add_cart_' + prod_seq + ' .add-cart-btn').removeClass('hidden');
    qty = 0;
  } else if (qty != '' && parseFloat(qty) > 0) {
    qty = increase ? parseFloat(qty) + 1 : parseFloat(qty) - 1;
    qty = qty <= 0 ? 0 : qty;
    $('.qty-' + prod_seq + '').val(qty);
  }

  quotationList[prod_seq] = parseFloat(qty);
  setLocalStorage('quotationList', JSON.stringify(quotationList));
}

function updateProdDetailQty(e) {
  var prod_seq = $(e.target).hasClass('qty') ? $(e.target).parent().parent().data('prodseq') : $(e.target).parent().data('prodseq');
  var quotationList = JSON.parse(getLocalStorage('quotationList', '{}'));
  var qty = $.trim($('#product_details .qty').val());
  qty = parseInt(qty) == qty ? parseFloat(qty) : 0;

  if ($(e.target).hasClass('qty')) {
    if (parseFloat(qty) == qty) {
      quotationList[prod_seq] = qty;
      setLocalStorage('quotationList', JSON.stringify(quotationList));
    } else {
      quotationList[prod_seq] = 0;
      setLocalStorage('quotationList', JSON.stringify(quotationList));
    }
    return;
  }

  var increase = $(e.target).hasClass('plus') ? true : false;
  if (increase && $('#product_details .add-cart-btn:visible').length > 0) {
    $('.qty-' + prod_seq + '').val(1);
    $('.add_cart_' + prod_seq + ' .add-cart-btn').addClass('hidden');
    $('.add_cart_' + prod_seq + ' .cntrl').removeClass('hidden');
    qty = 1;
  } else if (!increase && qty <= 1) {
    $('.qty-' + prod_seq + '').val(0);
    $('.add_cart_' + prod_seq + ' .cntrl').addClass('hidden');
    $('.add_cart_' + prod_seq + ' .add-cart-btn').removeClass('hidden');
    qty = 0;
  } else if (qty != '' && parseFloat(qty) > 0) {
    qty = increase ? parseFloat(qty) + 1 : parseFloat(qty) - 1;
    qty = qty <= 0 ? 0 : qty;
    $('.qty-' + prod_seq + '').val(qty);
  }

  quotationList[prod_seq] = parseFloat(qty);
  setLocalStorage('quotationList', JSON.stringify(quotationList))
}

function displayProduct(product_seq, appendtop) {

  var data = STUDENT_DETAILS.prod[product_seq]; //JSON.parse($('#prod_' + product_seq).html());
  var html = '';

  var pimages = data.pimages != '' ? JSON.parse(data.pimages) : [];
  if (data.profilepic != '') {
    pimages.unshift(data.profilepic);
  }

  if (pimages.length > 0) {
    html += '<div id="slider_' + data.product_seq + '" class="row carousel" data-interval="false" style="top:-1px;background: #222;">\
            <ol class="carousel-indicators">';
    $.each(pimages, function (i, val) {
      html += '<li data-target="#slider_' + data.product_seq + '"  data-slide-to="' + i + '" class="' + (i == 0 ? 'active' : '') + '"></li>';
    });

    html += '</ol>\
                <div class="carousel-inner" style=" width:100%; height: auto;">';
    $.each(pimages, function (i, data) {
      html += '<div class="carousel-item w-100 ' + (i == 0 ? 'active' : '') + '" style="background-image: url(\'' + HOST_NAME + data + '\')"></div>';
    });

    html += '<a class="carousel-control-prev" href="#slider_' + data.product_seq + '" role="button" data-slide="prev">\
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>\
                <span class="sr-only">Previous</span>\
                </a>\
                <a class="carousel-control-next" href="#slider_' + data.product_seq + '" role="button" data-slide="next">\
                <span class="carousel-control-next-icon" aria-hidden="true"></span>\
                <span class="sr-only">Next</span>\
                </a>';
    html += ' </div>\
            </div>';
  }

  var quotationList = JSON.parse(getLocalStorage('quotationList', '{}'));
  var inStorage = quotationList[data.product_seq] ? true : false;

  html += '<div class="font-weight-bold clearfix text-info mt-3 w-100"><div class="float-left t-12 title font-weight-bold w-100">' + data.name + '';
  html += STUDENT_DETAILS.app_info['add_quot'] == 'A' ? '' : '<div class="ml-2 py-0 float-right"> <a  class="text-dark" href="#" onclick="window.open(\'sms:'+STUDENT_DETAILS.app_info['mobile']+'?body=interested in '+data.name+'\', \'_system\');" style="text-decoration: none !important;"><img width="30" class="ml-1 mr-1" src="images/sms.png"></a> <a class="text-dark" href="#" onclick="window.open(\'https://api.whatsapp.com/send?phone=+91'+STUDENT_DETAILS.app_info['mobile']+'&text=interested in '+data.name+'\', \'_system\');" style="text-decoration: none !important;"><img width="30" class="ml-0 mr-0" src="images/whatsapp.png"></a></div></div></div>';

  html += STUDENT_DETAILS.app_info['add_quot'] != 'A' ? '' : '</div></div><div class="float-right text-info title font-weight-bold ' + (data.sell_price == '0' ? 'hidden' : '') + '">' + STUDENT_DETAILS.app_info['currency'] + ' ' + data.sell_price + '</div>' +
      '<div id="add_cart_' + data.product_seq + '" data-prodseq="' + data.product_seq + '" class="text-muted add_cart_' + data.product_seq + ' clearfix mt-1 mb-2 d-flex product-cart desc add-cart font-12 ' + (STUDENT_DETAILS.app_info['add_quot'] == 'A' ? '' : 'hidden') + '">\
        <button type="button"  class="btn cntrl btn-info btn-wide btn-sm minus align-self-center ' + (inStorage ? '' : 'hidden') + ' p-1 px-2">-</button>\
        <span class="align-self-center cntrl text-secondary ' + (inStorage ? '' : 'hidden') + ' px-2"><input type="number" class="qty qty-' + data.product_seq + '" value="' + (inStorage ? quotationList[data.product_seq] : '') + '" size="4" style="width: 40px;" /></span>\
        <button type="button" class="btn cntrl btn-info btn-sm btn-wide ' + (inStorage ? '' : 'hidden') + ' plus align-self-center p-1 px-2">+</button>\
        <span class="align-self-center add-cart-btn btn btn-sm plus btn-info p-0 px-1  ' + (inStorage ? 'hidden' : '') + '">Add to cart</span>\
        </div>';

  html += '<hr class="w-100 m-0 mt-2">';
  html += '<div class="font-weight-bold clearfix text-info mt-2 w-100"><div class="float-left t-12 title font-weight-bold ">Product Description </div> <div class="float-right text-danger title font-weight-bold ' + (data.sell_price == '0' || STUDENT_DETAILS.app_info['add_quot'] == 'A' ? 'hidden' : '') + '">' + STUDENT_DETAILS.app_info['currency'] + ' ' + data.sell_price + '</div></div>';
  html += '<div class="font-11 mt-2 clearfix text-muted w-100">' + data.pdetails + '</div><hr class="w-100 m-0 mt-2">';

  var specifications = data.specifications != '' ? JSON.parse(data.specifications) : [];
  if (specifications.length > 0) {
    html += '<div class="font-weight-bold text-info mt-3 mb-2 w-100">Specifications</div>';
    html += ' <table class="table table-bordered table-sm m-auto" style="max-width: 800px;">';
    $.each(specifications, function (i, obj) {
      html += '<tr>\
                    <th class="pl-2 text-center" scope="row">' + obj.key + '</th>\
                    <td class="pl-2 text-center">' + obj.value + '</td> \
                </tr>';
    });
    html += '</table>';
  }


  var videos = data.pvideos != '' ? JSON.parse(data.pvideos) : [];
  if (videos.length > 0) {
    html += '<div class="font-weight-bold text-info mt-3 mb-2 w-100">Videos</div>';
    $.each(videos, function (i, videoid) {
      html += '<div class="w-100 mt-3 text-center"><iframe width="320" height="160" src="https://www.youtube.com/embed/' + videoid + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
    });
    html += '</table>';
  }

  $('#prod_list').addClass('hidden');
  $('#menu-toggle').addClass('hidden');
  $('#goback').removeClass('hidden');
  $('#scrollerContentDiv').append('<div id="product_details" class="px-3 pb-3 w-100" style="'+(appendtop? 'top:57px;' : '')+'">' + html + '</div>');
  $('.carousel').carousel();

  $("#product_details .plus, #product_details .minus").click(function (e) {
    e.preventDefault();
    e.stopPropagation();
    updateProdDetailQty(e);
  });

  $("#product_details .qty").keyup(function (e) {
    updateProdDetailQty(e);
    e.preventDefault();
    e.stopPropagation();
  });
}

function getBannerHtml() {
  var banners = [STUDENT_DETAILS.website_config['banner'], STUDENT_DETAILS.website_config['banner1'], STUDENT_DETAILS.website_config['banner2'], STUDENT_DETAILS.website_config['banner3']];
  var images = [];
  $.each(banners, function (i, val) {
    if ($.trim(val) != '') {
      images.push(val);
    }
  });
  var html = '';

  if (images.length > 0) {

    html += '<div id="slider_banner" class=" carousel" data-ride="carousel" style="top:-1px;background: #222;">\
                <ol class="carousel-indicators">';

    var j = -1;
    $.each(images, function (i, val) {
      if ($.trim(val) != '') {
        ++j;
        html += '<li data-target="#slider_banner"  data-slide-to="' + j + '" class="' + (j == 0 ? 'active' : '') + '"></li>';
      }
    });

    html += '</ol>\
                    <div class="carousel-inner" style=" width:100%; height: auto;">';
    var j = -1;
    $.each(images, function (i, val) {
      if ($.trim(val) != '') {
        ++j;
        html += '<div class="carousel-item w-100 ' + (j == 0 ? 'active' : '') + '">\
                            <img class="d-block m-auto" src="' + getAttatchmentImg(val) + '"  style="width: 100%; height: auto;">\
                            </div>';
      }
    });

    html += '<a class="carousel-control-prev" href="#slider_banner" role="button" data-slide="prev">\
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>\
                    <span class="sr-only">Previous</span>\
                    </a>\
                    <a class="carousel-control-next" href="#slider_banner" role="button" data-slide="next">\
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>\
                    <span class="sr-only">Next</span>\
                    </a>';
    html += ' </div>\
                </div>';

    html += '<p class="text-center mt-3"><span class="badge p-2 font-14  badge-info">Featured Products</span></p>';
  }

  return html;
}

function displayProductList() {
  $('#product_details').remove();
  $('#goback').addClass('hidden');
  $('#menu-toggle').removeClass('hidden');
  $('#prod_list').removeClass('hidden');
}