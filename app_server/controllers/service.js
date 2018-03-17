const mongoose = require('mongoose');
const images = require('../middleware/images');

const Service = mongoose.model('Service');

/**
 * Renders the service page.
 * @param  {Object} req Express request object.
 * @param  {Object} res Express response object.
 */
module.exports.service = (req, res) => {
  res.render('service');
};

/**
 * Adds a new service (mongo document) to the database.
 * Redirects to the service provider's page.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
module.exports.addService = (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'You must be logged in to create a new service provider.' });
    return;
  }

  const service = new Service();

  service.name = req.body.name;
  service.phoneNumber = req.body.number;
  service.serviceType = req.body.serviceType;
  service.stayLength = req.body.stayLength;
  service.available = req.body.available;
  service.website = req.body.website;
  service.uri = req.body.uri;
  service.description = req.body.description;
  service.address = {
    suburb: req.body.suburb,
    postcode: req.body.postcode,
    state: req.body.state,
    coordinates: {
      coordinates: [req.body.long, req.body.lat],
    },
  };
  service.ageRange = {
    minAge: req.body.minAge,
    maxAge: req.body.maxAge,
  };

  service.save((err) => {
    if (err) {
      res.status(500).json({ message: err });
    } else {
      res.redirect('/location/'.concat(req.body.uri));
    }
  });
};

function countAvailableBeds(beds) {
  let count = 0;
  for (let i = 0; i < beds.length; i += 1) {
    if (!beds[i].isOccupied) count += 1;
  }
  return count;
}

/**
 * Renders a service provider's dashboard.
 * @param  {Object} req Express request object.
 * @param  {Object} res Express response object.
 */
module.exports.dashboard = (req, res) => {
  // console.log("hey");
  // if (!req.user || req.user.role !== 'service_provider') {
  //   res.status(401).json({ message: 'You are not authorised to view this page. Please log in with your service provider account.' });
  //   return;
  // }
  //
  // Service.findById(
  //   req.user.service[0],
  //   'name address.suburb beds tags openRequests'
  // ).exec()
  //   .then((service) => {
  //     res.render('serviceDashboard', {
  //       service: service,
  //       numAvailableBeds: countAvailableBeds(service.beds),
  //
  //     });
  //   })
  //   .catch((err) => { res.status(401).json({ message: err }); });

  res.render('serviceDashboard', {
    service: {
      name: 'Youngle Group',
      address: {
        suburb: 'Cannington',
      }
    },
    numAvailableBeds: 10
  });
};

/**
 *  Adds a new image to Firebase, storing a reference to it in the database.
 *  @param  {Object} req Express request object.
 *  @param  {Object} res Express response object.
 */
module.exports.uploadImage = (req, res) => {
  if (req.file && req.file.storageObject) {
    // Get the corresponding Service from the serviceUri and push the image
    // reference to the list of images
    Service.findOneAndUpdate(
      { uri: req.params.serviceUri },
      { $push: { img: req.file.storageObject } },
      { runValidators: true },
    ).exec()
      .then(() => {
        // Get the mediaLink for the image from Firebase
        images.getImageForService(req.file.storageObject).then((image) => {
          // Return the image
          res.json({ error: false, mediaLink: image });
        }).catch(() => {
          // Couldn't get the mediaLink for the image - return error
          res.json({
            error: true,
            errorTitle: 'Error!',
            errorDescription: 'Image could not be uploaded',
          });
        });
      });
  } else if (!req.file) {
    // If the user didn't upload a file, send an error
    res.json({
      error: true,
      errorTitle: 'File type not supported!',
      errorDescription: 'Please upload a valid image file.',
    });
  } else {
    // If there was some other error upload the image to Firebase, send an error
    res.json({
      error: true,
      errorTitle: 'Upload error!',
      errorDescription: 'Unable to upload file to HomeForNow',
    });
  }
};

/**
 *  Adds a new logo to Firebase, storing a reference to it in the database.
 *  @param  {Object} req Express request object.
 *  @param  {Object} res Express response object.
 */
module.exports.uploadLogo = (req, res) => {
  if (req.file && req.file.storageObject) {
    // Get the corresponding Service from the serviceUri and update the logo reference
    Service.findOneAndUpdate(
      { uri: req.params.serviceUri },
      { $set: { logo: req.file.storageObject } },
      { runValidators: true },
    ).exec()
      .then(() => {
        // Get the mediaLink for the logo from Firebase
        images.getImageForService(req.file.storageObject).then((image) => {
          // Return the image
          res.json({ error: false, mediaLink: image });
        }).catch(() => {
          // Couldn't get the mediaLink for the logo - return error
          res.json({
            error: true,
            errorTitle: 'Error!',
            errorDescription: 'Image could not be uploaded',
          });
        });
      });
  } else if (!req.file) {
    // If the user didn't upload a file, send an error
    res.json({
      error: true,
      errorTitle: 'File type not supported!',
      errorDescription: 'Please upload a valid image file.',
    });
  } else {
    // If there was some other error upload the logo to Firebase, send an error
    res.json({
      error: true,
      errorTitle: 'Upload error!',
      errorDescription: 'Unable to upload file to HomeForNow',
    });
  }
};

/**
 * Used by deleteImageModal to delete an image stored in Firebase from a service
 * provider's profile.
 * @param  {Object} req Express request object.
 * @param  {Object} res Express response object.
 */
module.exports.deleteImage = (req, res) => {
  // Get the Service corresponding to the serviceUri
  Service.findOne({ uri: req.params.serviceUri }, 'name img').exec().then((service) => {
    // Delete the image specified by req.params.index from the Service
    images.deleteImageFromService(service, req.params.serviceUri, req.params.index).then(() => {
      // Return successfully
      res.json({ error: false });
    }).catch((err) => {
      // Failed to delete the image from Firebase and/or MongoDB - return error
      res.status(500).json({ error: true, message: err });
    });
  }).catch((err) => {
    // Failed to obtain the Service from MongoDB - return error
    res.status(500).json({ error: true, message: err });
  });
};

module.exports.deleteLogo = (req, res) => {
  // Get the Service corresponding to the serviceUri
  Service.findOne({ uri: req.params.serviceUri }, 'name logo').exec().then((service) => {
    // Delete the logo from the Service
    images.deleteLogoFromService(service.logo, req.params.serviceUri).then(() => {
      // Return successfully
      res.json({ error: false });
    }).catch((err) => {
      // Failed to delete the logo from Firebase and/or MongoDB - return error
      res.status(500).json({ error: true, message: err });
    });
  }).catch((err) => {
    // Failed to obtain the Service from MongoDB - return error
    res.status(500).json({ error: true, message: err });
  });
};

/**
 * Renders a service provider's profile page.
 * This is a test page used to test the image uploading page, and will unlikely
 * be used in production
 * @param  {Object} req Express request object.
 * @param  {Object} res Express response object.
 */
module.exports.profile = (req, res) => {
  Service.findOne({ uri: req.params.serviceUri }, 'name img logo').exec().then((service) => {
    Promise.all([
      images.getImagesForService(service, req.params.serviceUri),
      images.getImageForService(service.logo, req.params.serviceUri),
    ]).then(([imgs, logo]) => {
      const params = imgs;
      params.logo = logo;
      res.render('editImages', params);
    }).catch((err) => {
      res.status(500).json({ message: err });
    });
  }).catch((err) => {
    res.status(500).json({ message: err });
  });
};
