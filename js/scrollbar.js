 
var currCatState=0;
function toggleCats(e)
{
  if( $('#sideL').css('display') == 'none')
  {
    showCats();
    currCatState = 1;
    setTimeout(function(){myScrollM.refresh();}, 1);
    myScrollM.refresh();
    setTimeout(function(){myScrollL.refresh();}, 1);
  }
  else
  {
    hideCats();
    currCatState = 0;
    setTimeout(function(){myScrollM.refresh();}, 1);
    myScrollM.refresh();
    setTimeout(function(){myScrollL.refresh();}, 1);
     
  }
   
   e.preventDefault();
   e.stopPropagation();
}
function showCats()
{
  //$('#sideL').css('width', '0');
  $('#listMenuIcon').addClass('active');
  $('#sideL').css('display', 'block');
  $('#sideL').animate({width: '80%'}, 150);

  $('#mainM').animate({left: '80%'}, 150);
  //$('#mainM').css('left', '80%');
  currCatState = 1;
  //$('#mainM').on('click', hideCats);
  $('#mainM')[0].addEventListener('click', toggleCats, true);
  $('#mainM')[0].addEventListener('touchmove', toggleCats, true);

}

function hideCats()
{
  $('#listMenuIcon').removeClass('active');
  $('#mainM')[0].removeEventListener('click', toggleCats, true);
  $('#mainM')[0].removeEventListener('touchmove', toggleCats, true);

  $('#sideL').animate({width: '0%'}, 200);
  $('#mainM').animate({left: '0%'}, 200);
  setTimeout(function(){$('#sideL').css('display', 'none');}, 350);
  currCatState = 0;
}
 
