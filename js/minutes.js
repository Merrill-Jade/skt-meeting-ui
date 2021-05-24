
// 
/*
var loginModal = document.getElementById('chatListModal');
loginModal.addEventListener('shown.bs.modal', function(event){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://34.64.142.157:48081/meeting/v1/get/terminated', true);
    xhr.setRequestHeader("Authorization", "Bearer "+getCookie('token'));

    xhr.onload = function(){
    
    if(this.status == 200){
        var Minutes = JSON.parse(this.responseText).mt_list;
    
        var output = '';
        var input ="<tr>"+"<th >Device ID</th>"+"<th >Meeting Title</th>"+"</tr>";
        var attendee = '';
    
    
        for(var i in Minutes){
            console.log(Minutes[i]);
        }
    
        //document.getElementById("Minutes").innerHTML =input+output;
    }
    }
    if (isUserLoggedIn()) xhr.send();

});
*/

// 오늘까지의 경과시간 계산 함수
function elapsedTime(startTime){
    var start = new Date(startTime);
    var now = Date.now();
    //if (typeof start !== 'number') return 'NaN';

    const SECOND = 1000;
    const MINUTE = 1000 * 60;
    const HOUR = 1000 * 60 * 60;
    const DAY = 1000 * 60 * 60 * 24;
    const MONTH = 1000 * 60 * 60 * 24 * 30;
    const YEAR = 1000 * 60 * 60 * 24 * 30 * 12;

    // const elapsed = ((new Date()).valueOf() - start)
    const elapsed = now - start;

    if (elapsed <= MINUTE) return `${Math.round(elapsed / SECOND)} sec ago`;
    if (elapsed <= HOUR) return `${Math.round(elapsed / MINUTE)} min ago`;
    if (elapsed <= DAY) return `${Math.round(elapsed / HOUR)} hour ago`;
    if (elapsed <= MONTH) return `${Math.round(elapsed / DAY)} day ago`;
    if (elapsed <= YEAR) return `${Math.round(elapsed / MONTH)} month ago`;
    return `${Math.round(elapsed / YEAR)} year`;
}


function clickedDeleteMinute()
{
    //var chatList = document.getElementById('chatList');

    var target = document.getElementById(wrapper.id);
    target.previousElementSibling.remove();
    target.remove();

    CommDeleteMinutes(minute.mt_id);
}

// 똑같은 코드가 세 번 추가되어야 해서 함수로 나누었습니다. 
// Modal의 subject를 클릭 시 하단 collapse에 나오는 테이블에 내용 한 줄 추가하는 함수
function addChatListItemDetailTableData(titleText, dataText){
    var tableRow = document.createElement('div');
    var title = document.createElement('strong');
    var data = document.createElement('p');
    
    tableRow.classList.add("row");
    title.classList.add("col");
    data.classList.add("col-8");

    title.innerHTML = titleText;
    data.innerHTML = dataText;

    tableRow.appendChild(title);
    tableRow.appendChild(data);

    return tableRow;
}

function clearChatList(){
    var chatList = document.getElementById('chatList');

    chatList.innerText = "";

    while(chatList.childElementCount !== 0){
        chatList.firstElementChild.remove();
    }
}

function test_xxx() {
    console.log("...test...xxx...")
}

async function viewClosedMinutes(readonly){
    var modalTitle = document.getElementById('chatListModalTitle');
    modalTitle.innerHTML = "지난 회의록";

    // 기존 chatList에 내용이 있다면 비워주는 함수(ongoing을 누른 후 closed를 누를 시 리스트에 누적되는 것 방지)
    clearChatList();

    try {
        let Minutes = await CommClosedMinutesList();
        if(Minutes.length === 0){
            emptyChatListItem();
        } else {
        
            for(var i in Minutes){
                 addChatListItem(Minutes[i], i, 1, readonly);
            }
        }
    } catch (err) {
        console.error(err);
    }
}

async function viewOngoingMinutes(readonly=0){
    var modalTitle = document.getElementById('chatListModalTitle');
    modalTitle.innerHTML = "실시간 회의록";

    // 기존 chatList에 내용이 있다면 비워주는 함수(ongoing을 누른 후 closed를 누를 시 리스트에 누적되는 것 방지)
    clearChatList();

    try {
        let Minutes = await CommOnGoingMinutesList();
        if(Minutes.length === 0){
            emptyChatListItem();
        } else {
           for(var i in Minutes){
               addChatListItem(Minutes[i], i, 0, readonly);
           }
        }
    } catch (err) {
        console.error("[ERROR] ", err);
        //if (Number(err.response.status.code) == 3110)
        {
            var chatList = document.getElementById('chatList');
            chatList.innerText = err.response.status.description;
        }
    }
}

