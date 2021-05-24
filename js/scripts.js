//
// scripts.js
//

function load() {


  // check login/logout
  var token = getCookie('token');

  if (typeof token == "undefined" || token == null || token == "") {
  // not logged in
    document.querySelector("#nav-container").style.display = "flex";
    document.querySelector("#nav-container-logout").style.display = "none";

    document.querySelector(".main-menu.logout").style.display = "block";
    document.querySelector(".main-menu.login").style.display = "none";

  } else {
    // logged in
    document.querySelector("#nav-container").style.display = "none";
    document.querySelector("#nav-container-logout").style.display = "flex";

    document.querySelector(".main-menu.logout").style.display = "none";
    document.querySelector(".main-menu.login").style.display = "block";
  }

}

/*
document.getElementById("login").addEventListener("click", () => {

    var token = getCookieValue('token');

    if (typeof token == "undefined" || token == null || token == "") {
      
      document.querySelector("#ovalay").style.display = "flex";
      
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'Meeting_login.html', true);
      
      xhr.onload = function(){
        if(this.status == 200){
          var output3 = this.responseText;
        
          document.getElementById('ovalay').innerHTML =output3;
        }
      }

       xhr.send();
    } else {
      logout();
    }
});
*/

// func: check user cookie
function isUserLoggedIn(){

  //var username = document.getElementById("login-id").value;
  //var password = document.getElementById("login-pw").value;

  if (!isAuth) return true; 

  var token = getCookie('token');

  if (typeof token == "undefined" || token == null || token == "") 
    return false;

  return true;
}

function showLoginInfo()
{

    document.querySelector("#nav-container").style.display = "none";
    document.querySelector("#nav-container-logout").style.display = "flex";

  document.querySelector(".main-menu.logout").style.display = "none";
  document.querySelector(".main-menu.login").style.display = "block";
}

function logout() {

  setCookie('username', '', 1);
  setCookie('token', '', 1);
      
  document.querySelector("#nav-container").style.display = "flex";
  document.querySelector("#nav-container-logout").style.display = "none";

  document.querySelector(".main-menu.logout").style.display = "block";
  document.querySelector(".main-menu.login").style.display = "none";

}

function formValidation(){
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms).forEach((form) => {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }

          form.classList.add('was-validated');
        }, false)
      });
}

function hideFooter() {
  document.querySelector('footer').style.visibility = hidden;
}

function showFooter() {
  document.querySelector('footer').style.visibility = visible;
}

function goToMinutes(minute)
{

  document.querySelector("#overlay1").style.display = "none";
  document.querySelector("#overlay2").style.display = "flex";

  //
  var xhr = new XMLHttpRequest();
  xhr.open('GET', './pages/chatview.html', true);
  
  xhr.onload = function(){
    if(this.status == 200){
      var output = this.responseText;
    
      document.getElementById('overlay2').innerHTML = output;
      document.querySelector('footer').style.visibility = "hidden";

      console.log("gotominute", minute, 1);
      initHeaderInfo(minute, 1);

      procClosedMinuteData(minute);
      console.log(".....................3")
      
    }
  }

  xhr.send();
}

function goToOngoing(minute) 
{

  document.querySelector("#overlay1").style.display = "none";
  document.querySelector("#overlay2").style.display = "flex";

  //
  var xhr = new XMLHttpRequest();
  xhr.open('GET', './pages/chatview.html', true);
  
  xhr.onload = function(){
    if(this.status == 200){
      var output = this.responseText;
    
      document.getElementById('overlay2').innerHTML = output;
      document.querySelector('footer').style.visibility = "hidden";

      console.log("gotoongoing", minute, 0);

      initHeaderInfo(minute, 0);
    
      procOngoingData(minute);
      
    }
  }

  xhr.send();
}

$(function()
{
    $(document).on('click', '.btn-add', function(e)
    {
        e.preventDefault();

        var controlForm = $('.controls form:first'),
            currentEntry = $(this).parents('.voca:first'),
            newEntry = $(currentEntry.clone()).appendTo(controlForm);

        newEntry.find('input').val('');
        controlForm.find('.btn-add:not(:last)')
            .removeClass('btn-default').addClass('btn-danger')
            .removeClass('btn-add').addClass('btn-remove')
            
            .html('<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>- ');
    }).on('click', '.btn-remove', function(e)
    {
		$(this).parents('.voca:first').remove();

		e.preventDefault();
		return false;
	});
});

function applyAttendance() {

  var subject     = document.getElementById("roomSubject");
  var deviceid    = document.getElementById("roomDeviceID");
  var room        = document.getElementById("roomName");

  var attendee    = document.getElementsByName("attendee");
  var startAngle  = document.getElementsByName("startAngle");
  var endAngle    = document.getElementsByName("endAngle");
  // removed color picker from ui
//  var userColor   = document.getElementsByName("usercolor");


  document.querySelector("#create-layout").style.display = "flex";
  document.querySelector("#create-btn").style.display = "flex";
      
  //
  var xhr = new XMLHttpRequest();
  xhr.open('GET', './pages/layout.html', true);
  
  xhr.onload = function(){
    if(this.status == 200){
      var output = this.responseText;
    
      document.getElementById('create-layout').innerHTML = output;
    
      var attendees = [];
      var size = document.getElementsByName("attendee").length;
      for (var i = 0; i < size; i++) {
          if (attendee[i].value != "") {
              attendees.push(new Object({
                  mt_attendee_id: attendee[i].value,
                  angle_begin: parseInt(startAngle[i].value, 10),
                  angle_end: parseInt(endAngle[i].value, 10),
                  color: FIXED_COLORS[i],
              }));
              console.log(`applyattendee: ${attendee[i].value}, ${FIXED_COLORS[i]}`);
          }
      }
      console.log(attendees);

      layout_devide(attendees, "new");

      //for(var i in attendees){
      //  layout_changeColor(i, attendees[i].color);
      //}

    }
  }

  xhr.send();
}

