
const {google} = require('googleapis');

const {OAuth2} = google.auth;

const oAuth2Client = new OAuth2('286187659171-8lsogbilkvskbk0aojikls0ml28r7n2e.apps.googleusercontent.com', 'ValmFXd__39RdlBcIGQPPrJd');


const waitUntil = require('../util/waitUntil');


oAuth2Client.setCredentials({
    refresh_token: '1//04GH7dnAYumD5CgYIARAAGAQSNwF-L9Irf239SgxhBrkflGAfsFMpkD1k2_-bYhDfVFJlP0-5ofRUDCmlQF_ZIokJi9jbtM0RmrU'
});

const googleCalendar = google.calendar({version: 'v3', auth: oAuth2Client});

let googleDriver = {};


function getEvents (regex, start){
    return getCalendarId(regex)
    .then(id => {
        return listEvents(id, start, "");
    });
}

const getCalendarId = async function (calMatch) {
    let calendarList = null;
    googleCalendar.calendarList.list({}, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        calendarList = res.data.items;
    });
    await waitUntil(() => {return calendarList}, 3000);
    for(let i=0; i<calendarList.length; i++){
        let cal = calendarList[i];
        //console.log(cal.summary, cal.id);
        if(cal.summary.match(calMatch)){
            return Promise.resolve(cal.id);
        }
    }

    return Promise.reject("No matching calendar");
};

//warning you can only call this once
const listEvents = async function (calendarId, start, query) {
    let eventsList = null;
    googleCalendar.events.list({
        calendarId: calendarId,
        timeMin: start,
        maxResults: 20,
        singleEvents: true,
        orderBy: 'startTime',
        q: query,
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        eventsList = res.data.items;
    });
    await waitUntil(() => {return eventsList}, 10000);
    return Promise.resolve(eventsList);
}

googleDriver.getEvents = getEvents;


module.exports = googleDriver;