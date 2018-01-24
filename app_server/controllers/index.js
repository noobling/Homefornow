const mongoose = require('mongoose');
const async = require('async');

const Service = mongoose.model('Service');

/**
 * Finds one available service provider of the specified type.
 * To be called by an async operation that provides an async callback.
 * @param  {Function} callback Callback provided by async.
 * @param  {string}   type     Type of service provider: 'critical', 'transitional' or 'long'.
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
 * Renders the index page with three service providers: one critical,
 * one transitional and one long term service provider.
 * @param  {Object} req Express request object.
 * @param  {Object} res Express response object.
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
