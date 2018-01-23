const mongoose = require('mongoose');
const admin = require('firebase-admin');

const Service = mongoose.model('Service');

// Needed to create a 2dsphere index on address.coordinates.coordinates for $near to work
// db.collection.createIndex( { 'address.coordinates.coordinates' : '2dsphere' } )
// https://docs.mongodb.com/manual/core/2dsphere/
function showVacanciesList(req, res, isLongTerm) {
  const type = (isLongTerm ? ['long'] : ['critical', 'transitional']);
  Service.find(
    {
      $and: [
        { serviceType: { $in: type } },
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
  ).exec()
    .then((docs) => {
      // Sort services into available and unavailable
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
}

module.exports.shortTermList = (req, res) => {
  showVacanciesList(req, res, false);
};

module.exports.longTermList = (req, res) => {
  showVacanciesList(req, res, true);
};

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
      res.status(400).json({ message: err });
    });
};
