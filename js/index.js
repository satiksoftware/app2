//var HOST_NAME = "http://www.servicemanage.in";
var HOST_NAME = "https://www.servicemanage.in";
//var HOST_NAME = "http://l.smanage.com";
//var HOST_NAME = "http://192.168.0.103:3000/proxy/http://servicemanage.in"; //for phonegap app test
var USER_LOGGED_IN = 0;
var current_screen = "";
var previousScreen = "";
var lastClickTime = new Date().getTime();
var screenArray = [];
var STUDENT_DETAILS = {};
STUDENT_DETAILS['currency'] = 'Rs.';
var GCM_PROJECT_ID = 'centermanageapp';
var GCM_API_KEY = 'AIzaSyAt8eqPxvOA8D6o6zcWW_Vo96xdEkunhkg';
var GCM_PROJECT_NUMBER = '923989251292';
var GCM_DEVICE_TOKEN = '';
var REDIRECT_PAGE = '';
var USERLOCATION = {'lat' : '', 'lng' : '', 'event' : 'auto', 'timestamp' : 0};

$(document).ready(function(){

   showScreen('connecting');
   document.addEventListener("deviceready", onDeviceReady, false);
   document.addEventListener("resume", checkAndRedirectToNotificationPage, false);
   setTimeout(function(){checkLoginAndRedirectUser();}, 1000);
});

function onDeviceReady(){
     //document.addEventListener("backbutton", goToPreviousPage, false);
     document.addEventListener("menubutton", toggleCats, false);
     document.addEventListener("offline", offlineAlert, false);
    /* var pushNotification = window.plugins.pushNotification;
     pushNotification.register(gcmSuccessHandler, gcmErrorHandler,{"senderID":GCM_PROJECT_NUMBER,"ecb":"onNotificationGCM"});*/
     bindDomEvents();
}

function toggleCats(){

}

function bindDomEvents()
{
    $(document).keypress(function(e) {
    if(e.which == 13) {
        if(current_screen == 'cmessenger')
        {
            sendReplyCMMessage(cm_r_type, cm_r_seq);
        }
     }
    });
}

function checkAndRedirectToNotificationPage()
{
    if(REDIRECT_PAGE != null && REDIRECT_PAGE != '' && REDIRECT_PAGE != undefined && USER_LOGGED_IN == 1)
    {
        showScreen(REDIRECT_PAGE);
        REDIRECT_PAGE = '';
    }
}

function gcmSuccessHandler(result)
{
    //$('#scrollerContentDiv').html('Callback Success! Result = '+result);
}

function gcmErrorHandler(error)
{
    //$('#scrollerContentDiv').html(error);
}

function onNotificationGCM(e)
{
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    // $('#scrollerContentDiv').html('device registration id = '+e.regid);
                    if(e.regid != undefined && e.regid != '')
                    {
                        GCM_DEVICE_TOKEN = e.regid;
                        if(USER_LOGGED_IN == 1)
                        {
                            updateDeviceToken(GCM_DEVICE_TOKEN);
                        }
                    }
                }
            break;

            case 'message':
              // this is the actual push notification. its format depends on the data model from the push server
               //$('#scrollerContentDiv').html('message = '+e.message+' redirect_page = '+e.payload.redirect_page);
               if(e.payload.redirect_page != undefined && e.payload.redirect_page != '')
                {
                  REDIRECT_PAGE =  e.payload.redirect_page;
                }
            break;

            case 'error':
              //$('#scrollerContentDiv').html('GCM error = '+e.msg);
            break;

            default:
              //$('#scrollerContentDiv').html('An unknown GCM event has occurred');
              break;
        }
 }

function offlineAlert()
{
    if(navigator.notification && navigator.notification.alert)
    {
        navigator.notification.alert(
            'Application needs network to proceed. \nPlease enable network and try again.',  // message
            function()
            {
                navigator.app.exitApp();
            },
            "Alert",
            'Exit'
        );
    }
    else
    {
        alert('Application needs network to proceed. \nPlease enable network and try again.');
    }
}

function goToPreviousPage(){

  var previousPage = getPreviousPageFromPageArray();
  if(previousPage == '')
  {
    //$('#scrollerContentDiv').html('previous page is empty');
    return;
  }
  removePageFromPageArray();
  showScreen(previousPage);
  return false;
}

function removePageFromPageArray()
{
  var previousPage = getPreviousPageFromPageArray();
  if(previousPage == '')
  {
    //navigator.app.exitApp();
    return;
  }
  else
  {
    //$('#scrollerContentDiv').html("element popped");
    screenArray.pop();
  }
}

function setCurrentPageInPageArray(page)
{
  if(screenArray.length == 0)
  {
    screenArray[0] = page;
  }
  else
  {
    if(screenArray[screenArray.length-1] != page)
    {
      screenArray[screenArray.length] = page;
    }
  }
  //$('#scrollerContentDiv').html(screenArray);
}

