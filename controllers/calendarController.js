
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
    let regex = `/${tutorName}.*${calendarType}/i`;
    console.log(regex);
    googleDriver.getEvents(/Maya.*committal/i)
    .then((events) => {
        let availabilityCalendar = new AvailabilityCalendar(events, 15);
        let availability = availabilityCalendar.getGroupedAvailability();
        res.render('availability_details', {title: 'Availability details', tutorName: tutorName, calendarType: calendarType, availability: availabilityCalendar.stringifiedAvailability});

    })
    .catch(err => console.log(err));
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

