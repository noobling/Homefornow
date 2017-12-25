const mongoose = require('mongoose');
const crypto = require('crypto');

/**
 * General schema for all users of the application e.g. service providers, homeless youth, admins
 *
 * Role:
 *  normal: Have their basic info saved in db but have no special previlages
 *  service_provider: Can perform CRUD operations on their own service, can
 *                    view homeless youth who need a bed
 *  admin: Have full access to everything on the site and have CRUD operations on all services
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  name: String,
  hash: String,
  salt: String,
  role: { type: String, default: 'normal' },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String,
  },
});

userSchema.methods.setPassword = function setPassword(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function validPassword(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

mongoose.model('User', userSchema);
