const mongoose = require('mongoose');

const Accommodation = mongoose.model('Accommodation');

module.exports.index = (req, res) => {
  // Finds any three available service providers
  Accommodation.find({ available: true }, 'name phoneNumber description available uri').limit(3).exec()
    .then((accommodation) => {
      res.render('index', {
        user: req.user,
        locations: accommodation,
        title: 'Do you have a secure place to stay?',
      });
    })
    .catch((err) => {
      console.log('[ERROR] LocationsController: '.concat(err));
    });
};
