function cart_makePage()
{
        $('body').removeClass('login-page-bg-color');
        cart_header();
        cart_body();
}

function cart_header()
{
    $('#navbar').show();
    $('#goback').addClass('hidden');
    $('#menu-toggle').removeClass('hidden');
    //insertHeaderbar(0,0,0,'displayEnquirySearchForm();');
    $('#scrollerContentDiv').css('background-color', '#FFFFFF');
    //insertSideLbar();
}

function cart_body()
{
  var html = '<table id="qdetails" class="table w-100 border-bottom-0 font-12 text-center  table-bordered">\n' +
      '  <thead>\n' +
      '<tr><th colspan="6">CART SUMMARY</th></tr>'+
      '    <tr>\n' +
      '<th scope="col">SN</th>\n' +
      '<th scope="col">Product </th>\n' +
      '<th scope="col">Rate </th>\n' +
      '<th scope="col">QTY</th>\n' +
      '<th scope="col">Total</th>\n' +
      '<th scope="col">&nbsp;</th>\n' +
      '    </tr>\n' +
      '  </thead>\n' +
      '  <tbody>\n';

      var quotationList = JSON.parse(getLocalStorage('quotationList', '{}'));
      var j = 0;
      var grand_total = 0;
      $.each(quotationList, function (prod_seq, qty) {

        var data = STUDENT_DETAILS.prod[prod_seq];

        if(parseFloat(qty) != qty || parseFloat(qty)  <= '0' ){
          return;
        }

        grand_total += parseFloat(qty) * parseFloat(data.sell_price);

        html +='<tr id="quot_'+prod_seq+'" class="quote-cell">\n' +
        '<th scope="row">'+(++j)+'</th>\n' +
        '<td  class="text-left"><a href="#" onclick="displayProduct('+prod_seq+', true);"> '+data.name+'</a></td>\n' +
        '<td>'+(data.sell_price == '0' ? '-' : ''+data.sell_price+'')+'</td>\n' +
        '<td>'+qty+'</td>\n' +
        '<td>'+(data.sell_price == '0' ? '-' : ''+(parseFloat(qty) * parseFloat(data.sell_price))+'')+'</td>\n' +
        '<td><button type="button" class="close text-danger px-1" onclick="removeQuoteProd('+prod_seq+');"><span>×</span></button></td>\n' +
        '</tr>\n' ;
      });

      if(j > 0){
        html +='<tr id="grand_total" class="quote-cell">\n' +
            '<th scope="row" colspan="2" class="border-right-0"></th>\n' +
            '<td  class="text-right font-weight-bold lead font-14 border-left-0 pr-2" colspan="2">G. TOTAL</td>\n' +
            '<td  class="font-weight-bold lead text-danger font-14" colspan="2">'+STUDENT_DETAILS.app_info['currency']+' '+grand_total+'</td>\n' +
            '</tr>\n' ;

        html +='<tr class="quote-cell">\n' +
            '<th scope="row" colspan="6" class="border-0 text-right pt-3 pr-0">' +
            '<button type="button" class="btn cntrl btn-secondary btn-sm btn-wide mr-2" onclick="showScreen(\'products\');">Cancel</button>' +
            '<button type="button" class="btn cntrl btn-info btn-sm btn-wide" onclick="sendQuotation();">Save &amp; Continue</button>' +
            '</th>\n' +
            '</tr>\n' ;
      }else{
        html +='<tr class="quote-cell">\n' +
            '<td  class="font-weight-light lead" colspan="6">Cart is empty! <br/>'+
            '<button type="button" class="btn cntrl btn-danger mt-2 btn-sm btn-wide mr-2" onclick="showScreen(\'products\');">Check Products</button>' +
            '</th>\n' +
            '</tr>\n' ;
      }
      html +='  </tbody></table>';

      html += '<div id="cdetails" class="p-3 hidden">\
      <div class="form-group">\
        <label for="cname">Enter Name <sapn class="text-danger">*</span></label>\
        <input type="text" id="cname" placeholder="Enter your name" class="form-control form-control-sm">\
      </div>\
      <div class="form-group">\
        <label for="comp_name">Company name</label>\
        <input id="comp_name" type="text" placeholder="Company name" size="30" class="form-control form-control-sm">\
      </div>\
      <div class="form-group">\
        <label for="cmobile">Mobile <sapn class="text-danger">*</span></label>\
        <input id="cmobile" type="text" placeholder="Enter 10 digit mobile number" size="10" class="form-control form-control-sm">\
      </div>\
      <div class="form-group">\
        <label for="cemail">Email ID</label>\
        <input id="cemail" type="text" placeholder="Email id" size="30" class="form-control form-control-sm">\
      </div>\
      <div class="form-group">\
        <label for="cadd">Address</label>\
        <input id="cadd" type="text" placeholder="Address" size="150" class="form-control form-control-sm">\
      </div>\
      <div class="form-group text-right">\
        <button type="button" class="btn cntrl btn-secondary btn-sm btn-wide mr-2" onclick="showScreen(\'cart\');">Back</button>\
        <button type="button" class="btn cntrl btn-info btn-sm btn-wide" onclick="sendQuotation();">Place Order</button>\
      </div></div>';

      $('#scrollerContentDiv').html(html);
}

function removeQuoteProd(prod_seq) {
  var quotationList = JSON.parse(getLocalStorage('quotationList', '{}'));
  if(quotationList[prod_seq]){
    delete quotationList[prod_seq];
    setLocalStorage('quotationList', JSON.stringify(quotationList));
  }
  cart_makePage();
}

function sendQuotation() {

  if(!$('#qdetails').hasClass('hidden')){
    $('#qdetails').addClass('hidden');
    $('#cdetails').removeClass('hidden');
    return;
  }else if($.trim($('#cname').val()) == '' || $.trim($('#cmobile').val()) == ''){
    alertPopUp('Please enter all details');
    return;
  }

  var quotationList = JSON.parse(getLocalStorage('quotationList', '{}'));
  var grand_total = 0;
  var i =0;

  var product_details = {};
  $.each(quotationList, function (prod_seq, qty) {
    var data = STUDENT_DETAILS.prod[prod_seq];
    if(parseFloat(qty) != qty || parseFloat(qty)  <= '0' ){
      return;
    }
    product_details[++i] = {"prod_name":data.name, "quantity": parseFloat(qty), "price": parseFloat(data.sell_price), "discount":0, "total": (parseFloat(qty) * parseFloat(data.sell_price))}
    grand_total += parseFloat(qty) * parseFloat(data.sell_price);
  });

  $.post(HOST_NAME+'/my/mobile_services/prodProcessRequest',
      {
        cmd:"add_quotation",
        seq:CENTER_SEQ,
        mode: 'I',
        cname: $('#cname').val(),
        cmobile: $('#cmobile').val(),
        final_amount:grand_total,
        product_details:product_details,
        comp_name:$('#comp_name').val(),
        cemail:$('#cemail').val(),
        caddress:$('#cadd').val(),
        comp_val:'',
        tc_val:'',
        thnx_val:'',
        date:'',
        quote_seq:'',
        enq_id: 0
      },
      function(response)
      {
        if (response.match('ERROR'))
        {
          res = response.split('::');
          alertPopUp(res[1]);
        }
        else if (response.match('SUCCESS'))
        {
          setLocalStorage('quotationList', '{}');
          alertPopUp('Order Sent!');
          showScreen('products');
        }
      });
}
