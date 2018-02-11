const mongoose = require('mongoose');
const passport = require('passport');

const User = mongoose.model('User');

// This builds a json response
// Generally you should call `return` after this
// function
function sendJSONresponse(res, status, content) {
  res.status(status);
  res.json(content);
}

module.exports.login = (req, res, next) => {
  const prevPage = req.header('Referer') || '/';
  passport.authenticate('local', (err, user) => {
    if (err) { return next(err); }
    if (!user) {
      return res.redirect(prevPage);
    }
    req.logIn(user, (err2) => {
      if (err2) { return next(err); }
      if (req.body.lengthOfStay) {
        return res.redirect(307, '/locations/'.concat(req.body.lengthOfStay)); // show vacancies
      }
      return res.redirect(prevPage);
    });
  })(req, res, next);
};

/**
 * Creates a new user of type role.
 * @param  {Object} req   Express request object.
 * @param  {Object} res   Express response object.
 * @param  {String} role  The role of the user: 'youth' or 'service_provider'.
 */
module.exports.register = (req, res, next) => {
  if (!req.body.fName
    || !req.body.lName
    || !req.body.email
    || !req.body.pwd
    || !req.body.day
    || !req.body.month
    || !req.body.year
    || !req.body.gender) {
    sendJSONresponse(res, 400, {
      message: 'All fields required.',
    });
    return;
  }

  // Default req.body.role to 'youth'
  if (!req.body.role) {
    req.body.role = 'youth';
  }

  // Check for a valid role
  if (!(req.body.role === 'youth' || req.body.role === 'service_provider')) {
    sendJSONresponse(res, 400, { message: 'Invalid role.' });
    return;
  }

  // If creating a service provider, check the user is an administrator
  if (req.body.role === 'service_provider' && (!req.user || req.user.role !== 'admin')) {
    sendJSONresponse(res, 401, { message: 'Only administrators can create service provider accounts.' });
    return;
  }

  const user = new User();

  user.role = req.body.role;
  user.name = req.body.fName.concat(' ').concat(req.body.lName);
  user.email = req.body.email;
  user.dob = new Date().setFullYear(req.body.year, req.body.month, req.body.day);
  user.gender = req.body.gender;

  if (req.body.role === 'youth') {
    user.hasDisability = req.body.dis === 'yes';
    user.hasChild = req.body.child === 'yes';
  }

  user.setPassword(req.body.pwd);

  user.save()
    .then((savedUser) => {
      req.login(savedUser, (err) => {
        if (err) {
          next(err);
          return;
        }
        if (req.body.lengthOfStay) {
          res.redirect(307, '/locations/'.concat(req.body.lengthOfStay)); // show vacancies
        } else {
          const prevPage = req.header('Referer') || '/';
          res.redirect(prevPage);
        }
      });
    })
    .catch((err) => {
      next(err);
    });
};