async function viewMinutesList() {

}

function listDeviceEnum(){
    var modalTitle = document.getElementById('listResModalTitle');
    modalTitle.innerHTML = "Select the device to use";

    document.getElementById('resList').innerHTML = "";

    CommDeviceList();

}

async function listRoomEnum(){
    var list = document.getElementById('resList');
    var modalTitle = document.getElementById('listResModalTitle');
    modalTitle.innerHTML = "Select the room to use";

    document.getElementById('resList').innerHTML = "";

    try {
        let rooms = await CommRoomList();


        list.innerHTML = "";

        for(var i in rooms){
            var txt = rooms[i].mt_room;
            list.innerHTML += '<a href="#" onclick="clickedResList(this, 1)" class="list-group-item list-group-item-action">' + txt + '</a>';
        }
    } catch(err) {
        //console.error(err);
        list.innerHTML = err;
    }
}

function appendResItem(name){
    var resourcelist = document.getElementById('resList');

    var listRow = document.createElement('ul');
    var resName = document.createElement('li');

    listRow.classList.add("list-group");
    resName.classList.add("list-group-item");

    var nameSpan = document.createElement('span');
    nameSpan = name;

    resName.appendChild(nameSpan);

    listRow.appendChild(resName);
    resourcelist.appendChild(listRow);
}


// newMeetModal을 modify용으로 ongoing/closed meeting에서 불러 오는 함수
function openModalForModify(minute, num){
    clearAttendanceForm();

    var modalTitle = document.getElementById("newMeetModalTitle");
    var modalBtn = document.querySelector("#create-btn");
    var modifyBtn = modalBtn.cloneNode(true);

    var roomSubject = document.getElementById("roomSubject");
    var roomDeviceID = document.getElementById("roomDeviceID");
    var roomName = document.getElementById("roomName");

    modalTitle.innerHTML = "회의 내용 변경";
    modifyBtn.innerHTML = "수정";

    roomSubject.value = minute.mt_title;
    roomDeviceID.value = minute.mt_device_id;
    roomDeviceID.disabled = true;
    roomDeviceID.nextElementSibling.disabled = true;
    roomName.value = minute.mt_room;

    if (minute.mt_attendees !== undefined) {
        minute.mt_attendees.forEach((item, idx) => {
            addAttendeeForm(item.mt_attendee_id, item.angle_begin, item.angle_end, "btn-remove");
        });
    }

    addAttendeeForm();

    modifyBtn.addEventListener('click', () => { clickedModifyMeet(minute, num); });
    
    modalBtn.parentNode.replaceChild(modifyBtn, modalBtn);
}