function getPreviousPageFromPageArray()
{
  //$('#scrollerContentDiv').html(screenArray.length);
  if(screenArray.length < 2)
  {
    //$('#scrollerContentDiv').html('in if of getPreious page');
    return '';
  }
  else
  {
    //$('#scrollerContentDiv').html('in else of get Previous page');
    return screenArray[screenArray.length - 2];
  }
}

function empty (mixed_var) {
  // Checks if the argument variable is empty
  // undefined, null, false, number 0, empty string,
  // string "0", objects without properties and empty arrays
  // are considered empty
  var undef, key, i, len;
  var emptyValues = [undef, null, false, 0, "", "0"];

  for (i = 0, len = emptyValues.length; i < len; i++) {
    if (mixed_var === emptyValues[i]) {
      return true;
    }
  }

  if (typeof mixed_var === "object") {
    for (key in mixed_var) {
      // TODO: should we check for own properties only?
      //if (mixed_var.hasOwnProperty(key)) {
      return false;
      //}
    }
    return true;
  }

  return false;
}


function isEmpty(str)
{
  if(!empty(str))
  {
    str += '';
    str.replace(/^\s+|\s+$/g, '');
    return (str == '' || str == 0);
  }
  return true;
}

function checkLoginAndRedirectUser()
{
      $.post(HOST_NAME+'/my/mobile_services/prodProcessRequest', {cmd:"getAppInfo", seq:CENTER_SEQ},
      function(response)
      {
          $('#scrollerContentDiv').html('');
          STUDENT_DETAILS = $.parseJSON(response);
          console.log(STUDENT_DETAILS);
          prepareApp();
          showScreen('products');
      });

   $(document).ajaxStart($.blockUI).ajaxStop($.unblockUI); 
}

function prepareApp() {

    $('.user-name strong').html(STUDENT_DETAILS.app_info['company_name']);
    $('#company_name').html(STUDENT_DETAILS.app_info['company_name']);

    if(STUDENT_DETAILS.website_config['logo']){
        $('.user-pic img').attr('src', getAttatchmentImg(STUDENT_DETAILS.website_config['logo']));
    }

    $('#search').click(function () {
      $('#searchbar').toggleClass('hidden');
    });

    //https://github.com/bassjobsen/Bootstrap-3-Typeahead
    $("#searchtext").typeahead({
      fitToElement: true,
      source: function(query, CB){
        var text = $.trim(query.toLowerCase());
        var arr = [];
        $.each(STUDENT_DETAILS['prod'], function (i, prod) {
          if(prod.name.toLowerCase().indexOf(text) > -1){
            arr.push({'id':i, 'name':prod.name});
          }
        });
        CB(arr);
      },
      afterSelect: function (item) {
        $('#searchbar').addClass('hidden');
        $("#searchtext").val('');
        displayProduct(item.id);
      }
    });
   

    if(STUDENT_DETAILS.app_info['add_quot'] != 'A'){
      $('#cart').addClass('hidden');
      $('#order-menu').addClass('hidden');
      $.each(STUDENT_DETAILS.categories, function (i, val) {
        $('#contactcomp').before('<a href="#" class="list-group-item list-group-item-action bg-info text-white" onclick="showProducts('+i+');">'+val+'</a>');
     });
    }else{
      $.each(STUDENT_DETAILS.categories, function (i, val) {
        $('#order-menu').before('<a href="#" class="list-group-item list-group-item-action bg-info text-white" onclick="showProducts('+i+');">'+val+'</a>');
     });
    }

    //social icons
    if(STUDENT_DETAILS.app_info['facebook_url'] != ''){
        $('#socialicons .facebook').attr('href', STUDENT_DETAILS.app_info['facebook_url']);
    }
    if(STUDENT_DETAILS.app_info['linkedin_url'] != ''){
        $('#socialicons .linkedin').attr('href', STUDENT_DETAILS.app_info['linkedin_url']);
    }
    if(STUDENT_DETAILS.app_info['instagram_url'] != ''){
        $('#socialicons .instagram').attr('href', STUDENT_DETAILS.app_info['instagram_url']);
    }
    if(STUDENT_DETAILS.app_info['twitter_url'] != ''){
        $('#socialicons .twitter').attr('href', STUDENT_DETAILS.app_info['twitter_url']);
    }
}

function getAttatchmentImg(attachment){
    if(attachment == '' || attachment == undefined){
        return '';
    }
    return HOST_NAME+'/udb/attachment/'+CENTER_SEQ+'/'+attachment.split('?')[1]
}

