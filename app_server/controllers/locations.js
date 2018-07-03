const mongoose = require('mongoose');
// const admin = require('firebase-admin');
const images = require('../middleware/images');
const logo = require('../middleware/images');
const timeago = require('timeago.js');

const Service = mongoose.model('Service');

/**
 * Renders the bed vacancies page with short term (crisis) or
 * long term (transitional) service providers. The available service
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
  const name = req.body.fName + ' ' + req.body.lName;
  const longTerm = (req.params.lengthOfStay === 'long_term');
  const type = (longTerm ? ['transitional'] : ['crisis']);
  const age = parseInt(timeago().format(req.body.dob).split(' ')[0], 10);

  Service.find(
    {
      $and: [
        { serviceType: { $in: type } },
        { 'ageRange.maxAge': { $gte: age } },
        { 'ageRange.minAge': { $lte: age } },
        {
          'address.coordinates.coordinates': {
            $near: {
              $geometry: { type: 'Point', coordinates: [req.body.long, req.body.lat] },
            },
          },
        },
      ],
    },
    'name description address uri logo thankyouMessage img beds',
  ).exec()
    .then((services) => {
      if (req.body.child) {
        // eslint-disable-next-line
        services = hasBedWithChild(services);
      }
      let { gender } = req.body;
      if (gender === 'Other') gender = 'Either';
      services = servicesWithBedGender(services, gender);
      // Sort services into available and unavailable
      const available = [];
      const availableImagePromises = [];
      const availableLogosPromises = [];
      const unavailable = [];
      const unavailableLogosPromises = [];
      const unavailableImagePromises = [];
      for (let i = 0; i < services.length; i += 1) {
        if (services[i].beds) {
          if (services[i].isAvailable(services[i].beds)) {
            available.push(services[i]);
            // available[available.length - 1].available =
            //   services[i].isAvailable(services[i].beds);
            availableImagePromises.push(images.getImageForService(services[i].img[0]));
            availableLogosPromises.push(images.getImageForService(services[i].logo));
          } else {
            unavailable.push(services[i]);
            // unavailable[unavailable.length - 1].available =
            //   services[i].isAvailable(services[i].beds);
            unavailableImagePromises.push(images.getImageForService(services[i].img[0]));
            unavailableLogosPromises.push(images.getImageForService(services[i].logo));
          }
        }
      }

      Promise.all(availableImagePromises).then((availableImages) => {
        Promise.all(unavailableImagePromises).then((unavailableImages) => {
          Promise.all(availableLogosPromises).then((availableLogos) => {
            Promise.all(unavailableLogosPromises).then((unavailableLogos) => {
              res.render('bedVacanciesList', {
                userName: name,
                serviceType: type,
                locations: available,
                locationImgs: availableImages,
                locationLogos: availableLogos,
                dlocations: unavailable,
                dlocationImgs: unavailableImages,
                dlocationLogos: unavailableLogos,
                userCoords: {
                  long: req.body.long,
                  lat: req.body.lat,
                },
              });
            });
          });
        }).catch(() => {
          res.render('bedVacanciesList', {
            title: 'For Now',
            tagline: 'A place to stay',
            locations: available,
            dlocations: unavailable,
            userCoords: {
              long: req.body.long,
              lat: req.body.lat,
            },
          });
        });
      }).catch(() => {
        res.render('bedVacanciesList', {
          title: 'For Now',
          tagline: 'A place to stay',
          locations: available,
          dlocations: unavailable,
          userCoords: {
            long: req.body.long,
            lat: req.body.lat,
          },
        });
      });
    })
    .catch((err) => {
      res.redirect('/');
      throw new Error(err);
    });
};

/**
 * Renders the showLocation page with data from a service provider specified
 * in req.params. Pulls images from a Firebase storage bucket.
 * @param  {Object} req Express request object.
 * @param  {Object} res Express response object.
 */
module.exports.showLocation = (req, res) => {
  Service.findOne(
    { uri: req.params.serviceUri },
    'name description address amenities houseRules about img logo hours thankyouMessage',
  ).exec().then((service) => {
    images.getImagesForService(service, req.params.serviceUri).then((results) => {
      logo.getImageForService(service.logo, req.params.serviceUri).then((result) => {
        res.render('showLocation', {
          location: service,
          images: results.images,
          logo: result,
        });
      }).catch((err) => {
        console.log('[ERROR] LocationsController: '.concat(err));
        res.render('showLocation', {
          location: service,
          map: {
            title: service.name,
            suburb: service.address.suburb,
          },
        });
      });
    }).catch((err) => {
      console.log('[ERROR] LocationsController: '.concat(err));
      res.render('showLocation', {
        location: service,
        map: {
          title: service.name,
          suburb: service.address.suburb,
        },
      });
    });
  }).catch((err) => {
    console.log('[ERROR] LocationsController: '.concat(err));
    res.status(500).json({ message: err });
  });
};

function hasBedWithChild(services) {
  return services.filter((service) => {
    for (let i = 0; i < service.beds.length; i += 1) {
      if (service.beds[i].bedType === 'ParentChild') return true;
    }
    return false;
  });
}

function servicesWithBedGender(services, gender) {
  return services.filter((service) => {
    for (let i = 0; i < service.beds.length; i += 1) {
      if (service.beds[i].gender === 'Either' || service.beds[i].gender === gender) {
        return true;
      }
    }
    return false;
  });
}
