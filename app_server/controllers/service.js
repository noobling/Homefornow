var mongoose = require('mongoose');
var Service = mongoose.model('Service');


module.exports.service = function(req, res) {
    res.render('service', {title: 'YASS'});
}

module.exports.addService = function(req, res) {
    var availability, description, name;
    
    if (req.session.user === undefined) {
        res.json({"message": "no service was found, remember this request should only be made by authenticated users"});
    }
    
    name = req.session.user.name;
    
    description = req.body.description;
    if (description === undefined) {
        res.json({"message": "No description was provided please provide one"});;
    }

    availability = req.body.available ? true: false;
    console.log(req.body);
    var service = new Service();
    service.name = name;
    service.description = description;
    service.availability = availability;
    service.save(function(err) {
        if (err) {
          res.json({"message": err});
          return;
        } else {
          res.redirect('/locations/short_term');
          return;
        }
      });
    //res.json({"message": "WOAH this line of code shouldn't of been executed"});
}