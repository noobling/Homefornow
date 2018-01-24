const mongoose = require('mongoose');
const async = require('async');

const Service = mongoose.model('Service');

/**
 * Finds the first available service provider of the specified type
 * @param  {Function} callback [description]
 * @param  {[type]}   type     [description]
 * @return {[type]}            [description]
 */
function findService(callback, type) {
  Service.findOne(
    {
      $and: [
        { available: true },
        { serviceType: type },
      ],
    },
    'name phoneNumber description available uri',
  ).exec((err, service) => {
    if (err) { console.log('[ERROR] LocationsController: '.concat(err)); }
    callback(null, service);
  });
}

/**
 * Finds the first available critical, transitional and long term service providers in parallel.
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
module.exports.index = (req, res) => {
  async.parallel(
    {
      critical: (callback) => { findService(callback, 'critical'); },
      transitional: (callback) => { findService(callback, 'transitional'); },
      long: (callback) => { findService(callback, 'long'); },
    },
    (err, services) => {
      if (err) {
        console.log('[ERROR] LocationsController: '.concat(err));
      }
      res.render('index', {
        user: req.user,
        critical: services.critical,
        transitional: services.transitional,
        long: services.long,
        title: 'Do you have a secure place to stay?',
      });
    },
  );
};
