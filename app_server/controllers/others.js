/**
 * Renders the about page.
 * @param  {Object} req Express request object.
 * @param  {Object} res Express response object.
 */
module.exports.about = (req, res) => {
  res.render('about', { title: 'About' });
};

/**
 * Renders the contact page.
 * @param  {Object} req Express request object.
 * @param  {Object} res Express response object.
 */
module.exports.contact = (req, res) => {
  res.render('contact', { title: 'Contact' });
};

/**
 * Renders the T&C page.
 * @param  {Object} req Express request object.
 * @param  {Object} res Express response object.
 */
module.exports.terms_of_use = (req, res) => {
  res.render('termsOfUse', { title: 'Terms of Use' });
};
