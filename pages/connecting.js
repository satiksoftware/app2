function connecting_makePage()
{
    connecting_header();
    connecting_body();
}

function connecting_header()
{
    $('#scrollerContentDiv').height($(window).height() - 58);
    $('#catlist').css('height', $(window).height() - 56);

    $('#navbar').hide();
    $('#scrollerContentDiv').css('background-color', '#f7f9fb');
}

function connecting_body()
{
   var html = '<div class="container d-flex h-100 px-0" style="background-color: #f7f9fb;">\
          <div class="row justify-content-center  m-auto text-center align-self-center">\
                            <h3 class="w-100 pl-3">Welcome to</h3>\
                            <div class="login-logo"><img width=250 src="images/logo1.png"></div>\
                            <div class="w-100 text-center mt-2" ><img src="images/connecting.gif" style="border-radius: 4px;"></div>\
                         </div>\
                          </div>';
    $('#scrollerContentDiv').html(html); 
}
 