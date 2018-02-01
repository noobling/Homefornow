const mongoose = require('mongoose');

const Service = mongoose.model('Service');

/**
 * Renders the service page.
 * @param  {Object} req Express request object.
 * @param  {Object} res Express response object.
 */
module.exports.service = (req, res) => {
  res.render('service', {
    user: req.user
  });
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
    return;
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

function countAvailableBeds(beds) {
  let count = 0;
  for (let i = 0; i < beds.length; i += 1) {
    if (!beds[i].isOccupied) count += 1;
  }
  return count;
}

/**
 * Renders a service provider's dashboard.
 * @param  {Object} req Express request object.
 * @param  {Object} res Express response object.
 */
module.exports.dashboard = (req, res) => {
  // console.log("hey");
  // if (!req.user || req.user.role !== 'service_provider') {
  //   res.status(401).json({ message: 'You are not authorised to view this page. Please log in with your service provider account.' });
  //   return;
  // }
  //
  // Service.findById(
  //   req.user.service[0],
  //   'name address.suburb beds tags openRequests'
  // ).exec()
  //   .then((service) => {
  //     res.render('serviceDashboard', {
  //       service: service,
  //       numAvailableBeds: countAvailableBeds(service.beds),
  //
  //     });
  //   })
  //   .catch((err) => { res.status(401).json({ message: err }); });

  res.render('serviceDashboard', {
    service: {
      name: 'Youngle Group',
      address: {
        suburb: 'Cannington',
      }
    },
    numAvailableBeds: 10
  });
};

/**
 * Renders a service provider's profile page
 * @param  {Object} req Express request object.
 * @param  {Object} res Express response object.
 */
module.exports.profile = (req, res) => {
  res.send('This is the Services Profile Page, rendered by the service.js Controller');
};
