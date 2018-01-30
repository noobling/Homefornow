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
  const fileName = 'seeded_users.json'
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
 * SEED THE USERS
 */
const USER_ROLE = 'youth';
const NUM_USERS = 2;
const GENDER = ['Male', 'Female', 'Other'];

const seededUsers = [];
function seedUsers() {
  for (let i = 0; i < NUM_USERS; i += 1) {
    const year = Math.floor(2003 - (Math.random() * 10)); // 15 to 25 y.o. as of 2018
    const month = Math.floor((Math.random() * 12) + 1);
    const day = Math.floor((Math.random() * 30) + 1); // assume 30 days in month

    // console.log('DOB: ' + day + '-' + month + '-' + year);

    const user = new User();

    const seedUser = {
      firstName: faker.Name.firstName(),
      lastName: faker.Name.lastName(),
      email: faker.Internet.email(),
      phoneNumber: faker.PhoneNumber.phoneNumberFormat(0),
      dob: new Date().setFullYear(year, month, day),
      gender: GENDER[Math.floor(Math.random() * GENDER.length)],
      hasDisability: Math.random() < 0.5,
      password: faker.Internet.userName(),
      role: USER_ROLE
    };

    user.firstName = seedUser.firstName;
    user.lastName = seedUser.lastName;
    user.email = seedUser.email;
    user.phoneNumber = seedUser.phoneNumber;
    user.dob = seedUser.dob;
    user.gender = seedUser.gender;
    user.hasDisability = seedUser.hasDisability;
    user.setPassword(seedUser.password);
    user.role = seedUser.role;

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
