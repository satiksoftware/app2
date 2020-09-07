function aboutus_makePage(cat)
{
        $('body').removeClass('login-page-bg-color');
        aboutus_header();
        aboutus_body();
}

function aboutus_header()
{
    $('#navbar').show();
    //insertHeaderbar(0,0,0,'displayEnquirySearchForm();');
    $('#scrollerContentDiv').css('background-color', '#FFFFFF');
    //insertSideLbar();
}

function aboutus_body()
{
    $('#scrollerContentDiv').html('<div class="p-3"><h4 class="mb-2 text-center font-weight-bold">About Us</h4>'+STUDENT_DETAILS.app_info['comp_profile']+'</div>');
}
