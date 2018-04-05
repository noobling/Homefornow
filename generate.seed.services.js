/**
 * SEEDS THE DATABASE WITH SERVICE PROVIDERS
 *
 * Uses Faker: https://www.npmjs.com/package/Faker
 *
 * Run this script with `node <filename>`
 */

require('./app');
const mongoose = require('mongoose');
const faker = require('Faker');

const Service = mongoose.model('Service');

// Indicies of states, postcodes, suburbs and coords correspond
const STATE = 'WA';

const POSTCODES = [6062, 6008, 6000, 6065, 6003, 6050, 6027, 6107, 6100, 6017];

const SUBURBS = [
  'Morley',
  'Subiaco',
  'Perth',
  'Wangara',
  'Northbridge',
  'Mount Lawley',
  'Joondalup',
  'Cannington',
  'Victoria Park',
  'Osborne Park'];

const COORDS = [
  [115.9070, -31.8870],
  [115.8270, -31.9490],
  [115.8605, -31.9505],
  [115.8290, -31.7910],
  [115.8540, -31.9460],
  [115.8722, -31.934],
  [115.7661, -31.7450],
  [115.9340, -32.0170],
  [115.8965, -31.9766],
  [115.8120, -31.8980]];

const BED_TAGS = [
  'Power point',
  'Double bed',
  'Window',
  'Chest of drawers',
  'Lamp',
  'Private room'];

const BED_TAGS_COLOUR = [
  'Orange room',
  'Purple room',
  'Green room',
  'Yellow room',
  'Blue room'];

const TAG_LINES = [
  'Bringing people together',
  'A little bit of comfort',
  'Keeping people safe',
  'A community of youth',
  'Getting people back on track'];

const FACILITIES = [
  'Showers',
  'Toilets',
  'Stove',
  'Oven',
  'Power outlets',
  'Cupboards',
  'Hose',
  'Taps',
  'Baths',
  'Disability toilet',
  'Disability shower',
  'Hot Drinks',
  'Wifi',
  'Personal Rooms',
  'Councilors'];

const RESTRICTIONS = [
  'No smoking',
  'No drugs',
  'No alcohol',
  'Lights out by 12pm',
  'Showers less than 5 minutes'];

const START_HOURS = [
  500,
  600,
  700,
  800,
  900,
  1000,
  1100];

const END_HOURS = [
  1700,
  1800,
  1900,
  2000,
  2100];

const GENDER = Service.schema.path('gender').enumValues;
const BED_TYPE = Service.schema.path('beds.0.bedType').enumValues;
const SERVICE_TYPES = Service.schema.path('serviceType').enumValues;

/**
 * Returns a random integer between min and max. Includes min and max.
 * @param  {number} min Minimum random number possible.
 * @param  {number} max Maximum random number posisble.
 * @return {number}     Random number between min and max.
 */
function randInt(min, max) {
  const range = (max - min) + 1;
  return Math.floor(Math.random() * range) + min;
}

/**
 * Returns a random element from the specified array.
 * @param  {Array} arr The array to return an element from.
 * @return {*}     A random element from arr.
 */
function choose(arr) {
  return arr[randInt(0, arr.length - 1)];
}

/**
 * Returns a JSON object with random opening hours.
 * Matches the opening hours schema embedded in the Services schema.
 * @return {Object} Json object with random opening hours. Conforms to the hoursSchema.
 */
function genOpeningHours() {
  const startHours = choose(START_HOURS);
  const endHours = choose(END_HOURS);
  return {
    mon: {
      open: startHours,
      close: endHours,
    },
    tue: {
      open: startHours,
      close: endHours,
    },
    wed: {
      open: startHours,
      close: endHours,
    },
    thu: {
      open: startHours,
      close: endHours,
    },
    fri: {
      open: startHours,
      close: endHours,
    },
    sat: {
      open: 0,
      close: 0,
    },
    sun: {
      open: 0,
      close: 0,
    },
  };
}

