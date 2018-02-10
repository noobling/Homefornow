const mongoose = require('mongoose');
const admin = require('firebase-admin');

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
 * Renders a service provider's profile page
 * @param  {Object} req Express request object.
 * @param  {Object} res Express response object.
 */
module.exports.profile = (req, res) => {
  let metadataCount = 0;
  let listCount = 0;
  console.log('Service URI: '.concat(req.params.serviceUri));
  Service.findOne(
    { uri: req.params.serviceUri },
    'name img',
  ).exec()
    .then((service) => {
      // console.log('Images: '.concat(service.img));
      const imageDict = [];

      if (service.img != null && service.img.length > 0) {
        listCount = service.img.length;
        const bucket = admin.storage().bucket();
        // console.log(service.img);

        service.img.forEach((image) => {
          // Get the metadata for each image reference
          bucket.file(image).getMetadata().then((data) => {
            // Add the media link for the image to 'imageList'
            imageDict[service.img.indexOf(image)] = data[0].mediaLink;
            metadataCount += 1;

            // If all the images have been added to imageList, render the page with these images
            if (metadataCount === listCount) {
              console.log('LENGTH = ', Object.keys(imageDict).length);
              res.render('editImages', {
                name: service.name,
                uri: req.params.serviceUri,
                images: imageDict,
              });
            }
          }).catch((err) => {
            console.log('[ERROR] LocationsController: '.concat(err));

            // If image metadata cannot be obtained, then load the page without the images panel
            listCount -= 1;
            if (metadataCount === listCount) {
              res.render('editImages', {
                name: service.name,
                uri: req.params.serviceUri,
              });
            }
          });
        });
      } else {
        res.render('editImages', {
          name: service.name,
          uri: req.params.serviceUri,
        });
      }
    })
    .catch((err) => {
      console.log('[ERROR] LocationsController: '.concat(err));
      res.status(500).json({ message: err });
    });
};
