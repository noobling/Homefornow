const mongoose = require('mongoose');

const Request = mongoose.model('Request');
const Accommodation = mongoose.model('Accommodation');

module.exports.addRequest = (req, res) => {
  const request = new Request();

  request.firstName = req.body.fName;
  request.lastName = req.body.lName;
  request.gender = req.body.gender;
  request.age = req.body.age;
  request.location = req.body.location;
  request.hasChild = req.body.child === 'yes';
  request.isLongTerm = req.params.lengthOfStay === 'long_term';

  request.save((err, product) => {
    if (err) {
      res.json({ message: err });
    } else {
      req.session.requestId = product.id;
      res.redirect('/locations/'.concat(req.params.lengthOfStay));
    }
  });
};

module.exports.addPhoneToRequest = (req, res) => {
  if (req.session.requestId) {
    // Add phone number to request
    Request.findOneAndUpdate(
      { _id: req.session.requestId },
      { $set:
        {
          phoneNumber: req.body.number,
          email: req.body.email,
        },
      },
      { runValidators: true, new: true },
      (err) => {
        if (err) {
          console.log(err);
          res.status(400).json({ error: 'Could not add phone number to request.' });
        }
      },
    );
    // Add request to accommodation
    Accommodation.findOneAndUpdate(
      { _id: req.body.accommodationId },
      { $push: { requests: req.session.requestId } },
      { runValidators: true, new: true },
      (err) => {
        if (err) {
          console.log(err);
          res.status(400).json({ error: 'Could not submit request to service provider.' });
        }
      },
    );
  } else {
    // TODO: Handle this case
    //    Tell the user to submit a new request?
    //    Use a 'token' system where the youth are provided a token to
    //    access the results of their request
    res.status(400).json({ error: 'Your session has expired. Please submit a new request.' });
  }
  res.status(201).end();
};
