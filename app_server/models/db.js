const mongoose = require('mongoose');

// var dbURI = 'mongodb://localhost/Loc8r';
let dbURI = process.env.db_url;
if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGODB_URI;
}
// Using `mongoose.connect`...
mongoose.connect(dbURI, {
  useMongoClient: true,
});

/** **********************************************
 *                                               *
 *          mongoDB connection logging           *
 *                                               *
 *********************************************** */
mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on('error', (err) => {
  console.log(`Mongoose connection error ${err}`);
});

mongoose.connection.on('disconected', () => {
  console.log('Mongoose disconnected');
});


/** **********************************************
 *                                               *
 *     Gracefully closes mongoDB connection      *
 *                                               *
 *********************************************** */
function gracefulShutdown(msg, callback) {
  console.log(`Mongoose disconnected through ${msg}`);
  callback();
}

process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon shutdown', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});

process.on('SIGINT', () => {
  gracefulShutdown('app shutdown', () => {
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  gracefulShutdown('heroku app shutdown', () => {
    process.exit(0);
  });
});

require('./users');
require('./requests');
require('./services');
