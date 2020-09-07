function contactus_makePage(cat)
{
        $('body').removeClass('login-page-bg-color');
        contactus_header();
        contactus_body();
}

function contactus_header()
{
    $('#navbar').show();
    $('#scrollerContentDiv').css('background-color', '#FFFFFF');
}

function contactus_body()
{
    var html = '';
    var address = [STUDENT_DETAILS.app_info['address'], STUDENT_DETAILS.app_info['city'], STUDENT_DETAILS.app_info['state'], STUDENT_DETAILS.app_info['pincode']];
    var addr = '';
    $.each(address, function(i, val){
        if($.trim(val) != 'products'){
            addr += addr == ''? val : ', '+val;
        }
    });
    html += '<img class=" img-responsive img-rounded mt-3" style="border-radius: 5px;" src="'+getAttatchmentImg(STUDENT_DETAILS.website_config['logo'])+'" width="150">\
        <div class="w-100 text-center font-16 font-weight-bold text-dark mt-3">  <strong style="font-size: 22px;">'+STUDENT_DETAILS.app_info['company_name']+'</strong></div>\
         <div class="w-100 text-center font-14 text-dark mb-1 mt-2" style="font-size: 14px;text-transform:uppercase;"> '+addr+' </div>';

    html += $.trim(STUDENT_DETAILS.app_info['mobile']) != ''? '<div class="w-100 text-center font-14 text-dark mb-0 mt-0" style="font-size: 14px;text-transform:uppercase;">  <a  class="text-dark" href="#" onclick="window.open(\'tel:'+STUDENT_DETAILS.app_info['mobile']+'\', \'_system\');" style="text-decoration: none !important;">'+STUDENT_DETAILS.app_info['mobile']+' <img width="30" class="ml-2 mr-2" src="images/call.png"></a>\
        <a  class="text-dark" href="#" onclick="window.open(\'sms:'+STUDENT_DETAILS.app_info['mobile']+'?body=\', \'_system\');" style="text-decoration: none !important;"><img width="30" class="ml-2 mr-2" src="images/sms.png"></a> <a class="text-dark" href="#" onclick="window.open(\'https://api.whatsapp.com/send?phone=+91'+STUDENT_DETAILS.app_info['mobile']+'\', \'_system\');" style="text-decoration: none !important;"><img width="30" class="ml-2 mr-2" src="images/whatsapp.png"></a></div>' : '';

    html += $.trim(STUDENT_DETAILS.app_info['mobile2']) != ''? '<div class="w-100 text-center font-14 text-dark mb-0 mt-1" style="font-size: 14px;text-transform:uppercase;">  <a  class="text-dark" href="#" onclick="window.open(\'tel:'+STUDENT_DETAILS.app_info['mobile2']+'" style="text-decoration: none !important;">'+STUDENT_DETAILS.app_info['mobile2']+' <img width="30" class="ml-2 mr-2" src="images/call.png"></a> </div>' : '';

    html += $.trim(STUDENT_DETAILS.app_info['email']) != ''? '<div class="w-100 text-center font-14 text-dark mb-0 mt-1" style="font-size: 14px; ">  <a class="text-dark" href="#" onclick="window.open(\'mailto:'+STUDENT_DETAILS.app_info['email']+'\', \'_system\');" style="text-decoration: none !important;">'+STUDENT_DETAILS.app_info['email']+' <img width="30" class="ml-2 mr-2" src="images/mail.png"></a> </div>' : '';
    html += $.trim(STUDENT_DETAILS.app_info['email2']) != ''? '<div class="w-100 text-center font-14 text-dark mb-0 mt-1" style="font-size: 14px; ">  <a  class="text-dark"href="#" onclick="window.open(\'mailto:'+STUDENT_DETAILS.app_info['email2']+'\', \'_system\');" style="text-decoration: none !important;">'+STUDENT_DETAILS.app_info['email2']+' <img width="30" class="ml-2 mr-2" src="images/mail.png"></a> </div>' : '';
    html += '</div>';
    $('#scrollerContentDiv').html('<div id="contactuspage" class="px-3 pb-3 text-center w-100">'+html+'</div>');
}
