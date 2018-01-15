/* GET about page */
module.exports.about = (req, res) => {
  res.render('about', { title: 'About' });
};
