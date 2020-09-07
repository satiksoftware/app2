var limit = 5;

function random_int()
{
  return Math.floor(Math.random()*100000);
}

function stop_EventPropagation(event)
{
   if (event.stopPropagation){
       event.stopPropagation();
   }
   else if(window.event){
      window.event.cancelBubble=true;
   }
}

function setLocalStorage(key, data) {
  localStorage.setItem(key, data);
}

function getLocalStorage(key, defaultVal) {
  var value = localStorage.getItem(key);
  if(value){
    return value;
  }else if(defaultVal){
    return defaultVal;
  }else{
    return false;
  }

}

function set_cookie(name, value, days, path, domain, secure)
{
  var cookie_string = name + "=" + escape ( value );
  if ( days ) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    cookie_string += "; expires="+date.toGMTString();
  }
  if ( path )
    cookie_string += "; path=" + escape ( path );
  if ( domain )
    cookie_string += "; domain=" + escape ( domain );
  if ( secure )
    cookie_string += "; secure";
  document.cookie = cookie_string;
}

function get_cookie(c_name)
{
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++)
	{
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==c_name)
		{
			return unescape(y);
		}
	}
}

function setSiteType(type)
{
  if(type == 1) //mobile
  {
    set_cookie('showsite', '', 0, '/');
  }
  else
  {
    set_cookie('showsite', 'Y', 365, '/'); //, DOMAIN_BASE_NAME);
  }
  setTimeout(function(){softReload();}, 200);
}

function softReload()
{
  var param = "&random="+random_int();
  if(window.location.href.indexOf("?") < 0)
  {
    param = "?"+param;
  }
  window.location = window.location.href + param;
}

function showSlidinglogin()
{
  $("#slidinglogin").animate({"height": "toggle"}, { duration: 500 });
}

function fillFieldsWithUrlData()
{
  var searchString = window.location.search.substring(1),
      i, val, params = searchString.split("&");

  for (i=0; i<params.length; ++i)
  {
    params[i] = params[i].replace('+', ' ');
    val = params[i].split("=");
    setParamVal1(val[0], unescape(val[1]));
  }
  return null;
}
function setParamVal1(param, v)
{
  //alert(param + ' ' + v);
  if(v != 'undefined')
  {
    if($('#'+param).is('input[type=hidden]'))
    {
      return;
    }
    else if($('#'+param).is('input[type=checkbox]'))
    {
      if(v==1)
      {
        $('#'+param).attr('checked',true);
      }
    }
    else if($('#'+param).is('input[type=radio]'))
    {
      $('#'+param).filter("[value=" + v + "]").prop("checked", true);
    }
    else
    {
      $('#'+param).val(v);
    }
  }
}

function parseResponse(response)
{
  if(response.match('RCP') || response.match('rcp'))
  {
     USER_LOGGED_IN = 0; 
     showScreen('login');
     return false;
  }else if(response.match('ERROR::') || response.match('error::') || response.match('Error::'))
  {
    var resp = response.split("::");
    if(resp[1] !== undefined)
    {
      alertPopUp(resp[1]);
    }
    else
    {
      alertPopUp(response);
    }
    return false;
  }
  else if(response.match('REDIRECT::') || response.match('redirect::') || response.match('Redirect::'))
  {
    var resp = response.split("::");
    if(resp[2] !== undefined)
    {
      showScreen(resp[2]);
    } else
    { 
      showScreen('login');
    }
    return false;
  }
  return true;
}

function showRecaptcha(elementId)
{
   Recaptcha.create("6Ldw79kSAAAAABL_w4Nhhm3NwlglqfAH7bNRrc8k", elementId, {
     theme: "red",
    callback: Recaptcha.focus_response_field});
}

function isScrolledIntoView(elem)
{
  //alertPopUp($(elem).height());
  //alertPopUp( $(elem).attr('id'));
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();
    //console.log(docViewTop + ' '+docViewBottom+' '+elemTop+' '+elemBottom);
    return (elemTop <= docViewBottom);
}

function showMoreRows(elem, type)
{
  $(elem).children('.hiddenRow' + type).addClass('shownRow' + type);
  $(elem).children('.hiddenRow' + type).removeClass('hiddenRow' + type);

  $(elem).children('.viewMore' + type).addClass('hiddenRow' + type);
}

