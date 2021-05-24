
let xmlns = "http://www.w3.org/2000/svg";

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

//=================================New functions start here=================================================================

// New Images Path
let newImages = {
  "peoples": {
    1: "./resources/People/People_01.svg",
    2: "./resources/People/People_02.svg",
    3: "./resources/People/People_03.svg",
    4: "./resources/People/People_04.svg",
    5: "./resources/People/People_05.svg",
    6: "./resources/People/People_06.svg",
    7: "./resources/People/People_07.svg",
    8: "./resources/People/People_08.svg"
  },

  "imageAngles" : {
    1 : 0,
    2 : 45,
    3 : 90,
    4 : 135,
    5 : 180,
    6 : 225,
    7 : 270,
    8 : 315
  },

  "table" : "./resources/Table.svg"

}

let imageIndexes = [];

let imagesDeg = [];



/*
 attendee : {
    name : string,
    startAngle : number,
    startAngle : number,
    color : string
  }
*/
let newRadius = 185; //defining radius of the circle
let newStartingPoints = {
  x: 250,
  y: 250
}
function newPartion(attendee, index, mode) {


  if (direction == 1) {
    startingAngle = attendee.angle_begin+ referenceHeadAngle - margin;
    endingAngle = attendee.angle_end+ referenceHeadAngle + margin;
  } else{
    startingAngle = referenceHeadAngle - attendee.angle_begin+ margin;
    endingAngle = referenceHeadAngle  - attendee.angle_end- margin;
  }

  imageToBeDisplayed = index;
  //console.log(`newPartion: ${index}`);

  imageIndexes.push(imageToBeDisplayed);

  //console.log(`People_0${imageToBeDisplayed}`);

  if(mode === "chatview"){
    document.querySelector(`.svg-wrapper-chatview #People_0${imageToBeDisplayed}`).style.display = 'block';
  }else{
    document.querySelector(`.svg-wrapper #People_0${imageToBeDisplayed}`).style.display = 'block';
  }
  degToRotate = 0;

  var imageAngle = newImages["imageAngles"][imageToBeDisplayed];

  // Put the image on ref angle

  degToRotate = -imageAngle + referenceHeadAngle;

  if (direction == 1) {
    degToRotate += attendee.angle_begin+ Math.abs(attendee.angle_begin- attendee.angle_end)/2;
  } else{
    degToRotate -= attendee.angle_begin+ Math.abs(attendee.angle_begin- attendee.angle_end)/2;
  }

  imagesDeg.push(degToRotate);

  if(mode === "chatview"){
    document.querySelector(`.svg-wrapper-chatview #People_0${imageToBeDisplayed}`).style.transform = `rotate(${degToRotate}deg)`;
  }else{
    document.querySelector(`.svg-wrapper #People_0${imageToBeDisplayed}`).style.transform = `rotate(${degToRotate}deg)`;
  }

  var path = document.createElementNS(xmlns, "path");

  //console.log(">>>> " + attendee.color);
  path.setAttributeNS(null, 'stroke', attendee.color);
  path.setAttributeNS(null, 'fill', "none");
  path.setAttributeNS(null, 'stroke-width', 7);
  path.setAttributeNS(null, 'class', 'circlePart general');
  path.setAttributeNS(null, 'id', `Path_0${index}`);

  if (direction == 1) {
    var arc = describeArc(newStartingPoints.x, newStartingPoints.y, newRadius, startingAngle, endingAngle);
  } else{
    var arc = describeArc(newStartingPoints.x, newStartingPoints.y, newRadius,endingAngle, startingAngle);
  }

  path.setAttribute("d", arc)
  if(mode === "chatview"){
    document.querySelector(`.svg-wrapper-chatview #circleParent`).appendChild(path);
  }else{
    document.querySelector(`.svg-wrapper #circleParent`).appendChild(path);
  }
}


function layout_changeColor(index, color, mode="chatview"){
  if(mode === "chatview"){
    document.querySelector(`.svg-wrapper-chatview #Path_0${index + 1}`).setAttributeNS(null, 'style', `stroke: ${color}`);
  }else{
    document.querySelector(`.svg-wrapper #Path_0${index + 1}`).setAttributeNS(null, 'style', `stroke: ${color}`);
  }
}

function layout_showBubble(index, mode="chatview"){
  var imageIndex = imageIndexes[index];
  var degToRotate = imagesDeg[index];

  if(mode === "chatview"){
    //console.log("imageIndex: ", imageIndex);
    //console.log(document.querySelector(`.svg-wrapper-chatview .bubble-wrapper #Bubble_0${imageIndex}`).id);

    document.querySelector(`.svg-wrapper-chatview #Bubble_0${imageIndex}`).style.display = 'block';
    document.querySelector(`.svg-wrapper-chatview #Bubble_0${imageIndex}`).style.transform = `rotate(${degToRotate}deg)`;
  }else{
    document.querySelector(`.svg-wrapper #Bubble_0${imageIndex}`).style.display = 'block';
    document.querySelector(`.svg-wrapper #Bubble_0${imageIndex}`).style.transform = `rotate(${degToRotate}deg)`;
  }
}

