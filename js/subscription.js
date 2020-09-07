/***************************************code related to page view start*****************************************************************/
function subscription_makePage()
{
  subscription_header();
  subscription_body();
  subscription_footer();
}

function subscription_header()
{
   var headerHtml = "<div id='h_reg' style='display:;' class=header>\
    <div class='header_back_button flt' onclick=\"goBackFromSubscription();return false;\"><div class=' header_back_img flt'><img src='./images/back.png'></div><div class='frt'>back</div></div>\
      Subscription Request\
     <div class='frt' style='width:55px;'> &nbsp;</div>\
    </div>";
  $('#h_send_code').empty();
  $('#h_send_code').html(headerHtml);
}

function subscription_body()
{
  var bodyHtml = "<div id='scrollerContentDiv' class='content ' >\
        <div id='sub_container' >\
          <div >Selected spot may not be available.\
          Enter your cross streets to find the closest available monthly spot.  </div>\
          <div style='padding-top:20px;'>\
            <div class='form_field' >\
              <input  type='text' id='first_street' name='first_street' placeholder='Cross Street 1'/>\
            </div>\
            <div class='sub_seperator'>&</div>\
            <div class='form_field ' >\
              <input type='text'   id='second_street' name='second_street' placeholder='Cross Street 2'/>\
            </div>\
            <div class='form_submit ' id='button_div'>\
              <div class='ibutton litegreen ' id='subscription_submit' onclick='submitSubscription();return false;'> Find Parking Now </div>\
            </div>\
          </div>\
        </div>\
      </div>";
  /*$('#scroller').empty();
  $('#scroller').html(bodyHtml);
  */
   animateScreen($('.content'), $(bodyHtml), 1);
}



function subscription_footer()
{

}


/*************************************code related to page view ends*********************************************************************/


function showSubscriptionPopUp()
{
  var html ="<div style='width:240px;height:50px;display:block' onclick=\"showScreen('subscription');return false;\">Connect SpotOn for information about monthly subscription.</div>";
   showPopUpDiv(html,280);
}

function goBackFromSubscription()
{
  setTimeout(function(){ showScreen('list', 1);},300);
}

function submitSubscription()
{
  
  var first_street = $('#first_street').val();
  var second_street = $('#second_street').val();
  first_street = first_street.trim();
  second_street = second_street.trim();
  //alert(first_street+" : "+second_street);
   if(isFakeClick())
   {
     return;
   }
   if(first_street.length == 0)
   {
     alertPopUp("Please enter first cross street");
     return false;
   }
   if(second_street.length == 0)
   {
     alertPopUp("Please enter second cross street");
     return false;
   }
  //showScreen('list',1);
  //return ;
  var data = {
			action: 'spoton_service_send_mail_for_subscription',
			session_id: get_session_id(),
			userid:current_user_id,
      first_street:first_street,
      second_street:second_street
      };
		jQuery.post(HOST_NAME+'/trunk/wp-admin/admin-ajax.php', data, function(response) {
  			if(response.status == 'error')
  			{
  				alertPopUp(response.message);
  
  			}
  			else
  			{
          alertPopUp(response.message);
          showScreen('list',1);
   			}
		});
}