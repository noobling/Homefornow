const mongoose = require('mongoose');

const Request = mongoose.model('Request');

module.exports.addRequest = (req, res) => {
  const request = new Request();

  // Gets 'short_term' or 'long_term' from end of req.path
  console.log('\n\nLength of stay: ' + req.params.lengthOfStay + '\n\n');
  console.log('\nFirst name: ' + req.body.fName + '\n');
  console.log('\nLast name: ' + req.body.lName + '\n');

  request.firstName = req.body.fName;
  request.lastName = req.body.lName;
  request.gender = req.body.gender;
  request.age = req.body.age;
  request.location = req.body.location;
  request.hasChild = req.body.child === 'yes';
  request.isLongTerm = req.params.lengthOfStay === 'long_term';

  console.log('\nChild: ' + request.hasChild + '\n');
  console.log('\nLocation: ' + req.body.location + '\n');


  request.save((err) => {
    if (err) {
      res.json({ message: err });
    } else {
      // res.redirect('/locations/'.concat(req.params.lengthOfStay));
      res.redirect('/locations/rand');
    }
  });
};
