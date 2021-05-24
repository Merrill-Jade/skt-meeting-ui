//import common from "common.js";

function modifyHeaderInfo(minute) {

  var title = document.querySelector(".chatroom-title-wrapper h5");
  var description = document.querySelector(".chatroom-title-wrapper span");

  //console.log("initHeaderInfo - minute: ", minute);

  title.innerHTML = `<b>Meeting ID:</b> ${minute.mt_id}`;
  description.innerHTML = `(${minute.mt_title}, ${minute.time_created.substr(0, minute.time_created.length-4)}, ${minute.mt_room})`;

}

function initHeaderInfo(minute, flag) {

  var titleIcons = document.querySelectorAll(".chatroom-title-img img");

  var viewlistBtn = document.querySelector('.chatroom-btnmenu-wrapper button');
  var terminateMinBtn = document.getElementById('terminateMinute');

  console.log(`initheaderinfo flag : ${flag}`);

  modifyHeaderInfo(minute);

// flag=1 : goToMinute, flag=0: goToOngoing
  if(flag === 1){
    viewlistBtn.removeEventListener('click', viewOngoingMinutes);
    viewlistBtn.addEventListener('click', () => { viewClosedMinutes(1) });
    terminateMinBtn.style.visibility = "hidden";
    titleIcons[1].style.display = "none";
    titleIcons[0].style.display = "flex";
  }else{
    terminateMinBtn.addEventListener('click', () => { CommFinishMinutes(minute.mt_id) });
    viewlistBtn.removeEventListener('click', viewClosedMinutes);
    viewlistBtn.addEventListener('click', () => { viewOngoingMinutes(1) });
    terminateMinBtn.style.visibility = "visible";
    titleIcons[1].style.display = "flex";
    titleIcons[0].style.display = "none";
  }

  var modifySeatBtn = document.getElementById('modifySeat');
  modifySeatBtn.addEventListener('click', () => {
    openModalForModify(minute, -1);

  });

}

// input does not set yet; can change to other arguments
function addParticipantToList(name, color) {
  var list = document.querySelector(".participants");

  var person = document.createElement('li');
  var personCircle = document.createElement('div');
  var personName = document.createElement('span');

  personName.innerHTML = name;
  personCircle.classList.add("p-color-circle");
  personCircle.style = `background-color: ${color};`

  console.log('addParticipantList', color);

  person.appendChild(personCircle);
  person.appendChild(personName);

  list.appendChild(person);
}

// 기존 participant list에 있는 내용을 지움
function clearParticipantList(){
  var list = document.querySelectorAll(".participants li");

  for(var i=0; i<list.length; i++){
    list[i].firstElementChild.remove(); // color circle
    list[i].firstElementChild.remove(); // name

    list[i].remove();
  }
}

function getNameByAngle(attendees, angle) {
  for (var i in attendees) {
    if (attendees[i].angle_begin <= angle && attendees[i].angle_end >= angle) {
      return attendees[i].mt_attendee_id;
    }
  }
}

function getColorByAngle(attendees, angle) {
  for (var i in attendees){
    if (attendees[i].angle_begin <= angle && attendees[i].angle_end >= angle) {
      return attendees[i].color;
    }
  }
}

function getIndexByAngle(attendees, angle) {
  for (var i in attendees) {
    if (attendees[i].angle_begin <= angle && attendees[i].angle_end >= angle) {
      return i;
    }
  }
}

// closed minute 
async function procClosedMinuteData(minute) {
  
    try {
      let messages = await CommClosedMinuteUtterance(minute);

      if (messages !== "") {  

        for(var i in messages){                
            if (messages[i].last_command == "SPEECH_RECOGNITION") {
                //console.log(messages[i].id);
                createMessage(getNameByAngle( minute.mt_attendees, messages[i].angle), messages[i].utterance, messages[i].angle, messages[i].time_begin,
                                                getColorByAngle(minute.mt_attendees, messages[i].angle), 1, messages[i].id );
              console.log(`${getNameByAngle(minute.mt_attendees, messages[i].angle)}: ${getColorByAngle(minute.mt_attendees, messages[i].angle)}`);
            }
        }

      }

      minute.mt_attendees.forEach(({ mt_attendee_id: name, color }, i) => {
          addParticipantToList(name, color);
      });
      
      layout_devide(minute.mt_attendees);
    } catch(err) {
      console.error(err);
    }

}

