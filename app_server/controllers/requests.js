const mongoose = require('mongoose');

const Request = mongoose.model('Request');

module.exports.addRequest = (req, res) => {
  const request = new Request();

  request.firstName = req.body.fName;
  request.lastName = req.body.lName;
  request.gender = req.body.gender;
  request.age = req.body.age;
  request.location = req.body.location;
  request.hasChild = req.body.child === 'yes';
  request.isLongTerm = req.params.lengthOfStay === 'long_term';

  request.save((err) => {
    if (err) {
      res.json({ message: err });
    } else {
      // res.redirect('/locations/'.concat(req.params.lengthOfStay));
      res.redirect('/locations/rand');
    }
  });
};