function showLessRows(elem, type)
{
  $(elem).children('.shownRow' + type).addClass('hiddenRow' + type);
  $(elem).children('.viewMore' + type).removeClass('hiddenRow' + type);
}

function toggleChkBox(elem)
{
  $(elem).children('input[type=checkbox]').each(function(){
    if(this.checked) this.checked = false;
    else  this.checked = true;
    });
}

function contactusE()
{
  var a = '@'; var i = 'info';
  alertPopUp('Please contact us at : ' + i + a + DOMAIN_BASE_NAME);
}

/***** SpotOn Functions ************/
function get_session_id()
{
	var session_id = null;
  if(Modernizr.localstorage)
	{
   	session_id = localStorage.getItem("session_id");
    if(isEmpty(session_id))
    {
      session_id = get_cookie('session_id');
    }
	}
	else
	{
		session_id = get_cookie('session_id');
	}
	return(session_id);
}


function signout()
{
	var data = {
		action: 'spoton_service_signout',
		session_id: get_session_id()
	};
	jQuery.post(HOST_NAME+'/trunk/wp-admin/admin-ajax.php', data, function(response) {
  	 if (Modernizr.localstorage)
  	 {
       localStorage.removeItem("session_id");
  	 }
     deleteAllCookie();
    });
  if (Modernizr.localstorage)
  {
    localStorage.removeItem("session_id");
  }
  deleteAllCookie();
  resetGlobalVariable();
  showScreen('login');
  //set_cookie('SCREEN_NAME', 'list', 2*365, '/');
	return(false);
}

function gotoLink(url)
{
  window.top.location = url;
  return false;
}
function truncFormat(text, len)
{
  if(text.length <= len)
    return text;
  var str = text.substring(0, len - 3);
  return str + "...";
}


function reportProblem()
{
  var spot_id = $('#showRecord').attr('spot_id');

  if(current_user_id == '' )
  {
    showLoginPrompt("list");
    return false;
  }
  var  html = "<div class='pop_up_title'>Report a Problem</div>\
     <div class='popupDescription'> Please email us a description of your problem at 'support@spotonparking.com'. In an emergency, click 'Dial' and then press 1 for support.</div>\
      <div class='form_submit  first' >\
      <div class='ibutton litegreen' id='email' onclick=\"javascript: window.location.href='mailto:support@SpotOnParking.com?subject=SpotOn parking:Report a Problem';\"> Email </div>\
      </div>\
      <div class='form_submit' >\
      <div class='ibutton litegreen ' id='dial' onclick='callPhone();return false;' >Dial</div>\
       </div>\
      <div class='form_submit' >\
       <div class='ibutton litegreen ' id='cancel' onclick='hidePopUp();return false;'> Cancel </div>\
      </div>";
   setTimeout(function(){showPopUpDiv(html,270);},200);
}

function callPhone()
{
	if(isFakeClick())
	{
	   return false;
	}
	else
	{
		window.location.href = 'tel:4152334373';

	}

}

/****************************************************************************code for pop up start***********************************************************/

function showPopUpDiv(html,width)
{

  if(isFakeClick())
  {
    return;
  }
   var content = "<div id='pop_up' class='flt white_content  hide'>"+html+"</div>";
  content += "<div id='fade'></div>";
  $('#wrap').append(content);
  $('#pop_up').css('display', 'block');
  $('#fade').css('display', 'block');
  $('#fade').css('height',$(window).height());
  var marginLeft = ($(window ).width()-width)/2;
  $('#pop_up').css("margin-left",marginLeft);

  if(width < 280)
  {
     $('#pop_up').css("width", width);
  }

}

function hidePopUp()
{
  if($('#pop_up').length)
  {
    $('#wrap #fade').empty();
    $('#wrap #pop_up').empty();
    $('#wrap #fade').remove();
    $('#wrap #pop_up').remove();
    /*$('#fade').empty();
    $('#pop_up').empty();
    $('#fade').remove();
    $('#pop_up').remove();*/
  }
}

