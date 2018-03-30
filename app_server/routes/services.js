const express = require('express');
const images = require('../middleware/images');

const router = express.Router();

const serviceController = require('../controllers/service');

// Services Dashboard route
router.get('/dashboard/:serviceUri', serviceController.dashboard);

router.get('/dashboard/:serviceUri/beds', serviceController.dashboardBeds);
router.get('/dashboard/:serviceUri/requests', serviceController.dashboardRequests);

router.get('/dashboard/:serviceUri/profile', serviceController.dashboardProfile);
router.get('/dashboard/:serviceUri/images', serviceController.dashboardImages);
router.get('/dashboard/:serviceUri/available', serviceController.dashboardAvailable);


// Services Profile Page route
router.get('/profile/:serviceUri', serviceController.profile);

router.get('/beds', serviceController.getBeds);

router.post('/beds/update/:serviceUri', serviceController.updateBeds);

// Upload new image to service
router.post(
  '/profile/:serviceUri/add',
  images.multer.single('fileAdd'),
  images.sendUploadToFirebase,
  serviceController.uploadImage,
);

router.post(
  '/profile/:serviceUri/logo/add',
  images.multer.single('logoAdd'),
  images.sendUploadToFirebase,
  serviceController.uploadLogo,
);

router.post('/profile/:serviceUri/logo/delete', serviceController.deleteLogo);

router.post('/profile/:serviceUri/:index/delete', serviceController.deleteImage);

module.exports = router;
