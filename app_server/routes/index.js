var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');

/** Make the home page render a list of bed vaccancies for now  */
router.get('/', ctrlLocations.bedVacanciesList);

module.exports = router;
