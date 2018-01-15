const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const configAuth = require('./auth');

const User = mongoose.model('User');

// used to serialize the user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});


passport.use(new LocalStrategy(
  {
    usernameField: 'email',
  },
  (username, password, done) => {
    User.findOne({ email: username }, (err, user) => {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, {
          message: 'Incorrect username.',
        });
      }
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect password.',
        });
      }
      return done(null, user);
    });
  },
));

// =========================================================================
// LOCAL SIGNUP ============================================================
// =========================================================================
/**
 * Commented out for now because we have a perfectly fine function for registering
 * in authentication controller but we may use this in future.
 */
// passport.use('local-signup', new LocalStrategy(
//   {
//     // by default, local strategy uses username and password, we will override with email
//     usernameField: 'email',
//     passwordField: 'password',
//     // allows us to pass in the req from our route (lets us check if a user is logged in or not)
//     passReqToCallback: true,
//   },
//   (req, email, password, done) => {
//     // asynchronous
//     process.nextTick(() => {
//       //  Whether we're signing up or connecting an account, we'll need
//       //  to know if the email address is in use.
//       User.findOne({ 'local.email': email }, (err, existingUser) => {
//         // if there are any errors, return the error
//         if (err) {
//           return done(err);
//         }

//         // check to see if there's already a user with that email
//         if (existingUser) {
//           return done(null, false, req.flash('error', 'That email is already taken.'));
//         }

//         const newUser = new User();

//         newUser.email = email;
//         newUser.setPassword(password);
//         newUser.name = req.params('name');

//         newUser.save((errU) => {
//           if (errU) {
//             console.log(`[ERROR] POST register: ${errU}`);
//           }

//           return done(null, newUser);
//         });

//         return 'this goes no where hehe';
//       });
//     });
//   }
// ));


// =========================================================================
// FACEBOOK ================================================================
// =========================================================================
passport.use(new FacebookStrategy(
  {
    // pull in our app id and secret from our auth.js file
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: ['id', 'displayName', 'photos', 'email', 'name'],
  },

  // facebook will send back the token and profile
  (token, refreshToken, profile, done) => {
    // asynchronous
    process.nextTick(() => {
      // find the user in the database based on their facebook id
      User.findOne({ 'facebook.id': profile.id }, (err, user) => {
        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err) {
          return done(err);
        }
        // if the user is found, then log them in
        if (user) {
          return done(null, user); // user found, return that user
        }
        // if there is no user found with that facebook id, create them
        const newUser = new User();
        // set all of the facebook information in our user model
        newUser.facebook.id = profile.id; // set the users facebook id
        newUser.facebook.token = token; // we will save the token that facebook provides to the user
        newUser.facebook.name = `${profile.name.givenName} ${profile.name.familyName}`; // look at the passport user profile to see how names are returned
        newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails
        // so we'll take the first save our user to the database
        newUser.save((sErr) => {
          if (sErr) {
            throw sErr;
          }
          // if successful, return the new user
          return done(null, newUser);
        });

        return done();
      });
    });
  },
));
