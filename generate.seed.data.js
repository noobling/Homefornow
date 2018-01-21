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

const NUM_USERS = 5;
const seededUsers = [];
function seedUsers() {
  for (let i = 0; i < NUM_USERS; i += 1) {
    const user = new User();
    const seedUser = {
      name: faker.Internet.userName(),
      email: faker.Internet.email(),
      password: faker.Internet.userName(),
    };
    user.name = seedUser.name;
    user.email = seedUser.email;
    user.setPassword(seedUser.password);

    user.save((err) => {
      if (err) {
        console.log(`[ERROR] Seeding user: ${err}`);
      } else {
        console.log(`[SUCCESS] Seeded user: ${seedUser.name}`);
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
