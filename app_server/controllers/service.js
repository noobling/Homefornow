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
  if (service.BATH === 'on') {
    amen.push({
      label: 'BATHROOM',
      name: 'BATH',
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

      console.log(service.amenities);

      service.save().then((newService) => {
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
      }).catch((err) => {
        next(err);
      });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.updateService = (req, res) => {
  let service = new Service();

  data = {
    name: req.body.serveName,
    description: req.body.serveDesc,
    addresss: {
      suburb: req.body.serveSuburb,
      state: req.body.serveState,
      postcode: req.body.servePostcode
    },
    serviceType: req.body.serveType,
    ageRange: {
      minAge: req.body.serveMinAge,
      maxAge: req.body.serveMaxAge
    },
    stayLength: req.body.serveStayLength,
    phoneNumber: req.body.servePhone,
    about: req.body.serveAbout,
    houseRules: req.body.serveRules,
    thankyouMessage: req.body.thankyouMessage
  };

  try {
    Service.findOneAndUpdate({ name: req.params.serviceName }, { $set: data }, (err, doc) => {
      if (err) console.log(err+'\n');
      res.redirect('/location/' + service.encodeURI(req.body.serveName));      
    });
    
  } catch (e) {
    res.redirect('/location/' + service.encodeURI(req.body.serveName));    
    console.log(e);
  }
}

// function returnAges(requests) {
//   const newRequests = requests;
//   for (let i = 0; i < requests.length; i += 1) {
//     newRequests[i].youth.dob = getAge(new Date(requests[i].youth.dob));
//   }
//   return newRequests;
// }

/**
 * Renders a service provider's dashboard.
 * @param  {Object} req Express request object.
 * @param  {Object} res Express response object.
 */
module.exports.dashboard = (req, res) => {
  if (!req.user || req.user.role !== 'service_provider') {
    // res.status(401).json({ message: 'You are not authorised to view this page.' });
    res.redirect('/');
    return;
  }
  Service.findById(
    req.user.service[0],
    'name uri',
  ).exec()
    .then((service) => {
      res.render('serviceDashboard', {
        service,
      });
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
  if (!req.user || req.user.role !== 'service_provider') {
    res.status(401).json({ message: 'You are not authorised to view this page.' });
    return;
  }
  Service.findById(
    req.user.service[0],
    'beds',
  ).exec()
    .then((service) => {
      // console.log(service);
      res.send({
        service,
      });
    })
    .catch((err) => {
      res.status(401).json({ message: err });
    });
};

module.exports.dashboardOpenRequests = (req, res) => {
  if (!req.user || req.user.role !== 'service_provider') {
    res.status(401).json({ message: 'You are not authorised to view this page.' });
    return;
  }
  Service.findById(
    req.user.service[0],
    'openRequests',
  ).exec()
    .then((service) => {
      // console.log(service.openRequests);
      Request.find(
        {
          _id: service.openRequests,
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
    });
};

module.exports.dashboardClosedRequests = (req, res) => {
  if (!req.user || req.user.role !== 'service_provider') {
    res.status(401).json({ message: 'You are not authorised to view this page.' });
    return;
  }
  Service.findById(
    req.user.service[0],
    'requests',
  ).exec()
    .then((service) => {
      // console.log(service.openRequests);
      Request.find(
        {
          _id: service.requests,
        },
        'firstName lastName gender phoneNumber email dob closedAt note',
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
    });
};

/**
 * Renders a service provider's dashboard.
 * @param  {Object} req Express request object.
 * @param  {Object} res Express response object.
 */
module.exports.dashboardProfile = (req, res) => {
  if (!req.user || req.user.role !== 'service_provider') {
    res.status(401).json({ message: 'You are not authorised to view this page.' });
    return;
  }
  Service.findById(
    req.user.service[0],
    'name address.suburb address.state address.postcode phoneNumber serviceType ageRange.minAge ageRange.maxAge stayLength description about houseRules amenities.name thankyouMessage',
  ).exec()
    .then((service) => {
      // console.log(`service = ${service}`);
      res.send({
        service,
        email: req.user.email,
      });
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
  if (!req.user || req.user.role !== 'service_provider') {
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
  if (!req.user || req.user.role !== 'service_provider') {
    res.status(401).json({ message: 'You are not authorised to view this page.' });
    return;
  }

    Service.find({}, (err, services) => {
      if (err) throw err;
      const data = {
        crisis: [],
        transitional: []
      }
      services.forEach((service) => {
        if (service.beds) {
          serviceData = {
            serviceName: service.name, 
            phoneNumber: service.phoneNumber
          }
        
          serviceData.numBeds = service.beds.length;
          let numMale = 0;
          let numFemale = 0;
          let numEither = 0;
          service.beds.forEach((bed) => {
            if (bed.gender === 'Male') numMale++
            if (bed.gender === 'Female') numFemale++
            if (bed.gender === 'Either') numEither++
          })
          serviceData.numMale = numMale;
          serviceData.numFemale = numFemale;
          serviceData.numEither = numEither;
          
          if (service.serviceType == 'crisis') {
            data.crisis.push(serviceData)
          } else {
            data.transitional.push(serviceData)
          }
        }
      })
      res.send(data)
    })
};

module.exports.updateBeds = (req, res) => {
  if (!req.user || req.user.role !== 'service_provider') {
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
      let available = beds.filter((bed) => { return bed.isOccupied === 'Available' });

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
  if (!req.user || req.user.role !== 'service_provider') {
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
  if (!req.user || req.user.role !== 'service_provider') {
    res.status(401).json({ message: 'You are not authorised to view this page.' });
    return;
  }

  Service.findByIdAndUpdate(req.user.service[0], {
    $pull: {
      requests: req.body['_id']
    },
    $addToSet: {
      openRequests: req.body['_id']
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
  const payload = {};
  payload[req.body.id] = 'on';
  let amens = amenities(payload);
  amens = amens.filter(amen => amen.label !== 'NO SMOKING');
  if (amens) {
    const amen = amens[0];
    if (req.body.checkedState === 'true') {
      Service.findOneAndUpdate({ _id: req.user.service[0] }, { new: true }, {
        $push: {
          amenities: {amen},
        },
      }, (err, doc) => {
        if (err) console.log(err);
        console.log(doc);
      });
    } else {
      Service.findOneAndUpdate({ _id: req.user.service[0] }, {
        $pull: {
          amenities: amen,
        },
      });
    }
  }

  res.json('Worked');
};
