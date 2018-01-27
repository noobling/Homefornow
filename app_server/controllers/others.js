/**
 * Renders the about page.
 * @param  {Object} req Express request object.
 * @param  {Object} res Express response object.
 */
module.exports.about = (req, res) => {
  res.render('about', { title: 'About' });
};
