const mongoose = require('mongoose');

/**
 * Schema for youth people's requests for accommodation.
 * @type {mongoose.Schema}
 */
const requestSchema = new mongoose.Schema({
  // Youth person that made the request
  youth: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
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
  // Date the request was created
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  // Date the request was satisfied
  satisfiedAt: {
    type: Date,
    default: null,
    required: false,
  },
  // Has a service provider satisfied the request
  isSatisfied: {
    type: Boolean,
    default: false,
    required: true,
  },
  // ID of the service provider that satisfied the request
  satisfiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    required: false,
  },
});

mongoose.model('Request', requestSchema);
