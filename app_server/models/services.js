const mongoose = require('mongoose');

/**
 * Schema for the address of a service provider.
 * @type {mongoose.Schema}
 */
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
    enum: ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'],
  },
  // GeoJSON object for longitude and latitude. Longitude is listed first.
  coordinates: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
});

/**
 * Schema for the time a service provider opens and closes on a particular day.
 *
 * 24 hour format:
 *  5:00am -> 500
 *  12:00pm -> 1200
 *  3:00pm -> 1500
 *
 * Set open and close to 0 if the service provider is closed.
 *
 * @type {mongoose.Schema}
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

/**
 * Schema for the opening hours of the service provider.
 * @type {mongoose.Schema}
 */
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

// /**
//  * Schema for the tags that are used to describe a service provider's beds.
//  * @type {mongoose.Schema}
//  */
// const tagSchema = new mongoose.Schema({
//   // Name of the tag
//   name: {
//     type: String,
//     required: true,
//   },
// });

/**
 * Schema for service provider beds.
 * @type {mongoose.Schema}
 */
const bedSchema = new mongoose.Schema({
  // Name of the bed
  name: {
    type: String,
    required: true,
    default: 'Bed',
  },
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
    required: true,
    enum: ['Single', 'ParentChild'],
  },
  // Is the bed occupied
  isOccupied: {
    type: String,
    required: true,
    enum: ['Unavailable', 'Pending', 'Available'],
    default: 'Available',
  },
});

/**
 * Schema for the age range that a service provider accommodates.
 * @type {mongoose.Schema}
 */
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

/**
 * Schema for the amenities that a service provides.
 * name is for the radio buttons,
 * label is the name on the amenities list,
 * icon is the name of the icon on material icons
 * @type {mongoose.Schema}
 */
const amenitiesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
});

const settingsSchema = new mongoose.Schema({
  allowTexts: {
    type: Boolean,
    default: true,
  },
});

/**
 * Schema for storing a service provider.
 * @type {mongoose.Schema}
 */
const serviceSchema = new mongoose.Schema({
  // Service privider's name
  name: {
    type: String,
    required: true,
  },
  // The type of service provider
  serviceType: {
    type: String,
    required: true,
    enum: ['crisis', 'transitional'],
  },
  // Which genders the service provider accommodates
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Either'],
    default: 'Either',
  },
  // Does the service provider accommodate disabled youth
  disability: {
    type: Boolean,
    required: true,
    default: false,
  },
  // Does the service provider accommodate parents with children
  child: {
    type: Boolean,
    required: true,
    default: false,
  },
  // Service provider's address
  address: {
    type: addressSchema,
    required: true,
  },
  // Age range for stay
  ageRange: {
    type: ageSchema,
    required: true,
  },
  // Average length of stay for the user, in months
  stayLength: {
    type: Number,
    required: true,
  },
  // Service provider's phone number
  phoneNumber: {
    type: String,
    required: true,
  },
  // Are any beds available
  available: {
    type: Boolean,
    default: false,
    required: true,
  },
  // Service provider's bed details, as an array
  beds: [bedSchema],
  // Timestamp for last updated
  updated: {
    type: Date,
    default: Date.now,
    required: true,
  },
  // Website link to the service provider (if they have any)
  website: {
    type: String,
    required: false,
  },
  // List of image references - the path to the image in Firebase Storage
  img: {
    type: [String],
    required: false,
  },
  // Accommodation logo - the path to the image in Firebase Storage
  logo: {
    type: String,
    required: false,
  },
  // The requests submitted to the service provider
  requests: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
  // Opening hours of the service provider
  hours: {
    type: hoursSchema,
    required: false,
  },
  // Description of the service provider.
  // Displayed on the bed vacancies list page.
  description: {
    type: String,
    required: false,
  },
  // Additional information that the service provider may want to include.
  // Displayed on the service provider's info page.
  about: {
    type: String,
    required: false,
  },
  // House Rules that the service provider may have.
  // Displayed on the service provider's info page.
  houseRules: {
    type: String,
    required: false,
  },
  // A URI that is used to identify pages/resources related to the service provider
  uri: {
    type: String,
    required: true,
    unique: true,
  },
  // The requests submitted to the service provider that are currently open
  openRequests: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
  amenities: {
    type: [amenitiesSchema],
    required: false,
  },
  thankyouMessage: {
    type: String,
    required: false,
  },
  settings: {
    type: settingsSchema,
  },
});

serviceSchema.methods.encodeURI = function encodeURI(name) {
  return name.toLowerCase().replace(/\s/g, '-').replace(/[^A-Za-z0-9_-]/g, ''); // TODO: Check for duplicates
};

serviceSchema.methods.isAvailable = function isAvailable(beds) {
  let av = false;
  beds.forEach((bed) => {
    if (bed.isOccupied === 'Available') {
      av = true;
    }
  });
  return av;
};

mongoose.model('Service', serviceSchema);