/*
Use "alertPopUp" function instead of javascript alert.
if parameter is function then we pass first element of array as function name
  e.g var argsArray = [option,1,2]
  here option is function name
  alertPopUp('alert text',  argsArray );
else if parameter is url
    alertPopUp('alert text',  "url" );
    here 'alert text' means message to be alerted.
else
     alertPopUp('alert text');
*/
/*
function alertPopUp(htmlContent, argsArray)
{

  //alert(htmlContent);
  navigator.notification.alert(
            htmlContent,  // message
            alertCallback,         // callback
            'SpotOn-Park',            // title
            'Done'                  // buttonName
        );
  return;

  if(htmlContent === undefined)
  {
    htmlContent = '<div style="margin:15px;">Value not set.</div>';
  }
  var  html = "<div id='alert_desc' style='margin-top:15px;'>"+htmlContent+"</div>";
  if(typeof argsArray === 'string')
  {
     html += " <div class='ibutton litegreen alert_ok'  id='cancel' onclick=\"doAfterPopUpClose('"+ argsArray+"');return false;\"> Ok </div>";
  }
  else
  {
    html += " <div class='ibutton litegreen alert_ok'  id='cancel' onclick='doAfterPopUpClose("+ argsArray+");return false;'> Ok </div>";
  }

  if(htmlContent.length < 280)
  {
    if(htmlContent.length < 100)
    {
      showPopUpDiv(html, 180);
    }
    else
    {
      showPopUpDiv(html, 280);
    }

  }
  else
  {
    showPopUpDiv(html, 280);
  }


}
*/


function alertPopUp(htmlContent, title, nextScreen, animateType, buttonName)
{ 
  if(navigator.notification && navigator.notification.alert)
  {
        title = title || "ProductManage";
        buttonName = buttonName || 'OK';
        navigator.notification.alert(
            htmlContent,  // message
            function()
            {
                if(!empty(nextScreen))
                  {
                    if(empty(animateType))
                    {
                      showScreen(nextScreen);    
                    }
                    else
                    {
                      showScreen(nextScreen, animateType);  
                    }
                  }  
            },         
            title,            
            buttonName                 
        );
  }
  else
  {
    alert(htmlContent);
    alertCallback(nextScreen, animateType);
  }  
  return;
}

function alertCallback(nextScreen, animateType)
{
 
  if(!empty(nextScreen))
  {
    if(empty(animateType))
    {
      showScreen(nextScreen);    
    }
    else
    {
      showScreen(nextScreen, animateType);  
    }
  }  
 
}


function doAfterPopUpClose()
{ 
  if(typeof arguments[0] == 'string' )
  {
    window.top.location = arguments[0];
  }
  else if(typeof arguments[0] === 'function')
  {
    var newArgs = [];
    for (var i = 1; i < arguments.length; i++) {
      newArgs.push(arguments[i]);
    }
    arguments[0].apply( arguments[0], newArgs);
   }
  else
  {
    arguments[0];
  }
  hidePopUp();

}

function setLocationList(locationVal)
 {
    var locationList = new Array();
    var locationList = getLocationList(limit);
    if(isInArray(locationList,locationVal ))
    {
      var index = locationList.indexOf(locationVal);
      if (index > -1)
      {
        locationList.splice(index, 1);
      }
    }
    locationList[locationList.length]=locationVal;
    if (Modernizr.localstorage)
		{
		  localStorage.setItem("LOCATION_LIST", JSON.stringify(locationList));
	  }
    else
    {
      set_cookie("LOCATION_LIST", JSON.stringify(locationList), 2*365, '/');//, '.spotonparking.com');
    }

 }

function getLocationList()
  {
    var tempList ;
   	if (Modernizr.localstorage)
		{
			tempList = localStorage.getItem("LOCATION_LIST");
		}
    else
    {
       tempList = get_cookie("LOCATION_LIST");
    }

    //alert("###" + tempList);
    var locationList = new Array();
    var  temp = new Array();
    if(tempList != null)
     {
        var j = 0;
        temp =  $.parseJSON(tempList);
         var start =0;
        if(temp.length > limit)
        {
          start = (temp.length - limit);
        }

       for(var i = start;i< temp.length;i++)
         {
           locationList[j++]=temp[i];
         }
     }
    return locationList;
  }

function isInArray(array, search)
{
  return (array.indexOf(search) >= 0) ? true : false;
}

