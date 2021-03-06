const mongoose = require('mongoose');
const googleMapsClient = require('@google/maps').createClient({
  key: process.env.embed_maps_api,
  Promise, // 'Promise' is the native constructor.
});
const images = require('../middleware/images');

const Service = mongoose.model('Service');
const Request = mongoose.model('Request');
const User = mongoose.model('User');

function amenities(service) {
  const amen = [];

  if (service.TV === 'on') {
    amen.push({
      label: 'TV',
      name: 'TV',
      icon: 'tv',
    });
  }
  if (service.WASHER === 'on') {
    amen.push({
      label: 'LAUNDRY/WASHER',
      name: 'WASHER',
      icon: 'local_laundry_service',
    });
  }
  if (service.WIFI === 'on') {
    amen.push({
      label: 'WIFI',
      name: 'WIFI',
      icon: 'wifi',
    });
  }
  if (service.BATH === 'private') {
    amen.push({
      label: 'BATHROOM PRIVATE',
      name: 'BATHPRIVATE',
      icon: 'wc',
    });
  } else {
    amen.push({
      label: 'BATHROOM SHARED',
      name: 'BATHSHARED',
      icon: 'wc',
    });
  }
  if (service.SMOKE === 'on') {
    amen.push({
      label: 'SMOKING',
      name: 'SMOKE',
      icon: 'smoking_rooms',
    });
  } else {
    amen.push({
      label: 'NO SMOKING',
      name: 'SMOKE',
      icon: 'smoke_free',
    });
  }
  if (service.AIRCON === 'on') {
    amen.push({
      label: 'AIR-CONDITIONING',
      name: 'AIRCON',
      icon: 'ac_unit',
    });
  }
  if (service.GAMES === 'on') {
    amen.push({
      label: 'GAMES/CONSOLE',
      name: 'GAMES',
      icon: 'videogame_asset',
    });
  }
  if (service.GYM === 'on') {
    amen.push({
      label: 'GYM',
      name: 'GYM',
      icon: 'fitness_center',
    });
  }
  if (service.STUDY === 'on') {
    amen.push({
      label: 'STUDY',
      name: 'STUDY',
      icon: 'local_library',
    });
  }
  if (service.KITCHEN === 'on') {
    amen.push({
      label: 'KITCHEN',
      name: 'KITCHEN',
      icon: 'local_dining',
    });
  }
  if (service.PHONE === 'on') {
    amen.push({
      label: 'PHONE',
      name: 'PHONE',
      icon: 'phone',
    });
  }
  if (service.CURFEW === 'on') {
    amen.push({
      label: 'CURFEW',
      name: 'CURFEW',
      icon: 'schedule',
    });
  }
  if (service.SECURE === 'on') {
    amen.push({
      label: 'SECURE',
      name: 'SECURE',
      icon: 'lock',
    });
  }
  if (service.OUTDOOR === 'on') {
    amen.push({
      label: 'OUTDOOR/GARDEN',
      name: 'OUTDOOR',
      icon: 'local_florist',
    });
  }
  return amen;
  //   ['BATHROOM', '', 'wc']; ///////////////////////////////////////////
}