function logOutUser()
{
      $.post(HOST_NAME+'/my/mobile_services/processRequest', {cmd:"logout"},
      function(response)
      {
            USER_LOGGED_IN = 0;
         	showScreen('login');
      });
}

function updateDeviceToken(token)
{
      if(GCM_DEVICE_TOKEN != '')
      {
          $.post(HOST_NAME+'/my/mobile_services/processRequest', {cmd:"updateDeviceToken", token:token},
          function(response)
          {
             	 //$('#scrollerContentDiv').html('Token Updated = '+GCM_DEVICE_TOKEN);
          });
      }

}

function getCurrentScreenFromStorage()
{
  var screenName = get_cookie('SCREEN_NAME');

  if(isEmpty(screenName))
  {
    if(Modernizr.localstorage)
    {
      screenName = localStorage.getItem("SCREEN_NAME");
    }
  }
  else
  {
    if(Modernizr.localstorage)
    {
      localStorage.setItem("SCREEN_NAME", screenName);
    }
  }
  if(isEmpty(screenName))
  {
    screenName = 'list';
  }

  return screenName;
}

function setScreenName(scrname)
{
  if(localStorage)
  {
      localStorage.setItem("SCREEN_NAME", scrname);
  }
  set_cookie('SCREEN_NAME', scrname, 2*365, '/');//, '.spotonparking.com');
}

function setSessionId(sessId)
{
  if(localStorage)
  {
  	localStorage.setItem("session_id", sessId);
  }
  set_cookie('session_id', sessId, 2*365, '/'); //,'.spotonparking.com');
}

function doActionInPageArray(screenName)
{
  /*if(screenName == 'login')
  {
    return;
  }
  else*/ if(screenName == 'spot' || screenName == 'login' || screenName == 'register'|| screenName == 'reset_pwd')
  {
    screenArray.length = 0 ;
    screenArray = new Array();
  }
  else
  {
    setCurrentPageInPageArray(screenName);
  }
  //$('#scrollerContentDiv').html('in show screen  '+ screenArray);
}

var SCREEN_ANIMATE_TYPE = 0;
function showScreen(screenName, param)
{

  removePopup();
  doActionInPageArray(screenName);
  current_screen = screenName ;
 // hideCats();
    if(STUDENT_DETAILS['app_info'] && STUDENT_DETAILS.app_info['pkg_expired'] == 'Y'){
        displayPkgEpiredAlert()
    }

  if(previousScreen == current_screen && current_screen != 'home')
  {
    //return;
  }
  else
  {
    previousScreen = current_screen ;
  }
   $('#bottom_bar').html('');
  setScreenName(screenName);


  if(screenName == 'connecting')
  {
     connecting_makePage();
  }
  else if(screenName == 'login')
  {
     login_makePage();
  }else if(screenName == 'cart')
  {
    cart_makePage();
  } else if(screenName == 'comingsoon')
  {
      comingsoon_makePage();
  }else if(screenName == 'products')
  {
      product_makePage(param);
  }else if(screenName == 'aboutus')
  {
    aboutus_makePage(param);
  }else if(screenName == 'orders')
  {
    orders_makePage(param);
  }else if(screenName == 'contactus')
  {
      contactus_makePage(param);
  }
  else
  {
    home_makePage();
  }
    closeSlideBar();
}


var myScrollM = null;
function setupScrollbars(isOn)
{
  return;
}

function setupLScrollbars(isOn)
{
    return;
}

function refreshMScrollBar(scrolltotop)
{
    return;
}

function scrollToElement(id)
{
    return;
}


function initScrollbars(isScrollOn)
{
    return;
  if(isScrollOn === 1)
  {
    var options = {
      mouseWheel: true,
      hScroll: true,
      vScrollbar: true,
      keyBindings: true,
      hideScrollbar:false,
      snap: false,
      momentum: true,
      preventDefaultException:{tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ },
      onScrollEnd: function () {
        }
      };

    if(Modernizr.touch)
    {
      options.click = true;
    }

    if(myScrollM != null)
    {
      myScrollM.refresh();
      myScrollM.scrollTo(0,0,0);
    }
    else
    {
      myScrollM = new IScroll('#wrapper', options);
    }
    //FastClick.attach(document.body);
  }
  else if(myScrollM != null)
  {
    myScrollM.scrollTo(0,0,0);
    myScrollM.destroy();
    myScrollM = null;
  }
}


var myScrollL = null;
function initLScrollbars(isScrollOn)
{
    return;
  if(isScrollOn === 1)
  {
     var options = {
      mouseWheel: true,
      hScroll: false,
      vScrollbar: true,
      keyBindings: true,
      hideScrollbar:false,
      snap: false,
      momentum: true,
      preventDefaultException:{tagName: /^(input|INPUT|TEXTAREA|BUTTON|SELECT)$/ },
      onScrollEnd: function () {
        }
      };

    if(Modernizr.touch)
    {
      options.click = true;
    }

    if(myScrollL != null)
    {
      myScrollL.refresh();
      myScrollL.scrollTo(0,0,0);
    }
    else
    {
      myScrollL = new IScroll('#wrapperL', options);
    }
  }
  else if(myScrollL != null)
  {
    myScrollL.scrollTo(0,0,0);
    myScrollL.destroy();
    myScrollL = null;
  }
}

