const mongoose = require('mongoose');

const Request = mongoose.model('Request');
const Service = mongoose.model('Service');

/**
 * Saves a youth person's request (mongo document) to the database.
 * Redirects to the bed vacancies page.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
module.exports.addRequest = (req, res) => {
  const request = new Request();

  request.youth = req.user.id;
  request.hasChild = req.body.child === 'yes';
  request.isLongTerm = req.params.lengthOfStay === 'long_term';

  request.save((err) => {
    if (err) {
      res.status(500).json({ message: err });
    } else {
      res.redirect('/locations/'.concat(req.params.lengthOfStay));
    }
  });
};

/**
 * Adds a youth person's phone number to their request (mongo document) and
 * adds that request to a service provider.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
module.exports.addPhoneToRequest = (req, res) => {
  if (req.session.requestId) {
    // Add phone number to request
    Request.findOneAndUpdate(
      { _id: req.session.requestId },
      {
        $set:
        {
          phoneNumber: req.body.number,
          email: req.body.email,
        },
      },
      { runValidators: true, new: true },
      (err) => {
        if (err) {
          console.log('[ERROR] RequestsController: '.concat(err));
          res.status(500).json({ message: 'Could not add phone number to request.' });
        }
      }
    );
    // Add request to service
    Service.findOneAndUpdate(
      { _id: req.body.serviceId },
      { $push: { requests: req.session.requestId } },
      { runValidators: true, new: true },
      (err) => {
        if (err) {
          console.log('[ERROR] RequestsController: '.concat(err));
          res.status(500).json({ message: 'Could not submit request to service provider.' });
        }
      }
    );
  } else {
    // TODO: Handle this case
    //    Tell the user to submit a new request?
    //    Use a 'token' system where the youth are provided a token to
    //    access the results of their request
    res.status(400).json({ message: 'Your session has expired. Please submit a new request.' });
  }
  res.status(201).end();
};
