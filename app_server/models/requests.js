const mongoose = require('mongoose');

/**
 * Schema for youth people's requests for accommodation.
 * @type {mongoose.Schema}
 */
const requestSchema = new mongoose.Schema({
  // Youth's first name
  firstName: {
    type: String,
    required: true,
  },
  // Youth's last name
  lastName: {
    type: String,
    required: true,
  },
  // Gender
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other'],
  },
  // Age
  dob: {
    type: Date,
    required: true,
    default: Date.now,
  },
  // Phone Number
  phoneNumber: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  // Does the youth have a disability
  hasDisability: {
    type: Boolean,
    required: false,
  },
  // Child
  hasChild: {
    type: Boolean,
    required: true,
  },
  // True if requesting long term service, false otherwise
  isLongTerm: {
    type: Boolean,
    required: true,
  },
  // Date the request was opened
  openedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  // Date the request was closed
  closedAt: {
    type: Date,
    default: null,
    required: false,
  },
  note: {
    type: String,
    required: false,
    default: '',
  },
  // The status of the request
  // status: {
  //   type: String,
  //   required: true,
  //   enum: ['Unseen', 'Seen', 'Accepted', 'Rejected'],
  //   default: 'Unseen',
  // },
});

mongoose.model('Request', requestSchema);
