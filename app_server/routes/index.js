var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');
var ctrlAuth = require('../controllers/authentication');

/** Make the home page render a list of bed vaccancies for now  */
router.get('/', ctrlLocations.bedVacanciesList);
router.get('/location', ctrlLocations.showLocation);

/**
 * Authentication 
 */
router.post('/login', ctrlAuth.login);
router.post('/register', ctrlAuth.register);
module.exports = router;
