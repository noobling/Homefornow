const mongoose = require('mongoose');

const Request = mongoose.model('Request');
const Service = mongoose.model('Service');
const User = mongoose.model('User');

/**
 * Prints an error to the console and sends a json repsonse
 * that contains the error message.
 * @param  {Object} res    Express response object.
 * @param  {String} err    The error message.
 * @param  {number} status The HTTP status to set.
 */
function errorHandler(res, err, status) {
  if (err) {
    console.log('[ERROR] RequestsController: '.concat(err));
    res.status(status).json({ message: err });
  }
}

/**
 * Saves a youth person's request (mongo document) to the database.
 * The requestId is appended to the service provider's open requests and
 * the user's collection of requests.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
module.exports.openRequest = (req, res) => {
  const request = new Request();

  request.youth = req.user.id;
  request.service = req.body.serviceId;
  request.hasChild = req.body.child === 'yes';
  request.isLongTerm = req.params.lengthOfStay === 'long_term';

  let requestId;

  request.save() // Save the request
    .then((savedReq) => {
      requestId = savedReq.id;
      // Append request to user's array of requests
      return User.findOneAndUpdate(
        { _id: req.user.id },
        { $push: { requests: requestId } },
        { runValidators: true, new: true },
      );
    })
    .then(() => {
      // Append request to service's open requests
      return Service.findOneAndUpdate(
        { _id: req.body.serviceId },
        { $push: { openRequests: requestId } },
        { runValidators: true, new: true },
      );
    })
    .then(() => { res.status(201).end(); })
    .catch((err) => { errorHandler(res, err, 500); });
};

/**
 * Closes a youth person's request (mongo document).
 * The requestId is removed from the service provider's collection of open requests.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
module.exports.closeRequest = (req, res) => {
  Request.findOneAndUpdate( // Update the request
    { _id: req.body.requestId },
    { $set: { closedAt: Date.now(), status: req.body.status } },
    { runValidators: true, new: true },
  ).exec()
    .then((request) => {
      // Remove request from service provider's open requests
      Service.findOneAndUpdate(
        { _id: request.service },
        { $pull: { openRequests: req.body.requestId } },
        { runValidators: true, new: true },
      );
    })
    .then(() => { res.status(201).end(); })
    .catch((err) => { errorHandler(res, err, 500); });
};
