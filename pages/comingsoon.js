function comingsoon_makePage()
{
    comingsoon_header();
    comingsoon_body();
}

function comingsoon_header()
{
    $('#navbar').remove();
    $('body').css('background-color', '#f7f9fb');

}

function comingsoon_body()
{
    var html = '<div class="container d-flex h-100 px-0" style="background-color: #f7f9fb;">\
          <div class="row justify-content-center  m-auto text-center align-self-center">\
                            <div class="login-logo"><img width=250 src="images/logo1.png"></div>\
                            <h4 class="w-100 pl-3"> Coming Soon...! currently only Service boy or engg. login</h4>\
                            <button type="button" class="btn btn-info  btn-block" onclick="logOutUser();">Logout</button>\
                         </div>\
                          </div>';
    $('#scrollerContentDiv').html(html);
}
