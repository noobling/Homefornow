var mongoose = require('mongoose');
var crypto = require('crypto');

/**
 * General schema for all users of the application that have accounts e.g. service providers, admins
 *
 * THIS SCHEMA IS NOT FOR THE HOMELESS-YOUTH, they are represented by requestSchema
 *
 * Role:
 *  service_provider: Can perform CRUD operations on their own service, can
 *                    view homeless youth who need a bed
 *  admin: Have full access to everything on the site and have CRUD operations on all services
 */
var accountSchema = new mongoose.Schema({
    //First name
    firstName: {
        type: String,
        required: true,
    },
    //Last name
    lastName: {
        type: String,
        required: true
    },
    //E-mail address
    email: {
        type: String,
        unique: true,
        required: true
    },
    //Hash for password
    hash: {
        type: String,
        required: true
    },
    //Salt for password
    salt: {
        type: String,
        required: true
    },
    //The account holder's role: Service provider
    role: {
        type: String,
        default: 'service_provider',
        enum: ['service_provider', 'admin']
    },
    //The IDs of the service providers that this user is a member of
    accommodation: {
        type: [String],
        required: false
    }
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
