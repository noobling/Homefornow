/**
 * SEEDS THE DATABASE WITH ACCOMMODATIONS
 *
 * This file is run with `node <filename>`
 */
// https://www.npmjs.com/package/Faker
const faker = require('Faker');
require('./app');
const mongoose = require('mongoose');

const Accommodation = mongoose.model('Accommodation');

const NUM_ACCOMM = 10;

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
  [115.9070, 31.8870],
  [115.8270, 31.9490],
  [115.8605, 31.9505],
  [115.8290, 31.7910],
  [115.8540, 31.9460],
  [115.8722, 31.934],
  [115.7661, 31.7450],
  [115.9340, 32.0170],
  [115.8965, 31.9766],
  [115.8120, 31.8980]];

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

function genOpeningHours() {
  const startHours = START_HOURS[Math.floor(Math.random() * START_HOURS.length)];
  const endHours = END_HOURS[Math.floor(Math.random() * END_HOURS.length)];
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

function seedAccomm() {
  for (let i = 0; i < NUM_ACCOMM; i += 1) {
    const randNum = Math.floor(Math.random() * SUBURBS.length);

    const address = {
      suburb: SUBURBS[randNum],
      postcode: POSTCODES[randNum],
      state: STATE,
      coordinates: {
        type: 'Point',
        coordinates: COORDS[randNum],
      },
    };

    const accomm = new Accommodation();

    accomm.name = faker.Company.companyName();
    accomm.address = address;
    accomm.phoneNumber = faker.PhoneNumber.phoneNumberFormat(0);
    accomm.stayLength = Math.floor((Math.random() * 10) + 1); // 1 to 10
    accomm.website = faker.Internet.domainName();
    accomm.available = Math.random() < 0.5;
    accomm.facilities = FACILITIES;
    accomm.restrictions = RESTRICTIONS;
    accomm.tagline = TAG_LINES[Math.floor(Math.random() * TAG_LINES.length)];
    accomm.description = faker.Lorem.sentences();
    accomm.additionalInfo = faker.Lorem.paragraph();
    accomm.openingHours = genOpeningHours();
    accomm.ageRange = {
      minAge: Math.floor((Math.random() * 5) + 14), // 14 to 17
      maxAge: Math.floor((Math.random() * 5) + 20), // 21 to 25
    };

    accomm.save((err, doc) => {
      if (err) {
        console.log(`[ERROR] Seeding accommodation: ${err}`);
      } else {
        console.log(`[SUCCESS] Seeded accommodation: ${doc.name}`);
      }
    });
  }
  return true;
}

seedAccomm();

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