function getAddress(results, search_address)
{
  var value='';
  if(!isNaN(search_address))
  {
    for(var i=0 ;i<results.address_components.length; ++i)
    {
      if(i>0)
      {
        value += ", ";
      }
      value += results.address_components[i].long_name;
    }
  }
  else
  {
    value = results.formatted_address;
  }
  return  value;
}



function format_time_string(hh_mm_ss)
{
	if (!hh_mm_ss || hh_mm_ss == "")
		return "12:00 AM"
	var ampm = 'AM';
	var hours = parseInt(hh_mm_ss.substr(0,2), 10);
	if(hours > 11)
	{
		hours = hours - 12;
		ampm = 'PM';
	}
	if (hours == 0)
	{
		hours = 12;
	}

	if (hours < 10)
	{
		hours = "0" + hours;
	}

	var mins = hh_mm_ss.substr(3,2);

	// if we passed in am/pm, donot override it!
	var hadAmPm = /[Mm]$/.test(hh_mm_ss);

	var ret = hours + ":" + mins
	if (!hadAmPm)
		ret += " " + ampm;
	else
		ret += hh_mm_ss.slice(-2).toLowerCase(); // get the rightmost chars and lowercase them

return(ret);
}

function deleteAllCookie()
{
  eatCookie('curU');
  eatCookie('curStatus');
  eatCookie('session_id');
  eatCookie('expire_status');

}

function eatCookie(c_name)
{
  set_cookie(c_name, null, -1, '/');
  if(Modernizr.localstorage)
  {
    localStorage.removeItem(c_name);
  }
}

function isFakeClick()
{
  var currentTime = new Date().getTime();
   if(currentTime > (lastClickTime + 1500))
   {
      lastClickTime = currentTime;
	  return false;
   }
   else
   {
	 return true;
   }

}


function hourMinuteSecToSec(hh_mm_ss)
{
  var hh = parseInt(hh_mm_ss.substring(0, 2));
  var mm = parseInt(hh_mm_ss.substring(3, 5));
  var ss = parseInt(hh_mm_ss.substring(6, 8));
  
  return hh*3600+mm*60+ss;
}

var weekday = new Array(7);
	weekday[0] = "Sunday";
	weekday[1] = "Monday";
	weekday[2] = "Tuesday";
	weekday[3] = "Wednesday";
	weekday[4] = "Thursday";
	weekday[5] = "Friday";
	weekday[6] = "Saturday";
  
function getFormatedDate(dateStr)
{
 	var nextDate = stringToDate(dateStr) ;
	var today = new Date();
	var diffInDays = days_between(today, nextDate);
	var day = '';
  if(diffInDays < 0)
  {
    
    day = getMonthDate(nextDate) +" by "+getHourMinute(nextDate);	
  }
	else if(diffInDays < 1)
	{
	  day = "Today"+" by "+getHourMinute(nextDate);
	}
	else if(diffInDays < 2)
	{
	  day = "Tomorrow"+" by "+getHourMinute(nextDate);
	}
	else if(diffInDays >= 2  && diffInDays <= 7)
	{
	  day = weekday[nextDate.getDay()]+" by "+getHourMinute(nextDate);
	}
	else if(diffInDays > 7)
	{
	  day = getMonthDate(nextDate) +" by "+getHourMinute(nextDate);	
	}
	return day;
}

function getFormatedDateNextAvailable(dateStr)
{
   
 		var nextDate = stringToDate(dateStr) ;
	var today = new Date();
	
	var diffInDays = getDifferenceBetwDay(today, nextDate);
	//alert(typeof diffInDays);
	var day = '';
 if(diffInDays < 0)
  {
    
    day = getMonthDate(nextDate) +" by "+getHourMinute(nextDate);	
  }
	else if(diffInDays < 1)
	{
	  day = "Today"+"  "+getHourMinute(nextDate);
	}
	else if(diffInDays < 2)
	{
	  day = "Tomorrow"+"  "+getHourMinute(nextDate);
	}
	else if(diffInDays >= 2  && diffInDays <= 7)
	{
	  day = weekday[nextDate.getDay()]+"  "+getHourMinute(nextDate);
	}
	else if(diffInDays > 7)
	{
	  day = getMonthDate(nextDate) +"  "+getHourMinute(nextDate);	
	}
	return day;
}