async function clickedModifyMeet(minute, num){
    clearNewMeetInputValidation();
    
    // 모든 데이터가 다 차 있을때(subject, deviceid, attendee info)
    if(!isInputEmpty(document.getElementById("roomSubject")) && !isInputEmpty(document.getElementById("roomDeviceID")) && checkAttendance()){ 
        var data = {
            mt_device_id: minute.mt_device_id,
            mt_id: minute.mt_id,
            mt_user_id: minute.mt_user_id,
            mt_room: minute.mt_room,
            mt_title: minute.mt_title,
            mt_attendees: [],
            time_created: minute.time_created,
            time_terminated: minute.time_terminated
        }

        var attendee = document.getElementsByName("attendee");
        var startAngle = document.getElementsByName("startAngle");
        var endAngle = document.getElementsByName("endAngle");

        console.log("length: " + attendee.length);
        for (var i = 0; i < attendee.length; i++) {
            if (attendee[i].value != "") {
                data.mt_attendees.push(Object({
                    mt_attendee_id: attendee[i].value,
                    angle_begin: startAngle[i].value,
                    angle_end: endAngle[i].value,
                    color: FIXED_COLORS[i],
                }));
            }
        }
        console.log("modified attendee: ", data.mt_attendees);

        try{
            data = await CommModifyMinutes(data);
            console.log("modified data: ", data);

            $("#newMeetModal").modal('hide');

        }catch(err){
            console.error("[ERROR] " + JSON.stringify(err));
            ////// modifycomm에서 오는 에러메세지에 대해 처리
            // 아직 에러 종류를 모름....
            if(err.response.status.code == "???"){

            }
        }
        /*
        if (mode == "chatview") {
            clearParticipantList();
            data.mt_attendees.forEach(({ mt_attendee_id: name, color }, i) => {
                // later on, first argument should be the name of attendee: minute.mt_attendees.mt_attendee_id
                addParticipantToList(name, color);
            });
            // attendance.innerHTML = attendanceArray.substring(0, attendanceArray.length - 2);

            layout_copy("svg-wrapper", "svg-wrapper-chatview");
        }
        */

//////////// 변경한 내용에 대해 chatview에서도 수정해주는 내용이 추가적으로 들어가야 함////////////////////

        // num == -1인 경우 chatview창에서 보이는 attendance list도 수정되어야 함
        if (num == -1) {
            clearParticipantList();

            console.log(data.mt_attendees);

            for (var i = 0; i < data.mt_attendees.length; i++) {
                addParticipantToList(data.mt_attendees[i].mt_attendee_id, data.mt_attendees[i].color);
            }

            modifyHeaderInfo(data);

            layout_copy("svg-wrapper", "svg-wrapper-chatview");

            var chatlistItems = document.querySelectorAll("#chatList a");
            var chatlistItemDetails = document.querySelectorAll("#chatList .list-item-detail");

            // 검색하려니 문제가 있음.
            // 현재 chatList에 들어 있는 정보
            // title, room, device id, create time, terminated time, attendance id(name)
            // minute.mt_id값으로 db에서 몇 번째 데이터인지 검색해와서 수정하는 식으로 해야 할 듯함..
        }
        
        // modal의 값을 수정된 값으로 변경
        var chatListItem = document.getElementById(`chatListItem${num}`).firstElementChild;
        var title = chatListItem.firstElementChild.firstElementChild;
        var attendance = chatListItem.firstElementChild.nextElementSibling;

        var attendanceArray = `${data.mt_room} - `;

        title.innerHTML = data.mt_title;
        console.log("---> title: ", data.mt_attendees.mt_title);

        if (data.mt_attendees) {
            data.mt_attendees.forEach(({ mt_attendee_id: id }) => {
                attendanceArray += (id + ', ');
            });
            attendance.innerHTML = attendanceArray.substring(0, attendanceArray.length - 2);
        }

        console.log(attendance.innerHTML);

        $("#newMeetModal").modal('hide');

    }
}

// clear attendance form in new meeing/modify modal
function clearAttendanceForm(){
    var attendanceList = document.querySelectorAll("#attendanceForm .voca");

    console.log(attendanceList.length);

    for(var i=0; i<attendanceList.length; i++){
        document.querySelectorAll("#attendanceForm .voca .input-group .form-control").forEach((item) => { item.remove(); });
        document.querySelector("#attendanceForm .voca .input-group button span").remove();
        document.querySelector("#attendanceForm .voca .input-group button").innerHTML = "";
        document.querySelector("#attendanceForm .voca .input-group button").remove();
        document.querySelector("#attendanceForm .voca .input-group .invalid-feedback").innerHTML = "";
        document.querySelector("#attendanceForm .voca .input-group .invalid-feedback").remove();
        document.querySelector("#attendanceForm .voca .input-group").remove();
        document.querySelector("#attendanceForm .voca").remove();
    }
}

