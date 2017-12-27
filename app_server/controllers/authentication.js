const passport = require('passport');
const mongoose = require('mongoose');

const User = mongoose.model('User');
// This builds a json response
// Generally you should call `return` after this
// function
function sendJSONresponse(res, status, content) {
  res.status(status);
  res.json(content);
}

module.exports.register = (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      message: 'All fields required',
    });
    return;
  }

  const user = new User();

  user.name = req.body.name;
  user.email = req.body.email;

  user.setPassword(req.body.password);

  user.save((err) => {
    if (err) {
      sendJSONresponse(res, 404, err);
    } else {
      sendJSONresponse(res, 200, { message: 'successs' });
    }
  });
};
