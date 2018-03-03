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
  (req, res) => {
    // console.log(req);
    if (req.file && req.file.storageObject) {
      // Get the corresponding Service from the serviceUri
      console.log('req.file.storageObject = ' + req.file.storageObject);
      Service.findOneAndUpdate(
        { uri: req.params.serviceUri },
        { $push: { img: req.file.storageObject } },
        { runValidators: true },
      ).exec()
        .then(() => {
          images.getImageForService(req.file.storageObject).then((image) => {
            res.json({ error: false, mediaLink: image });
          });
        });
    } else if (!req.file) {
      res.send('Not req.file');
    } else {
      res.send('Not req.file.storageObject');
    }
  },
);

router.post(
  '/profile/:serviceUri/logo/add',
  images.multer.single('logoAdd'),
  images.sendUploadToFirebase,
  (req, res) => {
    if (req.file && req.file.storageObject) {
      // Get the corresponding Service from the serviceUri
      Service.findOneAndUpdate(
        { uri: req.params.serviceUri },
        { $set: { logo: req.file.storageObject } },
        { runValidators: true },
      ).exec()
        .then(() => {
          res.redirect('back');
        });
    } else {
      // File did not upload - TODO rerender page with error message (AJAX)
      res.redirect('back');
    }
  },
);

router.post('/profile/:serviceUri/logo/delete', serviceController.deleteLogo);

router.post('/profile/:serviceUri/:index/delete', serviceController.deleteImage);

module.exports = router;