function addAttendeeForm(name="Name", startAngle="Start Angle", endAngle="End Angle", btnState="btn-add") {
    var attendanceList = document.querySelector("#attendanceForm");

    var attendeeItem = document.createElement('div');
    var wrapper = document.createElement('div');

    var nameInput = document.createElement('input');
    var startAngleInput = document.createElement('input');
    var endAngleInput = document.createElement('input');

    // removed color picker
//    var colorInput = document.createElement('input');
 
    var button = document.createElement('button');
    var btnText = document.createElement('span');

    var feedback = document.createElement('div');

    attendeeItem.classList.add("voca");
    wrapper.classList.add("input-group", "mb-3", "has-validation");

    nameInput.classList.add("form-control", "col-4");
    if(name === "Name"){
        nameInput.value = "";
    }else{
        nameInput.value = name;
    }
    nameInput.placeholder = name;
    nameInput.name = "attendee";
    nameInput.type = "text";

    startAngleInput.classList.add("form-control", "col-2");
    if(startAngle === "Start Angle"){
        startAngleInput.value = "";
    }else{
        startAngleInput.value = startAngle;        
    }
    startAngleInput.placeholder = startAngle;
    startAngleInput.name = "startAngle";
    startAngleInput.type = "text";

    endAngleInput.classList.add("form-control", "col-2");
    if(endAngle === "End Angle"){
        endAngleInput.value = "";
    }else{
        endAngleInput.value = endAngle;
    }
    endAngleInput.placeholder = endAngle;
    endAngleInput.name = "endAngle";
    endAngleInput.type = "text";

    /* removed color input
    colorInput.classList.add("form-control", "form-control-color", "col-1");
    colorInput.name = "usercolor";
    colorInput.value = color;
    colorInput.title = "Choose your color.";
    colorInput.type = "color";
    */
    button.classList.add("btn", "btn-success", btnState);
    btnText.classList.add("glyphicon");
    button.type = "button";
    button.appendChild(btnText);

    if(btnState === "btn-remove"){
        startAngleInput.value = startAngle;
        endAngleInput.value = endAngle;
//        colorInput.value = color;
        button.classList.add("btn-danger");
        btnText.classList.add("glyphicon-minus");
        button.append("-");
    }else{
        button.classList.add("glyphicon-plus-sign");
        button.append("+");
    }

    feedback.innerHTML = "회의 참여자 정보를 다시 한번 확인해 주세요.";
    feedback.className = "invalid-feedback";

    wrapper.appendChild(nameInput);
    wrapper.appendChild(startAngleInput);
    wrapper.appendChild(endAngleInput);
//    wrapper.appendChild(colorInput);
    wrapper.appendChild(button);
    wrapper.appendChild(feedback);

    attendeeItem.appendChild(wrapper);

    attendanceList.appendChild(attendeeItem);
}

// newMeetModal을 modify용으로 ongoing/closed meeting에서 불러 오는 함수        
function openModalForNewMeet() {

    if(!isUserLoggedIn()) {

        console.log("new meet without log in");
        /*
        var newMeetBtn = document.getElementById('newMeetBtn');
        newMeetBtn.removeAttribute('data-bs-target');
        newMeetBtn.setAttribute('data-bs-target', '#needLoginModal');
        */         
        return;
    }

    clearAttendanceForm();

    var modalTitle = document.getElementById("newMeetModalTitle");
    var modalBtn = document.querySelector("#create-btn");
    var createBtn = modalBtn.cloneNode(true);

    var roomSubject = document.getElementById("roomSubject");
    var roomDeviceID = document.getElementById("roomDeviceID");
    var roomName = document.getElementById("roomName");

    modalTitle.innerHTML = "새 회의록";
    createBtn.innerHTML = "Create";
    createBtn.addEventListener('click', clickedCreateNewMeet);

    roomSubject.value = "";
    roomSubject.placeholder = "Subject";
    roomDeviceID.value = "";
    roomDeviceID.placeholder = "Device ID";
    roomName.value = "";
    roomName.placeholder = "Room Name";
    roomDeviceID.disabled = false;
    roomDeviceID.nextElementSibling.disabled = false;

    addAttendeeForm();

    document.getElementById('create-layout').innerHTML = "";

    modalBtn.parentNode.replaceChild(createBtn, modalBtn);

}

function clearNewMeetInputValidation() {
    var inputs = document.querySelectorAll(".newmeet-form .row .input-group input");
    var attendees = document.querySelectorAll("#attendanceForm .voca .input-group input");

    // subject, room, deviceid에 대하여 validation clear
    inputs.forEach(input => {
        if (input.classList.contains('is-invalid')) 
            input.classList.remove('is-invalid');
    });

    // attendance list에 대하여 validation clear
    attendees.forEach(attendee => {
        if(attendee.classList.contains('is-invalid'))
            attendee.classList.remove('is-invalid');
    });
}

function isAttendeeInfoFilled(name, startAngle, endAngle){
    // 필드가 비어 있는 경우
    if(name.value == "" || startAngle.value == "" || endAngle.value == ""){
        name.classList.add("is-invalid");
        return false;
    }

    // angle값이 숫자가 아닌 경우
    if(isNaN(startAngle) || isNaN(endAngle)){
        name.classList.add("is-invalid");
    }

    return true;
}

function checkAttendance(){
    var attendee = document.getElementsByName("attendee");
    var startAngle = document.getElementsByName("startAngle");
    var endAngle = document.getElementsByName("endAngle");

    console.log("checkAttendance", attendee.length);
    if(!isAttendeeInfoFilled(attendee[0], startAngle[0], endAngle[0])){
        return false;
    }

    // 빈 필드가 있는지만 검사
    for(var i = 0; i < attendee.length-1; i++){
        if (!isAttendeeInfoFilled(attendee[i], startAngle[i], endAngle[i])) {
            return false;            
        }
    }
    
    // 추가적으로 검사해야 하는 내용이 있을 시 수행
    // angle값이 겹치는 경우
    // 

    return true;
}

