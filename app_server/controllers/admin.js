const mongoose = require('mongoose');
// const ansync = require('async');

const Service = mongoose.model('Service');

module.exports.admin = (req, res) => {
  Service.find({ }, { name: 1, beds: 1, requests: 1 }).exec()
    .then((service) => {
      res.render('admin', {
        services: service,
      });
    });
};

module.exports.adminData = (req, res) => {
  res.json({
    assistData: [65, 59, 80, 81, 56, 55, 40],
    unassistData: [65, 59, 60, 81, 56, 55, 40],
  });
};
