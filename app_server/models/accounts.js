var mongoose = require('mongoose');
var crypto = require('crypto');

/**
 * General schema for all users of the application that have accounts e.g. service providers, admins
 *
 * THIS SCHEMA IS NOT FOR THE HOMELESS-YOUTH, they are represented by requestSchema
 *
 * Role:
 *  normal: Have their basic info saved in db but have no special previlages
 *  service_provider: Can perform CRUD operations on their own service, can
 *                    view homeless youth who need a bed
 *  admin: Have full access to everything on the site and have CRUD operations on all services
 */
var accountSchema = new mongoose.Schema({
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

accountSchema.methods.setPassword = function setPassword(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

accountSchema.methods.validPassword = function validPassword(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

mongoose.model('User', accountSchema);
