const calendar =
document.getElementById("calendar");

const monthTitle =
document.getElementById("monthTitle");

let currentDate = new Date();

let events =
JSON.parse(
localStorage.getItem("events")
) || [];

let selectedDate = null;

function renderCalendar(){

calendar.innerHTML="";

const year =
currentDate.getFullYear();

const month =
currentDate.getMonth();

const firstDay =
new Date(year,month,1);

const lastDay =
new Date(year,month+1,0);

monthTitle.innerText =
firstDay.toLocaleString(
"ru",
{
month:"long",
year:"numeric"
}
);

for(let i=1;i<=lastDay.getDate();i++){

const day =
document.createElement("div");

day.className="day";

const dateKey =
`${year}-${month+1}-${i}`;

day.innerHTML=
`<strong>${i}</strong>`;

if(
new Date().toDateString() ===
new Date(year,month,i).toDateString()
){
day.classList.add("today");
}

day.addEventListener(
"click",
()=>{
selectedDate=dateKey;
openModal();
}
);

day.addEventListener(
"dragover",
e=>e.preventDefault()
);

day.addEventListener(
"drop",
e=>{
const id =
e.dataTransfer.getData("id");

const ev =
events.find(
x=>x.id==id
);

ev.date=dateKey;

saveEvents();
renderCalendar();
}
);

events
.filter(e=>e.date===dateKey)
.forEach(event=>{

const div =
document.createElement("div");

div.className="event";

div.draggable=true;

div.innerText=
event.title;

div.addEventListener(
"dragstart",
e=>{
e.dataTransfer.setData(
"id",
event.id
);
}
);

div.onclick=(ev)=>{
ev.stopPropagation();

editEvent(event);
};

day.appendChild(div);

});

calendar.appendChild(day);
}

updateChart();
}

function openModal(){
document.getElementById(
"eventModal"
).style.display="flex";
}

function saveEvents(){

localStorage.setItem(
"events",
JSON.stringify(events)
);
}

document
.getElementById("saveEvent")
.onclick=()=>{

events.push({
id:Date.now(),
date:selectedDate,
title:
document.getElementById(
"eventTitle"
).value,
description:
document.getElementById(
"eventDescription"
).value
});

saveEvents();

renderCalendar();

eventModal.style.display="none";
};

function editEvent(eventObj){

selectedDate=
eventObj.date;

document.getElementById(
"eventTitle"
).value=
eventObj.title;

document.getElementById(
"eventDescription"
).value=
eventObj.description;

eventModal.style.display="flex";
}

document
.getElementById("prevBtn")
.onclick=()=>{
currentDate.setMonth(
currentDate.getMonth()-1
);
renderCalendar();
};

document
.getElementById("nextBtn")
.onclick=()=>{
currentDate.setMonth(
currentDate.getMonth()+1
);
renderCalendar();
};

document
.getElementById("themeToggle")
.onclick=()=>{
document.body.classList.toggle(
"dark"
);
};

document
.getElementById("searchInput")
.addEventListener(
"input",
e=>{

const q =
e.target.value.toLowerCase();

document
.querySelectorAll(".event")
.forEach(el=>{

el.style.display=
el.innerText
.toLowerCase()
.includes(q)
?
"block"
:
"none";

});

}
);

document
.getElementById("importFile")
.addEventListener(
"change",
e=>{

const file =
e.target.files[0];

const reader =
new FileReader();

reader.onload=()=>{

try{

const data =
JSON.parse(
reader.result
);

events.push(...data);

saveEvents();

renderCalendar();

}catch(err){

alert(
"Ошибка импорта"
);

}

};

reader.readAsText(file);

}
);

let chart;

function updateChart(){

const counts={};

events.forEach(e=>{

const month =
e.date.split("-")[1];

counts[month] =
(counts[month]||0)+1;

});

const ctx =
document.getElementById(
"statsChart"
);

if(chart){
chart.destroy();
}

chart =
new Chart(ctx,{
type:"bar",
data:{
labels:Object.keys(counts),
datasets:[
{
label:"События",
data:Object.values(counts)
}
]
}
});
}

renderCalendar();