/**
 * Takes a name conatining any characters and converts it into a string
 * containing letters, numbers, - and _.
 * @param  {String} name Name to encode.
 * @return {String}      The encoded URI.
 */
function encodeURI(name) {
  return name.toLowerCase().replace(/\s/g, '-').replace(/[^A-Za-z0-9_-]/g, ''); // TODO: Check for duplicates
}

/**
 * Returns an array of tags that describe a bed.
 * @param  {boolean} coloured Are the beds classified by colour.
 * @return {Array.<String>}   Tags that describe a bed.
 */
function getBedTags(coloured) {
  const tags = [];

  if (coloured) {
    tags.push(choose(BED_TAGS_COLOUR));
  }

  const numTags = randInt(0, BED_TAGS.length);
  BED_TAGS.sort(() => 0.5 - Math.random()); // shuffle array
  for (let i = 0; i < numTags; i += 1) {
    tags.push(BED_TAGS[i]);
  }
  return tags;
}

/**
 * Returns an array of JSON objects that represent a service provider's beds.
 * @param  {number}         min   Minimum number of beds to generate.
 * @param  {number}         max   Maximum number of beds to generate.
 * @return {Array.<Object>} An a array of service provider beds. Conforms to the bedSchema.
 */
function genBeds(min, max) {
  const beds = [];
  const coloured = Math.random() < 0.5; // Are the beds classified by colour
  const amount = randInt(min, max);
  for (let i = 0; i < amount; i += 1) {
    const bed = {
      gender: choose(GENDER),
      isDisability: Math.random() < 0.5,
      bedType: choose(BED_TYPE),
      isOccupied: Math.random() < 0.5,
      tags: getBedTags(coloured),
    };
    beds.push(bed);
  }
  return beds;
}

/**
 * Generates service providers with random 'Faker' information.
 * @param  {Number} numToGen Number of service providers to generate.
 */
function seedAccomm(numToGen) {
  for (let i = 0; i < numToGen; i += 1) {
    const randNum = randInt(0, SUBURBS.length);

    const address = {
      suburb: SUBURBS[randNum],
      postcode: POSTCODES[randNum],
      state: STATE,
      coordinates: {
        type: 'Point',
        coordinates: COORDS[randNum],
      },
    };

    const accomm = new Service();

    accomm.name = faker.Company.companyName();
    accomm.address = address;
    accomm.phoneNumber = faker.PhoneNumber.phoneNumberFormat(0);
    accomm.serviceType = choose(SERVICE_TYPES);
    accomm.gender = choose(GENDER);
    accomm.disability = Math.random() < 0.5;
    accomm.child = Math.random() < 0.5;
    accomm.stayLength = randInt(1, 10);
    accomm.website = faker.Internet.domainName();
    accomm.available = Math.random() < 0.5;
    accomm.facilities = FACILITIES;
    accomm.restrictions = RESTRICTIONS;
    accomm.tagline = choose(TAG_LINES);
    accomm.description = faker.Lorem.sentences();
    accomm.additionalInfo = faker.Lorem.paragraph();
    accomm.hours = genOpeningHours();
    accomm.ageRange = {
      minAge: randInt(14, 17),
      maxAge: randInt(21, 25),
    };
    accomm.uri = encodeURI(accomm.name);
    accomm.beds = genBeds(0, 50);

    accomm.save((err, doc) => {
      if (err) {
        console.log(`[ERROR] Seeding service provider: ${err}`);
      } else {
        console.log(`[SUCCESS] Seeded service provider: ${doc.name}`);
      }
    });
  }
  return true;
}

seedAccomm(10);

/**
 * DONE WITH THE DB CONNECTION TIME TO CLEAN UP
 *
 * Waits 6 seconds then closes connections because if not
 * the connection will close before the new users have been
 * saved to the database
 */
setTimeout(() => {
  mongoose.connection.close();
}, 6000);
