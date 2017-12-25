const express = require('express');
const passport = require('passport');
const ctrlIndex = require('../controllers/index');
const ctrlOthers = require('../controllers/others');
const ctrlLocations = require('../controllers/locations');
const ctrlService = require('../controllers/service');
const ctrlAuth = require('../controllers/authentication');

const router = express.Router();

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
  failureRedirect: '/',
  failureFlash: true,
}));
router.post('/register', ctrlAuth.register);
// route for facebook authentication and login
router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook'),
  (req, res) => {
    if (req.user) {
      req.session.user = req.user;
    }
    res.redirect('/location');
  }
);
router.get('/logout', (req, res) => {
  req.session.user = undefined;
  res.redirect('/');
});

/**
 * services API
 */
router.get('/service', ctrlService.service);
router.post('/addService', ctrlService.addService);
module.exports = router;
