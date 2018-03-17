const express = require('express');
const images = require('../middleware/images');

const router = express.Router();

const serviceController = require('../controllers/service');

// Services Dashboard route
router.get('/', serviceController.dashboard);


// Services Profile Page route
router.get('/profile/:serviceUri', serviceController.profile);

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
