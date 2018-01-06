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
const accountSchema = new mongoose.Schema({
  // Is this a shared account for members of a service provider
  isSharedAccount: {
    type: Boolean,
    default: false,
    required: true,
  },
  // Name of service provider
  accommodationName: {
    type: String,
    required: this.isSharedAccount,
  },
  // First name
  firstName: {
    type: String,
    required: !this.isSharedAccount,
  },
  // Last name
  lastName: {
    type: String,
    required: !this.isSharedAccount,
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
  accommodation: {
    type: [String],
    required: false,
  },
  // facebook: {
  //     id: String,
  //     token: String,
  //     email: String,
  //     name: String,
  // },
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
