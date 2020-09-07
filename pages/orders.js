function orders_makePage() {
  $('body').removeClass('login-page-bg-color');
  orders_header();
  orders_body();
}

function orders_header() {
  $('#navbar').show();
  $('#goback').addClass('hidden');
  $('#menu-toggle').removeClass('hidden');
  //insertHeaderbar(0,0,0,'displayEnquirySearchForm();');
  $('#scrollerContentDiv').css('background-color', '#FFFFFF');
  //insertSideLbar();
}


function orders_body() {
  if (!getLocalStorage('uservalidated', true) || getLocalStorage('usermobile', '') == '') {
    var html = '<div id="mobileblock" class="p-3">\
      <div class="form-group">\
        <label for="cmobile">Enter Mobile (used for orders)</label>\
        <input id="cmobile" type="text" placeholder="Enter 10 digit mobile number" size="10" class="form-control form-control-sm">\
      </div>\
       <div class="form-group text-right">\
        <button type="button" class="btn cntrl btn-secondary btn-sm btn-wide mr-2" onclick="showScreen(\'products\');">Back</button>\
        <button type="button" class="btn cntrl btn-danger btn-sm btn-wide" onclick="receiveOtp();">Receive OTP</button>\
      </div>\
      </div>\
      <div id="otpblock" class="p-3 hidden">\
      <div class="form-group">\
        <label for="otp">Enter OTP sent on your mobile</label>\
        <input type="text" id="otp" placeholder="Enter OTP" class="form-control form-control-sm">\
      </div>\
      <div class="form-group text-right">\
      <button type="button" class="btn cntrl btn-secondary btn-sm btn-wide mr-2" onclick="showScreen(\'products\');">Back</button>\
        <button type="button" class="btn cntrl btn-danger btn-sm btn-wide" onclick="receiveOtp();">Validate OTP</button>\
      </div></div>';
    $('#scrollerContentDiv').html(html);
  } else {
    fetchOrders();
  }
}

var otp = 0;
function receiveOtp() {
  if(!$('#otpblock').hasClass('hidden')){
    if($('#otp').data('server-otp') == $('#otp').val()){
      setLocalStorage('uservalidated', true);
      setLocalStorage('usermobile',  $.trim($('#cmobile').val()));
      fetchOrders();
    }else {
      alertPopUp('Please enter valid OTP');
    }
    return;
  }else{

    if( $.trim($('#cmobile').val()) == '' ||  $.trim($('#cmobile').val()).length < 10){
      alertPopUp('Please enter valid 10 digit mobile');
      return;
    }

    $.post(HOST_NAME + '/my/mobile_services/prodProcessRequest',
        {
          cmd: "receiveOtp",
          seq: CENTER_SEQ,
          mobile: $.trim($('#cmobile').val()),
          category: 'ei'
        },
        function (response) {
          $('#otp').data('server-otp', response);
          $('#mobileblock').addClass('hidden');
          $('#otpblock').removeClass('hidden');
        });
  }

}

var orders = [];
function fetchOrders() {

  $.post(HOST_NAME + '/my/mobile_services/prodProcessRequest',
      {
        cmd: "getQuotationList",
        seq: CENTER_SEQ,
        keyword: getLocalStorage('usermobile', ''),
        category: 'ei'
      },
      function (response) {
        var html = '<table id="qdetails" class="table mt-1 mx-auto w-98 border-bottom-0 font-12 text-center table-bordered">\n' +
            '  <thead>\n' +
            '<tr><th colspan="5">ORDER HISTORY</th></tr>'+
            '    <tr>\n' +
            '<th scope="col">SN  </th>\n' +
            '<th scope="col">ID /Date </th>\n' +
            '<th scope="col">Name/Mobile </th>\n' +
            '<th scope="col">G. Total</th>\n' +
            '<th scope="col">View </th>\n' +
            '    </tr>\n' +
            '  </thead>\n' +
            '  <tbody>\n';

        var i = 0;
        orders = $.parseJSON(response);
        $.each(orders, function (k, quot) {
       //   console.log(quot.product_details);
          html += '<tr class="quote-cell">\n' +
              
          '<th scope="row">' + (++i) + '</th>\n' +
          '<th scope="row">' + quot.sno + ' / ' + quot.date + '</th>\n' +
              '<td  class="text-left">' + quot.cname + ' / ' + quot.cmobile + '</td>\n' +
              '<td>'+STUDENT_DETAILS.app_info['currency']+' ' + quot.quotation_amount + '</td>\n'+
              '<td><img src="images/eye.svg" class="curptr" onclick="displayQDetails('+k+')"></td>\n'+
              '</tr>\n';
        });
        html += '  </tbody></table>';
        $('#scrollerContentDiv').html(html);
      });
}


function displayQDetails(i)
{
  var quotationList = JSON.parse(orders[i].product_details);
  var html = '<table id="qdetails" class="table w-100 border-bottom-0 font-12 text-center  table-bordered">\n' +
      '  <thead>\n' +
      '<tr><th colspan="6">Order SUMMARY</th></tr>'+
      '    <tr>\n' +
      '<th scope="col">SN</th>\n' +
      '<th scope="col">Product </th>\n' +
      '<th scope="col">Rate </th>\n' +
      '<th scope="col">QTY</th>\n' +
      '<th scope="col">Total</th>\n' +
      '    </tr>\n' +
      '  </thead>\n' +
      '  <tbody>\n';

  var j = 0;
  var grand_total = 0;
  $.each(quotationList, function (prod_seq, data) {

    if(parseFloat(data.quantity) != data.quantity){
      return;
    }

    grand_total += parseFloat(data.quantity) * parseFloat(data.price);

    html +='<tr id="quot_'+prod_seq+'" class="quote-cell">\n' +
        '<th scope="row">'+(++j)+'</th>\n' +
        '<th  class="text-left">'+data.prod_name+'</th>\n' +
        '<td>'+(data.price == '0' ? '-' : ''+data.price+'')+'</td>\n' +
        '<td>'+data.quantity+'</td>\n' +
        '<td>'+(data.quantity == '0' ? '-' : data.total)+'</td>\n' +
        '</tr>\n' ;
  });

  if(j > 0){
    html +='<tr id="grand_total" class="quote-cell">\n' +
        '<th scope="row" colspan="2" class="border-right-0"></th>\n' +
        '<td  class="text-right font-weight-bold lead font-14 border-left-0 pr-2" colspan="2">G. TOTAL</td>\n' +
        '<td  class="font-weight-bold lead text-danger font-14" colspan="2">'+STUDENT_DETAILS.app_info['currency']+' '+grand_total+'</td>\n' +
        '</tr>\n' ;

    html +='<tr class="quote-cell">\n' +
        '<th scope="row" colspan="6" class="border-0 text-center pt-3 pr-0">' +
        '<button type="button" class="btn cntrl btn-danger btn-sm btn-wide mr-2" onclick="orders_makePage();">BACK</button>' +
        '</th>\n' +
        '</tr>\n' ;
  }else{
    html +='<tr class="quote-cell">\n' +
        '<td  class="font-weight-light lead" colspan="6">No details found<br/>'+
        '<button type="button" class="btn cntrl btn-danger mt-2 btn-sm btn-wide mr-2" onclick="orders_makePage();">BACK</button>' +
        '</th>\n' +
        '</tr>\n' ;
  }
  html +='  </tbody></table>';
  $('#scrollerContentDiv').html(html);
}