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
  images.multer.single('fileAdd'),
  images.sendUploadToFirebase,
  (req, res, next) => {
    console.log('req.file.storageObject = ', req.file.storageObject);
    if (req.file && req.file.storageObject) {
      // Get the corresponding Service from the serviceUri
      console.log('Service URI: '.concat(req.params.serviceUri));
      Service.findOneAndUpdate(
        { uri: req.params.serviceUri },
        { $push: { img: req.file.storageObject } },
        { runValidators: true }
      ).exec()
        .then((service) => {
          console.log(service.img);
          res.redirect('back');
        });
    } else {
      res.send('Error - not a file OR could not find req.file.storageObject');
    }
  },
);

router.post('/profile/:serviceUri/:index/delete', serviceController.deleteImage);

module.exports = router;
