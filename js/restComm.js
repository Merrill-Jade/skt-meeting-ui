//
// restComm.js
//

// define variables 

//let url = "http://34.64.142.157:48081";
let url = "http://223.39.118.74:8200";
let isAuth = 1;

let audioCtx;
let source;
let songLength;


// define functions

async function CommJoinMember(data)
{
    return new Promise(async (resolve, reject) => {
        try {
            let res = await post_s(url + '/meeting/account/v1/add', data);
            //var info = res.response.mt_info;
     
            console.log("response: ", res.response);

            resolve(res.response);

        } catch(err) {
            reject(err);
        }
    });
}


function CommLoginMember(data)
{
    post(url + '/meeting/authenticate', data)
    .then(function(d) {

      setCookie('username', data.id, 1);
      setCookie('token', d.response.entry.token, 1);

      showLoginInfo();

    }).catch(function(err) {
        console.error("[DATA] " + JSON.stringify(data));
        console.error("[ERROR] " + err.status.description);
    });
}

async function CommCreateMinutes(data)
{
    return new Promise(async (resolve, reject) => {
        try {
            let res = await post_s(url + '/meeting/v1/create', data);
            var info = res.response.mt_info;
     
            console.log("response: ", res.response);
     
            data.mt_id = info.mt_id;
            data.time_created = info.time_created;
     
            resolve(data);
        }catch(err) {
            reject(err);
        };
    });
}

function CommDeleteMinutes(id)
{
    const data = {
        mt_id: id
    }

    post_s(url + '/meeting/v1/delete', data)
    .then(function(d) {
        console.log(d.response);
    }).catch(function(err) {
        console.error("[DATA] " + JSON.stringify(data));
        console.error("[ERROR] " + JSON.stringify(err));
    });

}

async function CommModifyMinutes(data)
{
    return new Promise(async (resolve, reject) => {
        try {
            let res = await post_s(url + '/meeting/v1/update', data);
            
            console.log("response: ", res.response);

            if (parseInt(res.response.status.code) == 0) {
                resolve(res.response.mt_info);
            } else {
                reject(res.response.status.code);
            }
        }catch(err){
            reject(err);
        };
    });
}

function CommFinishMinutes(id)
{
    const data = {
        mt_id: id
    }

    post_s(url + '/meeting/v1/terminate', data)
    .then(function(d) {
        console.log(d.response);
    }).catch(function(err) {
        console.error("[DATA] " + JSON.stringify(data));
        console.error("[ERROR] " + JSON.stringify(err));
    });
}

async function CommClosedMinutesList()
{
    return new Promise(async (resolve, reject) => {
        try {
            let res = await xhr_s('GET', url + '/meeting/v1/get/terminated')

            console.log("response: ", res.response);

            resolve(res.response.mt_list);

        } catch (err) {
            reject(err);
        }
    });
}

function CommClosedMinutes(id)
{
    return new Promise(async (resolve, reject) => {
        try {
            const data = {
                mt_id: id
            }
            let res = await post_s(url + '/meeting/v1/get', data)

            console.log("response: ", res.response);
            resolve(res.response.mt_list);
        } catch (err) {
            reject(err);
        }
    });
}

async function CommOnGoingMinutesList() 
{
    return new Promise(async (resolve, reject) => {
        try {
            let res = await xhr_s('GET', url + '/meeting/v1/get/ongoing');

            console.log("response: ", res.response);

            resolve(res.response.mt_list);

        } catch (err) {
            reject(err);
        }
    });
}


function CommDeviceList()
{
    var list = document.getElementById('resList');

    xhr_s('GET', url + '/meeting/v1/get/devices/available')
    .then(function(d) {
        var devices = d.response.mt_list;

        list.innerHTML = "";

        for(var i in devices){
            var txt = devices[i].mt_device_id;
            list.innerHTML += '<a href="#" onclick="clickedResList(this, 0)" class="list-group-item list-group-item-action">' + txt + '</a>';
        }

    }).catch(function(err) {
        var response = JSON.parse(err);
        console.error("[ERROR] " + response);

        list.innerHTML = response.status.description;
    });

}

function CommRoomList()
{
    return new Promise(async (resolve, reject) => {
        try {
            let res = await xhr_s('GET', url + '/meeting/v1/get/rooms/available');

            console.log("response: ", res.response);

            resolve(res.response.mt_list);

        } catch(err) {
            reject(err.response.status.description);
        }
    });
}

