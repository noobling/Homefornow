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
    'name tagline address.suburb facilities restrictions additionalInfo website',
  ).exec()
    .then((accommodation) => {
      console.log('Doc: '.concat(accommodation));
      res.render('showLocation', {
        location: accommodation,
        map: {
          title: accommodation.name,
          suburb: accommodation.address.suburb,
        },
        images: [
          'https://firebasestorage.googleapis.com/v0/b/homefornow-fd495.appspot.com/o/images%2Fyass%2Fimage1.jpg?alt=media&token=257f0433-4750-4afa-bcb0-a1d2291e5651',
          'https://firebasestorage.googleapis.com/v0/b/homefornow-fd495.appspot.com/o/images%2Fyass%2Fimage2.jpg?alt=media&token=1da53563-4c44-4882-a4a3-e5d3628177e0',
          'https://firebasestorage.googleapis.com/v0/b/homefornow-fd495.appspot.com/o/images%2Fyass%2Fimage3.jpg?alt=media&token=32fbef96-c319-418b-9e29-edba901b441f',
        ],
      });
    })
    .catch((err) => {
      console.log('[ERROR] LocationsController: '.concat(err));
    });

  // res.render('showLocation', {
  //   title: name,
  //   tagline: 'Bringing people together',
  //   location: {
  //     info: 'Located in East Perth',
  //     opening: '9am',
  //     closing: '5pm',
  //     facilities: [
  //       'Hot Drinks',
  //       'Wifi',
  //       'Personal Rooms',
  //       'Councilors',
  //     ],
  //     restrictions: [
  //       '10pm curfew',
  //       'No drugs',
  //       'No alcohol',
  //       'No medical issues',
  //     ],
  //   },
  //   map: {
  //     title: name,
  //     suburb: 'Crawley',
  //   },
  //   additionalInfo: 'Every day we support people nationwide by combatting homelessness, assisting disadvantaged families and children, addressing mental health issues, fighting substance dependencies, and much more. We’re generously supported by our funders, partners and tens of thousands of everyday Australians, who make the work of our tireless volunteers and staff possible.',
  // });
};