function findAmenityToUpdate(amenity, status) {
  if (amenity === 'TV') {
    return {
      label: 'TV',
      name: 'TV',
      icon: 'tv',
    };
  }
  if (amenity === 'WASHER') {
    return {
      label: 'LAUNDRY/WASHER',
      name: 'WASHER',
      icon: 'local_laundry_service',
    };
  }
  if (amenity=== 'WIFI') {
    return {
      label: 'WIFI',
      name: 'WIFI',
      icon: 'wifi',
    };
  }
  if (amenity === 'BATHPRIVATE') {
    return {
      label: 'BATHROOM PRIVATE',
      name: 'BATHPRIVATE',
      icon: 'wc',
    };
  }
  if (amenity === 'BATHSHARED') {
    return {
      label: 'BATHROOM SHARED',
      name: 'BATHSHARED',
      icon: 'wc',
    };
  }
  if (amenity === 'SMOKE') {
    if (status === 'true') {
      return {
        label: 'SMOKING',
        name: 'SMOKE',
        icon: 'smoking_rooms',
      };
    } else {
      return {
        label: 'NO SMOKING',
        name: 'SMOKE',
        icon: 'smoke_free',
      };
    }
  }
  if (amenity === 'AIRCON') {
    return {
      label: 'AIR-CONDITIONING',
      name: 'AIRCON',
      icon: 'ac_unit',
    };
  }
  if (amenity === 'GAMES') {
    return {
      label: 'GAMES/CONSOLE',
      name: 'GAMES',
      icon: 'videogame_asset',
    };
  }
  if (amenity === 'GYM') {
    return {
      label: 'GYM',
      name: 'GYM',
      icon: 'fitness_center',
    };
  }
  if (amenity === 'STUDY') {
    return {
      label: 'STUDY',
      name: 'STUDY',
      icon: 'local_library',
    };
  }
  if (amenity === 'KITCHEN') {
    return {
      label: 'KITCHEN',
      name: 'KITCHEN',
      icon: 'local_dining',
    };
  }
  if (amenity === 'PHONE') {
    return {
      label: 'PHONE',
      name: 'PHONE',
      icon: 'phone',
    };
  }
  if (amenity === 'CURFEW') {
    return {
      label: 'CURFEW',
      name: 'CURFEW',
      icon: 'schedule',
    };
  }
  if (amenity === 'SECURE') {
    return {
      label: 'SECURE',
      name: 'SECURE',
      icon: 'lock',
    };
  }
  if (amenity === 'OUTDOOR') {
    return {
      label: 'OUTDOOR/GARDEN',
      name: 'OUTDOOR',
      icon: 'local_florist',
    };
  }
  return false;
}

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
 * @param  {Function} next Express next function.
 */
module.exports.addService = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: 'You must be logged in to create a new service provider.' });
    return;
  }

  const service = new Service();

  // Geocode an address with a promise
  googleMapsClient.geocode({ address: req.body.serveSuburb.concat(', ').concat(req.body.serveState).concat(', ').concat(req.body.serveState) }).asPromise()
    .then((response) => {
      const temp = response.json.results[0].geometry.location;

      service.name = req.body.serveName;
      service.phoneNumber = req.body.servePhone;
      service.serviceType = req.body.serveType;
      service.address = {
        suburb: req.body.serveSuburb,
        state: req.body.serveState,
        postcode: req.body.servePostcode,
        coordinates: {
          type: 'Point',
          coordinates: [temp.lng, temp.lat],
        },
      };

      service.ageRange = {
        minAge: req.body.serveMinAge,
        maxAge: req.body.serveMaxAge,
      };

      service.stayLength = req.body.serveStayLength;
      service.available = true;
      // service.website = req.body.website;
      service.uri = service.encodeURI(req.body.serveName);
      service.description = req.body.serveDesc;
      service.about = req.body.serveAbout;
      service.houseRules = req.body.serveRules;
      service.amenities = amenities(req.body);
      service.thankyouMessage = req.body.thankyouMessage;

      console.log(service);

      service.save().then((newService) => {
        if (req.body.serveUser === 'None') {
          const newUser = new User();

          newUser.name = req.body.serveName;
          newUser.email = req.body.serveEmail;
          newUser.dob = new Date();
          newUser.gender = 'Other';
          newUser.role = 'service_provider';
          newUser.service = newService.id;
          newUser.setPassword(req.body.servePass);

          newUser.save().then(() => {
            res.redirect('/location/'.concat(newService.uri));
          }).catch((err) => {
            next(err);
          });
        } else {
          User.findOneAndUpdate({ _id: req.body.serveUser }, {
            $push: { service: newService._id }
          }, (err, user) => {
            if (err) console.log(err);
            res.redirect('/location/'.concat(newService.uri));
          });
        }
      }).catch((err) => {
        next(err);
      });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.updateService = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'You must be logged in to create a new service provider.' });
  }

  const service = new Service();

  const allowTexts = req.body.allowTexts ? true : false;

  const data = {
    name: req.body.serveName,
    uri: service.encodeURI(req.body.serveName),
    description: req.body.serveDesc,
    settings: {
      allowTexts: allowTexts,
    },
    address: {
      suburb: req.body.serveSuburb,
      state: req.body.serveState,
      postcode: req.body.servePostcode,
    },
    serviceType: req.body.serveType,
    ageRange: {
      minAge: req.body.serveMinAge,
      maxAge: req.body.serveMaxAge,
    },
    stayLength: req.body.serveStayLength,
    phoneNumber: req.body.servePhone,
    about: req.body.serveAbout,
    houseRules: req.body.serveRules,
    thankyouMessage: req.body.thankyouMessage,
  };

  try {
    Service.findOneAndUpdate({ uri: req.params.serviceUri }, { $set: data }, (err) => {
      if (err) console.log(`${err}\n`);
      res.redirect(`/location/${service.encodeURI(req.body.serveName)}`);
    });
    // Update the address coordinates
    googleMapsClient.geocode({ address: req.body.serveSuburb.concat(', ').concat(req.body.serveState).concat(', ').concat(req.body.serveState) }).asPromise()
      .then((response) => {
        console.log(response.json.results[0].geometry.location);
        const coords = response.json.results[0].geometry.location;
        Service.findOneAndUpdate({ name: req.params.serviceName }, { $set: { 'address.coordinates.coordinates': [coords.lng, coords.lat] } }, (err) => {
          if (err) console.log(err);
        });
      });
  } catch (e) {
    console.log(e);    
    return res.redirect(`/location/${service.encodeURI(req.body.serveName)}`);
  }
};

