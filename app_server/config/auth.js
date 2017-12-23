// config/auth.js

// expose our config directly to our application using module.exports
let callbackURL = 'http://localhost:3000/auth/facebook/callback';
if (process.env.NODE_ENV === 'production') {
  callbackURL = 'https://anglicare-sprint-week.herokuapp.com/auth/facebook/callback';
}

module.exports = {
  facebookAuth: {
    clientID: process.env.fb_clientid,
    clientSecret: process.env.fb_secret, // your App Secret
    callbackURL,
  },
};
