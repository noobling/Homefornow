var mongoose = require( 'mongoose' );
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

//Primary user, person seeking accomodation
var userSchema = new mongoose.Schema({
  //email of user
  email: {
    type: String,
    unique: true
  },
  //name of user
  name: String,
  //hash of their password
  hash: String,
  //salt to the hash for the password
  salt: String,
  //If user signs in using Facebook
  facebook : {
    id: String,
    token: String,
    email: String,
    name: String,
  }
});

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    exp: parseInt(expiry.getTime() / 1000),
  }, 'secret'); // In real app the secret should be a long random string kept in environment variables
};

mongoose.model('User', userSchema);
