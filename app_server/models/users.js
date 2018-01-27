const mongoose = require('mongoose');
const crypto = require('crypto');

/**
 * General schema for all users of the application that have accounts e.g.
 * service providers, admins, super_admin
 *
 * THIS SCHEMA IS NOT FOR THE HOMELESS-YOUTH, they are represented by requestSchema
 *
 * Role:
 *  service_provider: Can perform CRUD operations on their own service, can
 *                    view homeless youth who need a bed
 *  admin: Have full access to everything on the site and have CRUD operations on all services
 *  super_admin: Can perform CRUD operations on admin accounts and other super_admin accounts
 */
const userSchema = new mongoose.Schema({
  /*
  * Name is either:
  *  - a person's first and last name, or
  *  - the name of a service provider
  */
  name: {
    type: String,
    required: true,
  },
  // E-mail address
  email: {
    type: String,
    unique: true,
    required: true,
  },
  // Hash for password
  hash: {
    type: String,
    required: true,
  },
  // Salt for password
  salt: {
    type: String,
    required: true,
  },
  // The account holder's role: Service provider
  role: {
    type: String,
    default: 'service_provider',
    enum: ['service_provider', 'admin', 'super_admin'],
  },
  // The IDs of the service providers that this user is a member of
  service: {
    type: [String],
    required: false,
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