async function clickedCreateNewMeet()
{
    clearNewMeetInputValidation();

    // 모든 데이터가 다 차 있을때(subject, deviceid, attendee info)
    if (!isInputEmpty(document.getElementById("roomSubject")) && !isInputEmpty(document.getElementById("roomDeviceID")) && checkAttendance()) {
        var data = {
            mt_device_id: document.getElementById("roomDeviceID").value,
            mt_title: document.getElementById("roomSubject").value,
            mt_room: document.getElementById("roomName").value,
            mt_user_id: getCookie('username'),
            mt_attendees: [],
        }
        var attendee = document.getElementsByName("attendee");
        var startAngle = document.getElementsByName("startAngle");
        var endAngle = document.getElementsByName("endAngle");

         //console.log("color>> " + userColor[0].value
        for (var i = 0; i < attendee.length; i++) {
            if (attendee[i].value != "") {
                data.mt_attendees.push(new Object({
                    mt_attendee_id: attendee[i].value,
                    angle_begin: startAngle[i].value,
                    angle_end: endAngle[i].value,
                    color: FIXED_COLORS[i],
                }));
            }
        }
        console.log("created attendee: ", data.mt_attendees);

        try {
            data = await CommCreateMinutes(data);
            data.isnew = 1;

            $("#newMeetModal").modal('hide');

            goToOngoing(data);

        } catch (err) {
            console.error("[ERROR] " + JSON.stringify(err));
            // createcomm에서 오는 에러메세지에 대해 처리
            ////// code 1218 check!!!!!!!!!!!!!
            switch(err.response.status.code){
                case "1218": 
                    document.getElementById("roomName").parentElement.lastElementChild.innerHTML = "다른 회의에서 사용 중인 방입니다.";
                    document.getElementById("roomName").classList.add("is-invalid");

                    break;
                case "1219": // 각도 겹침 문제
                    break;
            }
        }

    }
}

function clickedResList(el, id) {
    $("#listResModal").modal('hide');

    if (id === 0)
        document.getElementById('roomDeviceID').value = el.innerHTML;
    else 
        document.getElementById('roomName').value = el.innerHTML;
}

function searchChatItem(){
    console.log("search function called");

    var chatListItem = document.querySelectorAll("#chatList a");
    var chatListItemDetail = document.querySelectorAll("#chatList .list-item-detail");
    chatListItem.forEach((item) => {
        item.style.display = "none";
    });
    chatListItemDetail.forEach((item) => {
        if(item.classList.contains("show")){
            item.classList.remove("show");
        }
    });
    
    var titles = document.querySelectorAll('#chatList h5');
    var detail = document.querySelectorAll('#chatList p');
    var target = document.getElementById("chatListModalSearch").firstElementChild;

    // 입력값
    console.log(`input: ${target.value}`);
    if(target.value !== ""){
        target.style.display = "block";
    }

    // i%3==0마다 Device id가 있음. 체크
    for(let i=0; i<detail.length; i+=3){
        if(detail[i].innerHTML.includes(target.value)){
            chatListItem[i%3].style.display = "block";
        }
    }

    for(let i=0; i<titles.length; i++){
        if(titles[i].innerHTML.includes(target.value)){
            chatListItem[i].style.display = "block";
        }        
    }
/*
    titles.forEach((item) => {
        if(item.innerHTML.includes(target.value)){
            console.log(item.innerHTML);
        }
    });
    */
}

function emptyChatListItem(){
    var chatList = document.getElementById("chatList");
    var wrapper = document.createElement("div");
    var icon = document.createElement("i");
    var text = document.createElement("label");

    wrapper.style.width = "100%";
    wrapper.style.height = "500px";
    wrapper.style.margin = "0 auto";
    wrapper.style.padding = "0";
    wrapper.style.display = "block";
    wrapper.style.justifyContent = "center";

    icon.style.width = "200px;";
    icon.style.alignSelf = "center";
    icon.style.display = "block";

    text.style.textAlign = "center";
    text.style.display = "block";

    icon.classList.add("fa", "fa-sad-tear");
    text.innerHTML = "표시할 채팅 목록이 없습니다.";

    wrapper.appendChild(icon);
    wrapper.appendChild(text);

    chatList.appendChild(wrapper);
}