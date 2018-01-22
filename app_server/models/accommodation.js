const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  // Suburb
  suburb: {
    type: String,
    required: true,
  },
  // Postcode
  postcode: {
    type: Number,
    required: true,
    min: 1,
  },
  // State
  state: {
    type: String,
    required: true,
  },
  // GeoJSON object for longitude and latitude. Longitude is listed first.
  coordinates: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
});

/* Schema for the open and close time on some day.
 * 24 hour format:
 *  5:00am -> 500
 *  12:00pm -> 1200
 *  3:00pm -> 1500
 *
 * Days where the accommodation is closed should have the open and close set to 0.
 */
const openCloseSchema = new mongoose.Schema({
  // Open time
  open: {
    type: Number,
    required: true,
  },
  // Close time
  close: {
    type: Number,
    required: true,
  },
});

// Opening hours of the accommodation provider
const hoursSchema = new mongoose.Schema({
  mon: {
    type: openCloseSchema,
    required: true,
  },
  tue: {
    type: openCloseSchema,
    required: true,
  },
  wed: {
    type: openCloseSchema,
    required: true,
  },
  thu: {
    type: openCloseSchema,
    required: true,
  },
  fri: {
    type: openCloseSchema,
    required: true,
  },
  sat: {
    type: openCloseSchema,
    required: true,
  },
  sun: {
    type: openCloseSchema,
    required: true,
  },
});

// Tag schema for the beds
const tagSchema = new mongoose.Schema({
  // Name of the tag
  name: {
    type: String,
    required: true,
  },
});

const bedSchema = new mongoose.Schema({
  // Beds avaialable for the gender
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Either'],
  },
  // Is the bed disability-friendly, add a description field for type of disability later?
  isDisability: {
    type: Boolean,
    required: false,
  },
  // Intended use of the bed
  bedType: {
    type: String,
    required: false,
    enum: ['Single', 'ParentChild', 'Couple', 'Family'],
  },
  // Is the bed occupied
  isOccupied: {
    type: Boolean,
    required: true,
  },
  // User creatable tags that describe the bed, as an array
  tags: {
    type: [tagSchema],
    required: false,
  },
});

// Age range for the accommodation
const ageSchema = new mongoose.Schema({
  minAge: {
    type: Number,
    required: true,
  },
  maxAge: {
    type: Number,
    required: true,
  },
});

const accommodationSchema = new mongoose.Schema({
  // Accommodation name
  name: {
    type: String,
    required: true,
  },
  // Accommodation address
  address: {
    type: addressSchema,
    required: true,
  },
  // Accommodation phone number
  phoneNumber: {
    type: String,
    required: true,
  },
  // Average length of stay for the user, in weeks
  stayLength: {
    type: Number,
    required: true,
  },
  // Accommodation age range for stay
  ageRange: {
    type: ageSchema,
    required: true,
  },
  // Tags that describe the accommodation's beds, as an array
  tags: {
    type: [tagSchema],
    required: false,
  },
  // Are any beds available
  available: {
    type: Boolean,
    default: false,
    required: true,
  },
  // Accommodation's bed details, as an array
  beds: [bedSchema],
  // Timestamp for last updated
  updated: {
    type: Date,
    default: Date.now,
    required: true,
  },
  // Website link to the accommodation (if they have any)
  website: {
    type: String,
    required: false,
  },
  img: {
    type: String,
    required: false,
  },
  // The requests submitted to the accommodation provider
  requests: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
  // Opening hours of the accommodation provider
  hours: {
    type: hoursSchema,
    required: false,
  },
  // Words that describe the accommodation's facilities, as an array. E.g. 'Showers'.
  facilities: {
    type: [String],
    required: false,
  },
  // Restrictions that the accommodation provider may impose, as an array. E.g. 'No drugs'.
  restrictions: {
    type: [String],
    required: false,
  },
  // Short sentence that describes the accommodation provider
  tagline: {
    type: String,
    required: false,
  },
  // Description of the accommodation provider.
  // Displayed on the bed vacancies list page.
  description: {
    type: String,
    required: false,
  },
  // Additional information that the accommodation provider may want to include.
  // Displayed on the accommodation provider's info page.
  additionalInfo: {
    type: String,
    required: false,
  },
});

mongoose.model('Accommodation', accommodationSchema);
