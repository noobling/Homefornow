const mongoose = require('mongoose');

const Service = mongoose.model('Service');

module.exports.index = (req, res) => {
  // Finds any three available service providers
  Service.find({ available: true }, 'name phoneNumber description available uri').limit(3).exec()
    .then((service) => {
      res.render('index', {
        user: req.user,
        locations: service,
        title: 'Do you have a secure place to stay?',
      });
    })
    .catch((err) => {
      console.log('[ERROR] LocationsController: '.concat(err));
    });
};
