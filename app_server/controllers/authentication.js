const mongoose = require('mongoose');

const User = mongoose.model('User');
// This builds a json response
// Generally you should call `return` after this
// function
function sendJSONresponse(res, status, content) {
  res.status(status);
  res.json(content);
}

/**
 * Adds a new user to the database.
 * @param  {Object} req   Express request object.
 * @param  {Object} res   Express response object.
 */
module.exports.register = (req, res) => {
  if (!req.body.firstName
    || !req.body.lastName
    || !req.body.email
    || !req.body.password
    || !req.body.day
    || !req.body.month
    || !req.body.year
    || !req.body.gender
    || !req.body.role) {
    sendJSONresponse(res, 400, {
      message: 'All fields required',
    });
    return;
  }

  if (!(req.body.role === 'youth' || req.body.role === 'service_provider')) {
    sendJSONresponse(res, 400, {
      message: 'Invalid role',
    });
  }

  const user = new User();

  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  user.dob = new Date().setFullYear(req.body.year, req.body.month, req.body.day);
  user.gender = req.body.gender;
  user.role = req.body.role;

  if (req.body.role === 'youth') {
    user.hasDisability = req.body.hasDisability;
  }

  user.setPassword(req.body.password);

  user.save((err) => {
    if (err) {
      sendJSONresponse(res, 404, err);
    } else {
      sendJSONresponse(res, 200, { message: 'successs' });
    }
  });
}