// function returnAges(requests) {
//   const newRequests = requests;
//   for (let i = 0; i < requests.length; i += 1) {
//     newRequests[i].youth.dob = getAge(new Date(requests[i].youth.dob));
//   }
//   return newRequests;
// }
function canAccessDashboard(user, serviceId) {
  if (user.role === 'admin') return true;
  else if (user.role === 'service_provider') {
    return user.service.find((uService) => {
      return uService.toString() === serviceId.toString();
    })
  } else {
    return false;
  }
}
/**
 * Renders a service provider's dashboard.
 * @param  {Object} req Express request object.
 * @param  {Object} res Express response object.
 */
module.exports.dashboard = (req, res) => {
  if (!req.user) {
    // res.status(401).json({ message: 'You are not authorised to view this page.' });
    res.render('login', { errors: ['Please sign in to access this page'] });
    return;
  }
  Service.find(
    { uri: req.params.serviceUri },
    'name uri _id',
  ).exec()
    .then((service) => {
      const uService = service[0];
      if (canAccessDashboard(req.user, uService._id)) {
        res.render('serviceDashboard', {
          service: uService,
        });
      } else {
        res.status(403).render('index', { errors: ['You do not own this service'] });
      }
    })
    .catch((err) => {
      res.status(401).json({ message: err });
    });
};

/**
 * Renders a service provider's dashboard.
 * @param  {Object} req Express request object.
 * @param  {Object} res Express response object.
 */
module.exports.dashboardBeds = (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'You are not authorised to view this page.' });
    return;
  }
  Service.find(
    { uri: req.params.serviceUri },
    'beds',
  ).exec()
    .then((service) => {
      if (canAccessDashboard(req.user, service[0]._id)) {
        res.send({
          service: service[0],
        });
      } else {
        res.status(403).send({ message: 'Unauthorized' });
      }
    })
    .catch((err) => {
      res.status(401).json({ message: err });
    });
};

module.exports.dashboardOpenRequests = (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'You are not authorised to view this page.' });
    return;
  }
  Service.find(
    { uri: req.params.serviceUri },
    'openRequests',
  ).exec()
    .then((service) => {
      // console.log(service.openRequests);
      if (canAccessDashboard(req.user, service[0]._id)) {
        Request.find(
          {
            _id: service[0].openRequests,
          },
          '_id firstName lastName gender phoneNumber email dob note closedAt openedAt',
        ).exec()
          .then((requests) => {
            // console.log(requests);
            res.send({
              requests,
            });
          })
          .catch((err) => {
            res.status(401).json({ message: err });
          });
      } else {
        res.status(403).send({ message: 'Unauthorized' });
      }
    });
};

module.exports.dashboardClosedRequests = (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'You are not authorised to view this page.' });
    return;
  }
  Service.find(
    { uri: req.params.serviceUri },
    'requests',
  ).exec()
    .then((service) => {
      if (canAccessDashboard(req.user, service[0]._id)) {
        Request.find(
          {
            _id: service[0].requests,
          },
          'firstName lastName gender phoneNumber email dob closedAt note openedAt',
        ).exec()
          .then((requests) => {
            // console.log(requests);
            res.send({
              requests,
            });
          })
          .catch((err) => {
            res.status(401).json({ message: err });
          });
      } else {
        res.status(403).send({ message: 'Unauthorized' });
      }
    });
};