function updateMessage(angle, newMsg){
  var msgListAngles = document.querySelectorAll('.chat-msg-wrapper .name-wrapper small');
  var msgListText = document.querySelectorAll('.chat-msg-wrapper .msg-text-wrapper');


  //msgListAngles.forEach((item) => {
  //  item = item.innerHTML.substr(0, item.innerHTML.length-2);
  //j});
  //console.log("msgListAngles", msgListAngles);

  if(newMsg === ""){
    // 빈 메세지가 온다는 건, update를 하지 말아야 한다는 걸 의미하기에 함수 강제종료!
    return ;
  }
    
//    msgListNames.push(getNameByAngle(attendees, angle));
   
  var targetIdx = msgListAngles.length-1;

  for(var i in msgListAngles){
    if(msgListAngles[msgListAngles.length - i - 1].innerHTML === `${angle}°`) {
      targetIdx = msgListAngles.length-i-1; break;
    }
  }

  console.log("found last index: ", targetIdx);

  msgListText[targetIdx].innerHTML = newMsg;



//  console.log("target message: "targetMsg);

//  console.log(msgListNames);

  
/*
  // i는 사람수 혹은 각도 개수? 가 되겠네요
  for(var i in msgListAngles){
    
    var str = msgListAngles[i].innerHTML;
    if (str === "")
    {
      console.log("i: ", i);
      console.log("..: ", msgListAngles);
    }

//    var len = msgListAngles[i].innerHTML.length;
    //console.log(".. ", msgListAngles[i].innerHTML);
    var val = msgListAngles[i].innerHTML.substr(0, len-1);
    //console.log("... ", val);
    msgListNames.push(getNameByAngle(attendees, val));
  }
  console.log("msgListNames: ", msgListNames);
  
  // 입력된 speaker의 마지막 msg 
  var targetMsg = msgList[msgListNames.lastIndexOf(`${getNameByAngle(attendees, angle)}`)];

  console.log("targetMsg", targetMsg);
  //console.log(targetMsg.querySelector('.msg-text-wrapper').tagName);

  //targetMsg.querySelector('.msg-text-wrapper').innerHTML = newMsg;
  */
}

function rawTimeToString(time){
  var rawTime = new Date(time);

  return `${rawTime.getHours() < 10 ? "0" + rawTime.getHours() : rawTime.getHours()}:${rawTime.getMinutes() < 10 ? "0" + rawTime.getMinutes() : rawTime.getMinutes()}:${rawTime.getSeconds() < 10 ? "0" + rawTime.getSeconds() : rawTime.getSeconds()}`; 
}