function getAvailableDateFormat(dateStr)
{
 	var nextDate = stringToDate(dateStr) ;
	var today = new Date();
	//var curIndex = today.getDay();
	//var nextIndex = nextDate.getDay();
	var diffInDays = getDifferenceBetwDay(today, nextDate);
	
	var day = '';
	
  if(diffInDays < 0)
  {
    
    day = getHourMinute(nextDate)+" "+getMonthDate(nextDate);	
  }
	else if(diffInDays < 1)
	{
	  day = getHourMinute(nextDate)+" Today";
	}
	else if(diffInDays < 2)
	{
	  day = getHourMinute(nextDate) + " Tomorrow";
	}
	else if(diffInDays >= 2  && diffInDays <= 7)
	{
	  day = getHourMinute(nextDate)+" "+weekday[nextDate.getDay()];
	}
	else if(diffInDays > 7)
	{
	  day = getHourMinute(nextDate)+" "+getMonthDate(nextDate);	
	}
	return day;
}


function getDifferenceBetwDay(today, nextDate)
{

    var curIndex = today.getDay();
	var nextIndex = nextDate.getDay();
	
    var diffDay = 0;
    if(curIndex > nextIndex )
    {
       diffDay =  7 -(curIndex - nextIndex) ;
    }
    else if(curIndex < nextIndex )
    {
        diffDay =  (nextIndex - curIndex);
    }
    else if((curIndex == nextIndex) && (today.getDate() != nextDate.getDate()) )
	{
		diffDay = 7;
    }
    return diffDay;
}





function days_between(date1, date2) 
{ 
    var ONE_DAY = 1000 * 60 * 60 * 24
	 //date1.setHours(0,0,0,0);
    var date1_ms = date1.getTime();//-1000*60*750;//1000*60*750 remove it on production
    var date2_ms = date2.getTime()
    //console.log(date1_ms+"   "+date2_ms);
    var difference_ms = Math.abs(date1_ms - date2_ms);
  return Math.round(difference_ms/ONE_DAY)
}

function openUrl(url) 
{ 
  window.open(url, '_system');
}
 

function getMonthDate(date)
{
   return pad(date.getMonth()+1)+" / "+pad(date.getDate());
}

function stringToDate(s)  
{
  //console.log(s);
  s = s.split(/[-: ]/);
  return new Date(s[0], s[1]-1, s[2], s[3], s[4], s[5]);
}
function getHourMinute(date) {
  var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	var format = "am";
	if(hours > 11)
	{
	 format="pm";
	}
	if (hours > 12) 
	{ 
	  hours = hours - 12; 
	}
	if (hours == 0) 
	{
	  hours = 12; 
	}  
 return pad(hours)+":"+pad(minutes)+" "+format;
}

function displayPopup(content,closable)
{ 
    closable = closable == undefined? 1 : closable; 
    var action = closable == 1? ' onclick="removePopup();" ' : '';
    var html = '<div id="popup" class="popup">';
    if(closable == 1)
    {
        html += '<span onclick="removePopup();" style="cursor: pointer; line-height: 25px; position: absolute; right: 0px; text-align: center; top: 0px; z-index: 9; font-weight: bold; width: 30px; font-size: 20px; color: rgb(102, 102, 102);">&#120;</span>';
    }
     html += content; 
     html += '</div><div id="overlay" '+action+' style="position: absolute; width: 100%; top: 0px; left: 0px; right: 0px; bottom: 0px; background: none repeat scroll 0% 0% black; opacity: 0.5; z-index: 8; height: 100%;" class="lb_overlay js_lb_overlay" ></div>';
    
    $('#overlay').remove();
    $('#popup').remove();
    $('body').append(html);
}

function removePopup()
{
    $('#overlay').remove();
    $('#popup').remove();
}

function changePassPopup()
{
    var html = '<div style="padding:5px;">\
    <div class="padding_top_bottom10"><input id="cur_pass" type="text" value="" placeholder="Current Password"></div>\
    <div class="padding_top_bottom10"><input id="pass" type="text" value="" placeholder="New Password"></div>\
    <div class="padding_top_bottom10"><input id="cpass" type="text" value="" placeholder="Confirm Password"></div>\
    <div class="padding_top_bottom10"><div class="button_div" onclick="changeStudentPassword();" >Change</div></div>\
    </div>';
    
    displayPopup(html);
    toggleCats();
}


