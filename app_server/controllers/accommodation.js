const mongoose = require('mongoose');

const Accommodation = mongoose.model('Accommodation');

module.exports.addAccommodation = (req, res) => {
  const ages = {
    minAge: req.body.minAge,
    maxAge: req.body.maxAge,
  };

  const address = {
    suburb: req.body.suburb,
    postcode: req.body.postcode,
    state: req.body.state,
    coordinates: {
      type: 'Point',
      coordinates: [0, 0], // TODO: Add real coordinates
    },
  };

  const accommodation = new Accommodation();

  accommodation.name = req.body.name;
  accommodation.address = req.body.address;
  accommodation.phoneNumber = req.body.phoneNumber;
  accommodation.stayLength = req.body.stayLength;
  accommodation.website = req.params.website;

  accommodation.ageRange.push(ages);
  accommodation.address.push(address);

  accommodation.save((err) => {
    if (err) {
      console.log('[ERROR] AccommodationController: '.concat(err));
      res.status(400).json({ message: err });
    } else {
      res.redirect('/service/'.concat(req.body.name));
    }
  });
};