function CommDownloadAudioFile(id)
{
    try
    {
        if(window.webkitAudioContext) {
          audioCtx = new window.webkitAudioContext();
        } else {
          audioCtx = new window.AudioContext();
        }

        source = audioCtx.createBufferSource();

        request = new XMLHttpRequest();
        request.open('GET', url+'/meeting/audio/v1/get/'+id, true);
        request.setRequestHeader("Authorization", "Bearer "+getCookie('token'));

        request.responseType = 'arraybuffer';

        request.onload = function() {
            let audioData = request.response;

            audioCtx.decodeAudioData(audioData, function(buffer) {

                source.buffer = buffer;
                source.playbackRate.value = 1;
                source.connect(audioCtx.destination);
                //source.loop = true;

                console.log(buffer.duration);

                source.start(0);

            }, 
            function(e) {
                console.error("Error with decoding audio data" + e.err);
            });
        }
    
        request.send();
    }
    catch(e)
    {
        alert('Web Audio API is not supported in this browser');
    }

    

}

// mode (0)ongoing, (1)closed-minutes
function CommClosedMinuteUtterance(minute)
{
    return new Promise(async (resolve, reject) => {
         try {
            const data = {
                mt_id: minute.mt_id,
                time_created: minute.time_created
            };

            let res = await post_s(url + '/meeting/minute/v1/get', data);

            console.log("response: ", res.response);

            if (res.response.entries !== undefined)
                resolve(res.response.entries);
            else 
                resolve("");

        } catch (err) {
            reject(err);
        }
    });
}

/*
function CommClosedMinuteUtterance2(mode, minute)
{
    const data = {
        mt_id: minute.mt_id,
        time_created: minute.time_created
    };

    post_s(url + '/meeting/minute/v1/get', data)
    .then(function(d) {
        
        console.log(d.response);

        if (mode === 1 || parseInt(d.response.status.code) === 0)
        {
            var messages = d.response.entries;


            //console.log("message >> " + messages[0]);
        
            for(var i in messages){                
                if (messages[i].last_command == "SPEECH_RECOGNITION") {
                    //console.log(messages[i].id);
                    createMessage(getNameByAngle( minute.mt_attendees, messages[i].angle), messages[i].utterance, messages[i].angle, messages[i].time_begin,
                                                    getColorByAngle(minute.mt_attendees, messages[i].angle), mode, messages[i].id );
                }
            }

            // OnGoing
            if (mode === 0)
            {
                let time_epoch = messages[messages.length-1].time_begin;
                //console.log("time_epoch: ", time_epoch, 1);
                procOnGoingMinute(minute.mt_attendees, minute.mt_id, time_epoch);
                //poll_s( minute.mt_id, minute.time_created); //time_epoch );
            }
        } else {
                // When a new meeting has started.
                console.log("-- Nothing to display --");

                if (minute.mt_attendees !== undefined) {
                    minute.mt_attendees.forEach(({ mt_attendee_id: name, color }, i) => {
                        addParticipantToList(name, color);
                    });
                }

                procOnGoingMinute(minute.mt_attendees, minute.mt_id, minute.time_created);
        }


    }).catch(function(err) {
        console.error("[DATA] " + JSON.stringify(data));
        console.error(err);
        console.error("[ERROR] " + JSON.stringify(err));
    });
}
*/

let mapMsgState = new Map();

async function procOnGoingMinute(attendees, id , time)
{

    mapMsgState.clear();

        
    for (var i=0; i < attendees.length; i++) {
        layout_changeColor(i, '#e0e0e0');
    }

    await subscribeOnGoingMinute(attendees, id, time);
}

