const express = require('express');
const passport = require('passport');
const ctrlIndex = require('../controllers/index');
const ctrlOthers = require('../controllers/others');
const ctrlLocations = require('../controllers/locations');
const ctrlService = require('../controllers/service');
const ctrlAuth = require('../controllers/authentication');
const ctrlRequests = require('../controllers/requests');
const ctrlComm = require('../controllers/communications');
const ctrlAdmin = require('../controllers/admin');


const router = express.Router();

router.get('/', ctrlIndex.index);

router.get('/login', ctrlAuth.getLogin);

router.get('/about', ctrlOthers.about);
router.get('/contact', ctrlOthers.contact);
router.get('/terms_of_use', ctrlOthers.terms_of_use);


router.get('/location/:serviceUri', ctrlLocations.showLocation);

router.post('/locations/:lengthOfStay', ctrlLocations.showLocations);

router.post('/request/update', ctrlRequests.addPhoneToRequest);
router.post('/locations/contact/:lengthOfStay', ctrlRequests.addRequest);
/**
 * Authentication
 */
router.post('/login', ctrlAuth.login);

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
 * admin API
 */

router.get('/admin', ctrlAdmin.admin);
router.get('/admin/addservice', ctrlAdmin.addService);
router.get('/admin/wipe_requests', ctrlAdmin.wipeRequests);
router.post('/addservice', ctrlService.addService);
router.post('/service/update/:serviceName', ctrlService.updateService);


module.exports = router;
