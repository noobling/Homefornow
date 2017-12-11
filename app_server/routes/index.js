var express = require('express');
var passport = require('passport');
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
// route for facebook authentication and login
router.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
router.get('/auth/facebook/callback', 
    passport.authenticate('facebook'), 
    function(req, res) {
        if (req.user) {
            req.session.user = req.user;
        }
        res.redirect('/location');
    }
);

// Export router module
module.exports = router;
