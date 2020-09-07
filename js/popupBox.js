function displayPopBox(iHtml, pos)
{
	closePopBox();
	var closeTop =  '';
    var closeBottom = '<div style="position:absolute; bottom:5px; right:5px; width:100px;">\
    				<a href="#" class="close" id="close_div" style="float:right;">\
    					<img src="/images/closelabel.png" border="0" title="close" onclick="closePopBox();return false;" class="close_image" />\
  					</a>\
    </div>';
    var closeTop = '<div style="position:absolute; top:5px; right:5px; width:100px;">\
    				<a href="#" class="close" id="close_div" style="float:right;">\
    					<img src="/images/closelabel.png" border="0" title="close" onclick="closePopBox();return false;" class="close_image" />\
  					</a>\
    </div>';
    if(pos != undefined  && pos == 1)
    {
      closeBottom = '';
    }
    else if(pos != undefined && pos == 0)
    {
      closeBottom = '';
      closeTop = '';
    }
    else if(pos == undefined)
    {
      closeTop = '';
    }

	var html = '\
	<div id="POP_BOX" style="position:absolute;top:50px; z-index:1000001;">\
           <div id="facebox1" style="display:;z-index:1000001;" >' + closeTop +
            '<div class="popup">\
              <table  style="overflow:auto;">\
                <tbody>\
                  <tr>\
                    <td class="b"/>\
                    <td class="body">' +
                      '<div class="content" id="popup_content">\
						' + '' + '\
                      </div>' +
                    '</td>\
                    <td class="b"/>\
                  </tr>\
                </tbody>\
              </table>\
            </div> ' + closeBottom + '\
          </div>\
   </div>';
  $('body').append($(html));
  document.getElementById('popup_content').innerHTML = iHtml; //firefox fix
  //alert($('#POP_BOX').width());
  if($('#POP_BOX').width() < 400)
  {
    $('#POP_BOX table').css('width', '400px');
  }

  if($('#POP_BOX').width() > 800)
  {
    //alert('fixing');
    $('#POP_BOX table').css("width", "800px");
  }

  $('#POP_BOX').center();
}

function closePopBox(tm)
{
  if(tm == undefined || tm <= 0)
  {
    tm = 0;
    $('#POP_BOX').remove();
    return;
  }
	if($('#POP_BOX').length)
	{
	  //$('#POP_BOX').fadeOut(tm);
    tm = parseInt(tm);
		setTimeout(function(){$('#POP_BOX').remove();}, tm);
	}
}

function posPopBoxBelow(elemId)
{
  $('#POP_BOX').relPos(elemId);
}

function polishPopBox(border,left,top,border_color)
{

    if (left != undefined &&  left != '')
    {
      $("#POP_BOX").css('left', left+'px');

    }

     if (top !=  undefined &&  top != '')
    {
       $("#POP_BOX").css('top', top+'px');
    }

    if (border != undefined &&  border != '' &&  border != 0)
    {
        if (border_color != undefined &&  border_color != '' &&  border_color != 0)
        {
            $("#facebox1").css('border', '1px solid '+border_color+'');
            $("#facebox1").css('border-radius', '5px 5px 5px 5px');
        }else
        {
            $("#facebox1").css('border', '1px solid lightblue');
            $("#facebox1").css('border-radius', '5px 5px 5px 5px');
        }
    }
}

jQuery.fn.center = function () {
	var h = $(window).height() - this.height();
	var w = $(window).width() - this.width() ;
	if(h < 0) h = 50;
	if(w < 0) w = 30;

    this.css("position","absolute");
    this.css("top", h / 2 + $(window).scrollTop() + "px");
    this.css("left", w / 2+$(window).scrollLeft() + "px");
    return this;
}

jQuery.fn.centerTop = function (dh) {
	var w = $(window).width() - this.width() ;
	if(w < 0) w = 30;
  //alert($(window).scrollTop());
  //alert(scrlTop());
  if(dh == undefined) dh = 80;
    this.css("position", "absolute");
    this.css("top", dh + scrlTop() + "px");
    this.css("left", w / 2+$(window).scrollLeft() + "px");
    return this;
}

function scrlTop()
{
  return typeof window.pageYOffset != 'undefined' ? window.pageYOffset: document.documentElement.scrollTop? document.documentElement.scrollTop: document.body.scrollTop? document.body.scrollTop:0;
}

jQuery.fn.relPos = function (elemId) {
  var offset = $('#'+elemId).offset();
  var height = $('#'+elemId).height() + 2;
  var width = $('#'+elemId).width();
  var top = offset.top + height + "px";
  var w = this.width();
  var right = offset.left - ((w-width)/2) + "px";
  this.css( {
      'position': 'absolute',
      'left': right,
      'top': top
  });
}

function popBoxWithBlockedBg(iHtml, pos)
{
  if($('#BLOCK_BG').length>0) closePopBoxWithBlockedBg();
  var bgDiv = "<div id=BLOCK_BG style='display:none;width:100%; height:100%; opacity:0.95; filter: alpha(opacity = 95); background:#f2f2f2 repeat; z-index:1001; position:fixed; top:0; left:0;' ><div>";
  $('body').append($(bgDiv));
  $('#BLOCK_BG').show();

  var containerDiv = "<div id=OUTLINE_POPUP style='position:absolute; display:inline-block;opacity:0; background:#fff; z-index:10001; padding:15px;'>\
             <div id=OUT_LINE_POPUP_CLOSE style='position:absolute;top:2px;right:2px;' onclick='closePopBoxWithBlockedBg();' class='sprite crossIcon'></div>\
             "+iHtml+" \
            <div id=CONTAINER_POPUP></div></div>";
  $('body').append($(containerDiv));
  if(pos != undefined && pos == 1)
    $('#OUTLINE_POPUP').center();
  else
    $('#OUTLINE_POPUP').centerTop();
  $('#OUTLINE_POPUP').animate({opacity:1},2000);
}

function closePopBoxWithBlockedBg()
{
  $('#OUTLINE_POPUP').remove();
  $('#BLOCK_BG').remove();
}

$(document).keyup(function(e) {
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == 27) {
        closePopBoxWithBlockedBg();
    }
});