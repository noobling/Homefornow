var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');

/** Make the home page render a list of bed vaccancies for now  */
router.get('/', ctrlLocations.bedVacanciesList);
router.get('/location', ctrlLocations.showLocation);
module.exports = router;