function changeStudentPassword()
{ 
    var cur_pass = $.trim($('#cur_pass').val());
    var password = $.trim($('#pass').val());
    var cpassword = $.trim($('#cpass').val());
    
    if(cur_pass == '')
    {
        alertPopUp('Enter current password.');
        return false;
    }else if(password == '')
    {
        alertPopUp('Enter password.');
        return false;
    }else if(cpassword == '')
    {
        alertPopUp('Enter confirm password.');
        return false;
    }else if(cpassword != password)
    {
        alertPopUp('Enter new password and confirm password must be same');
        return false;
    }
    
     $.post(HOST_NAME+'/my/mobile_services/processRequest', {cmd:"changeStudentPassword", cur_pass:cur_pass, password:password},
      function(response)
      {        
         	 if(parseResponse(response))
             {
                 alertPopUp('Your password has been changed.'); 
                 removePopup();
                 return;
             } 
      });   
}

function showStudPopup()
{
    var html = '<div style="padding:5px;">\
    <div class="scrollableL wrapperV" style="position:unset;" id="wrapperL">\
    <ul style="z-index: 1;bottom: 0px;width: 100%;overflow: auto;left: -3px;">\
    <li style="background:#298fad; height: 35px; font-weight: bold;background: #fe8d01; padding:0px;" class="valid-and-recharge-now-li"><div>Switch Account</div></li>';

    $.each( STUDENT_DETAILS.other_students, function (i, val) {
        html += '<li class="sideLi"><a style="width:100%; display:inline-block;" href="#" onclick="loginOtherStudent('+val.student_seq+');">'+val.name+'</a></li>';
    });

    html += '</ul>\
    </div>\
    </div>';

    displayPopup(html);
    hideCats();
}


function loginOtherStudent(student_seq) {

    $.post(HOST_NAME+'/my/mobile_services/processRequest', {cmd:"loginStudent", student_seq:student_seq, center_seq:CENTER_SEQ},
        function(response)
        {
            if(!parseResponse(response) || response == 0)
            {
                alertPopUp('Unable to authenticate.');
            }else if(response == 3)
            {
                alertPopUp('App access is disabled. Please upgrade to Diamond package to get access.');
            }else if(response == 'STUDENT_DISABLE')
            {
                alertPopUp('App access is disabled. Please upgrade to Diamond package to get access.');
            }else
            {
                USER_LOGGED_IN = 1;
                STUDENT_DETAILS = $.parseJSON(response);

                showScreen('home');
                setTimeout(function () {
                    showCats();
                }, 500);
            }
        });
}


