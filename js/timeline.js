let timeline = document.querySelector("#timeline");

function timeLine_days(validTimes){
    let dataDate = []; 

    validTimes.forEach((time,index) => {
        let date = new Date(time);
        let day = date.getDate();
        let dayOfWeek = date.getDay();

        if(dataDate.some(el=> el.day === day)) return;
        dataDate.push({day,dayOfWeek:getDay(dayOfWeek),time});
    });
    
    updateTimeLineUI(dataDate);
    
  return dataDate; 
}


function updateTimeLineUI(dataDate){
    timeline.innerHTML = "";
    dataDate.forEach(element => {
            timeline.innerHTML += `<aside ><span>${element.dayOfWeek} </span> <span>${element.day}</span></aside>`
    });
}

function getDay(dayOfWeek){
    let days = ["Söndag","Måndag", "Tisdag", "Onsdag","Torsdag","Fredag","Lördag"]; 
    return days[dayOfWeek]; 
}

function timeline_events(){
    let timeline_children = timeline.querySelectorAll("aside");  
    timeline_children.forEach((asideEl,index)=> {
        updateSelectedDayUI(timeline_days[index].time,selectedTime,asideEl);

        asideEl.addEventListener('click', ()=> {
            selectedTime = timeline_days[index].time; //update the selected time 
            resetTimelineClassesUI(timeline_children);
            updateSelectedDayUI(timeline_days[index].time,selectedTime,asideEl);

        })

    });
}



function updateSelectedDayUI(current,selected,DOMElement){
    if(current=== selected){
        DOMElement.classList.add("timeline-selected"); 
    }else {
        DOMElement.classList.remove("timeline-selected");
    }

}

function resetTimelineClassesUI(timeline_children){
    timeline_children.forEach(child => {
        child.setAttribute("class","");
    }); 
}