/**
 * Renders the about page.
 * @param  {Object} req Express request object.
 * @param  {Object} res Express response object.
 */
module.exports.about = (req, res) => {
  res.render('about', { title: 'About' });
};

/**
 * Renders the service creation page.
 * @param  {Object} req Express request object.
 * @param  {Object} res Express response object.
 */
module.exports.addServiceCreation = (req, res) => {
  res.render('addServiceCreation', { title: 'Add Service' });
};