/**
 * Renders a service provider's dashboard.
 * @param  {Object} req Express request object.
 * @param  {Object} res Express response object.
 */
module.exports.dashboardProfile = (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'You are not authorised to view this page.' });
    return;
  }
  Service.find(
    { uri: req.params.serviceUri },
    'name address.suburb address.state address.postcode phoneNumber serviceType ageRange.minAge ageRange.maxAge stayLength description about houseRules amenities.name thankyouMessage settings',
  ).exec()
    .then((service) => {
      if (canAccessDashboard(req.user, service[0]._id)) {
        res.send({
          service: service[0],
          email: req.user.email,
        });
      } else {
        res.status(403).send({ message: 'Unauthorized' });        
      }
    })
    .catch((err) => {
      res.status(401).json({ message: err });
    });
};

/**
 * Renders a service provider's dashboard. [DEPRACATED]
 *
 * @param  {Object} req Express request object.
 * @param  {Object} res Express response object.
 */
module.exports.dashboardAvailable = (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'You are not authorised to view this page.' });
    return;
  }
  Service.findById(
    req.user.service[0],
    'name address.suburb address.state address.postcode phoneNumber serviceType ageRange.minAge ageRange.maxAge stayLength available description about houseRules amenities.name beds openRequests uri',
  ).exec()
    .then((service) => {
      console.log(service.openRequests);
      Request.find({
        _id: service.openRequests,
      }, 'firstName lastName gender phoneNumber email dob').exec()
        .then((requests) => {
          console.log(requests);
          res.render('serviceDashboard', {
            service,
            requests,
          });
        })
        .catch((err) => {
          res.status(401).json({ message: err });
        });
    });
};

module.exports.bedsAvailable = (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'You are not authorised to view this page.' });
    return;
  }

  Service.find({}, (err, services) => {
    if (err) throw err;
    const data = {
      crisis: [],
      transitional: [],
    };
    services.forEach((service) => {
      if (service.beds) {
        const serviceData = {
          serviceName: service.name,
          phoneNumber: service.phoneNumber,
        };

        serviceData.numBeds = service.beds.length;
        let numMale = 0;
        let numFemale = 0;
        let numEither = 0;
        service.beds.forEach((bed) => {
          if (bed.isOccupied === 'Available') {
            if (bed.gender === 'Male') numMale += 1;
            if (bed.gender === 'Female') numFemale += 1;
            if (bed.gender === 'Either') numEither += 1;
          }
        });
        serviceData.numMale = numMale;
        serviceData.numFemale = numFemale;
        serviceData.numEither = numEither;
        serviceData.numBeds = numMale + numFemale + numEither;

        if (service.serviceType === 'crisis') {
          data.crisis.push(serviceData);
        } else {
          data.transitional.push(serviceData);
        }
      }
    });
    res.send(data);
  });
};

module.exports.updateBeds = (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'You are not authorised to view this page.' });
    return;
  }

  const prevPage = req.header('Referer') || '/';

  if (!req.body.beds) {
    console.log('no beds');
    res.redirect(prevPage);
    return;
  }
  const { beds } = req.body;

  Service.findOne({ uri: req.params.serviceUri }, 'beds')
    .exec()
    .then((service) => {
      const oldBeds = service.beds;
      let index;
      if (oldBeds.length <= beds.length) {
        index = oldBeds.length;
      } else {
        index = beds.length;
      }
      for (let i = 0; i < index; i += 1) {
        if (beds[i].name === undefined) {
          beds[i].name = oldBeds[i].name;
        }
        if (beds[i].gender === undefined) {
          beds[i].gender = oldBeds[i].gender;
        }
        if (beds[i].bedType === undefined) {
          beds[i].bedType = oldBeds[i].bedType;
        }
        if (beds[i].isOccupied === undefined) {
          beds[i].isOccupied = oldBeds[i].isOccupied;
        }
      }
    }).then(() => {
      let available = beds.filter(bed => bed.isOccupied === 'Available');

      if (available.length === 0) {
        available = false;
      } else {
        available = true;
      }
      console.log(available);
      Service.findOneAndUpdate(
        { uri: req.params.serviceUri },
        {
          $set: {
            beds,
            available,
          },
        },
        { runValidators: true },
      ).exec().then(() => {
        res.redirect('/service/dashboard/'.concat(req.params.serviceUri));
      }).catch((err) => {
        console.log(err);
        res.redirect(prevPage);
      });
    });
};

