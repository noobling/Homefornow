const mongoose = require('mongoose');
// const ansync = require('async');

const Service = mongoose.model('Service');
const Request = mongoose.model('Request');
const User = mongoose.model('User');

module.exports.admin = (req, res) => {
  const prevPage = req.header('Referer') || '/';
  if (!req.user) {
    res.redirect(prevPage);
  } else if (req.user.role === 'admin') {
    Service.find({ }, { name: 1, beds: 1, requests: 1 }).exec()
      .then((service) => {
        res.render('admin', {
          services: service,
        });
      });
  } else if (req.user.role === 'service_provider') {
    Service.findById(req.user.service[0], 'uri').exec().then((service) => {
      res.redirect('/service/dashboard/'.concat(service.uri));
    });
  } else if (req.user.role === 'youth') {
    res.redirect(prevPage);
  } else {
    res.redirect(prevPage);
  }
};

module.exports.addService = (req, res) => {
  const prevPage = req.header('Referer') || '/';
  User.find({ role: 'service_provider' }, '_id name', (err, users) => {
    if (!req.user) {
      return res.redirect(prevPage);
    }
    if (req.user.role !== 'admin') {
      return res.redirect(prevPage);
    }

    return res.render('addServiceCreation', { users });
  });
};

module.exports.wipeRequests = (req, res) => {
  const prevPage = req.header('Referer') || '/';
  if (!req.user) {
    return res.redirect(prevPage);
  }
  if (req.user.role !== 'admin') {
    return res.redirect(prevPage);
  }

  Service.updateMany(
    {},
    {
      $set: {
        request: [],
        openRequests: [],
      },
    },
  ).exec().then(() => {
    Request.deleteMany({}).exec().then(() => res.redirect('/'));
  });
};

module.exports.adminData = (req, res) => {
  res.json({
    assistData: [65, 59, 80, 81, 56, 55, 40],
    unassistData: [65, 59, 60, 81, 56, 55, 40],
  });
};
