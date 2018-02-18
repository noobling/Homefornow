const express = require('express');
const images = require('../middleware/images');
const mongoose = require('mongoose');

const router = express.Router();
const Service = mongoose.model('Service');

const serviceController = require('../controllers/service');

// Services Dashboard route
router.get('/', serviceController.dashboard);

// Dont run this file when in test environment because we don't have the firebase json file
if (! (process.env.NODE_ENV == 'test')) {
  // Services Profile Page route
  router.get('/profile/:serviceUri', serviceController.profile);

  // Upload new image to service
  router.post(
    '/profile/:serviceUri/add',
    images.multer.single('fileAdd'),
    images.sendUploadToFirebase,
    (req, res, next) => {
      if (req.file && req.file.storageObject) {
        // Get the corresponding Service from the serviceUri
        console.log('Service URI = '.concat(req.params.serviceUri));
        Service.findOneAndUpdate(
          { uri: req.params.serviceUri },
          { $push: { img: req.file.storageObject } },
          { runValidators: true }
        ).exec()
          .then((service) => {
            res.redirect('back');
          });
      } else {
        // File did not upload - TODO rerender page with error message (AJAX)
        res.redirect('back');
      }
    }
  );
}
router.post('/profile/:serviceUri/:index/delete', serviceController.deleteImage);

module.exports = router;
