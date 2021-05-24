

// args
//      - flag: 0 (ongoing), 1 (closed-minutes)
function addChatListItem(minute, num, flag, readonly=0){
    var chatList = document.getElementById('chatList');

    // minute을 눌렀을 시 나오는 상세 정보를 표기하는 영역
    var detail = addChatListItemDetail(num, minute, flag, readonly);

    // modal 안에서 하나의 list item을 생성
    // --------------------------------------------------
    var scrollJumper = document.createElement('a');
    var contentWrapper = document.createElement('button');

    var titleBox = document.createElement('div');
    var title = document.createElement('h5');

    var titleAgo = document.createElement('small'); // 추후 없어질 수도 있음. 타이틀 옆의 ~일전 문구

    var attendance = document.createElement('small');
    var attendanceArray = `${minute.mt_room} - `;

    scrollJumper.margin = 0;
    scrollJumper.padding = 0;
    scrollJumper.id = `chatListItem${num}`;
    scrollJumper.href = `#chatListItem${num}`;
    scrollJumper.style.textDecoration = "none";
    title.style.textDecoration = "none";
    titleAgo.style.textDecoration = "none";
    attendance.style.textDecoration = "none";

    contentWrapper.classList.add("list-group-item", "list-group-item-action");
    contentWrapper.style.textDecoration = "none";
    contentWrapper.setAttribute("data-bs-toggle", "collapse");
    contentWrapper.setAttribute("data-bs-target", `#chatListItemCollapse${num}`);
    contentWrapper.type = "button";
    contentWrapper.setAttribute("aria-controls", `chatListItemCollapse${num}`);
    contentWrapper.addEventListener('click', () => {
        if (contentWrapper.classList.contains("btn-primary"))
            contentWrapper.classList.remove("btn-primary");
        else
            contentWrapper.classList.add("btn-primary");
    });

    titleBox.classList.add("d-flex", "w-100", "justify-content-between");
    title.classList.add("mb-1");

    // modal title/devicde id data 입력
    title.innerHTML = minute.mt_title;
    titleAgo.innerHTML = elapsedTime(minute.time_created); // 추후 없어질 수도 있음. 타이틀 옆의 ~일전 문구

    if (minute.mt_attendees) {
        minute.mt_attendees.forEach(({ mt_attendee_id: id }) => {
            attendanceArray += (id + ', ');
        });
        attendance.innerHTML = attendanceArray.substring(0, attendanceArray.length - 2);
    }

    // 관계예 맞춰 element append / modal의 리스트에 append 
    titleBox.appendChild(title);
    titleBox.appendChild(titleAgo); // 추후 없어질 수도 있음. 타이틀 옆의 ~일전 문구

    contentWrapper.appendChild(titleBox);
    contentWrapper.appendChild(attendance);

    scrollJumper.appendChild(contentWrapper);

    chatList.appendChild(scrollJumper);
    chatList.appendChild(detail);
}


// Modal의 subject를 클릭 시 나오는 하단 collapse를 생성하는 함수
// `chatListItemCollapse${num}`가 각 subject에 대한 각각의 collapse의 id를 의미
// flag==1: closed minute, flag==0: ongoing minute
function addChatListItemDetail(num, minute, flag, readonly) {
    var wrapper = document.createElement('div');
    var card = document.createElement('div');
    var table = document.createElement('div');
    var viewMinuteBtn = document.createElement('button'); // view minute button

    var deviceID = addChatListItemDetailTableData("Device ID", minute.mt_device_id);
    var startTime = addChatListItemDetailTableData("Start Time", minute.time_created);
    var endTime = addChatListItemDetailTableData("End Time", minute.time_terminated);
    var modalTitle = document.getElementById("chatListModalTitle");

    if (!readonly) {
        var modifyBtn = document.createElement('button'); // modify button

        modifyBtn.type = "button";
        modifyBtn.classList.add("btn", "btn-success");
        modifyBtn.innerHTML = "Modify";
        modifyBtn.addEventListener('click', () => {
            openModalForModify(minute, num);
        });
        modifyBtn.setAttribute('data-bs-toggle', "modal");
        modifyBtn.setAttribute('data-bs-target', "#newMeetModal");
        modifyBtn.style.display = "inline-block";
        modifyBtn.style.float = "left";

    }

    if (!readonly && flag === 1) {
        var deleteBtn = document.createElement('button'); // delete button
        deleteBtn.type = "button";
        deleteBtn.classList.add("btn", "btn-danger");
        deleteBtn.innerHTML = "Delete";
        //data-bs-toggle="modal" data-bs-target="#logoutModal" 
        deleteBtn.addEventListener('click', () => {

            //$('#MinuteDeleteModal').modal('show');

            var target = document.getElementById(wrapper.id);
            target.previousElementSibling.remove();
            target.remove();

            CommDeleteMinutes(minute.mt_id);
        });
        deleteBtn.style.display = "inline-block";
        deleteBtn.style.float = "left";
        deleteBtn.style.marginRight = "0.5rem";

    }

    wrapper.classList.add("collapse", "list-item-detail");
    wrapper.id = `chatListItemCollapse${num}`;
    card.classList.add("card", "card-body");
    table.classList.add("container");
    viewMinuteBtn.type = "button";
    viewMinuteBtn.classList.add("btn", "btn-warning");
    viewMinuteBtn.innerHTML = "View Minute";

    viewMinuteBtn.addEventListener('click', async () => {
        let data = await CommClosedMinutes(minute.mt_id);
        //console.log("Old Minute: ", minute)
        //console.log("New Minute: ", data[0]);
        if(modalTitle.innerHTML.includes("실시간")){
            goToOngoing(data[0], num);

        }else{
            goToMinutes(data[0], num);
        }
    });
    viewMinuteBtn.setAttribute('data-bs-dismiss', "modal");
    viewMinuteBtn.style = "display: inline-block; float: right; margin-left: 0.5rem;";

    table.appendChild(deviceID);
    table.appendChild(startTime);
    if (flag !== 0) {
        table.appendChild(endTime);
    }
    table.appendChild(viewMinuteBtn);
    if(!readonly && flag === 1){
        table.appendChild(deleteBtn);
    }
    if (!readonly)
        table.appendChild(modifyBtn);

    card.appendChild(table);
    wrapper.appendChild(card);


    return wrapper;
}