const express = require('express');
const passport = require('passport');
const ctrlIndex = require('../controllers/index');
const ctrlOthers = require('../controllers/others');
const ctrlLocations = require('../controllers/locations');
const ctrlService = require('../controllers/service');
const ctrlAuth = require('../controllers/authentication');
const ctrlRequests = require('../controllers/requests');
const ctrlComm = require('../controllers/communications');


const router = express.Router();

router.get('/', ctrlIndex.index);

router.get('/about', ctrlOthers.about);

router.get('/location/:serviceUri', ctrlLocations.showLocation);

router.get('/locations/:lengthOfStay', ctrlLocations.shortTermList);
router.post('/locations/contact', ctrlRequests.addPhoneToRequest);
router.post('/locations/:lengthOfStay', ctrlRequests.addRequest);
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

// Not sure about the logic here so I will comment this out for now
// Since we are not using OAuth2 for now
// router.get(
//   '/auth/facebook/callback',
//   passport.authenticate('facebook'),
//   (req, res) => {
//     if (req.user) {
//       req.session.user = req.user;
//     }
//     res.redirect('/location');
//   }
// );

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

/**
 * email API
 */
router.post('/email', ctrlComm.email);

/**
 * SMS API
 */
router.post('/sms', ctrlComm.sms);

/**
 * services API
 */
router.get('/service', ctrlService.service);
router.post('/addService', ctrlService.addService);
module.exports = router;

router.get('/admin', (req, res) => { res.render('admin'); });
router.get('/serviceDashboard', (req, res) => { res.render('serviceDashboard'); });
