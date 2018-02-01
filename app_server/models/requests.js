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
  // Service provider where the youth person is requesting accommodation
  service: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  // Does the youth person have a child
  hasChild: {
    type: Boolean,
    default: false,
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
  // The status of the request
  status: {
    type: String,
    required: true,
    enum: ['Unseen', 'Seen', 'Accepted', 'Rejected'],
    default: 'Unseen',
  }
});

mongoose.model('Request', requestSchema);