async function subscribeOnGoingMinute(attendees, id , time)
{
   const data = {
      mt_id: id,
      time_epoch: time
    };

    let response = await fetch(url + '/meeting/minute/v1/get', {
        method: 'POST',
        mode: 'cors',
        //cache: 'no-cache',
        //credentials: 'omit',
        headers: {
            //'Access-Control-Allow-Origin':'*',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookie('token')
        },
        //redirect: 'follow',
        //referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    });

    //console.log("..... test .... ")

    if (response.status == 502) {
        // Status 502 is a connection timeout error,
        // may happen when the connection was pending for too long,
        // and the remote server or a proxy closed it
        // let's reconnect
        console.error("> status 502 returned.");
        await subscribeOnGoingMinute(attendees, id, time);
    } else if (response.status != 200) {
        // An error - let's show item
        console.error("status code is not 200", response);

        // Reconnect in on second
        await new Promise(resolve => setTimeout(resolve, 500));
        await subscribeOnGoingMinute(attendees, id, time);
    } else {
        // Get and show the message 
        let message = await response.text();
        let messages = JSON.parse(message).entries;

        if (messages === null || messages === "" || messages === undefined) {
            console.error("messages is null.", message);
            // Reconnect in on second
            await new Promise(resolve => setTimeout(resolve, 500));
            await subscribeOnGoingMinute(attendees, id, time);
        }

        console.log("[ messages] ", messages);

        var time_epoch = time;
        for (var i in messages) {
            var angle = messages[i].angle;
            var index = Number(getIndexByAngle(attendees, angle));
            var name = getNameByAngle(attendees, angle);
            var color = getColorByAngle(attendees, angle);
            
            time_epoch = messages[i].time_begin; 

            // [ISSUE]
            // 1. 짧은발에화 대해 ADD_SPEECH_DATA 가 포함되지 않음
            // 2. CREATE가 순서를 보장하지 않음 

            if (messages[i].last_command == "CREATE") {

                if ( !mapMsgState.has(angle) ) {
                    console.log("[CREATE] ", name);
                    createMessage(name, "", angle, messages[i].time_begin, color, 0);

                    console.log("index: ", index, " color: ", color);
                    layout_changeColor(index, color);
                    layout_showBubble(index);

                    mapMsgState.set(angle, { state: 'CREATE', time: messages[i].time_begin });
                }
            } else if (messages[i].last_command == "ADD_SPEECH_DATA") {

                if ( !mapMsgState.has(angle) ) {
                    console.log("[CREATE w/ ADD] ", name);
                    createMessage(name, "", angle, messages[i].time_begin, color, 0);

                    console.log("index: ", index, " color: ", color);
                    layout_changeColor(index, color);
                    layout_showBubble(index);

                    mapMsgState.set(angle, { state: 'CREATE', time: messages[i].time_begin });
                } else {
                    var d1 = new Date(mapMsgState.get(angle).time);
                    var d2 = new Date(messages[i].time_begin);
                    if (d1 < d2) {
                        console.log("[ADD] angle: ", angle, "partial: ", messages[i].partial_utterance);
                        updateMessage(angle, messages[i].partial_utterance);
                    
                        mapMsgState.set(angle, { state: 'ADD', time: messages[i].time_begin});
                    }
                }
            } else if (messages[i].last_command == "SPEECH_RECOGNITION") {

                //if (mapMsgState.has(angle)) {
                    console.log("[END] angle: ", angle, "utterance: ", messages[i].utterance);
                    if (messages[i].utterance === undefined)
                        console.error("undefined message: ", messages[i]);

                    updateMessage(angle, messages[i].utterance);

                    layout_changeColor(index, '#eee');
                    layout_disapperBubble(index);

                    if (mapMsgState.has(angle)) 
                        mapMsgState.delete(angle);
                //}

            }

            /*
            if (messages[i].last_command == "CREATE") {

                if ( !mapMsgState.has(angle) ) {
                    console.log("[CREATE] ", name);
                    createMessage(name, "", angle, messages[i].time_begin, color, 0);

                    console.log("index: ", index, " color: ", color);
                    layout_changeColor(index, color);
                    layout_showBubble(index);

                    mapMsgState.set(angle, { state: 'CREATE', time: messages[i].time_begin });
                }
            } else if (messages[i].last_command == "ADD_SPEECH_DATA") {

                if (mapMsgState.has(angle)) {
                    var d1 = new Date(mapMsgState.get(angle).time);
                    var d2 = new Date(messages[i].time_begin);
                    if (d1 < d2) {
                        console.log("[ADD] angle: ", angle, "partial: ", messages[i].partial_utterance);
                        updateMessage(angle, messages[i].partial_utterance);
                    
                        mapMsgState.set(angle, { state: 'ADD', time: messages[i].time_begin});
                    }
                }
            } else if (messages[i].last_command == "SPEECH_RECOGNITION") {

                if (mapMsgState.has(angle)) {
                    console.log("[END] angle: ", angle, "utterance: ", messages[i].utterance);
                    if (messages[i].utterance === undefined)
                        console.error("undefined message: ", messages[i]);

                    updateMessage(angle, messages[i].utterance);

                    layout_changeColor(index, '#eee');
                    layout_disapperBubble(index);
                    mapMsgState.delete(angle);
                }

            }
        */
        }

        // Call subscribe again to ge the next message 
        await subscribeOnGoingMinute(attendees, id, time_epoch);
        //await new Promise(resolve => setTimeout(resolve, 50));
    }
}
