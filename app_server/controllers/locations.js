const mongoose = require('mongoose');

const Service = mongoose.model('Service');

module.exports.shortTermList = (req, res) => {
  Service.find({}, (err, docs) => {
    if (err) {
      console.log(`[ERROR] LocationsController: ${err}`);
    }
    res.render('bedVacanciesList', {
      title: 'For Now',
      tagline: 'A place to stay',
      dlocations: docs,
      locations: [
        {
          name: 'Youngle Group',
          availability: true,
          number: 94572188,
        }, {
          name: 'Foyer House',
          availability: true,
          number: 94572188,
        }, {
          name: 'Mission Australia',
          availability: false,
          number: 94572188,
        },

      ],
    });
  });
};

module.exports.longTermList = (req, res) => {
  let services;
  Service.find({}, (err, docs) => {
    if (err) {
      console.log(`[ERROR] LocationsController: ${err}`);
    }
    services = docs;
  });

  res.render('bedVacanciesList', {
    title: 'For Future',
    tagline: 'A place to stay',
    dlocations: services,
    locations: [
      {
        name: 'Youngle Group',
        availability: true,
        number: 94572188,
      }, {
        name: 'Foyer House',
        availability: true,
        number: 94572188,
      }, {
        name: 'Mission Australia',
        availability: false,
        number: 94572188,
      },

    ],
  });
};

module.exports.showLocation = (req, res) => {
  const { name } = req.query;
  res.render('showLocation', {
    title: name,
    tagline: 'Bringing people together',
    location: {
      info: 'Located in East Perth',
      opening: '9am',
      closing: '5pm',
      facilities: [
        'Hot Drinks',
        'Wifi',
        'Personal Rooms',
        'Councilors',
      ],
      restrictions: [
        '10pm curfew',
        'No drugs',
        'No alcohol',
        'No medical issues',
      ],
    },
    map: {
      title: name,
      suburb: 'Crawley',
    },
    additionalInfo: 'Every day we support people nationwide by combatting homelessness, assisting disadvantaged families and children, addressing mental health issues, fighting substance dependencies, and much more. We’re generously supported by our funders, partners and tens of thousands of everyday Australians, who make the work of our tireless volunteers and staff possible.',
  });
};
