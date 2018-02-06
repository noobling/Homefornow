/**
 * SEEDS THE DATABASE AND WRITES TO FILE THE SEEDED DATA
 *
 * Using the fancy new ES6 syntax
 *
 * This file is run with `npm run seed`
 */
const faker = require('Faker');
const fs = require('fs');
const path = require('path');
require('./app');
const mongoose = require('mongoose');

const User = mongoose.model('User');

/**
 * HELPER FUNCTIONS
 */
function writeTofile(data) {
  const fileName = 'seeded_users.json';
  fs.writeFile(
    path.join(__dirname, fileName),
    JSON.stringify(data, null, 2),
    (err) => {
      if (err) {
        console.log(`[ERROR] writeUsersToFile: ${err}`);
        return false;
      }
      console.log(`[INFO] Wrote users to file /test/${fileName}`);
      return true;
    }
  );
}

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
 * SEED THE USERS
 */
const USER_ROLE = 'youth';
const NUM_USERS = 2;
const GENDER = User.schema.path('gender').enumValues;

const seededUsers = [];
function seedUsers() {
  for (let i = 0; i < NUM_USERS; i += 1) {
    const year = Math.floor(2003 - randInt(0, 10)); // 15 to 25 y.o. as of 2018
    const month = randInt(1, 12);
    const day = randInt(1, 30);

    const user = new User();

    const seedUser = {
      name: faker.Name.firstName().concat(' ').concat(faker.Name.lastName()),
      email: faker.Internet.email(),
      phoneNumber: faker.PhoneNumber.phoneNumberFormat(0),
      dob: new Date().setFullYear(year, month, day),
      gender: choose(GENDER),
      hasDisability: Math.random() < 0.5,
      role: USER_ROLE,
      password: faker.Internet.userName()
    };

    user.name = seedUser.name;
    user.email = seedUser.email;
    user.phoneNumber = seedUser.phoneNumber;
    user.dob = seedUser.dob;
    user.gender = seedUser.gender;
    user.hasDisability = seedUser.hasDisability;
    user.role = seedUser.role;
    user.setPassword(seedUser.password);

    user.save((err) => {
      if (err) {
        console.log(`[ERROR] Seeding user: ${err}`);
      } else {
        console.log(`[SUCCESS] Seeded user: ${seedUser.firstName} ${seedUser.lastName}`);
      }
    });

    seededUsers.push(seedUser);
  }
  return true;
}

seedUsers();
writeTofile(seededUsers);

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