function layout_disapperBubble(index, mode="chatview"){
  var imageIndex = imageIndexes[index];
  var degToRotate = imagesDeg[index];

  if(mode === "chatview"){
    //console.log("imageIndex: ", imageIndex);
    document.querySelector(`.svg-wrapper-chatview #Bubble_0${imageIndex}`).style.display = 'none';
  }else{
    document.querySelector(`.svg-wrapper #Bubble_0${imageIndex}`).style.display = 'none';
  }
}

// *** note: layout(string) must be the "svg-wrapper-NAME"
function layout_clear(targetLayout){
  var targetPath = document.querySelectorAll(`.${targetLayout} #circlePatent path`);
  var targetPeople = document.querySelectorAll(`.${targetLayout} .people-wrapper img`);
  var targetBubble = document.querySelectorAll(`.${targetLayout} .bubble-wrapper img`);
  
  // delete all pathes from DOM
  targetPath.forEach((item) => { item.remove(); });

  // replace all people img to new element
  // bubble wrapper also counts in 8, thus added to loop
  for(var i in targetPeople){
    let person = document.createElement('img');
    let bubble = document.createElement('img');

    person.src = `.resources/People/People_0${i+1}.svg`;
    person.id = `People_0${i+1}`;
    person.className = "people";

    bubble.src = `.resources/Bubble/Bubble_0${i+1}.svg`;
    bubble.id = `Bubble_0${i+1}`;
    bubble.className = "bubble";

    targetPeople[i].parentElement.replaceChild(person, targetPeople[i]);

    targetBubble[i].parentElement.replaceChild(bubble, targetBubble[i]);
  }
}

// svgLayout: string of classname(ex: "svg-wrapper-LAYOUTNAME")
function getPartionLength(svgLayout){
  return document.querySelectorAll(`.svg-wrapper-${svgLayout} #circleParent path`).length;
}

/* 

  numberOfPartions: Number of people to be placed on a circular desk (min:2, max: 8),
  attendees : attendee[],
*/

/*
var attendees = [
  {
    mt_attendee_id : "John",
    color : "#eee",
    angle_begin: 180,
    angle_end: 180
  },
  {
    mt_attendee_id : "John",
    color : "#ff0cc0",
    angle_begin: 30,
    angle_end: 60
  },
  {
    mt_attendee_id : "John",
    color : "#ff0000",
    angle_begin: 90,
    angle_end: 150
  }
]
*/

function createPartions(numberOfPartions, attendees, mode="chatview"){
  for (var i = 0; i < numberOfPartions; i++) {
    newPartion(attendees[i], i+1, mode);
  }
}


let referenceHeadAngle = 180;  //reference Head
let direction = -1; // clockwise : 1, anticlockwise : -1
let margin = 10;

function layout_devide(attendees, mode="chatview"){
//  clearPartion();
  if(mode === "chatview"){
    document.querySelector(`.svg-wrapper-chatview #tableImage`).setAttribute("src", newImages["table"]);
    createPartions(attendees.length, attendees, mode);
    //createPartions(attendees.length, attendees, "listview");
  }else{
    document.querySelector(".svg-wrapper #tableImage").setAttribute("src", newImages["table"]);
    createPartions(attendees.length, attendees, "listview");
  }
  //showBubble(0);
  //console.log(attendees[0].color)
  //layout_changeColor(0, "#33445f");
}

// *** note: srcLayout and destLayout must on the HTML; layout: String("classname");
function layout_copy(srcLayout, destLayout){
  var srcPath = document.querySelectorAll(`.${srcLayout} #circleParent path`);
  var destPath = document.querySelectorAll(`.${destLayout} #circleParent path`);
  var destPathParent = document.querySelector(`.${destLayout} #circleParent`);

  var srcPeople = document.querySelectorAll(`.${srcLayout} .people-wrapper img`);
  var destPeople = document.querySelectorAll(`.${destLayout} .people-wrapper img`);

  var srcBubble = document.querySelectorAll(`.${srcLayout} .bubble-wrapper img`);
  var destBubble = document.querySelectorAll(`.${destLayout} .bubble-wrapper img`);

  // remove all pathes from destLayout
  destPath.forEach((item) => { item.remove(); });

  //console.log("pathLength:", srcPath.length);
  // copy the srcPath and append to destLayout
  for (var i=0; i<srcPath.length; i++){
    //console.log(srcPath[i].id);
    destPathParent.appendChild(srcPath[i].cloneNode(false));
  }

  // copy the srcPeople & srcBubble then append to destLayout
  // instead of copy all attributes, cloning would be easier
  for (var i=0; i<srcPeople.length; i++){
    destPeople[i].parentElement.replaceChild(srcPeople[i].cloneNode(true), destPeople[i]);
    destBubble[i].parentElement.replaceChild(destBubble[i].cloneNode(true), destBubble[i]);
  }
}

//init();
