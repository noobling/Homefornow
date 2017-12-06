var mongoose = require( 'mongoose' );
var gracefulShutdown
//var dbURI = 'mongodb://localhost/Loc8r';
var dbURI = 'mongodb://heroku_l5kd34wt:5mvcbsjev5o2nrngn95oe20um2@ds133136.mlab.com:33136/heroku_l5kd34wt';
if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGODB_URI;
}
// Using `mongoose.connect`...
var promise = mongoose.connect(dbURI, {
  useMongoClient: true,
});

promise.then(function(db) {
  /* Use `db`, for instance `db.model()`
});
// Or, if you already have a connection
connection.openUri('mongodb://localhost/myapp', { /* options */ });

/************************************************
*                                               *
*          mongoDB connection logging           *
*                                               *
************************************************/
mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error ' + err);
});

mongoose.connection.on('disconected', function () {
  console.log('Mongoose disconnected');
});


/************************************************
*                                               *
*     Gracefully closes mongoDB connection      *
*                                               *
************************************************/
gracefulShutdown = function(msg, callback) {
  console.log('Mongoose disconnected through ' + msg);
  callback();
};

process.once('SIGUSR2', function() {
  gracefulShutdown('nodemon shutdown', function() {
    process.kill(process.pid, 'SIGUSR2');
  })
});

process.on('SIGINT', function() {
  gracefulShutdown('app shutdown', function() {
    process.exit(0);
  })
});

process.on('SIGTERM', function() {
  gracefulShutdown('heroku app shutdown', function() {
    process.exit(0);
  })
});

require('./locations');
require('./users');