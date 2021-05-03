const {DateTime} = require('luxon');

class AvailabilityCalendar {
    constructor(events, accuracy, startDate, tz){
        this.allEvents = events;
        this.startTime = startDate;
        this.startTime.setHours(24,0,0,0);
        this.endTime = new Date(this.startTime.getTime());
        this.endTime.setDate(this.startTime.getDate() + 7);
        this.millisPerChar = 1000*60*accuracy;
        this.arrayLength = Math.floor((this.endTime - this.startTime)/this.millisPerChar) + 1;
        this.virtualSchedule = new Array(this.arrayLength).fill(" ");
        this.generateVirtualSchedule();
        this.groupedAvailability = []
        this.groupAvailabilityObjects();
        this.stringifiedAvailability = "";
        this.stringifyGroupedAvailability();
        this.htmlReadyAvailability = [];
        this.generateHtmlReadyAvailability(tz);
    }
    
    stringifyGroupedAvailability(){
        let outPut = "";
        this.groupedAvailability.forEach((day) => {
            let timeSlots = day.events.map((event) => {
                return `${event.start.toLocaleString(DateTime.TIME_SIMPLE)} - ${event.end.toLocaleString(DateTime.TIME_SIMPLE)}`;
            }).join(", ");
            outPut = `${outPut}
            ${day.dow}: ${timeSlots}`;
        });
        this.stringifiedAvailability = outPut;
    }
    generateVirtualSchedule(){
        //should be in order of start date
        let availabilityEvents = this.allEvents.filter((event) => {
            return !/tutoring/i.test(event.summary);
        });
        //should be in order of start date
        let tutoringEvents = this.allEvents.filter((event) => {
            return /tutoring/i.test(event.summary);
        });
        availabilityEvents.forEach((event) => {
            //console.log("start time", this.startTime.toLocaleString(DateTime.DATETIME_FULL));
            //console.log("event start time", event.start.dateTime.toLocalString(DateTime.DATETIME_FULL))
            let startIndex = ((Date.parse(event.start.dateTime) - this.startTime.getTime())/this.millisPerChar) < 0 ? 0 : Math.floor((Date.parse(event.start.dateTime) - this.startTime.getTime())/this.millisPerChar);
            let endIndex = (Date.parse(event.end.dateTime) - this.startTime.getTime())/this.millisPerChar;

            for(let i = startIndex; i < endIndex; i++){
                if(i>=this.virtualSchedule.length){
                    break;
                }
                this.virtualSchedule[i] = 'A';
            }
        });
        tutoringEvents.forEach((event) => {
            let startIndex = ((Date.parse(event.start.dateTime) - this.startTime.getTime())/this.millisPerChar) < 0 ? 0 : Math.floor((Date.parse(event.start.dateTime) - this.startTime.getTime())/this.millisPerChar);
            //console.log(`start of busy: ${startIndex}`);
            let endIndex = (Date.parse(event.end.dateTime) - this.startTime.getTime())/this.millisPerChar;
    

            for(let i = startIndex; i < endIndex ; i++){
                if(i>=this.virtualSchedule.length){
                    break;
                }
                //console.log('adding space at ', i);
                this.virtualSchedule[i] = ' ';
            }
        });
    }
    groupAvailabilityObjects(){
        let index = 0;
        let availabilityObjects = [];
        while(index<this.virtualSchedule.length){
            index = this.virtualSchedule.indexOf('A', index);
            if(index < 0){ break };
            let startAvailabilityPosition = index;
            let startAvailabilityTime = startAvailabilityPosition * this.millisPerChar;
            let endAvailabilityPosition = this.virtualSchedule.indexOf(' ', startAvailabilityPosition);
            if(endAvailabilityPosition < 0){endAvailabilityPosition = this.virtualSchedule.length};
            let endAvailabilityTime = endAvailabilityPosition * this.millisPerChar;
    
            availabilityObjects.push({dow: DateTime.fromMillis(startAvailabilityTime + this.startTime.getTime()).weekdayLong, start: DateTime.fromMillis(startAvailabilityTime + this.startTime.getTime()), end: DateTime.fromMillis(endAvailabilityTime + this.startTime.getTime())}); 
    
            index = endAvailabilityPosition;
          
        }
        let days = [];
        let currentDay = null;
        availabilityObjects.forEach((event) => {
            if(!currentDay||(event.dow != currentDay.dow)){
                currentDay = {dow: event.dow, events: []};
                days.push(currentDay);
            }
            currentDay.events.push(event);
        });
        this.groupedAvailability = days;
        console.log("grouped availability", this.groupedAvailability)
    }
    generateHtmlReadyAvailability(tz){
        this.groupedAvailability.forEach((day) => {
            let timeSlots = day.events.map((event) => {
                console.log("timezone", tz);
                let eventStart = event.start.setZone(tz);
                let eventEnd = event.end.setZone(tz);
                return `${eventStart.toLocaleString(DateTime.TIME_SIMPLE)} - ${eventEnd.toLocaleString(DateTime.TIME_SIMPLE)}`;
            }).join(", ");
            this.htmlReadyAvailability.push(`${day.dow}(${day.events[0].start.toLocaleString({month: 'short', day: 'numeric'})}): ${timeSlots}`);
        });
    }
   
}



module.exports = AvailabilityCalendar;