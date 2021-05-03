var express = require('express');
var router = express.Router();

var calendar_controller = require('../controllers/calendarController');

/* GET home page. */

router.get('/', calendar_controller.get_tutor_availability);

router.get('/showAvailability', calendar_controller.show_availability);

router.get('/', calendar_controller.get_tutor_availability);


module.exports = router;
  