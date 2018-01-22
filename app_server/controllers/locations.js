const mongoose = require('mongoose');

const Accommodation = mongoose.model('Accommodation');
const Request = mongoose.model('Request');

// Needed to create a 2dsphere index on address.coordinates.coordinates for $near to work
// db.collection.createIndex( { 'address.coordinates.coordinates' : '2dsphere' } )
// https://docs.mongodb.com/manual/core/2dsphere/
module.exports.shortTermList = (req, res) => {
  Request.findById(req.session.requestId, 'location.coordinates').exec()
    .then((request) => {
      return Accommodation.find(
        {
          'address.coordinates.coordinates': {
            $near: {
              $geometry: { type: 'Point', coordinates: request.location.coordinates.coordinates },
            },
          },
        },
        'name available number phoneNumber description',
      ).exec();
    })
    .then((docs) => {
      res.render('bedVacanciesList', {
        title: 'For Now',
        tagline: 'A place to stay',
        locations: docs,
        dlocations: [],
      });
    })
    .catch((err) => {
      console.log('[ERROR] LocationsController: '.concat(err));
    });
};

module.exports.longTermList = (req, res) => {
  Request.findById(req.session.requestId, 'location.coordinates').exec()
    .then((request) => {
      return Accommodation.find(
        {
          'address.coordinates.coordinates': {
            $near: {
              $geometry: { type: 'Point', coordinates: request.location.coordinates.coordinates },
            },
          },
        },
        'name available number phoneNumber description',
      ).exec();
    })
    .then((docs) => {
      res.render('bedVacanciesList', {
        title: 'For Now',
        tagline: 'A place to stay',
        locations: docs,
        dlocations: [],
      });
    })
    .catch((err) => {
      console.log('[ERROR] LocationsController: '.concat(err));
    });
};

module.exports.showLocation = (req, res) => {
  console.log('Id: '.concat(req.params.accommodationId));
  Accommodation.findById(
    req.params.accommodationId,
    'name tagline address.suburb facilities restrictions additionalInfo website openingHours',
  ).exec()
    .then((accommodation) => {
      res.render('showLocation', {
        location: accommodation,
        map: {
          title: accommodation.name,
          suburb: accommodation.address.suburb,
        },
      });
    })
    .catch((err) => {
      console.log('[ERROR] LocationsController: '.concat(err));
    });
};