var myScrollC = null;
function initCustomScrollbars(id,isScrollOn)
{

  if(isScrollOn === 1)
  {
    var options = {
      mouseWheel: true,
      hScroll: true,
      vScrollbar: true,
      keyBindings: true,
      hideScrollbar:true,
      snap: false,
      momentum: true,
      preventDefaultException:{tagName: /^(input|INPUT|TEXTAREA|BUTTON|SELECT)$/ },
      onScrollEnd: function () {
        }
      };

    if(Modernizr.touch)
    {
      options.click = true;
    }

    if(myScrollC != null)
    {
      myScrollC.refresh();
      myScrollC.scrollTo(0,0,0);
    }
    else
    {
      myScrollC = new IScroll(id, options);
    }
    //FastClick.attach(document.body);
  }
  else if(myScrollC != null)
  {
    myScrollC.scrollTo(0,0,0);
    myScrollC.destroy();
    myScrollC = null;
  }
}



function scrollToTopNRefresh()
{
  if(myScrollM != null)
  {
    myScrollM.scrollTo(0,0,0);
    myScrollM.refresh();
  }
  return;
}

function runAddressBarCheck(activeHeight)
{
  scrollTo(0,0);
  myScrollM.refresh();
  return;
}

function hideAddressbar()
{
  var page = document.getElementById('pageM'),
  ua = navigator.userAgent,
  iphone = ~ua.indexOf('iPhone') || ~ua.indexOf('iPod'),
  fullscreen = window.navigator.standalone,
  lastWidth = 0;
  if (iphone) {
    window.setupScroll = window.onload = function() {
      var height = document.documentElement.clientHeight;
      page.style.height = height + 'px';
      setTimeout(scrollTo, 0, 0, 1);
    };
    (window.onresize = function() {
      var pageWidth = page.offsetWidth;
      if (lastWidth == pageWidth) return;
      lastWidth = pageWidth;
      setupScroll();
    })();
    runAddressBarCheck(window.innerHeight);
  };
}



(function( $ ) {
  $.fn.noClickDelay = function() {
    var $wrapper = this;
    var $target = this;
    var moved = false;
    $wrapper.bind('touchstart mousedown',function(e) {
    e.preventDefault();
    moved = false;
    $target = $(e.target);
    if($target.nodeType == 3) {
      $target = $($target.parent());
    }
    $target.addClass('pressed');
    $wrapper.bind('touchmove mousemove',function(e) {
      moved = true;
      $target.removeClass('pressed');
    });
    $wrapper.bind('touchend mouseup',function(e) {
        $wrapper.unbind('mousemove touchmove');
        $wrapper.unbind('mouseup touchend');
        if(!moved && $target.length) {
          $target.removeClass('pressed');
          $target.trigger('click');
          $target.focus();
        }
      });
    });
  };
})( jQuery );


function animateScreen($src, $tgt, $callScroll)
{
  var tm = 400;
  if(SCREEN_ANIMATE_TYPE == 0)
  {
    var $parent = $src.parent();
    var width = ($parent.width());
    var finalwidth = ($parent.width()-320)/2;
    var srcWidth = $src.width();

    $src.css({position: 'absolute'});
    $tgt.appendTo($parent).css({left: width, position: 'absolute', display:'none'});

    //var w = width/2;
    $src.animate({left : -width, opacity:0}, tm,  function(){
        $src.remove();
    });
    $tgt.show().animate({left: finalwidth}, tm,  function(){
        $tgt.css({left: 'auto', position: 'static'});
        if(!isEmpty($callScroll))
        {
          setupScrollbars(1);
        }
    });
  }
  else
  {
    var $parent = $src.parent();
    var width = ($parent.width());
    var finalwidth = ($parent.width()-320)/2;
    var srcWidth = $src.width();

    $src.css({position: 'absolute'});
    $tgt.appendTo($parent).css({left: -320, position: 'absolute', display:'none'});

    //var w = width/2;
    $src.animate({left : width, opacity:0}, tm,  function(){
        $src.remove();
    });
    $tgt.show().animate({left: finalwidth}, tm,  function(){
        $tgt.css({left: 'auto', position: 'static'});
        if(!isEmpty($callScroll))
        {
          setupScrollbars(1);
        }
    });
    SCREEN_ANIMATE_TYPE = 0;
  }
}


function resetGlobalVariable()
{
}



