window.trace = function ( string ) {
	if ( typeof console == 'object' ) 
	{ 
		console.info ( string );
	}
};

function isValidEmailAddress(emailAddress) 
{
	var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
	
	return pattern.test(emailAddress);
};

function hideFlash()
{
	jQuery('embed, object, iframe').css('visibility', 'hidden');
}
function showFlash()
{
	jQuery('embed, object, iframe').css({ 'visibility' : 'visible' });
}


function gaRecordExternalClick(url, category, action) 
{
	try 
	{	
		_gaq.push(['_trackEvent', category , action, url]);
		trace("Google Analytics Tracked Event. URL: " + url + " Category: " + category + " Action: " + action);
		//setTimeout('document.location = "' + url + '"', 100)
	}
	catch(err)
	{
		trace("Google Analytics Tracked Event Exception. URL: " + url + " Category: " + category + " Action: " + action);
		trace(err);
	}
}


function isValidEmailAddress(emailAddress) 
{
	var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
	
	return pattern.test(emailAddress);
};


function process_registration_form()
{
	var has_errors = false;
	
	if(jQuery("#id_email_address").val().length < 1)
	{
		has_errors = true;
		jQuery("#id_email_address").addClass('registration_error');
	}
	else
	{
		if(isValidEmailAddress(jQuery("#id_email_address").val()) == false)
		{
			has_errors = true;
			jQuery("#id_email_address").addClass('registration_error');

		}
		else
		{
			jQuery("#id_email_address").removeClass('registration_error');
		}


	}
	/*
	if(jQuery("#id_postal_code").val().length < 5)
	{
		has_errors = true;
		jQuery("#id_postal_code").addClass('registration_error');
	}
	else
	{
		jQuery("#id_postal_code").removeClass('registration_error');
	}
	*/	
	if(has_errors)
	{
		jQuery("#id_registation_results").addClass('registration_failure');
		jQuery("#id_registation_results").html('Please check the values you entered');
		jQuery('#id_registation_results').fadeOut(6000, function() {
			jQuery("#id_registation_results").html('');
			jQuery("#id_registation_results").css('display', 'inline-block');
		  });
		return(false);
	}
	else
	{
		/*
		var consumer = true;
		var supplier = false
		
		if(jQuery("#id_type_consumer").is(':checked'))
		{
			consumer = true;
		}
		else
		{
			if(jQuery("#id_type_supplier").is(':checked'))
			{
				consumer = false;
			}
		}

		if(jQuery("#id_type_supplier").is(':checked'))
		{
			supplier = true;
		}*/
		
		var data = {
			action: 'newsletter_subscribe',
			reg_email: jQuery("#id_email_address").val(),
			/*
			reg_postal_code: jQuery("#id_postal_code").val(),
			reg_consumer: consumer,
			reg_supplier: supplier,
			*/
			reg_ip_address: jQuery("#reg_ip_address").val(),
			reg_user_agent: jQuery("#reg_user_agent").val()
		};
		
		trace(data);

		jQuery.post(spoton_ajax.ajaxurl, data, function(response) {
			trace(response);
			if(response.result == 'error')
			{
				
				if(response.mc_error_code == '214')
				{
					jQuery("#id_registation_results").removeClass('registration_failure');
					jQuery("#id_registation_results").html('You are already a on our list. Thank you!');
					jQuery("#id_email_address").val('');
					/*
					jQuery("#id_postal_code").val('');
					jQuery("#id_type_consumer").attr('checked', 'checked');
					jQuery("#id_type_supplier").removeAttr('checked');
					*/
					jQuery('#id_registation_results').fadeOut(6000, function() {
						jQuery("#id_registation_results").html('');
						jQuery("#id_registation_results").css('display', 'inline-block');
					  });
					gaRecordExternalClick('Registration Form', 'registration', 'already-existing');
				}
				else
				{
					gaRecordExternalClick('Registration Form', 'registration', 'error');
					jQuery("#id_registation_results").addClass('registration_failure');
					jQuery("#id_registation_results").html('An error occurred. Please try again.');
					jQuery('#id_registation_results').fadeOut(6000, function() {
						jQuery("#id_registation_results").html('');
						jQuery("#id_registation_results").css('display', 'inline-block');
					  });
				}
			}
			else
			{
				gaRecordExternalClick('Registration Form', 'registration', 'submit');
				jQuery("#id_email_address").val('');
				/*
				jQuery("#id_postal_code").val('');
				jQuery("#id_type_consumer").attr('checked', 'checked');
				jQuery("#id_type_supplier").removeAttr('checked');
				*/
				jQuery("#id_registation_results").removeClass('registration_failure');
				jQuery("#id_registation_results").html('Thank you for registering!');
				jQuery('#id_registation_results').fadeOut(6000, function() {
					jQuery("#id_registation_results").html('');
					jQuery("#id_registation_results").css('display', 'inline-block');
				});
			}
		});
		
		return(false);
	}

	return(false);
}



// remap jQuery to $
//(function($){})(window.jQuery);


/* trigger when page is ready */
jQuery(document).ready(function (){

	jQuery("#id_spoton_user_mobile").mask_input("999-999-9999");

	jQuery("#id_submit").click(function(){
		return(process_registration_form());		
	});
	
	jQuery("#sign_in_link_clone").click(function(){
		jQuery("#sign_in_box").slideDown(function(){
			jQuery("#id_spoton_user_mobile").focus();
		});
	});
	
	jQuery("#sign_in_link").click(function(){
		jQuery("#sign_in_box").slideDown(function(){
			jQuery("#id_spoton_user_mobile").focus();
		});
	});
	
	
	jQuery('.slide_container').cycle({
		fx:'scrollHorz'
	});	
	
});


/* optional triggers

jQuery(window).load(function() {
	
});

jQuery(window).resize(function() {
	
});

*/


