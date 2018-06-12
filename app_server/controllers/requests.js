const mongoose = require('mongoose');

const Request = mongoose.model('Request');
const Service = mongoose.model('Service');
const User = mongoose.model('User');

const not = require('./communications.js');

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

module.exports.addRequest = (req, res) => {
  const request = new Request();

  request.firstName = req.body.fName;
  request.lastName = req.body.lName;
  request.gender = req.body.gender;
  request.dob = req.body.dob;
  request.hasChild = req.body.child === 'yes';
  request.isLongTerm = req.params.lengthOfStay === 'long_term';

  request.save((err, doc) => {
    if (err) {
      res.status(500).json({ message: err });
    } else {
      req.session.requestId = doc.id;
      req.session.coordinates = [req.body.long, req.body.lat];
      res.redirect(307, '/locations/'.concat(req.params.lengthOfStay));
    }
  });
};

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
        } else {
          console.log(req.body);
        }
      },
    );
    User.findOne(
      { service: req.body.serviceId },
      'email',
    ).exec().then((servicedata) => {
      const serviceEmail = servicedata.email;
      Service.findById(
        req.body.serviceId,
        'phoneNumber name',
      ).exec().then((service) => {
        let serviceNum = service.phoneNumber;
        const serviceName = service.name;
        // Add request to service
        Service.findOneAndUpdate(
          { _id: req.body.serviceId },
          { $push: { openRequests: req.session.requestId } },
          { runValidators: true, new: true },
          (err) => {
            if (err) {
              console.log('[ERROR] RequestsController: '.concat(err));
              res.status(500).json({ message: 'Could not submit request to service provider.' });
            } else {
              // Notification to young person
              let userEmail = req.body.email;
              let userNum = req.body.number;
              userNum = userNum.replace(/\s/g, '');
              const { userName } = req.body;
              const num = userNum.substring(0, 2);
              if (num === '04' ) {
                userNum = '61'.concat(userNum.substring(1, userNum.length));
              }
              else {
                userNum = undefined;
              }

              if (userEmail == null) {
                userEmail = undefined;
              }

              const YPmessage = `Thank you for applying to ${serviceName}. Your request has been received. We will get back to you shortly`;
              const YPsubject = `Request to ${serviceName} has been received`;

              not.notification(userNum, userEmail, YPmessage, YPsubject, res);

              // Notification to service
              serviceNum = serviceNum.replace(/\s/g, '');
              if (num === '04') {
                serviceNum = '61'.concat(serviceNum.substring(1, serviceNum.length));
              }
              else {
                serviceNum = undefined;
              }
              if (userEmail == null) {
                userEmail = undefined;
              }

              const servMessage = `A request to ${serviceName} has been recieved from ${userName}`;
              const servSubject = `Request from ${userName} has been recieved`;

              not.notification(serviceNum, serviceEmail, servMessage, servSubject, res);
            }
          },
        );
      });
    });
  } else {
    // TODO: Handle this case
    //    Tell the user to submit a new request?
    //    Use a 'token' system where the youth are provided a token to
    //    access the results of their request
    res.status(400).json({ message: 'Your session has expired. Please submit a new request.' });
  }
  res.status(201).end();
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
