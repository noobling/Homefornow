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
        'name available number phoneNumber description address',
      ).exec();
    })
    .then((docs) => {
      // Sort accommodation into available and unavailable
      const available = [];
      const unavailable = [];

      for (let i = 0; i < docs.length; i += 1) {
        if (docs[i].available) {
          available.push(docs[i]);
        } else {
          unavailable.push(docs[i]);
        }
      }

      res.render('bedVacanciesList', {
        title: 'For Now',
        tagline: 'A place to stay',
        locations: available,
        dlocations: unavailable,
      });
    })
    .catch((err) => {
      console.log('[ERROR] LocationsController: '.concat(err));
      res.status(400).json({ message: err });
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
        'name available number phoneNumber description address',
      ).exec();
    })
    .then((docs) => {
      // Sort accommodation into available and unavailable
      const available = [];
      const unavailable = [];

      for (let i = 0; i < docs.length; i += 1) {
        if (docs[i].available) {
          available.push(docs[i]);
        } else {
          unavailable.push(docs[i]);
        }
      }

      res.render('bedVacanciesList', {
        title: 'For Now',
        tagline: 'A place to stay',
        locations: available,
        dlocations: unavailable,
      });
    })
    .catch((err) => {
      console.log('[ERROR] LocationsController: '.concat(err));
      res.status(400).json({ message: err });
    });
};

module.exports.showLocation = (req, res) => {
  console.log('Id: '.concat(req.params.accommodationId));
  Accommodation.findById(
    req.params.accommodationId,
    'name tagline address.suburb facilities restrictions additionalInfo website hours',
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
      res.status(400).json({ message: err });
    });
};
