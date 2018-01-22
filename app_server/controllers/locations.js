const mongoose = require('mongoose');
const admin = require('firebase-admin');

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
  let metadataCount = 0;
  let listCount = 0;
  console.log('Id: '.concat(req.params.accommodationId));
  Accommodation.findById(
    req.params.accommodationId,
    'name tagline address.suburb facilities restrictions additionalInfo website img hours',
  ).exec()
    .then((accommodation) => {
      console.log('Doc: '.concat(accommodation));

      console.log('Images: '.concat(accommodation.img));
      const imageList = [];

      if (accommodation.img != null && accommodation.img.length > 0) {
        listCount = accommodation.img.length;
        const bucket = admin.storage().bucket();

        accommodation.img.forEach((image) => {
          // Get the metadata for each image reference
          bucket.file(image).getMetadata().then((data) => {
            // Add the media link for the image to 'imageList'
            imageList[imageList.length] = data[0].mediaLink;
            metadataCount += 1;

            // If all the images have been added to imageList, render the page with these images
            if (metadataCount === listCount) {
              res.render('showLocation', {
                location: accommodation,
                map: {
                  title: accommodation.name,
                  suburb: accommodation.address.suburb,
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
                location: accommodation,
                map: {
                  title: accommodation.name,
                  suburb: accommodation.address.suburb,
                },
              });
            }
          });
        });
      } else {
        // If 'img' is not defined or is empty, render the page without the carousel
        res.render('showLocation', {
          location: accommodation,
          map: {
            title: accommodation.name,
            suburb: accommodation.address.suburb,
          },
        });
      }
    })
    .catch((err) => {
      console.log('[ERROR] LocationsController: '.concat(err));
      res.status(400).json({ message: err });
    });
};
