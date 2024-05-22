
let timeline = document.querySelector("#timeline");

function timeLine_functionality (validTimes,selectedTime){
    let dataDate = []; 
    let selectedDay = new Date(selectedTime).getDate();

    validTimes.forEach(time => {
        let date = new Date(time); 
        let day = date.getDate();
        let dayOfWeek = date.getDay();

        if(dataDate.some(el=> el.day === day)) return ;
        dataDate.push({day,dayOfWeek}); 
    });


    dataDate.forEach(element => {
        if(element.day === selectedDay) {
            timeline.innerHTML += `<aside class="timeline-selected"><span>${getDay(element.dayOfWeek)} </span> <span>${element.day}</span></aside>`
        }else {
            timeline.innerHTML += `<aside ><span>${getDay(element.dayOfWeek)} </span> <span>${element.day}</span></aside>`
        }
    });



}




function getDay(dayOfWeek){
    let days = ["Söndag","Måndag", "Tisdag", "Onsdag","Torsdag","Fredag","Lördag"]; 
    return days[dayOfWeek]; 
}

async function timelineEvents(data,selectedTime){
    let timeSteps = document.querySelectorAll("#timeline > aside"); 
    timeSteps && timeSteps.forEach(stepEl => {
        stepEl.addEventListener("click", (e)=> {
            e.preventDefault();
            console.log(stepEl);
        })
    });
}