module.exports.updateRequests = (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'You are not authorised to view this page.' });
    return;
  }

  const prevPage = req.header('Referer') || '/';

  if (!req.body.requests) {
    console.log('no requests');
    res.redirect(prevPage);
    return;
  }
  console.log(req.body.requests);
  // const removedRequests = req.body.requests;

  Request.update({ _id: { $in: req.body.requests } }, { closedAt: Date.now() }, (err, requests) => {
    if (err) console.log(err);
    console.log(requests);
  });

  Service.findOneAndUpdate(
    { uri: req.params.serviceUri },
    {
      $pullAll: {
        openRequests: req.body.requests,
      },
      $addToSet: {
        requests: {
          $each: req.body.requests,
        },
      },
    },
    { runValidators: true },
  ).exec().then(() => {
    res.redirect('/service/dashboard/'.concat(req.params.serviceUri));
  }).catch((err) => {
    console.log(err);
    res.redirect(prevPage);
  });
};

module.exports.reopenRequest = (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'You are not authorised to view this page.' });
    return;
  }

  Service.findOneAndUpdate({ uri: req.params.serviceUri }, {
    $pull: {
      requests: req.body['_id'],
    },
    $addToSet: {
      openRequests: req.body['_id'],
    },
  }).exec().then(() => {
    res.json('Reopened request');
  }).catch((err) => {
    res.json(err);
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

/**
 * Renders the images for a service provider's profile page.
 * @param  {Object} req Express request object.
 * @param  {Object} res Express response object.
 */
module.exports.dashboardImages = (req, res) => {
  Service.findOne({ uri: req.params.serviceUri }, 'name img logo').exec().then((service) => {
    Promise.all([
      images.getImagesForService(service, req.params.serviceUri),
      images.getImageForService(service.logo, req.params.serviceUri),
    ]).then(([imgs, logo]) => {
      const params = imgs;
      params.logo = logo;
      console.log(params);
      res.json({ data: params });
    }).catch((err) => {
      res.status(500).json({ message: err });
    });
  }).catch((err) => {
    res.status(500).json({ message: err });
  });
};

module.exports.addNote = (req, res) => {
  Request.findOneAndUpdate({ _id: req.body['_id'] }, { $set: { note: req.body.note } }, { new: true }, (err, doc) => {
    if (err) {
      res.json(err);
    }
    res.json(doc);
  });
};

module.exports.updateAmenities = (req, res) => {
  const amenity = findAmenityToUpdate(req.body.id, req.body.checkedState);   
  if (amenity) {
    if (req.body.checkedState === 'true') {
      Service.findOneAndUpdate({ uri: req.params.serviceUri }, {
        $push: {
          amenities: amenity,
        },
      }, (err, service) => {
        if (err) {
          res.status(400).json(err);
        } else {
          res.json(service);
        }
      });
      if (req.body.id === 'BATHSHARED') {
        console.log('executing bath shared')
        const bathPrivate = findAmenityToUpdate('BATHPRIVATE');
        Service.findOneAndUpdate({ uri: req.params.serviceUri }, { $pull: {amenities: bathPrivate}}, (err, service) => {
          if (err) console.log(err);
        });
      } else if (req.body.id === 'BATHPRIVATE') {
        console.log('executing bath private')
        const bathShared = findAmenityToUpdate('BATHSHARED');
        Service.findOneAndUpdate({ uri: req.params.serviceUri }, { $pull: { amenities: bathShared } }, (err, service) => {
          if (err) console.log(err);
        });
      }
    } else {
      Service.findOneAndUpdate({ uri: req.params.serviceUri }, {
        $pull: {
          amenities: amenity,
        },
      }, (err, service) => {
        if (err) {
          res.status(400).json('error');
        } else {
          res.json(service);
        }
      });
    }
  } else {
    res.status(400).json({ message: 'No amenities set' });
  }
};

module.exports.userSettings = (req, res) => {
  if (!req.user) return res.status(401).render('index');

  return res.render('userSettings');
};

module.exports.userService = (req, res) => {
  if (!req.user) return res.status(401).render('index');

  return res.render('userService');
};
