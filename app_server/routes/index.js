var express = require('express');
var passport = require('passport');
var router = express.Router();
var ctrlIndex = require('../controllers/index');
var ctrlOthers = require('../controllers/others');
var ctrlLocations = require('../controllers/locations');
var ctrlService = require('../controllers/service');
var ctrlAuth = require('../controllers/authentication');

router.get('/', ctrlIndex.index);

router.get('/about', ctrlOthers.about);

router.get('/locations', ctrlLocations.showLocation);

router.get('/locations/short_term', ctrlLocations.shortTermList);
router.get('/locations/long_term', ctrlLocations.longTermList);

router.get('/service', ctrlService.service);

/**
 * Authentication
 */
router.post('/login', ctrlAuth.login);
//router.post('/register', ctrlAuth.register);
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

module.exports = router;