function insertSideLbar()
{
    var modules = STUDENT_DETAILS['allowed_module'] != undefined? STUDENT_DETAILS['allowed_module'] : [];
    var all_enable = STUDENT_DETAILS['allowed_module'] != undefined && STUDENT_DETAILS['allowed_module'] == 'ALL_ENABLE'? true : false;
        
    var valid_till = STUDENT_DETAILS['pkg_end_date'] != ''? 'Valid till '+STUDENT_DETAILS['pkg_end_date'] : 'No package available';
    var html = '<div id="sideL" style="display: none; width: 0%; z-index:10;" >\
    <div  id="wrapperL" class="scrollableL wrapperV" style="left:0px;">\
    <ul>\
        <li style="background:#298fad; padding:0px;" class="valid-and-recharge-now-li">\
            <div>'+valid_till+'</div>\
            <div><div id="RechargeNow"  class="rechargenow"  onclick="showScreen(\'coupon\');" >Recharge Now</div>\
    		<div>'+STUDENT_DETAILS['fname']+' '+STUDENT_DETAILS['lname']+'</div>\
        </li>';
        
        if(STUDENT_DETAILS['desigtn'] == 'ST')
        {
            if(LOGIN_TYPE == 'otp' && STUDENT_DETAILS.other_students.length > 0){
                html += '<li class="sideLi" style="background:#fe8d01;"><a style="width:100%; display:inline-block;" href="#" onclick="showStudPopup();">Switch Student Account</a></li>';
            }

            html += '<li style="background:#fe8d01;"><span style="width:100%; display:inline-block;">Information</span></li>';
         if($.inArray('info_student', modules) != -1 || all_enable)
         {
             html += '<li class="sideLi"><a style="width:100%; display:inline-block;" href="#" onclick="showScreen(\'studentinfo\');">Students Information</a></li>';
         }
         
         if($.inArray('info_student_fee',modules) != -1 || all_enable)
         {
              html += '<li class="sideLi"><a style="width:100%; display:inline-block;" href="#" onclick="showScreen(\'feereceipt\');">Fee Receipt</a></li>';
         }
        
         if($.inArray('info_attendance',modules) != -1 || all_enable)
         {
              html += '<li class="sideLi"><a style="width:100%; display:inline-block;" href="#" onclick="showScreen(\'attendance\');">Attendance Report</a></li>';
         }
        
         if($.inArray('info_library',modules) != -1 || all_enable)
         {
             html += '<li class="sideLi"><a style="width:100%; display:inline-block;" href="#" onclick="showScreen(\'library\');">Library</a></li>';
         }
         
         if($.inArray('info_bus_route',modules) != -1 || all_enable)
         {
             html += '<li class="sideLi"><a style="width:100%; display:inline-block;" href="#" onclick="showScreen(\'busroute\');">Bus Routes</a></li>';
         }         
         
         html += '<li style="background:#fe8d01;"><span style="width:100%; display:inline-block;">Communication</span></li>';
         if($.inArray('stud_cm_messanger',modules) != -1 || all_enable)
         {
             html += '<li class="sideLi"><a style="width:100%; display:inline-block;" href="#" onclick="showScreen(\'cmessenger\');">CM Messenger</a></li>';
         }
         
         if($.inArray('info_assignments',modules) != -1 || all_enable)
         {
              html += ' <li class="sideLi"><a style="width:100%; display:inline-block;" href="#" onclick="showScreen(\'assignment\');">Assignment/Docs</a></li>';
         }
        
         if($.inArray('icard',modules) != -1 || all_enable)
         {
           html += '<li class="sideLi"><a style="width:100%; display:inline-block;" href="#" onclick="showScreen(\'icard\');">I - Card</a></li>';  
         }
         
         if($.inArray('info_exam_notification',modules) != -1 || all_enable)
         {
             html += '<li class="sideLi"><a style="width:100%; display:inline-block;" href="#"  onclick="showScreen(\'examnotification\');">Exam Notifications</a></li>';
         }
         
         if($.inArray('sms_log',modules) != -1 || all_enable)
         {
             html += '<li class="sideLi"><a style="width:100%; display:inline-block;" href="#" onclick="showScreen(\'smslog\');">SMS Log</a></li>';
         }
        }else
        {
        html += '<li style="background:#fe8d01;"><span style="width:100%; display:inline-block;">Student Communication</span></li>\
        <li class="sideLi"><a style="width:100%; display:inline-block;" href="#" onclick="showScreen(\'enquiry\');">Enquiry</a></li>\
        <li class="sideLi"><a style="width:100%; display:inline-block;" href="#"  onclick="showScreen(\'attendance_collection\');">Attendance</a></li>\
        <li class="sideLi"><a style="width:100%; display:inline-block;" href="#"  onclick="showScreen(\'sendsms\');">SMS</a></li>\
        <li class="sideLi"><a style="width:100%; display:inline-block;" href="#"  onclick="showScreen(\'sendemail\');">E-Mail</a></li>\
        <li class="sideLi"><a style="width:100%; display:inline-block;" href="#"  onclick="showScreen(\'cmessenger\');">CM Messenger</a></li>\
        <li class="sideLi"><a style="width:100%; display:inline-block;" href="#"  onclick="showScreen(\'search\');">Search</a></li>';
        } 
         
        html += '<li class="sideLi"><a style="width:100%; display:inline-block;" href="#" onclick="changePassPopup();">Change Password</a></li>\
        <li class="sideLi"><a style="width:100%; display:inline-block;" href="#" onclick="logOutUser();">Sign Out</a></li> \
        </ul>\
        </div><!-- slide menu left end -->\
        </div>';
        $('#sideL').remove();
        $('#pageM').append(html);
        $('#listMenuIcon')[0].addEventListener('click', toggleCats, true); 
}