// voice: playable audio file - wav, 등등
function createMessage(name, msg, angle, timeBegin, color, flag, audio="") {
  var chatBox = document.querySelector('.chatmsglist-wrapper');
  console.log(msg);

  // element for new message
  var chatMsgWrap = document.createElement('div');
  var tempRow1 = document.createElement('div');
  var userIconWrap = document.createElement('div');
  var userIcon = document.createElement('i');

  var contentsWrap = document.createElement('div');
  var tempRow2 = document.createElement('div');
  var nameWrap = document.createElement('div');
  var userName = document.createElement('strong');
  var userAngle = document.createElement('small');
  var time = document.createElement('small');

  var tempRow3 = document.createElement('div');
  var playTextWrap = document.createElement('div');

  // flag 1: closed minute ; flag 0 : ongoing minute;
  if(flag === 1){
    var playIcon = document.createElement('a');
      // audio url 자리에 각 메세지 오디오 파일의 주소가 오거나, 와야 함
      // function parameter로 들어온 audio가 이미 Audio()파일을 갖고 있어야 함
    //var voice = new Audio("https://freesound.org/data/previews/511/511618_6552981-lq.mp3");


    playIcon.classList.add("fas", "fa-play-circle", "fa-lg", "msg-playicon");
    playIcon.id = audio;
    playIcon.addEventListener('click', () => {
      
      if(playIcon.classList.contains('fa-play-circle')){
//        playIcon.classList.remove('fa-play-circle');
//        playIcon.classList.add('fa-pause-circle');
        //console.log("clicked: " + playIcon.id);
        CommDownloadAudioFile(playIcon.id);
      }else{
//        playIcon.classList.remove('fa-pause-circle');
//        playIcon.classList.add('fa-play-circle');
        source.stop(0);
      }
    });

    playTextWrap.appendChild(playIcon);
  }

  var text = document.createElement('p');

  tempRow1.className = tempRow2.className = tempRow3.className = "row";

  userIconWrap.className = "col-1";
  userIconWrap.style = `align-items: center; margin: auto;`;
  userIcon.classList.add("fas", "fa-user-circle", "fa-3x");
  userIcon.style = `color: ${color};`;

  userIconWrap.appendChild(userIcon);

  contentsWrap.className = "col";

  nameWrap.className = "name-wrapper";
  userName.innerHTML = name; /////

  time.innerHTML = rawTimeToString(timeBegin);
  time.className = "msg-time";

  userAngle.innerHTML = `${angle}°`;

  nameWrap.appendChild(userName);
  nameWrap.appendChild(userAngle);

  tempRow2.appendChild(nameWrap);

  playTextWrap.className = "msg-wrapper";

  text.classList.add("msg-text-wrapper");
  text.innerHTML = msg;
  

  playTextWrap.appendChild(text);
  playTextWrap.appendChild(time);

  tempRow3.appendChild(playTextWrap);

  contentsWrap.appendChild(tempRow2);
  contentsWrap.appendChild(tempRow3);

  tempRow1.appendChild(userIconWrap);
  tempRow1.appendChild(contentsWrap);

  chatMsgWrap.className = "chat-msg-wrapper";
  chatMsgWrap.appendChild(tempRow1);

  chatBox.appendChild(chatMsgWrap);

  chatBox.scrollTop = chatBox.scrollHeight;
}
// 
async function procOngoingData(minute) {

    let time_epoch = minute.time_created;

    try {
      let messages = await CommClosedMinuteUtterance(minute);

      if (messages !== "")
      {
        for(var i in messages){                
            if (messages[i].last_command == "SPEECH_RECOGNITION") {
                //console.log(messages[i].id);
                createMessage(getNameByAngle( minute.mt_attendees, messages[i].angle), messages[i].utterance, messages[i].angle, messages[i].time_begin,
                                                getColorByAngle(minute.mt_attendees, messages[i].angle), 0, messages[i].id );
            }
        }
        
        time_epoch = messages[messages.length-1].time_begin;
      }

      minute.mt_attendees.forEach(({ mt_attendee_id: name, color }, i) => {
          addParticipantToList(name, color);
      });

      console.log(">>>> ", minute)
      if (typeof minute.isnew == 'undefined')
      {
        layout_devide(minute.mt_attendees, "chatview");
      } else { 
        console.log("[INFO] layout copied!!");
        layout_copy("svg-wrapper", "svg-wrapper-chatview");
      }

      //console.log("time_epoch: ", time_epoch, 1);
      procOnGoingMinute(minute.mt_attendees, minute.mt_id, time_epoch);

    } catch(err) {
      console.error(err);
    }
}

function terminateMinute(){
  //// server에게 session 종료 요청하는 함수!!!!!
  console.log("terminated");
}

/*
var chatManager = new function() {
  var interval  = 500;
  var xhr       = new XMLHttpRequest();

  xhr.onreadystatechange = function()
  {
    if (xhr.readyState == 4 && xhr.status == 200)
    {
      var res = JSON.parse(xhr.responseText);
      finalData = res.data;

      chatManager.show(res.data);

      // sleep (200ms)


      // get chat message
      //chatManager.proc();
    }
  } 

  xhr.onload = function(){

      if(this.status == 200){

        var messages = JSON.parse(this.responseText).entries;

        for (var i in messages) {
          console.log("["+ messages[i].angle+"] "+messages[i].utterance);
        }
      }
  }

  this.proc = function(id, created)
  {
    const data = {
      mt_id: id,
      time_created: created,
      time_epoch: created
    };

    console.log("id: "+id+", time_created: "+created);

    xhr.open('POST', url + '/minute/v1/get', true);
    xhr.setRequestHeader("Authorization", "Bearer "+getCookie('token'));
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));
  }

  this.show = function(data)
  {

  }

  // 페이지 로딩을 끝마치면 채팅내용 가져오기 시작 [추가]
  //window.onload = function()
  //{
  //    chatManager.proc();
  //}

}
  */
