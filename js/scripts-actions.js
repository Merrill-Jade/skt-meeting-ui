
                          // Changing follows can be effect the functionality 


/* ========================================================================================================
*                                            Functions                                                    *
*                                                                                                         *
*                  01. setRefferenceHead(angle) -> required the angle for the refference head             *
*                  02. createPartions(numberOfPartions) -> required number of partions to be created      *
*                  03. setMessage() -> providing setMessage funtinality                                   *
*                  04. setMessageTimeOut() -> sets time out for the mmessage                              *
*                                                                                                         *
*                                                                                                         *
*                                                                                                         *
*                                                                                                         *
*=========================================================================================================*/


// =============Configurations can be done here======================
let messageBlinkingTime = 1000; //Set blinking duration
let messageDisplayTime = 5000;  //Message Displaying duration
let colors = ["d92027", "ff9234", "ffcd3c", "35d0ba", "fcf876", "cee397", "8bcdcd", "3797a4"]
let refferanceHeadAngle = 0;  //refferance Head
// =============Configurations Ending======================


let startingAngle = refferanceHeadAngle;
let endingAngle = 0;
let angleDegree = 0;
let radius = 200; //defining radius of the circle
let startingPoints = {
  x: 240,
  y: 240
}
let images = {
  image: {
    2: "resources/2.svg",
    3: "resources/3.svg",
    4: "resources/4.svg",
    5: "resources/5.svg",
    6: "resources/6.svg",
    7: "resources/7.svg",
    8: "resources/8.svg"
  },
  angle: {
    2: 90,
    3: 55,
    4: 50,
    5: 35,
    6: 30,
    7: 30,
    8: 30
  }
}
let xmlns = "http://www.w3.org/2000/svg";


//=================================Critical funtions [doing changes can be effect the functinality]==========================================


// ============================================================
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  let angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}


// ============================================================
function describeArc(x, y, radius, startAngle, endAngle) {

  let start = polarToCartesian(x, y, radius, endAngle);
  let end = polarToCartesian(x, y, radius, startAngle);
  let arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

  let d = [
    "M", start.x, start.y,
    "A", radius, radius, 0, arcSweep, 0, end.x, end.y,
  ].join(" ");
  return d;
}


// ============================================================
function show(x, y, radius, angle) {

  let start = polarToCartesian(x, y, radius, angle);
  let end = polarToCartesian(x, y, radius, angle);
  let rotation = 180 + +angle
  document.getElementById("head").setAttribute("transform", `rotate(${rotation} ${end.x} ${end.y})`)
  document.getElementById("head").setAttribute("transition", `all 5s;`)
  // let arcSweep = angle - angle <= 180 ? "0" : "1";

  let d = [
    end.x, end.y, , end.x - 10, end.y - 30, , end.x + 10, end.y - 30
  ].join(" ");

  return d;
}


// ============================================================
function setRefferenceHead(angle) {
  // let start = polarToCartesian(x, y, radius, angle);
  let end = polarToCartesian(startingPoints.x, startingPoints.y, radius, angle);
  let rotation = +angle
  document.getElementById("ref_head").setAttribute("transform", `rotate(${rotation} ${end.x} ${end.y})`)
  // let arcSweep = angle - angle <= 180 ? "0" : "1";

  let d = [
    end.x, end.y, , end.x - 10, end.y - 30, , end.x + 10, end.y - 30
  ].join(" ");

  return d;
}


