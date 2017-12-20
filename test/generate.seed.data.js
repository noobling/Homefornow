/**
 * SEEDS THE DATABASE AND WRITES TO FILE THE SEEDED DATA
 * 
 * Using the fancy new ES6 syntax
 * 
 * This file is run with `npm run seed`
 */
const faker = require('faker');
const fs = require('fs');
const path = require('path');
const server = require('../app');
let mongoose = require( 'mongoose' );
let User = mongoose.model('User');

/**
 * SEED THE USERS
 */
const NUM_USERS = 5;
let seededUsers = [];
for (let i = 0; i < NUM_USERS; i++) {
  let user = new User();
  let seedUser = {
    name: faker.Internet.userName(),
    email: faker.Internet.email(),
    password: faker.Internet.userName()
  };

  user.name = seedUser.name;
  user.email = seedUser.email;
  user.setPassword(seedUser.password);

  user.save(function(err) {
    if (err) { console.log('[ERROR] Seeding user: '+err)}
    else { console.log('[SUCCESS] Seeded user: '+ seedUser.name) };
  });

  seededUsers.push(seedUser);
}

writeUsersTofile(seededUsers);

function writeUsersTofile(users) {
  let fileName = 'seeded_users.json'
  fs.writeFile(
    path.join(__dirname, fileName),
    JSON.stringify(users, null, 2),
    (err) => {
      if (err) {
        console.log('[ERROR] writeUsersToFile: '+err);
        return false;
      } else {
        console.log(`[INFO] Wrote users to file /test/${fileName}`);
        return true;
      }
    }
  )
}

/**
 * DONE WITH THE DB CONNECTION TIME TO CLEAN UP
 * Commented out for now since closing connection does not
 * allow users to be saved to db
 */
//mongoose.connection.close()