function updateCourse(id, university, update_batch)
{
    if(university == 0)
    {
         $(id).html('<option value="0">Select Course</option>');
         $(id).select2({
                 minimumResultsForSearch: -1
                 });
         return;
    }
    
   $.post(HOST_NAME+'/my/mobile_services/processRequest', {cmd:"getStudentCourseOptionList", university:university},
        function(response)
        { 
            if(parseResponse(response))
            {
              if(response!="")
              {                 
                $(id).html('<option value="0">Select Course</option>'+response);
              }
              else
              {
               $(id).html('<option value="0">Select Course</option>');
              }
              $(id).select2({
                 minimumResultsForSearch: -1
                 });
                 
                  if(update_batch != '')
                 {
                    updateBatch(update_batch, $(id).val())
                 }
            }
         });   
    
}


function updateUniversity(id, update_course)
{

    update_course = update_course == undefined? '' : update_course;
   $.post(HOST_NAME+'/my/mobile_services/processRequest', {cmd:"getStudentUniversityOptionList",},
        function(response)
        { 
            if(parseResponse(response))
            {
              if(response!="")
              {                 
                $(id).html(response);
              }
              else
              {
               $(id).html('<option value="0">Select University</option>');
              }
              $(id).select2({
                 minimumResultsForSearch: -1
                 });
                 
                 if(update_course != '')
                 {
                    updateCourse(update_course, $(id).val(), '#batch')
                 }
            }
         });   
    
}

function updateBatch(id, course_seq)
{
    if(course_seq == 0)
    {
         $(id).html('<option value="0">Select Batch</option>');
         $(id).select2({
                 minimumResultsForSearch: -1
                 });
         return;
    }
    
   $.post(HOST_NAME+'/my/mobile_services/processRequest', {cmd:"getStudentBatchOptionList", course_seq:course_seq},
        function(response)
        { 
            if(parseResponse(response))
            {
              if(response!="")
              {                
                $(id).html('<option value="0">Select Batch</option>'+response);
              }
              else
              {
               $(id).html('<option value="0">Select Batch</option>');
              }
              $(id).select2({
                 minimumResultsForSearch: -1
                 });
            }
         });   
    
}

function insertHeaderbar(homebtn,searchbtn,backbtn,searchCallback,addbtn,addcallback)
{
          searchCallback = searchCallback == undefined? '' : searchCallback;
          addcallback = addcallback == undefined? '' : addcallback;

          //<div class="logo" style="float:left;" onclick="showScreen('home');"></div>
    //<div id="listMenuIcon" style="margin-right:0px !important;" class="flt spriteM listMenuIcon flt"></div>
          var html = '<div class="top-menue-bg" id="h_send_code"> ';
                    
          if(homebtn == 1)
          {
             //html += '<div class="spriteM backWIcon frt" id="backWIcon" onclick="goToPreviousPage();"></div>';
          }
          if(backbtn == 1)
          {
             //html += '<div class="spriteM homeIcon frt" id="homeIcon" onclick="showScreen(\'home\');"></div>';
          }     
          if(current_screen == 'sendsms')
          {
             html += '<div class="spriteM sendIcon frt" onclick="sendsms();"   ></div>';
          }else if(current_screen == 'sendemail')
          {
             html += '<div class="spriteM sendIcon frt" onclick="sendemail();"   ></div>';
          }       
          if(searchbtn == 1)
          {
             html += '<div class="spriteM searchIcon frt" onclick="'+searchCallback+'" id="searchIcon"></div>';
          }
          
           if(addbtn == 1)
          {
             html += '<div class="spriteM addIcon frt"   onclick="'+addcallback+'" ></div>';
          }  
           
		 html += '</div>';
         $('#header').html(html);
}

function closeSlideBar(){
    $("#wrapper").removeClass("toggled");
}

function displayPkgEpiredAlert(){
    $('#model-1').modal('show');
}

function search(){
  if($.trim($('#searchtext').val()) != ''){

  }

}