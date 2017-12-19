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

router.get('/location', ctrlLocations.showLocation);

router.get('/locations/short_term', ctrlLocations.shortTermList);
router.get('/locations/long_term', ctrlLocations.longTermList);

/**
 * Authentication
 */
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/peanut'
}));
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
router.get('/logout', function(req, res) {
    req.session.user = undefined;
    res.redirect('/');
});
/**
 * services API
 */
router.get('/service', ctrlService.service);
router.post('/addService', ctrlService.addService)
module.exports = router;
