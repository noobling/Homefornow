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

/**
 * Renders a service provider's dashboard.
 * @param  {Object} req Express request object.
 * @param  {Object} res Express response object.
 */
module.exports.dashboard = (req, res) => {
  res.render('serviceDashboard');
};

/**
 *  Adds a new image to Firebase, storing a reference to it in the database.
 *  @param  {Object} req Express request object.
 *  @param  {Object} res Express response object.
 */
module.exports.uploadImage = (req, res) => {
  // console.log(req);
  if (req.file && req.file.storageObject) {
    // Get the corresponding Service from the serviceUri
    console.log(`req.file.storageObject = ${req.file.storageObject}`);
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
    // res.send('Not req.file');
    res.json({
      error: true,
      errorTitle: 'File type not supported!',
      errorDescription: 'Please upload a valid image file.',
    });
  } else {
    // res.send('Not req.file.storageObject');
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
    // Get the corresponding Service from the serviceUri
    Service.findOneAndUpdate(
      { uri: req.params.serviceUri },
      { $set: { logo: req.file.storageObject } },
      { runValidators: true },
    ).exec()
      .then(() => {
        images.getImageForService(req.file.storageObject).then((image) => {
          res.json({ error: false, mediaLink: image });
        });
      });
  } else if (!req.file) {
    // res.send('Not req.file');
    res.json({
      error: true,
      errorTitle: 'File type not supported!',
      errorDescription: 'Please upload a valid image file.',
    });
  } else {
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
  console.log(`Index = ${req.params.index}`);
  Service.findOne({ uri: req.params.serviceUri }, 'name img').exec().then((service) => {
    images.deleteImageFromService(service, req.params.serviceUri, req.params.index).then(() => {
      res.json({ error: false });
    }).catch((err) => {
      res.status(500).json({ error: true, message: err });
    });
  }).catch((err) => {
    console.log('[ERROR]: Could not find image in mongoDB: '.concat(err));
    res.status(500).json({ error: true, message: err });
  });
};

module.exports.deleteLogo = (req, res) => {
  Service.findOne({ uri: req.params.serviceUri }, 'name logo').exec().then((service) => {
    images.deleteLogoFromService(service.logo, req.params.serviceUri).then(() => {
      res.redirect('back');
    }).catch((err) => {
      res.status(500).json({ error: true, message: err });
    });
  }).catch((err) => {
    console.log('[ERROR]: Could not find image in mongoDB: '.concat(err));
    res.status(500).json({ error: true, message: err });
  });
};

/**
 * Renders a service provider's profile page
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
