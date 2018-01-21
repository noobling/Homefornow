const mongoose = require('mongoose');

// Primary user, person seeking accomodation
const serviceSchema = new mongoose.Schema({
  name: String,
  description: String,
  availability: Boolean,
});

mongoose.model('Service', serviceSchema);
