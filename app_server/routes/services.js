const express = require('express');
const images = require('../middleware/images');
const mongoose = require('mongoose');

const router = express.Router();
const Service = mongoose.model('Service');

const serviceController = require('../controllers/service');

// Services Dashboard route
router.get('/', serviceController.dashboard);

// Services Profile Page route
router.get('/profile/:serviceUri', serviceController.profile);

// Upload new image to service
router.post(
  '/profile/:serviceUri/add',
  images.multer.single('image'),
  images.sendUploadToFirebase,
  (req, res, next) => {
    if (req.file && req.file.storageObject) {
      // Get the corresponding Service from the serviceUri
      console.log('Service URI: '.concat(req.params.serviceUri));
      Service.findOne(
        { uri: req.params.serviceUri },
        'img',
      ).exec()
        .then((service) => {
          console.log(service.img);
        });
    }
    res.send("Error - not a file");
  },
);

module.exports = router;
