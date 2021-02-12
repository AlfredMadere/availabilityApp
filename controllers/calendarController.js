
const { body,validationResult } = require('express-validator');
const googleDriver = require('../drivers/googleDriver');
const AvailabilityCalendar = require('../models/availabilityCalendar');

//import availabilityCalendar from "../models/availabilityCalendar";


/// Display list of all Books.
exports.get_tutor_availability = function(req, res, next) {
    //res.send('NOT IMPLEMENTED: get tutor availability');
    res.render('availability_form', {title: 'Availability query'});
};

exports.show_availability = function(req, res, next){
    let tutorName = req.query.name;
    let calendarType = req.query.caltype;
    let startDate = new Date(req.query.startDate);
    console.log(startDate);
    let regexString = `${tutorName}.*${calendarType}`;
    let regex = new RegExp(regexString, 'i');
    console.log(regex);
    googleDriver.getEvents(regex)
    .then((events) => {
        let availabilityCalendar = new AvailabilityCalendar(events, 15, startDate);
        res.render('availability_details', {title: 'Availability details', tutorName: tutorName, calendarType: calendarType === "((?!committal).)*$" ? "current" : calendarType, availability: availabilityCalendar.htmlReadyAvailability});

    })
    .catch((err) => {
        res.render('availability_query_error', {title: 'Availability Query Error', tutorName: tutorName, calendarType: calendarType === "`((?!committal).)*$`" ? "current" : calendarType, error: err});
    });
    //create regex
    /*
    let events = googleDriver.getEvents
    .then()
    need to set up oath and calendar object before I do this next line
    let calendarId = await Calendar.getId(regex, calendar);
    let availability = await Calendar.getAvailability(calendarid);
    let printableContent = Calendar.printAvailability(printableContent);
    then send the printable content over to the view to be rendered
    .then
    */
   
};

