const mongoose = require('mongoose');
const admin = require('firebase-admin');

const Service = mongoose.model('Service');
const Request = mongoose.model('Request');

/**
 * Renders the bed vacancies page with short term (crisis and
 * transitional) or long term service providers. The available service
 * providers are listed first. Available and unavailable service providers are
 * ordered nearest to fartherest from a location specified in the req object.
 *
 * Requires a 2dsphere index on address.coordinates.coordinates for $near to work.
 * db.service.createIndex( { 'address.coordinates.coordinates' : '2dsphere' } )
 * https://docs.mongodb.com/manual/core/2dsphere/
 * @param  {Object} req Express request object.
 * @param  {Object} res Express response object.
 */
module.exports.showLocations = (req, res) => {
  Request.findById(req.session.requestId, 'hasChild hasDisability gender').exec()
    .then((request) => {
      const longTerm = (req.params.lengthOfStay === 'long_term');
      const type = (longTerm ? ['long'] : ['crisis', 'transitional']);
      const child = (request.hasChild ? [true] : [true, false]);
      const disability = (request.hasDisability ? [true] : [true, false]);

      let gender = ['Either']; // Other
      if (gender === 'Male') {
        gender = ['Male', 'Either'];
      } else if (gender === 'Female') {
        gender = ['Female', 'Either'];
      }

      return Service.find(
        {
          $and: [
            { serviceType: { $in: type } },
            { child: { $in: child } },
            { disability: { $in: disability } },
            { gender: { $in: gender } },
            {
              'address.coordinates.coordinates': {
                $near: {
                  $geometry: { type: 'Point', coordinates: req.session.coordinates },
                },
              },
            },
          ],
        },
        'name available number phoneNumber description address uri',
      );
    })
    .then((services) => {
      // Sort services into available and unavailable
      const available = [];
      const unavailable = [];
      for (let i = 0; i < services.length; i += 1) {
        if (services[i].available) {
          available.push(services[i]);
        } else {
          unavailable.push(services[i]);
        }
      }

      res.render('bedVacanciesList', {
        title: 'For Now',
        tagline: 'A place to stay',
        locations: available,
        dlocations: unavailable,
        userCoords: {
          long: req.session.coordinates[0],
          lat: req.session.coordinates[1],
        },
      });
    })
    .catch((err) => {
      console.log('[ERROR] LocationsController: '.concat(err));
      res.status(500).json({ message: err });
    });
};

/**
 * Renders the showLocation page with data from a service provider specified
 * in req.params. Pulls images from a Firebase storage bucket.
 * @param  {Object} req Express request object.
 * @param  {Object} res Express response object.
 */
module.exports.showLocation = (req, res) => {
  let metadataCount = 0;
  let listCount = 0;
  console.log('Service URI: '.concat(req.params.serviceUri));
  Service.findOne(
    { uri: req.params.serviceUri },
    'name tagline address facilities restrictions additionalInfo website img hours',
  ).exec()
    .then((service) => {
      // console.log('Images: '.concat(service.img));
      const imageList = [];

      if (service.img != null && service.img.length > 0) {
        listCount = service.img.length;
        const bucket = admin.storage().bucket();

        service.img.forEach((image) => {
          // Get the metadata for each image reference
          bucket.file(image).getMetadata().then((data) => {
            // Add the media link for the image to 'imageList'
            imageList[imageList.length] = data[0].mediaLink;
            metadataCount += 1;

            // If all the images have been added to imageList, render the page with these images
            if (metadataCount === listCount) {
              res.render('showLocation', {
                location: service,
                map: {
                  title: service.name,
                  suburb: service.address.suburb,
                },
                images: imageList,
              });
            }
          }).catch((err) => {
            console.log('[ERROR] LocationsController: '.concat(err));

            // If image metadata cannot be obtained, then load the page without the images panel
            listCount -= 1;
            if (metadataCount === listCount) {
              res.render('showLocation', {
                location: service,
                map: {
                  title: service.name,
                  suburb: service.address.suburb,
                },
              });
            }
          });
        });
      } else {
        // If 'img' is not defined or is empty, render the page without the carousel
        res.render('showLocation', {
          location: service,
          map: {
            title: service.name,
            suburb: service.address.suburb,
          },
        });
      }
    })
    .catch((err) => {
      console.log('[ERROR] LocationsController: '.concat(err));
      res.status(500).json({ message: err });
    });
};
