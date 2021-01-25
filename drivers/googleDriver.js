/*
const {google} = require('googleapis');

const {OAuth2} = google.auth;

const oAuth2Client = new OAuth2('286187659171-8lsogbilkvskbk0aojikls0ml28r7n2e.apps.googleusercontent.com', 'ValmFXd__39RdlBcIGQPPrJd');

const {listEvents} = require('./listEvents');
const {calendarIds, getCalendarId} = require('./calendars');
const getWeeklyTutorAvailability = require('./getTutorAvailability').default;


oAuth2Client.setCredentials({
    refresh_token: '1//04GH7dnAYumD5CgYIARAAGAQSNwF-L9Irf239SgxhBrkflGAfsFMpkD1k2_-bYhDfVFJlP0-5ofRUDCmlQF_ZIokJi9jbtM0RmrU'
});

const googleCalendar = google.calendar({version: 'v3', auth: oAuth2Client});


function getEvents (regex){
    getCalendarId(regex)
    .then(id => {
        listEvents(id, "");
    })
    .catch(err => console.log(err));
}

const getCalendarId = async function (calMatch, calendar) {
    let calendarList = null;
    if(!calendarList){
        calendar.calendarList.list({}, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);
            //console.log(res.data);
            calendarList = res.data.items;
        });
       await waitUntil(() => {return calendarList}, 3000);
    }
    //console.log(calendarList);

    for(let i=0; i<calendarList.length; i++){
        let cal = calendarList[i];
        //console.log(cal.summary, cal.id);
        if(cal.summary.match(calMatch)){
            return Promise.resolve(cal.id);
        }
    }

    return Promise.reject("No matching calendar");
};

*/