// ============================================================
function partion(size) {

  let angle = 360 / size;
  endingAngle = angle + +startingAngle;
  angleDegree = angle;
  let index = 1

  document.querySelectorAll(".circlePart").forEach(el => { el.remove() })
  document.getElementById("tableImage").setAttribute("src", images.image[size])
  document.getElementById("tableImage").setAttribute("style", `transform: rotate(${+images.angle[size] + +refferanceHeadAngle}deg);`)
  document.getElementById("head").setAttribute("style", `fill:none`)

  while (size !== 0) {
    let path = document.createElementNS(xmlns, "path");
    let starting = (+index - 1) * +angle

    path.setAttributeNS(null, 'stroke', `#${colors[index - 1]}`);
    path.setAttributeNS(null, 'm', `arc${index}`);
    path.setAttributeNS(null, 'fill', "none");
    path.setAttributeNS(null, 'stroke-width', 7);
    path.setAttributeNS(null, 'class', 'circlePart general');
    path.setAttributeNS(null, 'id', `${starting}-${(index != 0 && endingAngle - refferanceHeadAngle - 1 == -1) ? 360 : endingAngle - refferanceHeadAngle - 1}`);

    let arc = describeArc(startingPoints.x, startingPoints.y, radius, +startingAngle + 1, +endingAngle - 1);
    path.setAttribute("d", arc)
    document.getElementById("circleParent").appendChild(path)

    startingAngle = +startingAngle + +angle;
    if (startingAngle >= 360) { startingAngle = +startingAngle - 360 }

    endingAngle = +endingAngle + +angle;
    if (endingAngle >= 360) { endingAngle = +endingAngle - 360 }

    size--;
    index++;
  }

}

//=================================Critical funtions Ends Here=================================================================







// ============================================================
function layout_devide() {
  let portionsElement = document.getElementById("portions")
  if(!portionsElement){
    partion(2);
  }
  else{
    partion(portionsElement.value);
  }
}


// ============================================================
function createPartions(numberOfPartions){
  partion(numberOfPartions);
}


// ============================================================
function setRef() {
  let angle = document.getElementById("ref_head_angle").value
  let refferenceHeadPoints = setRefferenceHead(angle)

  document.getElementById("ref_head").setAttribute("points", refferenceHeadPoints)
  refferanceHeadAngle = angle;
  startingAngle = angle;

  let portions = document.getElementById("portions").value
  partion(portions)
}


// =========================can be customised by providing first two varibles -> angle and message===================================
function setMessage() {
  let angle = document.getElementById("angle").value  //getting degree to point out, from inputs
  let message = document.getElementById("message").value //getting massage from html inputs


  let angleToShw = +angle + +refferanceHeadAngle;
  let head = show(startingPoints.x, startingPoints.y, radius, angleToShw);

  document.getElementById("head").setAttribute("points", head)

  let indcator = 360 / +angle

  document.querySelectorAll(".circlePart").forEach((element, i) => {
    let boundValues = element.getAttribute("id").split("-");
    if (!element.classList.contains("general")) {
      element.classList.add("general")
    }
    if (+angle >= +boundValues[0] && +angle < +angleDegree + +boundValues[0]) {
      let head = document.getElementById("head");
      head.setAttribute("style", `fill:#${colors[i]}`)

      let t = +head.getBoundingClientRect().top,
        l = +head.getBoundingClientRect().left,
        w = +head.getBoundingClientRect().width;

      let left = angle > 180 ? -150 : 150
      let top = 0
      let classMidifier = ""
      let messageAngle = +angle + +refferanceHeadAngle
      if (messageAngle >= 360) {
        messageAngle = +messageAngle - 360
      }
      if (messageAngle <= 90) {
        top = -40; left = 130;
        classMidifier = "first"
      } else if (messageAngle <= 180) {
        left = 140, top = 55
        classMidifier = "second"
      } else if (messageAngle < 270) {
        top = 50, left = -125;
        classMidifier = "third"
      } else { top = -50, left = -130, classMidifier = "fourth" }

      let messagePara = $('<p></p>')
      messagePara.html(message)
      let div = $('<div class="pop-over">')
        .css({
          "left": l + left,
          "top": +t + top
        })
        .addClass(classMidifier)
        .append(messagePara)
        .appendTo(document.body);

      div.addClass('blink');
      setTimeout(function () {
        div.removeClass("blink")
      }, messageBlinkingTime);
      setTimeout(function () {
        div.addClass('fade-out');
        setTimeout(function () { div.remove(); }, messageDisplayTime);
      }, messageDisplayTime);


      element.classList.toggle("general")
    }
  });;


}


// ============================================================
//devide();


// ============================================================
function config() {
  setMessageTimeOut(document.getElementById("displayTime").value)
  messageBlinkingTime = document.getElementById("blinkingTime").value
}


//=====================setTime==================================
function setMessageTimeOut(timeout){
  messageDisplayTime=timeout;
}

